const { LOCALHOST, tmpLedgerDir } = require('@metaplex-foundation/amman')
const path = require('path')
const MOCK_STORAGE_ID = 'mplex'

function localDeployPath(programName) {
  return path.join(__dirname, 'programs', `${programName}.so`)
}

const programIds = {
  auctionHouse: 'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk',
  candyGuard: 'CnDYGRdU51FsSyLnVgSd19MCFxA4YHT5h3nacvCKMPUJ',
  candyMachineCore: 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  tokenMetadata: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  solanaGateway: 'gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs',
}

const programs = [
  {
    label: 'Auction House',
    programId: programIds.auctionHouse,
    deployPath: localDeployPath('mpl_auction_house'),
  },
  {
    label: 'Candy Guard',
    programId: programIds.candyGuard,
    deployPath: localDeployPath('mpl_candy_guard'),
  },
  {
    label: 'Candy Machine V3',
    programId: programIds.candyMachineCore,
    deployPath: localDeployPath('mpl_candy_machine_core'),
  },
  {
    label: 'Token Metadata',
    programId: programIds.tokenMetadata,
    deployPath: localDeployPath('mpl_token_metadata'),
  },
  {
    label: 'Solana Gateway',
    programId: programIds.solanaGateway,
    deployPath: localDeployPath('solana_gateway_program'),
  },
]

module.exports = {
  validator: {
    killRunningValidators: true,
    programs,
    jsonRpcUrl: LOCALHOST,
    websocketUrl: '',
    commitment: 'confirmed',
    ledgerDir: tmpLedgerDir(),
    resetLedger: true,
    verifyFees: false,
  },
  storage: {
    storageId: MOCK_STORAGE_ID,
    clearOnStart: true,
  },
  snapshot: {
    snapshotFolder: path.join(__dirname, 'snapshots'),
  },
}
