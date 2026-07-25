import { Keypair, type PublicKey } from "@solana/web3.js";
import { LiteSVM } from "litesvm";

export interface TestContext {
  svm: LiteSVM;
  payer: Keypair;
}

/**
 * Spins up a fresh in-process LiteSVM instance, loads the given program,
 * and funds a payer keypair. Every program's test file starts with this
 * one call instead of repeating the same five lines of setup.
 */
export function createTestContext(
  programSoPath: string,
  programId: PublicKey,
  airdropLamports = 1_000_000_000n,
): TestContext {
  const svm = new LiteSVM();

  svm.addProgramFromFile(
    programId.toBase58() as unknown as Parameters<
      typeof svm.addProgramFromFile
    >[0],
    programSoPath,
  );

  const payer = new Keypair();

  // Lamports is @solana/kit's nominal-branded bigint — same runtime value,
  // just a compile-time tag. No conversion function needed here (unlike
  // the PublicKey → base58 string case above), a cast is the real fix.
  svm.airdrop(
    payer.publicKey.toBase58() as unknown as Parameters<typeof svm.airdrop>[0],
    airdropLamports as unknown as Parameters<typeof svm.airdrop>[1],
  );

  return { svm, payer };
}
