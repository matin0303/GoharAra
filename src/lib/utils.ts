'use client'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie";
import { AuthResponse, UserRole, VALID_ROLES } from "@/types/api.types";
import jalaali from "jalaali-js";
import { useAppDispatch } from "@/hook/useRedux";
import { clearAuth } from "./redux/slices/authSlice";
import { CartItem } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const addHeadingsIdRegex = (html:string) => {
  if (!html || typeof html !== 'string') return html;
  
  let counter = 0;
  const timestamp = Date.now();
  
  const headingRegex = /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi;
  
  return html.replace(headingRegex, (match, tag, attributes, content) => {
    if (attributes.includes('id=')) {
      return match;
    }
    
    const id = `heading-${counter++}-${timestamp}`;
    
    return `<${tag} ${attributes} id="${id}">${content}</${tag}>`;
  });
};

export function toJalaliDateTime(isoDate: string): string {
  const date = new Date(isoDate);

  const j = jalaali.toJalaali(date);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${j.jy}/${j.jm.toString().padStart(2, "0")}/${j.jd
    .toString()
    .padStart(2, "0")}`;

    // .padStart(2, "0")} ${hours}:${minutes}`;
}

export function getCookie(name:string){
  const cookie = Cookies.get(name);
  return cookie
}

export async function setTokenOnCookies(data:AuthResponse){
  const token = data.token
  const role = data.user.role
  await fetch('/next-api/setToken', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({token , role}),
  })
}

export async function removeTokenOnCookies(){

  await fetch('/next-api/removeToken', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  })
  
}

export function cleanHTML(html: string): string {
  let cleanHtml = html

  if (cleanHtml.includes('&lt;') && cleanHtml.includes('&gt;')) {
    cleanHtml = cleanHtml
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }

  const blockTags = [
    'table', '/table', 'thead', '/thead', 'tbody', '/tbody', 
    'tr', '/tr', 'th', '/th', 'td', '/td',
    'ul', '/ul', 'ol', '/ol', 'li', '/li',
    'blockquote', '/blockquote',
    'hr', '/hr', 'br', '/br',
    'h1', '/h1', 'h2', '/h2', 'h3', '/h3', 
    'h4', '/h4', 'h5', '/h5', 'h6', '/h6',
    'pre', '/pre', 'code', '/code',
    'div', '/div', 'section', '/section'
  ]

  for (let i = 0; i < 5; i++) {
    blockTags.forEach(tag => {
      cleanHtml = cleanHtml.replace(
        new RegExp(`<p[^>]*>\\s*(<${tag}[\\s>])`, 'gi'),
        '$1'
      )
      
      cleanHtml = cleanHtml.replace(
        new RegExp(`<p[^>]*>\\s*(<${tag}\\s*\\/>)`, 'gi'),
        '$1'
      )
      
      cleanHtml = cleanHtml.replace(
        new RegExp(`(<\\/${tag}>)\\s*<\\/p>`, 'gi'),
        '$1'
      )
      
      cleanHtml = cleanHtml.replace(
        new RegExp(`<p[^>]*>\\s*<\\/${tag}>`, 'gi'),
        `</${tag}>`
      )
      
      cleanHtml = cleanHtml.replace(
        new RegExp(`<${tag}[^>]*>\\s*<\\/p>`, 'gi'),
        `<${tag}>`
      )
    })
    
    cleanHtml = cleanHtml.replace(/<p[^>]*>\s*<\/p>/g, '')
    
    cleanHtml = cleanHtml.replace(/<p[^>]*>\s*(<p[^>]*>)/g, '$1')
    cleanHtml = cleanHtml.replace(/(<\/p>)\s*<\/p>/g, '$1')
  }

  cleanHtml = cleanHtml.replace(/\n\s*\n/g, '\n')
  cleanHtml = cleanHtml.replace(/>\s+</g, '>\n<')
  
  return cleanHtml.trim()
}


export const isValidRole = (role: string): role is UserRole => {
  return VALID_ROLES.includes(role as UserRole);
};

export const isValidCartItem = (item: any): item is CartItem => {
  return (
    item !== null &&
    typeof item === 'object' &&
    typeof item.id === 'number' &&
    typeof item.weight === 'number' &&
    !isNaN(item.id) &&
    !isNaN(item.weight)
  );
};


// src/utilities/sanitize.ts

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'a', 'img', 
  'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 
  'blockquote', 'code', 'pre', 'span',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'target', 'rel', 
  'class', 'id', 'width', 'height',
  'colspan', 'rowspan',
];

export async function sanitizeHtml(html: string) {
  // سمت سرور (SSR)
  if (typeof window === 'undefined') {
    const { JSDOM } = await import('jsdom');
    const { default: DOMPurify } = await import('dompurify');
    
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    
    return purify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      KEEP_CONTENT: true,
    });
  }
  
  // سمت کلاینت
  const { default: DOMPurify } = await import('dompurify');
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    KEEP_CONTENT: true,
  });
}