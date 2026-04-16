import { getPayload } from 'payload'
import config from '../src/payload.config'

async function initDB() {
  const payload = await getPayload({ config })

  try {
    await payload.findGlobal({
      slug: 'company-info',
    })

    console.log('✅ Payload database initialized')
  } finally {
    await payload.destroy()
  }
}

initDB().catch((error) => {
  console.error('❌ Failed to initialize Payload database', error)
  process.exit(1)
})
