'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { MenuBar } from './MenuBar'
import { useState, useEffect, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import { extensions } from '@/components/Admin/Article/CreateArticle/Editor/EditorExtensions'
import { useUploadFile } from '@/hook/useUpload'
import { cleanHTML } from '@/lib/utils'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import prettier from 'prettier/standalone'
import parserHtml from 'prettier/parser-html'
import { Code, Eye, X } from 'lucide-react'

interface TipTapEditorProps {
  content?: string
  onChange?: (html: string) => void
}

export function TipTapEditor({ content = '', onChange }: TipTapEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual')
  const [codeContent, setCodeContent] = useState('')
  const [showAltModal, setShowAltModal] = useState(false)
  const [altText, setAltText] = useState('')
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null)
  const { mutate: upload, isPending: penddingUpload } = useUploadFile()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const formatHTML = useCallback(async (html: string): Promise<string> => {
    try {
      return await prettier.format(html, {
        parser: 'html',
        plugins: [parserHtml],
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
      })
    } catch (error) {
      return html
    }
  }, [])

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const cleanedHTML = cleanHTML(html)
      
      void formatHTML(cleanedHTML).then(setCodeContent)
      
      onChange?.(cleanedHTML)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4'
      }
    }
  })

  useEffect(() => {
    if (editor && content) {
      void formatHTML(content).then(setCodeContent)
    }
  }, [content, editor, formatHTML])

  const handleCodeChange = useCallback((value: string) => {
    setCodeContent(value)
    
    if (editor) {
      editor.commands.setContent(value, { emitUpdate: false })
      
      onChange?.(value)
    }
  }, [editor, onChange])

  const handleTabChange = (tab: 'visual' | 'code') => {
    if (editor) {
      const currentHTML = editor.getHTML()
      void formatHTML(currentHTML).then(setCodeContent)
    }

    setActiveTab(tab)
  }

  // باز کردن مودال دریافت alt و ذخیره موقعیت کرسر
  const openAltModal = () => {
    setAltText('')
    
    // ذخیره موقعیت کرسر در تب کد
    if (activeTab === 'code' && codeMirrorRef.current?.view) {
      const view = codeMirrorRef.current.view
      const pos = view.state.selection.main.head
      setCursorPosition(pos)
    } else {
      setCursorPosition(null)
    }
    
    setShowAltModal(true)
  }

  // بستن مودال دریافت alt
  const closeAltModal = () => {
    setShowAltModal(false)
    setAltText('')
    setCursorPosition(null)
  }

  // وقتی alt وارد شد و کاربر روی دکمه ادامه کلیک کرد
  const handleAltSubmit = () => {
    if (!altText.trim()) {
      toast.error('لطفاً متن جایگزین (alt) را وارد کنید')
      return
    }
    
    closeAltModal()
    
    // حالا فایل سلکتور رو باز کن
    setTimeout(() => {
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

        // آپلود تصویر با alt و cursorPosition
        await uploadImage(file, altText)
      }

      input.click()
    }, 100)
  }

  // تابع آپلود تصویر با alt و قرار دادن در موقعیت کرسر
  const uploadImage = async (file: File, alt: string) => {
    setIsUploading(true)
    toast.loading('در حال آپلود عکس...', { id: 'upload' })

    try {
      upload(
        { file: file, folder: 'article' }, 
        { 
          onSuccess(response) {
            const imageUrl = response.data.url
            const imgTag = `<img src="${imageUrl}" alt="${alt}" />`

            // اگر در تب کد هستیم و موقعیت کرسر داریم
            if (activeTab === 'code' && cursorPosition !== null && codeMirrorRef.current?.view) {
              const view = codeMirrorRef.current.view
              
              // اضافه کردن تگ img در موقعیت کرسر
              view.dispatch({
                changes: {
                  from: cursorPosition,
                  to: cursorPosition,
                  insert: imgTag
                }
              })
              
              // آپدیت محتوای ادیتور بصری
              const newContent = view.state.doc.toString()
              editor?.commands.setContent(newContent, { emitUpdate: false })
              setCodeContent(newContent)
              onChange?.(newContent)
              
              // آپدیت موقعیت کرسر به انتهای تگ اضافه شده
              setCursorPosition(null)
            } else {
              // اگر در تب بصری هستیم، مثل قبل عمل کن
              editor?.chain()
                .focus()
                .setImage({ 
                  src: imageUrl,
                  alt: alt
                })
                .run()
            }
            
            toast.success('عکس با موفقیت آپلود شد', { id: 'upload' })
          },
          onError() {
            toast.error('خطا در آپلود عکس', { id: 'upload' })
          }
        }
      )
    } catch (error) {
      toast.error('خطا در آپلود عکس', { id: 'upload' })
    } finally {
      setIsUploading(false)
      setCursorPosition(null)
    }
  }

  // تابع اصلی که از MenuBar صدا زده میشه
  const handleImageUpload = async () => {
    openAltModal()
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
      <div className="flex items-center justify-between border-b bg-gray-50 rounded-t-lg">
        <MenuBar editor={editor} onImageUpload={handleImageUpload} />
        
        <div className="flex items-center gap-1 px-3 py-2 border-r">
          <button
            type="button"
            onClick={() => handleTabChange('visual')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
              activeTab === 'visual'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Eye size={16} />
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
              activeTab === 'code'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Code size={16} />
          </button>
        </div>
      </div>

      {showAltModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 font-kalameh">
                متن جایگزین تصویر (alt)
              </h3>
              <button
                type="button"
                onClick={closeAltModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-kalameh">
                  لطفاً متن alt تصویر را وارد کنید:
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAltSubmit()
                    }
                  }}
                  placeholder="مثال: نمودار فروش ماهانه"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none font-kalameh"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 font-kalameh">
                  این متن برای دسترسی‌پذیری و سئو استفاده می‌شود
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeAltModal}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors font-kalameh"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleAltSubmit}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-medium hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg shadow-orange-600/20 font-kalameh"
                >
                  ادامه و انتخاب عکس
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {activeTab === 'visual' ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="min-h-[400px]">
          <CodeMirror
            ref={codeMirrorRef}
            dir='ltr'
            value={codeContent}
            onChange={handleCodeChange}
            extensions={[html()]}
            height="400px"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              indentOnInput: true,
              tabSize: 2,
            }}
            className="text-sm font-mono"
          />
        </div>
      )}
    </div>
  )
}