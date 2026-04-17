export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import ListingCard from '@/components/ListingCard'
import OneKeySearchBox from '@/components/OneKeySearchBox'
import type { ListingRecord } from '@/lib/site'

export const metadata = {
  title: 'Our Listings',
  description:
    'Browse our curated selection of residential and commercial properties in New York.',
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>
}) {
  const query = await searchParams
  const status = Array.isArray(query.status) ? query.status[0] : query.status
  const payload = await getPayloadClient()

  const where: { status?: { equals: string } } = {}
  if (status && status !== 'all') {
    where.status = { equals: status }
  }

  const listings = await payload.find({
    collection: 'listings',
    where,
    sort: '-updatedAt',
    limit: 100,
  })

  const docs = listings.docs as ListingRecord[]
  const currentStatus = status || 'all'

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Sold', value: 'sold' },
  ]

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-2 text-center">
          Our Listings
        </h1>
        <p className="text-muted text-center mb-8">
          Explore our current and recently sold properties
        </p>

        <OneKeySearchBox />
        <p className="text-xs text-muted text-center mb-10">
          Full search powered by OneKey&reg; MLS — results open in a new tab.
        </p>

        <div className="flex justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value === 'all' ? '/listings' : `/listings?status=${tab.value}`}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                currentStatus === tab.value
                  ? 'bg-primary text-white'
                  : 'bg-muted-bg text-foreground hover:bg-border'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docs.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted py-12">No listings found.</p>
        )}
      </div>
    </div>
  )
}
