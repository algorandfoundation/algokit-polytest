import { Polly, type PollyConfig } from "@pollyjs/core";
import FetchAdapter from "@pollyjs/adapter-fetch";
import FSPersister from "@pollyjs/persister-fs";
import path from "path";

Polly.register(FSPersister);
Polly.register(FetchAdapter);

export function getPolly(
  name: string,
  config: { mode: "record-new" | "record-overwrite" | "replay" },
) {
  const pollyConfig: PollyConfig = {
    adapters: ["fetch"],
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, "../recordings"),
      },
    },
    matchRequestsBy: {
      method: true,
      url: true, // includes query params
      headers: true,
      body: true,
      order: false,
    },
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

  const polly = new Polly(name, pollyConfig);

  // Remove headers that may cause issues during replay. In particular, anything related to compression
  // should be removed.
  const problematicHeaders = ["content-encoding", "content-length", "vary"];
  polly.server.any().on("beforeReplay", (_req, rec) => {
    rec.response.headers = rec.response.headers.filter(
      (h: any) => !problematicHeaders.includes(h.name.toLowerCase()),
    );
  });

  return polly;
}

export async function record(name: string, makeRequests: () => Promise<void>) {
  const polly = getPolly(name, { mode: "record-new" });
  try {
    await makeRequests();
  } finally {
    await polly.stop();
  }
}

export async function replay(name: string, makeRequests: () => Promise<void>) {
  const polly = getPolly(name, { mode: "replay" });

  try {
    await makeRequests();
  } finally {
    await polly.stop();
  }
}
