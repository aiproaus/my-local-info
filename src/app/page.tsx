import Link from "next/link";
import localData from "../../public/data/local-info.json";


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

export default function Home() {
  const events: InfoItem[] = localData.events;
  const benefits: InfoItem[] = localData.benefits;
  const lastUpdated: string = localData.lastUpdated;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#4A3E3D] font-sans antialiased">
      {/* 1. 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F5EBE1] px-4 py-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* 귀여운 동네 아이콘 느낌의 원형 장식 */}
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF7E67] text-white text-xl font-bold shadow-md shadow-[#FF7E67]/20">
              🏡
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2F2524] tracking-tight">
                성남시 우리 동네 생활 정보
              </h1>
              <p className="text-xs text-[#8A7978]">따뜻하고 유익한 지역 소식을 매일 배달해 드려요</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold bg-[#FAF1E6] text-[#A35C4E] px-3 py-1.5 rounded-full border border-[#EDE0D4]">
            <span className="w-2 h-2 rounded-full bg-[#FF7E67] animate-pulse"></span>
            업데이트: {lastUpdated}
          </div>
        </div>
      </header>

      {/* 메인 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF1E6] to-[#FFFDF9] py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block px-3 py-1 text-xs font-bold bg-[#FCECE7] text-[#FF7E67] rounded-full mb-3">
            오늘의 성남 생활 정보 한눈에 보기
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2F2524] tracking-tight leading-tight">
            행복한 성남살이,<br className="sm:hidden" /> 행사와 혜택을 한눈에!
          </h2>
          <p className="mt-3 text-base text-[#6E5D5C] max-w-xl mx-auto">
            공공데이터포털에서 엄선한 이번 달의 알찬 축제 소식과 놓치면 아쉬운 든든한 지원금 정보를 챙겨가세요!
          </p>
        </div>
      </section>

      {/* 본문 콘텐츠 공간 */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-8 space-y-16">
        
        {/* 2. 이번 달 행사/축제 카드 목록 */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-[#FFD3B6]">
            <span className="text-2xl">🎉</span>
            <h3 className="text-2xl font-bold text-[#2F2524]">이번 달 행사 / 축제</h3>
            <span className="text-xs font-bold text-[#FF7E67] bg-[#FCECE7] px-2.5 py-0.5 rounded-full">
              {events.length}건
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <article 
                key={event.id}
                className="group flex flex-col justify-between bg-white rounded-3xl border border-[#F5EBE1] p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-[#FFD3B6]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#FFF0EB] text-[#FF7E67] border border-[#FFD3B6]/50">
                      {event.category}
                    </span>
                    <span className="text-xs text-[#8A7978] bg-[#FAF3EC] px-2.5 py-1 rounded-lg font-medium">
                      📅 {event.startDate} ~ {event.endDate}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-[#2F2524] group-hover:text-[#FF7E67] transition-colors duration-200 line-clamp-1">
                    {event.title}
                  </h4>
                  <p className="mt-3 text-sm text-[#6E5D5C] leading-relaxed line-clamp-3">
                    {event.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#FAF3EC] space-y-2">
                  <div className="flex items-center text-xs text-[#8A7978] gap-1.5">
                    <span className="text-sm">📍</span>
                    <span className="truncate"><strong>장소:</strong> {event.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-[#8A7978] gap-1.5">
                    <span className="text-sm">👥</span>
                    <span className="truncate"><strong>대상:</strong> {event.target}</span>
                  </div>
                  
                  <Link 
                    href={`/info/${event.id}`}
                    className="block text-center text-xs font-bold bg-[#FAF1E6] hover:bg-[#FF7E67] hover:text-white text-[#A35C4E] py-2.5 px-4 rounded-xl transition-all duration-200 mt-4"
                  >
                    자세히 보기 &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. 지원금/혜택 정보 카드 목록 */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-[#D4E2D4]">
            <span className="text-2xl">💰</span>
            <h3 className="text-2xl font-bold text-[#2F2524]">우리 동네 지원금 / 혜택</h3>
            <span className="text-xs font-bold text-[#5F8D4E] bg-[#E8F2E8] px-2.5 py-0.5 rounded-full">
              {benefits.length}건
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <article 
                key={benefit.id}
                className="group flex flex-col justify-between bg-white rounded-3xl border border-[#F5EBE1] p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-[#D4E2D4]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#E8F2E8] text-[#5F8D4E] border border-[#D4E2D4]/50">
                      {benefit.category}
                    </span>
                    <span className="text-xs text-[#8A7978] bg-[#FAF3EC] px-2.5 py-1 rounded-lg font-medium">
                      신청 상시
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-[#2F2524] group-hover:text-[#5F8D4E] transition-colors duration-200 line-clamp-1">
                    {benefit.title}
                  </h4>
                  <p className="mt-3 text-sm text-[#6E5D5C] leading-relaxed line-clamp-3">
                    {benefit.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#FAF3EC] space-y-2">
                  <div className="flex items-center text-xs text-[#8A7978] gap-1.5">
                    <span className="text-sm">📍</span>
                    <span className="truncate"><strong>접수처:</strong> {benefit.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-[#8A7978] gap-1.5">
                    <span className="text-sm">👥</span>
                    <span className="truncate"><strong>지원 대상:</strong> {benefit.target}</span>
                  </div>
                  
                  <Link 
                    href={`/info/${benefit.id}`}
                    className="block text-center text-xs font-bold bg-[#FAF1E6] hover:bg-[#5F8D4E] hover:text-white text-[#A35C4E] py-2.5 px-4 rounded-xl transition-all duration-200 mt-4"
                  >
                    지원금 알아보기 &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* 4. 하단 푸터 */}
      <footer className="bg-[#FAF3EC] border-t border-[#F5EBE1] mt-20 py-12 px-4 sm:px-8 text-center text-sm text-[#8A7978] space-y-3">
        <div className="max-w-6xl mx-auto">
          <p className="font-semibold text-[#4A3E3D]">🏡 우리 동네 생활 정보 서비스</p>
          <p className="mt-1">
            본 사이트의 정보는 공공데이터포털(data.go.kr)의 오픈 API를 활용하여 편리하게 가공 및 제공하고 있습니다.
          </p>
          <div className="flex justify-center items-center gap-3 pt-3 text-xs text-[#B5A5A4]">
            <span>마지막 정보 자동 업데이트: {lastUpdated}</span>
            <span>|</span>
            <span>데이터 제공: 행정안전부 및 지방자치단체</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

