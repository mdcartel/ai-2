'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { MDIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface MessageProps {
  message: {
    id: number;
    text: string;
    isUser: boolean;
  };
}

export function Message({ message }: MessageProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div
          className={cn('flex items-start gap-3', {
            'max-w-xl ml-auto justify-end mr-6': message.isUser,
            'justify-start -ml-3': !message.isUser,
          })}
        >
          {!message.isUser && (
            <div className="flex justify-center items-center mt-1 rounded-full ring-1 size-8 shrink-0 ring-border bg-background">
              <MDIcon size={14} />
            </div>
          )}

          <div
            className={cn('flex flex-col gap-4', {
              'w-full': !message.isUser,
              'w-fit': message.isUser,
            })}
          >
            <div
              className={cn(
                'rounded-lg px-4 py-3 text-sm',
                {
                  'bg-primary text-primary-foreground': message.isUser,
                  'bg-muted': !message.isUser,
                }
              )}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}