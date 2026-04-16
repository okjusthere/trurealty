import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import { formatPhone } from '@/lib/utils'
import ListingCard from '@/components/ListingCard'
import ContactForm from '@/components/ContactForm'

const titleLabels: Record<string, string> = {
  broker: 'Broker',
  'associate-broker': 'Associate Broker',
  realtor: 'REALTOR\u00AE',
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const agents = await payload.find({
    collection: 'agents',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const agent = agents.docs[0] as any
  if (!agent) return { title: 'Agent Not Found' }
  return {
    title: `${agent.name} | Tru International Realty Corp`,
    description: `${agent.name} - ${titleLabels[agent.title] || agent.title} at Tru International Realty Corp.`,
  }
}

export default async function AgentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const agents = await payload.find({
    collection: 'agents',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const agent = agents.docs[0] as any
  if (!agent) notFound()

  const listings = await payload.find({
    collection: 'listings',
    where: { agent: { equals: agent.id } },
    limit: 12,
  })

  const photoUrl = agent.photo?.url || agent.photo?.filename
    ? agent.photo?.url || `/media/${agent.photo.filename}`
    : null

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Agent Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Photo */}
          <div className="md:col-span-1">
            {photoUrl ? (
              <div className="relative aspect-[3/4] w-full bg-muted-bg overflow-hidden">
                <Image
                  src={photoUrl}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] w-full bg-muted-bg flex items-center justify-center">
                <span className="text-6xl text-muted">
                  {agent.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-heading text-primary mb-1">{agent.name}</h1>
            <p className="text-xl text-accent mb-1">
              {titleLabels[agent.title] || agent.title}
            </p>
            {agent.credentials && (
              <p className="text-muted mb-6">{agent.credentials}</p>
            )}

            {/* Contact Info */}
            <div className="space-y-2 mb-8">
              {agent.phone && (
                <p>
                  <span className="font-medium text-primary">Phone:</span>{' '}
                  <a href={`tel:${agent.phone}`} className="text-accent hover:underline">
                    {formatPhone(agent.phone)}
                  </a>
                </p>
              )}
              {agent.email && (
                <p>
                  <span className="font-medium text-primary">Email:</span>{' '}
                  <a href={`mailto:${agent.email}`} className="text-accent hover:underline">
                    {agent.email}
                  </a>
                </p>
              )}
            </div>

            {/* Languages */}
            {agent.languages && agent.languages.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-primary mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.languages.map((lang: string) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-muted-bg text-sm text-foreground rounded"
                    >
                      {languageLabels[lang] || lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {agent.specialties && agent.specialties.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-primary mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.specialties.map((s: string) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-accent/10 text-accent text-sm rounded"
                    >
                      {specialtyLabels[s] || s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Areas */}
            {agent.serviceAreas && agent.serviceAreas.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-primary mb-2">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.serviceAreas.map((area: string) => (
                    <span
                      key={area}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded"
                    >
                      {areaLabels[area] || area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {agent.bio && (
          <div className="mb-16">
            <h2 className="text-2xl font-heading text-primary mb-6">About {agent.name}</h2>
            <RichText content={agent.bio} />
          </div>
        )}

        {/* Agent Listings */}
        {listings.docs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-heading text-primary mb-6">
              Listings by {agent.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.docs.map((listing: any) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-heading text-primary mb-6 text-center">
            Contact {agent.name}
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
