import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Company } from '../../types'
import { BrandLogo } from '../ui/BrandLogo'
import { ButtonLink } from '../ui/Button'
import css from './CompanyCard.module.css'

interface CompanyCardProps {
  company: Company
  toolCount: number
}

export function CompanyCard({ company, toolCount }: CompanyCardProps) {
  return (
    <article className={css.card}>
      <div className={css.top}>
        <BrandLogo logo={company.logo} name={company.name} />
        <div className={css.heading}>
          <h3 className={css.title}>
            <Link to={`/company/${company.slug}`}>{company.name}</Link>
          </h3>
          {company.hq ? <p className={css.hq}>{company.hq}</p> : null}
        </div>
      </div>
      <p className={css.mission}>{company.description}</p>
      {company.products.length > 0 ? (
        <p className={css.products}>
          {company.products.slice(0, 3).join(' · ')}
        </p>
      ) : null}
      <div className={css.footer}>
        {/* toolCount comes from a free-text company match that currently
            resolves to 0 for every company — hide it rather than show a
            misleading "0 tools listed" on every card. */}
        {company.founded != null || toolCount > 0 ? (
          <p className={css.stats}>
            {company.founded != null ? (
              <>
                Founded {company.founded}
                {toolCount > 0 ? <span className={css.dot} aria-hidden="true" /> : null}
              </>
            ) : null}
            {toolCount > 0 ? `${toolCount} ${toolCount === 1 ? 'tool' : 'tools'} listed` : null}
          </p>
        ) : null}
        <ButtonLink
          className={css.cta}
          variant="secondary"
          to={`/company/${company.slug}`}
        >
          View Company
          <ArrowRight size={14} aria-hidden="true" />
        </ButtonLink>
      </div>
    </article>
  )
}
