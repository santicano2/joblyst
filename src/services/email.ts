/**
 * Servicio de notificaciones por email
 * Usa Resend via ruta API de Next.js
 */

import { Application } from "@/types/applications";

export type EmailType =
  | "interview-24h"
  | "no-response-7d"
  | "weekly-summary"
  | "new-offer";

export interface SendEmailPayload {
  emailType: EmailType;
  userEmail: string;
  applicationData?: {
    company?: string;
    jobTitle?: string;
    interviewDate?: string;
    dateApplied?: string;
    thisWeek?: number;
    totalInterviews?: number;
    totalOffers?: number;
    totalApplied?: number;
  };
}

/**
 * Envía email via ruta API /api/send-email
 */
export async function sendEmailNotification(
  payload: SendEmailPayload
): Promise<{ success: boolean; emailId?: string; error?: string }> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Error al enviar email",
      };
    }

    return {
      success: true,
      emailId: data.emailId,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Email notification failed:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}


/**
 * Chequea entrevistas para hoy y envía alerta
 */
export async function checkAndNotifyInterviewsToday(
  applications: Application[],
  userEmail: string
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  for (const app of applications) {
    if (
      app.interviewDate &&
      app.interviewDate.split("T")[0] === today &&
      app.status === "interview"
    ) {
      await sendEmailNotification({
        emailType: "interview-24h",
        userEmail,
        applicationData: {
          company: app.company,
          jobTitle: app.jobTitle,
          interviewDate: app.interviewDate,
        },
      });
    }
  }
}

/**
 * Chequea postulaciones sin respuesta en 7+ días
 */
export async function checkAndNotifyNoResponse(
  applications: Application[],
  userEmail: string
): Promise<void> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  for (const app of applications) {
    if (
      !app.responseReceived &&
      new Date(app.dateApplied) <= sevenDaysAgo &&
      app.status === "applied"
    ) {
      await sendEmailNotification({
        emailType: "no-response-7d",
        userEmail,
        applicationData: {
          company: app.company,
          jobTitle: app.jobTitle,
          dateApplied: app.dateApplied,
        },
      });
    }
  }
}

/**
 * Obtiene resumen semanal del usuario
 */
export async function getWeeklySummary(applications: Application[]): Promise<{
  totalApplied: number;
  totalInterviews: number;
  totalOffers: number;
  thisWeek: number;
}> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const thisWeek = applications.filter(
    (app) => new Date(app.dateApplied) >= oneWeekAgo
  ).length;

  return {
    totalApplied: applications.length,
    totalInterviews: applications.filter((app) => app.status === "interview")
      .length,
    totalOffers: applications.filter((app) => app.status === "offer").length,
    thisWeek,
  };
}
