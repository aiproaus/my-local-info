import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostData, getSortedPostsData } from "../../../lib/posts";

// 1. Cloudflare Pages 정적 내보내기용 미리 빌드할 슬러그 목록 정의
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 2. Next.js 동적 블로그 상세 페이지 컴포넌트
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = getPostData(slug);

  // 글을 찾을 수 없는 경우 예외 처리
  if (!post) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] text-[#4A3E3D] font-sans antialiased flex flex-col items-center justify-center p-6 text-center">
        <span className="text-6xl mb-4">🕵️‍♂️</span>
        <h1 className="text-2xl font-bold text-[#2F2524] mb-2">글을 찾을 수 없습니다</h1>
        <p className="text-[#8A7978] mb-6">존재하지 않거나 이미 삭제된 블로그 포스트입니다.</p>
        <Link href="/blog" className="px-6 py-3 bg-[#FF7E67] text-white font-bold rounded-2xl shadow-lg shadow-[#FF7E67]/20 hover:bg-[#ff6950] transition-all">
          블로그 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#4A3E3D] font-sans antialiased">
      {/* 상단 미니 헤더 */}
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F5EBE1] px-4 py-4 sm:px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-xs font-bold text-[#A35C4E] hover:text-[#FF7E67] transition-colors">
            <span>&larr;</span> 블로그 목록으로 돌아가기
          </Link>
          <span className="text-xs text-[#8A7978] bg-[#FAF1E6] px-3 py-1 rounded-full border border-[#EDE0D4] font-medium">
            AI 블로그
          </span>
        </div>
      </header>

      {/* 본문 공간 */}
      <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        <article className="bg-white rounded-3xl border border-[#F5EBE1] p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* 타이틀 영역 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#FFF0EB] text-[#FF7E67] border border-[#FFD3B6]/50">
                {post.category}
              </span>
              <span className="text-xs text-[#8A7978] font-medium">
                📅 {post.date}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2F2524] leading-snug">
              {post.title}
            </h1>
          </div>

          <hr className="border-[#FAF3EC]" />

          {/* 마크다운 렌더링 영역 */}
          <div className="prose max-w-none text-[#6E5D5C] prose-amber prose-headings:text-[#2F2524] prose-a:text-[#FF7E67] prose-strong:text-[#2F2524] leading-relaxed whitespace-pre-wrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 태그 모음 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#FAF3EC]">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-semibold text-[#8A7978] bg-[#FAF3EC] px-3 py-1 rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <hr className="border-[#FAF3EC]" />

          {/* 수익화: 쿠팡 파트너스 배너 영역 샘플 */}
          <div className="bg-[#FFFDF9] rounded-2xl p-6 border-2 border-dashed border-[#FFD3B6]/70 text-center space-y-3">
            <span className="text-xs font-bold text-[#FF7E67] bg-[#FCECE7] px-2 py-0.5 rounded-full">RECOMMENDED PRODUCT</span>
            <h4 className="text-sm sm:text-base font-bold text-[#2F2524]">
              이 정보와 관련된 추천 동네 생필품 모아보기!
            </h4>
            <p className="text-xs text-[#8A7978]">
              아래 링크를 통해 구입 시 파트너스 활동의 일환으로 소정의 수수료가 창작자에게 큰 응원이 됩니다.
            </p>
            <a 
              href="#"
              className="inline-block bg-[#FF7E67] text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-[#ff6950] transition-colors"
            >
              쿠팡 파트너스 추천 상품 보러 가기 &rarr;
            </a>
          </div>

          {/* 목록 이동 버튼 */}
          <div className="text-center pt-4">
            <Link 
              href="/blog"
              className="inline-block text-xs font-bold bg-[#FAF1E6] hover:bg-[#EDE0D4] text-[#A35C4E] py-3.5 px-8 rounded-xl transition-all duration-200"
            >
              전체 블로그 목록으로 돌아가기
            </Link>
          </div>

        </article>
      </main>

      {/* 푸터 */}
      <footer className="bg-[#FAF3EC] border-t border-[#F5EBE1] mt-20 py-12 text-center text-sm text-[#8A7978] space-y-3">
        <div className="max-w-3xl mx-auto px-4">
          <p className="font-semibold text-[#4A3E3D]">🏡 우리 동네 생활 정보 서비스</p>
          <p className="mt-1 text-xs">본 포스팅은 Gemini AI가 수집된 정보를 바탕으로 자동 기술한 친절한 동네 소식입니다.</p>
        </div>
      </footer>
    </div>
  );
}
