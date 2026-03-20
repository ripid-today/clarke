'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ClarkeLogo } from './ClarkeLogo';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import type { Folder } from '@/types/library';

interface MobileNavProps {
  folders: Folder[];
}

export function MobileNav({ folders }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-claude-secondary z-30 p-4 font-sans">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-cloud-dancer rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-claude-primary focus:ring-offset-2"
            aria-label="Open navigation"
          >
            <Menu size={24} />
          </button>
          <ClarkeLogo size={20} className="text-claude-primary" />
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Dark overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in sidebar panel */}
      <div
        className={`fixed left-0 top-0 h-full w-72 z-50 bg-white border-r border-claude-secondary font-sans transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-3 border-b border-claude-secondary">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-cloud-dancer rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-claude-primary focus:ring-offset-2"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-56px)]">
          <Sidebar folders={folders} />
        </div>
      </div>
    </>
  );
}
