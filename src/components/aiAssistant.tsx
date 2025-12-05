import React, { useState } from 'react';
import { askAI, Message } from '../services/aiAgent';
import './AiAssistant.css';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await askAI('visitorAgent', newMessages);
      const assistantMessage: Message = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Désolé, l'IA a paniqué." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button className="ai-float-btn" onClick={toggleChat}>
        🤖
      </button>

      {/* Fenêtre flottante */}
      {isOpen && (
        <div className="ai-chat-box">
          <div className="chat-header">
            <h3>Assistant IA</h3>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant">
                <div className="message-content loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose ta question..."
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={isLoading}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;
