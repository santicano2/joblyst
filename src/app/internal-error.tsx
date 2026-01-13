"use client";

import Link from "next/link";
import { Server, Home, RefreshCw } from "lucide-react";

export default function ServerError() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="text-red-500 dark:text-red-400">
            <Server className="w-20 h-20" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          500
        </h1>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Error del Servidor
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Lo sentimos, algo salió mal en nuestros servidores. Estamos trabajando
          para solucionarlo.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Recargar Página
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
