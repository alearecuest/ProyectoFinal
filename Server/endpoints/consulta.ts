import type { FastifyInstance } from "fastify";
import type { PartialState } from "../session.ts";
import { sessionManager } from "../utils/sessionManager.ts";

export default function registerConsultaEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: PartialState; Params: { id: string } }>(
    "/consulta/:id",
    {
      schema: {
        tags: ['Consulta'],
        description: "Actualiza los datos de la consulta y avanza al siguiente paso",
        params: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID de la sesión" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          description: "Datos parciales de la consulta a actualizar",
          properties: {
            motivo_consulta: { type: "string" },
            antecedentes_personales: {
              type: "array",
              items: { type: "string" }
            },
            alergias: {
              type: "array",
              items: { type: "string" }
            },
            farmacos_habituales: {
              type: "array",
              items: { type: "string" }
            },
            examen_fisico: { type: "string" },
            resumen_clinico: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              pasoActual: { type: "string" },
              partialState: { type: "object" },
            },
          },
          404: {
            type: "object",
            properties: { error: { type: "string" } },
          },
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
        description: "Obtiene el estado actual de la consulta",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              pasoActual: { type: "string" },
              partialState: { type: "object" },
            },
          },
          404: {
            type: "object",
            properties: { error: { type: "string" } },
          },
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

  fastify.get("/consulta-test", {
    schema: {
      tags: ['Consulta'],
      description: "Endpoint de testing para verificar que el servidor está funcionando",
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
            status: { type: "string" },
            timestamp: { type: "string" },
            activeSessions: { type: "number" }
          }
        }
      }
    }
  }, async (req, reply) => {
    return {
      message: "Backend Elio funcionando correctamente",
      status: "ok",
      timestamp: new Date().toISOString(),
      activeSessions: sessionManager.getSessionCount()
    };
  });
}
