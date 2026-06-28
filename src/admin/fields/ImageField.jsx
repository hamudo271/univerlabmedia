import React, { useState } from "react";
import TagBadge from "./TagBadge.jsx";
import { uploadsApi } from "../../lib/api.js";

export default function ImageField({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(file) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const meta = await uploadsApi.create(file);
      onChange(meta.url);
    } catch (err) {
      setError(err.message || "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm text-slate-200">{field.label}</span>
        <TagBadge tag={field.tag} />
      </div>
      <div className="flex items-start gap-4">
        <div className="w-28 h-28 rounded-md overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-600 text-xs">
          {value ? (
            <img
              src={value}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            "미리보기"
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/xxx.webp 또는 https://..."
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 cursor-pointer text-sm text-slate-200 transition">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={uploading}
            />
            {uploading ? "업로드 중…" : "이미지 업로드"}
          </label>
          {error && (
            <p className="text-xs text-rose-400">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
