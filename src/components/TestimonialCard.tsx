import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  testimonial: {
    clientName?: string
    rating?: number
    content?: string
    transactionType?: string
    [key: string]: unknown
  }
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const clientName = testimonial?.clientName ?? 'Anonymous'
  const rating = testimonial?.rating ?? 5
  const quote = testimonial?.content ?? ''
  const transactionType = testimonial?.transactionType

  return (
    <div className="relative bg-white rounded-lg border border-border p-6 sm:p-8">
      {/* Decorative quotation mark */}
      <span
        className="absolute top-4 right-5 font-heading text-6xl leading-none text-primary/8 select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < rating ? 'fill-accent text-accent' : 'fill-gray-200 text-gray-200',
            )}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="mt-4 text-sm leading-relaxed text-foreground/80">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{clientName}</p>
        {transactionType && (
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-primary/8 text-primary rounded-full">
            {transactionType}
          </span>
        )}
      </div>
    </div>
  )
}
