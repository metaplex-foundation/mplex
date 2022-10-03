import { Cluster, Commitment } from '@solana/web3.js'
import { strict as assert } from 'assert'

// -----------------
// Clusters
// -----------------
export type ClusterWithLocal = Cluster | 'local'
export const clusters: Readonly<ClusterWithLocal[]> = [
  'devnet',
  'mainnet-beta',
  'testnet',
  'local',
] as const

export type DevCluster = 'devnet' | 'local'
export const devClusters: Readonly<DevCluster[]> = ['devnet', 'local'] as const

// -----------------
// Commitments
// -----------------
export const commitments: Readonly<Commitment[]> = [
  'processed',
  'confirmed',
  'finalized',
  'recent',
  'single',
  'singleGossip',
  'root',
  'max',
] as const
export function isCommitment(value: string): value is Commitment {
  return commitments.includes(value as Commitment)
}

export function assertCommitment(value: string): asserts value is Commitment {
  assert(isCommitment(value), `Invalid commitment: ${value}`)
}
