"use client";

interface MonthSelectorProps {
  selectedMonth: string; // "2025-01"
  onMonthChange: (month: string) => void;
}

export default function MonthSelector({
  selectedMonth,
  onMonthChange,
}: MonthSelectorProps) {
  const [year, month] = selectedMonth.split("-").map(Number);
  const currentDate = new Date(year, month - 1);

  function previousMonth() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    const newMonth = `${newDate.getFullYear()}-${String(
      newDate.getMonth() + 1
    ).padStart(2, "0")}`;
    onMonthChange(newMonth);
  }

  function nextMonth() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    const newMonth = `${newDate.getFullYear()}-${String(
      newDate.getMonth() + 1
    ).padStart(2, "0")}`;
    onMonthChange(newMonth);
  }

  function goToCurrentMonth() {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;
    onMonthChange(currentMonth);
  }

  const monthName = currentDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
      <button
        onClick={previousMonth}
        className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition cursor-pointer"
      >
        ← Anterior
      </button>

      <div className="flex-1 text-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
          {monthName}
        </h2>
      </div>

      <button
        onClick={nextMonth}
        className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition cursor-pointer"
      >
        Siguiente →
      </button>

      <button
        onClick={goToCurrentMonth}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer text-sm"
      >
        Hoy
      </button>
    </div>
  );
}
