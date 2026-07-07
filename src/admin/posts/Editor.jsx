import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3,
  Link2, Image as ImageIcon, Undo2, Redo2, Loader2,
} from 'lucide-react';

function Btn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // 선택 영역 유지
      onClick={onClick}
      className={`h-9 min-w-9 px-2 inline-flex items-center justify-center rounded-md border text-sm transition-colors disabled:opacity-40 ${
        active
          ? 'bg-accent-primary text-white border-accent-primary'
          : 'bg-white text-text-secondary border-black/10 hover:bg-bg-secondary'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * 본문 리치 에디터 (Tiptap). initialContent는 마운트 시 1회만 반영되므로
 * 부모는 데이터 로드가 끝난 뒤 이 컴포넌트를 마운트해야 한다.
 */
export default function Editor({ initialContent = '', onChange, uploadImage }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
        },
      }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg' } }),
      Placeholder.configure({ placeholder: '본문을 입력하세요…' }),
    ],
    content: initialContent,
    editorProps: { attributes: { class: 'post-prose min-h-[340px] px-5 py-4' } },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  if (!editor) {
    return <div className="border border-black/15 rounded-xl h-[420px] bg-bg-secondary animate-pulse" />;
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('링크 URL', prev || 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setUploading(true);
      const { url } = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err.message || '이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-black/15 rounded-xl overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1.5 p-2 border-b border-black/10 bg-bg-secondary/50">
        <Btn title="제목 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Btn>
        <Btn title="제목 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Btn>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <Btn title="굵게" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></Btn>
        <Btn title="기울임" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></Btn>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <Btn title="글머리 목록" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></Btn>
        <Btn title="번호 목록" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></Btn>
        <Btn title="인용" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></Btn>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <Btn title="링크" active={editor.isActive('link')} onClick={setLink}><Link2 size={16} /></Btn>
        <Btn title="이미지 삽입" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
        </Btn>
        <span className="w-px h-5 bg-black/10 mx-1" />
        <Btn title="실행취소" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={16} /></Btn>
        <Btn title="다시실행" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={16} /></Btn>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
