import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { LoadPatientBackground, PatientBackgroundInterface } from '../../services/load-patient-background';

@Component({
  selector: 'app-patient-background',
  imports: [AsyncPipe],
  templateUrl: './patient-background.html',
  styleUrl: './patient-background.css'
})
export class PatientBackground {
  private patientBackground = inject(LoadPatientBackground);
  patientBackground$: Observable<PatientBackgroundInterface[]> = this.patientBackground.getPatientBackground();
}
