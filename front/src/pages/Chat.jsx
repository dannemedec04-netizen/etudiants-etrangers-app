import { useRef, useState, useEffect } from "react";
import { sendMessage } from "../api/chatbot";
import "./Chat.css";

const WELCOME = {
  role: "assistant",
  content:
    "Bonjour ! Je peux vous aider sur vos questions éducatives (écoles, formations, alternance, stages) et administratives (titre de séjour, aides, droit au travail). Que puis-je faire pour vous ?",
};

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const { reply } = await sendMessage(nextMessages);
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page chat-page">
      <h1>Assistant</h1>
      <p className="subtitle">
        Un assistant pour vous orienter sur le volet éducatif et administratif. Il ne remplace pas
        une source officielle pour les démarches sensibles.
      </p>

      <div className="chat-window card">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.role}`}>
              {message.content}
            </div>
          ))}
          {loading && <div className="chat-bubble assistant chat-typing">L'assistant réfléchit…</div>}
          <div ref={bottomRef} />
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form className="chat-input-row" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Écrivez votre question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn" disabled={loading || !input.trim()}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
