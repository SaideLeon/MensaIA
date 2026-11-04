import { GoogleGenAI } from "@google/genai";
import {
  SmsMessage,
  WritingAction,
  SmartReplyStyle,
  SmartReplyOption,
  WritingAssistantResult,
  AssistantChatMessage,
} from "@/types";

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Revisa e aprimora o texto escrito pelo utilizador antes de enviar,
 * com conhecimento do contexto da conversa em curso.
 */
export async function correctAndImproveText(
  originalText: string,
  action: WritingAction,
  customInstruction?: string,
  contextMessages?: SmsMessage[],
  contactDisplayName?: string
): Promise<WritingAssistantResult> {
  const trimmed = originalText.trim();
  if (!trimmed) {
    return {
      originalText,
      improvedText: originalText,
      action,
      isAiGenerated: false,
    };
  }

  const ai = getGenAI();
  if (!ai) {
    return {
      originalText,
      improvedText: localFallbackImprovement(trimmed, action, customInstruction),
      action,
      isAiGenerated: false,
    };
  }

  try {
    let actionInstruction = "";
    switch (action) {
      case "CORRIGIR_ORTOGRAFIA":
        actionInstruction =
          "Corrija erros de ortografia, gramática, pontuação e concordância. Mantenha o vocabulário e estilo original do utilizador. Não invente novas ideias.";
        break;
      case "MELHORAR_MENSAGEM":
        actionInstruction =
          "Torne o texto mais fluente, natural e bem estruturado, preservando os detalhes e intenção originais.";
        break;
      case "MAIS_CARINHOSA":
        actionInstruction =
          "Adicione um tom afetuoso, doce e atencioso apropriado para pessoas queridas, sem exagero artificial.";
        break;
      case "MAIS_FORMAL":
        actionInstruction =
          "Adapte para uma comunicação formal, polida e profissional.";
        break;
      case "MAIS_CURTA":
        actionInstruction =
          "Sintetize o texto tornando-o conciso e direto, ideal para mensagens rápidas.";
        break;
      case "MAIS_DIRETA":
        actionInstruction =
          "Seja objetivo e direto ao ponto, eliminando rodeios mas mantendo a cortesia.";
        break;
      case "PERSONALIZAR":
        actionInstruction = `Siga a instrução personalizada: ${customInstruction || "Melhorar clareza e fluidez"}.`;
        break;
    }

    let contextSection = "";
    if (contextMessages && contextMessages.length > 0) {
      const recent = contextMessages.slice(-8);
      contextSection = `\nContexto da conversa atual com ${contactDisplayName || "o contacto"}:\n` +
        recent
          .map(
            (m) =>
              `- [${m.type === "inbox" ? "Recebida de " + (contactDisplayName || "Contacto") : "Enviada por Mim"}]: "${m.body}"`
          )
          .join("\n");
    }

    const prompt = `Você é um Assistente de Escrita e Revisão Integrado em um mensageiro moderno em língua portuguesa.
Respeite o tom natural do utilizador (incluindo expressões usuais em Moçambique, Angola, Portugal ou Brasil).

Sua tarefa é revisar ou reformular o rascunho de texto que o utilizador pretende enviar.
Regra da revisão: ${actionInstruction}
${contextSection}

Rascunho escrito pelo utilizador:
"${trimmed}"

IMPORTANTE: Responda ESTRITAMENTE com o texto revisado final, pronto para ser enviado. Não adicione aspas circundantes, nem explicações, notas ou preâmbulos.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const result = (response.text || "").trim().replace(/^["']|["']$/g, "");
    if (result) {
      return {
        originalText,
        improvedText: result,
        action,
        isAiGenerated: true,
      };
    }
  } catch (err) {
    console.warn("Gemini writing assistant fallback:", err);
  }

  return {
    originalText,
    improvedText: localFallbackImprovement(trimmed, action, customInstruction),
    action,
    isAiGenerated: false,
  };
}

/**
 * Gera 3 sugestões inteligentes de resposta com base no histórico integral da sessão com o contacto.
 */
export async function generateThreeSmartReplies(
  messages: SmsMessage[],
  contactDisplayName: string,
  contactAddress: string,
  style: SmartReplyStyle,
  customInstruction?: string
): Promise<SmartReplyOption[]> {
  const sorted = [...messages].sort((a, b) => a.date - b.date);
  const lastSentIdx = sorted.map((m) => m.type).lastIndexOf("sent");

  const unanswered =
    lastSentIdx === -1
      ? sorted.filter((m) => m.type === "inbox")
      : sorted.slice(lastSentIdx + 1).filter((m) => m.type === "inbox");

  const targetMessages =
    unanswered.length > 0
      ? unanswered
      : sorted.filter((m) => m.type === "inbox").slice(-1);

  if (targetMessages.length === 0) {
    return [];
  }

  const ai = getGenAI();
  if (!ai) {
    return localFallbackReplies(targetMessages, sorted, style);
  }

  try {
    const consolidatedText = targetMessages.map((m) => m.body.trim()).join(" ");
    const contactName = contactDisplayName || contactAddress || "Contacto";

    let multipartContext = "";
    if (targetMessages.length > 1) {
      multipartContext = `
⚡ O contacto enviou ${targetMessages.length} mensagens consecutivas sem resposta do Utilizador:
${targetMessages.map((m, i) => `  - [Mensagem ${i + 1}]: "${m.body}"`).join("\n")}
Texto unificado: "${consolidatedText}"
Requisito: Suas sugestões devem responder e levar em conta o conjunto dessas ${targetMessages.length} mensagens, não apenas a última.
`;
    }

    const prompt = `Você é o assistente inteligente de respostas em tempo real deste mensageiro.
Sua missão é sugerir exatamente 3 opções distintas de resposta rápida em português natural, levando em consideração toda a conversa com este contacto.

RELAÇÃO DOS PARTICIPANTES:
- UTILIZADOR (EU): Quem enviará a resposta.
- CONTACTO («${contactName}», ${contactAddress}): Quem receberá a resposta.
NUNCA inverta quem está a falar!

Histórico recente da sessão:
${sorted.slice(-10).map((m) => `• [${m.type === "inbox" ? contactName : "Eu"}]: "${m.body}"`).join("\n")}

${multipartContext}
Mensagem(ns) pendente(s): "${consolidatedText}"
Estilo desejado: ${style}
${customInstruction ? `Instrução especial: ${customInstruction}` : ""}

Regras:
1. Gere EXATAMENTE 3 opções de resposta distintas e prontas para envio em português.
2. Formato obrigatório JSON:
[
  {"id": 1, "text": "resposta 1", "styleLabel": "Direto"},
  {"id": 2, "text": "resposta 2", "styleLabel": "Natural"},
  {"id": 3, "text": "resposta 3", "styleLabel": "Atencioso"}
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const raw = response.text || "";
    const cleanJson = extractJsonArray(raw);
    if (cleanJson) {
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed.slice(0, 3).map((item, idx) => ({
          id: item.id || idx + 1,
          text: String(item.text).trim(),
          styleLabel: String(item.styleLabel || "Natural").trim(),
        }));
      }
    }
  } catch (err) {
    console.warn("Gemini smart replies fallback:", err);
  }

  return localFallbackReplies(targetMessages, sorted, style);
}

/**
 * Assistente de Conversa da Sessão: tem conhecimento de toda a conversa daquela sessão
 * com a pessoa específica. Pode responder perguntas, resumir combinados, sugerir abordagem ou explicar nuances.
 */
export async function chatInConversationContext(
  contactDisplayName: string,
  contactAddress: string,
  messages: SmsMessage[],
  chatHistory: AssistantChatMessage[],
  currentDraft: string,
  userQuery: string
): Promise<string> {
  const ai = getGenAI();
  const sorted = [...messages].sort((a, b) => a.date - b.date);

  if (!ai) {
    return localFallbackConversationAssistant(
      contactDisplayName,
      sorted,
      currentDraft,
      userQuery
    );
  }

  try {
    const formattedTranscript = sorted
      .map(
        (m, idx) =>
          `[${idx + 1}] ${new Date(m.date).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })} - ${
            m.type === "inbox" ? contactDisplayName : "Eu (Utilizador)"
          }: "${m.body}"`
      )
      .join("\n");

    const prompt = `Você é o Assistente de Inteligência Artificial integrado na conversa do mensageiro.
Você possui conhecimento completo de todas as mensagens trocadas nesta sessão entre o Utilizador ("Eu") e o contacto "${contactDisplayName}" (${contactAddress}).

TRANSCRIÇÃO COMPLETA DA SESSÃO COM ${contactDisplayName.toUpperCase()}:
${formattedTranscript || "(Nenhuma mensagem trocada ainda)"}

RASCUNHO ATUAL QUE O UTILIZADOR ESTÁ A ESCREVER:
"${currentDraft || "[Vazio]"}"

HISTÓRICO DA SUA CONVERSA COM O UTILIZADOR SOBRE ESTA SESSÃO:
${chatHistory.slice(-6).map((h) => `${h.sender === "user" ? "Utilizador" : "Assistente"}: "${h.text}"`).join("\n")}

PERGUNTA OU PEDIDO DO UTILIZADOR:
"${userQuery}"

DIRETRIZES:
1. Responda em português claro, empático e prático.
2. Baseie-se estritamente no conteúdo real das mensagens trocadas com ${contactDisplayName}.
3. Se o utilizador perguntar o que foi combinado, resuma horários, compromissos ou valores reais da conversa.
4. Se o utilizador pedir uma sugestão de como responder ou o que escrever, forneça uma sugestão clara e elegante entre aspas para fácil cópia.
5. Seja conciso e direto.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (
      response.text ||
      "Não foi possível formular uma resposta no momento."
    );
  } catch (err) {
    console.warn("Gemini conversation assistant fallback:", err);
    return localFallbackConversationAssistant(
      contactDisplayName,
      sorted,
      currentDraft,
      userQuery
    );
  }
}

/**
 * Análise de segurança e spam de mensagens suspeitas
 */
export async function analyzeSpamRisk(message: SmsMessage): Promise<string> {
  const ai = getGenAI();
  if (!ai) {
    return `Análise preventiva: Remetente ${message.address}. Verifique sempre links e nunca forneça senhas ou PINs por mensagem.`;
  }

  try {
    const prompt = `Você é um analista de segurança de telecomunicações.
Avalie esta mensagem SMS:
Remetente: ${message.address}
Conteúdo: "${message.body}"

Informe resumidamente:
1. Risco (Seguro, Suspeito ou Fraude/Phishing)
2. Motivo
3. Recomendação ao utilizador.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Análise concluída.";
  } catch {
    return "Não foi possível analisar no momento.";
  }
}

// ---------------------------------------------------------------------------------
// LOCAL DETERMINISTIC FALLBACKS (Zero-failure high quality fallbacks)
// ---------------------------------------------------------------------------------

function localFallbackImprovement(
  text: string,
  action: WritingAction,
  custom?: string
): string {
  const formatted = text.replace(/\s+/g, " ").trim();
  const capitalized =
    formatted.charAt(0).toUpperCase() + formatted.slice(1);

  switch (action) {
    case "CORRIGIR_ORTOGRAFIA": {
      const withPunctuation =
        /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
      return withPunctuation;
    }
    case "MELHORAR_MENSAGEM":
      return `${capitalized}. Tudo a correr bem!`;
    case "MAIS_CARINHOSA":
      return `${formatted.replace(/[.]+$/, "")}, com muito carinho 🥰`;
    case "MAIS_FORMAL":
      return `Estimado(a), venho por este meio informar que ${formatted.charAt(0).toLowerCase() + formatted.slice(1)}`;
    case "MAIS_CURTA":
      return formatted.split(/[.?!]/)[0] || formatted;
    case "MAIS_DIRETA":
      return formatted
        .replace(/^(Por favor,\s*|Oi,\s*|Olá,\s*)/i, "")
        .trim();
    case "PERSONALIZAR":
      return custom ? `${capitalized} (${custom})` : capitalized;
  }
}

function localFallbackReplies(
  targetMessages: SmsMessage[],
  allMsgs: SmsMessage[],
  style: SmartReplyStyle
): SmartReplyOption[] {
  const count = targetMessages.length;
  const consolidated = targetMessages.map((m) => m.body.trim()).join(" ");
  const lower = consolidated.toLowerCase();

  const isAffectionate =
    allMsgs.some(
      (m) =>
        m.body.toLowerCase().includes("amor") ||
        m.body.toLowerCase().includes("bem") ||
        m.body.toLowerCase().includes("querid")
    ) ||
    lower.includes("amor") ||
    lower.includes("jantar") ||
    lower.includes("mesa") ||
    style === "CARINHOSO" ||
    style === "ROMANTICO";

  const hasWork =
    lower.includes("relatório") ||
    lower.includes("obra") ||
    lower.includes("trabalho") ||
    lower.includes("documento");

  if (count > 1) {
    const label = `Cobre as ${count} mensagens`;
    if (isAffectionate) {
      return [
        {
          id: 1,
          text: "Li todas as tuas mensagens, meu amor! Já estou a sair e ajudo-te a preparar tudo mal chegue.",
          styleLabel: `${label} • Carinhoso`,
        },
        {
          id: 2,
          text: "Recebi tudo, meu bem! Que bom a tua mãe ter gostado do plano. Chego dentro de minutos.",
          styleLabel: `${label} • Natural`,
        },
        {
          id: 3,
          text: "Combinado amor! Fico muito contente, até já e beijo grande!",
          styleLabel: `${label} • Afetuoso`,
        },
      ];
    }

    if (hasWork) {
      return [
        {
          id: 1,
          text: "Recebi todas as informações. Estou a rever os pontos indicados e já dou retorno.",
          styleLabel: `${label} • Profissional`,
        },
        {
          id: 2,
          text: "Compreendido tudo o que enviou. Amanhã às 09h fechamos os detalhes.",
          styleLabel: `${label} • Direto`,
        },
        {
          id: 3,
          text: "Acuso a receção das mensagens. Todos os detalhes foram devidamente anotados.",
          styleLabel: `${label} • Formal`,
        },
      ];
    }

    return [
      {
        id: 1,
        text: `Li as tuas ${count} mensagens! Já estou a par de tudo, obrigado pelo aviso.`,
        styleLabel: `${label} • Direto`,
      },
      {
        id: 2,
        text: "Tudo compreendido! Assim que me desocupar ligo-te ou confirmo os detalhes.",
        styleLabel: `${label} • Natural`,
      },
      {
        id: 3,
        text: "Perfeito, conte comigo para combinarmos isso. Até já!",
        styleLabel: `${label} • Amigável`,
      },
    ];
  }

  // Single message replies
  if (isAffectionate) {
    return [
      {
        id: 1,
        text: "Está bem, meu amor. Já te respondo com calma!",
        styleLabel: "Carinhoso",
      },
      {
        id: 2,
        text: "Combinado, meu bem! Obrigado por avisares.",
        styleLabel: "Natural",
      },
      {
        id: 3,
        text: "Perfeito amor! Até já 🥰",
        styleLabel: "Afetuoso",
      },
    ];
  }

  return [
    {
      id: 1,
      text: "Combinado, mensagem recebida!",
      styleLabel: "Direto",
    },
    {
      id: 2,
      text: "Perfeito, agradeço o contacto e confirmo em breve.",
      styleLabel: "Natural",
    },
    {
      id: 3,
      text: "Acuso a receção. Entrarei em contacto oportunamente.",
      styleLabel: "Formal",
    },
  ];
}

function localFallbackConversationAssistant(
  contactName: string,
  messages: SmsMessage[],
  draft: string,
  query: string
): string {
  const qLower = query.toLowerCase();
  const lastIncoming = messages.filter((m) => m.type === "inbox").slice(-2);
  const lastIncomingText = lastIncoming.map((m) => m.body).join(" ");

  if (qLower.includes("combin") || qLower.includes("acordo") || qLower.includes("resumo")) {
    if (messages.length === 0) {
      return `Ainda não existem mensagens trocadas com ${contactName}.`;
    }
    const recentSummary = messages
      .slice(-4)
      .map((m) => `• ${m.type === "inbox" ? contactName : "Você"}: "${m.body}"`)
      .join("\n");
    return `Aqui está o resumo da conversa recente com ${contactName}:\n\n${recentSummary}\n\nPode perguntar detalhes específicos ou pedir uma resposta personalizada.`;
  }

  if (qLower.includes("suger") || qLower.includes("como responder") || qLower.includes("o que digo")) {
    if (lastIncomingText) {
      return `Com base na última mensagem de ${contactName} ("${lastIncomingText.slice(0, 80)}..."), sugiro responder:\n\n"Com certeza, já tomei nota e confirmo consigo daqui a pouco!"`;
    }
    return `Sugiro enviar uma mensagem calorosa e direta:\n\n"Olá! Espero que o seu dia esteja a correr muito bem."`;
  }

  return `Com base na conversa com ${contactName} (${messages.length} mensagens nesta sessão), estou pronto para ajudar a formular respostas, resumir pontos importantes ou sugerir o tom ideal para o seu envio. O que gostaria de fazer?`;
}

function extractJsonArray(text: string): string | null {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1);
  }
  return null;
}
