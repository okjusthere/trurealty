import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { formatPhone } from '@/lib/utils'
import ListingCard from '@/components/ListingCard'
import DevelopmentCard from '@/components/DevelopmentCard'
import TestimonialCard from '@/components/TestimonialCard'
import ContactForm from '@/components/ContactForm'
import RichTextRenderer from '@/components/RichTextRenderer'
import {
  getMediaUrl,
  type AgentRecord,
  type DevelopmentRecord,
  type ListingRecord,
  type TestimonialRecord,
} from '@/lib/site'

const titleLabels: Record<string, string> = {
  broker: 'Broker',
  'associate-broker': 'Associate Broker',
  realtor: 'REALTOR®',
  salesperson: 'Licensed Salesperson',
}

const specialtyLabels: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  'new-development': 'New Development',
  investment: 'Investment',
  luxury: 'Luxury',
  rental: 'Rental',
}

const areaLabels: Record<string, string> = {
  queens: 'Queens',
  brooklyn: 'Brooklyn',
  manhattan: 'Manhattan',
  bronx: 'Bronx',
  nassau: 'Nassau County',
  suffolk: 'Suffolk County',
  'long-island': 'Long Island',
}

const languageLabels: Record<string, string> = {
  english: 'English',
  mandarin: 'Mandarin',
  cantonese: 'Cantonese',
  spanish: 'Spanish',
  korean: 'Korean',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const agents = await payload.find({
    collection: 'agents',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const agent = agents.docs[0] as AgentRecord | undefined

  if (!agent) {
    return { title: 'Agent Not Found' }
  }

  return {
    title: `${agent.name} | Tru International Realty Corp`,
    description: `${agent.name} - ${titleLabels[agent.title ?? ''] || agent.title || 'Real Estate Agent'} at Tru International Realty Corp.`,
  }
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const agents = await payload.find({
    collection: 'agents',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const agent = agents.docs[0] as AgentRecord | undefined

  if (!agent) {
    notFound()
  }

  const [listingsResult, reviewsResult, developmentsResult] = await Promise.all([
    payload.find({
      collection: 'listings',
      where: { agent: { equals: agent.id } },
      limit: 24,
      sort: '-updatedAt',
    }),
    payload.find({
      collection: 'testimonials',
      where: { agent: { equals: agent.id } },
      limit: 12,
      sort: '-updatedAt',
    }),
    payload.find({
      collection: 'new-developments',
      where: { contactAgent: { equals: agent.id } },
      limit: 12,
    }),
  ])

  const activeListings = (listingsResult.docs as ListingRecord[]).filter(
    (listing) => listing.status === 'active',
  )
  const agentReviews = reviewsResult.docs as TestimonialRecord[]
  const developments = (developmentsResult.docs as DevelopmentRecord[]).filter(
    (development) => development.status !== 'sold-out',
  )

  const reviewCount = agentReviews.length
  const averageRating =
    reviewCount > 0
      ? (
          agentReviews.reduce((sum, review) => sum + (review.rating ?? 5), 0) /
          reviewCount
        ).toFixed(1)
      : null

  const photoUrl = getMediaUrl(agent.photo)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-12 mb-16">
          <div>
            {photoUrl ? (
              <div className="relative aspect-[3/4] w-full bg-muted-bg overflow-hidden rounded-xl">
                <Image src={photoUrl} alt={agent.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="aspect-[3/4] w-full bg-muted-bg flex items-center justify-center rounded-xl">
                <span className="text-6xl text-muted">{agent.name.charAt(0)}</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-heading text-primary mb-2">
                  {agent.name}
                </h1>
                <p className="text-xl text-accent">
                  {titleLabels[agent.title ?? ''] || agent.title}
                </p>
                {agent.credentials && (
                  <p className="text-muted mt-1">{agent.credentials}</p>
                )}
                {averageRating && (
                  <p className="mt-4 text-sm text-foreground/80">
                    {averageRating}/5 average rating from {reviewCount} client
                    {reviewCount === 1 ? ' review' : ' reviews'}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-light transition-colors"
                  >
                    Call {formatPhone(agent.phone)}
                  </a>
                )}
                {agent.email && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-primary border border-primary/20 rounded-md hover:bg-primary/5 transition-colors"
                  >
                    Email {agent.name.split(' ')[0]}
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-sm text-muted">Active Listings</p>
                <p className="mt-2 text-3xl font-heading text-primary">
                  {activeListings.length}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-sm text-muted">Client Reviews</p>
                <p className="mt-2 text-3xl font-heading text-primary">
                  {reviewCount}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-sm text-muted">Developments</p>
                <p className="mt-2 text-3xl font-heading text-primary">
                  {developments.length}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {agent.languages && agent.languages.length > 0 && (
                <div>
                  <h2 className="font-medium text-primary mb-2">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {agent.languages.map((language) => (
                      <span
                        key={language}
                        className="px-3 py-1 bg-muted-bg text-sm text-foreground rounded-full"
                      >
                        {languageLabels[language] || language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {agent.specialties && agent.specialties.length > 0 && (
                <div>
                  <h2 className="font-medium text-primary mb-2">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                      >
                        {specialtyLabels[specialty] || specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {agent.serviceAreas && agent.serviceAreas.length > 0 && (
                <div>
                  <h2 className="font-medium text-primary mb-2">Service Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {agent.serviceAreas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {areaLabels[area] || area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {agent.bio && (
          <section className="mb-16">
            <h2 className="text-2xl font-heading text-primary mb-6">
              About {agent.name}
            </h2>
            <RichTextRenderer content={agent.bio} />
          </section>
        )}

        {agentReviews.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-heading text-primary">
                  Client Reviews
                </h2>
                <p className="text-muted mt-1">
                  Social proof matters more than generic brand copy. This is the
                  part clients remember.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {agentReviews.map((review) => (
                <TestimonialCard key={review.id} testimonial={review} />
              ))}
            </div>
          </section>
        )}

        {activeListings.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-heading text-primary mb-6">
              Active Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {developments.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-heading text-primary mb-6">
              New Developments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {developments.map((development) => (
                <DevelopmentCard key={development.id} development={development} />
              ))}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10 items-start">
          <div className="rounded-2xl border border-border bg-muted-bg p-8">
            <h2 className="text-2xl font-heading text-primary mb-3">
              Reach {agent.name.split(' ')[0]} directly
            </h2>
            <p className="text-muted max-w-2xl">
              Whether you&apos;re comparing neighborhoods, asking about a specific
              listing, or looking for a new development opportunity, this request
              will be saved with agent context so it does not disappear into a
              generic inbox.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-foreground/70">
              {agent.phone && (
                <span>
                  Phone:{' '}
                  <a className="text-accent hover:underline" href={`tel:${agent.phone}`}>
                    {formatPhone(agent.phone)}
                  </a>
                </span>
              )}
              {agent.email && (
                <span>
                  Email:{' '}
                  <a className="text-accent hover:underline" href={`mailto:${agent.email}`}>
                    {agent.email}
                  </a>
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="text-lg font-heading text-primary mb-4">
              Contact {agent.name}
            </h3>
            <ContactForm
              context={{
                sourceType: 'agent',
                sourceLabel: agent.name,
                sourceSlug: agent.slug,
                agentId: agent.id,
              }}
              successMessage={`Your request has been saved and tagged to ${agent.name}.`}
            />
          </div>
        </section>

        <div className="mt-12">
          <Link
            href="/agents"
            className="inline-flex items-center text-accent hover:underline"
          >
            &larr; Back to Our Team
          </Link>
        </div>
      </div>
    </div>
  )
}
