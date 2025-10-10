export const anamnesisPrompt = `
GUÍA DE ANAMNESIS MÉDICA - Adaptada al contexto de Uruguay
Estructura de preguntas dirigidas para consulta ambulatoria

**IMPORTANTE**: Adaptar las preguntas al motivo de consulta específico del paciente.

1. INICIO DEL CUADRO
   - ¿Cuándo comenzó el problema? (fecha y hora específica si es agudo)
   - ¿Cómo fue el inicio: brusco o gradual?
   - ¿Hace cuánto tiempo presenta los síntomas? (horas / días / semanas / meses / años)
   - ¿Hubo algún evento desencadenante? (esfuerzo, comida, estrés, traumatismo)

2. EVOLUCIÓN Y PATRÓN TEMPORAL
   - ¿Cómo ha evolucionado desde que comenzó? (progresivo / estable / intermitente / en mejoría / en empeoramiento)
   - ¿Es continuo o tiene períodos de remisión?
   - ¿Hay un patrón horario? (matutino, vespertino, nocturno)
   - ¿Ha recibido algún tratamiento? ¿Mejoró, empeoró o no hubo cambios?

3. LOCALIZACIÓN Y CARACTERÍSTICAS ESPACIALES
   - ¿Dónde siente el síntoma principal? (señalar con el dedo si es dolor)
   - ¿Se irradia hacia algún otro lugar? ¿Hacia dónde?
   - ¿Es siempre en el mismo sitio o cambia de localización?
   - ¿Es focal (puntual) o difuso?

4. CARACTERÍSTICAS DEL SÍNTOMA (especialmente si es DOLOR)
   - ¿Cómo lo describiría? (punzante / opresivo / cólico / urente / pulsátil / difuso / lancinante)
   - ¿Qué intensidad tiene en una escala del 1 al 10? (1 = mínimo, 10 = máximo imaginable)
   - ¿Cuánto dura cada episodio? (segundos / minutos / horas / constante)
   - ¿Qué lo alivia? (reposo, posición, medicación, comida)
   - ¿Qué lo empeora? (movimiento, respiración, comida, esfuerzo, estrés)

5. SÍNTOMAS ASOCIADOS (revisar por sistemas)
   - Generales: ¿Fiebre? ¿Escalofríos? ¿Astenia? ¿Pérdida de peso? ¿Sudoración nocturna?
   - Cardiovascular: ¿Palpitaciones? ¿Dolor torácico? ¿Disnea? ¿Edemas en piernas?
   - Respiratorio: ¿Tos? ¿Expectoración? ¿Disnea? ¿Dolor torácico con la respiración?
   - Digestivo: ¿Náuseas? ¿Vómitos? ¿Diarrea? ¿Constipación? ¿Dolor abdominal?
   - Urinario: ¿Disuria? ¿Polaquiuria? ¿Hematuria? ¿Cambios en color de orina?
   - Neurológico: ¿Cefalea? ¿Mareos? ¿Vértigo? ¿Alteraciones visuales? ¿Parestesias?
   - Otros: Especificar según motivo de consulta

6. FACTORES DESENCADENANTES Y CONTEXTO
   - ¿Hubo algún factor que precipitó los síntomas? 
     * Traumatismo
     * Ejercicio físico
     * Alimento específico
     * Medicamento nuevo
     * Estrés emocional
     * Exposición ambiental (frío, calor, humedad)
     * Picadura de insecto (considerar dengue en verano en Uruguay)
   - ¿Se relaciona con alguna actividad específica?
   - ¿Varía con el momento del día?
   - ¿Varía con las comidas?

7. ANTECEDENTES RECIENTES Y CONTACTOS
   - ¿Alguien cercano (familia, trabajo) presentó síntomas similares?
   - ¿Ha tenido cuadros parecidos antes? ¿Cuándo? ¿Cómo se resolvieron?
   - ¿Tuvo infecciones recientes? (respiratoria, urinaria, gastrointestinal)
   - ¿Ha viajado recientemente? ¿A dónde? (considerar enfermedades endémicas)
   - ¿Exposición a mosquitos? (dengue, zika, chikungunya - relevante en Uruguay)
   - ¿Contacto con animales? (leptospirosis, brucelosis)

8. REPERCUSIÓN FUNCIONAL Y CALIDAD DE VIDA
   - ¿Le impide realizar sus actividades habituales?
   - ¿Tuvo que quedarse en cama o faltar al trabajo/estudio?
   - ¿Ha afectado su sueño?
   - ¿Ha afectado su apetito?
   - ¿Ha afectado su estado de ánimo?

9. TRATAMIENTOS PREVIOS Y AUTOMEDICACIÓN
   - ¿Tomó alguna medicación para aliviarlo? ¿Cuál? ¿Dosis?
   - ¿Le hizo efecto? ¿Cuánto tiempo después de tomarlo?
   - ¿Recibió atención médica antes de esta consulta? ¿Dónde?
   - ¿Le indicaron estudios? ¿Tiene los resultados?
   - ¿Usa remedios caseros o medicina alternativa?

10. SÍNTOMAS DE ALARMA (Red Flags) - Según corresponda
    - Fiebre alta persistente (>38.5°C por más de 3 días)
    - Sangrados (hemoptisis, hematemesis, melena, hematuria, hemorragia)
    - Dificultad respiratoria severa o disnea de reposo
    - Dolor torácico intenso, opresivo, con irradiación
    - Pérdida de peso no intencional significativa (>5% en 1 mes)
    - Pérdida de conciencia, síncope o lipotimia
    - Convulsiones
    - Alteraciones neurológicas agudas (paresia, parestesias, afasia, alteración visual súbita)
    - Deshidratación severa (en contexto de vómitos/diarrea)
    - Ictericia (piel/ojos amarillos)
    - Signos de sangrado activo o petequias (considerar dengue)

**CONSIDERACIONES ESPECIALES PARA URUGUAY**:
- En época de verano (diciembre-marzo): preguntar específicamente por picaduras de mosquitos, fiebre, dolor retroocular, exantema → DENGUE
- En época de invierno (junio-agosto): preguntar por contactos con casos de gripe, COVID-19, infecciones respiratorias
- En pacientes rurales o con exposición a agua: considerar leptospirosis
- En pacientes con ganado: considerar brucelosis
- Acceso a servicios de salud: ASSE, Mutualista, Seguros privados → afecta derivación y estudios

**OUTPUT ESPERADO**: 
Generar entre 10 y 15 preguntas clave adaptadas al motivo de consulta específico del paciente, priorizando las más relevantes para el diagnóstico diferencial.
`;
