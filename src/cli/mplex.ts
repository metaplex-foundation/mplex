import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { assertCommitment, commitments, devClusters } from '../types'
import { strict as assert } from 'assert'
import { cmdAirdrop } from './commands/airdrop'
import { closeConnection } from '../utils/connection'
import { logError } from '../utils/log'

const commands = yargs(hideBin(process.argv))
  .command(
    'airdrop',
    `Drops the amount of sols to the provided address (only works for ${devClusters} clusters)`,
    (args) => {
      args
        .positional('pubkey', {
          describe: 'The pubkey to which we want to drop the SOL.',
          type: 'string',
          demandOption: true,
        })
        .positional('amount', {
          describe: 'Amount of SOL to drop.',
          type: 'string',
          default: 1,
        })
        .option('cluster', {
          alias: 'c',
          describe:
            'The cluster on which to perform the airdrop. Defaults to MPLEX_CLUSTER or "devnet".',
          type: 'string',
          choices: devClusters,
          default: process.env.MPLEX_CLUSTER ?? 'devnet',
        })
        .option('commitment', {
          alias: 'm',
          describe: 'The commitment of the transaction',
          type: 'string',
          choices: commitments,
          default: 'singleGossip',
        })
    }
  )
  .command('cm', 'Creates and interacts with candy machines', (_args) => {})

async function main() {
  const args = await commands.parse()
  const { _: cs } = args
  if (cs.length === 0) {
    commands.showHelp()
    return
  }
  const command = cs[0]
  switch (command) {
    // -----------------
    // airdrop
    // -----------------
    case 'airdrop': {
      const { commitment, cluster } = args
      try {
        const destination = cs[1]
        const maybeAmount = cs[2]
        const amount =
          maybeAmount == null
            ? 1
            : typeof maybeAmount === 'string'
            ? parseInt(maybeAmount)
            : maybeAmount

        assert(
          typeof destination === 'string',
          'Destination public key is required'
        )
        assertCommitment(commitment)

        const { connection } = await cmdAirdrop(
          cluster,
          commitment,
          destination,
          amount
        )

        await closeConnection(connection, true)
      } catch (err) {
        logError(err)
        commands.showHelp()
      }
      break
    }
  }
}

main()
  .then(() => process.nextTick(() => process.exit(0)))
  .catch((err: any) => {
    console.error(err)
    process.exit(1)
  })
