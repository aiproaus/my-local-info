import Link from "next/link";
import { getSortedPostsData } from "../../lib/posts";

export default function BlogListPage() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#4A3E3D] font-sans antialiased">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F5EBE1] px-4 py-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF7E67] text-white text-xl font-bold shadow-md shadow-[#FF7E67]/20">
              🏡
            </span>
            <Link href="/" className="text-xl sm:text-2xl font-extrabold text-[#2F2524] tracking-tight">
              성남시 우리 동네 생활 정보
            </Link>
          </div>
          <nav className="flex items-center gap-6 text-sm font-bold text-[#A35C4E]">
            <Link href="/" className="hover:text-[#FF7E67] transition-colors">홈</Link>
            <Link href="/blog" className="text-[#FF7E67] border-b-2 border-[#FF7E67] pb-1">블로그</Link>
          </nav>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-b from-[#FAF1E6] to-[#FFFDF9] py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="inline-block px-3 py-1 text-xs font-bold bg-[#FCECE7] text-[#FF7E67] rounded-full">
            우리 동네 AI 돋보기 🔍
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2F2524]">
            AI가 들려주는 똑똑한 동네 이야기
          </h1>
          <p className="text-sm sm:text-base text-[#6E5D5C] max-w-lg mx-auto">
            Gemini AI가 공공데이터를 가공하여 유익한 살림 비법과 혜택 적용법을 매일 알기 쉽게 풀어 설명해 드립니다.
          </p>
        </div>
      </section>

      {/* 블로그 글 목록 */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#F5EBE1] p-8 space-y-4">
            <span className="text-6xl block">✍️</span>
            <h2 className="text-xl font-bold text-[#2F2524]">아직 등록된 블로그 글이 없습니다</h2>
            <p className="text-sm text-[#8A7978]">매일 아침 7시, AI 비서가 유익한 새 소식을 작성해 올릴 예정입니다.</p>
            <Link href="/" className="inline-block text-xs font-bold bg-[#FAF1E6] text-[#A35C4E] px-5 py-2.5 rounded-xl hover:bg-[#FF7E67] hover:text-white transition-all">
              메인 화면으로 가기
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article 
                key={post.slug}
                className="group bg-white rounded-3xl border border-[#F5EBE1] p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#FFD3B6] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="px-2.5 py-1 font-bold rounded-full bg-[#FFF0EB] text-[#FF7E67] border border-[#FFD3B6]/30">
                      {post.category}
                    </span>
                    <span className="text-[#8A7978] font-medium">📅 {post.date}</span>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#2F2524] group-hover:text-[#FF7E67] transition-colors duration-200 line-clamp-1">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-sm sm:text-base text-[#6E5D5C] leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#FAF3EC] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs text-[#8A7978] bg-[#FAF3EC] px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-xs sm:text-sm font-bold text-[#FF7E67] hover:text-[#ff6950] transition-colors flex items-center gap-1"
                  >
                    글 전체 읽기 <span>&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-[#FAF3EC] border-t border-[#F5EBE1] mt-20 py-12 text-center text-sm text-[#8A7978]">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-semibold text-[#4A3E3D]">🏡 우리 동네 생활 정보 서비스</p>
          <p className="mt-1 text-xs">AI 글 자동 생성 기능은 Gemini 1.5 Pro/Flash 기술을 활용하고 있습니다.</p>
        </div>
      </footer>
    </div>
  );
}
