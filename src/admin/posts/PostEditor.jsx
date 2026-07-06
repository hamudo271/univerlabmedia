import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import RichTextEditor from "./RichTextEditor.jsx";
import { adminPostsApi, uploadsApi } from "../../lib/api.js";
import { slugify } from "../../../shared/slugify.js";
import { POST_CATEGORIES } from "../../../shared/post-categories.js";

const AUTOSAVE_MS = 5 * 60 * 1000; // 5 minutes

const BLANK = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  thumbnailUrl: "",
  category: "",
  status: "DRAFT",
};

/**
 * Create / edit a post. Pass `postId` to edit; omit for a new post.
 * Autosaves (silently, preserving publish state) every 5 minutes when dirty.
 */
export default function PostEditor({ postId }) {
  const navigate = useNavigate();
  const [id, setId] = useState(postId || null);
  const [form, setForm] = useState(BLANK);
  const [slugTouched, setSlugTouched] = useState(Boolean(postId));
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [thumbUploading, setThumbUploading] = useState(false);

  const dirtyRef = useRef(false);
  const formRef = useRef(form);
  formRef.current = form;

  // Load existing post for edit mode.
  useEffect(() => {
    if (!postId) return;
    let alive = true;
    (async () => {
      try {
        const p = await adminPostsApi.get(postId);
        if (!alive) return;
        setForm({
          title: p.title,
          slug: p.slug,
          content: p.content,
          excerpt: p.excerpt,
          thumbnailUrl: p.thumbnailUrl || "",
          category: p.category || "",
          status: p.status,
        });
      } catch (err) {
        if (alive) setError(err.message || "불러오기 실패");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [postId]);

  const update = useCallback((patch) => {
    dirtyRef.current = true;
    setForm((f) => ({ ...f, ...patch }));
  }, []);

  const previewSlug = slugTouched ? form.slug : slugify(form.title);

  // Core save. `status` overrides the persisted status; `silent` hides UI churn
  // (used by autosave). Creates on first save, updates thereafter.
  const save = useCallback(
    async (status, { silent = false } = {}) => {
      const f = formRef.current;
      if (!f.title.trim()) {
        if (!silent) setError("제목을 입력해 주세요.");
        return null;
      }
      if (!silent) setSaving(true);
      setError(null);
      const payload = {
        title: f.title.trim(),
        slug: slugTouched ? f.slug.trim() : slugify(f.title),
        content: f.content,
        excerpt: f.excerpt,
        thumbnailUrl: f.thumbnailUrl || null,
        category: f.category,
        status,
      };
      try {
        let saved;
        if (id) {
          saved = await adminPostsApi.update(id, payload);
        } else {
          saved = await adminPostsApi.create(payload);
          setId(saved.id);
        }
        dirtyRef.current = false;
        setLastSaved(new Date());
        // Sync canonical slug/status back from the server.
        setForm((cur) => ({
          ...cur,
          slug: saved.slug,
          status: saved.status,
        }));
        setSlugTouched(true);
        // Move the URL to the edit route once created (without a remount race).
        if (!id && saved.id) {
          window.history.replaceState(null, "", `/admin/posts/${saved.id}/edit`);
        }
        return saved;
      } catch (err) {
        setError(err.message || "저장 실패");
        return null;
      } finally {
        if (!silent) setSaving(false);
      }
    },
    [id, slugTouched]
  );

  // Autosave loop: every 5 minutes, if there are unsaved changes, persist them
  // WITHOUT changing publish state.
  useEffect(() => {
    const t = setInterval(() => {
      if (dirtyRef.current && formRef.current.title.trim()) {
        save(formRef.current.status, { silent: true });
      }
    }, AUTOSAVE_MS);
    return () => clearInterval(t);
  }, [save]);

  async function onPickThumb(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setThumbUploading(true);
    try {
      const { url } = await uploadsApi.create(file);
      update({ thumbnailUrl: url });
    } catch (err) {
      setError(`썸네일 업로드 실패: ${err.message || err}`);
    } finally {
      setThumbUploading(false);
    }
  }

  if (loading) {
    return <div className="text-slate-400 py-12 text-center">불러오는 중…</div>;
  }

  const published = form.status === "PUBLISHED";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/posts"
            className="text-slate-400 hover:text-white text-sm transition"
          >
            ← 목록
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {id ? "글 수정" : "새 글 작성"}
          </h1>
          {published && (
            <span className="rounded-full bg-emerald-900/50 border border-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              발행됨
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {lastSaved && (
            <span>
              저장됨 {lastSaved.getHours().toString().padStart(2, "0")}:
              {lastSaved.getMinutes().toString().padStart(2, "0")}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-rose-900/40 border border-rose-700 text-rose-200 text-sm p-3">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <Field label="제목">
          <input
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="글 제목"
            className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2.5 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Field>

        {/* Slug */}
        <Field label="슬러그 (URL)" hint="비워두면 제목에서 자동 생성됩니다.">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm font-mono">/column/</span>
            <input
              value={previewSlug}
              onChange={(e) => {
                setSlugTouched(true);
                update({ slug: e.target.value });
              }}
              placeholder="자동 생성"
              className="flex-1 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Field>

        {/* Category */}
        <Field label="카테고리">
          <select
            value={form.category}
            onChange={(e) => update({ category: e.target.value })}
            className="rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">(없음)</option>
            {POST_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        {/* Thumbnail */}
        <Field label="썸네일">
          <div className="flex items-center gap-4">
            {form.thumbnailUrl ? (
              <img
                src={form.thumbnailUrl}
                alt="썸네일 미리보기"
                className="h-20 w-32 rounded-md object-cover border border-slate-700"
              />
            ) : (
              <div className="h-20 w-32 rounded-md border border-dashed border-slate-700 grid place-items-center text-[11px] text-slate-600">
                없음
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm transition">
                {thumbUploading ? "업로드 중…" : "이미지 선택"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickThumb}
                  disabled={thumbUploading}
                />
              </label>
              {form.thumbnailUrl && (
                <button
                  type="button"
                  onClick={() => update({ thumbnailUrl: "" })}
                  className="px-3 py-1.5 rounded text-rose-300 hover:bg-rose-900/40 text-sm transition"
                >
                  제거
                </button>
              )}
            </div>
          </div>
        </Field>

        {/* Excerpt */}
        <Field label="요약 (목록·SEO 설명)" hint="비워두면 본문 앞부분이 사용됩니다.">
          <textarea
            value={form.excerpt}
            onChange={(e) => update({ excerpt: e.target.value })}
            rows={2}
            placeholder="한두 문장으로 글을 요약하세요."
            className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </Field>

        {/* Body */}
        <Field label="본문">
          <RichTextEditor
            value={form.content}
            onChange={(html) => update({ content: html })}
          />
        </Field>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => save("DRAFT")}
            disabled={saving}
            className="px-5 py-2.5 rounded-md border border-slate-700 text-slate-200 hover:border-slate-500 disabled:opacity-40 transition font-semibold"
          >
            {saving ? "저장 중…" : "임시저장"}
          </button>
          <button
            type="button"
            onClick={async () => {
              const saved = await save("PUBLISHED");
              if (saved) navigate("/admin/posts");
            }}
            disabled={saving}
            className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold transition"
          >
            {published ? "발행 상태로 저장" : "발행하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="block">
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
