"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error en autenticación:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="text-yellow-500 dark:text-yellow-400">
            <AlertTriangle className="w-20 h-20" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Error
        </h1>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Problema con autenticación
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-2">
          Ocurrió un error durante el proceso de autenticación.
        </p>

        {error.message && (
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-8 font-mono bg-slate-100 dark:bg-slate-800 p-3 rounded">
            {error.message}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Intentar de nuevo
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition font-medium"
          >
            <Home className="w-5 h-5" />
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
