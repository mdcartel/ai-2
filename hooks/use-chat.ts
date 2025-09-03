'use client';

import { useState, useCallback, useEffect } from 'react';
import { getLiveData } from '../utils/live-data';

export interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

export interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp)
        })));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const generateChatTitle = (firstMessage: string): string => {
    return firstMessage.length > 50 
      ? firstMessage.substring(0, 50) + '...' 
      : firstMessage;
  };

  const buildConversationContext = (messages: Message[], newUserMessage: string): string => {
    // Build conversation history for context
    const conversationHistory = messages
      .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');
    
    // Add the new user message
    const fullContext = conversationHistory 
      ? `${conversationHistory}\nUser: ${newUserMessage}\nAssistant:`
      : `User: ${newUserMessage}\nAssistant:`;
    
    return fullContext;
  };

  const sendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = { 
      id: Date.now(), 
      text: inputText, 
      isUser: true 
    };
    
    const isNewChat = messages.length === 0;
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // If this is a new chat, create a chat history entry
    if (isNewChat) {
      const newChatId = `chat-${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        title: generateChatTitle(inputText),
        timestamp: new Date(),
        messages: newMessages
      };
      setChatHistory(prev => [newChat, ...prev]);
      setCurrentChatId(newChatId);
    }
    
    setIsLoading(true);

    try {
      // Check if we need live data first
      const liveDataResult = await getLiveData(inputText);
      
      if (liveDataResult.shouldUseLiveData) {
        if (liveDataResult.data) {
          // Use live data instead of AI API
          const assistantMessage: Message = { 
            id: Date.now() + 1, 
            text: liveDataResult.data, 
            isUser: false 
          };
          setMessages(prev => [...prev, assistantMessage]);
          
          // Update chat history with the new message
          if (currentChatId) {
            setChatHistory(prev => prev.map(chat => 
              chat.id === currentChatId 
                ? { ...chat, messages: [...chat.messages, assistantMessage] }
                : chat
            ));
          }
          return;
        } else if (liveDataResult.error) {
          // Show error but continue to AI API with enhanced prompt
          const enhancedPrompt = `${inputText}\n\nNote: Please provide the most current information available. If you don't have recent data, please mention that your knowledge may be outdated.`;
          inputText = enhancedPrompt;
        }
      }

      // Fall back to AI API for other queries
      const apiUrl = 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5HUEtMSjJkakVjcF9IQ0M0VFhRQ0FmSnNDSHNYTlJSblE0UXo1Q3RBcjFPcl9YYy1OZUhteDZWekxHdWRLM1M1alNZTkJMWEhNOWd4S1NPSDBTWC12M0U2UGc9PQ==';
      
      // Build conversation context including previous messages
      const conversationPrompt = buildConversationContext(messages, inputText);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: conversationPrompt }),
      });
      
      const data = await response.json();

      if (data && data.text) {
        const assistantMessage: Message = { 
          id: Date.now() + 1, 
          text: data.text, 
          isUser: false 
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Update chat history with the new message
        if (currentChatId) {
          setChatHistory(prev => prev.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, messages: [...chat.messages, assistantMessage] }
              : chat
          ));
        }
      } else {
        const errorMessage: Message = { 
          id: Date.now() + 1, 
          text: 'Sorry, I encountered an issue. Please try again.', 
          isUser: false 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { 
        id: Date.now() + 1, 
        text: 'Connection error. Please check your internet and try again.', 
        isUser: false 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentChatId, isLoading]);

  const newChat = useCallback(() => {
    setMessages([]);
    setCurrentChatId(null);
  }, []);

  const selectChat = useCallback((chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  }, [chatHistory]);

  const clearAllChats = useCallback(() => {
    setChatHistory([]);
    setMessages([]);
    setCurrentChatId(null);
    localStorage.removeItem('chatHistory');
  }, []);

  return {
    messages,
    chatHistory,
    currentChatId,
    isLoading,
    sendMessage,
    newChat,
    selectChat,
    clearAllChats,
  };
}