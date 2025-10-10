import type { FastifyInstance } from "fastify";
import { sessionManager } from "../utils/sessionManager.ts";
import { getGeminiResumen } from "../ai/aiService.ts";

export default function registerEndEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: { id: string } }>(
    "/api/end",
    {
      schema: {
        tags: ['Consulta'],
        description: "Finaliza consulta y genera resumen clínico",
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
        const resumen = await getGeminiResumen(partialState);
        controller.savePartialState({ resumen_clinico: resumen });

        const finalState = controller.getPartialState();

        return {
          resumen,
          partialState: finalState,
          sessionClosed: false
        };

      } catch (error) {
        fastify.log.error(`Error en /api/end:`, error);
        return reply.status(500).send({
          error: error instanceof Error ? error.message : 'Error al generar resumen'
        });
      }
    }
  );
}
