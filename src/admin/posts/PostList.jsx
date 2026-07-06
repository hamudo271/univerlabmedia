import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { adminPostsApi } from "../../lib/api.js";

/** Admin list of all posts: status, publish date, views + row actions. */
export default function PostList() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { items } = await adminPostsApi.list();
      setPosts(items);
    } catch (err) {
      setError(err.message || "불러오기 실패");
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStatus(post) {
    setBusyId(post.id);
    try {
      const next = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      await adminPostsApi.setStatus(post.id, next);
      await load();
    } catch (err) {
      setError(err.message || "상태 변경 실패");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(post) {
    if (!window.confirm(`"${post.title}" 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setBusyId(post.id);
    try {
      await adminPostsApi.remove(post.id);
      await load();
    } catch (err) {
      setError(err.message || "삭제 실패");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">칼럼 관리</h1>
          <p className="text-sm text-slate-400 mt-1">
            블로그 글 작성·수정·발행을 관리합니다.
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
        >
          + 새 글 작성
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-rose-900/40 border border-rose-700 text-rose-200 text-sm p-3">
          {error}
        </div>
      )}

      {posts === null ? (
        <div className="text-slate-400 py-12 text-center">불러오는 중…</div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 py-16 text-center text-slate-400">
          아직 작성된 글이 없습니다.{" "}
          <Link to="/admin/posts/new" className="text-blue-400 hover:underline">
            첫 글 작성하기
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-slate-400 text-left">
                <th className="px-4 py-3 font-medium">제목</th>
                <th className="px-4 py-3 font-medium w-28">상태</th>
                <th className="px-4 py-3 font-medium w-32">발행일</th>
                <th className="px-4 py-3 font-medium w-20 text-right">조회수</th>
                <th className="px-4 py-3 font-medium w-56 text-right">작업</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-800 hover:bg-slate-900/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-100">{p.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {p.category ? `${p.category} · ` : ""}
                      <span className="font-mono">/{p.slug}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400 tabular-nums">
                    {p.publishedAt ? fmtDate(p.publishedAt) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-300 tabular-nums">
                    {p.viewCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(p)}
                        disabled={busyId === p.id}
                        className="px-2.5 py-1.5 rounded border border-slate-700 text-slate-200 hover:border-slate-500 disabled:opacity-40 transition text-xs"
                      >
                        {p.status === "PUBLISHED" ? "임시저장으로" : "발행"}
                      </button>
                      <Link
                        to={`/admin/posts/${p.id}/edit`}
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 transition text-xs"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => remove(p)}
                        disabled={busyId === p.id}
                        className="px-2.5 py-1.5 rounded text-rose-300 hover:bg-rose-900/40 disabled:opacity-40 transition text-xs"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const published = status === "PUBLISHED";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        published
          ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
          : "bg-slate-800 text-slate-400 border border-slate-700"
      }`}
    >
      {published ? "발행됨" : "임시저장"}
    </span>
  );
}

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
