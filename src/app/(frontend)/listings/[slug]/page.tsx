import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { formatPrice, formatPhone } from '@/lib/utils'
import ContactForm from '@/components/ContactForm'

function RichText({ content }: { content: any }) {
  if (!content) return <p className="text-muted">Content coming soon.</p>
  if (typeof content === 'string') return <div dangerouslySetInnerHTML={{ __html: content }} />
  if (content?.root?.children) {
    return (
      <div className="prose prose-lg max-w-none">
        {content.root.children.map((node: any, i: number) => {
          if (node.type === 'paragraph') {
            const text = node.children?.map((c: any) => c.text || '').join('') || ''
            return text ? <p key={i}>{text}</p> : <br key={i} />
          }
          if (node.type === 'heading') {
            const text = node.children?.map((c: any) => c.text || '').join('') || ''
            const Tag = (`h${node.tag || 3}`) as keyof JSX.IntrinsicElements
            return <Tag key={i}>{text}</Tag>
          }
          const text = node.children?.map((c: any) => c.text || '').join('') || ''
          return text ? <p key={i}>{text}</p> : null
        })}
      </div>
    )
  }
  return <p className="text-muted">Content coming soon.</p>
}

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const listings = await payload.find({
    collection: 'listings',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const listing = listings.docs[0] as any
  if (!listing) return { title: 'Listing Not Found' }
  return {
    title: `${listing.title} | Tru International Realty Corp`,
    description: `${listing.title} - ${listing.address}, ${listing.city}. ${formatPrice(listing.price)}.`,
  }
}

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const listings = await payload.find({
    collection: 'listings',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const listing = listings.docs[0] as any
  if (!listing) notFound()

  const photos = listing.photos || []
  const agent = listing.agent && typeof listing.agent === 'object' ? listing.agent : null

  function getImageUrl(photo: any): string | null {
    const img = photo?.image
    if (!img) return null
    return img.url || (img.filename ? `/media/${img.filename}` : null)
  }

  const agentPhotoUrl = agent?.photo?.url || (agent?.photo?.filename ? `/media/${agent.photo.filename}` : null)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Photo Gallery */}
        {photos.length > 0 ? (
          <div className="mb-10">
            {/* Main Photo */}
            {getImageUrl(photos[0]) && (
              <div className="relative w-full aspect-[16/9] mb-4 bg-muted-bg overflow-hidden">
                <Image
                  src={getImageUrl(photos[0])!}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {photos.slice(1).map((photo: any, i: number) => {
                  const url = getImageUrl(photo)
                  if (!url) return null
                  return (
                    <div key={i} className="relative aspect-square bg-muted-bg overflow-hidden">
                      <Image src={url} alt={`${listing.title} - ${i + 2}`} fill className="object-cover" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-[16/9] mb-10 bg-muted-bg flex items-center justify-center">
            <span className="text-muted">No photos available</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Status Badge & Price */}
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-xs text-white font-medium ${statusColors[listing.status] || 'bg-gray-500'}`}>
                {statusLabels[listing.status] || listing.status}
              </span>
              {listing.propertyType && (
                <span className="px-3 py-1 text-xs bg-muted-bg text-foreground">
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
              {formatPrice(listing.price)}
            </p>

            {/* Stats */}
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
                  <p className="text-2xl font-heading text-primary">{listing.sqft.toLocaleString()}</p>
                  <p className="text-sm text-muted">Sq Ft</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-2xl font-heading text-primary mb-4">Description</h2>
              <RichText content={listing.description} />
            </div>

            {/* Virtual Tour */}
            {listing.virtualTourUrl && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading text-primary mb-4">Virtual Tour</h2>
                <div className="aspect-video w-full">
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

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Agent Card */}
            {agent && (
              <div className="border border-border p-6">
                <h3 className="text-lg font-heading text-primary mb-4">Listed By</h3>
                <div className="flex items-center gap-4 mb-4">
                  {agentPhotoUrl ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted-bg">
                      <Image src={agentPhotoUrl} alt={agent.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted-bg flex items-center justify-center">
                      <span className="text-xl text-muted">{agent.name?.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <Link href={`/agents/${agent.slug}`} className="font-medium text-primary hover:text-accent">
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

            {/* Contact Form */}
            <div className="border border-border p-6">
              <h3 className="text-lg font-heading text-primary mb-4">Inquire About This Property</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
