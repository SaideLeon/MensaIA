"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  MoreVertical,
  CheckCheck,
  Shield,
  Archive,
  Settings,
  Trash2,
  Undo2,
  Sparkles,
  Info,
  X,
} from "lucide-react";
import { GoogleLogo } from "./GoogleLogo";
import { SmsMessage, GmScreen, SwipeAction } from "@/types";
import { CONTACT_NAMES } from "@/lib/storage";

interface GoogleMessagesHomeProps {
  messages: SmsMessage[];
  archivedAddresses: string[];
  blockedAddresses: string[];
  swipeRightAction: SwipeAction;
  swipeLeftAction: SwipeAction;
  onOpenConversation: (address: string) => void;
  onNavigate: (screen: GmScreen) => void;
  onMarkAllAsRead: () => void;
  onArchive: (addr: string) => void;
  onUnarchive: (addr: string) => void;
  onDeleteConversation: (addr: string) => void;
}

export function GoogleMessagesHome({
  messages,
  archivedAddresses,
  blockedAddresses,
  swipeRightAction,
  swipeLeftAction,
  onOpenConversation,
  onNavigate,
  onMarkAllAsRead,
  onArchive,
  onUnarchive,
  onDeleteConversation,
}: GoogleMessagesHomeProps) {
  const [selectedFilter, setSelectedFilter] = useState("Todas");
  const [showMenu, setShowMenu] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    text: string;
    undoAddr?: string;
  } | null>(null);

  const filters = ["Todas", "Não lidas", "Pessoais", "Transações"];

  // Group messages into distinct conversation threads
  const threadsMap = new Map<string, SmsMessage[]>();
  for (const m of messages) {
    if (archivedAddresses.includes(m.address) || blockedAddresses.includes(m.address)) {
      continue;
    }
    const current = threadsMap.get(m.address) || [];
    current.push(m);
    threadsMap.set(m.address, current);
  }

  // Sort threads: unread on top, then newest message date
  const sortedThreads = Array.from(threadsMap.entries()).sort(([, aList], [, bList]) => {
    const aUnread = aList.some((m) => m.read === 0);
    const bUnread = bList.some((m) => m.read === 0);
    if (aUnread !== bUnread) {
      return aUnread ? -1 : 1;
    }
    const aLatest = Math.max(...aList.map((m) => m.date));
    const bLatest = Math.max(...bList.map((m) => m.date));
    return bLatest - aLatest;
  });

  // Filter threads
  const filteredThreads = sortedThreads.filter(([address, list]) => {
    const hasUnread = list.some((m) => m.read === 0);
    const isPersonal = !/^\d{3,6}$/.test(address);
    const isTransaction = list.some(
      (m) =>
        m.body.includes("MT") ||
        m.body.toLowerCase().includes("saldo") ||
        m.body.toLowerCase().includes("valor") ||
        m.body.toLowerCase().includes("m-pesa")
    );

    if (selectedFilter === "Não lidas") return hasUnread;
    if (selectedFilter === "Pessoais") return isPersonal;
    if (selectedFilter === "Transações") return isTransaction;
    return true;
  });

  const showUndoSnackbar = (text: string, undoAddr?: string) => {
    setSnackbar({ text, undoAddr });
    setTimeout(() => setSnackbar(null), 4000);
  };

  const handleSwipe = (action: SwipeAction, address: string) => {
    if (action === "ARCHIVE") {
      onArchive(address);
      showUndoSnackbar("1 conversa arquivada", address);
    } else if (action === "DELETE") {
      onDeleteConversation(address);
      showUndoSnackbar("1 conversa eliminada definitivamente");
    }
  };

  return (
    <div className="min-h-screen bg-[#130E0C] text-[#F2E0DB] flex flex-col relative pb-24">
      {/* Undo Snackbar */}
      {snackbar && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-[#261D1A] border border-[#382924] rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xl z-40 text-sm text-[#F2E0DB]">
          <span>{snackbar.text}</span>
          {snackbar.undoAddr && (
            <button
              onClick={() => {
                if (snackbar.undoAddr) {
                  onUnarchive(snackbar.undoAddr);
                }
                setSnackbar(null);
              }}
              className="flex items-center gap-1 font-bold text-[#F59F7A] hover:underline text-xs ml-3"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Anular</span>
            </button>
          )}
        </div>
      )}

      {/* Top Search Pill Bar */}
      <div className="p-3 sticky top-0 bg-[#130E0C] z-20">
        <div className="flex items-center justify-between bg-[#261D1A] rounded-full px-4 py-2 border border-[#382924] shadow-md max-w-2xl mx-auto w-full">
          <div
            onClick={() => onNavigate("SEARCH")}
            className="flex items-center gap-3.5 flex-1 cursor-pointer select-none"
          >
            <GoogleLogo className="w-5 h-5 shrink-0" />
            <span className="text-sm text-[#D4C2BD]">Pesquisar mensagens</span>
          </div>

          <div className="flex items-center gap-2">
            {/* User Avatar Circle */}
            <div className="w-7 h-7 rounded-full bg-[#6750A4] flex items-center justify-center font-bold text-white text-xs select-none">
              M
            </div>

            {/* 3-dots Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="p-1.5 rounded-full hover:bg-[#382924] text-[#F2E0DB] transition"
                aria-label="Mais opções"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1F1715] border border-[#382924] rounded-2xl shadow-2xl py-2 z-30">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onMarkAllAsRead();
                      showUndoSnackbar("Todas as mensagens marcadas como lidas.");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#F2E0DB] hover:bg-[#261D1A] text-left transition"
                  >
                    <CheckCheck className="w-4 h-4 text-[#F59F7A]" />
                    <span>Marcar todas como lidas</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onNavigate("SPAM_AND_BLOCKED");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#F2E0DB] hover:bg-[#261D1A] text-left transition"
                  >
                    <Shield className="w-4 h-4 text-[#F59F7A]" />
                    <span>Spam e bloqueadas</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onNavigate("ARCHIVED");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#F2E0DB] hover:bg-[#261D1A] text-left transition"
                  >
                    <Archive className="w-4 h-4 text-[#F59F7A]" />
                    <span>Arquivadas</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onNavigate("SETTINGS");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#F2E0DB] hover:bg-[#261D1A] text-left transition"
                  >
                    <Settings className="w-4 h-4 text-[#F59F7A]" />
                    <span>Definições</span>
                  </button>

                  <div className="h-px bg-[#261D1A] my-1" />

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowPrivacyNotice(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#10B981] hover:bg-[#261D1A] text-left transition font-semibold"
                  >
                    <Info className="w-4 h-4" />
                    <span>Privacidade & Transparência</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Chips Horizontal Row */}
        <div className="flex gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar max-w-2xl mx-auto w-full">
          {filters.map((filter) => {
            const active = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                  active
                    ? "bg-[#F59F7A]/20 border-[#F59F7A] text-[#F59F7A]"
                    : "bg-[#1F1715] border-[#382924] text-[#D4C2BD] hover:bg-[#261D1A]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation Thread List */}
      <div className="flex-1 overflow-y-auto max-w-2xl mx-auto w-full">
        {filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <MessageSquare className="w-14 h-14 text-[#A89893] mb-3 opacity-30" />
            <h2 className="text-base font-medium text-[#F2E0DB]">Nenhuma conversa encontrada</h2>
            <p className="text-xs text-[#A89893] mt-1">
              Toque em &ldquo;Iniciar chat&rdquo; para começar uma nova conversa.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#261D1A]/60">
            {filteredThreads.map(([address, threadMsgs]) => {
              const displayName = CONTACT_NAMES[address] || address;
              const lastMsg = threadMsgs.sort((a, b) => b.date - a.date)[0];
              const hasUnread = threadMsgs.some((m) => m.read === 0);
              const formattedTime = formatMsgDate(lastMsg ? lastMsg.date : Date.now());

              return (
                <div
                  key={address}
                  className="group relative flex items-center justify-between px-4 py-3 hover:bg-[#1F1715] transition cursor-pointer select-none"
                  onClick={() => onOpenConversation(address)}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
                    {/* Circle Avatar */}
                    <div className="w-11 h-11 rounded-full bg-[#8B4226] flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm">
                      {displayName.includes("🥰")
                        ? "🥰"
                        : displayName.charAt(0).toUpperCase()}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm truncate ${
                            hasUnread ? "font-bold text-[#F2E0DB]" : "text-[#F2E0DB]"
                          }`}
                        >
                          {displayName}
                        </span>
                        <span
                          className={`text-xs ml-2 shrink-0 ${
                            hasUnread ? "text-[#F59F7A] font-bold" : "text-[#A89893]"
                          }`}
                        >
                          {formattedTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-0.5">
                        <p
                          className={`text-xs truncate ${
                            hasUnread ? "text-[#F2E0DB] font-semibold" : "text-[#D4C2BD]"
                          }`}
                        >
                          {lastMsg ? lastMsg.body : ""}
                        </p>
                        {hasUnread && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#F59F7A] ml-2 shrink-0 shadow-sm" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Button on Hover */}
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-2">
                    {swipeRightAction !== "OFF" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSwipe(swipeRightAction, address);
                        }}
                        className="p-1.5 rounded-full hover:bg-[#261D1A] text-[#A89893] hover:text-[#F59F7A] transition"
                        title={swipeRightAction === "ARCHIVE" ? "Arquivar" : "Eliminar"}
                      >
                        {swipeRightAction === "ARCHIVE" ? (
                          <Archive className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button: "Iniciar chat" */}
      <button
        onClick={() => onNavigate("NEW_CHAT")}
        className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-[#F59F7A] hover:bg-[#e68c65] text-[#22120B] font-semibold px-5 py-3.5 rounded-2xl shadow-xl transition active:scale-95 z-30"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="text-sm">Iniciar chat</span>
      </button>

      {/* Privacy and Transparency Modal */}
      {showPrivacyNotice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#1F1715] border border-[#382924] rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#10B981]" />
                <h3 className="font-bold text-sm text-[#F2E0DB]">
                  Privacidade e Transparência
                </h3>
              </div>
              <button
                onClick={() => setShowPrivacyNotice(false)}
                className="p-1 text-[#A89893] hover:text-[#F2E0DB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#D4C2BD] leading-relaxed space-y-2">
              <p>
                ✓ <strong>Sem Cópias Ocultas:</strong> Este aplicativo opera exclusivamente como um mensageiro direto. Nenhuma área de backup oculto ou salvamento forense existe.
              </p>
              <p>
                ✓ <strong>Eliminação Real:</strong> Quando elimina uma mensagem ou conversa, ela é removida de forma permanente e imediata do seu dispositivo.
              </p>
              <p>
                ✓ <strong>Assistente de IA Seguro:</strong> O assistente de inteligência artificial atua apenas durante a sua sessão ativa para revisar rascunhos, corrigir erros gramaticais e fornecer sugestões inteligentes de resposta.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPrivacyNotice(false)}
                className="px-4 py-2 bg-[#F59F7A] text-[#22120B] text-xs font-bold rounded-xl hover:brightness-110"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatMsgDate(millis: number): string {
  const d = new Date(millis);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return "ontem";
  }
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });
}
