"use client";
import { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { toast } from "sonner";

interface RichEditorProps {
  value: string;
  onChange: (html: string, text: string) => void;
  placeholder?: string;
  className?: string;
}

async function uploadImage(file: File): Promise<string | null> {
  if (!file.type.startsWith("image/")) {
    toast.error("이미지만 업로드할 수 있어요");
    return null;
  }
  if (file.size > 10 * 1024 * 1024) {
    toast.error("이미지는 10MB 이하로 올려주세요");
    return null;
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("kind", "media");
  const r = await fetch("/api/upload", { method: "POST", body: fd });
  if (!r.ok) {
    toast.error("업로드 실패");
    return null;
  }
  const { url } = (await r.json()) as { url: string };
  return url;
}

export function RichEditor({
  value,
  onChange,
  placeholder = "마크다운 단축키를 지원합니다. 이미지는 드래그·붙여넣기로 추가하세요. 학생 개인정보 금지.",
  className,
}: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { HTMLAttributes: { class: "list-disc pl-6" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-6" } },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-primary/40 pl-4 italic text-muted-foreground",
          },
        },
        codeBlock: {
          HTMLAttributes: { class: "rounded-md bg-muted p-3 text-xs font-mono" },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline underline-offset-2" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg my-2 max-w-full" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText());
    },
    editorProps: {
      attributes: {
        class:
          "prose-kor min-h-[320px] w-full rounded-b-lg border border-t-0 bg-background px-4 py-3 text-[15px] leading-relaxed focus:outline-none",
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (files.length === 0) return false;
        event.preventDefault();
        void handleFiles(files);
        return true;
      },
      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const files = items
          .map((i) => (i.kind === "file" ? i.getAsFile() : null))
          .filter((f): f is File => f !== null);
        if (files.length === 0) return false;
        event.preventDefault();
        void handleFiles(files);
        return true;
      },
    },
  });

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (!editor) return;
      for (const file of files) {
        const url = await uploadImage(file);
        if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      }
    },
    [editor],
  );

  const handleImageButton = () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = () => {
      if (input.files) void handleFiles(Array.from(input.files));
    };
    input.click();
  };

  if (!editor) {
    return <div className="min-h-[380px] rounded-lg border bg-muted/20" aria-hidden />;
  }

  return (
    <div className={cn("rounded-lg border", className)}>
      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border-b bg-muted/30 p-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="제목 2"
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="제목 3"
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="굵게"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="기울임"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          label="취소선"
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="글머리 기호"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="번호 매기기"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="인용"
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          label="코드 블록"
        >
          <Code className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("링크 URL");
            if (!url) return;
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
          label="링크"
        >
          <LinkIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={handleImageButton} label="이미지">
          <ImageIcon className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} label="되돌리기">
          <Undo className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} label="다시 실행">
          <Redo className="size-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "rounded p-1.5 text-muted-foreground transition hover:bg-background hover:text-foreground",
        active && "bg-background text-primary shadow-sm",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" aria-hidden />;
}
