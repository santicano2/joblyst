"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Bienvenido al Dashboard
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Gestiona tus postulaciones, visualiza estadísticas y organiza tu
          búsqueda laboral.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/applications"
            className="px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition text-center"
          >
            📝 Ver Postulaciones
          </Link>
          <Link
            href="/analytics"
            className="px-6 py-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition text-center"
          >
            📊 Analytics Detallados
          </Link>
          <Link
            href="/cvs"
            className="px-6 py-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition text-center"
          >
            📄 Administrar CVs
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Estadísticas Rápidas
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Accede a la sección de Postulaciones para ver tus estadísticas
          detalladas.
        </p>
      </div>
    </div>
  );
}
