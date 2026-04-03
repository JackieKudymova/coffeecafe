import { useEffect, useState } from 'react'

/** Совпадение с CSS media query. Для SSR/первого кадра — false, затем актуальное значение. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const sync = () => setMatches(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [query])

  return matches
}
