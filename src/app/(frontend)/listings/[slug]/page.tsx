export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { formatPhone, formatPrice } from '@/lib/utils'
import ContactForm from '@/components/ContactForm'
import RichTextRenderer from '@/components/RichTextRenderer'
import {
  getMediaUrl,
  type AgentRecord,
  type ListingPhoto,
  type ListingRecord,
} from '@/lib/site'

const propertyTypeLabels: Record<string, string> = {
  house: 'House',
  condo: 'Condo',
  coop: 'Co-op',
  townhouse: 'Townhouse',
  'multi-family': 'Multi-Family',
  commercial: 'Commercial',
  land: 'Land',
}

const statusLabels: Record<string, string> = {
  active: 'Active',
  pending: 'Pending',
  sold: 'Sold',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-600',
  pending: 'bg-yellow-500',
  sold: 'bg-red-600',
}

function getPhotoUrl(photo?: ListingPhoto): string | null {
  return getMediaUrl(photo?.image)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const listings = await payload.find({
    collection: 'listings',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const listing = listings.docs[0] as ListingRecord | undefined

  if (!listing) {
    return { title: 'Listing Not Found' }
  }

  const addressSummary = [listing.address, listing.city].filter(Boolean).join(', ')

  return {
    title: `${listing.title} | Tru International Realty Corp`,
    description: `${listing.title} - ${addressSummary}. ${formatPrice(listing.price ?? 0)}.`,
  }
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const listings = await payload.find({
    collection: 'listings',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const listing = listings.docs[0] as ListingRecord | undefined

  if (!listing) {
    notFound()
  }

  const photos = listing.photos ?? []
  const agent =
    listing.agent && typeof listing.agent === 'object'
      ? (listing.agent as AgentRecord)
      : null
  const agentPhotoUrl = getMediaUrl(agent?.photo)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {photos.length > 0 ? (
          <div className="mb-10">
            {getPhotoUrl(photos[0]) && (
              <div className="relative w-full aspect-[16/9] mb-4 bg-muted-bg overflow-hidden rounded-xl">
                <Image
                  src={getPhotoUrl(photos[0]) ?? ''}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {photos.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {photos.slice(1).map((photo, index) => {
                  const photoUrl = getPhotoUrl(photo)

                  if (!photoUrl) {
                    return null
                  }

                  return (
                    <div
                      key={`${listing.id}-${index}`}
                      className="relative aspect-square bg-muted-bg overflow-hidden rounded-lg"
                    >
                      <Image
                        src={photoUrl}
                        alt={`${listing.title} - ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-[16/9] mb-10 bg-muted-bg flex items-center justify-center rounded-xl">
            <span className="text-muted">No photos available</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 text-xs text-white font-medium rounded-md ${statusColors[listing.status ?? ''] || 'bg-gray-500'}`}
              >
                {statusLabels[listing.status ?? ''] || listing.status}
              </span>
              {listing.propertyType && (
                <span className="px-3 py-1 text-xs bg-muted-bg text-foreground rounded-md">
                  {propertyTypeLabels[listing.propertyType] || listing.propertyType}
                </span>
              )}
              {listing.mlsNumber && (
                <span className="text-xs text-muted">MLS# {listing.mlsNumber}</span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-heading text-primary mb-2">
              {listing.title}
            </h1>
            <p className="text-lg text-muted mb-2">
              {listing.address}, {listing.city}, {listing.state} {listing.zip}
            </p>
            <p className="text-3xl font-heading text-accent mb-6">
              {formatPrice(listing.price ?? 0)}
            </p>

            <div className="flex gap-8 py-6 border-y border-border mb-8">
              {listing.beds != null && (
                <div className="text-center">
                  <p className="text-2xl font-heading text-primary">{listing.beds}</p>
                  <p className="text-sm text-muted">Beds</p>
                </div>
              )}
              {listing.baths != null && (
                <div className="text-center">
                  <p className="text-2xl font-heading text-primary">{listing.baths}</p>
                  <p className="text-sm text-muted">Baths</p>
                </div>
              )}
              {listing.sqft != null && (
                <div className="text-center">
                  <p className="text-2xl font-heading text-primary">
                    {listing.sqft.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted">Sq Ft</p>
                </div>
              )}
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-heading text-primary mb-4">Description</h2>
              <RichTextRenderer content={listing.description} />
            </div>

            {listing.virtualTourUrl && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading text-primary mb-4">
                  Virtual Tour
                </h2>
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
                  <iframe
                    src={listing.virtualTourUrl}
                    className="w-full h-full border-0"
                    allowFullScreen
                    title="Virtual Tour"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            {agent && (
              <div className="border border-border p-6 rounded-2xl bg-white">
                <h3 className="text-lg font-heading text-primary mb-4">Listed By</h3>
                <div className="flex items-center gap-4 mb-4">
                  {agentPhotoUrl ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted-bg">
                      <Image src={agentPhotoUrl} alt={agent.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted-bg flex items-center justify-center">
                      <span className="text-xl text-muted">{agent.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/agents/${agent.slug}`}
                      className="font-medium text-primary hover:text-accent"
                    >
                      {agent.name}
                    </Link>
                    {agent.phone && (
                      <p className="text-sm text-muted">
                        <a href={`tel:${agent.phone}`} className="hover:text-accent">
                          {formatPhone(agent.phone)}
                        </a>
                      </p>
                    )}
                    {agent.email && (
                      <p className="text-sm text-muted">
                        <a href={`mailto:${agent.email}`} className="hover:text-accent">
                          {agent.email}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="border border-border p-6 rounded-2xl bg-white">
              <h3 className="text-lg font-heading text-primary mb-4">
                Inquire About This Property
              </h3>
              <ContactForm
                context={{
                  sourceType: 'listing',
                  sourceLabel: listing.title,
                  sourceSlug: listing.slug,
                  listingId: listing.id,
                  agentId: agent?.id,
                }}
                successMessage="Your property inquiry has been saved and routed with listing context."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
