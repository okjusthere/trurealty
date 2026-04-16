import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeroProps {
  title: string
  subtitle?: string
  backgroundImage?: string
}

export default function Hero({ title, subtitle, backgroundImage }: HeroProps) {
  return (
    <section className="relative w-full min-h-[540px] md:min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-lg sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/listings"
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-primary bg-white rounded-md hover:bg-white/90 transition-colors min-w-[180px]"
          >
            View Listings
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white border border-white/40 rounded-md hover:bg-white/10 transition-colors min-w-[180px]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
