import { PartialState } from "../session.ts";

export function buildClinicalPrompt(state: PartialState): string {
  const timestamp = new Date().toISOString();
  
  return `Eres un médico clínico profesional redactando una nota médica electrónica.

INSTRUCCIONES CRÍTICAS:
- Usa ÚNICAMENTE la información proporcionada a continuación
- NO inventes ni agregues datos que no estén presentes
- Si falta información en algún campo, simplemente omítelo o indica "No registrado"
- Mantén un tono profesional y clínico
- Usa terminología médica apropiada
- Organiza la información de forma clara y estructurada

ESTRUCTURA DE LA NOTA CLÍNICA:

1. DATOS DE LA CONSULTA
   - Fecha y hora: ${timestamp}

2. MOTIVO DE CONSULTA
   ${state.motivo_consulta ? `"${state.motivo_consulta}"` : 'No registrado'}

3. ANTECEDENTES PERSONALES
   ${state.antecedentes_personales && state.antecedentes_personales.length > 0 
     ? state.antecedentes_personales.map(ant => `   • ${ant}`).join('\n')
     : '   • Sin antecedentes registrados'}

4. ALERGIAS
   ${state.alergias && state.alergias.length > 0
     ? state.alergias.map(alergia => `   • ${alergia}`).join('\n')
     : '   • No refiere alergias conocidas'}

5. MEDICACIÓN HABITUAL
   ${state.farmacos_habituales && state.farmacos_habituales.length > 0
     ? state.farmacos_habituales.map(farmaco => `   • ${farmaco}`).join('\n')
     : '   • No refiere medicación habitual'}

6. EXAMEN FÍSICO
   ${state.examen_fisico || 'Pendiente de registro'}

7. OPCIONES SELECCIONADAS
   ${state.opciones && state.opciones.length > 0
     ? state.opciones
         .filter(opt => opt.checked)
         .map(opt => `   • ${opt.label}`)
         .join('\n')
     : '   • Sin opciones seleccionadas'}

8. RESUMEN CLÍNICO
   ${state.resumen_clinico || 'Pendiente de elaboración'}

---

TAREA:
Redacta una nota clínica profesional y concisa basada en la información anterior.
Organiza los datos de forma coherente, destaca hallazgos relevantes, y finaliza con un breve párrafo de impresión clínica y plan si la información lo permite.

NO agregues información que no esté en los datos proporcionados.
`;
}
