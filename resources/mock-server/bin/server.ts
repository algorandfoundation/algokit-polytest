import type { Client } from "../src/index.ts";
import { startServer } from "../src/server.ts";

const client = process.argv[2] as Client;
const recordingsDir = process.argv[3];

console.log(`Starting ${client} mock server in replay mode...`);
if (recordingsDir) {
  console.log(`Recordings directory: ${recordingsDir}`);
}

const server = await startServer(client, recordingsDir);

console.log(`✓ Server listening on port ${server.port}`);
