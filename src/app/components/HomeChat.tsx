"use client";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeChat() {
  const [loading, setLoading] = useState(true);
  const [textChat, setTextChat] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  function handleInputChange() {
    if (textChat.trim() === "") return;
    router.push(`/chatTerminal?message=${encodeURIComponent(textChat)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleInputChange();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4 text-black">
        Bem-vindo ao Chat de Filosofia!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Um modelo experimental que utiliza a API OpenRouter, inspirado em uma
        persona filosófica — bem dramática e melancólica 🤣
      </p>
      <div className="w-[40%]">
        <div className="p-inputgroup mt-4 w-full flex justify-center">
          {loading ? (
            <Skeleton height="3rem" width="100%" className="rounded-lg" />
          ) : (
            <>
              <InputText
                placeholder="Digite sua mensagem"
                value={textChat}
                onChange={(e) => setTextChat(e.target.value)}
                className=""
                onKeyDown={handleKeyDown}
              />
              <Button
                icon="pi pi-send"
                className="p-button-success bg-black "
                onClick={handleInputChange}
              />
            </>
          )}
        </div>
      </div>
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
}
