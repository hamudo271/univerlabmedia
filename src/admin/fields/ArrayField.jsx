import React, { useState } from "react";
import TagBadge from "./TagBadge.jsx";
import FieldRouter from "./FieldRouter.jsx";

/**
 * ArrayField — repeating rows, each row rendered using the item schema.
 * - Collapsible per row
 * - Add / Remove / Move up / Move down
 */
export default function ArrayField({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  function updateItem(idx, nextVal) {
    const next = [...items];
    next[idx] = nextVal;
    onChange(next);
  }
  function addItem() {
    onChange([...items, blankItem(field.itemSchema)]);
  }
  function removeItem(idx) {
    const next = items.filter((_, i) => i !== idx);
    onChange(next);
  }
  function move(idx, delta) {
    const j = idx + delta;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-200">{field.label}</span>
          <TagBadge tag={field.tag} />
          <span className="text-xs text-slate-500">({items.length}개)</span>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="px-2.5 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white transition"
        >
          + 추가
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <ArrayRow
            key={idx}
            idx={idx}
            total={items.length}
            label={
              typeof field.itemLabel === "function"
                ? field.itemLabel(idx)
                : `${field.itemLabel || "항목"} ${idx + 1}`
            }
            itemSchema={field.itemSchema}
            value={item}
            onChange={(v) => updateItem(idx, v)}
            onRemove={() => removeItem(idx)}
            onMoveUp={() => move(idx, -1)}
            onMoveDown={() => move(idx, +1)}
          />
        ))}
        {items.length === 0 && (
          <div className="text-xs text-slate-500 italic p-4 rounded border border-dashed border-slate-700">
            아직 항목이 없습니다. “+ 추가” 버튼을 눌러 주세요.
          </div>
        )}
      </div>
    </div>
  );
}

function ArrayRow({
  idx,
  total,
  label,
  itemSchema,
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) {
  const [open, setOpen] = useState(true);

  // Each row holds an object whose fields are described by itemSchema.
  function updateField(key, v) {
    onChange({ ...(value || {}), [key]: v });
  }

  return (
    <div className="rounded-md border border-slate-700 bg-slate-800/40">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-sm text-slate-200 hover:text-white transition"
        >
          <span
            className={`transition-transform ${open ? "rotate-90" : ""}`}
          >
            ▸
          </span>
          {label}
          {!open && value && (
            <span className="text-xs text-slate-500 truncate max-w-[320px]">
              {summarize(value)}
            </span>
          )}
        </button>
        <div className="flex items-center gap-1">
          <IconBtn disabled={idx === 0} onClick={onMoveUp} title="위로">
            ↑
          </IconBtn>
          <IconBtn
            disabled={idx === total - 1}
            onClick={onMoveDown}
            title="아래로"
          >
            ↓
          </IconBtn>
          <IconBtn onClick={onRemove} title="삭제" danger>
            🗑
          </IconBtn>
        </div>
      </div>

      {open && (
        <div className="p-3 space-y-3">
          {Object.entries(itemSchema).map(([key, subField]) => (
            <FieldRouter
              key={key}
              field={subField}
              value={value?.[key]}
              onChange={(v) => updateField(key, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, disabled, danger, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-7 h-7 inline-flex items-center justify-center rounded text-xs transition
        ${danger ? "hover:bg-rose-500/20 text-rose-300" : "hover:bg-slate-700 text-slate-300"}
        ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function summarize(obj) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  for (const v of Object.values(obj)) {
    if (typeof v === "string" && v.trim()) return v.slice(0, 80);
  }
  return "";
}

/** Build a blank item from an itemSchema. */
function blankItem(itemSchema) {
  const out = {};
  for (const [k, f] of Object.entries(itemSchema || {})) {
    if (f.type === "array") out[k] = [];
    else out[k] = "";
  }
  return out;
}
