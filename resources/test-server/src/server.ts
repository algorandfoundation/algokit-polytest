import Fastify from "fastify";
import { setupServer } from "msw/node";
import { handlers } from "./handlers.js";

const mswServer = setupServer(...handlers);
mswServer.listen({ onUnhandledRequest: "warn" });

const fastify = Fastify({ logger: true });

// Catch-all proxy through MSW
fastify.all("/*", async (request, reply) => {
  const url = `http://mock${request.url}`;

  const response = await fetch(url, {
    method: request.method,
    headers: request.headers as HeadersInit,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? JSON.stringify(request.body)
        : undefined,
  });

  const data = await response.text();

  reply
    .code(response.status)
    .headers(Object.fromEntries(response.headers.entries()))
    .send(data);
});

await fastify.listen({
  port: Number(process.env.PORT) || 8000,
  host: "0.0.0.0",
});
