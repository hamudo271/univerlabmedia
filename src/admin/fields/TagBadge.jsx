import React from "react";

/** Map of semantic tags → color class. Keeps the admin visually informative. */
const TAG_STYLES = {
  H1: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  H2: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  H3: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Body: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  Button: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Label: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  Badge: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  Nav: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Eyebrow: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  Image: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  ImageAlt: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
};

export default function TagBadge({ tag }) {
  if (!tag) return null;
  const style = TAG_STYLES[tag] || TAG_STYLES.Body;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono uppercase tracking-wider ${style}`}
    >
      {tag}
    </span>
  );
}
