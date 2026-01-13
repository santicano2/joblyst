"use client";

import { Application } from "@/types/applications";
import { formatDate } from "@/utils/dateFormatter";
import { isInterviewSoon, isInterviewToday } from "@/utils/interviewUtils";

interface ApplicationsTableProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onView: (app: Application) => void;
  onToggleFavorite: (app: Application) => void;
  isLoading: boolean;
}

const statusColors = {
  applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  interview:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  offer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const statusLabels = {
  applied: "Aplicado",
  interview: "Entrevista",
  rejected: "Rechazado",
  offer: "Oferta",
};

export default function ApplicationsTable({
  applications,
  onEdit,
  onDelete,
  onView,
  onToggleFavorite,
  isLoading,
}: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          No hay postulaciones aún. ¡Crea la primera!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
              Empresa
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
              Puesto
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
              Ubicación
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
              Fecha
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.$id}
              className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            >
              <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                {app.company}
              </td>
              <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                {app.jobTitle}
              </td>
              <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                {app.location}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[app.status as keyof typeof statusColors]
                    }`}
                  >
                    {statusLabels[app.status as keyof typeof statusLabels]}
                  </span>
                  {isInterviewSoon(app.interviewDate) && (
                    <span
                      title={
                        isInterviewToday(app.interviewDate)
                          ? "¡Entrevista hoy!"
                          : "Entrevista próxima"
                      }
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        isInterviewToday(app.interviewDate)
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                      }`}
                    >
                      🔔
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                {formatDate(app.dateApplied)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onToggleFavorite(app)}
                    disabled={isLoading}
                    title={
                      app.isFavorite
                        ? "Remover de favoritos"
                        : "Agregar a favoritos"
                    }
                    className="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    {app.isFavorite ? "★" : "☆"}
                  </button>
                  <button
                    onClick={() => onView(app)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white rounded transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEdit(app)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(app)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
