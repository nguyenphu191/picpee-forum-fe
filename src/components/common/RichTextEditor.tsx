'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Link as LinkIcon, 
  Image as ImageIcon,
  Quote,
  Undo,
  Redo,
  Upload,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Highlighter,
  Code
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import ImageEditorModal from './ImageEditorModal';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor, onImageUpload }: { editor: any, onImageUpload: () => void }) => {
  if (!editor) return null;

  const buttons = [
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false },
    { divider: true },
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { icon: Highlighter, action: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive('highlight') },
    { divider: true },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { divider: true },
    { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }) },
    { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
    { icon: AlignRight, action: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }) },
    { divider: true },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { divider: true },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { icon: Code, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock') },
    { 
        icon: LinkIcon, 
        action: () => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            const url = window.prompt('URL link:');
            if (url) editor.chain().focus().setLink({ href: url }).run();
        }, 
        active: editor.isActive('link') 
    },
    { icon: ImageIcon, action: onImageUpload, active: false },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 sticky top-0 z-20 backdrop-blur-xl rounded-t-3xl">
      {buttons.map((btn, i) => (
        btn.divider ? (
          <div key={i} className="w-[1px] h-6 bg-gray-300 dark:bg-slate-700 mx-1.5 self-center" />
        ) : (
          <button
            key={i}
            type="button"
            onClick={btn.action}
            className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
              btn.active 
                ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20' 
                : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {btn.icon && <btn.icon className="w-4 h-4" />}
          </button>
        )
      ))}
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({ multicolor: true }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl max-w-full h-auto my-4 border border-white/10 shadow-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-500 hover:underline font-bold',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Bắt đầu viết nội dung bài viết...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setEditingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const onSaveEditedImage = async (blob: Blob) => {
    setEditingImage(null);
    const formData = new FormData();
    formData.append('file', blob, 'edited-image.jpg');

    setIsUploading(true);
    try {
      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      editor?.chain().focus().setImage({ src: data.url }).run();
      toast.success('Đã tải ảnh lên!');
    } catch (err) {
      toast.error('Lỗi upload ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 relative overflow-hidden group focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
      {isUploading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-30 flex items-center justify-center gap-2">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Upload className="w-5 h-5 text-primary-500" /></motion.div>
            <span className="font-bold text-sm">Đang tải ảnh...</span>
        </div>
      )}
      <MenuBar editor={editor} onImageUpload={handleImageUpload} />
      <EditorContent 
        editor={editor} 
        className="prose dark:prose-invert max-w-none p-6 min-h-[300px] outline-none"
      />
      
      {editingImage && (
        <ImageEditorModal
          image={editingImage}
          isOpen={!!editingImage}
          onClose={() => setEditingImage(null)}
          onSave={onSaveEditedImage}
        />
      )}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          outline: none !important;
        }
        /* Bullet and Ordered List Styles - Fix for missing icons/bullets */
        .ProseMirror ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        .ProseMirror ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 1rem 0 !important;
        }
        .ProseMirror li {
          margin-bottom: 0.5rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #4AF73E;
          padding-left: 1.5rem;
          font-style: italic;
          background: rgba(74, 247, 62, 0.05);
          border-radius: 0 1rem 1rem 0;
          margin: 1.5rem 0;
          color: #94a3b8;
        }
        .ProseMirror pre {
          background: #0f172a;
          color: #f8fafc;
          padding: 1.5rem;
          border-radius: 1rem;
          font-family: 'Fira Code', 'Cascadia Code', monospace;
          margin: 1.5rem 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .ProseMirror mark {
          background-color: #4AF73E;
          color: black;
          padding: 0 0.2rem;
          border-radius: 4px;
        }
        .ProseMirror h1 { font-size: 2rem; font-weight: 900; margin: 1.5rem 0; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 800; margin: 1.25rem 0; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0; }
        .ProseMirror a { color: #4AF73E; font-weight: 700; text-decoration: underline; }
      `}</style>
    </div>
  );
}
