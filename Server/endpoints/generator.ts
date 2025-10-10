import type { FastifyInstance } from "fastify";
import { sessionManager } from "../utils/sessionManager.ts";
import { getGeminiOptions } from "../ai/aiService.ts";

export default function registerGeneratorEndpoint(fastify: FastifyInstance) {
  fastify.get<{ Params: { id: string } }>(
    "/generator/:id",
    {
      schema: {
        tags: ['IA'],
        description: "Genera opciones para el paso actual",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      const controller = sessionManager.getSession(id);

      if (!controller) {
        return reply.status(404).send({
          error: "Sesión no encontrada o expirada"
        });
      }

      try {
        const tipo = controller.getCurrentStep();
        const state = controller.getPartialState();

        const opcionesRaw = await getGeminiOptions(state, tipo);

        if (!opcionesRaw || !Array.isArray(opcionesRaw) || opcionesRaw.length === 0) {
          return reply.status(500).send({
            error: "No se pudieron generar opciones."
          });
        }

        const opciones = opcionesRaw.map(label => ({
          label,
          checked: false
        }));

        return {
          opciones,
          pasoActual: tipo
        };

      } catch (error) {
        fastify.log.error(`Error en /generator/${id}:`, error);
        return reply.status(500).send({
          error: error instanceof Error ? error.message : 'Error al generar opciones'
        });
      }
    }
  );
}
