"use client";

import React from "react";
import { ArrowLeft, Bell, BellRing, Volume2, Vibrate } from "lucide-react";

interface NotificationsViewProps {
  onBack: () => void;
  masterEnabled: boolean;
  setMasterEnabled: (val: boolean) => void;
  incomingEnabled: boolean;
  setIncomingEnabled: (val: boolean) => void;
  otherEnabled: boolean;
  setOtherEnabled: (val: boolean) => void;
  vibration: boolean;
  setVibration: (val: boolean) => void;
}

export function NotificationsView({
  onBack,
  masterEnabled,
  setMasterEnabled,
  incomingEnabled,
  setIncomingEnabled,
  otherEnabled,
  setOtherEnabled,
  vibration,
  setVibration,
}: NotificationsViewProps) {
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
        <h1 className="text-xl font-semibold text-[#F2E0DB]">Notificações</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-2xl mx-auto w-full">
        {/* Master notification toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#1F1715] border border-[#382924]">
          <div className="flex items-center gap-3">
            <BellRing className="w-5 h-5 text-[#F59F7A]" />
            <div>
              <h2 className="text-base font-medium text-[#F2E0DB]">Todas as notificações</h2>
              <p className="text-xs text-[#A89893]">Ativar alertas visuais e sonoros da app</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={masterEnabled}
              onChange={(e) => setMasterEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
          </label>
        </div>

        {/* Detailed notification channels */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#F59F7A] uppercase tracking-wider">Canais</h2>

          <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
            <div>
              <h3 className="text-sm text-[#F2E0DB]">Mensagens recebidas</h3>
              <p className="text-xs text-[#A89893]">Notificar novos SMS e mensagens RCS recebidas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                disabled={!masterEnabled}
                checked={incomingEnabled && masterEnabled}
                onChange={(e) => setIncomingEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
            <div>
              <h3 className="text-sm text-[#F2E0DB]">Vibração</h3>
              <p className="text-xs text-[#A89893]">Vibrar ao receber alertas e novas conversas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                disabled={!masterEnabled}
                checked={vibration && masterEnabled}
                onChange={(e) => setVibration(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
            <div>
              <h3 className="text-sm text-[#F2E0DB]">Outras notificações</h3>
              <p className="text-xs text-[#A89893]">Alertas do sistema, estado do chat e sincronização</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                disabled={!masterEnabled}
                checked={otherEnabled && masterEnabled}
                onChange={(e) => setOtherEnabled(e.target.checked)}
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
