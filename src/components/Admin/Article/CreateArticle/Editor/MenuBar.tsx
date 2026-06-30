'use client'

import { Editor } from '@tiptap/react'
import {
  Bold, Italic, List, ListOrdered, Link2, Image as ImageIcon,
  Heading1, Heading2, Heading3, Undo, Redo, Unlink, CornerDownRight
} from 'lucide-react'

interface MenuBarProps {
  editor: Editor | null
  onImageUpload?: () => void
}

export function MenuBar({ editor, onImageUpload }: MenuBarProps) {
  if (!editor) return null

  const buttons = [
    {
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive('bold'),
      label: 'Bold'
    },
    {
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive('italic'),
      label: 'Italic'
    },
    {
      icon: Heading1,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive('heading', { level: 1 }),
      label: 'Heading 1'
    },
    {
      icon: Heading2,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive('heading', { level: 2 }),
      label: 'Heading 2'
    },
    {
      icon: Heading3,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive('heading', { level: 3 }),
      label: 'Heading 3'
    },
    {
      icon: List,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList'),
      label: 'Bullet List'
    },
    {
      icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('orderedList'),
      label: 'Ordered List'
    },
    {
      icon: Link2,
      onClick: () => {
        const url = window.prompt('آدرس لینک را وارد کنید:')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      },
      active: editor.isActive('link'),
      label: 'Link'
    },
    {
      icon: Unlink,
      onClick: () => editor.chain().focus().unsetLink().run(),
      active: false,
      label: 'Unlink'
    },
    {
      icon: CornerDownRight,
      onClick: () => editor.chain().focus().setHardBreak().run(),
      active: false,
      label: 'خط جدید (Shift + Enter)'
    },
    {
      icon: ImageIcon,
      onClick: onImageUpload,
      active: false,
      label: 'Image'
    },
    {
      icon: Undo,
      onClick: () => editor.chain().focus().undo().run(),
      active: false,
      label: 'Undo'
    },
    {
      icon: Redo,
      onClick: () => editor.chain().focus().redo().run(),
      active: false,
      label: 'Redo'
    }
  ]

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-lg sticky top-0 z-10">
      {buttons.map(({ icon: Icon, onClick, active, label }) => (
        <button
          key={label}
          onClick={onClick}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            active ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
          }`}
          title={label}
          type="button"
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  )
}