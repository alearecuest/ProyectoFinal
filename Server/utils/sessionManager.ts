import { ConsultationController } from "../controller.ts";
import { config } from "../config.ts";

export class SessionManager {
  private sessions = new Map<string, ConsultationController>();
  private sessionTimestamps = new Map<string, number>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTask();
  }

  private startCleanupTask(): void {
    const intervalMs = config.sessionCleanupIntervalMinutes * 60 * 1000;
    
    this.cleanupInterval = setInterval(() => {
      this.cleanExpiredSessions();
    }, intervalMs);

    console.log(`✅ Tarea de limpieza de sesiones iniciada (cada ${config.sessionCleanupIntervalMinutes} minutos)`);
  }

  private cleanExpiredSessions(): void {
    const now = Date.now();
    const timeoutMs = config.sessionTimeoutMinutes * 60 * 1000;
    let deletedCount = 0;

    for (const [id, timestamp] of this.sessionTimestamps.entries()) {
      if (now - timestamp > timeoutMs) {
        this.sessions.delete(id);
        this.sessionTimestamps.delete(id);
        deletedCount++;
        console.log(`🗑️  Sesión ${id} expirada y eliminada`);
      }
    }

    if (deletedCount > 0) {
      console.log(`✅ Limpieza completada: ${deletedCount} sesión(es) eliminada(s)`);
    }
  }

  createSession(patientID: string): ConsultationController {
    if (this.sessions.has(patientID)) {
      throw new Error(`La sesión ${patientID} ya existe`);
    }

    const controller = new ConsultationController(patientID);
    this.sessions.set(patientID, controller);
    this.sessionTimestamps.set(patientID, Date.now());
    
    console.log(`✅ Sesión creada: ${patientID}`);
    return controller;
  }

  getSession(patientID: string): ConsultationController | undefined {
    const controller = this.sessions.get(patientID);
    
    if (controller) {
      this.updateTimestamp(patientID);
    }
    
    return controller;
  }

  deleteSession(patientID: string): boolean {
    const deleted = this.sessions.delete(patientID);
    this.sessionTimestamps.delete(patientID);
    
    if (deleted) {
      console.log(`🗑️  Sesión eliminada: ${patientID}`);
    }
    
    return deleted;
  }

  updateTimestamp(patientID: string): void {
    if (this.sessions.has(patientID)) {
      this.sessionTimestamps.set(patientID, Date.now());
    }
  }

  getSessionCount(): number {
    return this.sessions.size;
  }

  getAllSessionIDs(): string[] {
    return Array.from(this.sessions.keys());
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    this.sessions.clear();
    this.sessionTimestamps.clear();
    console.log("🛑 SessionManager destruido");
  }
}

export const sessionManager = new SessionManager();
