import { useState, useRef, useEffect } from "react";
import { SendOutlined, CloseOutlined, MessageOutlined, LoadingOutlined } from "@ant-design/icons";
import "./SupportChatWidget.css";

// Generate or retrieve sessionId
const getOrCreateSessionId = () => {
  let sessionId = sessionStorage.getItem("chat-session-id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("chat-session-id", sessionId);
  }
  return sessionId;
};

// Helper to save messages to sessionStorage
const saveMessagesToSession = (messages) => {
  sessionStorage.setItem("chat-messages", JSON.stringify(messages));
};

// Helper to load messages from sessionStorage
const loadMessagesFromSession = () => {
  const saved = sessionStorage.getItem("chat-messages");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [{ id: "welcome", role: "assistant", content: "Xin chào! Tôi có thể giúp gì cho bạn?" }];
    }
  }
  return [{ id: "welcome", role: "assistant", content: "Xin chào! Tôi có thể giúp gì cho bạn?" }];
};

export default function SupportChatWidget() {
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadMessagesFromSession());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Save messages whenever they change
  useEffect(() => {
    saveMessagesToSession(messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const tempId = `user-${Date.now()}`;
    const botTempId = `bot-${Date.now()}`;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "user", content: userMessage }
    ]);

    setInput("");
    setIsLoading(true);

    try {
      // Add bot placeholder
      setMessages((prev) => [
        ...prev,
        { id: botTempId, role: "assistant", content: "" }
      ]);

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/chat`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error("Không thể gửi câu hỏi");
      }

      let accumulated = "";
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const json = line.replace("data: ", "");
              try {
                const parsed = JSON.parse(json);
                if (parsed.token) {
                  accumulated += parsed.token;
                  setMessages((prev) => {
                    const next = [...prev];
                    const botMsgIndex = next.findIndex(m => m.id === botTempId);
                    if (botMsgIndex !== -1) {
                      next[botMsgIndex] = { ...next[botMsgIndex], content: accumulated };
                    }
                    return next;
                  });
                }
              } catch { }
            }
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setMessages((prev) => {
        const next = [...prev];
        const botMsgIndex = next.findIndex(m => m.id === botTempId);
        if (botMsgIndex !== -1) {
          next[botMsgIndex] = { ...next[botMsgIndex], content: errorMsg };
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Widget Container */}
      <div className={`support-chat-widget ${isOpen ? "open" : "closed"}`}>
        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <h3>Hỗ trợ</h3>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng chat"
              >
                <CloseOutlined />
              </button>
            </div>

            <div className="messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}

              {isLoading && (
                <div className="message assistant loading">
                  <div className="message-content">
                    <LoadingOutlined /> Đang chuẩn bị...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Hỏi gì đó..."
                disabled={isLoading}
                className="message-input"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="send-btn"
                aria-label="Gửi tin nhắn"
              >
                <SendOutlined />
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          className="chat-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Mở chat hỗ trợ"
        >
          <MessageOutlined />
        </button>
      </div>
    </>
  );
}
