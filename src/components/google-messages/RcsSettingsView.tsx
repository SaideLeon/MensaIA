"use client";

import React from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface RcsSettingsViewProps {
  onBack: () => void;
  rcsEnabled: boolean;
  setRcsEnabled: (val: boolean) => void;
  readReceipts: boolean;
  setReadReceipts: (val: boolean) => void;
  typingIndicators: boolean;
  setTypingIndicators: (val: boolean) => void;
  autoDownload: string;
  setAutoDownload: (val: string) => void;
  resendAsSms: boolean;
  setResendAsSms: (val: boolean) => void;
}

export function RcsSettingsView({
  onBack,
  rcsEnabled,
  setRcsEnabled,
  readReceipts,
  setReadReceipts,
  typingIndicators,
  setTypingIndicators,
  autoDownload,
  setAutoDownload,
  resendAsSms,
  setResendAsSms,
}: RcsSettingsViewProps) {
  return (
    <div className="min-h-screen bg-[#130E0C] text-[#F2E0DB] flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-[#332521] sticky top-0 bg-[#130E0C] z-10">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-[#261D1A] transition text-[#F2E0DB]"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-[#F2E0DB]">Chats RCS</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-2xl mx-auto w-full">
        {/* Status card */}
        <div className="p-4 rounded-2xl bg-[#1F1715] border border-[#382924] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              <span className="font-semibold text-[#F2E0DB]">Estado: Ligado</span>
            </div>
            <p className="text-xs text-[#D4C2BD] mt-1">
              As funcionalidades de chat RCS estão prontas para utilizar no seu operador.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rcsEnabled}
              onChange={(e) => setRcsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#382924] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
          </label>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
            <div className="pr-4">
              <h2 className="text-base font-normal text-[#F2E0DB]">
                Enviar confirmações de leitura
              </h2>
              <p className="text-xs text-[#A89893] mt-0.5">
                Permite que os outros saibam quando leu a mensagem deles
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={readReceipts}
                onChange={(e) => setReadReceipts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
            <div className="pr-4">
              <h2 className="text-base font-normal text-[#F2E0DB]">
                Mostrar indicadores de digitação
              </h2>
              <p className="text-xs text-[#A89893] mt-0.5">
                Permite que os outros saibam quando está a escrever
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={typingIndicators}
                onChange={(e) => setTypingIndicators(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
            <div className="pr-4">
              <h2 className="text-base font-normal text-[#F2E0DB]">
                Transferência automática de ficheiros
              </h2>
              <p className="text-xs text-[#A89893] mt-0.5">
                Limite máximo para download em dados móveis
              </p>
            </div>
            <select
              value={autoDownload}
              onChange={(e) => setAutoDownload(e.target.value)}
              className="bg-[#261D1A] text-[#F59F7A] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#382924] focus:outline-none"
            >
              <option value="Até 10 MB">Até 10 MB</option>
              <option value="Até 50 MB">Até 50 MB</option>
              <option value="Até 105 MB">Até 105 MB</option>
              <option value="Ilimitado">Ilimitado</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
            <div className="pr-4">
              <h2 className="text-base font-normal text-[#F2E0DB]">
                Reenviar automaticamente como SMS/MMS
              </h2>
              <p className="text-xs text-[#A89893] mt-0.5">
                Caso a mensagem RCS não possa ser entregue pela rede de dados
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={resendAsSms}
                onChange={(e) => setResendAsSms(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
