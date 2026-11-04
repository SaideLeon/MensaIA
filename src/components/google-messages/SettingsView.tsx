"use client";

import React from "react";
import { ArrowLeft, Sparkles, ChevronRight, ShieldCheck, Info } from "lucide-react";
import { GmScreen } from "@/types";

interface SettingsViewProps {
  onBack: () => void;
  onNavigate: (screen: GmScreen) => void;
  rcsEnabled: boolean;
  outgoingSounds: boolean;
  setOutgoingSounds: (val: boolean) => void;
  spamProtectionEnabled: boolean;
}

export function SettingsView({
  onBack,
  onNavigate,
  rcsEnabled,
  outgoingSounds,
  setOutgoingSounds,
  spamProtectionEnabled,
}: SettingsViewProps) {
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
        <h1 className="text-xl font-semibold text-[#F2E0DB]">Definições do Mensageiro</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-2xl mx-auto w-full">
        {/* Section: Assistente de IA */}
        <div>
          <h2 className="text-sm font-semibold text-[#F59F7A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Assistente de IA</span>
          </h2>
          <div className="bg-[#1F1715] rounded-2xl border border-[#382924] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#F2E0DB]">
                  Revisão de Texto e Sugestões Inteligentes
                </h3>
                <p className="text-xs text-[#A89893] mt-0.5">
                  Corrige ortografia, adapta o tom e sugere 3 respostas contextuais baseadas na conversa ativa.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-[#10B981]/20 text-[#10B981] font-bold text-xs rounded-full border border-[#10B981]/40">
                Ativo
              </span>
            </div>
            <div className="pt-2 border-t border-[#261D1A] text-xs text-[#A89893] leading-relaxed">
              O assistente analisa apenas as mensagens da sessão em curso para gerar auxílio imediato. Nenhuma conversa é gravada em histórico oculto de backup.
            </div>
          </div>
        </div>

        {/* Section: Geral */}
        <div>
          <h2 className="text-sm font-semibold text-[#F59F7A] uppercase tracking-wider mb-2">
            Geral
          </h2>
          <div className="divide-y divide-[#261D1A] bg-[#1F1715] rounded-2xl border border-[#382924] overflow-hidden">
            {/* 1. Chats RCS */}
            <button
              onClick={() => onNavigate("RCS_SETTINGS")}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#261D1A] transition"
            >
              <div>
                <h3 className="text-sm font-medium text-[#F2E0DB]">Chats RCS</h3>
                <p className="text-xs text-[#A89893] mt-0.5">
                  {rcsEnabled ? "Ligado" : "Desativado"}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A89893]" />
            </button>

            {/* 2. Notificações */}
            <button
              onClick={() => onNavigate("NOTIFICATIONS")}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#261D1A] transition"
            >
              <div>
                <h3 className="text-sm font-medium text-[#F2E0DB]">Notificações</h3>
                <p className="text-xs text-[#A89893] mt-0.5">
                  Predefinições de som, vibração e ecrã de bloqueio
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A89893]" />
            </button>

            {/* 3. Ouvir sons (Switch) */}
            <div className="flex items-center justify-between p-4">
              <div className="pr-4">
                <h3 className="text-sm font-medium text-[#F2E0DB]">
                  Ouvir os sons das mensagens enviadas
                </h3>
                <p className="text-xs text-[#A89893] mt-0.5">
                  Reproduzir um som breve ao enviar mensagens SMS ou RCS
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={outgoingSounds}
                  onChange={(e) => setOutgoingSounds(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
              </label>
            </div>

            {/* 4. Ações de deslize */}
            <button
              onClick={() => onNavigate("SWIPE_ACTIONS")}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#261D1A] transition"
            >
              <div>
                <h3 className="text-sm font-medium text-[#F2E0DB]">Ações de deslize</h3>
                <p className="text-xs text-[#A89893] mt-0.5">
                  Personalizar as ações de deslize para a esquerda e para a direita
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A89893]" />
            </button>

            {/* 5. Proteção contra spam */}
            <button
              onClick={() => onNavigate("SPAM_PROTECTION")}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#261D1A] transition"
            >
              <div>
                <h3 className="text-sm font-medium text-[#F2E0DB]">Proteção contra spam</h3>
                <p className="text-xs text-[#A89893] mt-0.5">
                  {spamProtectionEnabled ? "Ativada" : "Desativada"}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A89893]" />
            </button>

            {/* 6. Avançadas */}
            <button
              onClick={() => onNavigate("ADVANCED")}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#261D1A] transition"
            >
              <div>
                <h3 className="text-sm font-medium text-[#F2E0DB]">Avançadas</h3>
                <p className="text-xs text-[#A89893] mt-0.5">
                  MMS, país, relatórios de entrega e definições de operador
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A89893]" />
            </button>
          </div>
        </div>

        {/* Section: Privacidade & Transparência */}
        <div>
          <h2 className="text-sm font-semibold text-[#F59F7A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Privacidade & Conformidade</span>
          </h2>
          <div className="bg-[#1F1715] rounded-2xl border border-[#382924] p-4 space-y-2">
            <h3 className="text-sm font-medium text-[#F2E0DB]">
              Sem Retenção ou Backup Oculto
            </h3>
            <p className="text-xs text-[#A89893] leading-relaxed">
              Por razões de transparência e estrita conformidade legal, este mensageiro não possui qualquer cofre forense ou rotina oculta de arquivamento. Quando uma mensagem é eliminada, ela é permanentemente apagada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
