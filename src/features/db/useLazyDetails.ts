import { useEffect, useState } from 'react'
import { db, loadAgentDetails, loadToolDetails } from '../../data/db'

/**
 * Detail records live in big JSON files that load lazily. Detail pages call
 * these hooks and render their skeleton until the data is in; afterwards the
 * shared db object is fully populated (merged in place), so plain lookups work.
 */
export function useToolDetailsReady(): boolean {
  const [ready, setReady] = useState(db.toolDetailsLoaded)
  useEffect(() => {
    if (db.toolDetailsLoaded) {
      setReady(true)
      return
    }
    let alive = true
    loadToolDetails()
      .then(() => {
        if (alive) setReady(true)
      })
      .catch(() => {
        if (alive) setReady(true)
      })
    return () => {
      alive = false
    }
  }, [])
  return ready
}

export function useAgentDetailsReady(): boolean {
  const [ready, setReady] = useState(db.agentDetailsLoaded)
  useEffect(() => {
    if (db.agentDetailsLoaded) {
      setReady(true)
      return
    }
    let alive = true
    loadAgentDetails()
      .then(() => {
        if (alive) setReady(true)
      })
      .catch(() => {
        if (alive) setReady(true)
      })
    return () => {
      alive = false
    }
  }, [])
  return ready
}
