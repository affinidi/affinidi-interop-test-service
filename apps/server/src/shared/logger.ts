import pino from 'pino'
import expressPino from 'express-pino-logger'

export const logger = pino({
  prettyPrint: { colorize: true },
  level:       process.env.LOG_LEVEL || 'info'
})

export const expressLogger = expressPino({
  logger
})
