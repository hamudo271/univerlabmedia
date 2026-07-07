import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, ImagePlus, X, Save, Globe, Check } from 'lucide-react';
import Editor from './Editor.jsx';
import { POST_CATEGORIES } from '../../../shared/post-categories.js';
import { adminPostsApi, uploadsApi } from '../../lib/api.js';

const AUTOSAVE_MS = 5 * 60 * 1000; // 5분

function fmtDateTime(d) {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '';
  const day = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  const time = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${time}`;
}

export default function PostEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = !id;

  const [loaded, setLoaded] = useState(isNew);
  const [postId, setPostId] = useState(id || null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const [saving, setSaving] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');
  const dirtyRef = useRef(false);
  const thumbRef = useRef(null);

  // 편집 모드: 기존 글 로드
  useEffect(() => {
    if (isNew) return;
    adminPostsApi
      .get(id)
      .then((post) => {
        setPostId(post.id);
        setTitle(post.title);
        setSlug(post.slug);
        setCategory(post.category || '');
        setExcerpt(post.excerpt || '');
        setThumbnailUrl(post.thumbnailUrl || '');
        setContent(post.content || '');
        setStatus(post.status);
        setLastSaved(post.updatedAt ? new Date(post.updatedAt) : null);
        setLoaded(true);
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 최신 상태 스냅샷 (자동저장 인터벌이 참조)
  const snap = useRef({});
  snap.current = { postId, title, slug, category, excerpt, thumbnailUrl, content, status, loaded, saving };

  const mark = (setter) => (v) => {
    dirtyRef.current = true;
    setFlash('');
    setter(v);
  };

  const persist = async ({ nextStatus, isAuto }) => {
    const s = snap.current;
    if (!s.title.trim()) {
      if (!isAuto) setError('제목을 입력해주세요.');
      return;
    }
    if (s.saving) return;
    setSaving(true);
    setError('');
    const payload = {
      title: s.title,
      slug: s.slug || undefined,
      category: s.category,
      excerpt: s.excerpt,
      thumbnailUrl: s.thumbnailUrl || null,
      content: s.content,
      status: nextStatus,
    };
    try {
      const saved = s.postId
        ? await adminPostsApi.update(s.postId, payload)
        : await adminPostsApi.create(payload);
      dirtyRef.current = false;
      setPostId(saved.id);
      setSlug(saved.slug);
      setStatus(saved.status);
      setLastSaved(new Date(saved.updatedAt || Date.now()));
      if (!isAuto) {
        setFlash(saved.status === 'PUBLISHED' ? '발행되었습니다.' : '저장되었습니다.');
        // 새 글 최초 저장 → URL을 edit 경로로 교정
        if (!s.postId) nav(`/admin/posts/${saved.id}/edit`, { replace: true });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // 자동 임시저장 (5분) — dirty이고 제목이 있을 때만, 현재 상태 유지
  useEffect(() => {
    const t = setInterval(() => {
      const s = snap.current;
      if (!s.loaded || s.saving || !dirtyRef.current || !s.title.trim()) return;
      persist({ nextStatus: s.status, isAuto: true });
    }, AUTOSAVE_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onThumb = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setThumbUploading(true);
      const { url } = await uploadsApi.create(file);
      dirtyRef.current = true;
      setThumbnailUrl(url);
    } catch (err) {
      alert(err.message || '썸네일 업로드 실패');
    } finally {
      setThumbUploading(false);
    }
  };

  if (error && !loaded) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/admin/posts" className="text-accent-primary">← 목록으로</Link>
      </div>
    );
  }
  if (!loaded) {
    return (
      <div className="grid place-items-center py-20 text-text-secondary">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const published = status === 'PUBLISHED';

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <Link to="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent-primary">
          <ArrowLeft size={15} /> 목록
        </Link>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs text-text-secondary inline-flex items-center gap-1"><Loader2 size={13} className="animate-spin" /> 저장 중</span>}
          {!saving && flash && <span className="text-xs text-green-700 inline-flex items-center gap-1"><Check size={13} /> {flash}</span>}
          {!saving && !flash && lastSaved && (
            <span className="text-xs text-text-secondary/60">마지막 저장 {fmtDateTime(lastSaved)}</span>
          )}
          <button
            onClick={() => persist({ nextStatus: 'DRAFT', isAuto: false })}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold border border-black/15 text-text-secondary hover:bg-bg-secondary disabled:opacity-50"
          >
            <Save size={15} /> 임시저장
          </button>
          <button
            onClick={() => persist({ nextStatus: 'PUBLISHED', isAuto: false })}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-accent-primary text-white hover:bg-accent-primary/90 disabled:opacity-50"
          >
            <Globe size={15} /> {published ? '발행 업데이트' : '발행하기'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* 본문 */}
        <div className="space-y-4 order-2 lg:order-1">
          <input
            value={title}
            onChange={(e) => mark(setTitle)(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full text-2xl font-black tracking-tight bg-transparent border-b border-black/10 pb-3 focus:border-accent-primary focus:outline-none placeholder-text-secondary/30"
          />
          <Editor initialContent={content} onChange={mark(setContent)} uploadImage={uploadsApi.create} />
        </div>

        {/* 사이드 설정 */}
        <aside className="space-y-5 order-1 lg:order-2">
          <div className="bg-white border border-black/10 rounded-xl p-4">
            <label className="block text-xs font-bold text-text-secondary/70 uppercase tracking-widest mb-2">상태</label>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {published ? '발행됨' : '임시저장'}
            </span>
          </div>

          <div className="bg-white border border-black/10 rounded-xl p-4">
            <label className="block text-xs font-bold text-text-secondary/70 uppercase tracking-widest mb-2">카테고리</label>
            <select
              value={category}
              onChange={(e) => mark(setCategory)(e.target.value)}
              className="w-full border border-black/15 rounded-lg px-3 py-2 text-sm focus:border-accent-primary focus:outline-none bg-white"
            >
              <option value="">(선택 안 함)</option>
              {POST_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-black/10 rounded-xl p-4">
            <label className="block text-xs font-bold text-text-secondary/70 uppercase tracking-widest mb-2">썸네일</label>
            {thumbnailUrl ? (
              <div className="relative">
                <img src={thumbnailUrl} alt="썸네일" className="w-full aspect-video object-cover rounded-lg border border-black/10" />
                <button
                  onClick={() => { dirtyRef.current = true; setThumbnailUrl(''); }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                  title="제거"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => thumbRef.current?.click()}
                disabled={thumbUploading}
                className="w-full aspect-video rounded-lg border-2 border-dashed border-black/15 grid place-items-center text-text-secondary/60 hover:border-accent-primary/40 hover:text-accent-primary transition-colors disabled:opacity-50"
              >
                {thumbUploading ? <Loader2 className="animate-spin" /> : <span className="inline-flex flex-col items-center gap-1 text-sm"><ImagePlus size={22} /> 이미지 업로드</span>}
              </button>
            )}
            <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={onThumb} />
          </div>

          <div className="bg-white border border-black/10 rounded-xl p-4">
            <label className="block text-xs font-bold text-text-secondary/70 uppercase tracking-widest mb-2">발췌 (선택)</label>
            <textarea
              value={excerpt}
              onChange={(e) => mark(setExcerpt)(e.target.value)}
              rows={3}
              placeholder="목록·검색결과에 노출됩니다. 비우면 본문에서 자동 추출."
              className="w-full border border-black/15 rounded-lg px-3 py-2 text-sm focus:border-accent-primary focus:outline-none resize-none"
            />
          </div>

          <div className="bg-white border border-black/10 rounded-xl p-4">
            <label className="block text-xs font-bold text-text-secondary/70 uppercase tracking-widest mb-2">슬러그 (URL)</label>
            <input
              value={slug}
              onChange={(e) => mark(setSlug)(e.target.value)}
              placeholder="비우면 제목에서 자동 생성"
              className="w-full border border-black/15 rounded-lg px-3 py-2 text-sm font-mono focus:border-accent-primary focus:outline-none"
            />
            <p className="text-xs text-text-secondary/50 mt-1.5 break-all">/column/{slug || '(자동)'}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
