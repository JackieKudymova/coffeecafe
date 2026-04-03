/*
  Сервис для получения меню с бэкенда GET /api/menu.
*/

import type { MenuCategory } from '../types/menu'
import { mockMenu } from '../data/mockMenu'

const API_URL = '/api/menu'

export async function fetchMenu(): Promise<MenuCategory[]> {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) return mockMenu
    return await res.json()
  } catch {
    return mockMenu
  }
}
