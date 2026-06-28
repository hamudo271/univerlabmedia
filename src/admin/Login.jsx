import React, { useState } from "react";
import { authApi, setToken } from "../lib/api.js";

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await authApi.login(password);
      setToken(token);
      onSuccess?.();
    } catch (err) {
      setError(err.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5 shadow-xl"
      >
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500">
            Admin
          </div>
          <h1 className="text-xl font-bold text-white mt-0.5">
            유니버랩 미디어 CMS
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            관리자 비밀번호를 입력해 주세요.
          </p>
        </div>

        <label className="block">
          <span className="text-sm text-slate-200">비밀번호</span>
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {error && (
          <div className="rounded-md bg-rose-900/40 border border-rose-700 text-rose-200 text-sm p-2.5">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition"
        >
          {loading ? "확인 중…" : "로그인"}
        </button>

        <a
          href="/"
          className="block text-center text-xs text-slate-500 hover:text-slate-300 transition"
        >
          ← 사이트로 돌아가기
        </a>
      </form>
    </div>
  );
}
