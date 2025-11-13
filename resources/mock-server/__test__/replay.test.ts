import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startServer, type ServerInstance } from "../src/server";
import { Algodv2, Indexer, Kmd } from "algosdk";

const PollyError = "PollyError";
const NON_EXISTENT_ADDRESS = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ";

describe("Algod Mock Server", () => {
  let algodServer: ServerInstance;
  let algodClient: Algodv2;

  beforeAll(async () => {
    algodServer = await startServer("algod");
    algodClient = new Algodv2(
      "a".repeat(64),
      "http://localhost",
      algodServer.port
    );
  });

  it("should work with the recorded status request", async () => {
    const status = await algodClient.status().do();
    expect(status).matchSnapshot();
  });

  it("should fail with unrecorded endpoint", async () => {
    try {
      await algodClient.accountInformation(NON_EXISTENT_ADDRESS).do();
    } catch (error: any) {
      expect(Buffer.from(error.response.body).toString()).toContain(PollyError);
      return;
    }

    expect.unreachable("PollyJS should have thrown an error");
  });

  it("should fail with a different header", async () => {
    const client = new Algodv2(
      "b".repeat(64),
      "http://localhost",
      algodServer.port
    );
    try {
      await client.status().do();
    } catch (error: any) {
      expect(Buffer.from(error.response.body).toString()).toContain(PollyError);
      return;
    }

    expect.unreachable("PollyJS should have thrown an error");
  });

  afterAll(async () => {
    await algodServer.close();
  });
});

describe("Indexer Mock Server", () => {
  let indexerServer: ServerInstance;
  let indexerClient: Indexer;

  beforeAll(async () => {
    indexerServer = await startServer("indexer");
    indexerClient = new Indexer(
      "a".repeat(64),
      "http://localhost",
      indexerServer.port
    );
  });

  it("should work with the recorded health check request", async () => {
    const status = await indexerClient.makeHealthCheck().do();
    expect(status).matchSnapshot();
  });

  it("should fail with unrecorded endpoint", async () => {
    try {
      await indexerClient.lookupBlock(1000).do();
    } catch (error: any) {
      expect(Buffer.from(error.response.body).toString()).toContain(PollyError);
      return;
    }

    expect.unreachable("PollyJS should have thrown an error");
  });

  it("should fail with a different header", async () => {
    const client = new Indexer(
      "b".repeat(64),
      "http://localhost",
      indexerServer.port
    );
    try {
      await client.makeHealthCheck().do();
    } catch (error: any) {
      expect(Buffer.from(error.response.body).toString()).toContain(PollyError);
      return;
    }

    expect.unreachable("PollyJS should have thrown an error");
  });

  afterAll(async () => {
    await indexerServer.close();
  });
});

describe("KMD Mock Server", () => {
  let kmdServer: ServerInstance;
  let kmdClient: Kmd;

  beforeAll(async () => {
    kmdServer = await startServer("kmd");
    kmdClient = new Kmd("a".repeat(64), "http://localhost", kmdServer.port);
  });

  it("should work with the recorded list wallets request", async () => {
    const status = await kmdClient.listWallets();
    expect(status).matchSnapshot();
  });

  it("should fail with unrecorded endpoint", async () => {
    try {
      await kmdClient.versions();
    } catch (error: any) {
      expect(Buffer.from(error.response.body).toString()).toContain(PollyError);
      return;
    }

    expect.unreachable("PollyJS should have thrown an error");
  });

  it("should fail with a different header", async () => {
    const client = new Kmd("b".repeat(64), "http://localhost", kmdServer.port);
    try {
      await client.listWallets();
    } catch (error: any) {
      expect(Buffer.from(error.response.body).toString()).toContain(PollyError);
      return;
    }

    expect.unreachable("PollyJS should have thrown an error");
  });

  afterAll(async () => {
    await kmdServer.close();
  });
});
