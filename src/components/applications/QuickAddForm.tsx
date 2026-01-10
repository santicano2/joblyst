"use client";

import { useState } from "react";
import { CreateApplicationInput } from "@/types/applications";

interface QuickAddFormProps {
  onSubmit: (data: CreateApplicationInput) => Promise<void>;
  isLoading: boolean;
}

export default function QuickAddForm({
  onSubmit,
  isLoading,
}: QuickAddFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    jobTitle: "",
    link: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.company || !formData.jobTitle) {
      setError("Por favor completa empresa y puesto");
      return;
    }

    try {
      await onSubmit({
        company: formData.company,
        jobTitle: formData.jobTitle,
        link: formData.link || undefined,
        location: "Por especificar",
        jobType: "full-time",
        status: "applied",
        dateApplied: new Date().toISOString().split("T")[0],
        responseReceived: false,
        source: "LinkedIn",
        tags: [],
      });

      setFormData({ company: "", jobTitle: "", link: "" });
      setIsExpanded(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    }
  }

  return (
    <div className="mb-8">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition shadow-lg cursor-pointer"
        >
          ⚡ Agregar postulación rápidamente
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border-2 border-blue-500 dark:border-blue-600"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Agregar postulación rápida
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Empresa *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Google, Netflix, etc..."
                disabled={isLoading}
                autoFocus
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Puesto *
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                placeholder="Desarrollador React, PM, etc..."
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              URL de la postulación (opcional)
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="https://linkedin.com/jobs/123..."
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            💡 Tip: Completa los demás datos después en &quot;Editar&quot;
          </p>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : "✓ Agregar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setFormData({ company: "", jobTitle: "", link: "" });
                setError(null);
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
