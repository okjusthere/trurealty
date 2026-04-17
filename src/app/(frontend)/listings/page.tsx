export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import ListingCard from '@/components/ListingCard'
import type { ListingRecord } from '@/lib/site'

export const metadata = {
  title: 'Our Listings',
  description:
    'Browse our curated selection of residential and commercial properties in New York.',
}

const ONEKEY_BROKERAGE_URL =
  'https://www.onekeymls.com/real-estate-offices/great-neck-ny/tru-international-realty-corp-18a8b6251902e834'

type Where = {
  status?: { equals: string }
  or?: Array<Record<string, { like: string }>>
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; q?: string | string[] }>
}) {
  const params = await searchParams
  const status = Array.isArray(params.status) ? params.status[0] : params.status
  const q = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim()
  const payload = await getPayloadClient()

  const where: Where = {}
  if (status && status !== 'all') {
    where.status = { equals: status }
  }
  if (q) {
    where.or = [
      { address: { like: q } },
      { city: { like: q } },
      { zip: { like: q } },
      { title: { like: q } },
    ]
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

        <form
          action="/listings"
          method="GET"
          className="max-w-2xl mx-auto mb-6 flex items-stretch gap-2 rounded-lg border border-border bg-white p-1 shadow-sm"
        >
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search className="h-4 w-4 text-muted shrink-0" />
            <input
              name="q"
              type="text"
              defaultValue={q || ''}
              placeholder="Search by city, neighborhood, or address…"
              className="w-full py-2.5 text-sm bg-transparent focus:outline-none placeholder:text-muted/70"
            />
          </div>
          {currentStatus !== 'all' && (
            <input type="hidden" name="status" value={currentStatus} />
          )}
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-light transition-colors"
          >
            Search
          </button>
        </form>

        {q && (
          <p className="text-sm text-muted text-center mb-8">
            {docs.length} result{docs.length === 1 ? '' : 's'} for
            {' '}
            <span className="font-medium text-foreground">&quot;{q}&quot;</span>
            {' '}
            · <Link href="/listings" className="text-accent hover:underline">Clear</Link>
          </p>
        )}

        <div className="flex justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const qs = new URLSearchParams()
            if (tab.value !== 'all') qs.set('status', tab.value)
            if (q) qs.set('q', q)
            const href = qs.toString() ? `/listings?${qs}` : '/listings'
            return (
              <Link
                key={tab.value}
                href={href}
                className={`px-6 py-2 text-sm font-medium transition-colors ${
                  currentStatus === tab.value
                    ? 'bg-primary text-white'
                    : 'bg-muted-bg text-foreground hover:bg-border'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        {docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docs.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted py-12">
            No listings match your search.
          </p>
        )}

        <div className="text-center mt-16 pt-8 border-t border-border">
          <a
            href={ONEKEY_BROKERAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
          >
            Browse every Tru International Realty Corp listing on OneKey&reg; MLS →
          </a>
        </div>
      </div>
    </div>
  )
}
