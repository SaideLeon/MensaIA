"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, UserPlus, Users } from "lucide-react";
import { CONTACT_NAMES } from "@/lib/storage";

interface NewChatViewProps {
  onBack: () => void;
  onSelectContact: (address: string, name?: string) => void;
}

export function NewChatView({ onBack, onSelectContact }: NewChatViewProps) {
  const [query, setQuery] = useState("");

  const contacts = Object.entries(CONTACT_NAMES).map(([address, name]) => ({
    address,
    name,
    initial: name.charAt(0).toUpperCase(),
  }));

  const filtered = contacts.filter(
    (c) =>
      query.trim() === "" ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.address.toLowerCase().includes(query.toLowerCase())
  );

  const isCustomNumber =
    query.trim().length > 0 &&
    !contacts.some(
      (c) => c.address === query.trim() || c.name.toLowerCase() === query.trim().toLowerCase()
    );

  return (
    <div className="min-h-screen bg-[#130E0C] text-[#F2E0DB] flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-[#332521] sticky top-0 bg-[#130E0C] z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-[#261D1A] transition text-[#F2E0DB]"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-[#F2E0DB]">Novo chat</h1>
        </div>
        <button
          onClick={() => {}}
          className="p-2 rounded-full hover:bg-[#261D1A] text-[#F2E0DB]"
        >
          <Search className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full">
        {/* "Para:" input line */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#332521]">
          <span className="text-sm font-medium text-[#D4C2BD]">Para:</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                onSelectContact(query.trim(), query.trim());
              }
            }}
            placeholder="Digite nomes, números de telefone ou emails"
            className="flex-1 bg-transparent border-none text-sm text-[#F2E0DB] placeholder-[#A89893] focus:outline-none"
            autoFocus
          />
        </div>

        {/* Criar grupo row */}
        <button
          onClick={() => {}}
          className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-[#1F1715] transition text-left"
        >
          <div className="w-11 h-11 rounded-full bg-[#382924] flex items-center justify-center text-[#F59F7A]">
            <Users className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm text-[#F2E0DB]">Criar grupo</span>
        </button>

        {/* Quick Send to custom number */}
        {isCustomNumber && (
          <button
            onClick={() => onSelectContact(query.trim(), query.trim())}
            className="w-full flex items-center gap-4 px-4 py-3.5 bg-[#1F1715] hover:bg-[#261D1A] transition text-left border-y border-[#382924]"
          >
            <div className="w-11 h-11 rounded-full bg-[#F59F7A]/20 flex items-center justify-center text-[#F59F7A] font-bold text-lg">
              ➔
            </div>
            <div>
              <p className="font-semibold text-sm text-[#F59F7A]">
                Enviar para &ldquo;{query.trim()}&rdquo;
              </p>
              <p className="text-xs text-[#A89893]">Iniciar nova conversa SMS/RCS</p>
            </div>
          </button>
        )}

        {/* Contactos Section */}
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F59F7A]">
            Contactos
          </h2>
        </div>

        <div className="divide-y divide-[#261D1A]">
          {filtered.map((contact) => (
            <button
              key={contact.address}
              onClick={() => onSelectContact(contact.address, contact.name)}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#1F1715] transition text-left"
            >
              <div className="w-11 h-11 rounded-full bg-[#8B4226] flex items-center justify-center text-white font-bold text-base">
                {contact.initial}
              </div>
              <div className="flex-1 truncate">
                <p className="font-medium text-sm text-[#F2E0DB] truncate">
                  {contact.name}
                </p>
                <p className="text-xs text-[#A89893] truncate">
                  Telemóvel • {contact.address}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
