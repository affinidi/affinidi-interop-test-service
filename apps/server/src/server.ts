import app from './index'
import { logger } from './shared/logger'
import ngrok from 'ngrok'

const { PORT, ENVIRONMENT } = process.env

app.listen(PORT, () => {
  logger.info(`Interop Server is listening on ${PORT}`)
  logger.info('ENVIRONMENT: ', ENVIRONMENT)
  if (ENVIRONMENT === 'local') {
    (async () => {
      const endpoint = await ngrok.connect(parseInt(PORT))
      process.env.NGROK_ENDPOINT = endpoint
      logger.info(
      `Publicly accessible tunnel to localhost:${PORT} is available on ${endpoint}`
      )
    })()
  }
})
