import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import registerEndpoints from './endpoints/index.ts';
import { config } from './config.ts';

const fastify = Fastify({ 
  logger: {
    level: config.nodeEnv === 'production' ? 'info' : 'debug'
  }
});

async function startServer() {
  try {
    await fastify.register(helmet, {
      contentSecurityPolicy: config.nodeEnv === 'production'
    });

    await fastify.register(cors, {
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        if (config.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} no permitido por CORS`), false);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });

    await fastify.register(rateLimit, {
      max: config.rateLimitMax,
      timeWindow: `${config.rateLimitWindowMinutes} minutes`,
      errorResponseBuilder: (request, context) => {
        return {
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Límite de rate excedido. Intenta nuevamente en ${Math.ceil(context.ttl / 1000)} segundos.`
        };
      }
    });

    fastify.get('/health', async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv
      };
    });

    await registerEndpoints(fastify);

    fastify.setErrorHandler((error, request, reply) => {
      fastify.log.error({
        error: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method
      });

      const statusCode = error.statusCode || 500;
      const message = config.nodeEnv === 'production' 
        ? 'Internal Server Error' 
        : error.message;

      reply.status(statusCode).send({
        error: error.name || 'Error',
        message,
        statusCode,
        timestamp: new Date().toISOString()
      });
    });

    await fastify.listen({ 
      port: config.port, 
      host: '0.0.0.0' 
    });

    console.log('\n🚀 ================================');
    console.log(`✅ Servidor Elio iniciado correctamente`);
    console.log(`📍 URL: http://0.0.0.0:${config.port}`);
    console.log(`📚 Docs: http://0.0.0.0:${config.port}/docs`);
    console.log(`🏥 Health: http://0.0.0.0:${config.port}/health`);
    console.log(`🌍 Entorno: ${config.nodeEnv}`);
    console.log('================================\n');

  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n⚠️  Recibida señal SIGINT, cerrando servidor...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Recibida señal SIGTERM, cerrando servidor...');
  await fastify.close();
  process.exit(0);
});

startServer();
