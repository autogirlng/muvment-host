const TRIP_STATUS_LABELS: Record<string, string> = {
  UPCOMING: "Upcoming",
  IN_PROGRESS: "In Progress",
  COMING_TO_AN_END: "Coming to an End",
  COMPLETED: "Completed",
};

export function getTripStatusLabel(status?: string | null): string {
  if (!status) return "—";
  const key = status.toUpperCase();
  return TRIP_STATUS_LABELS[key] ?? status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function tripStatusColors(status?: string | null): {
  dot: string;
  bg: string;
  text: string;
} {
  const key = status?.toUpperCase() ?? "";
  if (key === "COMPLETED")
    return { dot: "bg-success-500", bg: "bg-success-50", text: "text-success-600" };
  if (key === "IN_PROGRESS")
    return { dot: "bg-primary-500", bg: "bg-primary-50", text: "text-primary-600" };
  if (key === "COMING_TO_AN_END")
    return { dot: "bg-warning-400", bg: "bg-warning-75", text: "text-warning-700" };
  if (key === "UPCOMING")
    return { dot: "bg-grey-400", bg: "bg-grey-90", text: "text-grey-600" };
  return { dot: "bg-grey-400", bg: "bg-grey-90", text: "text-grey-600" };
}
