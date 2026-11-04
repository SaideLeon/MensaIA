export interface SmsMessage {
  id: number;
  telephonyId: number;
  address: string;
  body: string;
  date: number; // milliseconds
  dateSent: number;
  type: "inbox" | "sent" | "draft" | "outbox" | "failed";
  read: number; // 0 = unread, 1 = read
  status: number;
  serviceCenter: string | null;
  isSpam: boolean;
  spamScore: number; // 0 to 100
  spamReason: string | null;
  syncedCloud: boolean;
}

export type GmScreen =
  | "HOME"
  | "CONVERSATION"
  | "NEW_CHAT"
  | "SEARCH"
  | "SETTINGS"
  | "RCS_SETTINGS"
  | "SPAM_PROTECTION"
  | "SWIPE_ACTIONS"
  | "NOTIFICATIONS"
  | "ADVANCED"
  | "ARCHIVED"
  | "SPAM_AND_BLOCKED";

export type SwipeAction = "ARCHIVE" | "DELETE" | "OFF";

export interface CountryInfo {
  name: string;
  dialCode: string;
  flagEmoji: string;
}

export interface WritingAssistantResult {
  originalText: string;
  improvedText: string;
  action: WritingAction;
  isAiGenerated: boolean;
  explanation?: string;
}

export type WritingAction =
  | "CORRIGIR_ORTOGRAFIA"
  | "MELHORAR_MENSAGEM"
  | "MAIS_CARINHOSA"
  | "MAIS_FORMAL"
  | "MAIS_CURTA"
  | "MAIS_DIRETA"
  | "PERSONALIZAR";

export type SmartReplyStyle =
  | "AUTOMATICO"
  | "NATURAL"
  | "CARINHOSO"
  | "ROMANTICO"
  | "AMIGAVEL"
  | "FORMAL"
  | "PROFISSIONAL"
  | "EDUCADO"
  | "DIRETO"
  | "DIVERTIDO"
  | "CURTO"
  | "DETALHADO";

export interface SmartReplyOption {
  id: number;
  text: string;
  styleLabel: string;
}

export interface AssistantChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: number;
}
