import type { PartialState, ConsultationStep } from "./session.ts";
import { CONSULTATION_STEPS } from "./session.ts";

export class ConsultationController {
  private pasoActual: ConsultationStep;
  private readonly patientID: string;
  private partialState: PartialState;
  private readonly createdAt: Date;

  constructor(patientID: string) {
    if (!patientID || patientID.trim() === "") {
      throw new Error("patientID no puede estar vacío");
    }
    
    this.patientID = patientID;
    this.pasoActual = "consulta";
    this.partialState = {};
    this.createdAt = new Date();
  }

  nextStep(): void {
    const currentIndex = CONSULTATION_STEPS.indexOf(this.pasoActual);
    
    if (currentIndex === -1) {
      throw new Error(`Paso actual inválido: ${this.pasoActual}`);
    }
    
    if (currentIndex < CONSULTATION_STEPS.length - 1) {
      this.pasoActual = CONSULTATION_STEPS[currentIndex + 1];
    } else {
      this.pasoActual = "resumen";
    }
  }

  savePartialState(update: Partial<PartialState>): void {
    if (!update || typeof update !== "object") {
      throw new Error("Update debe ser un objeto válido");
    }
    
    console.log(`[${this.patientID}] Guardando estado parcial:`, update);
    this.partialState = { ...this.partialState, ...update };
    console.log(`[${this.patientID}] Nuevo estado:`, this.partialState);
  }

  getPartialState(): PartialState {
    return { ...this.partialState };
  }

  getCurrentStep(): ConsultationStep {
    return this.pasoActual;
  }

  getPatientID(): string {
    return this.patientID;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  reset(): void {
    this.pasoActual = "consulta";
    this.partialState = {};
  }
}
