import { tools } from '../../data/tools'
import { ToolGrid } from '../cards/ToolGrid'
import { SectionHeader } from '../ui/SectionHeader'

const trendingTools = tools
  .filter((tool) => tool.featuredRank !== undefined)
  .sort((a, b) => (a.featuredRank ?? Number.MAX_SAFE_INTEGER) - (b.featuredRank ?? Number.MAX_SAFE_INTEGER))
  .slice(0, 8)

export function TrendingTools() {
  // No verified rankings exist yet — hide the section rather than invent them.
  if (trendingTools.length === 0) return null
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          title="Trending AI tools"
          description="The tools readers open, compare and save the most this week."
          href="/categories"
          linkLabel="Browse all tools"
        />
        <ToolGrid tools={trendingTools} />
      </div>
    </section>
  )
}
