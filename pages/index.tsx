import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ChatHeader } from '@/components/chat-header';
import { Greeting } from '@/components/greeting';
import { Message } from '@/components/message';
import { ThinkingMessage } from '@/components/thinking-message';
import { ChatInput } from '@/components/chat-input';
import { useChat } from '@/hooks/use-chat';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    chatHistory,
    currentChatId,
    isLoading,
    sendMessage,
    newChat,
    selectChat,
    clearAllChats,
  } = useChat();

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleNewChat = () => {
    newChat();
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    setSidebarOpen(false);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      clearAllChats();
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <Head>
        <title>MD AI Assistant</title>
        <meta name="description" content="MD AI chatbot assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="flex h-dvh bg-background">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onClearHistory={handleClearHistory}
        />

        <div className="flex flex-col min-w-0 flex-1">
          <ChatHeader
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onNewChat={handleNewChat}
          />

          <div ref={chatboxRef} className="flex-1 overflow-y-auto">
            <div className="flex flex-col min-w-0 gap-6 pt-4 pb-32 px-4 max-w-4xl mx-auto">
              {messages.length === 0 && <Greeting />}

              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}

              {isLoading && <ThinkingMessage />}
            </div>
          </div>

          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}