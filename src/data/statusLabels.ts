export type AppointmentStatus = "pending" | "confirmed" | "rescheduled" | "refused";

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  rescheduled: "À replanifier",
  refused: "Refusé",
};

export const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  confirmed: "bg-success/15 text-success border-success/30",
  rescheduled: "bg-info/15 text-info border-info/30",
  refused: "bg-destructive/15 text-destructive border-destructive/30",
};
