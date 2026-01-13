"use client";

import { useState, useEffect } from "react";
import { CreateApplicationInput } from "@/types/applications";
import { getFavoriteCV, CV } from "@/services/cvRepository";
import { toast } from "sonner";
import { Link as LinkIcon, Zap } from "lucide-react";

interface QuickAddFormProps {
  onSubmit: (data: CreateApplicationInput) => Promise<void>;
  isLoading: boolean;
}

export default function QuickAddForm({
  onSubmit,
  isLoading,
}: QuickAddFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [parsingUrl, setParsingUrl] = useState(false);
  const [favoriteCV, setFavoriteCV] = useState<CV | null>(null);
  const [loadingFavoriteCV, setLoadingFavoriteCV] = useState(true);
  const [formData, setFormData] = useState({
    company: "",
    jobTitle: "",
    link: "",
    location: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar CV favorito al montar
    const loadFavoriteCV = async () => {
      try {
        const cv = await getFavoriteCV();
        setFavoriteCV(cv);
      } catch (err) {
        // No bloquea si hay error de permisos
        console.warn("No se pudo cargar CV favorito:", err);
        setFavoriteCV(null);
      } finally {
        setLoadingFavoriteCV(false);
      }
    };

    loadFavoriteCV();
  }, []);

  async function handleParseLink() {
    if (!formData.link) {
      toast.error("Pega un link primero");
      return;
    }

    setParsingUrl(true);
    try {
      const response = await fetch("/api/parse-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.link }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Error al extraer datos");
        return;
      }

      // Auto-llenar campos detectados
      setFormData((prev) => ({
        ...prev,
        jobTitle: result.data.jobTitle || prev.jobTitle,
        company: result.data.company || prev.company,
        location: result.data.location || prev.location || "",
      }));

      toast.success("✅ Datos extraídos correctamente");
    } catch (err) {
      toast.error("Error al procesar el link");
    } finally {
      setParsingUrl(false);
    }
  }

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
        location: formData.location || "Por especificar",
        jobType: "full-time",
        status: "applied",
        dateApplied: new Date().toISOString().split("T")[0],
        responseReceived: false,
        source: "LinkedIn",
        tags: [],
        favoriteCvId: favoriteCV?.$id || undefined,
      });

      setFormData({ company: "", jobTitle: "", link: "", location: "" });
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
          className="w-full px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Agregar postulación rápidamente
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

          {!loadingFavoriteCV && favoriteCV && (
            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
              ⭐ CV Favorito: <strong>{favoriteCV.fileName}</strong> será usado
              en esta postulación
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
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://linkedin.com/jobs/123..."
                disabled={isLoading || parsingUrl}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleParseLink}
                disabled={isLoading || parsingUrl || !formData.link}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                title="Extrae datos automáticamente del link"
              >
                {parsingUrl ? "🔄" : <LinkIcon className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              💡 Pega un link y haz click 🔗 para extraer datos automáticamente
            </p>
          </div>

          {formData.location && (
            <div className="mb-4 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm text-green-700 dark:text-green-300">
              ✓ Ubicación detectada: {formData.location}
            </div>
          )}

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
                setFormData({
                  company: "",
                  jobTitle: "",
                  link: "",
                  location: "",
                });
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
