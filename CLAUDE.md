# CLAUDE.md — 유니버랩 미디어

영상 기획·촬영·편집·마케팅 원스톱 에이전시 마케팅 사이트. React SPA(라이트 테마 전용) + Express API + Postgres CMS, Railway 배포(`main` push → 자동 배포, 도메인 univerlabmedia.co.kr).

## 실행

```bash
npm run dev        # vite(5173) + express(3000) 동시 (concurrently)
npm run dev:vite   # 프론트만 (API 없으면 콘텐츠는 defaults 폴백)
npm run build      # sitemap 생성 → vite build (dist/)
npm start          # 프로덕션: node server/index.js (dist + API 서빙)
npm run lint       # eslint (아래 "알려진 lint" 참고)
```

## 구조와 역할

```
index.html                    메타/OG/JSON-LD, 검색엔진 verification, Pretendard, favicon
src/
  main.jsx                    진입점. Provider 순서: Helmet → Router → Content → App
  App.jsx                     라우팅. /admin/* = AdminApp, /* = PublicSite
  index.css                   Tailwind v4 @theme + :root CSS 변수(라이트 전용) + 커스텀 클래스/키프레임
  pages/                      라우트 페이지 (Home, Company, Service, ServiceDetail, Portfolio, Pricing, Contact, Column, NotFound)
  components/
    layout/                   Header(스크롤/햄버거), Footer, Layout
    home/                     Home 섹션들: HeroSlider, BrandIntro, Cases, Partners, Testimonials,
                              Growth, Safety, Process, Services, FinalCta, ScarcityBar
    common/                   ui.jsx(공유 프리미티브), FaqAccordion, SEO, SmoothScroll, ScrollToTop, TopProgressBar
  context/                    ContentContext(CMS 로딩/머지)
  lib/api.js                  fetch 래퍼 (/api, JWT 주입)
  admin/                      /admin CMS 편집 UI (공개 사이트와 컴포넌트 공유 안 함)
shared/
  content-defaults.js         모든 페이지 기본 콘텐츠(단일 소스). DB 시드 + 오프라인 폴백
  pricing-packages.js         영상/숏폼 패키지 배열 (home + pricing 공유)
  content-schema.js           콘텐츠 스키마/페이지 순서
server/
  index.js                    Express 부팅: 마이그레이션 → 시드 → listen. 미들웨어/정적/SPA fallback/301
  db.js                       pg Pool, runMigrations, seedDefaultsIfMissing (ON CONFLICT DO NOTHING)
  routes/                     auth, content, uploads, contact(Resend)
  migrations/                 *.sql (순차 적용, _migrations 테이블로 추적)
scripts/generate-sitemap.mjs  빌드 시 public/sitemap.xml 생성
```

## 자주 만지는 핵심 모듈

- **콘텐츠 수정**: `shared/content-defaults.js` — 페이지 문구/이미지/목록의 단일 소스. 각 top-level 키 = `content_entries` 한 행.
- **가격 변경**: `shared/pricing-packages.js` — home 티저와 Pricing 페이지가 **둘 다** 여기서 읽음. ⚠️ `serviceDetail.services[].pricing`은 **별도 shape**(`{name, price, vat}`)라 여기 안 씀 — 가격 바꾸면 이쪽도 확인.
- **공유 UI**: `src/components/common/ui.jsx` — `EASE_STANDARD`, `fadeInUp`, `stagger`, `Accented`, `PageHero`, `SectionHeader`, `CTABand`, `VideoLightbox`. 새 페이지는 여기서 import (재정의 금지).
- **FAQ**: `src/components/common/FaqAccordion.jsx` — Home/Contact 공용. 콘텐츠는 항상 `home.faq`에서 읽음(Contact 포함).
- **CMS 로딩**: `src/context/ContentContext.jsx` — `useContent('home')` 등으로 슬라이스 소비. `/api/content` 응답을 defaults 위에 **deep-merge**(객체는 재귀, 배열은 통째 교체).
- **문의 메일**: `server/routes/contact.js` — Resend REST. 필수 필드 검증 + 허니팟(`_hp`).
- **칼럼/블로그 (Posts)**: `content_entries`와 **완전히 별개인 `posts` 테이블**(migration `003_posts.sql`). content-defaults 아님 — DB 직결.
  - 공개 API `server/routes/posts.js`(무인증): `GET /api/posts`(발행글, 9개 페이지네이션+카테고리), `/latest`(홈 3개), `/:slug`(조회수 +1). 관리자 API `server/routes/adminPosts.js`(`authRequired` 필수, DB 없으면 503): 목록/단건/생성/수정/`PATCH :id/status`/삭제. row↔camel 매핑·slug 유일화는 `server/lib/posts.js`.
  - slug: `shared/slugify.js`(한글 보존, 로마자화 안 함). 카테고리 목록: `shared/post-categories.js`.
  - 공개 화면: `src/pages/Column.jsx`(목록, 발행글 0개면 `column.list.items` 정적 폴백), `src/pages/ColumnDetail.jsx`(`/column/:slug`), 홈 `src/components/home/ColumnHighlights.jsx`(최신 3, 글 없으면 렌더 안 함).
  - 관리자 UI: `src/admin/posts/`(PostList, PostEditor, RichTextEditor). **Tiptap 에디터**(StarterKit v3 = link·list·blockquote 내장, Image만 별도). 이미지·썸네일은 기존 `/api/uploads`(multer+sharp) 재사용 — Cloudinary 아님. 5분 자동 임시저장.
  - **AdminApp은 `App.jsx`에서 `lazy()` 코드 분할** — Tiptap이 공개 번들에 안 들어감. admin 관련 import는 이 지연 경계 안에서만.

## 코딩 컨벤션

- 컴포넌트: 함수형 + 화살표, `export default`. 파일당 1 섹션 컴포넌트.
- 애니메이션: framer-motion. entrance는 `variants={fadeInUp}` + `whileInView`/`viewport={{ once: true }}`. easing은 `EASE_STANDARD` 사용(raw 튜플 재작성 금지).
- 스타일: Tailwind v4 유틸 + `--*` CSS 변수 토큰(`bg-bg-primary`, `text-text-primary`, `border-border-primary`, `bg-brand-gradient`, `text-gradient`). **라이트 전용 — `dark:` 유틸 쓰지 말 것**.
- 콘텐츠: JSX에 문자열 하드코딩 금지 → `content-defaults.js`에 넣고 `useContent`로 소비. 강조는 `<Accented text accent>`.
- 서버: 라우트는 `async`, 에러는 `errorHandler`가 JSON `{ error }`로. DB 없으면 503 또는 defaults 폴백.
- 네이밍: camelCase 변수/함수, PascalCase 컴포넌트.

## 외부 의존성

- 프론트: react 19, react-router 7, framer-motion 12, lenis 1.3(`window.lenis` 노출), tailwindcss 4, lucide-react, react-helmet-async.
- 서버: express 5, pg, jsonwebtoken, bcryptjs, multer, sharp(이미지 리사이즈), helmet, compression, cors.
- 메일: **Resend** REST API (npm 패키지 없이 `fetch`).
- 폰트: Pretendard (jsDelivr CDN).

### 환경 변수 (하드코딩 금지)
`DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD`(또는 `ADMIN_PASSWORD_HASH`), `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `PORT`, `UPLOAD_DIR`.

## 작업 시 주의사항

- **DB가 defaults를 가림**: `seedDefaultsIfMissing`은 `ON CONFLICT DO NOTHING` — 이미 시드된 행은 **절대 안 덮어씀**. `content-defaults.js`를 바꿔도 라이브 값이 안 바뀔 수 있음 → 필요 시 마이그레이션으로 해당 행 갱신(과거 `002_refresh_global_contact.sql` 패턴).
- **가격은 두 shape**: `pricing-packages.js`(home/pricing) ↔ `serviceDetail.services[].pricing`(가격 포함). 한쪽만 고치면 불일치.
- **deep-merge 형태 유지**: `content-defaults.js` 구조를 바꾸면 기존 DB 행과 머지가 어긋남. 값만 바꾸고 shape는 유지.
- **`ui.jsx` 프리미티브 재정의 금지**: `fadeInUp`/`SectionHeader`/`VideoLightbox` 등은 import해서 쓸 것(과거 Home.jsx가 복붙해 중복 발생했음).
- **라이트 전용**: 테마 토글/ThemeContext 없음. `dark:` 클래스나 `:root.dark` 추가하지 말 것.
- **Header 오버레이**: 모바일 풀스크린 메뉴는 `<header>`의 **형제**여야 함(header의 backdrop-blur가 containing block이 되어 `fixed`가 깨짐). 스크롤 락은 `window.lenis?.stop()` 포함.
- **Railway 빌드 해시 ≠ 로컬 해시**: 배포 확인은 자산 해시가 아니라 DOM/동작으로.
- **칼럼 상세는 서버 prerender**: CSR SPA라 `/column/:slug`는 Express가 `renderColumnPost`로 셸 HTML에 title/OG/JSON-LD+본문을 **주입**해 내려줌(index.js, 정적 서빙 앞단). ⚠️ `index.html`의 head 태그 텍스트를 정규식으로 치환하므로, **head의 meta/og 태그 구조를 바꾸면 `server/lib/renderColumnPost.js`의 정규식도 같이 고쳐야** 함. `window.__POST__`로 클라이언트 첫 페인트도 즉시.
- **sitemap은 이제 동적**: `GET /sitemap.xml`을 Express가 DB의 발행글 포함해 생성(정적 `public/sitemap.xml`보다 우선). 빌드 스크립트의 정적 파일은 폴백.
- **마이그레이션 자동 적용**: 부팅 시 `runMigrations()`가 신규 `*.sql` 순차 적용 → Railway는 빌드 커맨드에 별도 마이그레이션 불필요. `posts` 테이블도 이 경로로 생성됨.
- **업로드는 영속 볼륨 필요**: 썸네일/에디터 이미지는 `UPLOAD_DIR`(프로덕션 `/app/uploads`) 디스크 저장 → Railway Volume 마운트 안 하면 재배포 시 이미지 소실.
- **알려진 lint**(리팩토링과 무관, 기존): eslint flat config가 framer-motion `motion.*` 사용을 인식 못 해 `'motion' is defined but never used` 다수 발생 + ContentContext/ui.jsx의 `react-refresh/only-export-components`. **빌드에는 영향 없음**. 새로 도입 금지이지 기존 것은 무시.
