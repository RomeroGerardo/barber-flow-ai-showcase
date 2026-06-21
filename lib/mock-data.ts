export type Appointment = {
  id: string;
  clientName: string;
  service: string;
  time: string;
  date: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  price: number;
  barber: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  totalVisits: number;
  preferences: string;
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "1", clientName: "Carlos Martínez", service: "Corte + Barba", time: "10:00", date: "Hoy", status: "completed", price: 25, barber: "Alex" },
  { id: "2", clientName: "Miguel Rojas", service: "Corte Clásico", time: "11:30", date: "Hoy", status: "confirmed", price: 15, barber: "Juan" },
  { id: "3", clientName: "Javier Silva", service: "Perfilado de Barba", time: "14:00", date: "Hoy", status: "confirmed", price: 10, barber: "Alex" },
  { id: "4", clientName: "Fernando Gómez", service: "Corte + Tinte", time: "16:00", date: "Hoy", status: "pending", price: 40, barber: "Juan" },
  { id: "5", clientName: "Lucas Pérez", service: "Corte Clásico", time: "17:30", date: "Hoy", status: "confirmed", price: 15, barber: "Alex" },
  { id: "6", clientName: "Diego López", service: "Corte + Barba", time: "10:00", date: "Mañana", status: "confirmed", price: 25, barber: "Alex" },
];

export const MOCK_CLIENTS: Client[] = [
  { id: "1", name: "Carlos Martínez", phone: "+34 600 123 456", lastVisit: "2026-06-10", totalVisits: 12, preferences: "Degradado alto, barba rebajada" },
  { id: "2", name: "Miguel Rojas", phone: "+34 600 234 567", lastVisit: "2026-05-25", totalVisits: 5, preferences: "Corte clásico tijera" },
  { id: "3", name: "Javier Silva", phone: "+34 600 345 678", lastVisit: "2026-06-05", totalVisits: 8, preferences: "Perfilado con navaja" },
  { id: "4", name: "Fernando Gómez", phone: "+34 600 456 789", lastVisit: "2026-04-12", totalVisits: 2, preferences: "Tinte oscuro" },
];

export const MOCK_METRICS = {
  revenueToday: 245,
  appointmentsToday: 12,
  hoursSavedByAI: "3.5h",
  noShowsPrevented: 4,
};
