"use client";

import React from "react";
import { ArrowLeft, Archive, Trash2, Ban } from "lucide-react";
import { SwipeAction } from "@/types";

interface SwipeActionsViewProps {
  onBack: () => void;
  swipeRightAction: SwipeAction;
  setSwipeRightAction: (action: SwipeAction) => void;
  swipeLeftAction: SwipeAction;
  setSwipeLeftAction: (action: SwipeAction) => void;
}

export function SwipeActionsView({
  onBack,
  swipeRightAction,
  setSwipeRightAction,
  swipeLeftAction,
  setSwipeLeftAction,
}: SwipeActionsViewProps) {
  const options: { id: SwipeAction; label: string; icon: React.ReactNode }[] = [
    { id: "ARCHIVE", label: "Arquivar", icon: <Archive className="w-4 h-4" /> },
    { id: "DELETE", label: "Eliminar", icon: <Trash2 className="w-4 h-4" /> },
    { id: "OFF", label: "Desativado", icon: <Ban className="w-4 h-4" /> },
  ];

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
        <h1 className="text-xl font-semibold text-[#F2E0DB]">Ações de deslize</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 max-w-2xl mx-auto w-full">
        {/* Deslizar para a direita */}
        <div>
          <h2 className="text-sm font-semibold text-[#F59F7A] uppercase tracking-wider mb-2">
            Deslizar para a direita
          </h2>
          <div className="rounded-2xl bg-[#1F1715] border border-[#382924] overflow-hidden divide-y divide-[#261D1A]">
            {options.map((opt) => (
              <label
                key={`right-${opt.id}`}
                className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-[#261D1A] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#F59F7A]">{opt.icon}</span>
                  <span className="text-sm text-[#F2E0DB]">{opt.label}</span>
                </div>
                <input
                  type="radio"
                  name="swipe-right"
                  checked={swipeRightAction === opt.id}
                  onChange={() => setSwipeRightAction(opt.id)}
                  className="w-4 h-4 text-[#F59F7A] focus:ring-[#F59F7A] bg-[#261D1A] border-[#382924]"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Deslizar para a esquerda */}
        <div>
          <h2 className="text-sm font-semibold text-[#F59F7A] uppercase tracking-wider mb-2">
            Deslizar para a esquerda
          </h2>
          <div className="rounded-2xl bg-[#1F1715] border border-[#382924] overflow-hidden divide-y divide-[#261D1A]">
            {options.map((opt) => (
              <label
                key={`left-${opt.id}`}
                className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-[#261D1A] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#F59F7A]">{opt.icon}</span>
                  <span className="text-sm text-[#F2E0DB]">{opt.label}</span>
                </div>
                <input
                  type="radio"
                  name="swipe-left"
                  checked={swipeLeftAction === opt.id}
                  onChange={() => setSwipeLeftAction(opt.id)}
                  className="w-4 h-4 text-[#F59F7A] focus:ring-[#F59F7A] bg-[#261D1A] border-[#382924]"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
