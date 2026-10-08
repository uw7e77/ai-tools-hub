import { tutorials } from '../../data/tutorials'
import { TutorialCard } from '../cards/TutorialCard'
import { CardGrid } from '../ui/CardGrid'
import { SectionHeader } from '../ui/SectionHeader'

const featuredTutorials = tutorials.filter((tutorial) => tutorial.featured).slice(0, 3)

export function FeaturedTutorials() {
  // Nothing is flagged featured in the data — hide rather than render an empty section.
  if (featuredTutorials.length === 0) return null
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          title="Featured tutorials"
          description="Short, practical walkthroughs for the tools you want to learn."
          href="/tutorials"
          linkLabel="All tutorials"
        />
        <CardGrid
          items={featuredTutorials.map((tutorial) => (
            <TutorialCard key={tutorial.slug} tutorial={tutorial} />
          ))}
        />
      </div>
    </section>
  )
}
