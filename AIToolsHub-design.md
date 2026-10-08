# AIToolsHub — Design System & Frontend Specification

> Version: 1.0  
> Project: AIToolsHub  
> Purpose: Single source of truth for the AI coding/design agent.  
> Visual direction: Premium dark AI directory — modern, fast, editorial, trustworthy, mobile-first.

---

## 1. Design Principles

AIToolsHub should feel like a **premium AI discovery platform**, not a generic SaaS dashboard.

Core principles:

1. Dark-first interface.
2. Strong visual hierarchy.
3. Search and discovery are the primary actions.
4. Cards must be information-dense but easy to scan.
5. Use one consistent component system across all pages.
6. Editorial content should feel trustworthy and human-curated.
7. Avoid excessive gradients, glassmorphism, giant shadows, and unnecessary animations.
8. Mobile-first responsive design.
9. Accessibility and readable contrast are mandatory.
10. Performance is a feature: avoid heavy effects and unnecessary JavaScript.

---

# 2. Brand Identity

## Brand Name

**AIToolsHub**

Suggested tagline:

**Discover, Compare & Learn the AI Tools That Actually Work.**

Alternative short tagline:

**Find the right AI tool, faster.**

Brand personality:

- Smart
- Modern
- Trustworthy
- Technical
- Helpful
- Editorial
- Practical

Avoid:

- childish
- overly futuristic
- crypto-style neon
- gaming UI
- excessive sci-fi effects

---

# 3. Color System

## Primary Background

```text
Background 950: #060B14
Background 900: #0A1020
Background 850: #0D1424
```

Use `#060B14` as the main page background.

## Surface Colors

```text
Surface 1: #0B1220
Surface 2: #101827
Surface 3: #141E30
Surface Hover: #18243A
```

Cards should normally use:

```text
#0D1626
```

## Borders

```text
Border: #1B2940
Border Strong: #263754
Border Hover: #344968
```

Use subtle 1px borders instead of heavy shadows.

## Text

```text
Primary Text: #F5F7FB
Secondary Text: #AAB6C8
Muted Text: #718096
Disabled Text: #4B5A70
```

## Brand Accent

Primary electric blue:

```text
Primary: #4F7CFF
Primary Hover: #6A91FF
Primary Soft: #172A5A
```

Secondary purple:

```text
Purple: #8B5CF6
Purple Soft: #26194F
```

Optional cyan:

```text
Cyan: #22D3EE
```

Use accent colors sparingly.

## Semantic Colors

```text
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444
Info: #38BDF8
```

Examples:

- Tested badge → Success
- New badge → Info/Cyan
- Paid → Warning
- Error → Danger

---

# 4. Typography

## Primary Font

Use:

**Inter**

Fallback:

```text
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

## Optional Display Font

For large marketing headings only:

**Manrope**

Do not mix more than two font families.

## Type Scale

```text
Display XL: 64px / 1.05 / 700
Display L: 52px / 1.08 / 700
H1: 44px / 1.1 / 700
H2: 32px / 1.2 / 700
H3: 24px / 1.25 / 650
H4: 20px / 1.3 / 650
Body Large: 18px / 1.6 / 400
Body: 16px / 1.6 / 400
Body Small: 14px / 1.5 / 400
Caption: 12px / 1.4 / 500
```

Mobile:

```text
Display: 38px
H1: 32px
H2: 26px
H3: 21px
Body: 15px
```

Headings should be tight and bold.

---

# 5. Layout System

## Desktop

Maximum content width:

```text
1280px
```

Wide hero sections may use:

```text
1440px
```

Page horizontal padding:

```text
Desktop: 32px
Tablet: 24px
Mobile: 16px
```

## Grid

Tool cards:

```text
Desktop: 4 columns
Large desktop: 4–5 columns where appropriate
Tablet: 2–3 columns
Mobile: 1 column
```

Tutorial cards:

```text
Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column
```

Company cards:

```text
Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column
```

## Spacing Scale

Use an 8px-based system:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
96px
120px
```

Avoid random spacing values.

---

# 6. Border Radius

```text
Small: 8px
Button: 10px
Input: 12px
Card: 16px
Large Card: 20px
Hero Container: 24px
Pill: 999px
```

Cards should feel soft but not excessively rounded.

---

# 7. Shadows

Default:

```text
No heavy shadow.
```

Hover:

```text
0 12px 40px rgba(0,0,0,0.22)
```

Use shadows only when they improve hierarchy.

Prefer borders and surface contrast.

---

# 8. Header

Desktop header:

```text
Height: 72px
```

Structure:

```text
[AIToolsHub Logo]

Tools
Categories
AI Agents
Companies
Tutorials
New
Compare

[Search] [Bookmarks]
```

Header behavior:

- Sticky on scroll.
- Background slightly transparent.
- Add backdrop blur only when needed.
- Bottom border: subtle.
- Mobile navigation becomes a menu/drawer.
- Search remains highly accessible.

Logo:

- Text logo or compact icon + wordmark.
- White primary text.
- Blue accent mark.

---

# 9. Global Search

Search is one of the most important components.

Desktop width:

```text
320–420px
```

Search input:

```text
Height: 44–48px
Background: #101827
Border: #1B2940
Radius: 12px
```

Autocomplete should group:

```text
Tools
Categories
AI Agents
Companies
Tutorials
```

Each result:

```text
[Logo] Name
       Short metadata
```

Keyboard:

```text
Arrow Up / Down
Enter
Escape
```

Mobile search should become a full-width prominent field.

---

# 10. Tool Card

Tool card is the primary reusable component.

## Structure

```text
┌─────────────────────────────────┐
│ [Logo]                 [Save]   │
│                                 │
│ Tool Name       ✓ Tested        │
│ Short description               │
│                                 │
│ ⭐ 4.8   •   Freemium           │
│                                 │
│ [Category] [Coding]             │
│                                 │
│ [View Tool →]                   │
└─────────────────────────────────┘
```

## Card Data

Required:

```text
name
logo
short description
category
pricing type
rating
tested status
tags
company
official URL
affiliate URL
```

Optional:

```text
review count
featured rank
new status
Pakistan availability
platforms
```

## Card rules

- Logo: 40–48px.
- Description: maximum 2–3 lines.
- Maximum 3 visible tags.
- CTA should be obvious.
- Entire card may be clickable, but external affiliate CTA must remain explicit.
- Save/bookmark icon in top-right.
- Tested badge should be visually distinct.

Hover:

```text
translateY(-2px)
border becomes brighter
subtle shadow
```

No dramatic scaling.

---

# 11. Tested Badge

AIToolsHub's trust signal.

```text
✓ Tested
```

Style:

```text
Background: rgba(34,197,94,.10)
Text: #4ADE80
Border: rgba(34,197,94,.25)
```

On detail pages:

```text
✓ Tested by AIToolsHub
Tested: Oct 5, 2026
```

Never claim a tool was tested if the database value is false.

---

# 12. Pricing Badges

```text
Free
Freemium
Paid
Open Source
Free Trial
```

Use compact pills.

Do not rely on color alone; always include text.

---

# 13. Homepage Layout

Route:

```text
/
```

Order:

1. Header
2. Hero
3. Search
4. Popular categories
5. Trending tools
6. Daily launches
7. AI agents
8. Companies
9. Tutorials
10. Newsletter
11. Footer

Hero:

```text
Eyebrow
Main heading
Supporting text
Large search
Popular searches
```

Hero should have subtle blue/purple atmospheric glow.

Do not fill the entire background with gradients.

---

# 14. Browse Tools

Route:

```text
/tools
```

Layout:

```text
Header
Page title
Search
Filter sidebar
Sort
Tool grid
Pagination
```

Filters:

```text
Category
Pricing
Tested only
Works in Pakistan
Platform
Tool type
```

Sort:

```text
Trending
Newest
A–Z
Rating
```

Desktop:

```text
Sidebar: 240–280px
Content: remaining width
```

Mobile:

Filters become a button + bottom sheet/drawer.

---

# 15. Category Hub

Route:

```text
/categories
```

Show all categories as visual cards.

Each category:

```text
Icon
Name
Description
Tool count
```

Example:

```text
Video AI
Create, edit and enhance videos with AI.
128 tools
```

---

# 16. Category Detail

Example:

```text
/category/video-ai
```

Layout:

```text
Breadcrumb
Category hero
Description
Best overall tool
Tool grid
New in this category
SEO content
FAQ
```

Hero should include:

```text
Category icon
Category name
Description
Tool count
```

---

# 17. Tool Detail Page

Example:

```text
/tool/elevenlabs
```

Structure:

```text
Breadcrumb

[Logo] Tool Name
       ✓ Tested
       Pricing
       Rating

One-line verdict

[Try Tool →]

Tabs:
Overview | Features | Pricing | Tutorial | Alternatives | FAQ

Main content
Sidebar / quick facts
```

Information:

```text
Overview
Features
Pricing
Pros
Cons
Best for
Platforms
Availability
Tutorial
Alternatives
FAQ
```

CTA:

Primary blue/purple.

Affiliate disclosure should be clear and non-intrusive.

---

# 18. AI Agents Hub

Route:

```text
/agents
```

Hero:

```text
AI Agents
AI systems that can actually perform tasks.
```

Agent cards should show:

```text
Logo
Agent name
What it can actually do
Capabilities
Difficulty
Pricing
```

Use checklist-style capabilities.

---

# 19. Agent Detail

Route:

```text
/agent/{slug}
```

Structure:

```text
Hero
Capabilities
What it can actually do
How it works
Setup difficulty
Pricing
Tools it uses
Agent vs chatbot
Tutorial
Pros / Cons
Alternatives
FAQ
```

Difficulty:

```text
Beginner
Intermediate
Advanced
Expert
```

Visual meter should be accessible and also contain text.

---

# 20. Companies Hub

Route:

```text
/companies
```

Company card:

```text
Logo
Company name
One-line mission
Tool count
Model count
Founded
```

Grid:

```text
3 columns desktop
2 tablet
1 mobile
```

---

# 21. Company Detail

Example:

```text
/company/openai
```

Hero:

```text
Logo
Company
Founded
HQ
Mission
Official website
```

Stats:

```text
Tools
Models
Tutorials
```

Special AIToolsHub feature:

## Models Timeline

Example:

```text
GPT-3 → GPT-3.5 → GPT-4 → GPT-4o → GPT-5
```

Timeline should be horizontal desktop and vertical mobile.

---

# 22. Tutorials Hub

Route:

```text
/tutorials
```

Filters:

```text
Tool
Difficulty
Topic
```

Tutorial card:

```text
Thumbnail
Title
Tool
Difficulty
Duration
```

---

# 23. Tutorial Detail

Layout:

```text
Breadcrumb
Title
Difficulty + duration
Video
Sticky chapter sidebar
Step-by-step content
Screenshots
Copy-paste prompt boxes
Tools used
Next tutorial
```

Prompt/code boxes:

```text
Monospace font
Dark surface
Copy button
```

---

# 24. Daily Launches

Route:

```text
/new
```

Feed:

```text
Oct 5
  Tool
  Tool
  Tool

Oct 4
  Tool
  Tool
```

Each launch:

```text
Logo
Name
Description
Category
NEW badge
Launch date
```

Include:

```text
Get this every morning
```

newsletter CTA.

---

# 25. Search Results

Route:

```text
/search?q=
```

Group:

```text
Tools
Agents
Companies
Tutorials
```

Each group has a "View all" link.

No results:

```text
No results for "..."
Try:
Popular categories
Trending tools
```

---

# 26. Compare Page

Example:

```text
/compare/chatgpt-vs-claude
```

Header:

```text
Tool A
VS
Tool B
```

Comparison table:

```text
Feature
Pricing
Free plan
Context
Coding
Images
Research
Integrations
Best for
```

Winner:

```text
AIToolsHub Winner
```

Use a subtle highlighted column.

---

# 27. Submit Tool

Route:

```text
/submit
```

Form fields:

```text
Tool name
Website
Category
Pricing
Description
Logo
Company
Email
```

Note:

```text
Free listing · Reviewed within 48 hours
```

Featured listing can be an optional paid upsell.

---

# 28. Static Pages

Routes:

```text
/about
/contact
/privacy
/terms
/advertise
```

Use one editorial document template.

Maximum content width:

```text
760–820px
```

Readable line height.

---

# 29. Newsletter

Newsletter component:

```text
Heading
Short benefit
Email input
Subscribe button
```

Do not use intrusive popups immediately.

Exit-intent popup:

```text
Once per 30 days
```

Store dismissal/subscription state appropriately.

---

# 30. Bookmark System

No account required.

Use:

```text
localStorage
```

State:

```text
bookmarkedTools: []
```

Bookmark button:

```text
outline icon → filled icon
```

Provide a bookmark page or drawer if implemented.

---

# 31. Voting System

Tool detail:

```text
Was this helpful?

👍 Yes
👎 No
```

Store local state initially.

Do not allow repeated votes from the same browser without handling state.

---

# 32. Responsive Rules

## Desktop

```text
≥ 1200px
```

Full navigation.

Multi-column grids.

Sidebar filters.

## Tablet

```text
768–1199px
```

Reduce columns.

Collapse some navigation.

## Mobile

```text
< 768px
```

Single-column content.

Bottom-sheet filters.

Compact header.

Search full width.

Buttons minimum:

```text
44px height
```

Cards must remain readable without horizontal scrolling.

Never create horizontal page overflow.

---

# 33. Mobile Navigation

Mobile header:

```text
Logo       Search   Menu
```

Menu:

```text
Tools
Categories
AI Agents
Companies
Tutorials
New
Compare
Submit Tool
```

Use a clean slide-down/drawer.

---

# 34. Icons

Use:

**Lucide Icons**

Style:

```text
2px stroke
rounded
minimal
```

Avoid mixing multiple icon libraries.

---

# 35. Images & Logos

Tool logos:

```text
assets/logos/
```

Suggested naming:

```text
assets/logos/chatgpt.png
assets/logos/claude.png
assets/logos/runway.png
```

Recommended display:

```text
40x40
48x48
64x64
```

Always provide:

```text
alt="{Tool Name} logo"
```

Use optimized WebP/PNG/SVG where licensing permits.

Do not hotlink random logo images.

---

# 36. Image Treatment

Tool logos:

```text
object-fit: contain
```

Tutorial thumbnails:

```text
16:9
object-fit: cover
```

Company logos:

```text
contain
```

Do not crop logos.

---

# 37. Buttons

Primary:

```text
Background: #4F7CFF
Text: #FFFFFF
Radius: 10px
```

Hover:

```text
#6A91FF
```

Secondary:

```text
Background: #101827
Border: #263754
Text: #F5F7FB
```

Ghost:

```text
Transparent
```

Danger:

```text
#EF4444
```

Buttons should have clear verbs:

```text
Try Tool
View Tool
Compare
Read Tutorial
Submit Tool
Explore Category
```

Avoid:

```text
Click Here
Learn More
Submit
```

when a more descriptive label is possible.

---

# 38. Motion

Animation should be subtle.

Recommended:

```text
150–250ms
ease-out
```

Use for:

- hover
- dropdown
- modal
- filter drawer
- bookmark
- button state

Avoid:

- constant floating animations
- excessive parallax
- large page transitions
- distracting glowing elements

Respect:

```text
prefers-reduced-motion
```

---

# 39. Loading States

Use skeletons matching the final card shape.

Do not use giant loading spinners for normal content.

Tool card skeleton:

```text
logo skeleton
title skeleton
description skeleton
metadata skeleton
button skeleton
```

---

# 40. Empty States

Every listing must have a useful empty state.

Example:

```text
No AI tools found.

Try removing some filters or searching another category.

[Clear Filters]
```

---

# 41. Error States

Example:

```text
Something went wrong.

We couldn't load these tools right now.

[Try Again]
```

Do not expose technical errors to normal users.

---

# 42. Accessibility

Mandatory:

- WCAG-conscious contrast.
- Keyboard navigation.
- Visible focus states.
- Semantic HTML.
- Labels for inputs.
- Alt text.
- Buttons must have accessible names.
- Do not use color as the only information.
- Minimum 44px touch targets.
- Respect reduced motion.

Focus ring:

```text
2px #4F7CFF
```

---

# 43. SEO UI Rules

Every page template must support:

```text
SEO title
Meta description
Canonical URL
Open Graph image
Schema markup
Breadcrumbs
```

Tool pages should support:

```text
SoftwareApplication schema
Review/Rating where legitimate
FAQ schema where eligible
```

Category pages:

```text
BreadcrumbList
FAQ where applicable
```

Tutorial pages:

```text
Article
HowTo where appropriate
VideoObject where appropriate
```

Never generate fake reviews or ratings.

---

# 44. Affiliate CTA Rules

Primary CTA:

```text
Try {Tool Name} →
```

Secondary:

```text
Visit Website
```

Affiliate links should be centrally manageable.

The UI should not hide that a link may be an affiliate link.

---

# 45. WordPress / ACF Data Model

Recommended Custom Post Types:

```text
tool
agent
company
tutorial
launch
```

Taxonomies:

```text
category
tool_type
pricing_type
platform
tag
```

Tool fields:

```text
name
slug
logo
short_description
long_description
official_url
affiliate_url
company
category
subcategory
pricing_type
starting_price
free_plan
free_trial
rating
review_count
tested
tested_date
pakistan_available
vpn_required
platforms
tags
features
pros
cons
best_for
tutorial
alternatives
faq
featured
status
```

Analytics fields should preferably be stored separately rather than bloating editorial content records.

---

# 46. Data Rules

Never invent information.

If unknown:

```json
null
```

For arrays:

```json
[]
```

Normalize categories.

Do not create duplicate tools.

Use canonical slugs:

```text
lowercase-hyphenated
```

Example:

```text
elevenlabs
runway
chatgpt
google-gemini
```

---

# 47. Content Quality

Descriptions should be:

- concise
- factual
- useful
- human-readable
- free of exaggerated marketing language

Bad:

```text
The world's most revolutionary AI that will change everything!
```

Good:

```text
AI voice platform for generating and editing realistic speech, voiceovers and conversational audio.
```

---

# 48. Performance

Priorities:

1. Fast initial HTML.
2. Optimized images.
3. Lazy-load below-the-fold media.
4. Avoid unnecessary client-side JavaScript.
5. Avoid huge animation libraries.
6. Use responsive images.
7. Cache static assets.
8. Keep content pages lightweight.

Target:

```text
LCP: as fast as practical
CLS: minimal
INP: responsive
```

---

# 49. Component Architecture

Recommended reusable components:

```text
Layout
├── Header
├── MobileNav
├── Footer
├── SearchBar
├── SearchAutocomplete
│
├── ToolCard
├── ToolGrid
├── ToolBadge
├── PricingBadge
├── TestedBadge
├── BookmarkButton
├── Rating
│
├── CategoryCard
├── AgentCard
├── CompanyCard
├── TutorialCard
├── LaunchCard
│
├── FilterSidebar
├── SortDropdown
├── Pagination
├── Breadcrumbs
│
├── CTAButton
├── Newsletter
├── EmptyState
├── ErrorState
└── SkeletonCard
```

Do not build separate versions of the same component for every page.

---

# 50. Page Template Architecture

Use data-driven templates.

```text
Homepage
Browse Tools
Category Template
Tool Template
Agent Hub
Agent Template
Company Hub
Company Template
Tutorial Hub
Tutorial Template
Launch Template
Search Template
Compare Template
Submit Template
Static Template
404
```

The same template should render many records.

Example:

```text
Tool Template
    ↓
ChatGPT
Claude
Gemini
ElevenLabs
Runway
...
```

Do not duplicate page code.

---

# 51. Final Visual Direction

The final site should look like:

```text
Premium AI directory
+
Modern editorial publication
+
Fast SaaS product
```

Visual keywords:

```text
dark
clean
premium
technical
editorial
trustworthy
minimal
sharp
modern
AI-native
```

The interface should feel **high quality without looking over-designed**.

---

# 52. AI Coding Agent Rules

When implementing the website:

1. Follow this document before inventing new styles.
2. Reuse existing components.
3. Do not introduce random colors.
4. Do not introduce random fonts.
5. Do not change border-radius conventions.
6. Keep desktop and mobile behavior consistent.
7. Use the same ToolCard everywhere.
8. Use data-driven templates.
9. Keep content separate from UI.
10. Do not hardcode tool information inside components.
11. Use semantic HTML.
12. Optimize images.
13. Preserve accessibility.
14. Do not add unnecessary dependencies.
15. Do not redesign an existing component unless required.
16. If a new component is necessary, match this design system.
17. Keep the interface visually consistent across every route.
18. Before finishing a page, check desktop, tablet and mobile layouts.
19. Use realistic content lengths when testing layouts.
20. Never invent factual tool data.

---

# 53. Definition of Done

A page is complete only when:

- Layout matches the AIToolsHub design system.
- Typography is consistent.
- Colors use the defined tokens.
- Cards use shared components.
- Mobile layout works.
- Keyboard navigation works.
- Loading state exists where needed.
- Empty state exists where needed.
- Images have alt text.
- Buttons have clear actions.
- SEO metadata can be populated.
- No horizontal overflow.
- No duplicated template logic.
- No console errors.
- Performance is reasonable.

---

## Final Instruction to the AI Agent

**Build AIToolsHub as one coherent design system, not as a collection of unrelated pages.**

When creating any new page or component, first reuse the existing tokens, components and templates from this specification. The primary goals are **discoverability, trust, speed, readability and consistent visual quality**.
