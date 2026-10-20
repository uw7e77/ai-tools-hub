// Community YouTube tutorials for complex tools, embedded on tool pages.
// These are third-party videos picked for beginner-friendliness, not produced
// or fully verified by AIToolsHub. The list lives in the JSON database
// (public/data/tool-videos.json), loaded at runtime by src/data/db.ts.
import { db } from './db'

export interface ToolVideo {
  slug: string
  youtubeId: string
  title: string
  channel: string | null
}

export const toolVideos: ToolVideo[] = db.toolVideos

export const toolVideoBySlug = new Map(toolVideos.map((video) => [video.slug, video]))
