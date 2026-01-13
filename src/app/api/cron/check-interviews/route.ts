/**
 * Cron Job: Chequear entrevistas de hoy
 * Ejecutado: Todos los días a las 9:00 AM (UTC)
 *
 * Vercel Cron: "0 9 * * *"
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllApplicationsByUserEmail } from "@/services/cron";
import { checkAndNotifyInterviewsToday } from "@/services/email";

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
      await checkAndNotifyInterviewsToday(data.applications, email);
      emailsSent++;
    }

    return NextResponse.json({
      success: true,
      message: `Chequeo completado. Emails potenciales enviados a ${emailsSent} usuarios.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en cron check-interviews:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
