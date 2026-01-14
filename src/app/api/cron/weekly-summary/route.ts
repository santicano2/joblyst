/**
 * Cron Job: Enviar resumen semanal
 * Ejecutado: Viernes a las 17:00 (5 PM UTC)
 *
 * Upstash QStash Schedule: "0 17 * * 5"
 */

import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { getAllApplicationsByUserEmail } from "@/services/cron";
import { sendEmailNotification, getWeeklySummary } from "@/services/email";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // Validar la firma de Upstash QStash
    const signature = request.headers.get("upstash-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const rawBody = await request.text();
    const isValid = await receiver.verify({
      body: rawBody,
      signature,
      url: request.url,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const grouped = await getAllApplicationsByUserEmail();
    let emailsSent = 0;

    for (const [email, data] of grouped) {
      const summary = await getWeeklySummary(data.applications);

      await sendEmailNotification({
        emailType: "weekly-summary",
        userEmail: email,
        applicationData: summary,
      });

      emailsSent++;
    }

    return NextResponse.json({
      success: true,
      message: `Resúmenes semanales enviados a ${emailsSent} usuarios.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en cron weekly-summary:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
