import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface Patient {
  id: number;
  age: number;
  gender: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadPatient {
  private http = inject(HttpClient);

  getPatient(): Observable<Patient[]> {
    return this.http.get<Patient[]>('/assets/patient.json').pipe(
      catchError(err => {
        console.error('Failed to load patient.json', err);
        return of([]);
      })
    )
  }
}
