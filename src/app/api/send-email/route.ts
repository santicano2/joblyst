/**
 * Ruta API para enviar emails via Resend
 * POST /api/send-email
 */

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Formatea fecha en formato legible: "22 de enero, 2026"
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatter.format(date);
  } catch {
    return dateString;
  }
}

// Formatea hora en formato legible: "14:30"
function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formatter.format(date);
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailType, userEmail, applicationData } = body;

    // Validar inputs
    if (!emailType || !userEmail) {
      return NextResponse.json(
        { error: "emailType y userEmail son requeridos" },
        { status: 400 }
      );
    }

    let subject = "";
    let html = "";

    // Generar contenido según tipo de email
    if (emailType === "interview-24h") {
      const interviewDate = applicationData?.interviewDate
        ? formatDate(applicationData.interviewDate)
        : "Pronto";
      const interviewTime = applicationData?.interviewDate
        ? formatTime(applicationData.interviewDate)
        : "";

      subject = `🔔 Recordatorio: Entrevista en 24hs`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Tienes entrevista mañana</h2>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>${applicationData?.company || "Empresa"}</strong></p>
            <p>${applicationData?.jobTitle || "Posición"}</p>
            <p style="margin: 12px 0;">
              <strong>📅 ${interviewDate}</strong><br/>
              ${interviewTime ? `<strong>🕐 ${interviewTime}</strong>` : ""}
            </p>
          </div>
          <p>¡Mucho éxito en tu entrevista! 🚀</p>
        </div>
      `;
    } else if (emailType === "no-response-7d") {
      const appliedDate = applicationData?.dateApplied
        ? formatDate(applicationData.dateApplied)
        : "N/A";

      subject = `⏰ Sin respuesta en 7 días - Considera un follow-up`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">Pasó una semana desde tu aplicación</h2>
          <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>${applicationData?.company || "Empresa"}</strong></p>
            <p>${applicationData?.jobTitle || "Posición"}</p>
            <p>📅 Aplicaste el: <strong>${appliedDate}</strong></p>
          </div>
          <p>💡 Considera hacer un follow-up amable para reactivar tu candidatura.</p>
        </div>
      `;
    } else if (emailType === "new-offer") {
      subject = `🎉 ¡Felicidades! Tienes una oferta`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">¡Excelente noticia! 🎊</h2>
          <div style="background: #dcfce7; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>${applicationData?.company || "Empresa"}</strong></p>
            <p>${applicationData?.jobTitle || "Posición"}</p>
          </div>
          <p>¡Felicidades por llegar a esta etapa! Esperamos que sea una gran oportunidad para ti.</p>
        </div>
      `;
    } else if (emailType === "weekly-summary") {
      subject = `📊 Resumen semanal de Joblyst`;
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Tu resumen semanal</h2>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p>📋 Postulaciones esta semana: <strong>${
              applicationData?.thisWeek || 0
            }</strong></p>
            <p>💬 Entrevistas totales: <strong>${
              applicationData?.totalInterviews || 0
            }</strong></p>
            <p>🎯 Ofertas recibidas: <strong>${
              applicationData?.totalOffers || 0
            }</strong></p>
            <p>📈 Total de aplicaciones: <strong>${
              applicationData?.totalApplied || 0
            }</strong></p>
          </div>
          <p>¡Sigue adelante! 💪</p>
        </div>
      `;
    }

    // Enviar email via Resend
    const result = await resend.emails.send({
      from: "Joblyst <onboarding@resend.dev>",
      to: userEmail,
      subject,
      html,
    });

    // result.data?.id es el ID del email enviado
    const emailId = (result.data as any)?.id || "sent";

    return NextResponse.json({
      success: true,
      emailId,
      message: "Email enviado correctamente",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error enviando email:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
