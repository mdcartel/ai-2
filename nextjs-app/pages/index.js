import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const apiUrl = inputValue.startsWith('/image')
      ? 'https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQm5HUEtMSjJkakVjcF9IQ0M0VFhRQ0FmSnNDSHNYTlJSblE0UXo1Q3RBcjFPcl9YYy1OZUhteDZWekxHdWRLM1M1alNZTkJMWEhNOWd4S1NPSDBTWC12M0U2UGc9PQ=='
      : 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5HUEtMSjJkakVjcF9IQ0M0VFhRQ0FmSnNDSHNYTlJSblE0UXo1Q3RBcjFPcl9YYy1OZUhteDZWekxHdWRLM1M1alNZTkJMWEhNOWd4S1NPSDBTWC12M0U2UGc9PQ==';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputValue }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        const assistantMessage = { text: data.text, isUser: false };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } else {
        const errorMessage = { text: 'An error occurred. Please try again.', isUser: false };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { text: 'An error occurred. Please try again.', isUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>Chat Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="header">
        Chat Assistant
        <div style={{ fontSize: '16px', marginTop: '10px' }}>
          <Link href="/api-bot">API Bot</Link> | <Link href="/custom-bot">Custom Bot</Link>
        </div>
      </div>
      <div className="container">
        <div id="chatbox" className="chatbox" ref={chatboxRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.isUser ? 'user-message' : 'assistant-message'
              }`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            id="chatInput"
            type="text"
            placeholder="Type your message"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button id="sendButton" onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? (
              <div className="spinner" style={{display: 'block'}}></div>
            ) : (
              <>
                <span className="material-icons">send</span> Send
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}