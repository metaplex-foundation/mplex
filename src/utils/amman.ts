import { Amman } from '@metaplex-foundation/amman-client'
import { ClusterWithLocal } from '@/types'
import { logDebug } from './log'

const programIds = {
  hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk: 'auctionHouse',
  CnDYGRdU51FsSyLnVgSd19MCFxA4YHT5h3nacvCKMPUJ: 'candyGuard',
  CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR: 'candyMachineCore',
  metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s: 'tokenMetadata',
  gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs: 'solanaGateway',
}

export class MplexAmman {
  private readonly _amman: Amman | undefined

  private constructor(cluster: ClusterWithLocal) {
    // At this point we require the MPLEX_AMMAN env var to be set, but we could
    // also try to connect to amman relay and enable it magically.
    // Alternatively we could provide a wrapper binary which calls `mplex` with
    // that env var set.
    if (cluster === 'local') {
      if (process.env.MPLEX_AMMAN != null) {
        this._amman = Amman.instance({
          knownLabels: programIds,
        })
        logDebug('Enabled amman integration')
      } else {
        logDebug(
          `Set env var 'MPLEX_AMMAN=1' in order to enable amman integration when running on local cluster`
        )
      }
    }
  }

  get amman(): Amman | undefined {
    return this._amman
  }

  private static _instance: MplexAmman | undefined
  static init(cluster: ClusterWithLocal) {
    MplexAmman._instance = new MplexAmman(cluster)
  }
  static get amman(): Amman | undefined {
    return MplexAmman._instance?.amman
  }
}

export const tryAmman = () => MplexAmman.amman
