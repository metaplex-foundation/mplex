import { Commitment, Connection } from '@solana/web3.js'
import { urlFromCluster } from '@/utils/connection'
import {
  CandyMachineCreateArgs,
  clusterWithLocalToSdkCluster,
  DevCluster,
} from '@/types'
import { Metaplex, MetaplexPlugin } from '@metaplex-foundation/js'
import { candyMachineCreate } from '@/actions/candy-machine'

export function cmdCandyMachineCreate(
  cluster: DevCluster,
  commitment: Commitment,
  identity: MetaplexPlugin,
  args: CandyMachineCreateArgs
) {
  const url = urlFromCluster(cluster)
  const connection = new Connection(url, commitment)

  const mx = Metaplex.make(connection, {
    cluster: clusterWithLocalToSdkCluster(cluster),
  }).use(identity)
  return candyMachineCreate(mx, args)
}
