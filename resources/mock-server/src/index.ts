import { Polly, type PollyConfig } from "@pollyjs/core";
import FetchAdapter from "@pollyjs/adapter-fetch";
import FSPersister from "@pollyjs/persister-fs";
import path from "path";

Polly.register(FSPersister);
Polly.register(FetchAdapter);

export type Client = "algod" | "kmd" | "indexer";

export function getPolly(
  client: Client,
  config: {
    mode: "record-new" | "record-overwrite" | "replay";
    recordingsDir?: string;
  }
) {
  const pollyConfig: PollyConfig = {
    adapters: ["fetch"],
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir:
          config.recordingsDir ?? path.resolve(__dirname, "../recordings")
      }
    },
    matchRequestsBy: {
      method: true,
      url: true, // includes query params
      headers: true,
      body: true,
      order: false
    }
  };

  if (config.mode === "record-new") {
    pollyConfig.mode = "replay";
    pollyConfig.recordIfMissing = true;
  } else if (config.mode === "record-overwrite") {
    pollyConfig.mode = "record";
  } else if (config.mode === "replay") {
    pollyConfig.mode = "replay";
    pollyConfig.recordIfMissing = false;
  } else {
    throw new Error(`Unknown mode: ${config.mode}`);
  }

  const polly = new Polly(client, pollyConfig);

  const headersToRemove = [
    "transfer-encoding", // Conflicts with content-length header during replay
    "content-encoding" // HAR stores decompressed body but header indicates compression (e.g. gzip), causing decompression errors
  ];
  polly.server.any().on("beforeReplay", (_req, rec) => {
    rec.response.headers = rec.response.headers.filter(
      (h: any) => !headersToRemove.includes(h.name.toLowerCase())
    );
  });

  return polly;
}

export async function record(
  client: Client,
  makeRequests: () => Promise<void>,
  mode: "record-new" | "record-overwrite" = "record-new",
  recordingsDir?: string
) {
  const polly = getPolly(client, { mode, recordingsDir });
  try {
    await makeRequests();
  } finally {
    await polly.stop();
  }
}

export async function replay<T>(
  client: Client,
  makeRequests: () => Promise<T>,
  recordingsDir?: string
): Promise<T> {
  const polly = getPolly(client, { mode: "replay", recordingsDir });

  try {
    return await makeRequests();
  } finally {
    await polly.stop();
  }
}
