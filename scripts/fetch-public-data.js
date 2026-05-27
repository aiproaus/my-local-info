const fs = require("fs");
const path = require("path");

const DATA_FILE_PATH = path.join(process.cwd(), "public/data/local-info.json");

// 오늘 날짜 구하기 (YYYY-MM-DD)
function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

async function run() {
  const publicDataKey = process.env.PUBLIC_DATA_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!publicDataKey) {
    console.error("오류: 환경변수 PUBLIC_DATA_API_KEY가 없습니다.");
    process.exit(1);
  }
  if (!geminiKey) {
    console.error("오류: 환경변수 GEMINI_API_KEY가 없습니다.");
    process.exit(1);
  }

  // 1. 기존 데이터 읽기
  let localData = { events: [], benefits: [], lastUpdated: getTodayDateString() };
  if (fs.existsSync(DATA_FILE_PATH)) {
    try {
      localData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, "utf8"));
    } catch (e) {
      console.warn("기존 JSON 파일을 읽는 도중 오류가 발생해 기본 구조를 사용합니다.");
    }
  }

  // 기존 등록된 이름들 중복 체크를 위한 Set 만들기
  const existingNames = new Set();
  (localData.events || []).forEach(e => existingNames.add(e.title || e.name));
  (localData.benefits || []).forEach(b => existingNames.add(b.title || b.name));

  // [1단계] 공공데이터포털 API에서 데이터 가져오기
  const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON`;
  
  let services = [];
  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Infuser ${publicDataKey}`
      }
    });

    if (!res.ok) {
      throw new Error(`API 응답 오류: ${res.status}`);
    }

    const json = await res.json();
    services = json.data || [];
  } catch (error) {
    console.error("공공데이터 수집 중 오류 발생:", error.message);
    process.exit(1);
  }

  if (services.length === 0) {
    console.log("새로운 데이터가 없습니다");
    return;
  }

  // 필터링 적용을 위한 문자열 검사기 (객체의 모든 필드 값 검색)
  const matchesKeyword = (item, keyword) => {
    return JSON.stringify(item).includes(keyword);
  };

  // "성남" 포함 항목 필터링
  let filtered = services.filter(item => matchesKeyword(item, "성남"));

  // "성남"이 없으면 "경기" 포함 항목 필터링
  if (filtered.length === 0) {
    filtered = services.filter(item => matchesKeyword(item, "경기"));
  }

  // "경기"도 없으면 전체 사용
  if (filtered.length === 0) {
    filtered = services;
  }

  // [2단계] 기존 데이터와 중복되지 않은 첫 번째 항목 고르기
  let targetItem = null;
  for (const item of filtered) {
    // 공공데이터 명세 상 '서비스명' 혹은 'name'을 추출해 비교
    const itemName = item.서비스명 || item.serviceNm || item.name || "";
    if (itemName && !existingNames.has(itemName)) {
      targetItem = item;
      break;
    }
  }

  if (!targetItem) {
    console.log("새로운 데이터가 없습니다");
    return;
  }

  // [3단계] Gemini AI로 새 항목 1개만 가공
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜(기준일: ${getTodayDateString()}), endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

분석할 공공데이터:
${JSON.stringify(targetItem, null, 2)}`;

  let geminiResultJson = null;
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
    let text = geminiJson.candidates[0].content.parts[0].text.trim();

    // 마크다운 코드 블록 제거 (\`\`\`json 및 \`\`\`)
    text = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

    geminiResultJson = JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI 가공 중 오류 발생. 기존 데이터를 보존합니다.", error.message);
    process.exit(1);
  }

  // [4단계] 기존 데이터에 추가
  if (geminiResultJson) {
    // 호환성을 위해 title 필드도 같이 셋팅
    const newRecord = {
      id: String(geminiResultJson.id || Date.now()),
      title: geminiResultJson.name || geminiResultJson.title || "새로운 동네 소식",
      category: geminiResultJson.category === "행사" ? "행사" : "혜택",
      startDate: geminiResultJson.startDate || getTodayDateString(),
      endDate: geminiResultJson.endDate || "상시",
      location: geminiResultJson.location || "관내 행정복지센터",
      target: geminiResultJson.target || "성남시 거주 시민",
      summary: geminiResultJson.summary || "동네 소식을 확인해 보세요.",
      link: geminiResultJson.link || "#"
    };

    if (newRecord.category === "행사") {
      localData.events = localData.events || [];
      localData.events.push(newRecord);
    } else {
      localData.benefits = localData.benefits || [];
      localData.benefits.push(newRecord);
    }

    localData.lastUpdated = getTodayDateString();

    // 파일 저장
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(localData, null, 2), "utf8");
      console.log(`성공적으로 데이터를 추가했습니다: ${newRecord.title}`);
    } catch (saveError) {
      console.error("파일 저장 중 오류 발생:", saveError.message);
      process.exit(1);
    }
  }
}

run();
