import type { HeadersInit } from "bun";
import Fastify from "fastify";
import { getPolly } from "./index";
import { recordAlgosdkRequests } from "./record";

export type ServerInstance = {
  port: number;
  close: () => Promise<void>;
  listen: Promise<string>;
};

export async function startServer(): Promise<ServerInstance> {
  await recordAlgosdkRequests();

  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
  });

  // Catch-all proxy through PollyJS
  fastify.all("/*", async (request, reply) => {
    const polly = getPolly("algod", { mode: "replay" });
    const url = new URL(request.url, "http://localhost:4001");

    fastify.log.debug(
      `[Fastify] Incoming request: ${request.method} ${request.url}`,
    );
    fastify.log.debug(`[Fastify] Transformed to: ${request.method} ${url}`);

    const forwardHeaders = ["x-algo-api-token", "accept"];
    for (const [key, value] of Object.entries(request.headers)) {
      fastify.log.debug(`[Fastify] Request header: ${key} = ${value}`);

      if (!forwardHeaders.includes(key.toLowerCase())) {
        delete request.headers[key];
      }
    }

    fastify.log.debug(
      `[Fastify] Forwarded headers: ${JSON.stringify(request.headers)}`,
    );

    const response = await fetch(url, {
      method: request.method,
      headers: request.headers as HeadersInit,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? JSON.stringify(request.body)
          : undefined,
    });

    const data = await response.text();

    fastify.log.debug(`[PollyJS] Response status: ${response.status}`);
    fastify.log.debug(`[PollyJS] Response size: ${data.length} bytes`);

    // Log response preview (first 200 chars)
    const preview = data.length > 200 ? data.substring(0, 200) + "..." : data;
    fastify.log.debug(`[PollyJS] Response preview: ${preview}`);

    await polly.stop();

    console.debug(response);
    reply
      .code(response.status)
      .headers(Object.fromEntries(response.headers.entries()))
      .send(data);
  });

  const port = Number(process.env.PORT) || 8000;

  // Start listening without awaiting (non-blocking)
  const listenPromise = fastify.listen({
    port,
    host: "0.0.0.0",
  });

  await fastify.ready();

  // Return close function for graceful shutdown
  return {
    port,
    close: async () => {
      await fastify.close();
    },
    listen: listenPromise,
  };
}
