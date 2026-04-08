/**
 * Componente de Citas Médicas
 * ISO 27001 Compliant - Listado y gestión de citas
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppointmentService } from '../services/appointment.service';
import { Appointment, AppointmentStatus } from '../models/appointment.models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  private appointmentService = inject(AppointmentService);
  private destroy$ = new Subject<void>();

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedStatus: AppointmentStatus | '' = '';
  searchTerm = '';
  appointmentStatuses = AppointmentStatus;

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga las citas del usuario
   */
  private loadAppointments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.appointmentService
      .getAppointments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (appointments) => {
          this.appointments = appointments;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error al cargar las citas';
          this.isLoading = false;
        }
      });
  }

  /**
   * Aplica filtros a las citas
   */
  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesStatus = !this.selectedStatus || appointment.status === this.selectedStatus;
      const matchesSearch =
        appointment.doctorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }

  /**
   * Actualiza el filtro de estado
   */
  onStatusFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Actualiza el término de búsqueda
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Cancela una cita
   */
  cancelAppointment(id: string): void {
    if (confirm('¿Está seguro de que desea cancelar esta cita?')) {
      this.appointmentService
        .cancelAppointment(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage = 'Cita cancelada correctamente';
            this.loadAppointments();
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Error al cancelar la cita';
          }
        });
    }
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Retorna el color del estado
   */
  getStatusColor(status: AppointmentStatus): string {
    const colors: { [key in AppointmentStatus]: string } = {
      [AppointmentStatus.SCHEDULED]: 'blue',
      [AppointmentStatus.CONFIRMED]: 'green',
      [AppointmentStatus.IN_PROGRESS]: 'yellow',
      [AppointmentStatus.COMPLETED]: 'gray',
      [AppointmentStatus.CANCELLED]: 'red',
      [AppointmentStatus.NO_SHOW]: 'orange'
    };
    return colors[status] || 'gray';
  }

  /**
   * Retorna el texto del estado
   */
  getStatusText(status: AppointmentStatus): string {
    const texts: { [key in AppointmentStatus]: string } = {
      [AppointmentStatus.SCHEDULED]: 'Programada',
      [AppointmentStatus.CONFIRMED]: 'Confirmada',
      [AppointmentStatus.IN_PROGRESS]: 'En curso',
      [AppointmentStatus.COMPLETED]: 'Completada',
      [AppointmentStatus.CANCELLED]: 'Cancelada',
      [AppointmentStatus.NO_SHOW]: 'No asistió'
    };
    return texts[status] || status;
  }

  /**
   * Verifica si una cita puede ser cancelada
   */
  canCancelAppointment(appointment: Appointment): boolean {
    return appointment.status === AppointmentStatus.SCHEDULED ||
           appointment.status === AppointmentStatus.CONFIRMED;
  }
}
