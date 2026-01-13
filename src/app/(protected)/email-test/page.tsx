"use client";

import { useState } from "react";
import { getApplications } from "@/services/applications";
import { useEmailNotifications } from "@/hooks/useEmailNotifications";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function EmailTestPage() {
  const { user, loading } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [selectedAppId, setSelectedAppId] = useState("");
  const {
    loading: emailLoading,
    error,
    success,
    sendTestEmail,
    checkInterviews,
    checkNoResponse,
  } = useEmailNotifications();

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  const handleLoadApplications = async () => {
    try {
      if (!user?.$id) {
        toast.error("Usuario no autenticado");
        return;
      }
      const data = await getApplications(user.$id);
      setApps(data);
      toast.success(`Cargadas ${data.length} postulaciones`);
    } catch {
      toast.error("Error al cargar postulaciones");
    }
  };

  const handleSendTest = async (emailType: string) => {
    if (!selectedAppId) {
      toast.error("Selecciona una postulación");
      return;
    }
    const app = apps.find((a) => a.$id === selectedAppId);
    await sendTestEmail(emailType as any, user?.email || "", {
      company: app?.company,
      jobTitle: app?.jobTitle,
      interviewDate: app?.interviewDate,
      dateApplied: app?.dateApplied,
    });
    if (success) toast.success("Email enviado!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🧪 Tester de Emails</h1>

      {error && (
        <div className="bg-red-100 p-4 rounded text-red-800">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 p-4 rounded text-green-800">✅ Éxito</div>
      )}

      <button
        onClick={handleLoadApplications}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Cargar Postulaciones
      </button>

      {apps.length > 0 && (
        <div className="space-y-4">
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Selecciona una postulación --</option>
            {apps.map((app) => (
              <option key={app.$id} value={app.$id}>
                {app.company} - {app.jobTitle}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSendTest("interview-24h")}
              disabled={emailLoading || !selectedAppId}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {emailLoading ? "Enviando..." : "📅 Entrevista 24h"}
            </button>
            <button
              onClick={() => handleSendTest("no-response-7d")}
              disabled={emailLoading || !selectedAppId}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {emailLoading ? "Enviando..." : "⏰ Sin respuesta"}
            </button>
            <button
              onClick={() => handleSendTest("new-offer")}
              disabled={emailLoading || !selectedAppId}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {emailLoading ? "Enviando..." : "🎉 Nueva oferta"}
            </button>
            <button
              onClick={() => handleSendTest("weekly-summary")}
              disabled={emailLoading || !selectedAppId}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {emailLoading ? "Enviando..." : "📊 Resumen semanal"}
            </button>
          </div>

          <hr className="my-6" />

          <div className="space-y-2">
            <h2 className="text-xl font-bold">Chequeos Automáticos</h2>
            <button
              onClick={() => checkInterviews(apps, user?.email || "")}
              disabled={emailLoading}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {emailLoading ? "Chequeando..." : "✅ Chequear entrevistas hoy"}
            </button>
            <button
              onClick={() => checkNoResponse(apps, user?.email || "")}
              disabled={emailLoading}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {emailLoading
                ? "Chequeando..."
                : "✅ Chequear sin respuesta (7d)"}
            </button>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded">
        <p>
          📝 <strong>Cómo testear:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click en "Cargar Postulaciones"</li>
          <li>Selecciona una postulación</li>
          <li>Haz click en un tipo de email</li>
          <li>Revisa tu correo (puede tardar 30s)</li>
        </ol>
      </div>
    </div>
  );
}
