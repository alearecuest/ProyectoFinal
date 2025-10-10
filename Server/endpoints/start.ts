import type { FastifyInstance } from "fastify";
import { randomUUID } from 'crypto';
import { sessionManager } from "../utils/sessionManager.ts";
import { getGeminiOptions } from "../ai/aiService.ts";

export default function registerStartEndpoint(fastify: FastifyInstance) {
  fastify.post<{ Body: { motivo_consulta: string } }>(
    "/start",
    {
      schema: {
        tags: ['Sesiones'],
        description: "Crea una nueva sesión de consulta y genera opciones iniciales",
        body: {
          type: "object",
          required: ["motivo_consulta"],
          properties: {
            motivo_consulta: {
              type: "string",
              minLength: 3,
              description: "Motivo de la consulta del paciente"
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              patientID: { type: "string" },
              pasoActual: { type: "string" },
              opciones: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    checked: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const { motivo_consulta } = req.body;

      if (!motivo_consulta || motivo_consulta.trim() === "") {
        return reply.status(400).send({
          error: "El motivo de consulta es requerido y no puede estar vacío"
        });
      }

      try {
        const patientID = randomUUID();
        const controller = sessionManager.createSession(patientID);

        const opcionesGemini = await getGeminiOptions(
          { motivo_consulta },
          "antecedentes_personales"
        );

        if (!opcionesGemini || !Array.isArray(opcionesGemini) || opcionesGemini.length === 0) {
          sessionManager.deleteSession(patientID);
          return reply.status(500).send({
            error: "No se pudieron generar opciones. Intenta nuevamente."
          });
        }

        const opciones = opcionesGemini.map(label => ({
          label,
          checked: false
        }));

        controller.savePartialState({ motivo_consulta, opciones });

        return {
          patientID,
          pasoActual: controller.getCurrentStep(),
          opciones
        };

      } catch (error) {
        fastify.log.error('Error en /start:', error);
        return reply.status(500).send({
          error: error instanceof Error ? error.message : 'Error al iniciar la consulta'
        });
      }
    }
  );
}
