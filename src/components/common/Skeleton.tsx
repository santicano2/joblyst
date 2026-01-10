"use client";

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-32 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-24 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-28 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-20 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded-full w-16 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-20 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded w-12 animate-pulse" />
          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded w-12 animate-pulse" />
          <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded w-12 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100 dark:bg-slate-700/50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Empresa
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Puesto
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Ubicación
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tipo
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Fecha
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
      <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-20 animate-pulse mb-3" />
      <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded w-16 animate-pulse" />
    </div>
  );
}

export function StatsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {[...Array(6)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
