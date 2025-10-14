import type { PartialState, ConsultationStep } from './session.ts';
import { CONSULTATION_STEPS } from './session.ts';

const INITIAL_STEP: ConsultationStep = 'consulta';
const FINAL_STEP: ConsultationStep = 'resumen';

const ERROR_MESSAGES = {
  EMPTY_PATIENT_ID: 'patientID cannot be empty',
  INVALID_STEP: (step: string) => `Invalid current step: ${step}`,
  INVALID_UPDATE: 'Update must be a valid object',
  STEP_NOT_FOUND: (step: ConsultationStep) => `Step not found in CONSULTATION_STEPS: ${step}`,
} as const;

export class ConsultationController {
  private pasoActual: ConsultationStep;
  private readonly patientID: string;
  private partialState: PartialState;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(patientID: string) {
    if (!patientID || patientID.trim() === '') {
      throw new Error(ERROR_MESSAGES.EMPTY_PATIENT_ID);
    }
    
    this.patientID = patientID;
    this.pasoActual = INITIAL_STEP;
    this.partialState = {};
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  nextStep(): void {
    const currentIndex = CONSULTATION_STEPS.indexOf(this.pasoActual);
    
    if (currentIndex === -1) {
      throw new Error(ERROR_MESSAGES.INVALID_STEP(this.pasoActual));
    }
    
    if (currentIndex < CONSULTATION_STEPS.length - 1) {
      this.pasoActual = CONSULTATION_STEPS[currentIndex + 1];
    } else {
      this.pasoActual = FINAL_STEP;
    }
    
    this.updatedAt = new Date();
  }

  savePartialState(update: Partial<PartialState>): void {
    if (!update || typeof update !== 'object') {
      throw new Error(ERROR_MESSAGES.INVALID_UPDATE);
    }
    
    console.log(`[${this.patientID}] Saving partial state:`, update);
    this.partialState = { ...this.partialState, ...update };
    this.updatedAt = new Date();
    console.log(`[${this.patientID}] New state:`, this.partialState);
  }

  getPartialState(): Readonly<PartialState> {
    return { ...this.partialState };
  }

  getCurrentStep(): ConsultationStep {
    return this.pasoActual;
  }

  getPatientID(): string {
    return this.patientID;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  isAtFinalStep(): boolean {
    return this.pasoActual === FINAL_STEP;
  }

  isAtInitialStep(): boolean {
    return this.pasoActual === INITIAL_STEP;
  }

  reset(): void {
    this.pasoActual = INITIAL_STEP;
    this.partialState = {};
    this.updatedAt = new Date();
  }

  getStepProgress(): { current: number; total: number; percentage: number } {
    const currentIndex = CONSULTATION_STEPS.indexOf(this.pasoActual);
    const total = CONSULTATION_STEPS.length;
    const percentage = Math.round((currentIndex / total) * 100);
    
    return {
      current: currentIndex + 1,
      total,
      percentage
    };
  }
}
