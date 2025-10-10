import type { FastifyInstance } from "fastify";
import { sessionManager } from "../utils/sessionManager.ts";

export default function registerCollectEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: { id: string; opciones: string[] } }>(
    "/api/collect",
    {
      schema: {
        tags: ['Consulta'],
        description: "Recibe opciones seleccionadas y las guarda",
        body: {
          type: "object",
          required: ["id", "opciones"],
          properties: {
            id: { type: "string" },
            opciones: { 
              type: "array", 
              items: { type: "string" }
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              partialState: { type: "object" },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const { id, opciones: opcionesSeleccionadas } = req.body;

      if (!Array.isArray(opcionesSeleccionadas)) {
        return reply.status(400).send({
          error: "El campo 'opciones' debe ser un array"
        });
      }

      const controller = sessionManager.getSession(id);

      if (!controller) {
        return reply.status(404).send({
          error: "Sesión no encontrada o expirada"
        });
      }

      try {
        const opciones = opcionesSeleccionadas
          .filter(label => typeof label === 'string' && label.trim() !== '')
          .map(label => ({
            label: label.trim(),
            checked: true
          }));

        controller.savePartialState({ opciones });

        return {
          success: true,
          partialState: controller.getPartialState(),
        };
      } catch (error) {
        fastify.log.error(`Error en /api/collect:`, error);
        return reply.status(500).send({
          error: error instanceof Error ? error.message : 'Error al guardar opciones'
        });
      }
    }
  );
}
