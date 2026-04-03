import { useCallback, useEffect, useState } from 'react'
import {
  deleteMessage,
  fetchMessages,
  markMessageRead,
  type MessageRow,
} from '../../services/adminService'
import AdminTable from '../../components/admin/AdminTable'
import Pagination from '../../components/Pagination'

const PAGE_SIZE = 10

export default function AdminMessages() {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [items, setItems] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetchMessages(page, PAGE_SIZE)
      setItems(res.items)
      setTotal(res.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    load()
  }, [load])

  async function markRead(id: string) {
    setError(null)
    try {
      await markMessageRead(id)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  async function remove(id: string) {
    if (!confirm('Удалить обращение?')) return
    setError(null)
    try {
      await deleteMessage(id)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-cream mb-8">Обращения</h1>
      {error ? <p className="text-input-border-error mb-4">{error}</p> : null}
      {loading ? (
        <p className="text-cream-dark">Загрузка…</p>
      ) : (
        <>
          <AdminTable>
            <thead className="bg-[#5d483c] text-cream text-sm uppercase tracking-wider">
              <tr>
                <th className="p-3 font-medium">Дата</th>
                <th className="p-3 font-medium">Имя</th>
                <th className="p-3 font-medium">Телефон</th>
                <th className="p-3 font-medium">Сообщение</th>
                <th className="p-3 font-medium">Прочитано</th>
                <th className="p-3 font-medium w-44">Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t border-cream/10">
                  <td className="p-3 text-cream-dark text-sm whitespace-nowrap">
                    {m.created_at ? new Date(m.created_at).toLocaleString('ru-RU') : '—'}
                  </td>
                  <td className="p-3 text-cream">{m.name}</td>
                  <td className="p-3 text-cream-dark">{m.phone}</td>
                  <td className="p-3 text-cream-dark max-w-xs truncate" title={m.message ?? ''}>
                    {m.message ?? '—'}
                  </td>
                  <td className="p-3 text-cream-dark">{m.is_read ? 'да' : 'нет'}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    {!m.is_read ? (
                      <button
                        type="button"
                        onClick={() => void markRead(m.id)}
                        className="px-3 py-1.5 rounded-[8px] bg-brown-button text-brown-dark text-xs font-medium uppercase"
                      >
                        Прочитано
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void remove(m.id)}
                      className="px-3 py-1.5 rounded-[8px] border border-input-border-error text-input-border-error text-xs uppercase"
                    >
                      Удалить
                    </button>
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
