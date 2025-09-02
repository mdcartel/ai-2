'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, LoaderIcon } from '@/components/icons';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export function ChatInput({ inputValue, setInputValue, onSendMessage, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    adjustHeight();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  useEffect(() => {
    // Reset textarea height when message is sent
    if (!inputValue && textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
  }, [inputValue]);

  return (
    <div className="sticky bottom-0 flex gap-2 px-4 pb-4 mx-auto w-full bg-background md:pb-6 md:max-w-3xl z-[1] border-t-0">
      <div className="flex relative flex-col gap-4 w-full">
        <div className="border border-input shadow-lg transition-all duration-200 shadow-black/10 hover:border-primary/20 focus-within:border-primary/30 focus-within:shadow-xl focus-within:shadow-primary/20 rounded-lg bg-background">
          <div className="flex items-end gap-2 p-2">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Send a message..."
              disabled={isLoading}
              className="flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[48px] max-h-[120px]"
              style={{ height: '48px' }}
            />
            <Button
              onClick={onSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
              className="shrink-0"
            >
              {isLoading ? (
                <LoaderIcon size={14} />
              ) : (
                <ArrowUpIcon size={14} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}