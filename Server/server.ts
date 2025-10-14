import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import registerEndpoints from './endpoints/index.ts';
import { config } from './config.ts';

const MESSAGES = {
  SERVER_STARTED: 'Server successfully started',
  SERVER_ERROR: 'Error starting server:',
  SIGNAL_RECEIVED: (signal: string) => `Received ${signal} signal, shutting down server...`,
  SERVER_CLOSED: 'Server closed successfully',
  CLOSE_ERROR: 'Error closing server:',
  RATE_LIMIT_EXCEEDED: (ttl: number) => 
    `Rate limit exceeded. Retry in ${Math.ceil(ttl / 1000)} seconds.`,
  UNHANDLED_REJECTION: 'Unhandled Rejection at:',
} as const;

const fastify = Fastify({ 
  logger: {
    level: config.logLevel
  }
});

async function startServer() {
  try {
    if (config.enableHelmet) {
      await fastify.register(helmet, {
        contentSecurityPolicy: config.contentSecurityPolicy,
        global: true
      });
    }

    await fastify.register(cors, {
      origin: config.nodeEnv === 'development' ? true : config.allowedOrigins,
      credentials: true,
      methods: [...config.allowedMethods]
    });

    await fastify.register(rateLimit, {
      max: config.rateLimitMax,
      timeWindow: `${config.rateLimitWindowMinutes} minutes`,
      errorResponseBuilder: (request, context) => {
        return {
          statusCode: 429,
          error: 'Too Many Requests',
          message: MESSAGES.RATE_LIMIT_EXCEEDED(context.ttl)
        };
      }
    });

    fastify.get('/health', async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
        version: process.env.npm_package_version || '2.0.0'
      };
    });

    await registerEndpoints(fastify);

    fastify.setErrorHandler((error, request, reply) => {
      fastify.log.error({
        error: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString()
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
      host: config.host
    });

    console.log('================================');
    console.log(`[SERVER] ${MESSAGES.SERVER_STARTED}`);
    console.log(`[SERVER] URL: http://${config.host}:${config.port}`);
    console.log(`[SERVER] Docs: http://${config.host}:${config.port}/docs`);
    console.log(`[SERVER] Health: http://${config.host}:${config.port}/health`);
    console.log(`[SERVER] Environment: ${config.nodeEnv}`);
    console.log(`[SERVER] CORS: ${config.allowedOrigins.join(', ')}`);
    console.log('================================');

  } catch (err) {
    console.error(`[SERVER] ${MESSAGES.SERVER_ERROR}`, err);
    process.exit(1);
  }
}

const shutdown = async (signal: string) => {
  console.log(`\n[SERVER] ${MESSAGES.SIGNAL_RECEIVED(signal)}`);
  try {
    await fastify.close();
    console.log(`[SERVER] ${MESSAGES.SERVER_CLOSED}`);
    process.exit(0);
  } catch (err) {
    console.error(`[SERVER] ${MESSAGES.CLOSE_ERROR}`, err);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[SERVER] ${MESSAGES.UNHANDLED_REJECTION}`, promise, 'reason:', reason);
});

startServer();
