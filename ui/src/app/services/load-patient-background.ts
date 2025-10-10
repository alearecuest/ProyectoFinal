import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface PatientBackgroundInterface {
  id: number;
  snomedCode: number;
  term: string;
  checked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoadPatientBackground {
  private http = inject(HttpClient);

  getPatientBackground(): Observable<PatientBackgroundInterface[]> {
    return this.http.get<PatientBackgroundInterface[]>('/assets/patient_background.json').pipe(
      catchError(err => {
        console.error('Failed to load patient_background.json', err);
        return of([]);
      })
    )
  }
  
}
