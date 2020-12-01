import { config } from 'dotenv'
import { logger } from './shared/logger'
config({ path: '../../.env' })

const { PORT, ENVIRONMENT } = process.env

logger.info(`Interop Server is listening on http://localhost:${PORT}`)
logger.info('ENVIRONMENT: ', ENVIRONMENT)
