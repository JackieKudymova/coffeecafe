/*
  Типы для раздела «Новости и акции».
  Используются на списке и на странице одной новости; позже — в ответе API.
*/

/* Одна новость: id приходит с бэкенда (Guid/int как string в JSON) */
export interface NewsArticle {
  id: string
  title: string
  image: string
  /** Краткий текст для карточки в списке */
  excerpt: string
  /** Полный текст статьи: абзацы в порядке вывода */
  content: string[]
  /** Дата публикации ISO (например 2026-03-03) */
  publishedAt: string
}
