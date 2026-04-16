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
  type DevelopmentFloorPlan,
  type DevelopmentRecord,
  type DevelopmentHighlight,
  type ListingPhoto,
} from '@/lib/site'

const statusLabels: Record<string, string> = {
  'pre-construction': 'Pre-Construction',
  'under-construction': 'Under Construction',
  'move-in-ready': 'Move-In Ready',
  'sold-out': 'Sold Out',
}

const statusColors: Record<string, string> = {
  'pre-construction': 'bg-blue-600',
  'under-construction': 'bg-yellow-500',
  'move-in-ready': 'bg-green-600',
  'sold-out': 'bg-red-600',
}

const amenityLabels: Record<string, string> = {
  gym: 'Gym/Fitness Center',
  rooftop: 'Rooftop',
  parking: 'Parking',
  concierge: 'Concierge',
  pool: 'Pool',
  doorman: 'Doorman',
  laundry: 'Laundry',
  storage: 'Storage',
  'pet-friendly': 'Pet-Friendly',
  'outdoor-space': 'Outdoor Space',
  'ev-charging': 'EV Charging',
  balcony: 'Balcony/Terrace',
  'in-unit-laundry': 'In-Unit Washer/Dryer',
  'bike-room': 'Bike Room',
  'video-intercom': 'Video Intercom',
  lounge: 'Lounge',
  'package-room': 'Package Room',
  'heated-floors': 'Heated Bathroom Floors',
  'smart-lock': 'Smart Lock',
}

const unitTypeLabels: Record<string, string> = {
  studio: 'Studio',
  '1br': '1 Bedroom',
  '2br': '2 Bedroom',
  '3br': '3 Bedroom',
  '4br-plus': '4+ Bedroom',
}

function getPhotoUrl(photo?: ListingPhoto): string | null {
  return getMediaUrl(photo?.image)
}

function getFloorPlanUrl(floorPlan?: DevelopmentFloorPlan): string | null {
  return getMediaUrl(floorPlan?.image)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const developments = await payload.find({
    collection: 'new-developments',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const development = developments.docs[0] as DevelopmentRecord | undefined

  if (!development) {
    return { title: 'Development Not Found' }
  }

  return {
    title: `${development.name} | Tru International Realty Corp`,
    description: `${development.name} - New development in ${development.location}.`,
  }
}

export default async function NewDevelopmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const developments = await payload.find({
    collection: 'new-developments',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const development = developments.docs[0] as DevelopmentRecord | undefined

  if (!development) {
    notFound()
  }

  const photos = development.photos ?? []
  const floorPlans = development.floorPlans ?? []
  const amenities = development.amenities ?? []
  const highlights = development.highlights ?? []
  const agent =
    development.contactAgent && typeof development.contactAgent === 'object'
      ? (development.contactAgent as AgentRecord)
      : null

  const brochureUrl = getMediaUrl(development.brochureFile)
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
                  alt={development.name}
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
                      key={`${development.id}-${index}`}
                      className="relative aspect-square bg-muted-bg overflow-hidden rounded-lg"
                    >
                      <Image
                        src={photoUrl}
                        alt={`${development.name} - ${index + 2}`}
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

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            {development.status && (
              <span
                className={`px-3 py-1 text-xs text-white font-medium rounded-md ${statusColors[development.status] || 'bg-gray-500'}`}
              >
                {statusLabels[development.status] || development.status}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-heading text-primary mb-2">
            {development.name}
          </h1>
          <p className="text-lg text-muted mb-1">{development.location}</p>
          {development.developer && (
            <p className="text-muted">
              Developer:{' '}
              <span className="text-foreground">{development.developer}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border mb-8">
              {development.stories != null && (
                <div>
                  <p className="text-sm text-muted">Stories</p>
                  <p className="text-2xl font-heading text-primary">
                    {development.stories}
                  </p>
                </div>
              )}
              {development.totalUnits != null && (
                <div>
                  <p className="text-sm text-muted">Residences</p>
                  <p className="text-2xl font-heading text-primary">
                    {development.totalUnits}
                  </p>
                </div>
              )}
              {development.priceRange?.min != null && (
                <div>
                  <p className="text-sm text-muted">Price Range</p>
                  <p className="text-lg font-heading text-primary">
                    {formatPrice(development.priceRange.min)}
                    {development.priceRange.max
                      ? ` - ${formatPrice(development.priceRange.max)}`
                      : '+'}
                  </p>
                </div>
              )}
              {development.yearBuilt != null && (
                <div>
                  <p className="text-sm text-muted">Year Built</p>
                  <p className="text-2xl font-heading text-primary">
                    {development.yearBuilt}
                  </p>
                </div>
              )}
              {development.completionDate && !development.yearBuilt && (
                <div>
                  <p className="text-sm text-muted">Completion</p>
                  <p className="text-lg font-heading text-primary">
                    {new Date(development.completionDate).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                      },
                    )}
                  </p>
                </div>
              )}
            </div>

            {development.unitTypes && development.unitTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-sm text-muted mr-2">Available:</span>
                {development.unitTypes.map((unitType) => (
                  <span
                    key={unitType}
                    className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                  >
                    {unitTypeLabels[unitType] || unitType}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-10">
              <h2 className="text-2xl font-heading text-primary mb-4">
                About This Development
              </h2>
              <RichTextRenderer content={development.description} />
            </div>

            {amenities.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading text-primary mb-4">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-4 py-2 bg-accent/10 text-accent text-sm font-medium rounded"
                    >
                      {amenityLabels[amenity] || amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {highlights.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading text-primary mb-4">
                  Highlights
                </h2>
                <div className="space-y-4">
                  {highlights.map((highlight: DevelopmentHighlight, index) => (
                    <div
                      key={`${development.id}-highlight-${index}`}
                      className="border-l-4 border-accent pl-4"
                    >
                      <h3 className="font-semibold text-foreground">
                        {highlight.title}
                      </h3>
                      <p className="text-muted mt-1">{highlight.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {development.transportation && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading text-primary mb-4">
                  Transportation
                </h2>
                <p className="text-muted leading-relaxed">
                  {development.transportation}
                </p>
              </div>
            )}

            {development.neighborhood && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading text-primary mb-4">
                  Neighborhood
                </h2>
                <p className="text-muted leading-relaxed">
                  {development.neighborhood}
                </p>
              </div>
            )}

            {floorPlans.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading text-primary mb-4">
                  Floor Plans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {floorPlans.map((floorPlan, index) => {
                    const floorPlanUrl = getFloorPlanUrl(floorPlan)

                    return (
                      <div
                        key={`${development.id}-floor-plan-${index}`}
                        className="border border-border p-4 rounded-xl"
                      >
                        {floorPlan.name && (
                          <p className="font-medium text-primary mb-2">
                            {floorPlan.name}
                          </p>
                        )}
                        {floorPlanUrl && (
                          <div className="relative aspect-[4/3] bg-muted-bg overflow-hidden rounded-lg">
                            <Image
                              src={floorPlanUrl}
                              alt={floorPlan.name || `Floor Plan ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {brochureUrl && (
              <div className="mb-10">
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-8 py-3 font-medium hover:bg-primary-dark transition-colors rounded-md"
                >
                  Download Brochure
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            {agent && (
              <div className="border border-border p-6 rounded-2xl bg-white">
                <h3 className="text-lg font-heading text-primary mb-4">
                  Contact Agent
                </h3>
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
                Request Information
              </h3>
              <ContactForm
                context={{
                  sourceType: 'development',
                  sourceLabel: development.name,
                  sourceSlug: development.slug,
                  developmentId: development.id,
                  agentId: agent?.id,
                }}
                defaultInterest="new-development"
                successMessage="Your request has been saved with development context for follow-up."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
