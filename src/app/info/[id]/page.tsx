import Link from "next/link";
import localData from "../../../../public/data/local-info.json";

interface InfoItem {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

// 1. Cloudflare Pages 정적 내보내기(output: "export")용 미리 빌드할 ID 목록들 정의
export async function generateStaticParams() {
  const events = localData.events.map((event) => ({ id: event.id }));
  const benefits = localData.benefits.map((benefit) => ({ id: benefit.id }));
  return [...events, ...benefits];
}

// 2. Next.js 동적 페이지 컴포넌트
export default async function InfoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // JSON 데이터에서 ID가 일치하는 항목 찾기
  let item: InfoItem | undefined = localData.events.find((e) => e.id === id);
  if (!item) {
    item = localData.benefits.find((b) => b.id === id);
  }

  // 항목을 찾을 수 없는 경우 예외 처리
  if (!item) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] text-[#4A3E3D] font-sans antialiased flex flex-col items-center justify-center p-6 text-center">
        <span className="text-6xl mb-4">🕵️‍♂️</span>
        <h1 className="text-2xl font-bold text-[#2F2524] mb-2">정보를 찾을 수 없습니다</h1>
        <p className="text-[#8A7978] mb-6">존재하지 않거나 이미 삭제된 혜택/행사 정보입니다.</p>
        <Link href="/" className="px-6 py-3 bg-[#FF7E67] text-white font-bold rounded-2xl shadow-lg shadow-[#FF7E67]/20 hover:bg-[#ff6950] transition-all">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const isEvent = item.category === "행사";

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#4A3E3D] font-sans antialiased">
      {/* 상단 미니 헤더 */}
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F5EBE1] px-4 py-4 sm:px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-[#A35C4E] hover:text-[#FF7E67] transition-colors">
            <span>&larr;</span> 목록으로 돌아가기
          </Link>
          <span className="text-xs text-[#8A7978] bg-[#FAF1E6] px-3 py-1 rounded-full border border-[#EDE0D4] font-medium">
            {item.category} 정보
          </span>
        </div>
      </header>

      {/* 본문 공간 */}
      <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        <article className="bg-white rounded-3xl border border-[#F5EBE1] p-6 sm:p-10 shadow-sm space-y-8">
          
          {/* 타이틀 영역 */}
          <div className="space-y-4">
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
              isEvent ? "bg-[#FFF0EB] text-[#FF7E67] border border-[#FFD3B6]/50" : "bg-[#E8F2E8] text-[#5F8D4E] border border-[#D4E2D4]/50"
            }`}>
              {item.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2F2524] leading-snug">
              {item.title}
            </h1>
          </div>

          <hr className="border-[#FAF3EC]" />

          {/* 핵심 정보 테이블 구조 */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#F5EBE1] space-y-4">
            <h3 className="text-xs font-extrabold text-[#8A7978] tracking-widest uppercase mb-2">📋 핵심 요약 안내</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm">
              <span className="font-bold text-[#6E5D5C] sm:col-span-1">📅 {isEvent ? "행사 기간" : "신청 기간"}</span>
              <span className="text-[#2F2524] sm:col-span-3">
                {isEvent ? `${item.startDate} ~ ${item.endDate}` : "상시 신청 가능 (데이터 업데이트 기준)"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm pt-2 border-t border-[#F5EBE1]/50">
              <span className="font-bold text-[#6E5D5C] sm:col-span-1">📍 {isEvent ? "행사 장소" : "신청 접수처"}</span>
              <span className="text-[#2F2524] sm:col-span-3">{item.location}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm pt-2 border-t border-[#F5EBE1]/50">
              <span className="font-bold text-[#6E5D5C] sm:col-span-1">👥 지원 대상</span>
              <span className="text-[#2F2524] sm:col-span-3">{item.target}</span>
            </div>
          </div>

          {/* 상세 설명 전문 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#2F2524]">📝 상세 내용</h3>
            <p className="text-base text-[#6E5D5C] leading-relaxed whitespace-pre-line">
              {item.summary}
              {"\n\n"}
              본 정보는 성남시청 및 경기도청에서 시민들의 편의를 제공하기 위해 공고한 유익한 지역 혜택 및 행사 정보입니다. 상세 자격 요건이나 신청 방법이 수시로 변경될 수 있으니, 아래 공식 사이트 버튼을 눌러 정확한 원본 소식을 교차 확인하시는 것을 적극 추천합니다.
            </p>
          </div>

          <hr className="border-[#FAF3EC]" />

          {/* 이동 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 text-center font-bold text-white py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 ${
                isEvent ? "bg-[#FF7E67] hover:bg-[#ff6950] shadow-[#FF7E67]/20" : "bg-[#5F8D4E] hover:bg-[#527b43] shadow-[#5F8D4E]/20"
              }`}
            >
              공식 홈페이지 바로가기 &rarr;
            </a>
            
            <Link 
              href="/"
              className="sm:w-1/3 text-center font-bold bg-[#FAF1E6] hover:bg-[#EDE0D4] text-[#A35C4E] py-4 px-6 rounded-2xl transition-all duration-200"
            >
              목록으로
            </Link>
          </div>

        </article>
      </main>

      {/* 푸터 */}
      <footer className="bg-[#FAF3EC] border-t border-[#F5EBE1] mt-20 py-12 px-4 sm:px-8 text-center text-sm text-[#8A7978] space-y-3">
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold text-[#4A3E3D]">🏡 우리 동네 생활 정보 서비스</p>
          <p className="mt-1">
            본 서비스는 공공의 혜택 및 알림 목적으로 제작된 사이트로써, 성남 시민 여러분의 따뜻한 일상을 지원합니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
