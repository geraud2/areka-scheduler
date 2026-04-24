import { useSyncExternalStore } from "react";
import { Appointment, seedAppointments } from "@/data/appointments";

let state: Appointment[] = [...seedAppointments];
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const appointmentsStore = {
  getAll: () => state,
  add: (appt: Appointment) => {
    state = [appt, ...state];
    emit();
  },
  update: (id: string, patch: Partial<Appointment>) => {
    state = state.map((a) => (a.id === id ? { ...a, ...patch } : a));
    emit();
  },
  remove: (id: string) => {
    state = state.filter((a) => a.id !== id);
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useAppointments() {
  return useSyncExternalStore(appointmentsStore.subscribe, appointmentsStore.getAll, appointmentsStore.getAll);
}

export function useTakenSlots(date: string) {
  const all = useAppointments();
  return all
    .filter((a) => a.date === date && (a.status === "confirmed" || a.status === "pending"))
    .map((a) => a.slot);
}
