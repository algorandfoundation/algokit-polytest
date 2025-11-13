import type { Client } from "../src/index.ts";
import { recordAlgosdkRequests } from "../src/record.ts";

const client = process.argv[2] as Client;
const mode = process.argv[3] as "record-new" | "record-overwrite";
const recordingsDir = process.argv[4];

console.log(`Recording ${client} requests in ${mode} mode...`);
if (recordingsDir) {
  console.log(`Recordings directory: ${recordingsDir}`);
}

await recordAlgosdkRequests(client, mode, recordingsDir);

console.log(`✓ Recording complete for ${client}`);
