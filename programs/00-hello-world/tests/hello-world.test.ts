import { describe, expect, test } from "bun:test";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { createTestContext, sendAndGetLogs } from "@solana-lab/sdk";

const programId = PublicKey.unique();
const { svm, payer } = createTestContext(
  "target/deploy/hello_world.so",
  programId,
);

describe("hello-world", () => {
  test("invokes the program and logs a greeting", () => {
    const ix = new TransactionInstruction({
      programId,
      keys: [],
      data: Buffer.from([]),
    });

    const tx = new Transaction();
    tx.recentBlockhash = svm.latestBlockhash();
    tx.add(ix);
    tx.sign(payer);

    const logs = sendAndGetLogs(svm, tx);
    expect(logs.some((line) => line.includes("Hello, Solana!"))).toBe(true);
  });
});
