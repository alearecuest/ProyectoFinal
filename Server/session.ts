export type ConsultationStep =
  | "identificacion"
  | "motivo_consulta"
  | "anamnesis"
  | "antecedentes_personales"
  | "antecedentes_familiares"
  | "alergias_penicilinas"
  | "alergias_aines"
  | "farmacos"
  | "signos_vitales"
  | "examen_fisico"
  | "diagnostico"
  | "resumen";

export interface Option {
  label: string;
  checked: boolean;
}

export interface DatosIdentificativos {
  edad: number;
  genero: "masculino" | "femenino" | "otro";
}

export interface SignosVitales {
  presion_arterial?: string;
  frecuencia_cardiaca?: number;
  frecuencia_respiratoria?: number;
  temperatura?: number;
  saturacion_oxigeno?: number;
  peso?: number;
  talla?: number;
  imc?: number;
}

export interface Anamnesis {
  inicio?: string;
  duracion?: string;
  evolucion?: string;
  caracteristicas?: string;
  intensidad?: string;
  localizacion?: string;
  irradiacion?: string;
  factores_agravantes?: string;
  factores_aliviantes?: string;
  sintomas_asociados?: string[];
}

export interface AntecedentesPersonales {
  patologicos?: string[];
  quirurgicos?: string[];
  traumaticos?: string[];
  toxicos?: string[];
  gineco_obstetricos?: string[];
  transfusionales?: string[];
}

export interface AlergiasDetalladas {
  penicilinas?: string[];
  aines?: string[];
  otras?: string[];
}

export interface ExamenFisico {
  aspecto_general?: string;
  cardiovascular?: string;
  respiratorio?: string;
  abdominal?: string;
  neurologico?: string;
  piel_faneras?: string;
  otros?: string;
}

export interface DiagnosticoDiferencial {
  Patologia: string;
  Probabilidad: "Muy Alta" | "Alta" | "Media" | "Baja" | "Descartada";
  Justificacion: string;
}

export interface SnomedCoding {
  Patologia: string;
  SNOMED_ConceptID: string;
  SNOMED_Term: string;
  Tipo_Entidad: string;
}

export interface ResultadoDiagnostico {
  Estado: string;
  Diferenciales: DiagnosticoDiferencial[];
  Analisis: string;
  Proxima_Accion: string;
  Codificacion_Estandarizada: "SNOMED CT";
  Patologias_Codificadas: SnomedCoding[];
  Otros_Hallazgos_Codificados_Opcional?: SnomedCoding[];
}

export interface PartialState {
  datos_identificativos?: DatosIdentificativos;
  
  motivo_consulta?: string;
  
  anamnesis?: Anamnesis;
  
  antecedentes_personales?: AntecedentesPersonales;
  antecedentes_familiares?: string[];
  
  alergias?: AlergiasDetalladas;
  
  farmacos_habituales?: string[];
  
  signos_vitales?: SignosVitales;
  
  examen_fisico?: ExamenFisico;
  
  resultados_laboratorio?: Record<string, any>;
  imagenes?: string[];
  
  diagnostico?: ResultadoDiagnostico;
  
  resumen_clinico?: string;
  
  opciones?: Option[];
}

export const CONSULTATION_STEPS: readonly ConsultationStep[] = [
  "identificacion",
  "motivo_consulta",
  "anamnesis",
  "antecedentes_personales",
  "antecedentes_familiares",
  "alergias_penicilinas",
  "alergias_aines",
  "farmacos",
  "signos_vitales",
  "examen_fisico",
  "diagnostico",
  "resumen",
] as const;

export const ALERGIAS_PENICILINAS = [
  "Penicilina G",
  "Penicilina V",
  "Amoxicilina",
  "Ampicilina",
  "Amoxicilina + Ácido Clavulánico (Augmentine)",
  "Cefalosporinas (reacción cruzada posible)"
] as const;

export const ALERGIAS_AINES = [
  "Ibuprofeno",
  "Diclofenaco",
  "Ácido Acetilsalicílico (Aspirina)",
  "Naproxeno",
  "Ketoprofeno",
  "Piroxicam",
  "Celecoxib",
  "Metamizol (Dipirona)"
] as const;
