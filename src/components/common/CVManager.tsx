"use client";

import { useState, useEffect } from "react";
import {
  getCVsByUser,
  setFavoriteCV,
  deleteCV,
  CV,
} from "@/services/cvRepository";
import { getDownloadURL } from "@/services/storage";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { Star, Download, Trash2, FileText } from "lucide-react";

export default function CVManager() {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadCVs();
  }, []);

  async function loadCVs() {
    try {
      setIsLoading(true);
      const data = await getCVsByUser();
      setCVs(data);
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Error al cargar CVs"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSetFavorite(cvId: string) {
    try {
      setIsUpdating(cvId);
      await setFavoriteCV(cvId);
      await loadCVs();
      showSuccessToast("CV marcado como favorito");
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Error al actualizar favorito"
      );
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleDelete(cvId: string, fileId: string) {
    if (
      !confirm("¿Estás seguro? Se eliminará el CV y no se podrá recuperar.")
    ) {
      return;
    }

    try {
      setIsUpdating(cvId);
      await deleteCV(cvId, fileId);
      await loadCVs();
      showSuccessToast("CV eliminado");
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Error al eliminar CV"
      );
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleDownload(fileId: string, fileName: string) {
    try {
      const downloadUrl = await getDownloadURL(fileId);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccessToast("Descargando CV...");
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Error al descargar CV"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Cargando CVs...</p>
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-400">
          📁 Aún no has subido ningún CV
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Sube tu primer CV usando el formulario anterior
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Mis CVs ({cvs.length})
      </h3>

      <div className="grid gap-3">
        {cvs.map((cv) => (
          <div
            key={cv.$id}
            className={`p-4 rounded-lg border-2 transition ${
              cv.isFavorite
                ? "bg-prussian-blue-50 dark:bg-prussian-blue-900/20 border-prussian-blue-300 dark:border-prussian-blue-800"
                : "bg-alabaster-grey-900 dark:bg-prussian-blue-500 border-dusty-denim-300 dark:border-dusk-blue-600"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Información del CV */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-prussian-blue-600 dark:text-dusk-blue-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-black-500 dark:text-alabaster-grey-500 truncate">
                      {cv.fileName}
                    </p>
                    <p className="text-xs text-dusk-blue-500 dark:text-dusty-denim-600 mt-1">
                      {new Date(cv.$createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Botón Favorito */}
                <button
                  onClick={() => handleSetFavorite(cv.$id)}
                  disabled={isUpdating !== null}
                  className={`px-3 py-2 rounded-lg transition font-medium text-sm flex items-center gap-1 ${
                    cv.isFavorite
                      ? "bg-dusty-denim-600 hover:bg-dusty-denim-700 text-alabaster-grey-900"
                      : "bg-dusty-denim-200 dark:bg-dusty-denim-700 hover:bg-dusty-denim-300 dark:hover:bg-dusty-denim-600 text-dusty-denim-800 dark:text-dusty-denim-200"
                  } disabled:opacity-50 cursor-pointer`}
                  title={
                    cv.isFavorite ? "Es el favorito" : "Marcar como favorito"
                  }
                >
                  {cv.isFavorite ? (
                    <>
                      <Star className="w-4 h-4 fill-current" />
                      Favorito
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      Favorito
                    </>
                  )}
                </button>

                {/* Botón Descargar */}
                <button
                  onClick={() => handleDownload(cv.fileId, cv.fileName)}
                  disabled={isUpdating !== null}
                  className="px-3 py-2 rounded-lg bg-prussian-blue-200 dark:bg-prussian-blue-700 hover:bg-prussian-blue-300 dark:hover:bg-prussian-blue-600 text-prussian-blue-800 dark:text-prussian-blue-200 transition font-medium text-sm disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  title="Descargar CV"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Botón Eliminar */}
                <button
                  onClick={() => handleDelete(cv.$id, cv.fileId)}
                  disabled={isUpdating !== null}
                  className="px-3 py-2 rounded-lg bg-dusk-blue-200 dark:bg-dusk-blue-800 hover:bg-dusk-blue-300 dark:hover:bg-dusk-blue-700 text-dusk-blue-800 dark:text-dusk-blue-200 transition font-medium text-sm disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  title="Eliminar CV"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
