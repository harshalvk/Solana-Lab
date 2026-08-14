import { describe, expect, test } from "bun:test";
import { type Address, address } from "@solana/kit";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { createTestContext, sendAndGetLogs } from "@solana-lab/sdk";

const programId = PublicKey.unique();

const { svm, payer } = createTestContext("target/deploy/counter.so", programId);

function encodeU64LE(value: bigint): Uint8Array {
  const data = new Uint8Array(8);
  const view = new DataView(data.buffer);

  view.setBigUint64(0, value, true);

  return data;
}

function initializeIx(counterPubkey: PublicKey, initialValue: bigint) {
  return new TransactionInstruction({
    programId,
    keys: [
      {
        pubkey: payer.publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: counterPubkey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: Buffer.concat([
      Buffer.from([0]),
      Buffer.from(encodeU64LE(initialValue)),
    ]),
  });
}

function incrementIx(counterPubkey: PublicKey) {
  return new TransactionInstruction({
    programId,
    keys: [
      {
        pubkey: counterPubkey,
        isSigner: false,
        isWritable: true,
      },
    ],
    data: Buffer.from([1]),
  });
}

function decrementIx(counterPubkey: PublicKey) {
  return new TransactionInstruction({
    programId,
    keys: [
      {
        pubkey: counterPubkey,
        isSigner: false,
        isWritable: true,
      },
    ],
    data: Buffer.from([2]),
  });
}

function getExistingAccount(pubkey: PublicKey) {
  const account = svm.getAccount(address(pubkey.toBase58()));

  if (!account.exists) {
    throw new Error(`Account ${pubkey.toBase58()} does not exist`);
  }

  return account;
}

function readU64LE(data: Uint8Array, offset: number): bigint {
  return new DataView(
    data.buffer,
    data.byteOffset,
    data.byteLength,
  ).getBigUint64(offset, true);
}

describe("counter", () => {
  test("initializes with a starting value", () => {
    const counter = new Keypair();

    const tx = new Transaction();
    tx.recentBlockhash = svm.latestBlockhash();
    tx.add(initializeIx(counter.publicKey, 5n));
    tx.sign(payer, counter);

    sendAndGetLogs(svm, tx);

    const account = getExistingAccount(counter.publicKey);

    expect(account.data[0]).toBe(1);
    expect(readU64LE(account.data, 1)).toBe(5n);
  });

  test("increments an initialized counter", () => {
    const counter = new Keypair();

    const initTx = new Transaction();
    initTx.recentBlockhash = svm.latestBlockhash();
    initTx.add(initializeIx(counter.publicKey, 0n));
    initTx.sign(payer, counter);

    sendAndGetLogs(svm, initTx);

    const incTx = new Transaction();
    incTx.recentBlockhash = svm.latestBlockhash();
    incTx.add(incrementIx(counter.publicKey));
    incTx.sign(payer);

    sendAndGetLogs(svm, incTx);

    const account = getExistingAccount(counter.publicKey);

    expect(readU64LE(account.data, 1)).toBe(1n);
  });

  test("decrements an initialized counter", () => {
    const counter = new Keypair();

    const initTx = new Transaction();
    initTx.recentBlockhash = svm.latestBlockhash();
    initTx.add(initializeIx(counter.publicKey, 5n));
    initTx.sign(payer, counter);

    sendAndGetLogs(svm, initTx);

    const decTx = new Transaction();
    decTx.recentBlockhash = svm.latestBlockhash();
    decTx.add(decrementIx(counter.publicKey));
    decTx.sign(payer);

    sendAndGetLogs(svm, decTx);

    const account = getExistingAccount(counter.publicKey);

    expect(readU64LE(account.data, 1)).toBe(4n);
  });
});
