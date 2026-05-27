import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
}

const postsDirectory = path.join(process.cwd(), "src/content/posts");

// YYYY-MM-DD 포맷 변환 도우미 함수
function formatDate(dateVal: any): string {
  if (dateVal instanceof Date) {
    return dateVal.toISOString().split("T")[0];
  }
  if (typeof dateVal === "string") {
    // 혹시 ISO string 등의 형태로 들어왔을 때 YYYY-MM-DD만 추출
    return dateVal.split("T")[0];
  }
  return String(dateVal || "");
}

export function getSortedPostsData(): Post[] {
  // 폴더가 없으면 빈 배열 리턴 (빌드 에러 방지)
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");

      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);
      const data = matterResult.data;

      return {
        slug,
        title: data.title || "",
        date: formatDate(data.date),
        summary: data.summary || "",
        category: data.category || "일반",
        tags: Array.isArray(data.tags) ? data.tags : [],
        content: matterResult.content,
      };
    });

  // 날짜 기준 최신순 정렬
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);
    const data = matterResult.data;

    return {
      slug,
      title: data.title || "",
      date: formatDate(data.date),
      summary: data.summary || "",
      category: data.category || "일반",
      tags: Array.isArray(data.tags) ? data.tags : [],
      content: matterResult.content,
    };
  } catch (error) {
    return null;
  }
}
