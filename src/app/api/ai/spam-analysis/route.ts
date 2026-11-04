import { NextRequest, NextResponse } from "next/server";
import { analyzeSpamRisk } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Mensagem não fornecida" },
        { status: 400 }
      );
    }

    const analysis = await analyzeSpamRisk(message);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Spam analysis API error:", error);
    return NextResponse.json(
      { error: "Erro ao analisar mensagem com IA" },
      { status: 500 }
    );
  }
}
