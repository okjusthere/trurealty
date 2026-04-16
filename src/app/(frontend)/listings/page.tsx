import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import ListingCard from '@/components/ListingCard'

export const metadata = {
  title: 'Our Listings | Tru International Realty Corp',
  description: 'Browse our curated selection of residential and commercial properties in New York.',
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const payload = await getPayloadClient()

  const where: any = {}
  if (status && status !== 'all') {
    where.status = { equals: status }
  }

  const listings = await payload.find({
    collection: 'listings',
    where,
    sort: '-createdAt',
    limit: 100,
  })

  const currentStatus = status || 'all'

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Sold', value: 'sold' },
  ]

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-2 text-center">Our Listings</h1>
        <p className="text-muted text-center mb-10">
          Explore our current and recently sold properties
        </p>

        {/* Status Filter Tabs */}
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

        {listings.docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.docs.map((listing: any) => (
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
