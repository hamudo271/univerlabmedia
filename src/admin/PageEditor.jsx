import React, { useEffect, useMemo, useState } from "react";
import { schema } from "../../shared/content-schema.js";
import { defaults as CONTENT_DEFAULTS } from "../../shared/content-defaults.js";
import { contentApi } from "../lib/api.js";
import { useContentContext } from "../context/ContentContext.jsx";
import SectionEditor from "./SectionEditor.jsx";

export default function PageEditor({ pageKey }) {
  const pageSchema = schema[pageKey];
  const { content, refresh } = useContentContext();
  const initial = useMemo(
    () =>
      deepClone(content?.[pageKey] ?? CONTENT_DEFAULTS[pageKey] ?? {}),
    [content, pageKey]
  );

  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [error, setError] = useState(null);

  // Reset draft when switching pages or when the underlying content refreshes.
  useEffect(() => {
    setDraft(initial);
    setError(null);
  }, [initial]);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial]
  );

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    function beforeUnload(e) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  function updateSection(sectionKey, v) {
    setDraft((d) => ({ ...d, [sectionKey]: v }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await contentApi.save(pageKey, draft);
      await refresh();
      setLastSavedAt(new Date());
    } catch (err) {
      setError(err.message || "저장 실패");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    if (!dirty) return;
    if (confirm("변경사항을 모두 되돌리시겠습니까?")) {
      setDraft(initial);
    }
  }

  if (!pageSchema) {
    return <div className="text-slate-400">알 수 없는 페이지: {pageKey}</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-2xl font-bold text-white">{pageSchema.label}</h2>
          <p className="text-sm text-slate-400 mt-1">
            각 필드 옆의 태그(
            <span className="text-slate-300">H1/H2/Body/Button …</span>
            )는 실제 사이트에서 쓰이는 시맨틱 역할입니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastSavedAt && !dirty && (
            <span className="text-xs text-emerald-400">
              저장됨 · {lastSavedAt.toLocaleTimeString()}
            </span>
          )}
          {dirty && (
            <span className="text-xs text-amber-400">● 저장되지 않은 변경사항</span>
          )}
          <button
            onClick={reset}
            disabled={!dirty || saving}
            className="px-3 py-1.5 text-sm rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-100 transition"
          >
            되돌리기
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="px-4 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-md bg-rose-900/40 border border-rose-700 text-rose-200 text-sm p-3">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(pageSchema.sections).map(([sectionKey, section]) => (
          <SectionEditor
            key={sectionKey}
            sectionKey={sectionKey}
            section={section}
            value={draft[sectionKey]}
            onChange={(v) => updateSection(sectionKey, v)}
          />
        ))}
      </div>
    </div>
  );
}

function deepClone(v) {
  return JSON.parse(JSON.stringify(v ?? null));
}
