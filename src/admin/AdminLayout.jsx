import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { clearToken } from "../lib/api.js";

export default function AdminLayout({ children, onLogout }) {
  function handleLogout() {
    clearToken();
    onLogout?.();
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">
      <header className="h-14 shrink-0 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="font-bold tracking-wide">UNIVERLAB · ADMIN</div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-xs rounded border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition"
          >
            사이트 보기 ↗
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
