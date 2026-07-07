import React from "react";
import { NavLink } from "react-router-dom";
import { schema, pageOrder } from "../../shared/content-schema.js";

export default function Sidebar() {
  return (
    <nav className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <div className="text-xs uppercase tracking-wider text-slate-500">
          Admin
        </div>
        <div className="text-lg font-bold text-white mt-0.5">
          유니버랩 미디어 CMS
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto py-2">
        {pageOrder.map((key) => (
          <li key={key}>
            <NavLink
              to={`/admin/pages/${key}`}
              className={({ isActive }) =>
                `block px-5 py-2.5 text-sm transition border-l-2 ${
                  isActive
                    ? "bg-slate-800 text-white border-blue-500"
                    : "text-slate-300 border-transparent hover:bg-slate-800/60 hover:text-white"
                }`
              }
            >
              <span className="block">{schema[key].label}</span>
              <span className="block text-[10px] font-mono text-slate-500">
                {key}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500">
        저장 시 사이트에 즉시 반영됩니다.
      </div>
    </nav>
  );
}
