const fs = require("fs");
const path = require("path");

const DATA_FILE_PATH = path.join(process.cwd(), "public/data/local-info.json");
const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

// 오늘 날짜 구하기 (YYYY-MM-DD)
function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

async function run() {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error("오류: 환경변수 GEMINI_API_KEY가 없습니다.");
    process.exit(1);
  }

  // 1. 최신 데이터 읽기
  if (!fs.existsSync(DATA_FILE_PATH)) {
    console.error("오류: local-info.json 파일이 없습니다.");
    process.exit(1);
  }

  let localData = { events: [], benefits: [] };
  try {
    localData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, "utf8"));
  } catch (e) {
    console.error("오류: local-info.json 파싱 실패:", e.message);
    process.exit(1);
  }

  const events = localData.events || [];
  const benefits = localData.benefits || [];

  if (events.length === 0 && benefits.length === 0) {
    console.error("오류: 작성할 최신 데이터가 존재하지 않습니다.");
    process.exit(1);
  }

  // 가장 마지막에 추가된 최신 데이터 1건 선택
  // events와 benefits의 마지막 요소를 비교하여 ID나 단순히 마지막 요소를 획득
  let latestItem = null;
  const lastEvent = events[events.length - 1];
  const lastBenefit = benefits[benefits.length - 1];

  if (lastEvent && lastBenefit) {
    // 임시 ID나 인덱스 등을 기반으로 혜택이 일반적으로 더 늦게 들어오는 경향을 반영
    // 혹은 ID가 숫자 형태이거나 단순히 더 뒤에 수집된 녀석을 기준으로 삼음
    const eventIdNum = parseInt(String(lastEvent.id).replace(/[^0-9]/g, "")) || 0;
    const benefitIdNum = parseInt(String(lastBenefit.id).replace(/[^0-9]/g, "")) || 0;
    latestItem = eventIdNum > benefitIdNum ? lastEvent : lastBenefit;
  } else {
    latestItem = lastEvent || lastBenefit;
  }

  if (!latestItem) {
    console.error("오류: 최신 데이터를 가져올 수 없습니다.");
    process.exit(1);
  }

  const targetTitle = latestItem.title || latestItem.name || "";
  console.log(`최신 데이터 확인: ${targetTitle}`);

  // 2. 이미 같은 타이틀로 글이 존재하지 않는지 체크 (src/content/posts 폴더 내 파일 전수조사)
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const postFiles = fs.readdirSync(POSTS_DIR);
  for (const file of postFiles) {
    if (file.endsWith(".md")) {
      const fileContent = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      // 파일 프론트매터 내 title에 대상 타이틀이 완전히 담겨 있는지 검사
      if (fileContent.includes(`title: "${targetTitle}"`) || fileContent.includes(`title: ${targetTitle}`)) {
        console.log("이미 작성된 글입니다");
        return;
      }
    }
  }

  // [2단계] Gemini AI로 블로그 글 생성
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보:
${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: (오늘 날짜 ${getTodayDateString()})
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

  let geminiOutput = "";
  try {
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!geminiRes.ok) {
      throw new Error(`Gemini API 통신 에러: ${geminiRes.status}`);
    }

    const geminiJson = await geminiRes.json();
    geminiOutput = geminiJson.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Gemini AI 블로그 생성 중 오류 발생:", error.message);
    process.exit(1);
  }

  // 마크다운 코드블록 (\`\`\`markdown 및 \`\`\`) 등 제거
  geminiOutput = geminiOutput.replace(/^```markdown\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();

  // [3단계] 파일명 및 콘텐츠 본문 분리
  // "FILENAME: YYYY-MM-DD-keyword" 라인 검출
  const filenameMatch = geminiOutput.match(/FILENAME:\s*([^\r\n]+)/i);
  let fileName = `${getTodayDateString()}-info.md`;

  if (filenameMatch) {
    const extractedName = filenameMatch[1].trim();
    fileName = extractedName.endsWith(".md") ? extractedName : `${extractedName}.md`;
    // FILENAME 줄을 마크다운 본문에서 깨끗하게 제거
    geminiOutput = geminiOutput.replace(/FILENAME:\s*[^\r\n]+/gi, "").trim();
  }

  // 최종 저장
  const finalFilePath = path.join(POSTS_DIR, fileName);
  try {
    fs.writeFileSync(finalFilePath, geminiOutput, "utf8");
    console.log(`블로그 글이 성공적으로 생성되어 저장되었습니다: ${fileName}`);
  } catch (writeError) {
    console.error("블로그 파일 저장 중 오류 발생:", writeError.message);
    process.exit(1);
  }
}

run();
