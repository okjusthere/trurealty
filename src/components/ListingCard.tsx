import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Maximize } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

interface ListingCardProps {
  listing: {
    slug?: string
    price?: number
    address?: string
    city?: string
    state?: string
    beds?: number
    baths?: number
    sqft?: number
    photos?: Array<{ image?: { url?: string } | null }> | null
    status?: string
    propertyType?: string
    [key: string]: unknown
  }
}

const statusStyles: Record<string, string> = {
  Active: 'bg-green-600 text-white',
  active: 'bg-green-600 text-white',
  Pending: 'bg-yellow-500 text-white',
  pending: 'bg-yellow-500 text-white',
  Sold: 'bg-red-600 text-white',
  sold: 'bg-red-600 text-white',
}

export default function ListingCard({ listing }: ListingCardProps) {
  const slug = listing?.slug ?? ''
  const price = listing?.price ?? 0
  const address = listing?.address ?? ''
  const city = listing?.city ?? ''
  const state = listing?.state ?? 'NY'
  const beds = listing?.beds
  const baths = listing?.baths
  const sqft = listing?.sqft
  const status = listing?.status ?? 'Active'
  const propertyType = listing?.propertyType

  // Extract photo URL from Payload photos array
  const photo =
    Array.isArray(listing?.photos) && listing.photos.length > 0
      ? typeof listing.photos[0]?.image === 'object' && listing.photos[0]?.image?.url
        ? listing.photos[0].image.url
        : null
      : null

  return (
    <Link
      href={`/listings/${slug}`}
      className="group block bg-white rounded-lg border border-border overflow-hidden transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-muted-bg overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={address}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/10" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-md',
              statusStyles[status] ?? 'bg-gray-500 text-white',
            )}
          >
            {status}
          </span>
          {propertyType && (
            <span className="px-2.5 py-1 text-xs font-medium bg-white/90 text-foreground rounded-md backdrop-blur-sm">
              {propertyType}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <p className="font-heading text-xl font-bold text-foreground">
          {formatPrice(price)}
        </p>

        {/* Beds / Baths / Sqft */}
        {(beds !== undefined || baths !== undefined || sqft !== undefined) && (
          <div className="mt-2 flex items-center gap-4 text-sm text-muted">
            {beds !== undefined && (
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {beds} {beds === 1 ? 'Bed' : 'Beds'}
              </span>
            )}
            {baths !== undefined && (
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {baths} {baths === 1 ? 'Bath' : 'Baths'}
              </span>
            )}
            {sqft !== undefined && (
              <span className="flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                {sqft.toLocaleString()} sqft
              </span>
            )}
          </div>
        )}

        <p className="mt-2.5 text-sm text-muted leading-snug">
          {address}
          <br />
          {city}, {state}
        </p>
      </div>
    </Link>
  )
}
