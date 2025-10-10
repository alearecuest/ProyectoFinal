import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["GEMINI_API_KEY"];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Faltan las siguientes variables de entorno requeridas: ${missingEnvVars.join(", ")}\n` +
    `Por favor, crea un archivo .env basado en .env.example`
  );
}

export const config = {
  port: parseInt(process.env.PORT || "10000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
    : ["http://localhost:3000", "http://localhost:5173"],
  
  sessionTimeoutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES || "30", 10),
  sessionCleanupIntervalMinutes: parseInt(process.env.SESSION_CLEANUP_INTERVAL_MINUTES || "5", 10),
  
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  rateLimitWindowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || "15", 10),
  
  geminiApiKey: process.env.GEMINI_API_KEY!,
  geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  maxOptions: parseInt(process.env.MAX_OPTIONS || "8", 10),
} as const;

if (config.port < 1 || config.port > 65535) {
  throw new Error(`Puerto inválido: ${config.port}. Debe estar entre 1 y 65535.`);
}

if (config.sessionTimeoutMinutes < 1) {
  throw new Error(`SESSION_TIMEOUT_MINUTES debe ser mayor a 0.`);
}

console.log("✅ Configuración cargada correctamente");
console.log(`   Entorno: ${config.nodeEnv}`);
console.log(`   Puerto: ${config.port}`);
console.log(`   Modelo IA: ${config.geminiModel}`);
