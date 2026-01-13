/**
 * Cron Job: Enviar resumen semanal
 * Ejecutado: Viernes a las 17:00 (5 PM UTC)
 *
 * Vercel Cron: "0 17 * * 5"
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllApplicationsByUserEmail } from "@/services/cron";
import { sendEmailNotification, getWeeklySummary } from "@/services/email";

export async function GET(request: NextRequest) {
  try {
    // Validar que es una solicitud de Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
