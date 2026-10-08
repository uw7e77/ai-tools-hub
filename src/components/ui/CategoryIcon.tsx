import {
  AudioLines,
  BookOpen,
  Bot,
  BrainCircuit,
  Briefcase,
  Clapperboard,
  Code,
  Heart,
  Image,
  ListChecks,
  Megaphone,
  MessageSquare,
  Palette,
  PenLine,
  Shield,
  Telescope,
  Terminal,
  TrendingUp,
  Video,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  Bot,
  Image,
  Clapperboard,
  AudioLines,
  Code,
  PenLine,
  Palette,
  ListChecks,
  Telescope,
  Terminal,
  Megaphone,
  BrainCircuit,
  // Icons used by the generated category data (from the DB's icon names).
  Zap,
  MessageSquare,
  Video,
  TrendingUp,
  Briefcase,
  BookOpen,
  Heart,
  Shield,
}

interface CategoryIconProps {
  name: string
  size?: number
  className?: string
}

export function CategoryIcon({ name, size = 16, className }: CategoryIconProps) {
  const Icon = icons[name] ?? Bot
  return <Icon size={size} className={className} aria-hidden="true" />
}
