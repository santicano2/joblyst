"use client";

import Link from "next/link";
import { AlertCircle, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="text-red-500 dark:text-red-400">
            <AlertCircle className="w-20 h-20" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Página no encontrada
        </h2>

        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/applications"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Home className="w-5 h-5" />
            Ir a Postulaciones
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition font-medium"
          >
            <Search className="w-5 h-5" />
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
