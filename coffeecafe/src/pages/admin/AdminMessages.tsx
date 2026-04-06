import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMessages, type MessageRow } from '../../services/adminService'
import AdminTable from '../../components/admin/AdminTable'
import AdminRowActionsMenu from '../../components/admin/AdminRowActionsMenu'
import Pagination from '../../components/Pagination'

const PAGE_SIZE = 10

function sortMessagesByDate(items: MessageRow[]): MessageRow[] {
  return [...items].sort((a, b) => {
    const ta = a.created_at ? new Date(a.created_at).getTime() : 0
    const tb = b.created_at ? new Date(b.created_at).getTime() : 0
    return tb - ta
  })
}

export default function AdminMessages() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [items, setItems] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent === true
    setError(null)
    if (!silent) setLoading(true)
    try {
      const res = await fetchMessages(page, PAGE_SIZE)
      setItems(sortMessagesByDate(res.items))
      setTotal(res.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [page])

  useEffect(() => {
    load()
  }, [load])

  function openDetail(row: MessageRow) {
    navigate(`/admin/messages/${row.id}`)
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
                <th className="p-3 font-medium min-w-[180px] whitespace-nowrap">Телефон</th>
                <th className="p-3 font-medium min-w-0">Сообщение</th>
                <th className="p-3 font-medium">Прочитано</th>
                <th className="p-3 font-medium w-14 text-right pr-4">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr
                  key={m.id}
                  className="border-t border-cream/10 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  onClick={() => openDetail(m)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openDetail(m)
                    }
                  }}
                >
                  <td className="p-3 text-cream-dark text-sm whitespace-nowrap">
                    {m.created_at ? new Date(m.created_at).toLocaleString('ru-RU') : '—'}
                  </td>
                  <td className="p-3 text-cream">{m.name}</td>
                  <td className="p-3 text-cream-dark whitespace-nowrap font-mono text-sm tracking-tight">
                    {m.phone}
                  </td>
                  <td className="p-3 text-cream-dark max-w-xs min-w-0 truncate" title={m.message ?? ''}>
                    {m.message ?? '—'}
                  </td>
                  <td className="p-3 text-cream-dark">{m.is_read ? 'да' : 'нет'}</td>
                  <td className="p-2 align-middle">
                    <AdminRowActionsMenu
                      items={[
                        {
                          key: 'detail',
                          label: 'Подробнее',
                          onClick: () => openDetail(m),
                        },
                      ]}
                    />
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
