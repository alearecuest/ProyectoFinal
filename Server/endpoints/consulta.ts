import type { FastifyInstance } from "fastify";
import type { PartialState } from "../session.ts";
import { sessionManager } from "../utils/sessionManager.ts";

export default function registerConsultaEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: PartialState; Params: { id: string } }>(
    "/consulta/:id",
    {
      schema: {
        tags: ['Consulta'],
        description: "Actualiza datos de consulta y avanza",
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
        controller.savePartialState(req.body);
        controller.nextStep();

        return {
          pasoActual: controller.getCurrentStep(),
          partialState: controller.getPartialState(),
        };
      } catch (error) {
        fastify.log.error(`Error en POST /consulta/${id}:`, error);
        return reply.status(500).send({
          error: error instanceof Error ? error.message : 'Error al actualizar consulta'
        });
      }
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/consulta/:id",
    {
      schema: {
        tags: ['Consulta'],
        description: "Obtiene estado actual de consulta",
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

      return {
        pasoActual: controller.getCurrentStep(),
        partialState: controller.getPartialState(),
      };
    }
  );

  fastify.get("/consulta-test", async (req, reply) => {
    return {
      message: "Backend Elio funcionando correctamente",
      status: "ok",
      timestamp: new Date().toISOString(),
      activeSessions: sessionManager.getSessionCount()
    };
  });
}
