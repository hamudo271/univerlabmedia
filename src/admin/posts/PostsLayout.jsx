import { NavLink, Link } from 'react-router-dom';
import { FileText, PlusCircle, ExternalLink, LogOut, LayoutPanelLeft, BarChart3 } from 'lucide-react';
import { pageOrder } from '../../../shared/content-schema.js';

function TabLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-secondary hover:bg-bg-secondary'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

/**
 * 칼럼 관리 전용 밝은 레이아웃 (상단 탭 네비). 페이지 콘텐츠 CMS(다크)와
 * 시각적으로 구분되는 별도 도구. 인증은 AdminApp 게이트가 이미 처리.
 */
export default function PostsLayout({ children, onLogout }) {
  return (
    <div className="min-h-screen bg-bg-secondary text-text-primary">
      <header className="bg-white border-b border-black/10 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-black tracking-tight whitespace-nowrap">유니버랩 칼럼</span>
            <nav className="flex items-center gap-1">
              <TabLink to="/admin/posts"><FileText size={15} /> 글 목록</TabLink>
              <TabLink to="/admin/posts/new"><PlusCircle size={15} /> 새 글</TabLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/stats"
              className="text-sm text-text-secondary hover:text-accent-primary inline-flex items-center gap-1"
            >
              <BarChart3 size={14} /> 방문자 통계
            </Link>
            <Link
              to={`/admin/pages/${pageOrder[0]}`}
              className="text-sm text-text-secondary hover:text-accent-primary inline-flex items-center gap-1"
            >
              <LayoutPanelLeft size={14} /> 페이지 편집
            </Link>
            <a
              href="/column"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-text-secondary hover:text-accent-primary inline-flex items-center gap-1"
            >
              사이트 <ExternalLink size={13} />
            </a>
            <button onClick={onLogout} className="text-sm text-text-secondary hover:text-red-600 inline-flex items-center gap-1">
              <LogOut size={14} /> 로그아웃
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
