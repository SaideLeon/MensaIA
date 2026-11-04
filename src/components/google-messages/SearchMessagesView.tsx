"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { SmsMessage } from "@/types";
import { CONTACT_NAMES } from "@/lib/storage";

interface SearchMessagesViewProps {
  onBack: () => void;
  messages: SmsMessage[];
  onOpenConversation: (addr: string) => void;
}

export function SearchMessagesView({
  onBack,
  messages,
  onOpenConversation,
}: SearchMessagesViewProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = [
    "Não lidas",
    "Conhecidos",
    "Desconhecidos",
    "Com links",
    "Transações",
  ];

  const filtered = messages.filter((msg) => {
    const q = query.trim().toLowerCase();
    const contactName = (CONTACT_NAMES[msg.address] || "").toLowerCase();
    const matchesQuery =
      q === "" ||
      msg.body.toLowerCase().includes(q) ||
      msg.address.toLowerCase().includes(q) ||
      contactName.includes(q);

    const isShortcode = msg.address.length <= 6 && /^\d+$/.test(msg.address);
    const matchesCategory =
      category === null ||
      (category === "Não lidas" && msg.read === 0) ||
      (category === "Conhecidos" && !isShortcode) ||
      (category === "Desconhecidos" && isShortcode) ||
      (category === "Com links" &&
        (msg.body.includes("http") || msg.body.includes(".com") || msg.body.includes("bit.ly"))) ||
      (category === "Transações" &&
        (msg.body.includes("MT") ||
          msg.body.toLowerCase().includes("saldo") ||
          msg.body.toLowerCase().includes("valor")));

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#130E0C] text-[#F2E0DB] flex flex-col">
      {/* Search Bar Pill Header */}
      <div className="p-3 sticky top-0 bg-[#130E0C] z-10">
        <div className="flex items-center gap-2 bg-[#261D1A] rounded-full px-3 py-1.5 border border-[#382924] shadow-md max-w-2xl mx-auto w-full">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-[#382924] text-[#F2E0DB] transition"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar mensagens"
            className="flex-1 bg-transparent border-none text-sm text-[#F2E0DB] placeholder-[#A89893] focus:outline-none px-2"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#A89893] hover:text-[#F2E0DB]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar max-w-2xl mx-auto w-full">
          {categories.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(active ? null : cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                  active
                    ? "bg-[#F59F7A]/20 border-[#F59F7A] text-[#F59F7A]"
                    : "bg-[#1F1715] border-[#382924] text-[#D4C2BD] hover:bg-[#261D1A]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-2 max-w-2xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Search className="w-12 h-12 text-[#A89893] mb-3 opacity-30" />
            <p className="text-sm text-[#D4C2BD]">
              {query || category ? "Nenhum resultado encontrado" : "Pesquise por contactos ou palavras-chave"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#261D1A]">
            {filtered.map((msg) => {
              const contactName = CONTACT_NAMES[msg.address] || msg.address;
              return (
                <div
                  key={msg.id}
                  onClick={() => onOpenConversation(msg.address)}
                  className="py-3 px-2 rounded-xl hover:bg-[#1F1715] cursor-pointer transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-[#F2E0DB]">
                      {contactName}
                    </span>
                    <span className="text-[11px] text-[#A89893]">
                      {new Date(msg.date).toLocaleDateString("pt-PT")}
                    </span>
                  </div>
                  <p className="text-xs text-[#D4C2BD] line-clamp-2 leading-relaxed">
                    {msg.body}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
