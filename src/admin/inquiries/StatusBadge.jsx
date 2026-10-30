import React from 'react';
import { statusOf } from './status.js';

export function StatusBadge({ status }) {
  const s = statusOf(status);
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-bold ${s.cls}`}>
      {s.label}
    </span>
  );
}
