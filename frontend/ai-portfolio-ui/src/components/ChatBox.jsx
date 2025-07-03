// src/components/ChatBox.jsx
import React, { useState } from "react";
import axios from "axios";

export default function ChatBox({ portfolioId }) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("Thinking...");

    try {
      const res = await axios.post("http://localhost:8000/ask", {
        question: question,
        portfolio_id: portfolioId,
      });
      setResponse(res.data.answer);
    } catch (err) {
      console.error("❌ Error:", err);
      setResponse("❌ Error: Could not get a response from the server.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">💬 Ask a Question</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What is the equity allocation?"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!portfolioId}
        >
          Ask
        </button>
      </form>
      {response && <p className="text-gray-800 whitespace-pre-line">{response}</p>}
    </div>
  );
}
