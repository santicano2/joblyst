"use client";

import { useState } from "react";
import { ApplicationStatus, JobType, JobSource } from "@/types/applications";

interface FilterPanelProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  search: string;
  status: ApplicationStatus | "";
  jobType: JobType | "";
  source: JobSource | "";
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  onlyFavorites?: boolean;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    status: "",
    jobType: "",
    source: "",
    location: "",
    salaryMin: null,
    salaryMax: null,
    onlyFavorites: false,
  });

  const handleFilterChange = (
    key: keyof FilterValues,
    value: string | number | null | boolean
  ) => {
    const updatedFilters = {
      ...filters,
      [key]: value === "" ? "" : value,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const emptyFilters: FilterValues = {
      search: "",
      status: "",
      jobType: "",
      source: "",
      location: "",
      salaryMin: null,
      salaryMax: null,
      onlyFavorites: false,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null
  );

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition cursor-pointer"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filtros
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
            {
              Object.values(filters).filter((v) => v !== "" && v !== null)
                .length
            }
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-4 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Búsqueda
              </label>
              <input
                type="text"
                placeholder="Empresa o puesto..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  handleFilterChange(
                    "status",
                    (e.target.value as ApplicationStatus) || ""
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="applied">Postulada</option>
                <option value="interview">Entrevista</option>
                <option value="offer">Oferta</option>
                <option value="rejected">Rechazada</option>
              </select>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tipo de Empleo
              </label>
              <select
                value={filters.jobType}
                onChange={(e) =>
                  handleFilterChange(
                    "jobType",
                    (e.target.value as JobType) || ""
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="full-time">Tiempo Completo</option>
                <option value="part-time">Tiempo Parcial</option>
                <option value="contract">Contrato</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fuente
              </label>
              <select
                value={filters.source}
                onChange={(e) =>
                  handleFilterChange(
                    "source",
                    (e.target.value as JobSource) || ""
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las fuentes</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="Email">Email</option>
                <option value="Referral">Referido</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                placeholder="Ciudad, país..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Salary Min */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Salario Mínimo (USD)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.salaryMin || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "salaryMin",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Salary Max */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Salario Máximo (USD)
              </label>
              <input
                type="number"
                placeholder="999999"
                value={filters.salaryMax || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "salaryMax",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Favorites Only */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyFavorites || false}
                  onChange={(e) =>
                    handleFilterChange("onlyFavorites", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-amber-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  ⭐ Solo favoritos
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={handleReset}
              disabled={!hasActiveFilters}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
