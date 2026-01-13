"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Application, CreateApplicationInput } from "@/types/applications";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  toggleFavorite,
} from "@/services/applications";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import MonthSelector from "@/components/applications/MonthSelector";
import QuickAddForm from "@/components/applications/QuickAddForm";
import StatsOverview from "@/components/applications/StatsOverview";
import ExportButtons from "@/components/applications/ExportButtons";
import { getCurrentMonth, filterApplicationsByMonth } from "@/utils/monthUtils";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "@/utils/toast";
import {
  TableSkeleton,
  StatsOverviewSkeleton,
} from "@/components/common/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import { isInterviewToday } from "@/utils/interviewUtils";
import { getFriendlyErrorMessage } from "@/utils/errorMessages";
import Link from "next/link";

// Lazy load heavy modals
const ApplicationModal = dynamic(
  () => import("@/components/applications/ApplicationModal"),
  { ssr: false }
);
const DeleteConfirmModal = dynamic(
  () => import("@/components/applications/DeleteConfirmModal"),
  { ssr: false }
);
const DetailModal = dynamic(
  () => import("@/components/applications/DetailModal"),
  { ssr: false }
);
const FilterPanel = dynamic(
  () =>
    import("@/components/applications/FilterPanel").then((mod) => ({
      default: mod.default,
    })),
  { ssr: false }
);

// Import FilterValues type
import type { FilterValues } from "@/components/applications/FilterPanel";

export default function ApplicationsPage() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<Application | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<Application | null>(
    null
  );
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({
    search: "",
    status: "",
    jobType: "",
    source: "",
    location: "",
    salaryMin: null,
    salaryMax: null,
    onlyFavorites: false,
  });

  // Filtrar postulaciones por mes y filtros avanzados
  const monthFilteredApplications = filterApplicationsByMonth(
    applications,
    selectedMonth
  );

  const filteredApplications = monthFilteredApplications.filter((app) => {
    // Search filter
    if (advancedFilters.search) {
      const search = advancedFilters.search.toLowerCase();
      if (
        !app.company.toLowerCase().includes(search) &&
        !app.jobTitle.toLowerCase().includes(search)
      ) {
        return false;
      }
    }

    // Status filter
    if (advancedFilters.status && app.status !== advancedFilters.status) {
      return false;
    }

    // Job type filter
    if (advancedFilters.jobType && app.jobType !== advancedFilters.jobType) {
      return false;
    }

    // Source filter
    if (advancedFilters.source && app.source !== advancedFilters.source) {
      return false;
    }

    // Location filter
    if (advancedFilters.location) {
      if (
        !app.location
          .toLowerCase()
          .includes(advancedFilters.location.toLowerCase())
      ) {
        return false;
      }
    }

    // Salary range filter
    if (advancedFilters.salaryMin && app.salaryMax) {
      if (app.salaryMax < advancedFilters.salaryMin) {
        return false;
      }
    }

    if (advancedFilters.salaryMax && app.salaryMin) {
      if (app.salaryMin > advancedFilters.salaryMax) {
        return false;
      }
    }

    // Favorites filter
    if (advancedFilters.onlyFavorites && !app.isFavorite) {
      return false;
    }

    return true;
  });

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

      // Check for interviews today
      const interviewsToday = data.filter((app) =>
        isInterviewToday(app.interviewDate)
      );

      if (interviewsToday.length > 0) {
        const names = interviewsToday
          .map((app) => `${app.company} - ${app.jobTitle}`)
          .join(", ");
        showSuccessToast(
          `🔔 ¡Tienes ${interviewsToday.length} entrevista(s) hoy! ${names}`
        );
      }
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
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
        const toastId = showLoadingToast("Actualizando postulación...");
        const updated = await updateApplication({
          $id: selectedApp.$id,
          ...data,
        });
        setApplications((prev) =>
          prev.map((app) => (app.$id === updated.$id ? updated : app))
        );
        dismissToast(toastId);
        showSuccessToast("Postulación actualizada ✨");
      } else {
        // Crear
        const toastId = showLoadingToast("Creando postulación...");
        const created = await createApplication(user.id, data);
        setApplications((prev) => [created, ...prev]);
        dismissToast(toastId);
        showSuccessToast("Postulación creada exitosamente ✨");
      }

      setSelectedApp(null);
      setIsModalOpen(false);
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      showErrorToast(friendlyMessage);
      setError(friendlyMessage);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!appToDelete?.$id) return;

    try {
      setIsSaving(true);
      const toastId = showLoadingToast("Eliminando postulación...");
      await deleteApplication(appToDelete.$id);
      setApplications((prev) =>
        prev.filter((app) => app.$id !== appToDelete.$id)
      );
      dismissToast(toastId);
      showSuccessToast("Postulación eliminada");
      setAppToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      showErrorToast(friendlyMessage);
      setError(friendlyMessage);
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

  function openDetailModal(app: Application) {
    setSelectedDetail(app);
    setIsDetailModalOpen(true);
  }

  async function handleToggleFavorite(app: Application) {
    try {
      const updated = await toggleFavorite(app.$id, !app.isFavorite);
      setApplications((prev) =>
        prev.map((a) => (a.$id === updated.$id ? updated : a))
      );
      showSuccessToast(
        updated.isFavorite ? "⭐ Agregado a favoritos" : "Removido de favoritos"
      );
    } catch (err) {
      showErrorToast("Error al actualizar favorito");
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Mis Postulaciones
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Total: {applications.length} | Este mes:{" "}
            {monthFilteredApplications.length} | Mostrados:{" "}
            {filteredApplications.length}
          </p>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <button
            onClick={openCreateModal}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
          >
            + Nueva postulación
          </button>
          <ExportButtons applications={filteredApplications} />
        </div>
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

      {/* Filter Panel */}
      {!isLoading && <FilterPanel onFilterChange={setAdvancedFilters} />}

      {/* Quick Add Form */}
      {!isLoading && (
        <QuickAddForm onSubmit={handleCreateOrUpdate} isLoading={isSaving} />
      )}

      {/* Month Selector */}
      {!isLoading && (
        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      )}

      {/* Stats Overview */}
      {isLoading ? (
        <StatsOverviewSkeleton />
      ) : filteredApplications.length > 0 ? (
        <StatsOverview applications={filteredApplications} />
      ) : null}

      {/* Loading State */}
      {isLoading ? (
        <TableSkeleton />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title="Sin postulaciones"
          description={
            applications.length === 0
              ? "Comienza a registrar tus postulaciones de empleo para organizarte mejor."
              : "No hay postulaciones que coincidan con tus filtros. Intenta ajustar los criterios de búsqueda."
          }
          actionLabel={
            applications.length === 0 ? "+ Nueva postulación" : undefined
          }
          onAction={applications.length === 0 ? openCreateModal : undefined}
        />
      ) : (
        /* Applications Table */
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <ApplicationsTable
            applications={filteredApplications}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onView={openDetailModal}
            onToggleFavorite={handleToggleFavorite}
            isLoading={isSaving}
          />
        </div>
      )}

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

      <DetailModal
        isOpen={isDetailModalOpen}
        application={selectedDetail}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetail(null);
        }}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
