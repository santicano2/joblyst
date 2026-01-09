/**
 * Utilidades para manejar fechas y meses
 */

export function getCurrentMonth(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

export function getMonthRange(monthString: string): {
  start: Date;
  end: Date;
} {
  const [year, month] = monthString.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

export function filterApplicationsByMonth(
  applications: any[],
  monthString: string
): any[] {
  const { start, end } = getMonthRange(monthString);

  return applications.filter((app) => {
    const appDate = new Date(app.dateApplied);
    return appDate >= start && appDate <= end;
  });
}
