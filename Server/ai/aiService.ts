import { GoogleGenerativeAI } from "@google/generative-ai";
import { anamnesisPrompt } from "./anamnesisPrompt.ts";
import { prompts } from "./prompts.ts";
import { buildClinicalPrompt } from "./resumenPrompt.ts";
import { buildDiagnosticoPrompt } from "./diagnosticoPrompt.ts";
import { config } from "../config.ts";
import type { PartialState, ResultadoDiagnostico } from "../session.ts";

const gemini = new GoogleGenerativeAI(config.geminiApiKey);

export async function getGeminiOptions(
  state: PartialState, 
  tipo: string
): Promise<string[]> {
  let prompt = "";

  switch (tipo) {
    case "antecedentes_personales":
      prompt = prompts.antecedentes_personales(state);
      break;
    case "antecedentes_familiares":
      prompt = prompts.antecedentes_familiares(state);
      break;
    case "alergias_penicilinas":
      prompt = prompts.alergias_penicilinas(state);
      break;
    case "alergias_aines":
      prompt = prompts.alergias_aines(state);
      break;
    case "farmacos":
      prompt = prompts.farmacos(state);
      break;
    case "anamnesis":
      prompt = prompts.anamnesis(state, anamnesisPrompt);
      break;
    case "examenFisico":
    case "examen_fisico":
      prompt = prompts.examen_fisico(state);
      break;
    default:
      console.warn(`Tipo no reconocido: ${tipo}`);
      prompt = `Basado en: ${JSON.stringify(state)}\n\nGenera 8 opciones relevantes. Responde con array JSON de strings.`;
      break;
  }

  try {
    const model = gemini.getGenerativeModel({ model: config.geminiModel });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    let cleanedResponse = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    let opciones: string[] = [];

    try {
      const parsed = JSON.parse(cleanedResponse);
      if (Array.isArray(parsed)) {
        opciones = parsed.filter(item => typeof item === 'string' && item.trim() !== '');
      } else {
        throw new Error("Respuesta no es un array");
      }
    } catch (parseError) {
      console.warn(`Fallback a líneas. Error: ${parseError}`);
      opciones = cleanedResponse
        .split("\n")
        .map((line: string) => line.replace(/^\d+\.\s*/, "").replace(/^[-*]\s*/, "").trim())
        .filter((line: string) => line.length > 0);
    }

    if (opciones.length === 0) {
      throw new Error("Gemini no retornó opciones válidas");
    }

    if (tipo === "anamnesis") {
      return opciones;
    } else {
      return opciones.slice(0, config.maxOptions);
    }

  } catch (error) {
    console.error(`Error en Gemini para tipo "${tipo}":`, error);
    throw new Error(`No se pudieron generar opciones: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

export async function getGeminiDiagnostico(state: PartialState): Promise<ResultadoDiagnostico> {
  const prompt = buildDiagnosticoPrompt(state);

  try {
    const model = gemini.getGenerativeModel({ 
      model: config.geminiModel,
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    let cleanedResponse = response
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    const diagnostico: ResultadoDiagnostico = JSON.parse(cleanedResponse);

    if (!diagnostico.Estado || !diagnostico.Diferenciales || !Array.isArray(diagnostico.Diferenciales)) {
      throw new Error("Respuesta no tiene la estructura esperada");
    }

    return diagnostico;

  } catch (error) {
    console.error("Error generando diagnóstico:", error);
    throw new Error(`No se pudo generar diagnóstico: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

export async function getGeminiResumen(state: PartialState): Promise<string> {
  const prompt = buildClinicalPrompt(state);

  try {
    const model = gemini.getGenerativeModel({ model: config.geminiModel });
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    return response.trim();
  } catch (error) {
    console.error("Error generando resumen:", error);
    throw new Error(`No se pudo generar resumen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}
