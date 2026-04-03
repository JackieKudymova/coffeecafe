/*
  Сервис новостей: список с пагинацией и одна запись по id (GET /api/news).
*/

import type { NewsArticle } from '../types/news'
import { mockNews } from '../data/mockNews'

/** Сколько карточек по умолчанию (мобила и десктоп lg+). */
export const NEWS_PAGE_SIZE = 3

/** Планшет 768–1023px: 4 карточки на странице (по сетке). */
export const NEWS_PAGE_SIZE_TABLET = 4

/** Размер страницы в зависимости от ширины окна (SSR: 3). */
export function getNewsPageSizeForViewport(): number {
  if (typeof window === 'undefined') return NEWS_PAGE_SIZE
  const w = window.innerWidth
  if (w >= 768 && w < 1024) return NEWS_PAGE_SIZE_TABLET
  return NEWS_PAGE_SIZE
}

export interface NewsPageResult {
  items: NewsArticle[]
  total: number
  page: number
  pageSize: number
}

const API_BASE = '/api/news'

export async function fetchNewsPage(
  page: number,
  pageSize: number = NEWS_PAGE_SIZE,
): Promise<NewsPageResult> {
  try {
    const res = await fetch(`${API_BASE}?page=${page}&pageSize=${pageSize}`)
    if (!res.ok) throw new Error('news')
    return await res.json()
  } catch {
    const total = mockNews.length
    const start = (page - 1) * pageSize
    const items = mockNews.slice(start, start + pageSize)
    return { items, total, page, pageSize }
  }
}

export async function fetchNewsById(id: string): Promise<NewsArticle | null> {
  try {
    const res = await fetch(`${API_BASE}/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error('news')
    return await res.json()
  } catch {
    return mockNews.find((a) => a.id === id) ?? null
  }
}
