'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, MenuIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  chatHistory: Array<{ id: string; title: string; timestamp: Date }>;
  currentChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export function Sidebar({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  chatHistory, 
  currentChatId, 
  onSelectChat 
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-background border-r border-border z-50 transition-transform duration-300 ease-in-out",
        "w-64 md:w-80",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Chats</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="md:hidden"
            >
              <MenuIcon size={16} />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button 
              onClick={onNewChat}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <PlusIcon size={16} />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                No previous chats
              </div>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "text-sm line-clamp-2",
                      currentChatId === chat.id 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground"
                    )}
                  >
                    <div className="font-medium truncate">
                      {chat.title}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {chat.timestamp.toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}