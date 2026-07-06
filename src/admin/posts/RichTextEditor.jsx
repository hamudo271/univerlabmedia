import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { uploadsApi } from "../../lib/api.js";

/**
 * Tiptap-based rich text editor for post bodies. Emits sanitized-enough HTML
 * via onChange. StarterKit (v3) already bundles Link, Blockquote and the list
 * extensions; we only add Image on top. Inserted/thumbnail images go through
 * the existing /api/uploads pipeline (multer + sharp → webp on the Volume).
 */
export default function RichTextEditor({ value, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      Image.configure({ HTMLAttributes: { class: "post-img" } }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  if (!editor) return null;

  function setLink() {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("링크 URL을 입력하세요 (비우면 링크 제거)", prev);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function onPickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadsApi.create(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      window.alert(`이미지 업로드 실패: ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-md border border-slate-700 overflow-hidden bg-white">
      <EditorToolbarStyles />
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <Btn active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Btn>
        <Btn active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </Btn>
        <Sep />
        <Btn active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </Btn>
        <Btn active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • 목록
        </Btn>
        <Btn active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. 목록
        </Btn>
        <Btn active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          " 인용
        </Btn>
        <Sep />
        <Btn active={editor.isActive("link")} onClick={setLink}>
          🔗 링크
        </Btn>
        <Btn onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? "업로드 중…" : "🖼 이미지"}
        </Btn>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickImage}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function Btn({ active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-2.5 py-1.5 text-sm transition disabled:opacity-40 ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-700 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-slate-300" />;
}

/** Scoped styles for the editable surface + rendered marks/blocks. */
function EditorToolbarStyles() {
  return (
    <style>{`
      .tiptap { min-height: 320px; padding: 20px 22px; outline: none; color: #0f172a; line-height: 1.7; }
      .tiptap:focus { outline: none; }
      .tiptap p { margin: 0 0 0.9em; }
      .tiptap h2 { font-size: 1.5rem; font-weight: 800; margin: 1.4em 0 0.5em; }
      .tiptap h3 { font-size: 1.2rem; font-weight: 700; margin: 1.2em 0 0.4em; }
      .tiptap ul { list-style: disc; padding-left: 1.4em; margin: 0 0 0.9em; }
      .tiptap ol { list-style: decimal; padding-left: 1.4em; margin: 0 0 0.9em; }
      .tiptap li { margin: 0.2em 0; }
      .tiptap blockquote { border-left: 3px solid #3b82f6; padding-left: 1em; margin: 0 0 0.9em; color: #475569; font-style: italic; }
      .tiptap a { color: #2563eb; text-decoration: underline; }
      .tiptap img, .tiptap .post-img { max-width: 100%; height: auto; border-radius: 8px; margin: 0.5em 0; }
      .tiptap p.is-editor-empty:first-child::before { content: "본문을 입력하세요…"; color: #94a3b8; float: left; height: 0; pointer-events: none; }
    `}</style>
  );
}
