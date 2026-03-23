/*
  Сервис для получения последней акции.

  Сейчас возвращает моковые данные.
  Когда бэкенд будет готов — раскомментируй нужный вариант
  (WordPress или свой API) и поменяй API_URL.
*/

import type { Promo } from '../types/promo'
import { fallbackPromo } from '../data/mockPromo'

// URL бэкенда — поменяй когда будет готов
// const API_URL = '/wp-json/wp/v2/posts?categories=promo&per_page=1'  // WordPress
// const API_URL = '/api/promos/latest'                                 // Свой бэкенд

export async function fetchLatestPromo(): Promise<Promo> {
  // --- Пока бэкенда нет, возвращаем заглушку ---
  return fallbackPromo

  // --- WordPress вариант ---
  // try {
  //   const res = await fetch(API_URL)
  //   if (!res.ok) return fallbackPromo
  //   const posts = await res.json()
  //   if (!posts.length) return fallbackPromo
  //   const post = posts[0]
  //   return {
  //     id: String(post.id),
  //     title: post.title.rendered,
  //     description: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
  //     image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '',
  //     link: `/news/${post.slug}`,
  //   }
  // } catch {
  //   return fallbackPromo
  // }

  // --- Свой бэкенд вариант ---
  // try {
  //   const res = await fetch(API_URL)
  //   if (!res.ok) return fallbackPromo
  //   const data = await res.json()
  //   return {
  //     id: data.id,
  //     title: data.title,
  //     description: data.description,
  //     image: data.image,
  //     link: `/news/${data.slug}`,
  //   }
  // } catch {
  //   return fallbackPromo
  // }
}
