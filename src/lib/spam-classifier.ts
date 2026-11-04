export const PALAVRAS_SPAM: string[] = [
  "ganha", "ganhar", "sorteio", "prémio", "premio", "gratis", "grátis",
  "digita", "roleta", "aposta", "jogo", "quiz", "regista-te", "regista",
  "credito", "crédito", "mola", "bónus", "bonus", "clica", "acessa",
  "visita", "subscreve", "mt/dia", "por apenas", "começa a jogar",
  "habilita-te", "habilita", "minha sorte", "txopela", "urgente",
  "parabéns", "parabens", "transferencia", "pin", "palavra-passe"
];

export interface SpamResult {
  isSpam: boolean;
  score: number; // 0 to 100
  matchedKeywords: string[];
  reason: string;
}

export function classifySpam(body: string, address: string): SpamResult {
  const lowerBody = body.toLowerCase();
  const matched = PALAVRAS_SPAM.filter((keyword) => {
    if (keyword.includes(" ") || keyword.includes("/")) {
      return lowerBody.includes(keyword);
    }
    const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
    return regex.test(body) || lowerBody.includes(keyword);
  });

  const uniqueMatched = Array.from(new Set(matched));

  // Suspicious sender: shortcodes (3-6 digits), or alphanumeric marketing headers
  const isDigitsOnly = /^\d+$/.test(address);
  const isSuspiciousSender =
    (address.length >= 3 && address.length <= 6 && isDigitsOnly) ||
    (/[a-zA-Z]/.test(address) && !address.startsWith("+"));

  let score = Math.min(uniqueMatched.length * 25, 90);
  if (isSuspiciousSender && uniqueMatched.length > 0) {
    score = Math.min(score + 20, 100);
  }

  // Links check (http/https/bit.ly/t.me)
  const hasLink =
    lowerBody.includes("http://") ||
    lowerBody.includes("https://") ||
    lowerBody.includes(".com/") ||
    lowerBody.includes("t.me/") ||
    lowerBody.includes("bit.ly");

  if (hasLink && uniqueMatched.length > 0) {
    score = Math.min(score + 25, 100);
  }

  const isSpam = score >= 50 || uniqueMatched.length >= 2;
  let reason = "Mensagem legítima.";

  if (uniqueMatched.length > 0 && hasLink) {
    reason = `Contém ${uniqueMatched.length} termo(s) de sorteio/aposta e links externos suspeitos.`;
  } else if (uniqueMatched.length > 0) {
    reason = `Contém termos frequentes de spam: ${uniqueMatched.join(", ")}.`;
  } else if (isSpam) {
    reason = "Padrão de mensagem promocional suspeita.";
  }

  return {
    isSpam,
    score,
    matchedKeywords: uniqueMatched,
    reason,
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
