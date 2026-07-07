import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Pencil, Trash2, Eye, PlusCircle, Globe, EyeOff } from 'lucide-react';
import { adminPostsApi } from '../../lib/api.js';

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function StatusBadge({ status }) {
  const published = status === 'PUBLISHED';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
        published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {published ? '발행' : '임시저장'}
    </span>
  );
}

export default function PostList() {
  const [posts, setPosts] = useState(null);
  const [busy, setBusy] = useState(null); // 처리 중인 id
  const [error, setError] = useState('');

  const load = () =>
    adminPostsApi
      .list()
      .then((d) => setPosts(d.items))
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const toggle = async (p) => {
    setBusy(p.id);
    try {
      await adminPostsApi.setStatus(p.id, p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED');
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`"${p.title}" 글을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    setBusy(p.id);
    try {
      await adminPostsApi.remove(p.id);
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!posts) {
    return (
      <div className="grid place-items-center py-20 text-text-secondary">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black">
          칼럼 글 <span className="text-text-secondary/60 font-normal">({posts.length})</span>
        </h1>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-1.5 bg-accent-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-accent-primary/90 transition-colors"
        >
          <PlusCircle size={16} /> 새 글 작성
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-black/10 rounded-2xl p-16 text-center text-text-secondary">
          아직 글이 없습니다. 첫 글을 작성해보세요.
        </div>
      ) : (
        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-text-secondary/70">
                <th className="px-5 py-3 font-medium">제목</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">상태</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">발행일</th>
                <th className="px-3 py-3 font-medium whitespace-nowrap">조회수</th>
                <th className="px-3 py-3 font-medium text-right">작업</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-black/5 last:border-0 hover:bg-bg-secondary/40">
                  <td className="px-5 py-3">
                    <Link to={`/admin/posts/${p.id}/edit`} className="font-medium hover:text-accent-primary line-clamp-1">
                      {p.title}
                    </Link>
                    <span className="block text-xs text-text-secondary/50">
                      {p.category ? `${p.category} · ` : ''}/{p.slug}
                    </span>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-3 py-3 whitespace-nowrap text-text-secondary">
                    {p.publishedAt ? fmtDate(p.publishedAt) : '—'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-text-secondary">
                    <span className="inline-flex items-center gap-1"><Eye size={13} /> {p.viewCount}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggle(p)}
                        disabled={busy === p.id}
                        title={p.status === 'PUBLISHED' ? '비공개로 전환' : '발행하기'}
                        className="p-2 rounded-lg text-text-secondary hover:bg-bg-secondary disabled:opacity-40"
                      >
                        {busy === p.id ? <Loader2 size={15} className="animate-spin" /> : p.status === 'PUBLISHED' ? <EyeOff size={15} /> : <Globe size={15} />}
                      </button>
                      <Link to={`/admin/posts/${p.id}/edit`} title="수정" className="p-2 rounded-lg text-text-secondary hover:bg-bg-secondary">
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => remove(p)}
                        disabled={busy === p.id}
                        title="삭제"
                        className="p-2 rounded-lg text-text-secondary hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      >
                        <Trash2 size={15} />
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
