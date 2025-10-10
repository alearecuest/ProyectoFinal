import type { FastifyInstance } from "fastify";
import { sessionManager } from "../utils/sessionManager.ts";
import { getGeminiDiagnostico } from "../ai/aiService.ts";

export default function registerDiagnosticoEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: { id: string } }>(
    "/api/diagnostico",
    {
      schema: {
        tags: ['IA', 'Diagnóstico'],
        description: "Genera diagnóstico diferencial con SNOMED CT",
        body: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
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
            error: "Faltan datos clínicos mínimos."
          });
        }

        const diagnostico = await getGeminiDiagnostico(partialState);
        controller.savePartialState({ diagnostico });

        return diagnostico;

      } catch (error) {
        fastify.log.error(`Error en /api/diagnostico:`, error);
        return reply.status(500).send({
          error: error instanceof Error ? error.message : 'Error al generar diagnóstico'
        });
      }
    }
  );
}
