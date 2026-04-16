import { getPayloadClient } from '@/lib/payload'
import AgentCard from '@/components/AgentCard'

export const metadata = {
  title: 'Our Team | Tru International Realty Corp',
  description: 'Meet the experienced real estate professionals at Tru International Realty Corp.',
}

export default async function AgentsPage() {
  const payload = await getPayloadClient()

  const agents = await payload.find({
    collection: 'agents',
    where: { status: { equals: 'active' } },
    sort: 'sortOrder',
    limit: 100,
  })

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-2 text-center">Our Team</h1>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          Our dedicated team of real estate professionals brings decades of combined
          experience to help you achieve your real estate goals.
        </p>

        {agents.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {agents.docs.map((agent: any) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted py-12">No team members to display yet.</p>
        )}
      </div>
    </div>
  )
}
