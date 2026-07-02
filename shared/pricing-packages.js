/**
 * Package definitions shared between the Home pricing teaser
 * (`home.pricing`) and the dedicated Pricing page (`pricing.*Section`).
 *
 * Single source of truth — edit a package's title / staff / period / features
 * here and both pages update together.
 *
 * NOTE: `serviceDetail.services[].pricing` intentionally does NOT source from
 * here — it uses a different, price-bearing shape ({ name, price, vat }).
 */

export const videoPackages = [
  {
    title: "고급 모션 영상편집 300",
    staff: "에디터 1인 / 전문 기획 1인 / 분석가 1인",
    period: "14일 이내",
    features: [
      { value: "심리학 기반 기획안" },
      { value: "고도화 된 영상 편집 프로세스" },
      { value: "단순 컷편집" },
      { value: "BGM 삽입" },
      { value: "말자막" },
      { value: "디자인 강조자막" },
      { value: "색채학 기반 영상 효과" },
      { value: "고급 모션그래픽 디자인" },
      { value: "타이포그래피" },
    ],
  },
  {
    title: "전문 영상편집 77",
    staff: "에디터 1인 / 전문 기획 1인 / 분석가 1인",
    period: "14일 이내",
    features: [
      { value: "심리학 기반 기획안" },
      { value: "고도화 된 영상 편집 프로세스" },
      { value: "단순 컷편집" },
      { value: "BGM 삽입" },
      { value: "말자막" },
      { value: "디자인 강조자막" },
      { value: "색채학 기반 영상 효과" },
      { value: "간단 모션그래픽 디자인" },
    ],
  },
  {
    title: "전문 영상편집 50",
    staff: "에디터 1인 / 전문 기획 1인 / 디자이너 1인",
    period: "10일 이내",
    features: [
      { value: "심리학 기반 기획안" },
      { value: "고도화 된 영상 편집 프로세스" },
      { value: "단순 컷편집" },
      { value: "BGM 삽입" },
      { value: "말자막" },
      { value: "디자인 강조자막" },
      { value: "색채학 기반 영상 효과" },
    ],
  },
];

export const shortformPackages = [
  {
    title: "브랜디드 숏폼 500",
    staff: "촬영감독 3인 / 에디터 2인 / 전문 기획 3인 / 전문 분석 1인",
    period: "한 달 이내",
    features: [
      { value: "고급 시네마틱 영상촬영" },
      { value: "기업 전문 샷리스트 제작" },
      { value: "전담 숏폼 브랜딩 디자인" },
      { value: "고급 컷편집" },
      { value: "모션그래픽" },
      { value: "부가 촬영 서비스" },
    ],
  },
  {
    title: "브랜디드 숏폼 300",
    staff: "촬영감독 1인 / 에디터 2인 / 전문 기획 1인 / 분석가 1인",
    period: "한 달 이내",
    features: [
      { value: "고급 시네마틱 영상촬영" },
      { value: "샷리스트 제공" },
      { value: "단순 컷편집" },
      { value: "중급 모션그래픽" },
    ],
  },
  {
    title: "전문 숏폼 200",
    staff: "에디터 2인 / 전문 기획 1인 / 분석가 1인",
    period: "14일 이내",
    features: [
      { value: "고급 컷편집" },
      { value: "모션그래픽" },
      { value: "부가 촬영 서비스" },
    ],
  },
  {
    title: "전문 숏폼 100",
    staff: "에디터 2인 / 전문 기획 1인 / 분석가 1인",
    period: "14일 이내",
    features: [{ value: "고급 컷편집" }, { value: "중급 모션그래픽" }],
  },
  {
    title: "전문 숏폼 50",
    staff: "에디터 1인 / 전문 기획 1인 / 분석가 1인",
    period: "10일 이내",
    features: [
      { value: "단순 컷편집" },
      { value: "간단 모션그래픽 디자인" },
    ],
  },
  {
    title: "전문 숏폼 30",
    staff: "에디터 1인 / 전문 기획 1인",
    period: "7일 이내",
    features: [{ value: "단순 컷편집" }, { value: "BGM/자막/효과음" }],
  },
];
