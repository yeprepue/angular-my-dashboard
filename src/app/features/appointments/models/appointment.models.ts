/**
 * Modelos de Citas Médicas
 * ISO 27001 Compliant - Gestión segura de citas
 */

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  datetime: Date;
  duration: number; // en minutos
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  datetime: Date;
  reason: string;
}

export interface UpdateAppointmentRequest {
  datetime?: Date;
  reason?: string;
  notes?: string;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface AppointmentFilter {
  status?: AppointmentStatus;
  startDate?: Date;
  endDate?: Date;
  specialty?: string;
}
