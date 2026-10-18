import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiter com Upstash Redis — confiável em ambientes serverless (Vercel).
 *
 * Configuração necessária no .env.local:
 *   UPSTASH_REDIS_REST_URL=https://...
 *   UPSTASH_REDIS_REST_TOKEN=...
 *
 * Obtenha as credenciais em: https://console.upstash.com
 *
 * Limite: 5 reservas por IP a cada 10 minutos (janela deslizante).
 */

let ratelimit: Ratelimit | null = null;

function getRatelimiter(): Ratelimit | null {
  // Só inicializa se as variáveis de ambiente estiverem configuradas
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn(
      "[RateLimit] Variáveis UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN " +
        "não configuradas. Rate limiting desabilitado."
    );
    return null;
  }

  if (!ratelimit) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: true,
      prefix: "cha-casa-nova:reservar",
    });
  }

  return ratelimit;
}

interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  reset?: number;
}

/**
 * Verifica se o IP está dentro do limite de requisições.
 * Se Upstash não estiver configurado, sempre permite (fail-open).
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const limiter = getRatelimiter();

  if (!limiter) {
    return { allowed: true };
  }

  const { success, remaining, reset } = await limiter.limit(ip);

  return {
    allowed: success,
    remaining,
    reset,
  };
}
