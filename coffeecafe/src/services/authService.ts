/**
 * Запросы к /api/auth/* — личный кабинет клиента.
 * JWT хранится в localStorage отдельно от админского.
 */

export const USER_TOKEN_KEY = 'domkofe_user_token'

export function getUserToken(): string | null {
  return localStorage.getItem(USER_TOKEN_KEY)
}

export function setUserToken(token: string): void {
  localStorage.setItem(USER_TOKEN_KEY, token)
}

export function clearUserToken(): void {
  localStorage.removeItem(USER_TOKEN_KEY)
}

function jsonHeaders(): HeadersInit {
  const t = getUserToken()
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

export interface UserMe {
  id: number
  name: string
  email: string
  client_code: string
  discount: number
}

export async function userRegister(name: string, email: string, password: string): Promise<void> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = await res.json()
  setUserToken(data.access_token)
}

export async function userLogin(email: string, password: string): Promise<void> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = await res.json()
  setUserToken(data.access_token)
}

export async function userMe(): Promise<UserMe> {
  const res = await fetch('/api/auth/me', { headers: jsonHeaders() })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function userLogout(): Promise<void> {
  // Серверу токен «не нужен», но дёргаем эндпоинт для симметрии (и под будущий blacklist).
  // Игнорируем 401 — если токен уже истёк, всё равно чистим локалку.
  try {
    await fetch('/api/auth/logout', { method: 'POST', headers: jsonHeaders() })
  } catch {
    /* ignore */
  }
  clearUserToken()
}

export interface ResetPasswordResult {
  ok: boolean
  /** Возвращается только в dev-режиме (когда SMTP не настроен на бэке) — для удобства тестов. */
  dev_reset_link?: string | null
}

export async function userRequestPasswordReset(email: string): Promise<ResetPasswordResult> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function userConfirmPasswordReset(token: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/auth/reset-password/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = await res.json()
  setUserToken(data.access_token)
}
