import pino from 'pino'
import expressPino from 'express-pino-logger'

let _logger
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

if (LOG_LEVEL === 'debug') {
  _logger = pino({
    prettyPrint: { colorize: true },
    level:       LOG_LEVEL
  })
} else {
  _logger = pino({
    level:       LOG_LEVEL
  })
}

export const logger = _logger

export const expressLogger = expressPino({
  logger
})
