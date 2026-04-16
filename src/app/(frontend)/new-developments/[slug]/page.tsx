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
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const devs = await payload.find({
    collection: 'new-developments',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const dev = devs.docs[0] as any
  if (!dev) return { title: 'Development Not Found' }
  return {
    title: `${dev.name} | Tru International Realty Corp`,
    description: `${dev.name} - New development in ${dev.location}.`,
  }
}

export default async function NewDevelopmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const devs = await payload.find({
    collection: 'new-developments',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const dev = devs.docs[0] as any
  if (!dev) notFound()

  const photos = dev.photos || []
  const floorPlans = dev.floorPlans || []
  const amenities = dev.amenities || []
  const agent =
    dev.contactAgent && typeof dev.contactAgent === 'object' ? dev.contactAgent : null

  function getImageUrl(photo: any): string | null {
    const img = photo?.image
    if (!img) return null
    return img.url || (img.filename ? `/media/${img.filename}` : null)
  }

  const brochureUrl = dev.brochureFile?.url || (dev.brochureFile?.filename ? `/media/${dev.brochureFile.filename}` : null)
  const agentPhotoUrl = agent?.photo?.url || (agent?.photo?.filename ? `/media/${agent.photo.filename}` : null)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Photo Gallery */}
        {photos.length > 0 ? (
          <div className="mb-10">
            {getImageUrl(photos[0]) && (
              <div className="relative w-full aspect-[16/9] mb-4 bg-muted-bg overflow-hidden">
                <Image
                  src={getImageUrl(photos[0])!}
                  alt={dev.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {photos.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {photos.slice(1).map((photo: any, i: number) => {
                  const url = getImageUrl(photo)
                  if (!url) return null
                  return (
                    <div key={i} className="relative aspect-square bg-muted-bg overflow-hidden">
                      <Image src={url} alt={`${dev.name} - ${i + 2}`} fill className="object-cover" />
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

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            {dev.status && (
              <span
                className={`px-3 py-1 text-xs text-white font-medium ${statusColors[dev.status] || 'bg-gray-500'}`}
              >
                {statusLabels[dev.status] || dev.status}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-heading text-primary mb-2">{dev.name}</h1>
          <p className="text-lg text-muted mb-1">{dev.location}</p>
          {dev.developer && (
            <p className="text-muted">
              Developer: <span className="text-foreground">{dev.developer}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-border mb-8">
              {dev.priceRange?.min != null && (
                <div>
                  <p className="text-sm text-muted">Price Range</p>
                  <p className="text-lg font-heading text-primary">
                    {formatPrice(dev.priceRange.min)}
                    {dev.priceRange.max ? ` - ${formatPrice(dev.priceRange.max)}` : '+'}
                  </p>
                </div>
              )}
              {dev.totalUnits != null && (
                <div>
                  <p className="text-sm text-muted">Total Units</p>
                  <p className="text-lg font-heading text-primary">{dev.totalUnits}</p>
                </div>
              )}
              {dev.completionDate && (
                <div>
                  <p className="text-sm text-muted">Completion Date</p>
                  <p className="text-lg font-heading text-primary">
                    {new Date(dev.completionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-2xl font-heading text-primary mb-4">About This Development</h2>
              <RichText content={dev.description} />
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading text-primary mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((a: string) => (
                    <span
                      key={a}
                      className="px-4 py-2 bg-accent/10 text-accent text-sm font-medium rounded"
                    >
                      {amenityLabels[a] || a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Plans */}
            {floorPlans.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-heading text-primary mb-4">Floor Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {floorPlans.map((fp: any, i: number) => {
                    const fpUrl = fp.image?.url || (fp.image?.filename ? `/media/${fp.image.filename}` : null)
                    return (
                      <div key={i} className="border border-border p-4">
                        {fp.name && (
                          <p className="font-medium text-primary mb-2">{fp.name}</p>
                        )}
                        {fpUrl && (
                          <div className="relative aspect-[4/3] bg-muted-bg overflow-hidden">
                            <Image
                              src={fpUrl}
                              alt={fp.name || `Floor Plan ${i + 1}`}
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

            {/* Brochure Download */}
            {brochureUrl && (
              <div className="mb-10">
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-white px-8 py-3 font-medium hover:bg-primary-dark transition-colors"
                >
                  Download Brochure
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Agent */}
            {agent && (
              <div className="border border-border p-6">
                <h3 className="text-lg font-heading text-primary mb-4">Contact Agent</h3>
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
                  </div>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <div className="border border-border p-6">
              <h3 className="text-lg font-heading text-primary mb-4">Request Information</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
