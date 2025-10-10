import { PartialState } from "../session.ts";
import { ALERGIAS_PENICILINAS, ALERGIAS_AINES } from "../session.ts";

export const prompts = {
  antecedentes_personales: (state: PartialState) => {
    const motivo = state.motivo_consulta || 'no especificado';
    const edad = state.datos_identificativos?.edad || 'edad no especificada';
    const genero = state.datos_identificativos?.genero || 'no especificado';
    
    return `Eres un médico clínico realizando una historia clínica.

Datos del paciente:
- Edad: ${edad} años
- Género: ${genero}
- Motivo de consulta: "${motivo}"

Genera exactamente 8 antecedentes personales RELEVANTES para este caso, incluyendo:
- Enfermedades crónicas previas
- Cirugías anteriores
- Hospitalizaciones
- Hábitos tóxicos (tabaquismo, alcohol)

Formato de respuesta: Array JSON de strings.
Ejemplo: ["Hipertensión arterial", "Colecistectomía (2018)", "Tabaquismo activo (10 cigarrillos/día)", ...]

Responde ÚNICAMENTE con el array JSON, sin explicaciones adicionales.`;
  },

  antecedentes_familiares: (state: PartialState) => {
    const motivo = state.motivo_consulta || 'no especificado';
    
    return `Eres un médico clínico realizando una historia clínica.

Motivo de consulta del paciente: "${motivo}"

Genera exactamente 8 antecedentes familiares RELEVANTES para investigar en este caso, tales como:
- Enfermedades cardiovasculares
- Diabetes
- Cáncer
- Enfermedades autoinmunes
- Trastornos psiquiátricos
- Enfermedades hereditarias

Formato: "Familiar - Condición"
Ejemplo: ["Padre - Infarto agudo de miocardio", "Madre - Diabetes mellitus tipo 2", ...]

Responde ÚNICAMENTE con un array JSON de strings, sin explicaciones adicionales.`;
  },

  alergias_penicilinas: (state: PartialState) => {
    return `Eres un médico clínico investigando alergias farmacológicas.

El paciente está siendo evaluado por: "${state.motivo_consulta || 'consulta médica'}"

De la siguiente lista de antibióticos del grupo de las PENICILINAS, selecciona las 6-8 más relevantes para preguntar:

${ALERGIAS_PENICILINAS.map((med, i) => `${i + 1}. ${med}`).join('\n')}

Puedes agregar otras penicilinas o betalactámicos relevantes si es necesario.

Formato de respuesta: Array JSON de strings con los nombres de los medicamentos.
Ejemplo: ["Penicilina G", "Amoxicilina", "Amoxicilina + Ácido Clavulánico", ...]

Responde ÚNICAMENTE con el array JSON, sin explicaciones adicionales.`;
  },

  alergias_aines: (state: PartialState) => {
    return `Eres un médico clínico investigando alergias farmacológicas.

El paciente está siendo evaluado por: "${state.motivo_consulta || 'consulta médica'}"

De la siguiente lista de ANTIINFLAMATORIOS NO ESTEROIDEOS (AINEs), selecciona los 6-8 más relevantes para preguntar:

${ALERGIAS_AINES.map((med, i) => `${i + 1}. ${med}`).join('\n')}

Puedes agregar otros AINEs comunes si es necesario.

Formato de respuesta: Array JSON de strings con los nombres de los medicamentos.
Ejemplo: ["Ibuprofeno", "Diclofenaco", "Ácido Acetilsalicílico (Aspirina)", ...]

Responde ÚNICAMENTE con el array JSON, sin explicaciones adicionales.`;
  },

  farmacos: (state: PartialState) => {
    const antecedentes = state.antecedentes_personales?.patologicos?.join(', ') || 'no especificados';
    const edad = state.datos_identificativos?.edad || 'edad no especificada';
    
    return `Eres un médico clínico completando la historia farmacológica.

Datos del paciente:
- Edad: ${edad} años
- Antecedentes patológicos: ${antecedentes}
- Motivo de consulta: ${state.motivo_consulta || 'no especificado'}

Genera exactamente 8 medicamentos habituales que un paciente con este perfil podría estar tomando.
Incluye NOMBRE GENÉRICO y DOSIS cuando sea posible.

Formato de respuesta: Array JSON de strings.
Ejemplo: ["Enalapril 10mg (1 vez al día)", "Metformina 850mg (2 veces al día)", "Atorvastatina 20mg (nocturna)", ...]

Responde ÚNICAMENTE con el array JSON, sin explicaciones adicionales.`;
  },

  anamnesis: (state: PartialState, anamnesisTemplate: string) => {
    const motivo = state.motivo_consulta || 'no especificado';
    const edad = state.datos_identificativos?.edad || 'edad no especificada';
    const genero = state.datos_identificativos?.genero || 'no especificado';
    
    return `Eres un médico clínico realizando una anamnesis dirigida.

Datos del paciente:
- Edad: ${edad} años
- Género: ${genero}
- Motivo de consulta: "${motivo}"

Basándote en la siguiente guía de anamnesis clínica, genera las preguntas más relevantes para este caso específico:

${anamnesisTemplate}

IMPORTANTE: Adapta las preguntas al síntoma específico del paciente.
Genera entre 10 y 15 preguntas clave que permitan caracterizar completamente el síntoma.

Formato de respuesta: Array JSON de strings (cada string es una pregunta).
Ejemplo: ["¿Hace cuánto tiempo comenzó el dolor?", "¿Cómo describiría la intensidad del dolor (escala 1-10)?", ...]

Responde ÚNICAMENTE con el array JSON, sin explicaciones adicionales.`;
  },

  examen_fisico: (state: PartialState) => {
    const contexto = {
      motivo_consulta: state.motivo_consulta,
      edad: state.datos_identificativos?.edad,
      genero: state.datos_identificativos?.genero,
      antecedentes: state.antecedentes_personales?.patologicos
    };
    
    return `Eres un médico clínico planificando el examen físico.

Contexto clínico del paciente:
${JSON.stringify(contexto, null, 2)}

Genera exactamente 8 hallazgos o áreas de exploración para el examen físico, organizados por sistemas:
- Aspecto general
- Signos vitales
- Cardiovascular
- Respiratorio
- Abdominal
- Neurológico
- Piel y faneras
- Otros según el motivo de consulta

Formato de respuesta: Array JSON de strings.
Ejemplo: ["Aspecto general: Paciente vigil, orientado, en buen estado general", "Signos vitales: TA, FC, FR, T°, SatO2", ...]

Responde ÚNICAMENTE con el array JSON, sin explicaciones adicionales.`;
  },
};
