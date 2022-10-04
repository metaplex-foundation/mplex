import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import {
  assertCommitment,
  assertDevCluster,
  commitments,
  devClusters,
} from '../types'
import { strict as assert } from 'assert'
import { cmdAirdrop } from './commands/airdrop'
import { closeConnection } from '../utils/connection'
import { logError } from '../utils/log'
import { MplexAmman } from 'src/utils/amman'

const commands = yargs(hideBin(process.argv))
  // -----------------
  // Airdrop
  // -----------------
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
  // -----------------
  // CM (Candy Machine)
  // -----------------
  .command('cm', 'Creates and interacts with candy machines', (args) => {
    args
      .command('create', 'Create a new Candy Machine', (_args) => {})
      .command('update', 'Update an existing Candy Machine', (_args) => {})
      .command(
        'insert',
        'Insert items into an existing Candy Machine',
        (_args) => {}
      )
      .command('delete', 'Delete an existing Candy Machine', (_args) => {})
      .command('mint', 'Mint from an existing Candy Machine', (_args) => {})
      .command(
        'find',
        'Finds an existing Candy Machine by its addres (includes Candy Guard if any)',
        (_args) => {}
      )
      // -----------------
      // CM Candy Guards
      // -----------------
      .command(
        'cg',
        'Creates and interacts with candy machine guards',
        (args) => {
          args
            .command('create', 'Creates a new Candy Guard', (_args) => {})
            .command('update', 'Updates an existing Candy Guard', (_args) => {})
            .command('delete', 'Deletes an existing Candy Guard', (_args) => {})
            .command(
              'find',
              'Finds an existing Candy Guard by address or authority',
              (_args) => {}
            )
            .command('wrap', 'Wraps an existing Candy Guard', (_args) => {})
            .command('unwrap', 'Unwraps an existing Candy Guard', (_args) => {})
        }
      )
  })

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
          'Destination public key string is required'
        )
        assert(
          typeof commitment === 'string',
          'Commitment needs to be a string'
        )
        assertCommitment(commitment)

        assert(typeof cluster === 'string', 'Cluster needs to be a string')
        assertDevCluster(cluster)

        MplexAmman.init(cluster)

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
