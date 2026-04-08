/**
 * Servicio de Citas Médicas
 * ISO 27001 Compliant - Gestión de citas con el backend
 */

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentFilter,
  AppointmentStatus
} from '../models/appointment.models';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiService = inject(ApiService);

  /**
   * Obtiene todas las citas del usuario
   */
  getAppointments(filter?: AppointmentFilter): Observable<Appointment[]> {
    let query = '';
    if (filter) {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.startDate) params.append('startDate', filter.startDate.toISOString());
      if (filter.endDate) params.append('endDate', filter.endDate.toISOString());
      if (filter.specialty) params.append('specialty', filter.specialty);
      query = params.toString() ? `?${params.toString()}` : '';
    }

    return this.apiService
      .get<Appointment[]>(`/citas${query}`)
      .pipe(map(response => response.data || []));
  }

  /**
   * Obtiene una cita por ID
   */
  getAppointmentById(id: string): Observable<Appointment> {
    return this.apiService
      .get<Appointment>(`/citas/${id}`)
      .pipe(map(response => response.data!));
  }

  /**
   * Crea una nueva cita
   */
  createAppointment(data: CreateAppointmentRequest): Observable<Appointment> {
    return this.apiService
      .post<Appointment>('/citas', data)
      .pipe(map(response => response.data!));
  }

  /**
   * Actualiza una cita
   */
  updateAppointment(id: string, data: UpdateAppointmentRequest): Observable<Appointment> {
    return this.apiService
      .put<Appointment>(`/citas/${id}`, data)
      .pipe(map(response => response.data!));
  }

  /**
   * Cancela una cita
   */
  cancelAppointment(id: string): Observable<Appointment> {
    return this.apiService
      .patch<Appointment>(`/citas/${id}/cancelar`, {})
      .pipe(map(response => response.data!));
  }

  /**
   * Elimina una cita
   */
  deleteAppointment(id: string): Observable<any> {
    return this.apiService
      .delete<any>(`/citas/${id}`);
  }
}
