/**
 * Check if interview is today
 */
export function isInterviewToday(interviewDate: string | null | undefined): boolean {
  if (!interviewDate) return false;

  const interview = new Date(interviewDate);
  const today = new Date();

  return (
    interview.getFullYear() === today.getFullYear() &&
    interview.getMonth() === today.getMonth() &&
    interview.getDate() === today.getDate()
  );
}

/**
 * Check if interview is within the next 7 days
 */
export function isInterviewSoon(interviewDate: string | null | undefined): boolean {
  if (!interviewDate) return false;

  const interview = new Date(interviewDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const timeDiff = interview.getTime() - today.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  return daysDiff >= 0 && daysDiff <= 7;
}

/**
 * Get number of days until interview (negative if in the past)
 */
export function daysUntilInterview(interviewDate: string | null | undefined): number | null {
  if (!interviewDate) return null;

  const interview = new Date(interviewDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const timeDiff = interview.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff;
}
