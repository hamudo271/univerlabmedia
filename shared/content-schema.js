/**
 * Content schema — describes every editable field on the site.
 *
 * Used by:
 *   • The admin UI to render form fields with the correct input type
 *     and a visible semantic-tag hint (H1 / Body / Button / …).
 *   • Defaults seeding to validate / shape the JSON stored in Postgres.
 *
 * Shape:
 *   schema[pageKey] = {
 *     label,                         ← Korean page name for the sidebar
 *     sections: {
 *       [sectionKey]: {
 *         label,                     ← Korean section name
 *         fields: {
 *           [fieldKey]: {
 *             type: "text" | "textarea" | "image" | "url" | "array",
 *             tag:  "H1" | "H2" | "H3" | "Body" | "Button" | "Label" |
 *                   "Badge" | "Nav" | "Eyebrow" | "Image" | "ImageAlt",
 *             label,                 ← Korean label shown next to the input
 *             // for type:"array":
 *             itemLabel,             ← Korean label for each row ("팀원", "스텝")
 *             itemSchema: { ... },   ← per-item field map (recursive)
 *           }
 *         }
 *       }
 *     }
 *   }
 *
 * Notes:
 *   • `type:"array"` items may themselves contain nested arrays (e.g.
 *     pricing.features) — those are simple string arrays and editors
 *     should render a repeating single-line input.
 *   • `global` is a page-level key too; its sections cover header+footer.
 *   • Every page also has an implicit `seo` section (title / description)
 *     so the admin can edit per-page meta tags.
 */

// ─── Reusable array shapes ────────────────────────────────────────────────
const stringListItem = {
  value: { type: "text", tag: "Body", label: "항목" },
};

const featureListField = {
  type: "array",
  tag: "Body",
  label: "포함 기능",
  itemLabel: "기능",
  itemSchema: stringListItem,
};

const packageItemSchema = {
  title: { type: "text", tag: "H3", label: "패키지명" },
  staff: { type: "text", tag: "Body", label: "참여 인원" },
  period: { type: "text", tag: "Body", label: "제작 기간" },
  features: featureListField,
};

const seoSection = {
  label: "SEO 메타",
  fields: {
    title: { type: "text", tag: "Body", label: "페이지 제목" },
    description: {
      type: "textarea",
      tag: "Body",
      label: "페이지 설명 (160자 내외)",
    },
  },
};

// ─── Schema ───────────────────────────────────────────────────────────────
export const schema = {
  home: {
    label: "홈",
    sections: {
      seo: seoSection,
      hero: {
        label: "히어로 섹션",
        fields: {
          badge: { type: "text", tag: "Badge", label: "상단 배지" },
          headlineLine1: { type: "text", tag: "H1", label: "메인 헤드라인 1행" },
          headlineLine2: {
            type: "text",
            tag: "H1",
            label: "메인 헤드라인 2행 (강조)",
          },
          subhead: { type: "textarea", tag: "Body", label: "서브 카피" },
          ctaButton: { type: "text", tag: "Button", label: "CTA 버튼" },
        },
      },
      marquee: {
        label: "고객사 마퀴",
        fields: {
          clients: {
            type: "array",
            tag: "Body",
            label: "고객사 로고 텍스트",
            itemLabel: "고객사",
            itemSchema: {
              name: { type: "text", tag: "Body", label: "이름" },
            },
          },
        },
      },
      secrets: {
        label: "비결 섹션 (Why Us)",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "섹션 아이브로" },
          headline: { type: "textarea", tag: "H2", label: "섹션 헤드라인" },
          items: {
            type: "array",
            tag: "Body",
            label: "비결 카드 목록",
            itemLabel: "카드",
            itemSchema: {
              title: { type: "text", tag: "H3", label: "카드 제목" },
              desc: { type: "textarea", tag: "Body", label: "카드 설명" },
            },
          },
        },
      },
      growth: {
        label: "성장 단계 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "섹션 아이브로" },
          headline: { type: "textarea", tag: "H2", label: "섹션 헤드라인" },
          steps: {
            type: "array",
            tag: "Body",
            label: "성장 단계",
            itemLabel: "스텝",
            itemSchema: {
              step: { type: "text", tag: "Eyebrow", label: "스텝 라벨" },
              title: { type: "text", tag: "H3", label: "스텝 제목" },
              desc: {
                type: "array",
                tag: "Body",
                label: "설명 불릿",
                itemLabel: "불릿",
                itemSchema: stringListItem,
              },
            },
          },
        },
      },
      safety: {
        label: "안심제도 섹션",
        fields: {
          headline: { type: "text", tag: "H2", label: "섹션 헤드라인" },
          subhead: { type: "text", tag: "Body", label: "섹션 서브카피" },
          card1Title: { type: "text", tag: "H3", label: "카드1 제목" },
          card1Body: { type: "textarea", tag: "Body", label: "카드1 본문" },
          card2Title: { type: "text", tag: "H3", label: "카드2 제목" },
          card2Body: { type: "textarea", tag: "Body", label: "카드2 본문" },
        },
      },
      process: {
        label: "작업 프로세스 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "섹션 아이브로" },
          headline: { type: "text", tag: "H2", label: "섹션 헤드라인" },
          steps: {
            type: "array",
            tag: "Body",
            label: "프로세스 단계",
            itemLabel: "스텝",
            itemSchema: {
              step: { type: "text", tag: "Eyebrow", label: "번호" },
              title: { type: "text", tag: "H3", label: "단계 제목" },
              desc: { type: "text", tag: "Body", label: "단계 설명" },
            },
          },
        },
      },
      pricing: {
        label: "가격 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "섹션 아이브로" },
          headline: { type: "text", tag: "H2", label: "섹션 헤드라인" },
          subhead: { type: "text", tag: "Body", label: "섹션 서브카피" },
          videoSectionTitle: {
            type: "text",
            tag: "H3",
            label: "영상 편집 패키지 제목",
          },
          shortformSectionTitle: {
            type: "text",
            tag: "H3",
            label: "숏폼 패키지 제목",
          },
          staffLabel: { type: "text", tag: "Label", label: "참여 인원 라벨" },
          periodLabel: { type: "text", tag: "Label", label: "제작 기간 라벨" },
          videoPackages: {
            type: "array",
            tag: "Body",
            label: "영상 편집 패키지",
            itemLabel: "패키지",
            itemSchema: packageItemSchema,
          },
          shortformPackages: {
            type: "array",
            tag: "Body",
            label: "숏폼 패키지",
            itemLabel: "패키지",
            itemSchema: packageItemSchema,
          },
        },
      },
      faq: {
        label: "자주 묻는 질문",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "섹션 아이브로" },
          headline: { type: "text", tag: "H2", label: "섹션 헤드라인" },
          items: {
            type: "array",
            tag: "Body",
            label: "FAQ 목록",
            itemLabel: "Q&A",
            itemSchema: {
              q: { type: "text", tag: "H3", label: "질문" },
              a: { type: "textarea", tag: "Body", label: "답변" },
            },
          },
        },
      },
    },
  },

  company: {
    label: "회사 소개",
    sections: {
      seo: seoSection,
      hero: {
        label: "히어로 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "아이브로" },
          headline: { type: "textarea", tag: "H1", label: "헤드라인" },
          subhead: { type: "textarea", tag: "Body", label: "서브카피" },
        },
      },
      whyObsessed: {
        label: "왜 집착하는가 섹션",
        fields: {
          headline: { type: "text", tag: "H2", label: "헤드라인" },
          subhead: { type: "text", tag: "Body", label: "서브카피" },
          card1Title: { type: "text", tag: "H3", label: "카드1 제목" },
          card1Strong: { type: "text", tag: "Body", label: "카드1 강조 문장" },
          card1Body: { type: "textarea", tag: "Body", label: "카드1 본문" },
          card2Title: { type: "text", tag: "H3", label: "카드2 제목" },
          card2Strong: { type: "text", tag: "Body", label: "카드2 강조 문장" },
          card2Body: { type: "textarea", tag: "Body", label: "카드2 본문" },
        },
      },
      teamwork: {
        label: "팀워크 섹션",
        fields: {
          headline: { type: "text", tag: "H2", label: "헤드라인" },
          subhead: { type: "textarea", tag: "Body", label: "서브카피" },
        },
      },
      team: {
        label: "팀 구성 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "아이브로" },
          headline: { type: "text", tag: "H2", label: "헤드라인" },
          members: {
            type: "array",
            tag: "Body",
            label: "팀원 카드",
            itemLabel: "팀원",
            itemSchema: {
              role: { type: "text", tag: "H3", label: "역할명" },
              desc: { type: "textarea", tag: "Body", label: "역할 설명" },
            },
          },
        },
      },
      cta: {
        label: "하단 CTA 섹션",
        fields: {
          headline: { type: "textarea", tag: "H2", label: "헤드라인" },
          subhead: { type: "text", tag: "Body", label: "서브카피" },
          button: { type: "text", tag: "Button", label: "CTA 버튼" },
        },
      },
    },
  },

  service: {
    label: "서비스 소개",
    sections: {
      seo: seoSection,
      hero: {
        label: "히어로 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "아이브로" },
          headlineLine1: { type: "text", tag: "H1", label: "헤드라인 1행" },
          headlineLine2: {
            type: "text",
            tag: "H1",
            label: "헤드라인 2행 (강조)",
          },
          subhead: { type: "textarea", tag: "Body", label: "서브카피" },
        },
      },
      failure: {
        label: "실패 분석 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "아이브로" },
          headline: { type: "text", tag: "H2", label: "헤드라인" },
          subhead: { type: "text", tag: "Body", label: "서브카피" },
          reasons: {
            type: "array",
            tag: "Body",
            label: "실패 이유 카드",
            itemLabel: "이유",
            itemSchema: {
              title: { type: "text", tag: "H3", label: "제목" },
              desc: { type: "textarea", tag: "Body", label: "설명" },
            },
          },
        },
      },
      principles: {
        label: "경영 철칙 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "아이브로" },
          headline: { type: "text", tag: "H2", label: "헤드라인" },
          subhead: { type: "text", tag: "Body", label: "서브카피" },
          items: {
            type: "array",
            tag: "Body",
            label: "원칙 목록",
            itemLabel: "원칙",
            itemSchema: {
              num: { type: "text", tag: "Eyebrow", label: "번호" },
              title: { type: "text", tag: "H3", label: "제목" },
              desc: { type: "textarea", tag: "Body", label: "설명" },
            },
          },
        },
      },
      process: {
        label: "작업 프로세스 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "아이브로" },
          headline: { type: "text", tag: "H2", label: "헤드라인" },
          steps: {
            type: "array",
            tag: "Body",
            label: "프로세스 단계",
            itemLabel: "스텝",
            itemSchema: {
              step: { type: "text", tag: "Eyebrow", label: "번호" },
              title: { type: "text", tag: "H3", label: "제목" },
              desc: { type: "text", tag: "Body", label: "설명" },
            },
          },
        },
      },
    },
  },

  serviceDetail: {
    label: "서비스 상세 (4종)",
    sections: {
      shared: {
        label: "공통 UI 텍스트",
        fields: {
          notFoundTitle: { type: "text", tag: "H2", label: "404 제목" },
          notFoundLink: { type: "text", tag: "Nav", label: "404 링크" },
          pricingEyebrow: {
            type: "text",
            tag: "Eyebrow",
            label: "가격 섹션 아이브로",
          },
          pricingHeadline: {
            type: "text",
            tag: "H2",
            label: "가격 섹션 헤드라인",
          },
          priceUnit: { type: "text", tag: "Body", label: "가격 단위" },
          currencySymbol: { type: "text", tag: "Body", label: "통화 기호" },
          inquiryButton: {
            type: "text",
            tag: "Button",
            label: "패키지 카드 CTA",
          },
          ctaHeadline: {
            type: "textarea",
            tag: "H2",
            label: "하단 CTA 헤드라인",
          },
          ctaSubhead: { type: "text", tag: "Body", label: "하단 CTA 서브카피" },
          ctaButton: { type: "text", tag: "Button", label: "하단 CTA 버튼" },
        },
      },
      services: {
        label: "서비스 데이터",
        fields: {
          items: {
            type: "array",
            tag: "Body",
            label: "서비스 4종",
            itemLabel: "서비스",
            itemSchema: {
              id: {
                type: "text",
                tag: "Body",
                label: "서비스 ID (URL 슬러그)",
              },
              title: { type: "text", tag: "H1", label: "서비스명" },
              subtitle: {
                type: "text",
                tag: "Eyebrow",
                label: "영문 서브타이틀",
              },
              desc: { type: "text", tag: "Body", label: "히어로 본문" },
              heroImage: {
                type: "image",
                tag: "Image",
                label: "히어로 배경 이미지",
              },
              introTitle: { type: "text", tag: "H2", label: "인트로 제목" },
              introText: {
                type: "textarea",
                tag: "Body",
                label: "인트로 본문",
              },
              pricing: {
                type: "array",
                tag: "Body",
                label: "가격 패키지",
                itemLabel: "패키지",
                itemSchema: {
                  name: { type: "text", tag: "H3", label: "패키지명" },
                  price: {
                    type: "text",
                    tag: "Body",
                    label: "가격 (숫자만)",
                  },
                  vat: { type: "text", tag: "Body", label: "VAT 표시" },
                  features: featureListField,
                },
              },
            },
          },
        },
      },
    },
  },

  portfolio: {
    label: "제작 사례",
    sections: {
      seo: seoSection,
      hero: {
        label: "히어로 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "아이브로" },
          headline: { type: "textarea", tag: "H1", label: "헤드라인" },
          subhead: { type: "text", tag: "Body", label: "서브카피" },
        },
      },
      filters: {
        label: "필터 버튼",
        fields: {
          items: {
            type: "array",
            tag: "Button",
            label: "카테고리 필터",
            itemLabel: "필터",
            itemSchema: {
              name: { type: "text", tag: "Button", label: "필터명" },
            },
          },
        },
      },
      projects: {
        label: "프로젝트 카드",
        fields: {
          items: {
            type: "array",
            tag: "Body",
            label: "프로젝트 목록",
            itemLabel: "프로젝트",
            itemSchema: {
              title: { type: "text", tag: "H3", label: "프로젝트명" },
              category: {
                type: "text",
                tag: "Eyebrow",
                label: "카테고리 (필터값)",
              },
              image: { type: "image", tag: "Image", label: "이미지" },
            },
          },
        },
      },
    },
  },

  column: {
    label: "칼럼",
    sections: {
      seo: seoSection,
      hero: {
        label: "히어로 섹션",
        fields: {
          headline: { type: "text", tag: "H1", label: "헤드라인" },
          subhead: { type: "text", tag: "Body", label: "서브카피" },
        },
      },
      list: {
        label: "칼럼 카드 목록",
        fields: {
          readMore: { type: "text", tag: "Button", label: "더보기 버튼 라벨" },
          items: {
            type: "array",
            tag: "Body",
            label: "칼럼 카드",
            itemLabel: "칼럼",
            itemSchema: {
              badge: { type: "text", tag: "Badge", label: "배지" },
              title: { type: "text", tag: "H3", label: "제목" },
              desc: { type: "textarea", tag: "Body", label: "설명" },
              date: { type: "text", tag: "Body", label: "날짜" },
            },
          },
        },
      },
    },
  },

  pricing: {
    label: "가격 안내",
    sections: {
      seo: seoSection,
      hero: {
        label: "히어로 섹션",
        fields: {
          eyebrow: { type: "text", tag: "Eyebrow", label: "아이브로" },
          headline: { type: "textarea", tag: "H1", label: "헤드라인" },
          subhead: { type: "text", tag: "Body", label: "서브카피" },
        },
      },
      videoSection: {
        label: "영상 편집 패키지",
        fields: {
          title: { type: "text", tag: "H3", label: "섹션 제목" },
          staffLabel: { type: "text", tag: "Label", label: "참여 인원 라벨" },
          periodLabel: { type: "text", tag: "Label", label: "제작 기간 라벨" },
          packages: {
            type: "array",
            tag: "Body",
            label: "패키지 목록",
            itemLabel: "패키지",
            itemSchema: packageItemSchema,
          },
        },
      },
      shortformSection: {
        label: "숏폼 패키지",
        fields: {
          title: { type: "text", tag: "H3", label: "섹션 제목" },
          packages: {
            type: "array",
            tag: "Body",
            label: "패키지 목록",
            itemLabel: "패키지",
            itemSchema: packageItemSchema,
          },
        },
      },
    },
  },

  contact: {
    label: "문의하기",
    sections: {
      seo: seoSection,
      hero: {
        label: "히어로 섹션",
        fields: {
          headline: { type: "text", tag: "H1", label: "헤드라인" },
          subhead: { type: "text", tag: "Body", label: "서브카피" },
        },
      },
      info: {
        label: "연락처 정보 카드",
        fields: {
          sectionTitle: { type: "text", tag: "H2", label: "섹션 제목" },
          items: {
            type: "array",
            tag: "Body",
            label: "연락처 카드",
            itemLabel: "연락처",
            itemSchema: {
              title: { type: "text", tag: "H3", label: "라벨" },
              value: { type: "text", tag: "Body", label: "값" },
            },
          },
        },
      },
      form: {
        label: "문의 폼",
        fields: {
          nameLabel: { type: "text", tag: "Label", label: "이름 라벨" },
          namePlaceholder: {
            type: "text",
            tag: "Body",
            label: "이름 placeholder",
          },
          companyLabel: { type: "text", tag: "Label", label: "회사명 라벨" },
          companyPlaceholder: {
            type: "text",
            tag: "Body",
            label: "회사명 placeholder",
          },
          emailLabel: { type: "text", tag: "Label", label: "이메일 라벨" },
          emailPlaceholder: {
            type: "text",
            tag: "Body",
            label: "이메일 placeholder",
          },
          phoneLabel: { type: "text", tag: "Label", label: "전화 라벨" },
          phonePlaceholder: {
            type: "text",
            tag: "Body",
            label: "전화 placeholder",
          },
          projectTypeLabel: {
            type: "text",
            tag: "Label",
            label: "프로젝트 타입 라벨",
          },
          projectTypePlaceholder: {
            type: "text",
            tag: "Body",
            label: "기본 옵션 텍스트",
          },
          projectTypeOptions: {
            type: "array",
            tag: "Body",
            label: "프로젝트 타입 옵션",
            itemLabel: "옵션",
            itemSchema: {
              value: { type: "text", tag: "Body", label: "옵션 값 (영문)" },
              label: { type: "text", tag: "Body", label: "옵션 라벨" },
            },
          },
          budgetLabel: { type: "text", tag: "Label", label: "예산 라벨" },
          budgetPlaceholder: {
            type: "text",
            tag: "Body",
            label: "기본 옵션 텍스트",
          },
          budgetOptions: {
            type: "array",
            tag: "Body",
            label: "예산 옵션",
            itemLabel: "옵션",
            itemSchema: {
              value: { type: "text", tag: "Body", label: "옵션 값 (영문)" },
              label: { type: "text", tag: "Body", label: "옵션 라벨" },
            },
          },
          referenceLabel: {
            type: "text",
            tag: "Label",
            label: "참고 URL 라벨",
          },
          referencePlaceholder: {
            type: "text",
            tag: "Body",
            label: "참고 URL placeholder",
          },
          messageLabel: { type: "text", tag: "Label", label: "메시지 라벨" },
          messagePlaceholder: {
            type: "textarea",
            tag: "Body",
            label: "메시지 placeholder",
          },
          submitButton: { type: "text", tag: "Button", label: "제출 버튼" },
        },
      },
    },
  },

  notFound: {
    label: "404 페이지",
    sections: {
      seo: {
        label: "SEO 메타",
        fields: {
          title: { type: "text", tag: "Body", label: "페이지 제목" },
        },
      },
      main: {
        label: "본문",
        fields: {
          code: { type: "text", tag: "H1", label: "404 코드" },
          headline: { type: "text", tag: "H2", label: "헤드라인" },
          body: { type: "textarea", tag: "Body", label: "본문" },
          homeButton: { type: "text", tag: "Button", label: "홈으로 버튼" },
        },
      },
    },
  },

  global: {
    label: "전역 설정 (헤더/푸터/사이트)",
    sections: {
      site: {
        label: "사이트 기본 정보",
        fields: {
          siteName: { type: "text", tag: "Body", label: "사이트 이름" },
          defaultTitle: { type: "text", tag: "Body", label: "기본 페이지 제목" },
          defaultDescription: {
            type: "textarea",
            tag: "Body",
            label: "기본 설명 (SEO 폴백)",
          },
          siteUrl: { type: "url", tag: "Body", label: "공식 URL" },
          ogImage: { type: "image", tag: "Image", label: "기본 OG 이미지" },
        },
      },
      header: {
        label: "헤더",
        fields: {
          brand: { type: "text", tag: "Nav", label: "브랜드 로고 텍스트" },
          nav: {
            type: "array",
            tag: "Nav",
            label: "메인 내비게이션",
            itemLabel: "메뉴",
            itemSchema: {
              name: { type: "text", tag: "Nav", label: "메뉴명" },
              path: { type: "url", tag: "Nav", label: "링크 경로" },
            },
          },
          themeToggleAria: {
            type: "text",
            tag: "Label",
            label: "테마 토글 ARIA",
          },
        },
      },
      footer: {
        label: "푸터",
        fields: {
          brand: { type: "text", tag: "H2", label: "브랜드명" },
          tagline: { type: "textarea", tag: "Body", label: "태그라인" },
          ctaButton: { type: "text", tag: "Button", label: "CTA 버튼" },
          addressLabel: { type: "text", tag: "Label", label: "주소 라벨" },
          address: { type: "text", tag: "Body", label: "회사 주소" },
          contactLabel: { type: "text", tag: "Label", label: "연락처 라벨" },
          phone: { type: "text", tag: "Body", label: "전화" },
          email: { type: "text", tag: "Body", label: "이메일" },
          infoLabel: { type: "text", tag: "Label", label: "회사 정보 라벨" },
          businessName: { type: "text", tag: "Body", label: "상호 / 대표" },
          businessNumber: {
            type: "text",
            tag: "Body",
            label: "사업자 등록 번호",
          },
          copyright: { type: "text", tag: "Body", label: "저작권" },
          termsLink: {
            type: "text",
            tag: "Nav",
            label: "이용약관 링크 텍스트",
          },
          termsPath: { type: "url", tag: "Nav", label: "이용약관 경로" },
          privacyLink: {
            type: "text",
            tag: "Nav",
            label: "개인정보처리방침 링크 텍스트",
          },
          privacyPath: { type: "url", tag: "Nav", label: "개인정보처리방침 경로" },
        },
      },
    },
  },
};

/** Ordered list of page keys for sidebar rendering. */
export const pageOrder = [
  "home",
  "company",
  "service",
  "serviceDetail",
  "portfolio",
  "column",
  "pricing",
  "contact",
  "notFound",
  "global",
];

/** Set of valid semantic tags (for validating custom content entries). */
export const validTags = new Set([
  "H1",
  "H2",
  "H3",
  "Body",
  "Button",
  "Label",
  "Badge",
  "Nav",
  "Eyebrow",
  "Image",
  "ImageAlt",
]);
