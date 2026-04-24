import { AppointmentStatus } from "./statusLabels";

export type InterventionType = "entretien" | "depannage";

export interface Appointment {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  type: InterventionType;
  description?: string;
  date: string; // ISO yyyy-MM-dd
  slot: string;
  status: AppointmentStatus;
  source: "client" | "manual";
  createdAt: string;
}

const today = new Date();
const iso = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const seedAppointments: Appointment[] = [
  {
    id: "a1",
    firstName: "Marie",
    lastName: "Dupont",
    phone: "06 12 34 56 78",
    email: "marie.dupont@example.com",
    address: "12 rue de la Paix, 75002 Paris",
    type: "entretien",
    description: "Chaudière gaz murale, dernier entretien il y a 14 mois.",
    date: iso(2),
    slot: "09:00-10:00",
    status: "confirmed",
    source: "client",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a2",
    firstName: "Pierre",
    lastName: "Martin",
    phone: "06 98 76 54 32",
    email: "p.martin@example.com",
    address: "8 avenue Victor Hugo, 92100 Boulogne",
    type: "depannage",
    description: "Plus d'eau chaude depuis ce matin.",
    date: iso(1),
    slot: "14:00-15:00",
    status: "pending",
    source: "client",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a3",
    firstName: "Sophie",
    lastName: "Bernard",
    phone: "07 11 22 33 44",
    email: "sophie.b@example.com",
    address: "3 place du marché, 94300 Vincennes",
    type: "entretien",
    date: iso(5),
    slot: "10:00-11:00",
    status: "pending",
    source: "client",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a4",
    firstName: "Julien",
    lastName: "Lefèvre",
    phone: "06 55 44 33 22",
    email: "j.lefevre@example.com",
    address: "27 boulevard Saint-Michel, 75005 Paris",
    type: "depannage",
    date: iso(3),
    slot: "16:00-17:00",
    status: "rescheduled",
    source: "manual",
    createdAt: new Date().toISOString(),
  },
];
