'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      console.log("Start")
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      console.log("data")
      console.log(data)
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages([
        ...newMessages,
        { sender: 'bot', text: data.choices[0].message.content },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Error: Unable to connect to the server.' },
      ]);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-600 to-blue-400">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/image.jpg" // Replace with your travel background image path
          alt="Travel Background"
          className="w-full h-full object-cover opacity-100"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 mt-2 bg-white bg-opacity-40 backdrop-blur-md shadow-md rounded-full px-10 py-2 text-center">
        <h1 className="text-2xl font-bold text-blue-700">سفر آگاه</h1>
        <p className="text-sm text-gray-900">دستیار هوشمند شما</p>
      </header>

      {/* Chat Container */}
      <main className="relative z-10 mt-2 flex flex-col items-center w-full max-w-5xl bg-gray-50/30 backdrop-blur-md shadow-lg rounded-lg p-6">
        <div
          className="flex flex-col gap-3 w-full h-[29rem] overflow-y-auto bg-gray-50/0 backdrop-blur-md p-4 rounded-lg border border-gray-300"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white bg-opacity-80 backdrop-blur-sm text-gray-800'
                } p-4 rounded-lg max-w-xl shadow-md`}
              >
                {msg.sender === 'bot' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex items-center mt-4 w-full space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your travel question..."
            className="flex-1 px-4 py-3 border border-gray-00 rounded-lg 
                       bg-gray-200/20 backdrop-blur-md shadow-lg focus:outline-none 
                       focus:ring-2 focus:ring-blue-400 transition 
                       placeholder-gray-600 text-gray-800"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 shadow-lg"
          >
            <span>Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10l9-9m0 0l9 9m-9-9v18"
              />
            </svg>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full mt-2 text-center text-white text-sm">
        <p>© 2024 SafarAgah Inc.</p>
      </footer>
    </div>
  );
};

export default Chatbot;
