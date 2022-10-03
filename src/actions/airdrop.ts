import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

export async function airdrop(
  connection: Connection,
  publicKey: PublicKey,
  amount: number
) {
  const sig = await connection.requestAirdrop(
    publicKey,
    amount * LAMPORTS_PER_SOL
  )
  const signatureResult = await connection.confirmTransaction(sig)
  return { signature: sig, signatureResult }
}
