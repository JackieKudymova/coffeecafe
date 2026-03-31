/*
  Сервис для получения меню.

  Сейчас возвращает моковые данные.
  Когда бэкенд будет готов — раскомментируй нужный вариант и поменяй API_URL.
*/

import type { MenuCategory } from '../types/menu'
import { mockMenu } from '../data/mockMenu'

// URL бэкенда — поменяй когда будет готов
// const API_URL = '/api/menu'

export async function fetchMenu(): Promise<MenuCategory[]> {
  // --- Пока бэкенда нет, возвращаем заглушку ---
  return mockMenu

  // --- Свой бэкенд вариант ---
  // try {
  //   const res = await fetch(API_URL)
  //   if (!res.ok) return mockMenu
  //   return await res.json()
  // } catch {
  //   return mockMenu
  // }
}
