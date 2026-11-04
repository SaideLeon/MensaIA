import { NextRequest, NextResponse } from "next/server";
import {
  correctAndImproveText,
  generateThreeSmartReplies,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      originalText,
      action = "CORRIGIR_ORTOGRAFIA",
      customInstruction,
      contextMessages = [],
      contactDisplayName = "Contacto",
      contactAddress = "",
      style = "AUTOMATICO",
    } = body;

    if (type === "smart_replies") {
      const replies = await generateThreeSmartReplies(
        contextMessages,
        contactDisplayName,
        contactAddress,
        style,
        customInstruction
      );
      return NextResponse.json({ replies });
    }

    const result = await correctAndImproveText(
      originalText || "",
      action,
      customInstruction,
      contextMessages,
      contactDisplayName
    );

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Writing assistant API error:", error);
    return NextResponse.json(
      { error: "Erro ao processar assistência de escrita" },
      { status: 500 }
    );
  }
}
