"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Application } from "@/types/applications";
import { getApplications } from "@/services/applications";
import Charts from "@/components/applications/Charts";
import { StatsOverviewSkeleton } from "@/components/common/Skeleton";
import Link from "next/link";

export default function AnalyticsPage() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, [user?.id]);

  async function loadApplications() {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getApplications(user.id);
      setApplications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar postulaciones"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition cursor-pointer"
            >
              Joblyst
            </Link>
            <div className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                Dashboard
              </Link>
              <Link
                href="/applications"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                Postulaciones
              </Link>
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                Analytics
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm hidden sm:block">
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Visualiza tus estadísticas y tendencias de postulaciones
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 text-sm font-medium underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <StatsOverviewSkeleton />
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No hay postulaciones para mostrar
            </p>
            <Link
              href="/applications"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
            >
              Ir a mis postulaciones
            </Link>
          </div>
        ) : (
          <Charts applications={applications} />
        )}
      </main>
    </div>
  );
}
