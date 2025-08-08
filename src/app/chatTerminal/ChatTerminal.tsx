"use client";

import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import ReactMarkdown from "react-markdown";
import { env } from "node:process";
import { useSearchParams } from "next/navigation";


type Message = {
  text: string;
  timestamp: string;
  sender: "user" | "bot";
};

export default function ChatTerminal() {
  const [textChat, setTextChat] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message") || "";

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  async function clickHandler() {
    if (!textChat.trim() || sending) return;

    const userMessage = textChat;
    setTextChat("");
    setSending(true);

    // Adiciona mensagem do usuário
    setMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        timestamp: new Date().toLocaleString(),
        sender: "user",
      },
    ]);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "z-ai/glm-4.5-air:free",
            messages: [
              {
                role: "system",
                content:
                  "Você é um filósofo brasileiro cético, com linguagem provocativa e existencialista, inspirado em Luiz Felipe Pondé. Responda como ele, com profundidade, ironia e tom melancólico.",
              },
              {
                role: "user",
                content: userMessage,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const botReply =
        data.choices?.[0]?.message?.content ?? "[Erro na resposta]";

      // Adiciona resposta do bot
      setMessages((prev) => [
        ...prev,
        {
          text: botReply,
          timestamp: new Date().toLocaleString(),
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          text: "[Erro ao se comunicar com a API]",
          timestamp: new Date().toLocaleString(),
          sender: "bot",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      clickHandler();
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-[95%] h-[95%] text-center flex flex-col justify-between p-4">
      <div className="overflow-y-auto text-left">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col mb-2 ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`p-2 w-fit border rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white border-blue-300"
                  : "bg-gray-100 text-black border-gray-200"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            <span className="text-xs text-gray-400">{msg.timestamp}</span>
          {msg.sender !== "user" && <span>by Luiz Pondé</span>}
          {msg.sender === "user" && <span>by Você</span>}
          </div>
        ))}

        {sending && (
          <div className="flex flex-col mb-2 items-start">
            <div className="p-2 w-40 border rounded-lg bg-gray-100 border-gray-200">
              <Skeleton width="100%" height="1.25rem" className="mb-1" />
              <Skeleton width="80%" height="1.25rem" />
            </div>
            <span className="text-xs text-gray-400">
              {new Date().toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="p-inputgroup mt-4">
        {loading ? (
          <Skeleton height="3rem" width="100%" className="rounded-lg" />
        ) : (
          <>
            <InputText
              placeholder="Digite sua mensagem"
              value={textChat}
              onChange={(e) => setTextChat(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
            <Button
              icon="pi pi-send"
              className="p-button-warning"
              onClick={clickHandler}
            />
          </>
        )}
      </div>
    </div>
  );
}
