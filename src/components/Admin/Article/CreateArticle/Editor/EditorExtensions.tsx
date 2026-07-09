import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import HardBreak from '@tiptap/extension-hard-break' 
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import {Table} from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'

export const extensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
  }),
  
  Heading.configure({
    levels: [1, 2, 3],
    HTMLAttributes: {
      class: 'font-sarvenaz text-2xl font-extrabold text-purple-500 my-4 pb-3 leading-tight',
    },
  }),
  
  HardBreak.configure({
    keepMarks: true,
    HTMLAttributes: {
      class: 'my-break',
    },
  }),
  
  Image.configure({
    inline: true,
    allowBase64: false,
    HTMLAttributes: {
      class: 'w-full h-auto rounded-xl object-cover my-8 aspect-video',
    },
  }),
  
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      target: '_blank',
      rel: 'noopener noreferrer',
      class: 'text-blue-600 no-underline font-medium transition-colors duration-200 hover:underline hover:text-blue-700',
    },
  }),
  
  Paragraph.configure({
    HTMLAttributes: {
      class: 'font-kalameh text-[0.9rem] text-gray-900 leading-[2] mb-2 text-justify',
    },
  }),
  
  Placeholder.configure({
    placeholder: 'از اینجا بنویسید...',
  }),
  
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'w-full border-collapse my-8 text-base bg-white rounded-xl overflow-hidden shadow-sm',
    },
  }),
  
  TableRow,
  
  TableCell.configure({
    HTMLAttributes: {
      class: 'border border-gray-300 px-5 py-3.5 text-right text-gray-700 text-[0.95rem] leading-relaxed align-middle',
    },
  }),
  
  TableHeader.configure({
    HTMLAttributes: {
      class: 'bg-gradient-to-r from-purple-500 to-purple-400 text-white font-bold text-base px-5 py-4 text-right border-none whitespace-nowrap tracking-wide',
    },
  }),
  
  BulletList.configure({
    HTMLAttributes: {
      class: 'list-none my-6 pr-8 font-kalameh',
    },
  }),
  
  OrderedList.configure({
    HTMLAttributes: {
      class: 'list-none my-6 pr-8 font-kalameh',
    },
  }),
  
  ListItem.configure({
    HTMLAttributes: {
      class: 'relative pr-7 mb-3 text-base text-gray-700 leading-[1.8]',
    },
  }),
  
  Blockquote.configure({
    HTMLAttributes: {
      class: 'border-r-4 border-purple-500 bg-purple-50 px-6 py-4 my-6 rounded-lg italic text-purple-700',
    },
  }),
].filter(ext => ext !== undefined && ext !== null)