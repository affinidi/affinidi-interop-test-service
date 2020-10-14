import app from './index'
import { logger } from './shared/logger'
import ngrok from 'ngrok'

const PORT = process.env.PORT

app.listen(PORT, () => {
  logger.info(`Interop Server is listening on ${PORT}`);
  (async () => {
    const endpoint = await ngrok.connect(parseInt(PORT))
    process.env.NGROK_ENDPOINT = endpoint
    logger.info(
      `Publicly accessible tunnel to localhost:${PORT} is available on ${endpoint}`
    )
  })()
})
