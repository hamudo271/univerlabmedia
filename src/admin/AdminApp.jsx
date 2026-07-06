import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login.jsx";
import AdminLayout from "./AdminLayout.jsx";
import PageEditor from "./PageEditor.jsx";
import PostList from "./posts/PostList.jsx";
import PostEditor from "./posts/PostEditor.jsx";
import { authApi, getToken, clearToken } from "../lib/api.js";
import { pageOrder } from "../../shared/content-schema.js";

/**
 * AdminApp — gatekeeper. If no valid token, shows <Login>. Otherwise mounts
 * the admin layout + nested routes under /admin/pages/:pageKey.
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
      <div className="min-h-screen w-full bg-slate-950 text-slate-400 flex items-center justify-center">
        로딩 중…
      </div>
    );
  }

  if (authState === "anon") {
    return <Login onSuccess={() => setAuthState("authed")} />;
  }

  return (
    <AdminLayout onLogout={() => setAuthState("anon")}>
      <Routes>
        <Route
          index
          element={<Navigate to={`pages/${pageOrder[0]}`} replace />}
        />
        <Route path="pages/:pageKey" element={<PageEditorRoute />} />
        <Route path="posts" element={<PostList />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/:id/edit" element={<PostEditorRoute2 />} />
        <Route path="*" element={<Navigate to={`pages/${pageOrder[0]}`} replace />} />
      </Routes>
    </AdminLayout>
  );
}

// Tiny wrapper so we can read the URL param.
import { useParams } from "react-router-dom";
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

// Post editor in edit mode — keyed by id so switching posts remounts cleanly.
function PostEditorRoute2() {
  const { id } = useParams();
  return <PostEditor key={id} postId={id} />;
}
