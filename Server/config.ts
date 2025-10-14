import dotenv from "dotenv";

dotenv.config();

const MIN_PORT = 1;
const MAX_PORT = 65535;
const MIN_SESSION_TIMEOUT = 1;
const DEFAULT_PORT = 10000;
const DEFAULT_SESSION_TIMEOUT = 30;
const DEFAULT_CLEANUP_INTERVAL = 5;
const DEFAULT_RATE_LIMIT_MAX = 100;
const DEFAULT_RATE_LIMIT_WINDOW = 15;
const DEFAULT_MAX_OPTIONS = 8;
const DEFAULT_HOST = '0.0.0.0';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:4200',
  'http://localhost:5173'
];

const ALLOWED_HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'] as const;

const ERROR_MESSAGES = {
  MISSING_ENV_VARS: (vars: string[]) => 
    `Missing required environment variables: ${vars.join(", ")}\n` +
    `Please create a .env file based on .env.example`,
  INVALID_PORT: (port: number) => 
    `Invalid port: ${port}. Must be between ${MIN_PORT} and ${MAX_PORT}.`,
  INVALID_SESSION_TIMEOUT: () => 
    `SESSION_TIMEOUT_MINUTES must be greater than 0.`,
  INVALID_CLEANUP_INTERVAL: () =>
    `SESSION_CLEANUP_INTERVAL_MINUTES must be greater than 0.`,
  INVALID_RATE_LIMIT: () =>
    `RATE_LIMIT_MAX must be greater than 0.`,
} as const;

const requiredEnvVars = ["GEMINI_API_KEY"];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(ERROR_MESSAGES.MISSING_ENV_VARS(missingEnvVars));
}

export const config = {
  port: parseInt(process.env.PORT || String(DEFAULT_PORT), 10),
  host: process.env.HOST || DEFAULT_HOST,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : DEFAULT_ALLOWED_ORIGINS,
  allowedMethods: ALLOWED_HTTP_METHODS,
  
  sessionTimeoutMinutes: parseInt(
    process.env.SESSION_TIMEOUT_MINUTES || String(DEFAULT_SESSION_TIMEOUT), 
    10
  ),
  sessionCleanupIntervalMinutes: parseInt(
    process.env.SESSION_CLEANUP_INTERVAL_MINUTES || String(DEFAULT_CLEANUP_INTERVAL), 
    10
  ),
  
  rateLimitMax: parseInt(
    process.env.RATE_LIMIT_MAX || String(DEFAULT_RATE_LIMIT_MAX), 
    10
  ),
  rateLimitWindowMinutes: parseInt(
    process.env.RATE_LIMIT_WINDOW_MINUTES || String(DEFAULT_RATE_LIMIT_WINDOW), 
    10
  ),
  
  geminiApiKey: process.env.GEMINI_API_KEY!,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  maxOptions: parseInt(process.env.MAX_OPTIONS || String(DEFAULT_MAX_OPTIONS), 10),
  useMockAI: process.env.USE_MOCK_AI === 'true',
  
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  enableHelmet: process.env.ENABLE_HELMET !== 'false',
  
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
} as const;

if (config.port < MIN_PORT || config.port > MAX_PORT) {
  throw new Error(ERROR_MESSAGES.INVALID_PORT(config.port));
}

if (config.sessionTimeoutMinutes < MIN_SESSION_TIMEOUT) {
  throw new Error(ERROR_MESSAGES.INVALID_SESSION_TIMEOUT());
}

if (config.sessionCleanupIntervalMinutes < MIN_SESSION_TIMEOUT) {
  throw new Error(ERROR_MESSAGES.INVALID_CLEANUP_INTERVAL());
}

if (config.rateLimitMax < 1) {
  throw new Error(ERROR_MESSAGES.INVALID_RATE_LIMIT());
}

console.log('[CONFIG] Configuration loaded successfully');
console.log(`[CONFIG] Environment: ${config.nodeEnv}`);
console.log(`[CONFIG] Host: ${config.host}:${config.port}`);
console.log(`[CONFIG] AI Model: ${config.geminiModel}`);
console.log(`[CONFIG] Mock Mode: ${config.useMockAI ? 'ENABLED' : 'Disabled'}`);
console.log(`[CONFIG] CORS Origins: ${config.allowedOrigins.join(', ')}`);

export const HTTP_METHODS = ALLOWED_HTTP_METHODS;
export const DEFAULT_ORIGINS = DEFAULT_ALLOWED_ORIGINS;

