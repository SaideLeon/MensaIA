"use client";

import React from "react";
import { ArrowLeft, ArchiveRestore, Archive } from "lucide-react";
import { SmsMessage } from "@/types";
import { CONTACT_NAMES } from "@/lib/storage";

interface ArchivedMessagesViewProps {
  onBack: () => void;
  archivedAddresses: string[];
  unarchive: (addr: string) => void;
  messages: SmsMessage[];
  onOpenConversation: (addr: string) => void;
}

export function ArchivedMessagesView({
  onBack,
  archivedAddresses,
  unarchive,
  messages,
  onOpenConversation,
}: ArchivedMessagesViewProps) {
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
        <h1 className="text-xl font-semibold text-[#F2E0DB]">Arquivadas</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        {archivedAddresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Archive className="w-16 h-16 text-[#A89893] mb-4 opacity-40" />
            <h2 className="text-base font-medium text-[#F2E0DB]">Nenhuma conversa arquivada</h2>
            <p className="text-xs text-[#A89893] max-w-xs mt-1">
              As conversas arquivadas não aparecem na tela principal de mensagens, ficando guardadas apenas nesta pasta.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {archivedAddresses.map((addr) => {
              const name = CONTACT_NAMES[addr] || addr;
              const lastMsg = messages
                .filter((m) => m.address === addr)
                .sort((a, b) => b.date - a.date)[0];

              return (
                <div
                  key={addr}
                  className="flex items-center justify-between p-3.5 bg-[#1F1715] border border-[#382924] rounded-2xl hover:bg-[#261D1A] transition"
                >
                  <div
                    onClick={() => onOpenConversation(addr)}
                    className="flex-1 cursor-pointer pr-3"
                  >
                    <h3 className="font-medium text-sm text-[#F2E0DB]">{name}</h3>
                    <p className="text-xs text-[#A89893] truncate mt-0.5">
                      {lastMsg ? lastMsg.body : "Sem mensagens"}
                    </p>
                  </div>
                  <button
                    onClick={() => unarchive(addr)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#261D1A] hover:bg-[#382924] text-[#F59F7A] text-xs font-medium rounded-xl border border-[#382924] transition"
                  >
                    <ArchiveRestore className="w-4 h-4" />
                    <span>Desarquivar</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
