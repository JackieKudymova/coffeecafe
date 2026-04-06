/**
 * Запросы к защищённым эндпоинтам /api/admin/* (JWT в localStorage).
 */

export const ADMIN_TOKEN_KEY = 'domkofe_admin_token'

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

function jsonHeaders(): HeadersInit {
  const t = getAdminToken()
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (t) h.Authorization = `Bearer ${t}`
  return h
}

async function parseError(res: Response): Promise<string> {
  try {
    const j = await res.json()
    if (j && typeof j.detail === 'string') return j.detail
  } catch {
    /* ignore */
  }
  return `Ошибка ${res.status}`
}

export async function adminLogin(username: string, password: string): Promise<void> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = await res.json()
  setAdminToken(data.access_token)
}

export async function adminMe(): Promise<{ username: string }> {
  const res = await fetch('/api/admin/me', { headers: jsonHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export interface AdminStats {
  menu_items_count: number
  published_news_count: number
  unread_messages_count: number
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await fetch('/api/admin/stats', { headers: jsonHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export interface CategoryRow {
  id: string
  name: string
  sort_order: number
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  const res = await fetch('/api/admin/categories', { headers: jsonHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function createCategory(name: string, sort_order: number): Promise<CategoryRow> {
  const res = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ name, sort_order }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateCategory(
  id: string,
  body: { name?: string; sort_order?: number },
): Promise<CategoryRow> {
  const res = await fetch(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', headers: jsonHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
}

export interface MenuVariantRow {
  label: string
  price: number
}

export interface MenuItemRow {
  id: string
  category_id: string
  name: string
  image: string | null
  sort_order: number
  is_visible: boolean
  variants: MenuVariantRow[]
  createdAt?: string | null
}

export async function fetchItems(categoryId?: string): Promise<MenuItemRow[]> {
  const q = categoryId ? `?category_id=${categoryId}` : ''
  const res = await fetch(`/api/admin/items${q}`, { headers: jsonHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function createItem(payload: {
  category_id: number
  name: string
  image: string | null
  sort_order: number
  is_visible: boolean
  variants: { label: string; price: number; sort_order: number }[]
}): Promise<MenuItemRow> {
  const res = await fetch('/api/admin/items', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateItem(
  id: string,
  payload: {
    category_id?: number
    name?: string
    image?: string | null
    sort_order?: number
    is_visible?: boolean
    variants?: { label: string; price: number; sort_order: number }[]
  },
): Promise<MenuItemRow> {
  const res = await fetch(`/api/admin/items/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`/api/admin/items/${id}`, { method: 'DELETE', headers: jsonHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
}

export async function uploadImage(file: File, kind: 'menu' | 'news'): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('kind', kind)
  const t = getAdminToken()
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: t ? { Authorization: `Bearer ${t}` } : {},
    body: fd,
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = await res.json()
  return data.path as string
}

export interface NewsAdminRow {
  id: string
  title: string
  excerpt: string
  content: string[]
  image: string | null
  is_published: boolean
  publishedAt: string | null
  createdAt?: string | null
}

export async function fetchAdminNews(): Promise<NewsAdminRow[]> {
  const res = await fetch('/api/admin/news', { headers: jsonHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function createNews(payload: {
  title: string
  excerpt: string
  content: string[]
  image: string | null
  is_published: boolean
  published_at: string | null
}): Promise<NewsAdminRow> {
  const res = await fetch('/api/admin/news', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function updateNews(
  id: string,
  payload: Partial<{
    title: string
    excerpt: string
    content: string[]
    image: string | null
    is_published: boolean
    published_at: string | null
  }>,
): Promise<NewsAdminRow> {
  const res = await fetch(`/api/admin/news/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteNews(id: string): Promise<void> {
  const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE', headers: jsonHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
}

export interface MessageRow {
  id: string
  name: string
  phone: string
  message: string | null
  created_at: string
  is_read: boolean
}

export async function fetchMessages(
  page: number,
  pageSize: number,
): Promise<{ items: MessageRow[]; total: number; page: number; pageSize: number }> {
  const res = await fetch(`/api/admin/messages?page=${page}&pageSize=${pageSize}`, {
    headers: jsonHeaders(),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function markMessageRead(id: string): Promise<void> {
  const res = await fetch(`/api/admin/messages/${id}/read`, {
    method: 'PUT',
    headers: jsonHeaders(),
  })
  if (!res.ok) throw new Error(await parseError(res))
}

export async function fetchMessage(id: string): Promise<MessageRow> {
  const res = await fetch(`/api/admin/messages/${id}`, {
    headers: jsonHeaders(),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function patchMessageRead(id: string, isRead: boolean): Promise<MessageRow> {
  const res = await fetch(`/api/admin/messages/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify({ is_read: isRead }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`/api/admin/messages/${id}`, {
    method: 'DELETE',
    headers: jsonHeaders(),
  })
  if (!res.ok) throw new Error(await parseError(res))
}
