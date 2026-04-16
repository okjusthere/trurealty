export const dynamic = 'force-dynamic'

import { getPayloadClient } from '@/lib/payload'
import DevelopmentCard from '@/components/DevelopmentCard'
import type { DevelopmentRecord } from '@/lib/site'

export const metadata = {
  title: 'New Developments',
  description: 'Explore new construction and development projects in New York.',
}

export default async function NewDevelopmentsPage() {
  const payload = await getPayloadClient()

  const developments = await payload.find({
    collection: 'new-developments',
    limit: 100,
  })

  const docs = developments.docs as DevelopmentRecord[]

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-2 text-center">
          New Developments
        </h1>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          Discover the latest new construction projects and pre-construction
          opportunities in the New York metropolitan area.
        </p>

        {docs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {docs.map((development) => (
              <DevelopmentCard key={development.id} development={development} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted py-12">
            No new developments to display yet. Check back soon.
          </p>
        )}
      </div>
    </div>
  )
}
