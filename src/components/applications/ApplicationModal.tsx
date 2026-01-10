"use client";

import { useState, useEffect } from "react";
import { Application, CreateApplicationInput } from "@/types/applications";
import { formatDate } from "@/utils/dateFormatter";
import { getAllCVs } from "@/services/storage";

interface ApplicationModalProps {
  isOpen: boolean;
  application?: Application | null;
  onClose: () => void;
  onSubmit: (data: CreateApplicationInput) => Promise<void>;
  isLoading: boolean;
}

export default function ApplicationModal({
  isOpen,
  application,
  onClose,
  onSubmit,
  isLoading,
}: ApplicationModalProps) {
  const [formData, setFormData] = useState<CreateApplicationInput>({
    jobTitle: "",
    company: "",
    location: "",
    jobType: "full-time",
    status: "applied",
    dateApplied: new Date().toISOString().split("T")[0],
    responseReceived: false,
    source: "LinkedIn",
    tags: [],
    link: "",
    cvFileId: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [cvs, setCVs] = useState<any[]>([]);
  const [isLoadingCVs, setIsLoadingCVs] = useState(false);

  // Load CVs on mount
  useEffect(() => {
    loadCVs();
  }, []);

  async function loadCVs() {
    try {
      setIsLoadingCVs(true);
      const cvList = await getAllCVs();
      setCVs(cvList);
    } catch (err) {
      console.error("Error loading CVs:", err);
    } finally {
      setIsLoadingCVs(false);
    }
  }

  // Update form data when application changes
  useEffect(() => {
    if (application) {
      setFormData({
        jobTitle: application.jobTitle,
        company: application.company,
        location: application.location,
        jobType: application.jobType,
        salaryMin: application.salaryMin,
        salaryMax: application.salaryMax,
        salaryCurrency: application.salaryCurrency,
        status: application.status,
        dateApplied: application.dateApplied,
        responseReceived: application.responseReceived,
        interviewDate: application.interviewDate,
        source: application.source,
        notes: application.notes,
        tags: application.tags,
        link: application.link,
        cvFileId: application.cvFileId,
      });
    } else {
      // Reset form when creating new
      setFormData({
        jobTitle: "",
        company: "",
        location: "",
        jobType: "full-time",
        status: "applied",
        dateApplied: new Date().toISOString().split("T")[0],
        responseReceived: false,
        source: "LinkedIn",
        tags: [],
        link: "",
        cvFileId: undefined,
      });
    }
    setError(null);
  }, [application, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.jobTitle || !formData.company || !formData.location) {
      setError("Por favor completa los campos obligatorios");
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {application ? "Editar postulación" : "Nueva postulación"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl cursor-pointer disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* jobTitle */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Puesto *
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                placeholder="Desarrollador React"
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/* company */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Empresa *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Google"
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/* location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Ubicación *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Buenos Aires, Argentina"
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/* link */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                URL de la postulación
              </label>
              <input
                type="url"
                value={formData.link || ""}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://linkedin.com/jobs/123..."
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/* cvFileId */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                📄 CV que enviaste (opcional)
              </label>
              <select
                value={formData.cvFileId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cvFileId: e.target.value || undefined,
                  })
                }
                disabled={isLoading || isLoadingCVs || cvs.length === 0}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">-- Selecciona un CV --</option>
                {cvs.map((cv) => (
                  <option key={cv.$id} value={cv.$id}>
                    {cv.name}
                  </option>
                ))}
              </select>
              {cvs.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Sube CVs en la{" "}
                  <a
                    href="/cvs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    página de CVs
                  </a>
                </p>
              )}
            </div>

            {/* jobType */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tipo de trabajo
              </label>
              <select
                value={formData.jobType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobType: e.target.value as any,
                  })
                }
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as any,
                  })
                }
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="applied">Aplicado</option>
                <option value="interview">Entrevista</option>
                <option value="rejected">Rechazado</option>
                <option value="offer">Oferta</option>
              </select>
            </div>

            {/* source */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fuente
              </label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    source: e.target.value as any,
                  })
                }
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="Email">Email</option>
                <option value="Referral">Referral</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* dateApplied */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fecha de aplicación
              </label>
              <input
                type="date"
                value={formData.dateApplied}
                onChange={(e) =>
                  setFormData({ ...formData, dateApplied: e.target.value })
                }
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/* salaryMin */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Salario mín.
              </label>
              <input
                type="number"
                value={formData.salaryMin || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryMin: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="30000"
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/* salaryMax */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Salario máx.
              </label>
              <input
                type="number"
                value={formData.salaryMax || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryMax: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="50000"
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            {/* salaryCurrency */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Moneda
              </label>
              <select
                value={formData.salaryCurrency || "USD"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salaryCurrency: e.target.value as any,
                  })
                }
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            {/* responseReceived */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.responseReceived || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responseReceived: e.target.checked,
                    })
                  }
                  disabled={isLoading}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Recibí respuesta
                </span>
              </label>
            </div>

            {/* interviewDate */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fecha de entrevista
              </label>
              <input
                type="date"
                value={formData.interviewDate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interviewDate: e.target.value || undefined,
                  })
                }
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Notas
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Detalles adicionales, feedback, etc..."
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Guardando..."
                : application
                ? "Actualizar"
                : "Crear"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-2 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
