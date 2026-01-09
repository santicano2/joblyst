"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Application, CreateApplicationInput } from "@/types/applications";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "@/services/applications";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import ApplicationModal from "@/components/applications/ApplicationModal";
import DeleteConfirmModal from "@/components/applications/DeleteConfirmModal";
import Link from "next/link";

export default function ApplicationsPage() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load applications on mount
  useEffect(() => {
    loadApplications();
  }, [user?.id]);

  async function loadApplications() {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getApplications(user.id);
      setApplications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar postulaciones"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateOrUpdate(data: CreateApplicationInput) {
    if (!user?.id) return;

    try {
      setIsSaving(true);

      if (selectedApp) {
        // Actualizar
        const updated = await updateApplication({
          $id: selectedApp.$id,
          ...data,
        });
        setApplications((prev) =>
          prev.map((app) => (app.$id === updated.$id ? updated : app))
        );
      } else {
        // Crear
        const created = await createApplication(user.id, data);
        setApplications((prev) => [created, ...prev]);
      }

      setSelectedApp(null);
      setIsModalOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar postulación"
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!appToDelete?.$id) return;

    try {
      setIsSaving(true);
      await deleteApplication(appToDelete.$id);
      setApplications((prev) =>
        prev.filter((app) => app.$id !== appToDelete.$id)
      );
      setAppToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar postulación"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function openCreateModal() {
    setSelectedApp(null);
    setIsModalOpen(true);
  }

  function openEditModal(app: Application) {
    setSelectedApp(app);
    setIsModalOpen(true);
  }

  function openDeleteModal(app: Application) {
    setAppToDelete(app);
    setIsDeleteModalOpen(true);
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
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
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                Postulaciones
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
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Mis Postulaciones
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Total: {applications.length} postulación
              {applications.length !== 1 ? "es" : ""}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
          >
            + Nueva postulación
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 text-sm font-medium underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Cargando postulaciones...
              </p>
            </div>
          </div>
        ) : (
          /* Applications Table */
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            <ApplicationsTable
              applications={applications}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              isLoading={isSaving}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ApplicationModal
        isOpen={isModalOpen}
        application={selectedApp}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApp(null);
        }}
        onSubmit={handleCreateOrUpdate}
        isLoading={isSaving}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemName={appToDelete?.company || ""}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setAppToDelete(null);
        }}
        isLoading={isSaving}
      />
    </div>
  );
}
