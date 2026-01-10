"use client";

import { Application } from "@/types/applications";
import { formatDate, formatDateTime } from "@/utils/dateFormatter";
import { getDownloadURL } from "@/services/storage";
import { useState } from "react";

interface DetailModalProps {
  isOpen: boolean;
  application: Application | null;
  onClose: () => void;
}

export default function DetailModal({
  isOpen,
  application,
  onClose,
}: DetailModalProps) {
  const [cvDownloadUrl, setCVDownloadUrl] = useState<string | null>(null);
  const [isLoadingCV, setIsLoadingCV] = useState(false);

  if (!isOpen || !application) return null;

  const formatJobType = (type: string): string => {
    const map: Record<string, string> = {
      "full-time": "Tiempo Completo",
      "part-time": "Tiempo Parcial",
      contract: "Contrato",
      freelance: "Freelance",
    };
    return map[type] || type;
  };

  const formatStatus = (status: string): string => {
    const map: Record<string, string> = {
      applied: "Postulada",
      interview: "Entrevista",
      offer: "Oferta",
      rejected: "Rechazada",
    };
    return map[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      applied:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      interview:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      offer:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    };
    return colors[status] || colors.applied;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 px-6 py-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {application.jobTitle}
            </h2>
            <p className="text-blue-100">{application.company}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estado y Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Estado
              </label>
              <span
                className={`inline-block px-4 py-2 rounded-lg font-medium ${getStatusColor(
                  application.status
                )}`}
              >
                {formatStatus(application.status)}
              </span>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Tipo de Empleo
              </label>
              <p className="text-slate-900 dark:text-white">
                {formatJobType(application.jobType)}
              </p>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Ubicación y Fuente */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Ubicación
              </label>
              <p className="text-slate-900 dark:text-white">
                {application.location || "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Fuente
              </label>
              <p className="text-slate-900 dark:text-white">
                {application.source}
              </p>
            </div>
          </div>

          {/* Link */}
          {application.link && (
            <>
              <hr className="border-slate-200 dark:border-slate-700" />
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                  URL de la Postulación
                </label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                  <a
                    href={application.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-blue-600 dark:text-blue-400 hover:underline break-all text-sm"
                  >
                    {application.link}
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(application.link || "");
                    }}
                    title="Copiar al portapapeles"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* CV Section */}
          {application.cvFileId && (
            <>
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                  📄 CV Enviado
                </label>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-600 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      CV Seleccionado
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ID: {application.cvFileId.substring(0, 8)}...
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        setIsLoadingCV(true);
                        const url = await getDownloadURL(application.cvFileId!);
                        setCVDownloadUrl(url);
                        // Open download
                        window.open(url, "_blank");
                      } catch (err) {
                        console.error("Error downloading CV:", err);
                      } finally {
                        setIsLoadingCV(false);
                      }
                    }}
                    disabled={isLoadingCV}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition cursor-pointer font-medium text-sm"
                  >
                    {isLoadingCV ? "..." : "Descargar"}
                  </button>
                </div>
              </div>
              <hr className="border-slate-200 dark:border-slate-700" />
            </>
          )}

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Fecha de Postulación
              </label>
              <p className="text-slate-900 dark:text-white">
                {formatDate(application.dateApplied)}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Fecha de Entrevista
              </label>
              <p className="text-slate-900 dark:text-white">
                {application.interviewDate
                  ? formatDate(application.interviewDate)
                  : "-"}
              </p>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Salario */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Salario Mínimo
              </label>
              <p className="text-slate-900 dark:text-white">
                {application.salaryMin ? `$${application.salaryMin}` : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Salario Máximo
              </label>
              <p className="text-slate-900 dark:text-white">
                {application.salaryMax ? `$${application.salaryMax}` : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Moneda
              </label>
              <p className="text-slate-900 dark:text-white">
                {application.salaryCurrency || "-"}
              </p>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Respuesta */}
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
              Respuesta Recibida
            </label>
            <p className="text-slate-900 dark:text-white">
              {application.responseReceived ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sí
                </span>
              ) : (
                <span className="text-slate-500">No</span>
              )}
            </p>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Notas */}
          {application.notes && (
            <>
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                  Notas
                </label>
                <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                    {application.notes}
                  </p>
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-700" />
            </>
          )}

          {/* Tags */}
          {application.tags && application.tags.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {application.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p>Creado: {formatDateTime(application.$createdAt)}</p>
            <p>Actualizado: {formatDateTime(application.$updatedAt)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition cursor-pointer font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
