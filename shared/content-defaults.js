/**
 * Default content for every page.
 *
 * Mirrors `content-schema.js`. Each top-level key corresponds to ONE row
 * in `content_entries` (key → JSONB value). Used:
 *   • as the seed when the DB is empty,
 *   • as the in-memory fallback when /api/content fails or DB is off,
 *   • as the starting point for the admin UI if a page has never been saved.
 *
 * Extracted verbatim from the original JSX (Nov 2024).
 */

import { videoPackages, shortformPackages } from "./pricing-packages.js";

export const defaults = {
  // ───────────────────────────────────────────────────────────── Home
  home: {
    seo: {
      title: "영상 편집·유튜브 제작 전문 회사",
      description:
        "유튜브 영상제작부터 숏폼·전문 편집·채널 운영까지. 700건 이상 제작한 유니버랩 미디어가 기획·촬영·편집·마케팅을 올인원으로 제공합니다.",
    },
    hero: {
      badge: "Video Editing Agency",
      headlineLine1: "UNIVERLAB",
      headlineLine2: "MEDIA.",
      subhead:
        "영상 편집 대행: 영상은 이미 찍어뒀는데, 편집이랑 디자인만 전문적으로 맡기고 싶을 때 선택하시면 되십니다.\n단순 편집이 아니라 성과에 초점을 맞춰서 진행해 드립니다.",
      ctaButton: "Start Project",
    },
    heroSlides: {
      items: [
        {
          eyebrow: "CASE · 의학",
          title: "182만 의학 유튜브는\n왜 유니버랩 미디어를 선택했을까요?",
          accent: "유니버랩 미디어",
          desc: "구독자 182만 채널이 선택한 이유.\n전문성과 결과로 증명합니다.",
          videoId: "_GZcy2ddoqI",
        },
        {
          eyebrow: "CASE · 교육",
          title: "교육 20년 역사의 비상교육은\n왜 유니버랩 미디어를 선택했을까요?",
          accent: "유니버랩 미디어",
          desc: "20년 전통의 교육 브랜드가\n믿고 맡긴 영상 파트너.",
          videoId: "_sEdSrF6VNc",
        },
        {
          eyebrow: "CASE · 엔터",
          title: "18년차 MBC 공채 출신 개그맨은\n왜 유니버랩 미디어와 함께할까요?",
          accent: "MBC 공채",
          desc: "업계 베테랑이 선택한 기획력.\n결과로 증명합니다.",
          videoId: "zeUPWa_KHMA",
        },
        {
          eyebrow: "RESULT",
          title: "유니버랩 미디어는 어떻게\n한 채널에서 147개 영상을 제작했을까요?",
          accent: "147개",
          desc: "조회수 520만 · 누적 조회수 2,000만.\n꾸준함이 만든 숫자입니다.",
          videoId: "PjwbITGTRY0",
        },
        {
          eyebrow: "WHY US",
          title: "유니버랩 미디어의 비결은\n무엇일까요?",
          accent: "비결",
          desc: "단순히 예쁜 영상이 아닌, 성과를 만드는 구조.\n지금 직접 확인하세요.",
          videoId: "XxyVUqmU6fo",
        },
      ],
      ctaPrimary: "무료 상담 받기",
      ctaSecondary: "제작 사례 보기",
    },
    scarcity: {
      viewingPrefix: "지금",
      viewingSuffix: "명이 함께 보고 있어요",
      baseViewers: 11,
      remainingLabel: "이번 달 잔여 제작",
      remainingCount: 2,
      remainingUnit: "건",
      note: "매월 20건 한정",
      button: "빠른 문의",
    },
    brandIntro: {
      eyebrow: "RESEARCH-DRIVEN",
      headline: "당신의 세상을\n연구합니다",
      accent: "연구",
      body: "유니버랩 미디어는 단순하게 예쁘기만 한 디자인이 아닌,\n철저히 소비자의 관점에서 '원하는 콘텐츠'를 연구합니다.",
      stats: [
        { value: "700+", label: "누적 프로젝트" },
        { value: "0건", label: "저작권 분쟁" },
        { value: "11만", label: "직접 운영 채널" },
        { value: "100%", label: "성과 미달 환불" },
      ],
    },
    cases: {
      eyebrow: "실제 제작 사례",
      headline: "유니버랩 미디어는\n잘 팔리는 영상만 취급합니다",
      accent: "잘 팔리는 영상",
      subhead: "썸네일을 누르면 실제 제작한 영상을 바로 확인하실 수 있습니다.",
      moreLabel: "제작 사례 더 보기",
      morePath: "/portfolio",
      items: [
        { videoId: "XxyVUqmU6fo", tag: "마케팅" },
        { videoId: "zeUPWa_KHMA", tag: "심리/뷰티" },
        { videoId: "PjwbITGTRY0", tag: "문화/교양" },
        { videoId: "_sEdSrF6VNc", tag: "교육" },
        { videoId: "wJ-C4raAzb4", tag: "뷰티" },
        { videoId: "KuODv3YfdYY", tag: "건강/다이어트" },
        { videoId: "_GZcy2ddoqI", tag: "건강" },
        { videoId: "2lqRHPw1IqI", tag: "유튜브" },
      ],
    },
    partners: {
      eyebrow: "Our UVL Group. PARTNERS",
      headline: "이미 수많은 기업·기관이\n유니버랩 미디어와 함께합니다",
      accent: "유니버랩 미디어",
      items: [
        { name: "삼성", src: "/partners/samsung.png" },
        { name: "OECD", src: "/partners/oecd.png" },
        { name: "서울대학교", src: "/partners/snu.png" },
        { name: "CJ제일제당", src: "/partners/cj.png" },
        { name: "KT wiz", src: "/partners/ktwiz.png" },
        { name: "중소벤처기업부", src: "/partners/smes.png" },
        { name: "강릉시", src: "/partners/gangneung.png" },
        { name: "힐스테이트", src: "/partners/hillstate.png" },
        { name: "대한상사중재원", src: "/partners/arbitration.png" },
        { name: "Global Peace Foundation", src: "/partners/globalpeace.png" },
        { name: "AQUAFIELD", src: "/partners/gate.png" },
      ],
    },
    testimonials: {
      eyebrow: "유니버랩 미디어가 자신감이 넘치는 이유?",
      headline: "실시간 이용 고객 분들의\n실제 후기입니다",
      accent: "실제 후기",
      items: [
        {
          name: "임**",
          rating: 5.0,
          brand: "",
          body: "제 채널의 컨셉에 맞는 콘텐츠를 쉽게 만들 수 있었어요. 이전에 다른 업체에서 작업한 경험이 있는데, 제가 원하는 스타일을 잘 이해하지 못했거든요. 그래서 답답한 마음에 찾았는데, 제가 원하는 스타일을 파악하고, 퀄리티 좋게 뽑아주셨습니다 :)",
        },
        {
          name: "김**",
          rating: 5.0,
          brand: "/partners/oecd.png",
          body: "상담을 받을 때부터 전문적인 느낌이 확 들었습니다. 제 의견을 충분히 반영할 수 있었고, 무엇보다도 성과가 없을 경우 100% 환불 보장이라는 점이 정말 마음에 들었어요. 자신감 있게 서비스를 제공하는 업체는 흔치 않은데...감격했네요.",
        },
        {
          name: "지**",
          rating: 5.0,
          brand: "/partners/samsung.png",
          body: "영상 제작 과정도 매우 체계적이었어요. 유니버랩 미디어는 고품질 콘텐츠를 위해 철저한 편집 프로세스를 거친다고 하더라고요. 제가 받은 영상은 퀄리티가 정말 뛰어났어요! 보는 사람들도 흥미를 느낄 수 있었던 것 같아요.",
        },
        {
          name: "박**",
          rating: 5.0,
          brand: "/partners/cj.png",
          body: "기획안부터 남달랐습니다. 그냥 '영상 만들어 드릴게요'가 아니라, 우리 브랜드가 어떤 메시지를 줘야 하는지를 먼저 고민해 주셨어요. 덕분에 조회수뿐 아니라 실제 문의까지 늘었습니다.",
        },
        {
          name: "최**",
          rating: 5.0,
          brand: "/partners/ktwiz.png",
          body: "수정 요청에도 빠르고 정확하게 반영해 주셔서 일정에 차질이 없었습니다. 무한 수정으로 지치는 경험이 많았는데, 집중 구간을 명확히 잡아주시니 결과물 완성도가 확실히 달랐어요.",
        },
        {
          name: "정**",
          rating: 5.0,
          brand: "/partners/gangneung.png",
          body: "공공기관 특성상 까다로운 요구가 많았는데도 끝까지 책임감 있게 진행해 주셨습니다. 사후 관리까지 챙겨주셔서 다음 프로젝트도 믿고 맡길 생각입니다.",
        },
      ],
    },
    finalCta: {
      eyebrow: "돈되는 유튜브,",
      headline: "그 비결을 알고 싶으신가요?",
      bullets: [
        "상세하고 정확하게 문의 폼을 작성해주셔야 정확한 상담이 가능합니다.",
        "문의 및 작업량이 많아 순차적으로 답변을 진행하고 있습니다.",
        "레퍼런스 채널들을 미리 준비해주세요.",
      ],
      closing: "유니버랩 미디어의 모든 연구 성과, 이제는 당신이 주인공이 될 차례입니다.",
      button: "전문 상담 받기",
    },
    marquee: {
      clients: [
        { name: "Samsung" },
        { name: "LG" },
        { name: "Hyundai" },
        { name: "SK" },
        { name: "Naver" },
        { name: "Kakao" },
        { name: "Coupang" },
        { name: "Woowa Bros" },
        { name: "Toss" },
        { name: "Krafton" },
      ],
    },
    secrets: {
      eyebrow: "Why Us",
      headline: "유니버랩 미디어의\n비결은 무엇일까요?",
      items: [
        {
          title: "잘팔리는 영상만 취급합니다",
          desc: "단순히 예쁜 영상이 아닌, 시청자의 행동을 유도하고 구매로 이어지는 '성과 중심'의 영상을 제작합니다.",
        },
        {
          title: "유니버랩 미디어와 함께합니다",
          desc: "11만, 3만, 1만 유튜브 채널을 직접 운영하며 얻은 노하우로 클라이언트의 성장을 함께 고민합니다.",
        },
        {
          title: "실제 후기입니다",
          desc: "소비자 중심 경영철칙을 바탕으로 수많은 클라이언트와 신뢰를 쌓아가고 있습니다.",
        },
      ],
    },
    growth: {
      eyebrow: "Growth Strategy",
      headline: "유튜브 성장만을\n추구합니다.",
      steps: [
        {
          step: "Step 1",
          title: "유튜브의 채널 자체를 직접 기획합니다.",
          desc: [
            { value: "11만, 3만, 1만 유튜브 채널을 직접 피드백하여 높은 성과 도출" },
            { value: "자기계발, 뷰티, 패션, 요리, 유튜브 등 다양한 카테고리 직접 운영" },
            { value: "최고의 퀄리티를 위한 시행착오를 현재에도 지속적으로 경험 중" },
          ],
        },
        {
          step: "Step 2",
          title: "유튜브 성장의 코어 영상 마다의 목적을 둡니다.",
          desc: [
            { value: "유튜브 성공의 핵심은 '영상의 목적' 설정" },
            { value: "시청자에게 도움이 되는 콘텐츠가 구독으로 연결" },
            { value: "영상의 목적을 기반으로 한 유니버랩 기획안으로 최적화된 방향 제시" },
          ],
        },
        {
          step: "Step 3",
          title: "논리적인 편집 프로세스.",
          desc: [
            { value: "단순히 눈에 즐거운 편집이 아닌, 프레임마다 명확한 기획 의도 반영" },
            { value: "컷 구성과 디자인 방향을 심리학적 요소 기반으로 판단" },
            { value: "트렌디한 트랜지션과 맞춤형 디자인으로 완성도 높은 결과 제공" },
          ],
        },
        {
          step: "Step 4",
          title: "영상을 완성했다고, '띡' 하고 끝내지 않습니다.",
          desc: [
            { value: "영상 완성 후 책임 없는 작업 종료가 대부분인 기존 편집 시스템" },
            { value: "이를 보완하기 위해 '사후 관리 시스템' 도입" },
            { value: "이전 영상의 문제를 복기하고 개선점을 연구하는 체계적 접근" },
          ],
        },
        {
          step: "Step 5",
          title: "쿼터제로 협업합니다.",
          desc: [
            { value: "유튜브는 양보다 '영상 하나의 완성도'가 더욱 중요시" },
            { value: "매출보다 사람을 남기는 것이 유니버랩 미디어 제 1원칙" },
            { value: "기존 고객 품질 유지를 위해 월 제한된 수량만 제작 진행" },
          ],
        },
      ],
    },
    safety: {
      headline: "2가지 안심제도를 운영합니다.",
      subhead: "돈을 지불하고 나면 불안해.. 의견이 잘 반영 안되던데...?",
      card1Title: "투명 프로세스 보증제",
      card1Body:
        '우리는 \'자동화된 투명 프로세스\'로 클라이언트의 "불안을 잠재우는 구조" 를 만듭니다.\n1 : 1 피드백 전용까지 시스템화를 구축하였습니다.',
      card2Title: "시안 확정 후 집중제",
      card2Body:
        '유니버랩은 "집중 구간"을 명확히 합니다.\n이를 통해 무한 수정 루프를 방지하고 품질을 최고 수준으로 높입니다.',
    },
    process: {
      eyebrow: "Workflow",
      headline: "작업 프로세스",
      steps: [
        { step: "01", title: "상담", desc: "조회수의 비결이 담긴 전문 상담을 진행합니다." },
        { step: "02", title: "전문 기획안 제작", desc: "구매자 맞춤 전문 기획안을 제공합니다." },
        { step: "03", title: "일정 조율", desc: "초안 영상 작업 일정을 조율합니다." },
        { step: "04", title: "촬영 진행", desc: "촬영을 원하시는 분에 한해 촬영을 진행합니다." },
        { step: "05", title: "디자인 착수 및 편집", desc: "자사 내에서 디자인, 편집 작업을 진행합니다." },
        { step: "06", title: "피드백 및 수정작업", desc: "검수 작업 및 수정작업을 진행합니다." },
        { step: "07", title: "완성", desc: "최종본을 전달하고 업로드를 진행합니다." },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      headline: "프리미엄 올인원 패키지",
      subhead: "명이 보고있어요! (매월 20건 한정)",
      videoSectionTitle: "영상 편집 패키지",
      shortformSectionTitle: "숏폼 패키지",
      staffLabel: "참여 인원:",
      periodLabel: "제작 기간:",
      videoPackages,
      shortformPackages,
    },
    faq: {
      eyebrow: "Q&A",
      headline: "자주 묻는 질문",
      items: [
        {
          q: "영상이 마음에 들지 않으면 어떡하나요?",
          a: "걱정하지 마세요! 작업이 진행된 3달간 아무런 유튜브 성과가 없을 시 100% 환불을 보장합니다.",
        },
        {
          q: "작업절차를 알고 싶어요",
          a: "유니버랩 미디어는 총 8개의 작업 절차가 있습니다.\n1. 전문 설문지 작성\n2. 상담\n3. 전문 기획안 제작\n4. 일정 조율\n5. 촬영 진행\n6. 디자인 착수 및 편집 진행\n7. 피드백 및 수정 작업\n8. 완성",
        },
        {
          q: "기한은 얼마나 걸리나요?",
          a: "원하시는 서비스에 따라 기간은 다르게 책정됩니다. 편집 영업일 기준 평균 7-10일 소요. 촬영 포함 영업일 기준 평균 20일 소요.\n상위에 기재되어 있는 기한은 평균적인 수치입니다.\n고객사의 피드백 속도에 따라 더 당겨지거나, 늘어날 수 있는 점 참고 부탁드립니다",
        },
        {
          q: "저작권은 어떻게 관리하시나요?",
          a: "영상의 경우 엄중한 저작권 관리가 필수입니다.\n이에 유니버랩 미디어는 300여종의 유료 폰트와 3800건이 넘는 이미지, 영상, 음원 등도 직접 계약하여 사용합니다.\n700건 이상의 프로젝트 중 저작권 문제 발생은 0건입니다.",
        },
        {
          q: "서비스 종류랑 범위는 어떻게 되나요?",
          a: "저희는 고객님이 원하는 깊이에 따라 크게 세 가지로 나눠서 도와드입니다.\n- 종합 운영 대행 (올인원/프리미엄 패키지): 이건 채널 기획부터 촬영, 편집, 그리고 채널 운영 전략까지 싹 다 맡기시는 서비스입니다.\n- 전문 숏폼 영상 제작: 요즘 대세인 틱톡, 인스타그램 릴스, 유튜브 쇼츠 같은 짧은 영상만 전문적으로 제작합니다.\n- 영상 편집 대행: 영상은 이미 찍어뒀는데, 편집이랑 디자인만 전문적으로 맡기고 싶을 때 선택하시면 되십니다.",
        },
        {
          q: "채널 성장이나 성과를 보장해 주시나요?",
          a: "솔직하게 말씀드리면, 유튜브 알고리즘은 변수가 많고 고객사별 성향이 다르기 때문에 '구독자 몇 명 달성!'이라고 수치로 보장해 드리긴 어렵습니다.\n하지만 저희의 강점은 '성과를 만드는 전략'에 있습니다. 단순히 예쁜 영상이 아니라, '시청자가 원하는 영상'과 '유튜브가 원하는 영상'이라는 두 가지 핵심에 집중해서 기획합니다. 이에 성장할 수밖에 없는 구조를 만들어 드리는 데 초점을 맞추고 있습니다.\n그리고 이렇게 기획 된 채널은 평균적으로 6개월 안에 큰 효과를 보십니다.",
        },
        {
          q: "영상 수정은 몇 번까지 가능하고, 추가 비용은 없나요?",
          a: "저희 프로세스에 피드백 및 수정 작업은 기본으로 들어가 있습니다.일반적으로 계약하실 때 수정 횟수(1~2회 정도)를 정하고 진행하며, 이 횟수 내에서는 추가 비용이 발생하지 않습니다.다만, 이미 편집이 거의 끝났는데 '처음 기획했던 내용과 완전히 다르게 바꿔주세요' 같은 대대적인 수정을 요청하시면, 추가 비용이 발생할 수 있으니 참고바랍니다.",
        },
        {
          q: "돈되는 유튜브, 그 비결을 알고 싶으신가요?",
          a: "상세하고 정확하게 문의 폼을 작성해주셔야 정확한 상담이 가능합니다.\n문의 및 작업량이 많아 순차적으로 답변을 진행하고 있습니다.\n레퍼런스 채널들을 미리 준비해주세요.\n유니버랩 미디어의 모든 연구 성과, 이제는 당신이 주인공이 될 차례입니다.",
        },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────── Company
  company: {
    seo: {
      title: "회사 소개",
      description:
        "유니버랩 미디어의 정체성, 팀 구성, 그리고 브랜드가 집착하는 가치를 소개합니다.",
    },
    hero: {
      eyebrow: "About Us",
      headline: "과하게 포장된\n말이 아닌,",
      subhead:
        "유니버랩 미디어는 유튜브 플랫폼의 분석과 콘텐츠 제작, 관리까지 각 분야별 세부적인 부분을 다룹니다.\n단순하게 시간을 녹여 낸 작업이 아닌, 항상 소비자의 시선을 생각해서 콘텐츠를 제작합니다.",
    },
    whyObsessed: {
      headline: "왜 그렇게 집착할까요?",
      subhead: "유니버랩 미디어의 핵심 가치",
      card1Title: "01. Authenticity",
      card1Strong: "우리는 거짓이 아닌 진짜 도움이 되는 콘텐츠를 만들고 싶습니다.",
      card1Body:
        "주변에서 말렸습니다. 시장에서 살아남을 수 없을 것이라고 했습니다. 하지만 우리는 '단순하게 사고하기'로 했습니다. 과장하지 않고 겸손하게 본질만 생각하기로 했습니다. 우리는 단순함이라는 무기를 가진, 본질과 기본에 충실한 팀입니다.",
      card2Title: "02. We are Young",
      card2Strong: "우리는 젊습니다.",
      card2Body:
        '우리가 생각하는 트렌드는 "돈의 흐름과 사람들의 심리를 파악하고 가장 우리의 것을 제작하는 것"입니다. 젊지만 수많은 경험으로 다져진 감각으로 브랜드 가치를 만드는 것, 그것이 유니버랩 미디어만의 차별점입니다.',
    },
    teamwork: {
      headline: "우리는 함께 언제나 도전합니다.",
      subhead:
        "1인 기업으로 시작했던 유니버랩 미디어이지만, 지금은 뜻을 함께하는 동료들이 있습니다.\n혼자의 힘으로는 모든 사람들을 만족시킬 수 없었지만, 팀원의 힘으로 광고주분들이 추구하는 가치를 전달할 수 있었습니다.",
    },
    team: {
      eyebrow: "Our Team",
      headline: "당신을 위한 최고의 팀",
      members: [
        {
          role: "콘텐츠 기획자",
          desc: "클라이언트의 요구를 뛰어넘는 최고의 기획을 목표로 합니다. 브랜드 특성과 트렌드에 맞는 마케팅 전략을 세워 새로운 소재를 기획합니다.",
        },
        {
          role: "콘텐츠 디자이너",
          desc: "색채 심리학과 논리적인 근거를 바탕으로 디자인을 진행합니다. 눈에 보기 예쁜 디자인이 아닌, 팔리는 디자인을 추구합니다.",
        },
        {
          role: "콘텐츠 마케터",
          desc: "다양한 마케팅 매체를 활용합니다. 목표에 따른 퍼널 구조를 계획 후 함께 의논하여 광고의 효율을 극대화합니다.",
        },
        {
          role: "수치 분석가",
          desc: "모든 마케팅 중 분석이 가장 중요합니다. 유니버랩 미디어는 분석에 큰 비중을 두어 철저히 분석하여 간단한 지표로 그립니다.",
        },
      ],
    },
    cta: {
      headline: "돈되는 유튜브,\n그 비결을 알고 싶으신가요?",
      subhead: "유니버랩 미디어의 모든 연구 성과, 이제는 당신이 주인공이 될 차례입니다.",
      button: "전문상담 받기",
    },
  },

  // ───────────────────────────────────────────────────────────── Service
  service: {
    seo: {
      title: "서비스 소개",
      description:
        "유니버랩 미디어의 콘텐츠 기획형 PDCA 프로세스와 4대 경영 철칙을 확인해 보세요.",
    },
    hero: {
      eyebrow: "Our Strategy",
      headlineLine1: "콘텐츠 기획형",
      headlineLine2: "PDCA",
      subhead:
        "영상 업계의 판도를 바꾸는 유니버랩 미디어의 전략\n우리는 모든 기술력을 귀사의 성과에만 집중합니다.",
    },
    failure: {
      eyebrow: "Problem",
      headline: "왜 지금까지 실패했을까요?",
      subhead: "귀사의 콘텐츠 마케팅이 실패한 이유를 알려드립니다.",
      reasons: [
        {
          title: "콘텐츠가 재미없습니다.",
          desc: "하고 싶은 말만 구구절절 하는 대부분의 콘텐츠들은 사람들이 원하지 않기 때문에 체류 시간이 떨어집니다.",
        },
        {
          title: "기획에 대해 1도 모르는 편집자",
          desc: "한 명의 영상 편집자가 영상을 편집하면 유튜브에 지식은 일체 없이 작업을 끝내기에 급합니다. 따라서 마케팅에 대한 전문성이 떨어질 수밖에 없습니다.",
        },
        {
          title: "채널 방향성 부재",
          desc: "예쁜 영상에 현혹되면 안 됩니다. 운전할 때, 내가 어디로 가야 할지 목적지를 정확하게 설정하는 것이 중요합니다.",
        },
        {
          title: "브랜드의 특징을 살리지 못하는 영상",
          desc: '조회수와 구독자가 많다고 해서 매출이 올라가는 것이 아닙니다. 중요한 것은 "어떤 방법으로 우리 브랜드의 특징을 유튜브로 녹여낼 것인가"입니다.',
        },
      ],
    },
    principles: {
      eyebrow: "Principles",
      headline: "소비자 중심 경영철칙",
      subhead: "유니버랩 미디어는 고객사의 매출 성장만을 추구합니다.",
      items: [
        {
          num: "01",
          title: "글 (Fundamentals)",
          desc: "유튜브의 기초는 '글'입니다. 사람들이 원하는 정보로 이루어진 글이 시청 체류시간을 늘립니다.",
        },
        {
          num: "02",
          title: "기획 (Direction)",
          desc: "기획은 방향성입니다. 우리 채널이 추구하는 가치를 찾고, 마케팅이 기업에 줄 수 있는 도움을 파악합니다.",
        },
        {
          num: "03",
          title: "컷 편집 (The Core)",
          desc: "컷 편집이 영상 완성도의 80%를 좌우합니다. 기본에 충실한 편집만이 성공 확률을 200% 높입니다.",
        },
        {
          num: "04",
          title: "알고리즘 (Human Context)",
          desc: "알고리즘은 사람을 공부하는 것입니다. '사람들이 원하는가?'와 '유튜브가 원하는가?' 두 가지를 충족시킵니다.",
        },
      ],
    },
    process: {
      eyebrow: "Workflow",
      headline: "작업 프로세스",
      steps: [
        { step: "01", title: "전문 설문지 작성", desc: "설문지를 작성하여 니즈와 원츠를 파악합니다." },
        { step: "02", title: "상담", desc: "조회수의 비결이 담긴 전문 상담을 진행합니다." },
        { step: "03", title: "전문 기획안 제작", desc: "구매자 맞춤 전문 기획안을 제공합니다." },
        { step: "04", title: "일정 조율", desc: "초안 영상 작업 일정을 조율합니다." },
        { step: "05", title: "촬영 진행", desc: "촬영을 원하시는 분에 한해 촬영을 진행합니다." },
        { step: "06", title: "디자인 착수 및 편집", desc: "자사 내에서 디자인, 편집 작업을 진행합니다." },
        { step: "07", title: "피드백 및 수정작업", desc: "검수 작업 및 수정작업을 진행합니다." },
        { step: "08", title: "완성", desc: "최종본을 전달하고 업로드를 진행합니다." },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────── Service Detail (4)
  serviceDetail: {
    shared: {
      notFoundTitle: "Service Not Found",
      notFoundLink: "Back to Services",
      pricingEyebrow: "Pricing",
      pricingHeadline: "가격 안내",
      priceUnit: "/ 건",
      currencySymbol: "₩",
      inquiryButton: "문의하기",
      ctaHeadline: "돈되는 유튜브,\n그 비결을 알고 싶으신가요?",
      ctaSubhead: "유니버랩 미디어의 모든 연구 성과, 이제는 당신이 주인공이 될 차례입니다.",
      ctaButton: "전문상담 받기",
    },
    services: {
      items: [
        {
          id: "service-1",
          title: "프리미엄 유튜브 패키지",
          subtitle: "SNS Channel Management",
          desc: "기획, 촬영, 편집은 물론, 영상 제작의 모든 과정을 올인원으로 제공합니다.",
          heroImage:
            "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=2000&auto=format&fit=crop",
          introTitle: "마케팅 흐름에 올라탈 수 있다면?",
          introText:
            '혹시 그거 아시나요? 인스타그램으로 팔로워 수십만을 달성해도 유튜브로 성공하기는 하늘에 별따기입니다. 이유는 각 플랫폼마다 원하는 바가 다르기 때문입니다. 인스타의 핵심은 소통이지만, 유튜브의 핵심은 콘텐츠입니다. 이를 판별할 줄 아는 힘만이 미래에 살아남습니다. 우리의 목적은 간단합니다. 오로지 "유튜브 채널 성공"입니다.',
          pricing: [
            {
              name: "종합관리형 250",
              price: "2,500,000",
              vat: "VAT별도",
              features: [
                { value: "전담 에디터 1인" },
                { value: "전문 기획 1인" },
                { value: "디자이너 1인" },
                { value: "분석 1인" },
                { value: "촬영 1인" },
              ],
            },
            {
              name: "프리미엄 종합관리형 350",
              price: "3,500,000",
              vat: "VAT별도",
              features: [
                { value: "전담 에디터 1인" },
                { value: "전문 기획 1인" },
                { value: "디자이너 1인" },
                { value: "분석 1인" },
                { value: "촬영 1인" },
                { value: "고급 퀄리티 보장" },
              ],
            },
            {
              name: "초격차 종합관리형 550",
              price: "5,500,000",
              vat: "VAT별도",
              features: [
                { value: "대표 참여" },
                { value: "전담 에디터 1인" },
                { value: "전문 기획 1인" },
                { value: "디자이너 1인" },
                { value: "분석 1인" },
                { value: "촬영 1인" },
                { value: "최상위 퀄리티" },
              ],
            },
          ],
        },
        {
          id: "service-2",
          title: "숏폼 영상 제작",
          subtitle: "Short Form Video Production",
          desc: "SNS에서 살아남는 숏폼 영상 제작, 핵심인 거 모르는 사람도 있나요?",
          heroImage:
            "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=2000&auto=format&fit=crop",
          introTitle: "핵심인 거 모르는 사람도 있나요..?",
          introText:
            "혹시 그거 아시나요? 짧은 영상은 이제 인스타그램에서만 사용하고 있지 않습니다. 네이버, 유튜브, 틱톡 등 현재 SNS에서 가장 큰 영향력을 가지고 있습니다. 숏폼 제작 서비스는 유니버랩 미디어에서 릴스를 직접 기획부터 편집까지 진행하는 서비스입니다. 소비자의 구매 포인트 분석을 통해 구매전환이 이루어질 수 있도록 제작해 드립니다.",
          pricing: [
            { name: "전문 숏폼 30", price: "330,000", vat: "VAT포함", features: [{ value: "에디터 1인 / 전문 기획 1인" }] },
            { name: "전문 숏폼 50", price: "550,000", vat: "VAT포함", features: [{ value: "에디터 1인 / 전문 기획 1인 / 분석가 1인" }] },
            { name: "전문 숏폼 100", price: "1,100,000", vat: "VAT포함", features: [{ value: "에디터 2인 / 전문 기획 1인 / 분석가 1인" }] },
            { name: "전문 숏폼 200", price: "2,200,000", vat: "VAT포함", features: [{ value: "에디터 2인 / 전문 기획 3인 / 전문 분석 1인" }] },
            { name: "브랜디드 숏폼 300", price: "3,300,000", vat: "VAT포함", features: [{ value: "촬영감독 1인 / 에디터 2인 / 전문 기획 1인 / 분석가 1인" }] },
            { name: "브랜디드 숏폼 500", price: "5,500,000", vat: "VAT포함", features: [{ value: "촬영감독 3인 / 에디터 2인 / 전문 기획 3인 / 전문 분석 1인" }] },
          ],
        },
        {
          id: "service-3",
          title: "전문 영상 편집",
          subtitle: "Professional Video Editing",
          desc: "신뢰와 이미지를 함께 담은 영상, 고객의 첫인상부터 다르게 만듭니다.",
          heroImage:
            "https://images.unsplash.com/photo-1574717432707-c25c8587a3ea?q=80&w=2000&auto=format&fit=crop",
          introTitle: "전문가의 편집스타일은 뭐가 다를까요?",
          introText:
            '혹시 그거 아시나요? 요즘 영상 하나 잘 만들면, 브랜드 인지도가 확 올라갑니다. 지금 유행하는 편집 스타일, 그 흐름을 정확히 읽고 있어야 가능한 이야기죠. 유니버랩 미디어는 트렌디한 영상미와 빠른 전달력을 갖춘 전문 영상 편집 대행 서비스를 제공합니다. 기획부터 편집, 자막 디자인까지 "딱 요즘 스타일"이 필요하다면, 바로 저희입니다.',
          pricing: [
            { name: "전문 영상편집 50", price: "550,000", vat: "VAT포함", features: [{ value: "에디터 1인 / 전문 기획 1인 / 디자이너 1인" }] },
            { name: "전문 영상편집 77", price: "770,000", vat: "VAT포함", features: [{ value: "에디터 1인 / 전문 기획 1인 / 분석가 1인" }] },
            { name: "고급 모션 영상편집 300", price: "3,300,000", vat: "VAT포함", features: [{ value: "에디터 1인 / 전문 기획 1인 / 분석가 1인" }, { value: "고급 모션그래픽" }] },
          ],
        },
        {
          id: "service-4",
          title: "올인원 영상 제작",
          subtitle: "All-in-One Production",
          desc: "영상 제작의 모든 과정을 한번에 제공합니다.",
          heroImage:
            "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2000&auto=format&fit=crop",
          introTitle: "프로덕션을 거쳐 수치 분석까지",
          introText:
            "혹시 그거 아시나요? 요즘 영상은 그냥 '예쁘게'만 만들면 안 됩니다. 기획부터 촬영, 편집, 자막, 음악, 콘텐츠 전략까지 요즘 유행하는 영상 제작의 모든 과정, 유니버랩 미디어에서 올인원으로 제공합니다. 콘텐츠 하나를 만들더라도 브랜드의 목적, 고객의 반응, SNS 알고리즘까지 전부 고려해서 제작해야 제대로 퍼질 수 있습니다.",
          pricing: [
            { name: "영상 제작 110", price: "1,100,000", vat: "VAT포함", features: [{ value: "에디터 1인 / 전문 기획 1인 / 디자이너 1인 / 카메라 1대" }] },
            { name: "영상 제작 220", price: "2,200,000", vat: "VAT포함", features: [{ value: "에디터 1인 / 전문 기획 1인 / 분석가 1인 / 카메라 2대" }] },
            { name: "브랜드 광고 영상", price: "11,000,000", vat: "VAT포함", features: [{ value: "에디터 1인 / 전문 기획 1인 / 분석가 1인" }, { value: "CF급 퀄리티" }] },
          ],
        },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────── Portfolio
  portfolio: {
    seo: {
      title: "제작 사례",
      description:
        "유니버랩 미디어가 제작한 기업 홍보·브랜드·숏폼 영상 포트폴리오를 확인해 보세요.",
    },
    hero: {
      eyebrow: "Portfolio",
      headline: "백문이\n불여일견",
      subhead: "직접 확인 해보세요! 유니버랩 미디어의 제작 사례입니다.",
    },
    filters: {
      items: [
        { name: "전체" },
        { name: "기업" },
        { name: "전문직" },
        { name: "브랜디드" },
        { name: "롱폼" },
        { name: "숏폼" },
      ],
    },
    projects: {
      moreLabel: "제작 사례 더 보기",
      items: [
        { videoId: "yK1TtQlqrLw", category: "기업" },
        { videoId: "_sEdSrF6VNc", category: "전문직" },
        { videoId: "DqpE-_GtDNc", category: "브랜디드" },
        { videoId: "VNc7_rosDFo", category: "롱폼" },
        { videoId: "zeUPWa_KHMA", category: "숏폼" },
        { videoId: "KuODv3YfdYY", category: "기업" },
        { videoId: "PjwbITGTRY0", category: "전문직" },
        { videoId: "Jv3TtBiCP94", category: "브랜디드" },
        { videoId: "enIcK7VIO04", category: "롱폼" },
        { videoId: "MPHjXGNdmoo", category: "숏폼" },
        { videoId: "xVQTpToE3E4", category: "기업" },
        { videoId: "F-ak107yxtA", category: "전문직" },
        { videoId: "-gGBncoBXgg", category: "브랜디드" },
        { videoId: "uNvs9Fwk-M0", category: "롱폼" },
        { videoId: "A-dTiIZZ708", category: "숏폼" },
        { videoId: "7nWOEQTnC70", category: "기업" },
        { videoId: "iIYpwOuWVQY", category: "브랜디드" },
        { videoId: "MMWHedPAKao", category: "숏폼" },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────── Column
  column: {
    seo: {
      title: "칼럼",
      description:
        "영상·유튜브 알고리즘·숏폼 마케팅에 대한 유니버랩 미디어의 트렌드 인사이트와 리포트를 확인해 보세요.",
    },
    hero: {
      eyebrow: "Insights",
      headline: "미디어 인사이트",
      subhead: "700건 이상의 제작 경험에서 나온 영상·유튜브·마케팅 인사이트를 공유합니다.",
    },
    list: {
      readMore: "READ MORE →",
      items: [
        {
          badge: "제작 인사이트",
          title: "유튜브 영상제작, 기획과 편집을 따로 맡기면 83% 이상이 망합니다",
          desc: "기획은 A업체, 편집은 B업체에 따로 맡기면 왜 실패할까요? 700건 제작 경험으로 그 이유와 해법을 정리했습니다.",
          date: "2026.06.15",
        },
        {
          badge: "비용 가이드",
          title: "영상편집 외주비용, 700건 제작한 업체가 공개하는 비용 구조 7가지",
          desc: "프리랜서·플랫폼·전문업체 비용 비교부터 견적 요청 전 체크리스트까지. 2026년 기준 적정가를 공개합니다.",
          date: "2026.03.25",
        },
        {
          badge: "유튜브 전략",
          title: "조회수가 안 나오는 진짜 이유: 알고리즘이 아니라 '기획'입니다",
          desc: "알고리즘 탓하기 전에 점검해야 할 것. 시청 지속시간과 구독 전환을 만드는 기획의 원리를 풀어냅니다.",
          date: "2026.02.10",
        },
        {
          badge: "숏폼",
          title: "전환되는 릴스의 3가지 공식: 숏폼 하나로 매출이 바뀐다",
          desc: "조회수가 아니라 구매로 이어지는 숏폼. 후킹·전개·CTA로 이어지는 검증된 구조를 공개합니다.",
          date: "2026.01.20",
        },
        {
          badge: "브랜딩",
          title: "브랜드 영상, 예쁘기만 하면 실패합니다: 팔리는 영상의 조건",
          desc: "예쁜 영상과 팔리는 영상은 다릅니다. 브랜드의 특징을 매출로 연결하는 영상의 조건을 정리했습니다.",
          date: "2025.12.05",
        },
        {
          badge: "채널 성장",
          title: "유튜브 채널 0에서 시작하기: 첫 90일 성장 로드맵",
          desc: "구독자 0에서 시작하는 채널을 위한 90일 플랜. 무엇을, 어떤 순서로 해야 하는지 단계별로 안내합니다.",
          date: "2025.11.12",
        },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────── Pricing
  pricing: {
    seo: {
      title: "가격 안내",
      description:
        "영상 편집부터 브랜디드 숏폼까지, 유니버랩 미디어의 패키지별 가격과 구성을 확인해 보세요.",
    },
    hero: {
      eyebrow: "Pricing",
      headline: "프리미엄\n올인원 패키지",
      subhead: "투명한 가격으로 안내드립니다.\n모든 패키지는 품질 유지를 위해 매월 20건 한정으로 진행됩니다.",
    },
    videoSection: {
      title: "영상 편집 패키지",
      staffLabel: "참여 인원:",
      periodLabel: "제작 기간:",
      packages: videoPackages,
    },
    shortformSection: {
      title: "숏폼 패키지",
      packages: shortformPackages,
    },
  },

  // ───────────────────────────────────────────────────────────── Contact
  contact: {
    seo: {
      title: "문의하기",
      description:
        "프로젝트 상담을 원하신다면 지금 바로 유니버랩 미디어에 연락해 주세요. 담당자가 빠르게 응답합니다.",
    },
    hero: {
      headline: "Contact Us",
      subhead: "성공적인 프로젝트의 시작, 유니버랩 미디어와 함께하세요.",
    },
    info: {
      sectionTitle: "Get in Touch",
      items: [
        { title: "Email", value: "contact@univerlabmedia.co.kr" },
        { title: "Phone", value: "010-9752-2358" },
        { title: "Address", value: "서울특별시 광진구 광나루로22길 16-3, 302호(화양동)" },
        { title: "Business Hours", value: "Mon - Fri, 10:00 - 19:00" },
      ],
    },
    form: {
      sectionTitle: "프로젝트 문의",
      notice:
        "유니버랩 미디어는 무엇보다 진정성을 원합니다. 상세하고 정확하게 작성해주셔야 정확한 상담이 가능합니다.",
      brandLabel: "브랜드명",
      brandPlaceholder: "브랜드 / 회사명을 입력해주세요",
      managerLabel: "담당자 성함",
      managerPlaceholder: "홍길동",
      positionLabel: "담당자 직책",
      positionPlaceholder: "예) 마케팅팀 매니저 (선택)",
      phoneLabel: "연락처",
      phonePlaceholder: "010-0000-0000",
      channelLabel: "운영 중인 채널 URL",
      channelPlaceholder: "https://youtube.com/@yourchannel",
      bizLabel: "현재 운영 중인 기업·사업체 소개",
      bizPlaceholder: "어떤 사업을 하고 계신지 간단히 소개해주세요.",
      benchLabel: "벤치마킹 중인 채널 URL",
      benchPlaceholder: "참고하고 싶은 채널이 있다면 남겨주세요.",
      budgetLabel: "투자 가능한 월 예산",
      budgetPlaceholder: "선택해주세요",
      budgetOptions: [
        { value: "over_30m", label: "3,000만원 이상" },
        { value: "20_30m", label: "2,000만원 ~ 3,000만원" },
        { value: "10_20m", label: "1,000만원 ~ 2,000만원" },
        { value: "3_10m", label: "300만원 ~ 1,000만원" },
        { value: "under_3m", label: "300만원 이하" },
      ],
      serviceLabel: "어떤 서비스를 원하시나요?",
      servicePlaceholder: "선택해주세요",
      serviceOptions: [
        { value: "shortform", label: "전문 숏폼 제작" },
        { value: "editing", label: "전문 영상 편집 대행" },
        { value: "allinone", label: "올인원 영상 제작 서비스" },
        { value: "premium", label: "프리미엄 유튜브 패키지" },
      ],
      reasonLabel: "유니버랩 미디어에게 의뢰하신 이유",
      reasonPlaceholder: "저희를 선택해주신 이유를 알려주세요.",
      goalLabel: "유튜브를 운영하는 가장 큰 이유",
      goalPlaceholder: "유튜브를 통해 이루고 싶은 목표를 적어주세요.",
      sourceLabel: "유니버랩 미디어를 어떻게 알게 되셨나요?",
      sourcePlaceholder: "선택해주세요",
      sourceOptions: [
        { value: "naver", label: "네이버 검색" },
        { value: "blog", label: "블로그" },
        { value: "community", label: "온라인 커뮤니티" },
        { value: "referral", label: "지인 추천" },
        { value: "google", label: "구글" },
        { value: "etc", label: "기타" },
      ],
      consentLabel: "개인정보 수집 및 이용에 동의합니다.",
      submitButton: "작성 완료",
    },
  },

  // ───────────────────────────────────────────────────────────── NotFound
  notFound: {
    seo: { title: "페이지를 찾을 수 없음" },
    main: {
      code: "404",
      headline: "Page Not Found",
      body: "요청하신 페이지를 찾을 수 없습니다.\n입력하신 주소가 정확한지 다시 한 번 확인해주세요.",
      homeButton: "Back to Home",
    },
  },

  // ───────────────────────────────────────────────────────────── Global
  global: {
    site: {
      siteName: "유니버랩 미디어",
      defaultTitle: "유니버랩 미디어 | 영상 기획·촬영·편집·마케팅 원스톱 에이전시",
      defaultDescription:
        "유니버랩 미디어는 영상 기획·촬영·편집·마케팅을 하나의 프로세스로 제공하는 영상 제작 전문 에이전시입니다.",
      siteUrl: "https://univerlabmedia.co.kr",
      ogImage: "/og-image.png",
    },
    header: {
      brand: "UNIVERLAB",
      nav: [
        { name: "회사 소개", path: "/company" },
        { name: "서비스 소개", path: "/service" },
        { name: "제작 사례", path: "/portfolio" },
        { name: "칼럼", path: "/column" },
        { name: "가격 안내", path: "/pricing" },
        { name: "문의하기", path: "/contact" },
      ],
      themeToggleAria: "Toggle Theme",
    },
    footer: {
      brand: "UNIVERLAB",
      tagline:
        "We create impactful media that drives growth.\nYour partner in digital transformation.",
      ctaButton: "Contact Us",
      addressLabel: "Address",
      address: "서울특별시 광진구 광나루로22길 16-3, 302호(화양동)",
      contactLabel: "Contact",
      phone: "Tel: 010-9752-2358",
      email: "E-mail: contact@univerlabmedia.co.kr",
      infoLabel: "Info",
      businessName: "상호명: 유니버랩미디어 | 대표: 곽 현 수",
      businessNumber: "사업자 등록 번호: 659-03-03533",
      copyright: "Copyright ⓒ 2024 UNIVERLAB MEDIA. All Rights Reserved.",
      termsLink: "Terms of Use",
      termsPath: "/policy",
      privacyLink: "Privacy Policy",
      privacyPath: "/privacy",
    },
  },
};

/** Deep clone helper so callers can mutate without affecting defaults. */
export function cloneDefaults(key) {
  const src = key ? defaults[key] : defaults;
  return JSON.parse(JSON.stringify(src));
}
