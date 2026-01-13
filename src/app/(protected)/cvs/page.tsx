"use client";

import CVUpload from "@/components/common/CVUpload";
import CVManager from "@/components/common/CVManager";
import { useState } from "react";

export default function CVsPage() {
  const [uploadedCVId, setUploadedCVId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFileUploaded = (fileId: string) => {
    setUploadedCVId(fileId);
    // Fuerza re-render de CVManager
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Mis CVs
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Sube tus CVs aquí, marca uno como favorito y úsalo automáticamente en tus postulaciones
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 mb-8 animate-slideInUp">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Subir Nuevo CV
        </h2>
        <CVUpload
          onFileSelected={handleFileUploaded}
          existingFileId={uploadedCVId || undefined}
        />
      </div>

      {/* CV Manager Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 mb-8 animate-slideInUp">
        <CVManager key={refreshKey} />
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
          💡 Cómo usar
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>
            ✅ Sube todos tus CVs (versiones diferentes, idiomas, etc.)
          </li>
          <li>⭐ Marca uno como favorito</li>
          <li>
            ✅ El CV favorito se seleccionará automáticamente en nuevas postulaciones
          </li>
          <li>✅ Puedes descargar tus CVs desde esta página</li>
          <li>✅ Máximo 10MB por archivo (PDF o DOC)</li>
        </ul>
      </div>
    </div>
  );
}
