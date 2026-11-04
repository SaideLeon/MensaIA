"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Phone,
  Search,
  MoreVertical,
  Send,
  Sparkles,
  Lightbulb,
  Mic,
  MicOff,
  Copy,
  Check,
  RotateCw,
  Trash2,
  Plus,
  Bot,
  ChevronDown,
  ChevronUp,
  X,
  HelpCircle,
  Wand2,
} from "lucide-react";
import {
  SmsMessage,
  WritingAction,
  SmartReplyStyle,
  SmartReplyOption,
  AssistantChatMessage,
} from "@/types";

interface ConversationViewProps {
  onBack: () => void;
  contactAddress: string;
  contactDisplayName: string;
  messages: SmsMessage[];
  onSendMessage: (text: string) => void;
  onDeleteMessage: (id: number) => void;
}

const WRITING_ACTIONS: { id: WritingAction; label: string; description: string }[] = [
  { id: "CORRIGIR_ORTOGRAFIA", label: "Corrigir ortografia", description: "Gramática, acentuação e pontuação" },
  { id: "MELHORAR_MENSAGEM", label: "Melhorar clareza", description: "Fluência e elegância natural" },
  { id: "MAIS_CARINHOSA", label: "Mais carinhosa", description: "Tom doce, atencioso e afetuoso" },
  { id: "MAIS_FORMAL", label: "Mais formal", description: "Polido e profissional" },
  { id: "MAIS_CURTA", label: "Mais curta", description: "Síntese concisa direta ao ponto" },
  { id: "MAIS_DIRETA", label: "Mais direta", description: "Objetivo sem rodeios" },
  { id: "PERSONALIZAR", label: "Personalizar", description: "Instrução customizada" },
];

const SMART_STYLES: SmartReplyStyle[] = [
  "AUTOMATICO",
  "NATURAL",
  "CARINHOSO",
  "ROMANTICO",
  "AMIGAVEL",
  "FORMAL",
  "PROFISSIONAL",
  "EDUCADO",
  "DIRETO",
  "DIVERTIDO",
  "CURTO",
];

export function ConversationView({
  onBack,
  contactAddress,
  contactDisplayName,
  messages,
  onSendMessage,
  onDeleteMessage,
}: ConversationViewProps) {
  const [draft, setDraft] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState<number | null>(null);

  // AI Panels State
  const [activeAiTab, setActiveAiTab] = useState<"writing" | "replies" | "copilot">("writing");
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Writing Assistant States
  const [selectedAction, setSelectedAction] = useState<WritingAction>("CORRIGIR_ORTOGRAFIA");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomPromptInput, setShowCustomPromptInput] = useState(false);
  const [improvedText, setImprovedText] = useState("");
  const [isViewingOriginal, setIsViewingOriginal] = useState(false);
  const [isWritingLoading, setIsWritingLoading] = useState(false);

  // Smart Replies States
  const [smartReplies, setSmartReplies] = useState<SmartReplyOption[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<SmartReplyStyle>("AUTOMATICO");
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [isRepliesLoading, setIsRepliesLoading] = useState(false);

  // In-Conversation Bot Copilot States
  const [botChatHistory, setBotChatHistory] = useState<AssistantChatMessage[]>([]);
  const [botInput, setBotInput] = useState("");
  const [isBotLoading, setIsBotLoading] = useState(false);

  // Voice recording & dictation
  const [isRecording, setIsRecording] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Identify consecutive incoming messages ("mensagem picotada")
  const lastSentIdx = messages.map((m) => m.type).lastIndexOf("sent");
  const unansweredIncoming =
    lastSentIdx === -1
      ? messages.filter((m) => m.type === "inbox")
      : messages.slice(lastSentIdx + 1).filter((m) => m.type === "inbox");

  // Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, draft]);

  // Load Smart Replies based on session messages
  useEffect(() => {
    async function loadSmartReplies() {
      if (messages.length === 0) return;
      setIsRepliesLoading(true);
      try {
        const res = await fetch("/api/ai/writing-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "smart_replies",
            contextMessages: messages,
            contactDisplayName,
            contactAddress,
            style: selectedStyle,
          }),
        });
        const data = await res.json();
        if (data.replies && Array.isArray(data.replies)) {
          setSmartReplies(data.replies);
        }
      } catch (err) {
        console.warn("Failed to load smart replies:", err);
      } finally {
        setIsRepliesLoading(false);
      }
    }

    loadSmartReplies();
  }, [messages.length, selectedStyle, contactAddress]);

  // Execute writing assistant
  const handleExecuteWriting = async (
    action: WritingAction = selectedAction,
    custom: string = customPrompt,
    textToImprove: string = draft
  ) => {
    const text = textToImprove.trim();
    if (!text) {
      setImprovedText("");
      return;
    }
    setIsWritingLoading(true);
    setIsViewingOriginal(false);
    try {
      const res = await fetch("/api/ai/writing-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "writing",
          originalText: text,
          action,
          customInstruction: action === "PERSONALIZAR" ? custom : undefined,
          contextMessages: messages,
          contactDisplayName,
        }),
      });
      const data = await res.json();
      if (data.result?.improvedText) {
        setImprovedText(data.result.improvedText);
      }
    } catch (err) {
      console.warn("Writing assistant error:", err);
    } finally {
      setIsWritingLoading(false);
    }
  };

  // Bot in-conversation chat
  const handleSendBotQuery = async (queryText?: string) => {
    const q = (queryText || botInput).trim();
    if (!q || isBotLoading) return;

    const userMsg: AssistantChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text: q,
      timestamp: Date.now(),
    };

    setBotChatHistory((prev) => [...prev, userMsg]);
    setBotInput("");
    setIsBotLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          messages,
          history: botChatHistory,
          draft,
          contactDisplayName,
          contactAddress,
        }),
      });
      const data = await res.json();
      if (data.answer) {
        const botMsg: AssistantChatMessage = {
          id: String(Date.now() + 1),
          sender: "assistant",
          text: data.answer,
          timestamp: Date.now(),
        };
        setBotChatHistory((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.warn("Bot chat error:", err);
    } finally {
      setIsBotLoading(false);
    }
  };

  // Voice recording & Web Speech API setup
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      showToast("Gravação concluída.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-PT";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        showToast("A escutar... Fale a sua mensagem.");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setDraft((prev) => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        showToast("Erro no microfone.");
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Speech API init error:", e);
      setIsRecording(false);
      showToast("Não foi possível iniciar o microfone.");
    }
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    onSendMessage(draft.trim());
    setDraft("");
    setImprovedText("");
    setIsViewingOriginal(false);
  };

  return (
    <div className="min-h-screen bg-[#130E0C] text-[#F2E0DB] flex flex-col relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#261D1A] border border-[#F59F7A] text-[#F59F7A] text-xs font-semibold px-4 py-2 rounded-full shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-[#332521] bg-[#130E0C] sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 -ml-1 rounded-full hover:bg-[#261D1A] text-[#F2E0DB] transition"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Contact Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#8B4226] flex items-center justify-center font-bold text-white text-sm shrink-0">
            {contactDisplayName.includes("🥰") ? "🥰" : contactDisplayName.charAt(0).toUpperCase()}
          </div>

          {/* Contact Info */}
          <div className="truncate max-w-[170px] sm:max-w-xs">
            <h1 className="font-semibold text-sm text-[#F2E0DB] truncate">
              {contactDisplayName}
            </h1>
            <p className="text-[11px] text-[#A89893] truncate">{contactAddress}</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          {/* AI Copilot Quick Drawer Trigger */}
          <button
            onClick={() => {
              setIsAiDrawerOpen((prev) => !prev);
              setActiveAiTab("copilot");
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition ${
              isAiDrawerOpen
                ? "bg-[#F59F7A] text-[#22120B] font-bold"
                : "bg-[#261D1A] text-[#F59F7A] hover:bg-[#382924] border border-[#382924]"
            }`}
            title="Abrir Assistente da Conversa"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Assistente IA</span>
          </button>

          <button
            onClick={() => showToast(`A ligar para ${contactAddress}...`)}
            className="p-2 rounded-full hover:bg-[#261D1A] text-[#F2E0DB] transition"
            aria-label="Ligar"
          >
            <Phone className="w-5 h-5" />
          </button>

          {/* 3-dots Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-2 rounded-full hover:bg-[#261D1A] text-[#F2E0DB] transition"
              aria-label="Mais opções"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1F1715] border border-[#382924] rounded-2xl shadow-2xl py-2 z-30">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setIsAiDrawerOpen(true);
                    setActiveAiTab("copilot");
                    handleSendBotQuery("Resume o que combinámos nesta conversa.");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#F59F7A] hover:bg-[#261D1A] text-left transition font-semibold"
                >
                  <Bot className="w-4 h-4" />
                  <span>Resumir esta conversa</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    showToast("Todas as mensagens marcadas como lidas.");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#D4C2BD] hover:bg-[#261D1A] text-left transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Marcar conversa como lida</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 max-w-2xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-[#A89893] text-sm">
            <p>Nenhuma mensagem nesta conversa.</p>
            <p className="text-xs mt-1">Escreva uma mensagem abaixo para iniciar.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSent = msg.type === "sent" || msg.type === "outbox";
            const isSelected = selectedMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSent ? "items-end" : "items-start"}`}
              >
                <div
                  onClick={() => setSelectedMsgId(isSelected ? null : msg.id)}
                  className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm cursor-pointer transition select-text ${
                    isSent
                      ? "bg-[#F59F7A] text-[#22120B] rounded-br-sm"
                      : "bg-[#261E1A] text-[#F2E0DB] rounded-bl-sm border border-[#382924]"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                  <div
                    className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
                      isSent ? "text-[#4A1E0E]" : "text-[#A89893]"
                    }`}
                  >
                    <span>
                      {new Date(msg.date).toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isSent && <Check className="w-3 h-3 inline" />}
                  </div>
                </div>

                {/* Message Action Toolbar (shows on click) */}
                {isSelected && (
                  <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-[#1F1715] border border-[#382924] rounded-full text-xs shadow-lg">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.body);
                        showToast("Texto copiado!");
                        setSelectedMsgId(null);
                      }}
                      className="flex items-center gap-1 text-[#D4C2BD] hover:text-[#F59F7A]"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </button>
                    <span className="text-[#382924]">|</span>
                    <button
                      onClick={() => {
                        setIsAiDrawerOpen(true);
                        setActiveAiTab("copilot");
                        setSelectedMsgId(null);
                        handleSendBotQuery(`Sugere como posso responder a esta mensagem de ${contactDisplayName}: "${msg.body}"`);
                      }}
                      className="flex items-center gap-1 text-[#F59F7A] hover:underline"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Sugerir resposta</span>
                    </button>
                    <span className="text-[#382924]">|</span>
                    <button
                      onClick={() => {
                        onDeleteMessage(msg.id);
                        setSelectedMsgId(null);
                        showToast("Mensagem eliminada definitivamente.");
                      }}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ======================================================== */}
      {/* IN-SESSION AI ASSISTANT EXPANDABLE DRAWER                */}
      {/* ======================================================== */}
      {isAiDrawerOpen && (
        <div className="border-t border-[#382A24] bg-[#1A1310] max-w-2xl mx-auto w-full transition-all duration-300 shadow-2xl z-20">
          {/* Drawer Navigation Tabs */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2C1F1B]">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveAiTab("writing")}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  activeAiTab === "writing"
                    ? "bg-[#F59F7A] text-[#22120B]"
                    : "text-[#D4C2BD] hover:bg-[#261D1A]"
                }`}
              >
                Revisão de Texto
              </button>
              <button
                onClick={() => setActiveAiTab("replies")}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  activeAiTab === "replies"
                    ? "bg-[#F59F7A] text-[#22120B]"
                    : "text-[#D4C2BD] hover:bg-[#261D1A]"
                }`}
              >
                Sugestões ({smartReplies.length})
              </button>
              <button
                onClick={() => setActiveAiTab("copilot")}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  activeAiTab === "copilot"
                    ? "bg-[#F59F7A] text-[#22120B]"
                    : "text-[#D4C2BD] hover:bg-[#261D1A]"
                }`}
              >
                Assistente de Sessão
              </button>
            </div>
            <button
              onClick={() => setIsAiDrawerOpen(false)}
              className="p-1 text-[#A89893] hover:text-[#F2E0DB]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 max-h-72 overflow-y-auto">
            {/* TAB 1: REVISÃO DE TEXTO */}
            {activeAiTab === "writing" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A89893]">
                    Revisa o texto escrito, corrigindo erros e adaptando o tom para {contactDisplayName}.
                  </span>
                  {isWritingLoading && (
                    <span className="text-[#F59F7A] flex items-center gap-1">
                      <RotateCw className="w-3 h-3 animate-spin" /> A aprimorar...
                    </span>
                  )}
                </div>

                {/* Tone / Action Selector */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {WRITING_ACTIONS.map((action) => {
                    const active = selectedAction === action.id;
                    return (
                      <button
                        key={action.id}
                        onClick={() => {
                          setSelectedAction(action.id);
                          if (action.id === "PERSONALIZAR") {
                            setShowCustomPromptInput(true);
                          } else {
                            setShowCustomPromptInput(false);
                            handleExecuteWriting(action.id);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition border ${
                          active
                            ? "bg-[#F59F7A]/20 border-[#F59F7A] text-[#F59F7A] font-semibold"
                            : "bg-[#261D1A] border-[#382A24] text-[#EDE5E2] hover:bg-[#332521]"
                        }`}
                      >
                        {action.label}
                      </button>
                    );
                  })}
                </div>

                {showCustomPromptInput && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Ex: Torne mais persuasivo, adicione saudação..."
                      className="flex-1 bg-[#261D1A] border border-[#382A24] text-xs text-[#EDE5E2] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#F59F7A]"
                    />
                    <button
                      onClick={() => handleExecuteWriting("PERSONALIZAR", customPrompt)}
                      className="px-3 py-1 bg-[#F59F7A] text-[#22120B] text-xs font-bold rounded-xl"
                    >
                      OK
                    </button>
                  </div>
                )}

                {/* Suggestion Box */}
                <div className="p-3 bg-[#261D1A] rounded-xl border border-[#382A24] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#A89893]">
                    <span>{isViewingOriginal ? "Texto original" : "Sugestão revisada"}</span>
                    <button
                      onClick={() => handleExecuteWriting()}
                      className="text-[#F59F7A] hover:underline flex items-center gap-1"
                    >
                      <RotateCw className="w-3 h-3" /> Regenerar
                    </button>
                  </div>

                  <p className="text-xs text-[#EDE5E2] leading-relaxed">
                    {isViewingOriginal
                      ? draft || "(Nenhum texto escrito ainda)"
                      : improvedText ||
                        draft ||
                        "Escreva uma mensagem no campo abaixo e a IA revisará a ortografia, pontuação e clareza automaticamente."}
                  </p>

                  {improvedText && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          setDraft(improvedText);
                          showToast("Texto revisado aplicado!");
                        }}
                        className="px-3 py-1 bg-[#F59F7A] text-[#22120B] text-xs font-bold rounded-full hover:brightness-110 transition"
                      >
                        Substituir texto
                      </button>
                      <button
                        onClick={() => setIsViewingOriginal((prev) => !prev)}
                        className="px-2.5 py-1 text-xs border border-[#382924] rounded-full hover:bg-[#332521] text-[#D4C2BD]"
                      >
                        {isViewingOriginal ? "Ver sugestão" : "Ver original"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SUGESTÕES INTELIGENTES */}
            {activeAiTab === "replies" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#A89893]">
                    {unansweredIncoming.length > 1
                      ? `Cobre as ${unansweredIncoming.length} mensagens consecutivas enviadas por ${contactDisplayName}.`
                      : `Sugestões com base no contexto recente da conversa.`}
                  </span>

                  {/* Style selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowStyleMenu((prev) => !prev)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F59F7A]/20 text-[#F59F7A] border border-[#F59F7A]/40 flex items-center gap-1"
                    >
                      <span>{selectedStyle}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {showStyleMenu && (
                      <div className="absolute right-0 mt-1 w-36 bg-[#1F1715] border border-[#382924] rounded-xl shadow-2xl py-1 z-30 max-h-48 overflow-y-auto">
                        {SMART_STYLES.map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              setSelectedStyle(st);
                              setShowStyleMenu(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs transition ${
                              selectedStyle === st
                                ? "bg-[#382924] text-[#F59F7A] font-bold"
                                : "text-[#EDE5E2] hover:bg-[#261D1A]"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {isRepliesLoading ? (
                  <div className="flex items-center justify-center py-4 text-xs text-[#A89893] gap-2">
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-[#F59F7A]" />
                    <span>A formular sugestões inteligentes...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {smartReplies.map((reply) => (
                      <div
                        key={reply.id}
                        className="p-2.5 bg-[#261D1A] border border-[#382A24] rounded-xl flex items-center justify-between gap-3 hover:border-[#F59F7A]/50 transition"
                      >
                        <div className="flex-1">
                          <p className="text-xs text-[#EDE5E2] leading-relaxed">{reply.text}</p>
                          <span className="text-[10px] text-[#A89893] font-medium">
                            {reply.styleLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setDraft(reply.text);
                              showToast("Inserido no campo de texto.");
                            }}
                            className="px-2 py-1 bg-[#1A1310] text-[#D4C2BD] text-[11px] rounded-lg border border-[#382924]"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              onSendMessage(reply.text);
                              showToast("Enviado!");
                            }}
                            className="px-2.5 py-1 bg-[#F59F7A] text-[#22120B] text-[11px] font-bold rounded-lg hover:brightness-110"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ASSISTENTE DE SESSÃO */}
            {activeAiTab === "copilot" && (
              <div className="space-y-3">
                <p className="text-xs text-[#A89893]">
                  O assistente tem conhecimento de toda a conversa trocada nesta sessão com {contactDisplayName}.
                </p>

                {/* Quick questions chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    onClick={() => handleSendBotQuery("O que ficou combinado nesta conversa?")}
                    className="px-2.5 py-1 bg-[#261D1A] border border-[#382A24] rounded-full text-[11px] text-[#D4C2BD] whitespace-nowrap hover:text-[#F59F7A]"
                  >
                    O que combinámos?
                  </button>
                  <button
                    onClick={() => handleSendBotQuery("Resume a conversa com pontos principais.")}
                    className="px-2.5 py-1 bg-[#261D1A] border border-[#382A24] rounded-full text-[11px] text-[#D4C2BD] whitespace-nowrap hover:text-[#F59F7A]"
                  >
                    Resumir conversa
                  </button>
                  <button
                    onClick={() => handleSendBotQuery("Como devo responder de forma amigável e educada?")}
                    className="px-2.5 py-1 bg-[#261D1A] border border-[#382A24] rounded-full text-[11px] text-[#D4C2BD] whitespace-nowrap hover:text-[#F59F7A]"
                  >
                    Como responder?
                  </button>
                </div>

                {/* Chat History */}
                {botChatHistory.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-[#261D1A] rounded-xl border border-[#382A24]">
                    {botChatHistory.map((m) => (
                      <div
                        key={m.id}
                        className={`text-xs p-2 rounded-lg leading-relaxed ${
                          m.sender === "user"
                            ? "bg-[#F59F7A]/20 text-[#EDE5E2] ml-4 text-right"
                            : "bg-[#1A1310] text-[#F2E0DB] mr-4 border border-[#382924]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Question Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={botInput}
                    onChange={(e) => setBotInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendBotQuery()}
                    placeholder={`Pergunte algo sobre a conversa com ${contactDisplayName}...`}
                    className="flex-1 bg-[#261D1A] border border-[#382A24] text-xs text-[#EDE5E2] rounded-xl px-3 py-2 focus:outline-none focus:border-[#F59F7A]"
                  />
                  <button
                    onClick={() => handleSendBotQuery()}
                    disabled={isBotLoading || !botInput.trim()}
                    className="px-3.5 py-2 bg-[#F59F7A] text-[#22120B] font-bold text-xs rounded-xl disabled:opacity-50"
                  >
                    {isBotLoading ? "..." : "Perguntar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* QUICK SUGGESTIONS PILLS (Over composer when drawer closed) */}
      {/* ======================================================== */}
      {!isAiDrawerOpen && smartReplies.length > 0 && (
        <div className="px-3 py-1.5 border-t border-[#261D1A] bg-[#130E0C]/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-2xl mx-auto w-full">
            <span className="text-[10px] text-[#A89893] shrink-0 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#F59F7A]" /> Sugestões:
            </span>
            {smartReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => {
                  setDraft(reply.text);
                  showToast("Sugestão inserida. Pode editar ou enviar!");
                }}
                className="px-3 py-1 bg-[#261D1A] hover:bg-[#382924] border border-[#382924] text-xs text-[#F2E0DB] rounded-full whitespace-nowrap transition active:scale-95"
              >
                {reply.text.length > 38 ? `${reply.text.slice(0, 38)}...` : reply.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BOTTOM COMPOSE BAR                                       */}
      {/* ======================================================== */}
      <footer className="p-3 border-t border-[#332521] bg-[#130E0C] sticky bottom-0 z-20">
        <div className="flex items-center gap-2 max-w-2xl mx-auto w-full">
          {/* AI Review trigger button right by the input */}
          <button
            onClick={() => {
              setIsAiDrawerOpen(true);
              setActiveAiTab("writing");
              if (draft.trim()) {
                handleExecuteWriting(selectedAction);
              }
            }}
            className="p-2 rounded-full bg-[#261D1A] hover:bg-[#382924] text-[#F59F7A] border border-[#382924] transition shrink-0"
            title="Revisar texto com IA"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <div className="flex-1 flex items-center bg-[#261D1A] rounded-3xl px-4 py-2 border border-[#382924] focus-within:border-[#F59F7A] transition">
            <input
              type="text"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (e.target.value.trim().length > 4 && isAiDrawerOpen && activeAiTab === "writing") {
                  handleExecuteWriting(selectedAction, customPrompt, e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Mensagem para ${contactDisplayName}...`}
              className="flex-1 bg-transparent border-none text-sm text-[#F2E0DB] placeholder-[#A89893] focus:outline-none"
            />

            {/* Mic Dictation Button */}
            <button
              onClick={toggleRecording}
              className={`p-1 rounded-full transition ${
                isRecording ? "text-red-500 animate-pulse" : "text-[#A89893] hover:text-[#F2E0DB]"
              }`}
              title={isRecording ? "Parar gravação" : "Falar mensagem"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-md shrink-0 ${
              draft.trim()
                ? "bg-[#F59F7A] text-[#22120B] hover:brightness-110 active:scale-95"
                : "bg-[#261D1A] text-[#A89893] cursor-not-allowed border border-[#382924]"
            }`}
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
