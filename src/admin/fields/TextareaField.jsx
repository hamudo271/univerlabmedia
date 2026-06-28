import React from "react";
import TagBadge from "./TagBadge.jsx";

export default function TextareaField({ field, value, onChange }) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm text-slate-200">{field.label}</span>
        <TagBadge tag={field.tag} />
      </div>
      <textarea
        rows={Math.max(3, (value ?? "").split("\n").length)}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y leading-relaxed"
      />
      <p className="mt-1 text-[11px] text-slate-500">
        개행(Enter)은 실제 화면에서도 줄바꿈으로 표시됩니다.
      </p>
    </label>
  );
}
