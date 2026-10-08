import { AgentCard } from '../cards/AgentCard'
import { CardGrid } from '../ui/CardGrid'
import { SectionHeader } from '../ui/SectionHeader'
import { featuredAgentList } from '../../features/agents/listing'

export function FeaturedAgents() {
  // No agent is flagged featured in the data — hide rather than invent picks.
  if (featuredAgentList.length === 0) return null
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          title="Featured AI agents"
          description="AI systems that can actually perform tasks, not just chat."
          href="/agents"
          linkLabel="Explore AI agents"
        />
        <CardGrid items={featuredAgentList.slice(0, 3).map((agent) => <AgentCard key={agent.slug} agent={agent} />)} />
      </div>
    </section>
  )
}
