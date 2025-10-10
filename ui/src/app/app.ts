import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from './components/logo/logo';
import { PatientData } from './components/patient-data/patient-data';
import { PatientBackground } from './components/patient-background/patient-background';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Logo, PatientData, PatientBackground],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
