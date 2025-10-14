import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import registerStartEndpoint from "./start.ts";
import registerCollectEndpoint from "./collect.ts";
import registerConsultaEndpoint from "./consulta.ts";
import registerEndEndpoint from "./end.ts";
import registerGeneratorEndpoint from "./generator.ts";
import registerDiagnosticoEndpoint from "./diagnostico.ts";
import { config } from "../config.ts";

export default async function registerEndpoints(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Elio API",
        version: "2.0.0",
        description: "API para sistema de consultas médicas con IA y diagnóstico diferencial SNOMED CT",
        contact: {
          name: "Elio Team",
          url: "https://github.com/alearecuest/ProyectoFinal"
        }
      },
      servers: [
        {
          url: config.nodeEnv === 'production'
            ? `https://proyectofinal-backend.onrender.com`
            : `http://127.0.0.1:${config.port}`,
          description: config.nodeEnv === 'production' ? 'Producción' : 'Desarrollo'
        }
      ],
      tags: [
        { name: 'Sesiones', description: 'Manejo de sesiones de consulta' },
        { name: 'Consulta', description: 'Operaciones de consulta médica' },
        { name: 'IA', description: 'Generación de contenido con IA' },
        { name: 'Diagnóstico', description: 'Diagnóstico diferencial y SNOMED CT' }
      ]
    }
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true
    },
    staticCSP: false
  });

  registerStartEndpoint(fastify);
  registerCollectEndpoint(fastify);
  registerConsultaEndpoint(fastify);
  registerDiagnosticoEndpoint(fastify);
  registerEndEndpoint(fastify);
  registerGeneratorEndpoint(fastify);

  console.log("Endpoints registrados correctamente");
}
