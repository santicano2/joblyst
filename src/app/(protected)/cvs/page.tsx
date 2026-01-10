"use client";

import { useAuth } from "@/context/authContext";
import CVUpload from "@/components/common/CVUpload";
import { useState } from "react";
import Link from "next/link";

export default function CVsPage() {
  const { user, logout } = useAuth();
  const [uploadedCVId, setUploadedCVId] = useState<string | null>(null);

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition cursor-pointer"
            >
              Joblyst
            </Link>
            <div className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                Dashboard
              </Link>
              <Link
                href="/applications"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                Postulaciones
              </Link>
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                CVs
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm hidden sm:block">
              <p className="text-slate-600 dark:text-slate-400">Hola,</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {user?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Mis CVs
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Sube tus CVs aquí y luego selecciona cuál usaste en cada postulación
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 mb-8 animate-slideInUp">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Subir Nuevo CV
          </h2>
          <CVUpload
            onFileSelected={(fileId) => setUploadedCVId(fileId)}
            existingFileId={uploadedCVId || undefined}
          />
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
            💡 Cómo usar
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>
              ✅ Sube aquí todos tus CVs (versiones diferentes, idiomas, etc.)
            </li>
            <li>✅ Luego en cada postulación, selecciona qué CV enviaste</li>
            <li>
              ✅ Descarga desde el detalle de la postulación si lo necesitas
            </li>
            <li>✅ Máximo 10MB por archivo (PDF o DOC)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
