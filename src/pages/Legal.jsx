import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { PageHero, fadeInUp } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

const EFFECTIVE_DATE = '2026년 7월 27일';

/** Shared shell: hero + numbered article sections. */
const LegalDoc = ({ eyebrow, title, path, description, sections }) => (
  <div className="bg-bg-primary">
    <SEO title={title} description={description} path={path} />
    <PageHero eyebrow={eyebrow} title={title} subhead={`시행일자: ${EFFECTIVE_DATE}`} />

    <section className="mx-auto max-w-3xl px-6 py-24">
      {sections.map((s, i) => (
        <motion.article
          key={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-12 last:mb-0"
        >
          <h2 className="mb-4 text-xl font-black text-text-primary md:text-2xl">
            {s.heading}
          </h2>
          {s.body.map((p, j) => (
            <p
              key={j}
              className="mb-3 whitespace-pre-line text-sm leading-relaxed text-text-secondary last:mb-0"
            >
              {p}
            </p>
          ))}
        </motion.article>
      ))}
    </section>
  </div>
);

export function Policy() {
  const { footer } = useContent('global');
  const sections = [
    {
      heading: '제1조 (목적)',
      body: [
        `본 약관은 ${footer.businessName?.split('|')[0]?.replace('상호명:', '').trim() || '유니버랩미디어'}(이하 "회사")가 운영하는 웹사이트 및 회사가 제공하는 영상 기획·촬영·편집·마케팅 관련 서비스(이하 "서비스")의 이용 조건과 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.`,
      ],
    },
    {
      heading: '제2조 (약관의 효력 및 변경)',
      body: [
        '본 약관은 웹사이트에 게시함으로써 효력이 발생합니다.',
        '회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 시행일자와 변경 내용을 웹사이트에 게시합니다.',
      ],
    },
    {
      heading: '제3조 (서비스의 내용)',
      body: [
        '회사는 영상 기획, 촬영, 편집, 채널 운영 대행 및 이에 부수하는 마케팅 서비스를 제공합니다.',
        '구체적인 과업 범위, 제작 기간, 수정 횟수, 대금 및 지급 조건은 회사와 이용자가 개별적으로 체결하는 계약 또는 견적서에 따릅니다. 개별 계약의 내용이 본 약관과 다른 경우 개별 계약이 우선합니다.',
      ],
    },
    {
      heading: '제4조 (문의 및 상담)',
      body: [
        '이용자는 웹사이트의 문의 양식을 통해 상담을 신청할 수 있습니다. 상담 신청 시 제공되는 개인정보의 처리에 관하여는 회사의 개인정보처리방침이 적용됩니다.',
        '문의 내용이 사실과 다르거나 확인이 어려운 경우 상담 및 견적 제공이 제한될 수 있습니다.',
      ],
    },
    {
      heading: '제5조 (이용자의 의무)',
      body: [
        '이용자는 서비스 이용 시 관련 법령 및 본 약관을 준수하여야 하며, 다음 각 호의 행위를 하여서는 안 됩니다.',
        '1. 타인의 정보를 도용하거나 허위 정보를 제공하는 행위\n2. 회사 또는 제3자의 지식재산권을 침해하는 행위\n3. 회사의 서비스 운영을 고의로 방해하는 행위',
      ],
    },
    {
      heading: '제6조 (지식재산권 및 결과물의 귀속)',
      body: [
        '웹사이트에 게시된 콘텐츠, 제작 사례, 상표 및 로고에 대한 권리는 회사 또는 정당한 권리자에게 있습니다.',
        '용역 결과물의 저작권 및 이용 범위는 개별 계약에서 정한 바에 따릅니다. 회사는 별도의 합의가 없는 한 제작 결과물을 포트폴리오 및 홍보 목적으로 활용할 수 있습니다.',
      ],
    },
    {
      heading: '제7조 (면책)',
      body: [
        '회사는 천재지변, 이용자의 귀책사유, 제3자 플랫폼(유튜브 등)의 정책 변경 등 회사의 합리적 통제를 벗어난 사유로 발생한 손해에 대하여 책임을 지지 않습니다.',
        '회사는 서비스를 통해 특정한 조회수·구독자 수 등 성과를 보증하지 않으며, 성과는 콘텐츠 주제, 시장 상황, 플랫폼 알고리즘 등에 따라 달라질 수 있습니다.',
      ],
    },
    {
      heading: '제8조 (분쟁 해결 및 관할)',
      body: [
        '본 약관 및 서비스 이용과 관련하여 분쟁이 발생한 경우 회사와 이용자는 상호 협의하여 원만히 해결하도록 노력합니다.',
        '협의가 이루어지지 않는 경우 관할 법원은 민사소송법이 정하는 바에 따릅니다.',
      ],
    },
    {
      heading: '문의처',
      body: [
        `${footer.businessName || ''}\n${footer.address || ''}\n${footer.phone || ''}\n${footer.email || ''}`,
      ],
    },
  ];

  return (
    <LegalDoc
      eyebrow="Terms of Use"
      title="이용약관"
      path="/policy"
      description="유니버랩 미디어 웹사이트 및 영상 제작 서비스 이용약관입니다."
      sections={sections}
    />
  );
}

export function Privacy() {
  const { footer } = useContent('global');
  const sections = [
    {
      heading: '1. 개인정보의 수집 항목 및 방법',
      body: [
        '회사는 웹사이트의 프로젝트 문의 양식을 통해 아래의 개인정보를 수집합니다.',
        '· 필수 항목: 브랜드·회사명, 담당자 성함, 연락처(휴대전화번호)\n· 선택 항목: 담당자 직책, 운영 중인 채널 URL, 사업체 소개, 벤치마킹 채널 URL, 투자 가능 예산, 희망 서비스, 의뢰 사유, 운영 목표, 유입 경로',
        '그 밖에 서비스 이용 과정에서 접속 로그, 쿠키, 기기·브라우저 정보가 자동으로 생성되어 수집될 수 있습니다.',
      ],
    },
    {
      heading: '2. 개인정보의 수집 및 이용 목적',
      body: [
        '· 문의 접수 확인 및 상담 응대\n· 견적 산출 및 서비스 제안\n· 계약의 체결·이행에 관한 협의\n· 서비스 개선을 위한 통계 분석',
      ],
    },
    {
      heading: '3. 개인정보의 보유 및 이용 기간',
      body: [
        '회사는 수집 목적이 달성되면 지체 없이 개인정보를 파기합니다. 다만 상담 이력 관리를 위해 문의 접수일로부터 3년간 보관하며, 정보주체가 그 전에 삭제를 요청하는 경우 즉시 파기합니다.',
        '관계 법령에 따라 보존이 필요한 경우 해당 법령이 정한 기간 동안 보관합니다.',
      ],
    },
    {
      heading: '4. 개인정보의 제3자 제공',
      body: [
        '회사는 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 특별한 규정이 있거나 수사기관의 적법한 요청이 있는 경우는 예외로 합니다.',
      ],
    },
    {
      heading: '5. 개인정보 처리의 위탁',
      body: [
        '회사는 서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.',
        '· Railway (인프라·데이터베이스 호스팅)\n· Resend (문의 내용 이메일 발송)\n· 채널코퍼레이션 채널톡 (실시간 상담 운영)\n· Google Analytics (웹사이트 이용 통계 분석)',
        '회사는 위탁계약 체결 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.',
      ],
    },
    {
      heading: '6. 정보주체의 권리와 행사 방법',
      body: [
        '정보주체는 언제든지 개인정보의 열람, 정정, 삭제, 처리정지 및 동의 철회를 요구할 수 있습니다.',
        `권리 행사는 아래 연락처를 통해 요청하실 수 있으며, 회사는 지체 없이 조치합니다.`,
      ],
    },
    {
      heading: '7. 쿠키 및 분석 도구',
      body: [
        '회사는 서비스 이용 현황 분석을 위해 Google Analytics를 사용하며, 이 과정에서 쿠키가 사용될 수 있습니다.',
        '정보주체는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 일부 기능 이용에 제한이 있을 수 있습니다.',
      ],
    },
    {
      heading: '8. 개인정보의 안전성 확보 조치',
      body: [
        '회사는 개인정보의 안전한 처리를 위해 접근 권한 관리, 전송 구간 암호화(HTTPS), 접근 기록 보관 등의 조치를 취하고 있습니다.',
      ],
    },
    {
      heading: '9. 개인정보 보호책임자',
      body: [
        `개인정보 처리에 관한 문의, 불만 처리, 피해 구제는 아래로 연락해 주시기 바랍니다.`,
        `${footer.businessName || ''}\n${footer.address || ''}\n${footer.phone || ''}\n${footer.email || ''}`,
        '기타 개인정보 침해에 대한 신고나 상담이 필요하신 경우 개인정보침해신고센터(privacy.kisa.or.kr, 국번없이 118)에 문의하실 수 있습니다.',
      ],
    },
    {
      heading: '10. 개인정보처리방침의 변경',
      body: [
        '본 방침의 내용 추가, 삭제 및 수정이 있을 경우 시행일자 7일 전부터 웹사이트를 통해 고지합니다.',
      ],
    },
  ];

  return (
    <LegalDoc
      eyebrow="Privacy Policy"
      title="개인정보처리방침"
      path="/privacy"
      description="유니버랩 미디어가 수집하는 개인정보의 항목, 이용 목적, 보유 기간 및 정보주체의 권리를 안내합니다."
      sections={sections}
    />
  );
}
