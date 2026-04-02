/*
  Сервис новостей: список с пагинацией и одна запись по id.

  Сейчас данные из mockNews. Когда бэкенд будет готов — заменить на fetch к API.
*/

import type { NewsArticle } from '../types/news'
import { mockNews } from '../data/mockNews'

/** Сколько карточек на странице (должно совпадать с будущим query pageSize). */
export const NEWS_PAGE_SIZE = 3

export interface NewsPageResult {
  items: NewsArticle[]
  total: number
  page: number
  pageSize: number
}

// const API_URL = '/api/news'

export async function fetchNewsPage(
  page: number,
  pageSize: number = NEWS_PAGE_SIZE,
): Promise<NewsPageResult> {
  // --- Пока бэкенда нет ---
  const total = mockNews.length
  const start = (page - 1) * pageSize
  const items = mockNews.slice(start, start + pageSize)
  return Promise.resolve({ items, total, page, pageSize })

  // --- Свой бэкенд ---
  // try {
  //   const res = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`)
  //   if (!res.ok) throw new Error('news')
  //   return await res.json()
  // } catch {
  //   const total = mockNews.length
  //   const start = (page - 1) * pageSize
  //   return { items: mockNews.slice(start, start + pageSize), total, page, pageSize }
  // }
}

export async function fetchNewsById(id: string): Promise<NewsArticle | null> {
  const found = mockNews.find((a) => a.id === id)
  return Promise.resolve(found ?? null)

  // try {
  //   const res = await fetch(`${API_URL}/${id}`)
  //   if (res.status === 404) return null
  //   if (!res.ok) throw new Error('news')
  //   return await res.json()
  // } catch {
  //   return mockNews.find((a) => a.id === id) ?? null
  // }
}
