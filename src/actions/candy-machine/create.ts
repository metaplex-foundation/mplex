import {
  CreateCandyMachineInput,
  Metaplex,
  PublicKey,
  Signer,
} from '@metaplex-foundation/js'
import { CandyMachineCreateArgs } from '@/types'
import { strict as assert } from 'assert'
import { tryAmman } from '@/utils/amman'
import { logDebug } from '@/utils'

type Collection = {
  address: PublicKey
  updateAuthority: Signer
}

export async function candyMachineCreate(
  mx: Metaplex,
  args: CandyMachineCreateArgs
) {
  // TODO(thlorenz): allow user to either provide collection or the desired collection name
  // TODO(thlorenz): how do I get a URI if I just want to create a collection
  //                 from scratch and or why do I need a collection at all to create a candy
  //                 machine?
  // TODO(thlorenz): do sellerFeeBasisPoints match the setting in the candy machine itself?
  //                 what are they based on (the example mentions 250 to denote 2.5%)
  const collection =
    args.collection ??
    (await createCollection(mx, 'MyCollectionNft', 'http://some/uri', 100))
  logDebug({ collection })
  const input: CreateCandyMachineInput = { ...args, collection }
  return mx.candyMachines().create(input).run()
}

async function createCollection(
  mx: Metaplex,
  collectionName: string,
  uri: string,
  sellerFeeBasisPoints: number
): Promise<Collection> {
  const { nft, response, ...rest } = await mx
    .nfts()
    .create({
      // TODO(thlorenz): Need more clarification here around creating a
      // collection, i.e. what should be the authority if we create it for the
      // user?
      isCollection: true,
      collectionIsSized: true,
      collection: mx.identity().publicKey,
      collectionAuthority: mx.identity(),
      name: collectionName,
      uri,
      sellerFeeBasisPoints,
    })
    .run()

  const amman = tryAmman()
  if (amman != null) {
    await amman.addr.addLabel('tx: create collection', response.signature)
    await amman.addr.addLabels(nft)
    await amman.addr.addLabels(nft.mint)
    await amman.addr.addLabels(rest)
  }

  assert(nft.collection != null, 'Should have created a collection')
  return { ...nft.collection, updateAuthority: mx.identity() }
}
