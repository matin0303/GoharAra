// components/TableOfContents.jsx
'use client';
import { useEffect, useState, useCallback } from 'react';

interface Headings {
    id: string;
    text: string;
    level: number;
    number?: string; 
}

const TableOfContents = ({ htmlContent }:{htmlContent:string}) => {
  const [headings, setHeadings] = useState<Headings[]>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const addNumbering = (headings: Headings[]): Headings[] => {
    const counters: number[] = [0, 0, 0, 0, 0, 0];
    return headings.map((heading) => {
      const level = heading.level;
      for (let i = level; i < counters.length; i++) {
        counters[i] = 0;
      }
      counters[level - 1]++;
      let number = '';
      for (let i = 0; i < level; i++) {
        if (counters[i] > 0) {
          if (number) number += '.';
          number += counters[i];
        }
      }
      
      return {
        ...heading,
        number: number
      };
    });
  };

  useEffect(() => {
    if (!htmlContent) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const extractedHeadings = Array.from(headingElements).map((heading, index) => {
      let id = heading.id;
      if (!id) {
        const baseId = heading.textContent
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\u0600-\u06FF-]/g, '')
          .toLowerCase();
        id = `${baseId}-${index}`;
        heading.id = id;
      }
      
      return {
        id: id,
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1)),
      };
    });
    
    const numberedHeadings = addNumbering(extractedHeadings);
    setHeadings(numberedHeadings);
  }, [htmlContent]);

  const scrollToHeading = useCallback((id:string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveId(id);
    }
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observers: any[] = [];
    
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (!element) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(heading.id);
            }
          });
        },
        {
          rootMargin: '-20% 0px -70% 0px',
          threshold: 0
        }
      );
      
      observer.observe(element);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach((observer: any) => observer.disconnect());
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="my-6 border rounded-lg bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        aria-label={isOpen ? 'بستن فهرست مطالب' : 'باز کردن فهرست مطالب'}
      >
        <span className="flex items-center gap-2">
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-0' : 'rotate-270'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-bold text-2xl text-gray-800">مواردی که در این مقاله می‌خوانید</span>
        </span>
        <span className="text-lg text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
          {headings.length}
        </span>
      </button>
      
      <div
        className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 border-t">
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li 
                key={heading.id}
                style={{ paddingRight: `${(heading.level - 1) * 16}px` }}
              >
                <a
                  onClick={() => scrollToHeading(heading.id)}
                  className={`
                    text-xl text-right w-full transition-all duration-200 cursor-pointer block
                    hover:text-orange-600 hover:pr-2
                    ${activeId === heading.id 
                      ? 'text-orange-600 font-medium border-r-2 border-orange-600 pr-2' 
                      : 'text-gray-600'
                    }
                  `}
                >
                  {heading.number && (
                    <span className="ml-2 font-kalameh">
                      {heading.number}
                    </span>
                  )}
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;