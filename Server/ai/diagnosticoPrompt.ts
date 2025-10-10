import { PartialState } from "../session.ts";

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
  
  "INPUT": ${JSON.stringify(inputData, null, 2)},
  
  "OUTPUT_REQUERIDO": {
    "Estado": "string (Resumen del estado actual del caso clínico)",
    "Diferenciales": [
      {
        "Patología": "string",
        "Probabilidad": "string ('Muy Alta' | 'Alta' | 'Media' | 'Baja' | 'Descartada')",
        "Justificación": "string (razonamiento clínico basado en los datos del INPUT y la epidemiología uruguaya)"
      }
    ],
    "Análisis": "string (síntesis del razonamiento médico y correlación clínica-patológica)",
    "Próxima_Acción": "string (sugerencia clínica: estudios complementarios, observación, derivación, etc., según contexto Uruguay)",
    "Codificación_Estandarizada": "SNOMED CT",
    "Patologías_Codificadas": [
      {
        "Patología": "string",
        "SNOMED_ConceptID": "string (código numérico)",
        "SNOMED_Term": "string (término SNOMED CT)",
        "Tipo_Entidad": "string ('Trastorno' | 'Hallazgo' | 'Procedimiento' | 'Situación')"
      }
    ],
    "Otros_Hallazgos_Codificados_Opcional": []
  },
  
  "VALIDACIÓN": {
    "Consistencia": "Verificar coherencia entre datos, diagnóstico y codificación SNOMED",
    "Confidencialidad": "No incluir datos personales identificables",
    "Contexto_Local": "Considerar prevalencia y guías clínicas de Uruguay"
  }
}

IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON del OUTPUT_REQUERIDO. NO incluyas el prompt. Usa comillas dobles. Asegura JSON válido.`;
}
