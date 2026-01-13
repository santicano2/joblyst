/**
 * Hook para probar y gestionar notificaciones por email
 */

import { useState } from "react";
import {
  sendEmailNotification,
  checkAndNotifyInterviewsToday,
  checkAndNotifyNoResponse,
  getWeeklySummary,
  type EmailType,
} from "@/services/email";
import { Application } from "@/types/applications";

interface UseEmailNotificationsReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  sendTestEmail: (
    emailType: EmailType,
    userEmail: string,
    applicationData?: any
  ) => Promise<void>;
  checkInterviews: (apps: Application[], userEmail: string) => Promise<void>;
  checkNoResponse: (apps: Application[], userEmail: string) => Promise<void>;
  getStats: (apps: Application[]) => Promise<void>;
}

export function useEmailNotifications(): UseEmailNotificationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendTestEmail = async (
    emailType: EmailType,
    userEmail: string,
    applicationData?: any
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await sendEmailNotification({
        emailType,
        userEmail,
        applicationData,
      });

      if (result.success) {
        setSuccess(true);
        console.log("Email enviado:", result.emailId);
      } else {
        setError(result.error || "Error desconocido");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar email");
    } finally {
      setLoading(false);
    }
  };

  const checkInterviews = async (apps: Application[], userEmail: string) => {
    setLoading(true);
    setError(null);

    try {
      await checkAndNotifyInterviewsToday(apps, userEmail);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al chequear");
    } finally {
      setLoading(false);
    }
  };

  const checkNoResponse = async (apps: Application[], userEmail: string) => {
    setLoading(true);
    setError(null);

    try {
      await checkAndNotifyNoResponse(apps, userEmail);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al chequear");
    } finally {
      setLoading(false);
    }
  };

  const getStats = async (apps: Application[]) => {
    setLoading(true);
    try {
      const stats = await getWeeklySummary(apps);
      console.log("Resumen semanal:", stats);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    sendTestEmail,
    checkInterviews,
    checkNoResponse,
    getStats,
  };
}
