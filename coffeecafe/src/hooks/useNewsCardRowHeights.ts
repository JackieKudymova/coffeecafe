/*
  Выравнивание высот заголовка и анонса по строкам сетки (как самый высокий в ряду).
  Брейкпоинты как у Tailwind: 1 / 2 / 3 колонки.
*/

import { type RefObject, useLayoutEffect } from 'react'

function gridColumnCount(): number {
  if (typeof window === 'undefined') return 1
  const w = window.innerWidth
  if (w >= 1024) return 3
  if (w >= 768) return 2
  return 1
}

function syncRowHeights(grid: HTMLElement) {
  const articles = [...grid.querySelectorAll<HTMLElement>('[data-news-card]')]
  const cols = gridColumnCount()

  const titles = articles
    .map((a) => a.querySelector<HTMLElement>('[data-news-title]'))
    .filter(Boolean) as HTMLElement[]
  const excerpts = articles
    .map((a) => a.querySelector<HTMLElement>('[data-news-excerpt]'))
    .filter(Boolean) as HTMLElement[]

  titles.forEach((el) => {
    el.style.minHeight = ''
  })
  excerpts.forEach((el) => {
    el.style.minHeight = ''
  })

  if (cols === 1 || articles.length === 0) return

  void grid.offsetHeight

  for (let i = 0; i < articles.length; i += cols) {
    const row = articles.slice(i, i + cols)
    const rowTitles = row
      .map((a) => a.querySelector<HTMLElement>('[data-news-title]'))
      .filter(Boolean) as HTMLElement[]
    const rowExcerpts = row
      .map((a) => a.querySelector<HTMLElement>('[data-news-excerpt]'))
      .filter(Boolean) as HTMLElement[]

    if (rowTitles.length === 0) continue

    const maxTitle = Math.max(...rowTitles.map((el) => el.getBoundingClientRect().height))
    const maxExcerpt = Math.max(...rowExcerpts.map((el) => el.getBoundingClientRect().height))

    rowTitles.forEach((el) => {
      el.style.minHeight = `${maxTitle}px`
    })
    rowExcerpts.forEach((el) => {
      el.style.minHeight = `${maxExcerpt}px`
    })
  }
}

export function useNewsCardRowHeights(
  gridRef: RefObject<HTMLElement | null>,
  itemCount: number,
  page: number,
  pageSize: number,
) {
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const run = () => {
      syncRowHeights(grid)
    }

    run()
    const ro = new ResizeObserver(run)
    ro.observe(grid)
    window.addEventListener('resize', run)

    let cancelled = false
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) run()
      })
    }

    return () => {
      cancelled = true
      ro.disconnect()
      window.removeEventListener('resize', run)
      grid.querySelectorAll<HTMLElement>('[data-news-title]').forEach((el) => {
        el.style.minHeight = ''
      })
      grid.querySelectorAll<HTMLElement>('[data-news-excerpt]').forEach((el) => {
        el.style.minHeight = ''
      })
    }
  }, [gridRef, itemCount, page, pageSize])
}
