"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  itemName,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full animate-scaleIn">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
          ¿Eliminar postulación?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
          ¿Estás seguro de que quieres eliminar la postulación en{" "}
          <strong>{itemName}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-2 rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
