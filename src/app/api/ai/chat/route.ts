import { NextRequest, NextResponse } from "next/server";
import { chatInConversationContext } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      messages = [],
      history = [],
      draft = "",
      contactDisplayName = "Contacto",
      contactAddress = "",
    } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Pergunta inválida ou vazia" },
        { status: 400 }
      );
    }

    const answer = await chatInConversationContext(
      contactDisplayName,
      contactAddress,
      messages,
      history,
      draft,
      question
    );
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Falha ao processar resposta da IA" },
      { status: 500 }
    );
  }
}
