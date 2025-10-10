import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { LoadPatient, Patient } from '../../services/load-patient';

@Component({
  selector: 'app-patient-data',
  imports: [AsyncPipe],
  templateUrl: './patient-data.html',
  styleUrl: './patient-data.css'
})
export class PatientData {
  private patient = inject(LoadPatient);
  patient$: Observable<Patient[]> = this.patient.getPatient();
}
