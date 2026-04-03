import { useEffect, useState } from 'react'
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
  type CategoryRow,
} from '../../services/adminService'
import AdminTable from '../../components/admin/AdminTable'

export default function AdminCategories() {
  const [rows, setRows] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [sortOrder, setSortOrder] = useState(0)

  async function load() {
    setError(null)
    try {
      const data = await fetchCategories()
      setRows(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await createCategory(name.trim(), sortOrder)
      setName('')
      setSortOrder(0)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-cream mb-8">Категории меню</h1>

      <form
        onSubmit={handleCreate}
        className="mb-8 flex flex-wrap items-end gap-4 rounded-[10px] bg-[#4b372b] border border-cream/15 p-4"
      >
        <label className="flex flex-col gap-1">
          <span className="text-cream-dark text-sm">Название</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 px-3 rounded-[10px] bg-input-bg text-cream min-w-[200px]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-cream-dark text-sm">Порядок</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="h-11 w-24 px-3 rounded-[10px] bg-input-bg text-cream"
          />
        </label>
        <button
          type="submit"
          className="h-11 px-6 rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase tracking-wider text-sm"
        >
          Добавить
        </button>
      </form>

      {error ? <p className="text-input-border-error mb-4">{error}</p> : null}
      {loading ? (
        <p className="text-cream-dark">Загрузка…</p>
      ) : (
        <AdminTable>
          <thead className="bg-[#5d483c] text-cream text-sm uppercase tracking-wider">
            <tr>
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Название</th>
              <th className="p-3 font-medium">Порядок</th>
              <th className="p-3 font-medium w-40">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <CategoryRowEditor key={r.id} row={r} onSaved={load} onError={setError} />
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  )
}

function CategoryRowEditor({
  row,
  onSaved,
  onError,
}: {
  row: CategoryRow
  onSaved: () => void
  onError: (msg: string | null) => void
}) {
  const [name, setName] = useState(row.name)
  const [sort, setSort] = useState(row.sort_order)

  async function save() {
    onError(null)
    try {
      await updateCategory(row.id, { name: name.trim(), sort_order: sort })
      await onSaved()
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  async function remove() {
    if (!confirm(`Удалить категорию «${row.name}» и все позиции в ней?`)) return
    onError(null)
    try {
      await deleteCategory(row.id)
      await onSaved()
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  return (
    <tr className="border-t border-cream/10">
      <td className="p-3 text-cream">{row.id}</td>
      <td className="p-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-xs h-9 px-2 rounded-[8px] bg-input-bg text-cream text-sm"
        />
      </td>
      <td className="p-3">
        <input
          type="number"
          value={sort}
          onChange={(e) => setSort(Number(e.target.value))}
          className="w-20 h-9 px-2 rounded-[8px] bg-input-bg text-cream text-sm"
        />
      </td>
      <td className="p-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void save()}
          className="px-3 py-1.5 rounded-[8px] bg-brown-button text-brown-dark text-xs font-medium uppercase"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={() => void remove()}
          className="px-3 py-1.5 rounded-[8px] border border-input-border-error text-input-border-error text-xs uppercase"
        >
          Удалить
        </button>
      </td>
    </tr>
  )
}
