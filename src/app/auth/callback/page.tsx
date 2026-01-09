"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function CallbackPage() {
  const router = useRouter();
  const { checkSession, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        // Dar un pequeño delay para que Appwrite procese la sesión
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Verificar que la sesión se creó correctamente
        await checkSession();

        // Redirigir al dashboard
        router.push("/dashboard");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al procesar autenticación"
        );
        setIsProcessing(false);
      }
    }

    handleCallback();
  }, [router, checkSession]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {isProcessing ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Procesando autenticación...
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Te estamos redirigiendo al dashboard
            </p>
          </>
        ) : error ? (
          <>
            <div className="text-red-600 dark:text-red-400 text-4xl mb-4">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Error en autenticación
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
            <a
              href="/login"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer"
            >
              Volver a intentar
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}
