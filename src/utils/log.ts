import debug from 'debug'

const logErrorDebug = debug('mplex:error')
const logInfoDebug = debug('mplex:info')

export const logDebug = debug('mplex:debug')
export const logTrace = debug('mplex:trace')

export const logError = logErrorDebug.enabled
  ? logErrorDebug
  : console.error.bind(console)

export const logInfo = logInfoDebug.enabled
  ? logInfoDebug
  : console.log.bind(console)
