"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Application } from "@/types/applications";
import { getApplications } from "@/services/applications";
import { StatsOverviewSkeleton } from "@/components/common/Skeleton";
import Link from "next/link";

// Lazy load Charts component (can be heavy with visualizations)
const Charts = dynamic(() => import("@/components/applications/Charts"), {
  ssr: false,
  loading: () => <StatsOverviewSkeleton />,
});

export default function AnalyticsPage() {
  const { user } = useAuth();
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

  return (
    <div>
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
    </div>
  );
}
