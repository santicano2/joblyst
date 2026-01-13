"use client";

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-dusty-denim-300 dark:border-dusk-blue-600 hover:bg-alabaster-grey-900 dark:hover:bg-prussian-blue-600/30">
      <td className="px-6 py-4">
        <div className="h-4 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-32 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-24 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-28 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-20 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded-full w-16 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-20 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <div className="h-8 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-12 animate-pulse" />
          <div className="h-8 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-12 animate-pulse" />
          <div className="h-8 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-12 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-alabaster-grey-900 dark:bg-prussian-blue-500 rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-alabaster-grey-800 dark:bg-prussian-blue-600">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Empresa
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Puesto
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Ubicación
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Tipo
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
              Fecha
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-ink-black-500 dark:text-alabaster-grey-900">
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
    <div className="bg-alabaster-grey-900 dark:bg-prussian-blue-500 rounded-lg p-6 shadow-md">
      <div className="h-4 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-20 animate-pulse mb-3" />
      <div className="h-8 bg-dusty-denim-200 dark:bg-dusk-blue-600 rounded w-16 animate-pulse" />
    </div>
  );
}

export function StatsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(8)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
