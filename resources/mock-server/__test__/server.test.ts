import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startServer, type ServerInstance } from "../src/server";
import { Algodv2 } from "algosdk";

const NO_RECORDING = "Recording for the following request is not found";

describe("PollyJS Server", () => {
  let server: ServerInstance;
  let algodClient: Algodv2;

  beforeAll(async () => {
    server = await startServer();
    algodClient = new Algodv2("a".repeat(64), "http://localhost", server.port);
  });

  it("should work with the recorded status request", async () => {
    const status = await algodClient.status().do();
    expect(status).matchSnapshot();
  });

  it("should fail with unrecorded endpoint", async () => {
    await expect(algodClient.genesis().do()).rejects.toThrowError(NO_RECORDING);
  });

  it("should fail with a different header", async () => {
    const client = new Algodv2("b".repeat(64), "http://localhost", server.port);
    await expect(client.status().do()).rejects.toThrowError(NO_RECORDING);
  });

  afterAll(async () => {
    await server.close();
  });
});
