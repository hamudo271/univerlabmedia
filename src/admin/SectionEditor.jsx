import React, { useState } from "react";
import FieldRouter from "./fields/FieldRouter.jsx";

export default function SectionEditor({ sectionKey, section, value, onChange }) {
  const [open, setOpen] = useState(true);

  function updateField(fieldKey, v) {
    onChange({ ...(value || {}), [fieldKey]: v });
  }

  return (
    <section className="rounded-lg border border-slate-700 bg-slate-800/30 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 bg-slate-800/60 border-b border-slate-700">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-left group"
        >
          <span
            className={`text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}
          >
            ▸
          </span>
          <h3 className="text-base font-semibold text-slate-100 group-hover:text-white">
            {section.label}
          </h3>
          <span className="text-xs text-slate-500 font-mono">{sectionKey}</span>
        </button>
      </header>
      {open && (
        <div className="p-4 space-y-4">
          {Object.entries(section.fields).map(([fieldKey, field]) => (
            <FieldRouter
              key={fieldKey}
              field={field}
              value={value?.[fieldKey]}
              onChange={(v) => updateField(fieldKey, v)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
