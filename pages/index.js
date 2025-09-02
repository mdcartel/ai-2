'use client';

import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { SparklesIcon, ArrowUpIcon, LoaderIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    adjustHeight();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { 
      id: Date.now(), 
      text: inputValue, 
      isUser: true 
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }

    const apiUrl = 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5HUEtMSjJkakVjcF9IQ0M0VFhRQ0FmSnNDSHNYTlJSblE0UXo1Q3RBcjFPcl9YYy1OZUhteDZWekxHdWRLM1M1alNZTkJMWEhNOWd4S1NPSDBTWC12M0U2UGc9PQ==';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentInput }),
      });
      
      const data = await response.json();

      if (data && data.text) {
        const assistantMessage = { 
          id: Date.now() + 1, 
          text: data.text, 
          isUser: false 
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } else {
        const errorMessage = { 
          id: Date.now() + 1, 
          text: 'Sorry, I encountered an issue. Please try again.', 
          isUser: false 
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: 'Connection error. Please check your internet and try again.', 
        isUser: false 
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const Greeting = () => (
    <div className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-semibold"
      >
        Hello there!
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-muted-foreground"
      >
        How can I help you today?
      </motion.div>
    </div>
  );

  const ThinkingMessage = () => (
    <motion.div
      className="w-full group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
    >
      <div className="flex gap-4 w-full items-start justify-start">
        <div className="flex justify-center items-center rounded-full ring-1 size-8 shrink-0 ring-border bg-background mt-1">
          <SparklesIcon size={14} />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-2 text-muted-foreground">
            <LoaderIcon size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Head>
        <title>AI Assistant</title>
        <meta name="description" content="Simple AI chatbot assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center rounded-full ring-1 size-8 shrink-0 ring-border bg-background">
              <SparklesIcon size={14} />
            </div>
            <h1 className="text-lg font-semibold">AI Assistant</h1>
          </div>
          {messages.length > 0 && (
            <Button onClick={clearChat} variant="outline" size="sm">
              Clear Chat
            </Button>
          )}
        </div>

        {/* Messages */}
        <div ref={chatboxRef} className="flex-1 overflow-y-auto">
          <div className="flex flex-col min-w-0 gap-6 pt-4 pb-32 px-4 max-w-4xl mx-auto">
            {messages.length === 0 && <Greeting />}

            {messages.map((message) => (
              <AnimatePresence key={message.id}>
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
                        <SparklesIcon size={14} />
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
                        <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}

            {isLoading && <ThinkingMessage />}
          </div>
        </div>

        {/* Input */}
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
                  onClick={handleSendMessage}
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
      </div>
    </>
  );
}