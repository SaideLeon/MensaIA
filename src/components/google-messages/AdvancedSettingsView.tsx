"use client";

import React, { useState } from "react";
import { ArrowLeft, Globe, Phone, Radio, ChevronRight } from "lucide-react";
import { CountryInfo } from "@/types";
import { AVAILABLE_COUNTRIES } from "@/lib/storage";

interface AdvancedSettingsViewProps {
  onBack: () => void;
  groupMms: boolean;
  setGroupMms: (val: boolean) => void;
  autoMms: boolean;
  setAutoMms: (val: boolean) => void;
  roamingMms: boolean;
  setRoamingMms: (val: boolean) => void;
  deliveryReports: boolean;
  setDeliveryReports: (val: boolean) => void;
  currentCountry: CountryInfo;
  setCurrentCountry: (val: CountryInfo) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  smsc: string;
  setSmsc: (val: string) => void;
}

export function AdvancedSettingsView({
  onBack,
  groupMms,
  setGroupMms,
  autoMms,
  setAutoMms,
  roamingMms,
  setRoamingMms,
  deliveryReports,
  setDeliveryReports,
  currentCountry,
  setCurrentCountry,
  phoneNumber,
  setPhoneNumber,
  smsc,
  setSmsc,
}: AdvancedSettingsViewProps) {
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState(phoneNumber);
  const [showSmscModal, setShowSmscModal] = useState(false);
  const [smscInput, setSmscInput] = useState(smsc);

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
        <h1 className="text-xl font-semibold text-[#F2E0DB]">Avançadas</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-2xl mx-auto w-full">
        {/* MMS section */}
        <div>
          <h2 className="text-sm font-semibold text-[#F59F7A] uppercase tracking-wider mb-2">
            Mensagens Multimédia (MMS)
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
              <div className="pr-4">
                <h3 className="text-sm text-[#F2E0DB]">Mensagens de grupo</h3>
                <p className="text-xs text-[#A89893]">Enviar uma única mensagem SMS a todos os destinatários</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={groupMms}
                  onChange={(e) => setGroupMms(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
              <div className="pr-4">
                <h3 className="text-sm text-[#F2E0DB]">Transferência automática de MMS</h3>
                <p className="text-xs text-[#A89893]">Transferir ficheiros multimédia recebidos automaticamente</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoMms}
                  onChange={(e) => setAutoMms(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
              <div className="pr-4">
                <h3 className="text-sm text-[#F2E0DB]">Transferência em roaming</h3>
                <p className="text-xs text-[#A89893]">Transferir automaticamente enquanto estiver fora do país</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={roamingMms}
                  onChange={(e) => setRoamingMms(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* SMS & Operator section */}
        <div>
          <h2 className="text-sm font-semibold text-[#F59F7A] uppercase tracking-wider mb-2">
            Telefonia & Operador
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#261D1A]">
              <div className="pr-4">
                <h3 className="text-sm text-[#F2E0DB]">Relatórios de entrega de SMS</h3>
                <p className="text-xs text-[#A89893]">Pedir confirmação de entrega para cada mensagem enviada</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryReports}
                  onChange={(e) => setDeliveryReports(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#382924] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4C2BD] peer-checked:after:bg-[#4A1E0E] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59F7A]"></div>
              </label>
            </div>

            {/* Country Picker */}
            <div
              onClick={() => setShowCountryModal(true)}
              className="flex items-center justify-between py-3 border-b border-[#261D1A] cursor-pointer hover:bg-[#1F1715] px-2 rounded-xl transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{currentCountry.flagEmoji}</span>
                <div>
                  <h3 className="text-sm text-[#F2E0DB]">País atual</h3>
                  <p className="text-xs text-[#A89893]">
                    {currentCountry.name} ({currentCountry.dialCode})
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A89893]" />
            </div>

            {/* Phone Number */}
            <div
              onClick={() => {
                setPhoneInput(phoneNumber);
                setShowPhoneModal(true);
              }}
              className="flex items-center justify-between py-3 border-b border-[#261D1A] cursor-pointer hover:bg-[#1F1715] px-2 rounded-xl transition"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F59F7A]" />
                <div>
                  <h3 className="text-sm text-[#F2E0DB]">Número de telefone</h3>
                  <p className="text-xs text-[#A89893]">{phoneNumber}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A89893]" />
            </div>

            {/* SMSC */}
            <div
              onClick={() => {
                setSmscInput(smsc);
                setShowSmscModal(true);
              }}
              className="flex items-center justify-between py-3 border-b border-[#261D1A] cursor-pointer hover:bg-[#1F1715] px-2 rounded-xl transition"
            >
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-[#F59F7A]" />
                <div>
                  <h3 className="text-sm text-[#F2E0DB]">Centro de serviço SMS (SMSC)</h3>
                  <p className="text-xs text-[#A89893]">{smsc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A89893]" />
            </div>
          </div>
        </div>
      </div>

      {/* Country Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F1715] border border-[#382924] rounded-2xl max-w-sm w-full max-h-[80vh] flex flex-col p-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#F2E0DB] mb-3">Selecionar País</h3>
            <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-[#261D1A]">
              {AVAILABLE_COUNTRIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setCurrentCountry(c);
                    setShowCountryModal(false);
                  }}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition ${
                    currentCountry.name === c.name ? "bg-[#382924] text-[#F59F7A]" : "hover:bg-[#261D1A] text-[#F2E0DB]"
                  }`}
                >
                  <span className="text-xl">{c.flagEmoji}</span>
                  <span className="text-sm flex-1">{c.name}</span>
                  <span className="text-xs text-[#A89893]">{c.dialCode}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCountryModal(false)}
              className="mt-4 w-full py-2 bg-[#261D1A] text-[#D4C2BD] rounded-xl hover:bg-[#382924] text-sm transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Phone Number Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F1715] border border-[#382924] rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-[#F2E0DB]">Número de telefone</h3>
            <input
              type="text"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full bg-[#261D1A] border border-[#382924] rounded-xl px-3 py-2.5 text-sm text-[#F2E0DB] focus:outline-none focus:border-[#F59F7A]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="px-4 py-2 text-sm text-[#D4C2BD] hover:bg-[#261D1A] rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setPhoneNumber(phoneInput);
                  setShowPhoneModal(false);
                }}
                className="px-4 py-2 text-sm bg-[#F59F7A] text-[#22120B] font-semibold rounded-xl hover:brightness-110 transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMSC Modal */}
      {showSmscModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F1715] border border-[#382924] rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-[#F2E0DB]">Centro de Serviço SMS</h3>
            <input
              type="text"
              value={smscInput}
              onChange={(e) => setSmscInput(e.target.value)}
              className="w-full bg-[#261D1A] border border-[#382924] rounded-xl px-3 py-2.5 text-sm text-[#F2E0DB] focus:outline-none focus:border-[#F59F7A]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSmscModal(false)}
                className="px-4 py-2 text-sm text-[#D4C2BD] hover:bg-[#261D1A] rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setSmsc(smscInput);
                  setShowSmscModal(false);
                }}
                className="px-4 py-2 text-sm bg-[#F59F7A] text-[#22120B] font-semibold rounded-xl hover:brightness-110 transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
