import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);


  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current && isChatOpen) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleApiResponse = (apiResponse) => {
    console.log(apiResponse);
    setResponse(apiResponse.answer);
  };

  const handleSubmit = async () => {
    try {
      const data = { question };

      setIsWaiting(true);

      const response = await fetch('http://localhost:8084/veriAl', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        handleApiResponse(responseData);

        setMessages([
          ...messages,
          { text: question, isUser: true },
          { text: responseData.answer, isUser: false },
        ]);
      } else {
        setResponse('İstek başarısız oldu.');
      }
    } catch (error) {
      console.error('Hata:', error);
      setResponse('Bir hata oluştu.');
    } finally {
      setIsWaiting(false);

    }
    setQuestion('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  const sendFirstMessage = () => {
    const firstMessage = "Merhaba ben takasbot size nasıl yardımcı olabilirim ?";
    setMessages([
      ...messages,
      { text: firstMessage, isUser: false },
    ]);
    setShowWelcomeMessage(false); 
  };

  const openChat = () => {
    setIsChatOpen(true);
    if (showWelcomeMessage) {
      sendFirstMessage();
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div>
      <div
        className={`chat-icon ${isChatOpen ? 'active' : ''}`}
        onClick={isChatOpen ? closeChat : openChat}
      >
        <div className="avatar-container">
          <img
            src="img/img.jpg"
            alt="Chatbot Avatar"
            className="chat-avatar"
          />
        </div>
      </div>
      {isChatOpen && (
        <div className="chat-container">
          <div className="chat-modal">
            <h3>TakasBot</h3>
            <div
              className="chat-message-container"
              ref={messageListRef}
              style={{ overflowY: 'auto', maxHeight: '400px' }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.isUser ? 'user' : 'bot'}`}
                > 
                  <p>{message.text}</p>
                </div>
              ))}
              {isWaiting && (<div className='chat-message.bot'> <p>Cevap Bekleniyor...</p> </div>)}
            </div>
            <input
              type="text"
              placeholder="Soru"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="chat-input"
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSubmit} className="chat-submit-button">
                Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


