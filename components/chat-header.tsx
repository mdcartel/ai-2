'use client';

import { Button } from '@/components/ui/button';
import { MDIcon, MenuIcon, PlusIcon } from '@/components/icons';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export function ChatHeader({ onToggleSidebar, onNewChat }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="shrink-0"
        >
          <MenuIcon size={16} />
        </Button>
        <div className="flex justify-center items-center rounded-full ring-1 size-8 shrink-0 ring-border bg-background">
          <MDIcon size={14} />
        </div>
        <h1 className="text-lg font-semibold">MD Assistant</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onNewChat} variant="outline" size="sm" className="hidden md:flex">
          <PlusIcon size={14} />
          New Chat
        </Button>
      </div>
    </div>
  );
}