import type { FastifyInstance } from "fastify";
import { sessionManager } from "../utils/sessionManager.ts";
import { getGeminiDiagnostico } from "../ai/aiService.ts";

export default function registerDiagnosticoEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: { id: string } }>(
    "/api/diagnostico",
    {
      schema: {
        tags: ['IA', 'Diagnóstico'],
        description: "Genera diagnóstico diferencial con codificación SNOMED CT basado en datos clínicos recolectados",
        body: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "ID de la sesión" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              Estado: { type: "string" },
              Diferenciales: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Patologia: { type: "string" },
                    Probabilidad: { type: "string" },
                    Justificacion: { type: "string" }
                  }
                }
              },
              Analisis: { type: "string" },
              Proxima_Accion: { type: "string" },
              Codificacion_Estandarizada: { type: "string" },
              Patologias_Codificadas: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Patologia: { type: "string" },
                    SNOMED_ConceptID: { type: "string" },
                    SNOMED_Term: { type: "string" },
                    Tipo_Entidad: { type: "string" }
                  }
                }
              }
            },
          },
          404: {
            type: "object",
            properties: { error: { type: "string" } },
          },
          500: {
            type: "object",
            properties: { error: { type: "string" } },
          }
        },
      },
    },
    async (req, reply) => {
      const { id } = req.body;
      const controller = sessionManager.getSession(id);

      if (!controller) {
        return reply.status(404).send({
          error: "Sesión no encontrada o expirada"
        });
      }

      try {
        const partialState = controller.getPartialState();

        if (!partialState.motivo_consulta) {
          return reply.status(400).send({
            error: "Faltan datos clínicos mínimos. Se requiere al menos el motivo de consulta."
          });
        }

        const diagnostico = await getGeminiDiagnostico(partialState);

        controller.savePartialState({ diagnostico });

        return diagnostico;

      } catch (error) {
        fastify.log.error(`Error en /api/diagnostico para sesión ${id}:`, error);
        
        return reply.status(500).send({
          error: error instanceof Error ? error.message : 'Error al generar diagnóstico'
        });
      }
    }
  );
}
