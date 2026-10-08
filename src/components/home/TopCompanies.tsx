import { companies } from '../../data/companies'
import { tools } from '../../data/tools'
import { companyByName, normalizeCompanyName } from '../../data/lookups'
import { CompanyCard } from '../cards/CompanyCard'
import { CardGrid } from '../ui/CardGrid'
import { SectionHeader } from '../ui/SectionHeader'

// tool.company is free text from the DB — resolve it through the name map so
// counts reflect real matches instead of comparing names against slugs.
const topCompanies = companies
  .map((company) => ({
    company,
    toolCount: tools.filter(
      (tool) =>
        tool.company !== null &&
        companyByName.get(normalizeCompanyName(tool.company))?.slug === company.slug,
    ).length,
  }))
  .sort((a, b) => b.toolCount - a.toolCount)
  .slice(0, 6)

export function TopCompanies() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          title="AI companies"
          description="The labs and platforms shipping the tools in this directory."
          href="/companies"
          linkLabel="All companies"
        />
        <CardGrid
          items={topCompanies.map(({ company, toolCount }) => (
            <CompanyCard key={company.slug} company={company} toolCount={toolCount} />
          ))}
        />
      </div>
    </section>
  )
}
