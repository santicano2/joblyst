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
  applied:
    "bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-200 font-semibold border border-blue-300 dark:border-blue-700",
  interview:
    "bg-yellow-50 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200 font-semibold border border-yellow-300 dark:border-yellow-700",
  rejected:
    "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200 font-semibold border border-red-300 dark:border-red-700",
  offer:
    "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-200 font-semibold border border-green-300 dark:border-green-700",
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
      <div className="bg-alabaster-grey-900 dark:bg-prussian-blue-500 rounded-lg shadow p-8 text-center">
        <p className="text-dusty-denim-500 dark:text-dusty-denim-600">
          No hay postulaciones aún. ¡Crea la primera!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dusty-denim-300 dark:border-dusk-blue-600 bg-alabaster-grey-900 dark:bg-prussian-blue-600">
            <th className="px-6 py-3 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Empresa
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Puesto
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Ubicación
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Fecha
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr
              key={app.$id}
              className="border-b border-dusty-denim-300 dark:border-dusk-blue-600 hover:bg-alabaster-grey-900 dark:hover:bg-prussian-blue-600/30 transition"
            >
              <td className="px-6 py-4 text-sm text-ink-black-500 dark:text-alabaster-grey-500 font-medium">
                {app.company}
              </td>
              <td className="px-6 py-4 text-sm text-dusk-blue-500 dark:text-dusty-denim-600">
                {app.jobTitle}
              </td>
              <td className="px-6 py-4 text-sm text-dusk-blue-500 dark:text-dusty-denim-600">
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
              <td className="px-6 py-4 text-sm text-dusk-blue-500 dark:text-dusty-denim-600">
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
                    className="px-3 py-1 text-sm bg-dusty-denim-600 hover:bg-dusty-denim-700 disabled:bg-dusty-denim-400 text-alabaster-grey-900 rounded transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    {app.isFavorite ? "★" : "☆"}
                  </button>
                  <button
                    onClick={() => onView(app)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-dusk-blue-600 hover:bg-dusk-blue-700 disabled:bg-dusk-blue-400 text-alabaster-grey-900 rounded transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEdit(app)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-prussian-blue-600 hover:bg-prussian-blue-700 disabled:bg-prussian-blue-400 text-alabaster-grey-900 rounded transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(app)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-dusk-blue-500 hover:bg-dusk-blue-600 disabled:bg-dusk-blue-300 text-alabaster-grey-900 rounded transition cursor-pointer disabled:cursor-not-allowed"
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
