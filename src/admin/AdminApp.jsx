import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import Login from "./Login.jsx";
import AdminLayout from "./AdminLayout.jsx";
import PageEditor from "./PageEditor.jsx";
import Stats from "./Stats.jsx";
import PostsLayout from "./posts/PostsLayout.jsx";
import PostList from "./posts/PostList.jsx";
import PostEditor from "./posts/PostEditor.jsx";
import InquiryList from "./inquiries/InquiryList.jsx";
import InquiryDetail from "./inquiries/InquiryDetail.jsx";
import Analytics from "./insights/Analytics.jsx";
import { authApi, getToken, clearToken } from "../lib/api.js";
import { pageOrder } from "../../shared/content-schema.js";

/**
 * AdminApp — gatekeeper. If no valid token, shows <Login>. Otherwise routes:
 *   /admin/posts*        → 칼럼 관리 (밝은 DCD 스타일 레이아웃)
 *   /admin/pages/:key    → 페이지 콘텐츠 CMS (기존 다크 레이아웃)
 *   /admin/inquiries*    → 문의 관리 (다크 레이아웃)
 *   /admin/analytics     → 유입 분석 — 자체 방문 집계 (다크 레이아웃)
 *   /admin/stats         → 방문자 통계 — GA4 (다크 레이아웃)
 * 칼럼 관리를 기본 랜딩으로 둔다.
 */
export default function AdminApp() {
  const [authState, setAuthState] = useState("checking"); // checking | authed | anon

  useEffect(() => {
    let mounted = true;
    async function check() {
      if (!getToken()) {
        if (mounted) setAuthState("anon");
        return;
      }
      try {
        await authApi.me();
        if (mounted) setAuthState("authed");
      } catch {
        clearToken();
        if (mounted) setAuthState("anon");
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, []);

  if (authState === "checking") {
    return (
      <div className="min-h-screen w-full bg-bg-secondary text-text-secondary flex items-center justify-center">
        로딩 중…
      </div>
    );
  }

  if (authState === "anon") {
    return <Login onSuccess={() => setAuthState("authed")} />;
  }

  const logout = () => {
    clearToken();
    setAuthState("anon");
  };

  return (
    <Routes>
      <Route index element={<Navigate to="posts" replace />} />

      {/* 칼럼 관리 (밝은 레이아웃) */}
      <Route
        path="posts"
        element={<PostsLayout onLogout={logout}><PostList /></PostsLayout>}
      />
      <Route
        path="posts/new"
        element={<PostsLayout onLogout={logout}><PostEditor /></PostsLayout>}
      />
      <Route
        path="posts/:id/edit"
        element={<PostsLayout onLogout={logout}><PostEditorKeyed /></PostsLayout>}
      />

      {/* 페이지 콘텐츠 CMS (다크 레이아웃) */}
      <Route
        path="pages/:pageKey"
        element={
          <AdminLayout onLogout={logout}>
            <PageEditorRoute />
          </AdminLayout>
        }
      />

      {/* 문의 관리 */}
      <Route
        path="inquiries"
        element={
          <AdminLayout onLogout={logout} wide>
            <InquiryList />
          </AdminLayout>
        }
      />
      <Route
        path="inquiries/:id"
        element={
          <AdminLayout onLogout={logout}>
            <InquiryDetailKeyed />
          </AdminLayout>
        }
      />

      {/* 유입 분석 (자체 방문 집계 + 문의) */}
      <Route
        path="analytics"
        element={
          <AdminLayout onLogout={logout} wide>
            <Analytics />
          </AdminLayout>
        }
      />

      {/* 방문자 통계 (GA4) */}
      <Route
        path="stats"
        element={
          <AdminLayout onLogout={logout}>
            <Stats />
          </AdminLayout>
        }
      />

      <Route path="*" element={<Navigate to="posts" replace />} />
    </Routes>
  );
}

// Remount the editor when switching between posts so its internal load resets.
function PostEditorKeyed() {
  const { id } = useParams();
  return <PostEditor key={id} />;
}

// Remount when jumping between inquiries (e.g. "같은 번호로 들어온 다른 문의").
function InquiryDetailKeyed() {
  const { id } = useParams();
  return <InquiryDetail key={id} />;
}

// Tiny wrapper so we can read the URL param + guard unknown page keys.
function PageEditorRoute() {
  const { pageKey } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!pageOrder.includes(pageKey)) {
      navigate(`/admin/pages/${pageOrder[0]}`, { replace: true });
    }
  }, [pageKey, navigate]);
  if (!pageOrder.includes(pageKey)) return null;
  return <PageEditor key={pageKey} pageKey={pageKey} />;
}
