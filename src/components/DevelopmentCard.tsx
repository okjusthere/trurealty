import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

interface DevelopmentCardProps {
  development: {
    slug?: string
    name?: string
    location?: string
    photos?: Array<{ image?: { url?: string } | null }> | null
    status?: string
    priceRange?: { min?: number; max?: number } | null
    [key: string]: unknown
  }
}

export default function DevelopmentCard({ development }: DevelopmentCardProps) {
  const slug = development?.slug ?? ''
  const name = development?.name ?? 'New Development'
  const location = development?.location ?? ''
  const status = development?.status

  // Extract photo URL from Payload photos array
  const photo =
    Array.isArray(development?.photos) && development.photos.length > 0
      ? typeof development.photos[0]?.image === 'object' && development.photos[0]?.image?.url
        ? development.photos[0].image.url
        : null
      : null

  const priceMin = development?.priceRange?.min
  const priceMax = development?.priceRange?.max

  const priceRange =
    priceMin && priceMax
      ? `${formatPrice(priceMin)} - ${formatPrice(priceMax)}`
      : priceMin
        ? `From ${formatPrice(priceMin)}`
        : null

  return (
    <Link
      href={`/new-developments/${slug}`}
      className="group block bg-white rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Photo */}
      <div className="relative aspect-[16/10] bg-muted-bg overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/15 flex items-center justify-center">
            <span className="font-heading text-2xl font-bold text-primary/20">
              New Development
            </span>
          </div>
        )}

        {status && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-accent text-white rounded-md">
            {status}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {location}
        </p>
        {priceRange && (
          <p className="mt-2.5 text-sm font-semibold text-primary">
            {priceRange}
          </p>
        )}
      </div>
    </Link>
  )
}
