import type { Transaction } from "@solana/web3.js";
import { type LiteSVM, TransactionMetadata } from "litesvm";

/**
 * Sends a classic @solana/web3.js Transaction through LiteSVM and returns
 * its logs, throwing if the transaction failed.
 *
 * litesvm's TS declarations are authored against @solana/kit's Transaction
 * shape, not the classic @solana/web3.js Transaction class — even though
 * every official litesvm/Anchor example sends a classic Transaction and it
 * works correctly at runtime. This is the one place that cast lives, so
 * individual test files don't need to know about the mismatch.
 */
export function sendAndGetLogs(svm: LiteSVM, tx: Transaction): string[] {
  const result = svm.sendTransaction(
    tx as unknown as Parameters<typeof svm.sendTransaction>[0],
  );

  if (!(result instanceof TransactionMetadata)) {
    throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
  }

  return result.logs();
}
