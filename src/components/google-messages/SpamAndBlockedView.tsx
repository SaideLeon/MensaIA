"use client";

import React from "react";
import { ArrowLeft, ShieldAlert, Unlock } from "lucide-react";
import { SmsMessage } from "@/types";
import { CONTACT_NAMES } from "@/lib/storage";

interface SpamAndBlockedViewProps {
  onBack: () => void;
  blockedAddresses: string[];
  unblock: (addr: string) => void;
  messages: SmsMessage[];
  onOpenConversation: (addr: string) => void;
}

export function SpamAndBlockedView({
  onBack,
  blockedAddresses,
  unblock,
  messages,
  onOpenConversation,
}: SpamAndBlockedViewProps) {
  // Also collect any senders marked with isSpam
  const spamSenders = Array.from(
    new Set(messages.filter((m) => m.isSpam).map((m) => m.address))
  );

  const combinedList = Array.from(
    new Set([...blockedAddresses, ...spamSenders])
  );

  return (
    <div className="min-h-screen bg-[#130E0C] text-[#F2E0DB] flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-[#332521] sticky top-0 bg-[#130E0C] z-10">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-[#261D1A] transition text-[#F2E0DB]"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-[#F2E0DB]">Spam e bloqueadas</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {combinedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ShieldAlert className="w-16 h-16 text-[#A89893] mb-4 opacity-40" />
            <h2 className="text-base font-medium text-[#F2E0DB]">Nenhuma mensagem bloqueada</h2>
            <p className="text-xs text-[#A89893] max-w-xs mt-1">
              As conversas sinalizadas como spam ou bloqueadas por si aparecem aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {combinedList.map((addr) => {
              const name = CONTACT_NAMES[addr] || addr;
              const spamMsg = messages
                .filter((m) => m.address === addr)
                .sort((a, b) => b.date - a.date)[0];

              return (
                <div
                  key={addr}
                  className="p-3.5 bg-[#1F1715] border border-[#382924] rounded-2xl flex items-center justify-between gap-3 hover:bg-[#261D1A] transition"
                >
                  <div
                    onClick={() => onOpenConversation(addr)}
                    className="flex-1 cursor-pointer pr-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-[#F2E0DB]">{name}</span>
                      {spamMsg?.isSpam && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FF4560]/20 text-[#FF5370]">
                          Spam {spamMsg.spamScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#A89893] truncate mt-1">
                      {spamMsg ? spamMsg.body : "Sem mensagens"}
                    </p>
                  </div>
                  {blockedAddresses.includes(addr) && (
                    <button
                      onClick={() => unblock(addr)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#261D1A] hover:bg-[#382924] text-[#D4C2BD] text-xs font-medium rounded-xl border border-[#382924] transition shrink-0"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Desbloquear</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
