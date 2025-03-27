"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import Groq from "groq-sdk";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatBotProps {
  patientId: string;
  appointmentId?: string;
}

export default function ChatBot({ patientId, appointmentId }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        text: "Hello! I'm your Aayush Bharat AI Assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a medical AI assistant for Aayush Bharat Healthcare. 
            You have access to the following information:
            - Patient ID: ${patientId}
            - Appointment ID: ${appointmentId || "Not provided"}
            
            Please provide helpful responses about:
            1. Appointment status and details
            2. Generic medicine suggestions (always recommend consulting a doctor)
            3. General health advice and lifestyle suggestions
            
            Keep responses concise, professional, and focused on healthcare.`,
          },
          {
            role: "user",
            content: inputMessage,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1000,
      });

      const aiResponse =
        completion.choices[0]?.message?.content ||
        "I apologize, but I couldn't process your request. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          text: aiResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, but I encountered an error. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#131619] text-white shadow-lg hover:bg-[#1a1d21] transition-colors duration-200"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      ) : (
        <div className="h-[500px] w-[350px] rounded-lg bg-white shadow-xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b p-4 bg-[#131619] text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-white" />
              <h3 className="font-semibold">Aayush Bharat AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-[380px] overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-[#131619] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border p-2 focus:border-[#131619] focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="rounded-lg bg-[#131619] p-2 text-white hover:bg-[#1a1d21] transition-colors duration-200 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
