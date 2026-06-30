import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import HardBreak from '@tiptap/extension-hard-break' 
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'

export const extensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
  }),
  Heading.configure({
    levels: [1, 2, 3],
    HTMLAttributes: {
      class: 'text-orange-600 text-3xl font-sarvenaz',
    },
  }),,
  HardBreak.configure({
    keepMarks: true,
    HTMLAttributes: {
      class: 'my-break'
    }
  }),
  Image.configure({
    inline: true,
    allowBase64: false,
    HTMLAttributes: {
      class: 'rounded-lg max-w-full w-full object-cover my-4 aspect-video '
    }
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      target: '_blank',
      rel: 'noopener noreferrer',
      class: 'text-blue-600 hover:underline '
    }
  }),
  Paragraph.configure({
    HTMLAttributes: {
      class: 'font-kalameh text-black text-lg leading-relaxed',
    },
  }),
  Placeholder.configure({
    placeholder: 'از اینجا بنویسید...'
  })
].filter(ext => ext !== undefined && ext !== null)