import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function CustomBot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantDetails, setAssistantDetails] = useState('YOUR PROMPT');
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAssistantDetailsChange = (e) => {
    setAssistantDetails(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const apiUrl = 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5IZkJDMlNyYUVUTjIyZVN3UWFNX3BFTU85SWpCM2NUMUk3T2dxejhLSzBhNWNMMXNzZlp3c09BSTR6YW1Sc1BmdGNTVk1GY0liT1RoWDZZX1lNZlZ0Z1dqd3c9PQ==';
    const prompt = `${assistantDetails}\nUser: ${inputValue}\nRiya Sharma:`

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
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
        <title>Custom Bot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="header">Custom Bot</div>
      <div className="container">
        <div className="input-area">
            <input
                type="text"
                placeholder="Enter your custom prompt here"
                value={assistantDetails}
                onChange={handleAssistantDetailsChange}
                style={{width: '100%', marginBottom: '10px'}}
            />
        </div>
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