import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import { formatPhone } from '@/lib/utils'
import { getMediaUrl, type AgentRecord } from '@/lib/site'

interface AgentCardProps {
  agent: AgentRecord
}

const titleLabels: Record<string, string> = {
  broker: 'Broker',
  'associate-broker': 'Associate Broker',
  realtor: 'REALTOR®',
  salesperson: 'Licensed Salesperson',
}

export default function AgentCard({ agent }: AgentCardProps) {
  const slug = agent?.slug ?? ''
  const name = agent?.name ?? 'Unknown Agent'
  const title = agent?.title ?? undefined
  const phone = agent?.phone ?? undefined
  const photo = getMediaUrl(agent?.photo)
  const languages = agent?.languages ?? []

  return (
    <Link
      href={`/agents/${slug}`}
      className="group block bg-white rounded-lg border border-border overflow-hidden transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] bg-muted-bg overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="font-heading text-5xl font-bold text-primary/20">
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        {title && (
          <p className="mt-0.5 text-sm text-muted">{titleLabels[title] || title}</p>
        )}
        {phone && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <Phone className="h-3.5 w-3.5" />
            {formatPhone(phone)}
          </p>
        )}
        {languages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {languages.map((lang) => (
              <span
                key={lang}
                className="inline-block px-2.5 py-0.5 text-xs font-medium bg-muted-bg text-muted rounded-full"
              >
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
