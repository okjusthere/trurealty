import Link from 'next/link'
import { getCompanyInfo } from '@/lib/company'
import { getPayloadClient } from '@/lib/payload'
import Hero from '@/components/Hero'
import ListingCard from '@/components/ListingCard'
import DevelopmentCard from '@/components/DevelopmentCard'
import AgentCard from '@/components/AgentCard'
import TestimonialCard from '@/components/TestimonialCard'
import {
  getMediaUrl,
  type AgentRecord,
  type DevelopmentRecord,
  type ListingRecord,
  type TestimonialRecord,
} from '@/lib/site'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const companyInfo = await getCompanyInfo()

  const [listings, developments, agents, testimonials] = await Promise.all([
    payload.find({
      collection: 'listings',
      where: { featured: { equals: true } },
      limit: 3,
    }),
    payload.find({
      collection: 'new-developments',
      where: { featured: { equals: true } },
      limit: 6,
    }),
    payload.find({
      collection: 'agents',
      where: { featured: { equals: true } },
      limit: 4,
    }),
    payload.find({
      collection: 'testimonials',
      where: { featured: { equals: true } },
      limit: 3,
    }),
  ])
  const heroImage = getMediaUrl(companyInfo.heroImage)
  const companyName = companyInfo.companyName || 'Tru International Realty Corp'
  const subtitle =
    companyInfo.slogan ||
    'Real Estate Expertise. Results You Can Trust. Your trusted partner in New York real estate.'

  return (
    <>
      <Hero
        title={companyName}
        subtitle={subtitle}
        backgroundImage={heroImage ?? undefined}
      />

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading text-primary mb-2 text-center">
            Featured Listings
          </h2>
          <p className="text-muted text-center mb-10">
            Handpicked properties for discerning buyers
          </p>
          {(listings.docs as ListingRecord[]).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(listings.docs as ListingRecord[]).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">
              No featured listings at the moment. Check back soon.
            </p>
          )}
          <div className="text-center mt-10">
            <Link
              href="/listings"
              className="inline-block border-2 border-primary text-primary px-8 py-3 font-medium hover:bg-primary hover:text-white transition-colors"
            >
              View All Listings
            </Link>
          </div>
        </div>
      </section>

      {/* New Developments */}
      <section className="py-16 bg-muted-bg">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading text-primary mb-2 text-center">
            New Developments
          </h2>
          <p className="text-muted text-center mb-10">
            Exclusive new construction projects
          </p>
          {(developments.docs as DevelopmentRecord[]).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(developments.docs as DevelopmentRecord[]).map((dev) => (
                <DevelopmentCard key={dev.id} development={dev} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">
              No featured developments at the moment. Check back soon.
            </p>
          )}
          <div className="text-center mt-10">
            <Link
              href="/new-developments"
              className="inline-block border-2 border-primary text-primary px-8 py-3 font-medium hover:bg-primary hover:text-white transition-colors"
            >
              View All Developments
            </Link>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading text-primary mb-2 text-center">
            Our Team
          </h2>
          <p className="text-muted text-center mb-10">
            Experienced professionals dedicated to your success
          </p>
          {(agents.docs as AgentRecord[]).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(agents.docs as AgentRecord[]).map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">
              Meet our team coming soon.
            </p>
          )}
          <div className="text-center mt-10">
            <Link
              href="/agents"
              className="inline-block border-2 border-primary text-primary px-8 py-3 font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Meet the Full Team
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted-bg">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading text-primary mb-2 text-center">
            What Our Clients Say
          </h2>
          <p className="text-muted text-center mb-10">
            Real stories from real clients
          </p>
          {(testimonials.docs as TestimonialRecord[]).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(testimonials.docs as TestimonialRecord[]).map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">
              Client testimonials coming soon.
            </p>
          )}
        </div>
      </section>

      {/* Thinking About Selling? */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary-light text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading mb-4">
            Thinking About Selling?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Find out what your home is worth in today&apos;s market. Our agents
            provide free, personalized Comparative Market Analysis reports.
          </p>
          <Link
            href="/home-value"
            className="inline-block bg-accent text-white px-10 py-4 text-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Get Your Free Home Value Report
          </Link>
          <div className="mt-10 flex items-center justify-center gap-10 text-white/70">
            <div>
              <span className="block text-2xl font-heading text-white">500+</span>
              <span className="text-sm">Homes Sold</span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <span className="block text-2xl font-heading text-white">98%</span>
              <span className="text-sm">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Whether you are buying, selling, or investing, our team is here to
            guide you every step of the way.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent text-white px-10 py-4 text-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </>
  )
}
