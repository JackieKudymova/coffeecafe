import { useCallback, useEffect, useState } from 'react'
import { fetchUsers, type UserAdminRow } from '../../services/adminService'
import AdminTable from '../../components/admin/AdminTable'
import AdminTextField from '../../components/admin/AdminTextField'
import Pagination from '../../components/Pagination'
import { formatAdminDateTime } from '../../utils/formatAdminDate'

const PAGE_SIZE = 20

/**
 * Учёт зарегистрированных пользователей.
 */
export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [items, setItems] = useState<UserAdminRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Запрос ввода - то, что в поле; query - то, по чему уже искали (на сервере).
  // Разделено, чтобы не дёргать API на каждое нажатие клавиши.
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetchUsers(page, PAGE_SIZE, query)
      setItems(res.items)
      setTotal(res.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }, [page, query])

  useEffect(() => {
    load()
  }, [load])

  function applySearch(e: React.FormEvent) {
    e.preventDefault()
    // При новом поиске откатываемся на первую страницу.
    setPage(1)
    setQuery(input)
  }

  return (
    <div>
      <h1 className="font-heading text-[36px] leading-[49px] tracking-[0.02em] text-cream uppercase mb-8">Пользователи</h1>

      <form
        onSubmit={applySearch}
        className="mb-6 flex flex-wrap items-end gap-3"
        noValidate
      >
        <div className="min-w-[260px] flex-1 max-w-md">
          <AdminTextField
            label="Поиск (имя, email)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Например: Анна или anna@mail.ru"
          />
        </div>
        <button
          type="submit"
          className="
            h-10 px-6 rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase text-sm tracking-wider
            transition-colors hover:bg-brown-button-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50
          "
        >
          Найти
        </button>
        {query ? (
          <button
            type="button"
            onClick={() => {
              setInput('')
              setQuery('')
              setPage(1)
            }}
            className="
              h-10 px-6 rounded-[10px] border border-cream/30 text-cream text-sm
              transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/25
            "
          >
            Сбросить
          </button>
        ) : null}
      </form>

      {error ? <p className="text-input-border-error mb-4">{error}</p> : null}
      {loading ? (
        <p className="text-cream-dark">Загрузка…</p>
      ) : items.length === 0 ? (
        <p className="text-cream-dark">{query ? 'Ничего не найдено.' : 'Пока никто не зарегистрировался.'}</p>
      ) : (
        <>
          <AdminTable>
            <thead className="bg-[#5a473b] text-cream text-sm uppercase tracking-wider">
              <tr>
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Имя</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Скидка, %</th>
                <th className="p-3 font-medium whitespace-nowrap">Регистрация</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t border-cream/10">
                  <td className="p-3 text-cream">{u.id}</td>
                  <td className="p-3 text-cream">{u.name}</td>
                  <td className="p-3 text-cream-dark break-all">{u.email}</td>
                  <td className="p-3 text-cream-dark">{u.discount}</td>
                  <td className="p-3 text-cream-dark text-sm whitespace-nowrap">
                    {formatAdminDateTime(u.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
          <Pagination
            className="mt-8"
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
