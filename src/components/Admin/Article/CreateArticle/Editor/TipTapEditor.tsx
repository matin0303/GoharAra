'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { MenuBar } from './MenuBar'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { extensions } from '@/components/Admin/Article/CreateArticle/Editor/EditorExtensions'
import { useUploadFile } from '@/hook/useUpload'
import { cleanHTML } from '@/lib/utils'

interface TipTapEditorProps {
  content?: string
  onChange?: (html: string) => void
}
export function TipTapEditor({ content = '', onChange }: TipTapEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { mutate: upload, isPending: penddingUpload } = useUploadFile()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false, 
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const cleanedHTML = cleanHTML(html)
      onChange?.(cleanedHTML)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4'
      }
    }
  })

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        toast.error('لطفاً فقط عکس انتخاب کنید')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم عکس باید کمتر از 5 مگابایت باشد')
        return
      }

      setIsUploading(true)
      toast.loading('در حال آپلود عکس...', { id: 'upload' })

      try {
        upload({file:file, folder:'article'},{ onSuccess(response){
          editor?.chain().focus().setImage({ src: response.data.url}).run()
          toast.success('عکس با موفقیت آپلود شد', { id: 'upload' })
        }})
      } catch (error) {
        toast.error('خطا در آپلود عکس', { id: 'upload' })
      } finally {
        setIsUploading(false)
      }
    }

    input.click()
  }

  if (!isMounted) {
    return (
      <div className="border rounded-lg bg-white shadow-sm">
        <div className="p-4 text-gray-500">در حال بارگذاری ویرایشگر...</div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm relative">
      <MenuBar editor={editor} onImageUpload={handleImageUpload} />
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
          <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span>در حال آپلود عکس...</span>
            </div>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}


// import StarterKit from '@tiptap/starter-kit'
// import Table from '@tiptap/extension-table'
// import TableRow from '@tiptap/extension-table-row'
// import TableCell from '@tiptap/extension-table-cell'
// import TableHeader from '@tiptap/extension-table-header'
// import ListItem from '@tiptap/extension-list-item'
// import BulletList from '@tiptap/extension-bullet-list'
// import OrderedList from '@tiptap/extension-ordered-list'
// import Blockquote from '@tiptap/extension-blockquote'

// export const extensions = [
//   StarterKit.configure({
//     paragraph: {
//       HTMLAttributes: {
//         class: 'font-kalameh text-black text-lg leading-relaxed',
//       },
//     },
//   }),
//   Table.configure({
//     resizable: true,
//     HTMLAttributes: {
//       class: 'my-4 w-full border-collapse',
//     },
//   }),
//   TableRow,
//   TableCell.configure({
//     HTMLAttributes: {
//       class: 'border border-gray-300 px-4 py-2',
//     },
//   }),
//   TableHeader.configure({
//     HTMLAttributes: {
//       class: 'border border-gray-300 px-4 py-2 bg-gray-100 font-bold',
//     },
//   }),
//   BulletList.configure({
//     HTMLAttributes: {
//       class: 'list-disc list-inside my-4',
//     },
//   }),
//   OrderedList.configure({
//     HTMLAttributes: {
//       class: 'list-decimal list-inside my-4',
//     },
//   }),
//   ListItem,
//   Blockquote.configure({
//     HTMLAttributes: {
//       class: 'border-r-4 border-gray-300 pr-4 my-4',
//     },
//   }),
// ]