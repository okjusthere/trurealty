export const dynamic = 'force-dynamic'

import { getCompanyInfo } from '@/lib/company'
import { getPayloadClient } from '@/lib/payload'
import AgentCard from '@/components/AgentCard'
import RichTextRenderer from '@/components/RichTextRenderer'
import { getServiceAreaNames, type AgentRecord } from '@/lib/site'

export const metadata = {
  title: 'About Us | Tru International Realty Corp',
  description:
    'Learn more about Tru International Realty Corp, our team, and the markets we serve.',
}

export default async function AboutPage() {
  const [companyInfo, payload] = await Promise.all([
    getCompanyInfo(),
    getPayloadClient(),
  ])

  const agents = await payload.find({
    collection: 'agents',
    where: { status: { equals: 'active' } },
    sort: 'sortOrder',
    limit: 8,
  })

  const team = agents.docs as AgentRecord[]
  const serviceAreas = getServiceAreaNames(companyInfo.serviceAreas)

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-4xl mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-accent mb-3">
            Company Page
          </p>
          <h1 className="text-4xl md:text-5xl font-heading text-primary mb-4">
            {companyInfo.companyName || 'Tru International Realty Corp'}
          </h1>
          <p className="text-lg text-muted max-w-3xl">
            {companyInfo.slogan ||
              'A lightweight brokerage website should establish trust, show the team, and give every marketing campaign a credible destination.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-12 mb-16">
          <div>
            <RichTextRenderer
              content={companyInfo.about}
              emptyMessage="Use this space to explain the brokerage story, what markets you serve, and why clients trust your team."
            />
          </div>

          <aside className="rounded-2xl border border-border bg-muted-bg p-6">
            <h2 className="text-xl font-heading text-primary mb-4">
              Brokerage Snapshot
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-sm text-muted">Active Agents</p>
                <p className="text-3xl font-heading text-primary">{team.length}</p>
              </div>
              {serviceAreas.length > 0 && (
                <div>
                  <p className="text-sm text-muted mb-2">Service Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceAreas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 text-sm rounded-full bg-white text-foreground border border-border"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {companyInfo.phone && (
                <div>
                  <p className="text-sm text-muted">Phone</p>
                  <a className="text-accent hover:underline" href={`tel:${companyInfo.phone}`}>
                    {companyInfo.phone}
                  </a>
                </div>
              )}
              {companyInfo.email && (
                <div>
                  <p className="text-sm text-muted">Email</p>
                  <a
                    className="text-accent hover:underline"
                    href={`mailto:${companyInfo.email}`}
                  >
                    {companyInfo.email}
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>

        {team.length > 0 && (
          <section>
            <h2 className="text-2xl font-heading text-primary mb-6">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
