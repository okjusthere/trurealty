import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'
import type { CompanyInfoRecord } from '@/lib/site'

export const getCompanyInfo = cache(async (): Promise<CompanyInfoRecord> => {
  const payload = await getPayloadClient()

  return (await payload.findGlobal({
    slug: 'company-info',
  })) as CompanyInfoRecord
})
