'use client';

import { motion } from 'framer-motion';
import { MDIcon, LoaderIcon } from '@/components/icons';

export function ThinkingMessage() {
  return (
    <motion.div
      className="w-full group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
    >
      <div className="flex gap-4 w-full items-start justify-start">
        <div className="flex justify-center items-center rounded-full ring-1 size-8 shrink-0 ring-border bg-background mt-1">
          <MDIcon size={14} />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-2 text-muted-foreground">
            <LoaderIcon size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}