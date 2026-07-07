import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import Login from "./Login.jsx";
import AdminLayout from "./AdminLayout.jsx";
import PageEditor from "./PageEditor.jsx";
import PostsLayout from "./posts/PostsLayout.jsx";
import PostList from "./posts/PostList.jsx";
import PostEditor from "./posts/PostEditor.jsx";
import { authApi, getToken, clearToken } from "../lib/api.js";
import { pageOrder } from "../../shared/content-schema.js";

/**
 * AdminApp — gatekeeper. If no valid token, shows <Login>. Otherwise routes:
 *   /admin/posts*        → 칼럼 관리 (밝은 DCD 스타일 레이아웃)
 *   /admin/pages/:key    → 페이지 콘텐츠 CMS (기존 다크 레이아웃)
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

      <Route path="*" element={<Navigate to="posts" replace />} />
    </Routes>
  );
}

// Remount the editor when switching between posts so its internal load resets.
function PostEditorKeyed() {
  const { id } = useParams();
  return <PostEditor key={id} />;
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
