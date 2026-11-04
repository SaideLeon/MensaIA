"use client";

import React from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface SpamProtectionViewProps {
  onBack: () => void;
  spamProtectionEnabled: boolean;
  setSpamProtectionEnabled: (val: boolean) => void;
}

export function SpamProtectionView({
  onBack,
  spamProtectionEnabled,
  setSpamProtectionEnabled,
}: SpamProtectionViewProps) {
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
        <h1 className="text-xl font-semibold text-[#F2E0DB]">Proteção contra spam</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between py-3 border-b border-[#261D1A]">
          <div className="pr-4">
            <h2 className="text-base font-medium text-[#F2E0DB]">
              Ativar a proteção contra spam
            </h2>
            <p className="text-xs text-[#A89893] mt-1">
              Para detetar spam, a app Mensagens utiliza tecnologia de inteligência artificial
              e heurísticas no dispositivo para filtrar remetentes desconhecidos suspeitos.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={spamProtectionEnabled}
              onChange={(e) => setSpamProtectionEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
          </label>
        </div>

        <div className="p-4 rounded-2xl bg-[#1F1715] border border-[#382924] space-y-3">
          <div className="flex items-center gap-2 text-[#F59F7A]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Privacidade e Proteção Nativa</h3>
          </div>
          <p className="text-xs text-[#D4C2BD] leading-relaxed">
            Quando a proteção contra spam está ativada, os dados das mensagens permanecem no
            seu dispositivo. O classificador analisa links externos, padrões de phishing e palavras
            de lotaria/sorteio de forma segura sem divulgar informações privadas.
          </p>
        </div>
      </div>
    </div>
  );
}
