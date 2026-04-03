/*
  Сервис для получения последней акции: GET /api/promos/latest.
*/

import type { Promo } from '../types/promo'
import { fallbackPromo } from '../data/mockPromo'

const API_URL = '/api/promos/latest'

export async function fetchLatestPromo(): Promise<Promo> {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) return fallbackPromo
    const data = await res.json()
    return {
      id: String(data.id),
      title: data.title,
      description: data.description,
      image: data.image ?? '',
      link: data.link ?? `/news/${data.id}`,
    }
  } catch {
    return fallbackPromo
  }
}
