"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Joblyst
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="text-slate-600 dark:text-slate-400">Hola,</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {user?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Bienvenido al Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Estamos en construcción. Aquí irá el panel principal con tus
            postulaciones y estadísticas.
          </p>

          <div className="flex gap-4">
            <Link
              href="/applications"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition cursor-pointer"
            >
              Ver postulaciones
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium transition cursor-pointer"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
