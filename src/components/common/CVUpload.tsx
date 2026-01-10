"use client";

import { useState } from "react";
import { uploadCV, deleteCV } from "@/services/storage";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface CVUploadProps {
  onFileSelected?: (fileId: string) => void;
  onFileDeleted?: () => void;
  existingFileId?: string;
}

export default function CVUpload({
  onFileSelected,
  onFileDeleted,
  existingFileId,
}: CVUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const fileId = await uploadCV(file, file.name);
      setFileName(file.name);
      onFileSelected?.(fileId);
      showSuccessToast("CV subido exitosamente ✨");
    } catch (err) {
      showErrorToast(err instanceof Error ? err.message : "Error al subir CV");
    } finally {
      setIsLoading(false);
      // Reset input
      e.target.value = "";
    }
  }

  async function handleDelete() {
    if (!existingFileId) return;

    try {
      setIsLoading(true);
      await deleteCV(existingFileId);
      setFileName("");
      onFileDeleted?.();
      showSuccessToast("CV eliminado");
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Error al eliminar CV"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        📄 CV (PDF/DOC - Máximo 10MB)
      </label>

      <div className="flex gap-2">
        <label className="flex-1 relative cursor-pointer">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="hidden"
          />
          <div className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {isLoading ? "Subiendo..." : "Haz clic para subir CV"}
            </p>
          </div>
        </label>

        {existingFileId && (
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition cursor-pointer font-medium text-sm"
          >
            Eliminar
          </button>
        )}
      </div>

      {fileName && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          ✅ Archivo: {fileName}
        </p>
      )}
    </div>
  );
}
