import { PartialState } from "../session.ts";

/**
 * Construye el prompt de diagnóstico diferencial basado en tu estructura optimizada
 * Contexto: Uruguay (T≈0)
 * Output: JSON con diagnósticos diferenciales y codificación SNOMED CT
 */
export function buildDiagnosticoPrompt(state: PartialState): string {
  const timestamp = new Date().toISOString();
  
  const inputData = {
    fecha_consulta: timestamp,
    
    datos_demograficos: {
      edad: state.datos_identificativos?.edad || "no especificada",
      genero: state.datos_identificativos?.genero || "no especificado"
    },
    
    motivo_consulta: state.motivo_consulta || "no especificado",
    
    anamnesis: state.anamnesis || {},
    
    signos_vitales: state.signos_vitales || {},
    
    sintomas: state.anamnesis?.sintomas_asociados || [],
    
    antecedentes: {
      personales: state.antecedentes_personales || {},
      familiares: state.antecedentes_familiares || []
    },
    
    alergias: state.alergias || {},
    
    farmacos_habituales: state.farmacos_habituales || [],
    
    examen_fisico: state.examen_fisico || {},
    
    resultados: state.resultados_laboratorio || {},
    
    imagenes_opcionales: state.imagenes || []
  };

  return `{
  "ROL": "SADC/Médico especialista",
  "TONO": "Formal, Profesional",
  "LÓGICA": "Rigor clínico y epidemiológico, con foco en el **Contexto de Uruguay** (T≈0)",
  "FORMATO": "JSON estricto (sin texto adicional)",
  "TAREA": "Diagnóstico iterativo, codificación estandarizada y consideración de **Guías Clínicas Uruguayas** (si aplica).",
  
  "CONTEXTO_URUGUAY": {
    "Prevalencias_Relevantes": [
      "Hipertensión arterial (prevalencia ~30% en adultos)",
      "Diabetes mellitus tipo 2 (prevalencia ~8-10%)",
      "Enfermedades cardiovasculares (principal causa de muerte)",
      "Infecciones respiratorias agudas (alta consulta en invierno)",
      "Dengue (brotes estacionales en verano)",
      "Obesidad y sobrepeso (prevalencia ~60% en adultos)",
      "Tabaquismo (prevalencia ~20-25%)",
      "Enfermedad renal crónica",
      "EPOC",
      "Trastornos de salud mental (ansiedad, depresión)"
    ],
    "Guias_Clinicas_Relevantes": [
      "Guías de práctica clínica del MSP Uruguay",
      "Guías de la Sociedad Uruguaya de Cardiología",
      "Guías de la Sociedad Uruguaya de Medicina Interna",
      "Formulario Terapéutico de Medicamentos (FTM) - Uruguay"
    ]
  },
  
  "INPUT": ${JSON.stringify(inputData, null, 2)},
  
  "INSTRUCCIONES_ESPECÍFICAS": {
    "1_Análisis_Epidemiológico": "Considera la prevalencia de enfermedades en Uruguay y el perfil epidemiológico del paciente (edad, género, antecedentes).",
    "2_Diagnósticos_Diferenciales": "Genera entre 3 y 6 diagnósticos diferenciales ordenados por probabilidad, justificando cada uno con los datos clínicos disponibles.",
    "3_Codificación_SNOMED": "Para cada diagnóstico diferencial de probabilidad Alta o Muy Alta, proporciona el código SNOMED CT correspondiente.",
    "4_Próxima_Acción": "Sugiere estudios complementarios, observación, derivación o tratamiento empírico según guías uruguayas y disponibilidad local.",
    "5_Confidencialidad": "NO incluir datos personales identificables. Solo usar edad, género y datos clínicos anonimizados."
  },
  
  "OUTPUT_REQUERIDO": {
    "Estado": "string (Resumen del estado actual del caso clínico en 1-2 oraciones)",
    "Diferenciales": [
      {
        "Patología": "string (Nombre de la patología usando terminología médica estándar)",
        "Probabilidad": "string ('Muy Alta' | 'Alta' | 'Media' | 'Baja' | 'Descartada')",
        "Justificación": "string (Razonamiento clínico basado en los datos del INPUT y la epidemiología uruguaya. Mínimo 2-3 oraciones.)"
      }
    ],
    "Análisis": "string (Síntesis del razonamiento médico, correlación clínica-patológica y consideraciones del contexto uruguayo. Mínimo 3-4 oraciones.)",
    "Próxima_Acción": "string (Sugerencia clínica concreta: estudios complementarios específicos, observación por X horas, derivación a especialista, tratamiento empírico según guías uruguayas, etc.)",
    "Codificación_Estandarizada": "SNOMED CT",
    "Patologías_Codificadas": [
      {
        "Patología": "string (Diagnóstico principal o el diferencial de mayor probabilidad)",
        "SNOMED_ConceptID": "string (Código numérico de SNOMED CT - 6-18 dígitos)",
        "SNOMED_Term": "string (Término preferente de SNOMED CT en español si está disponible, sino en inglés)",
        "Tipo_Entidad": "string ('Trastorno' | 'Hallazgo' | 'Procedimiento' | 'Situación con contexto explícito' | etc.)"
      }
    ],
    "Otros_Hallazgos_Codificados_Opcional": [
      {
        "Hallazgo": "string (Hallazgo clínico significativo: síntoma principal, signo objetivo, etc.)",
        "SNOMED_ConceptID": "string",
        "SNOMED_Term": "string"
      }
    ]
  },
  
  "VALIDACIÓN": {
    "Consistencia": "Verificar coherencia interna entre datos clínicos, diagnóstico diferencial y codificación SNOMED.",
    "Confidencialidad": "No incluir datos personales identificables del paciente.",
    "Contexto_Local": "Asegurar que los diagnósticos diferenciales y las recomendaciones de manejo reflejen la prevalencia y guías clínicas habituales de Uruguay.",
    "Calidad_SNOMED": "Verificar que los códigos SNOMED CT sean válidos y correspondan a la terminología correcta."
  },
  
  "EJEMPLO_OUTPUT": {
    "Estado": "Paciente de 45 años con cuadro de dolor torácico opresivo de 2 horas de evolución, con factores de riesgo cardiovascular.",
    "Diferenciales": [
      {
        "Patología": "Síndrome coronario agudo",
        "Probabilidad": "Muy Alta",
        "Justificación": "Dolor torácico opresivo con irradiación a brazo izquierdo, asociado a diaforesis y náuseas. Factores de riesgo: HTA, tabaquismo, dislipidemia. Alta prevalencia de enfermedad cardiovascular en Uruguay."
      },
      {
        "Patología": "Pericarditis aguda",
        "Probabilidad": "Media",
        "Justificación": "El dolor torácico podría ser de origen pericárdico si empeora con la inspiración profunda o decúbito. Requiere ECG y valoración de roce pericárdico."
      },
      {
        "Patología": "Reflujo gastroesofágico severo",
        "Probabilidad": "Baja",
        "Justificación": "Aunque puede presentarse con dolor retroesternal, la irradiación a brazo izquierdo y síntomas vegetativos hacen menos probable esta etiología."
      }
    ],
    "Análisis": "Se trata de un cuadro de dolor torácico agudo en paciente con múltiples factores de riesgo cardiovascular. La presentación clínica es altamente sugestiva de síndrome coronario agudo. La alta prevalencia de enfermedad cardiovascular en Uruguay y el perfil del paciente refuerzan esta hipótesis diagnóstica.",
    "Próxima_Acción": "1) ECG de 12 derivaciones URGENTE. 2) Troponinas seriadas (0h, 3h). 3) Radiografía de tórax. 4) Aspirina 300mg VO inmediato (si no hay contraindicación). 5) Considerar derivación a centro con hemodinamia según resultado de ECG y troponinas. 6) Aplicar score GRACE para estratificación de riesgo.",
    "Codificación_Estandarizada": "SNOMED CT",
    "Patologías_Codificadas": [
      {
        "Patología": "Síndrome coronario agudo",
        "SNOMED_ConceptID": "394659003",
        "SNOMED_Term": "Acute coronary syndrome",
        "Tipo_Entidad": "Trastorno"
      }
    ],
    "Otros_Hallazgos_Codificados_Opcional": [
      {
        "Hallazgo": "Dolor torácico",
        "SNOMED_ConceptID": "29857009",
        "SNOMED_Term": "Chest pain"
      }
    ]
  }
}

**IMPORTANTE**: 
- Responde ÚNICAMENTE con el objeto JSON del OUTPUT_REQUERIDO.
- NO incluyas el prompt completo en tu respuesta.
- NO agregues texto adicional antes o después del JSON.
- Asegúrate de que el JSON sea válido y parseable.
- Usa comillas dobles para strings.
- Los códigos SNOMED CT deben ser numéricos y válidos.

Genera ahora el diagnóstico diferencial basado en el INPUT proporcionado.`;
}