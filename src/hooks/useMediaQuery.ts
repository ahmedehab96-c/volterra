import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const on = () => setMatch(mql.matches)
    mql.addEventListener('change', on)
    return () => mql.removeEventListener('change', on)
  }, [query])
  return match
}

export const MOBILE_QUERY = '(max-width: 767px), (pointer: coarse)'
