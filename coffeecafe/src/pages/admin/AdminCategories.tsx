/**
 * Раздел «Категории меню» в админке отключён: маршрут /admin/categories и пункт в AdminSidebar не подключены.
 * Чтобы снова включить: импорт AdminCategories в App.tsx, <Route path="categories" element={<AdminCategories />} />,
 * NavLink в AdminSidebar на /admin/categories.
 */
import { useEffect, useState } from 'react'
import {
  deleteCategory,
  fetchCategories,
  updateCategory,
  type CategoryRow,
} from '../../services/adminService'
import AdminTable from '../../components/admin/AdminTable'
import AdminRowActionsMenu from '../../components/admin/AdminRowActionsMenu'
import { adminInputClassName } from '../../components/admin/adminFieldStyles'

export default function AdminCategories() {
  const [rows, setRows] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div>
      <h1 className="font-heading text-3xl text-cream mb-8">Категории меню</h1>

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
              <th className="p-3 font-medium w-14 text-right pr-4">
                <span className="sr-only">Действия</span>
              </th>
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

const compactInput = `${adminInputClassName} !h-9 !mt-0 !px-2 !text-sm`

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
          aria-label="Название категории"
          className={`w-full max-w-xs rounded-[8px] ${compactInput}`}
        />
      </td>
      <td className="p-3">
        <input
          type="number"
          value={sort}
          onChange={(e) => setSort(Number(e.target.value))}
          aria-label="Порядок"
          className={`w-20 rounded-[8px] ${compactInput}`}
        />
      </td>
      <td className="p-2 align-middle">
        <AdminRowActionsMenu
          items={[
            { key: 'save', label: 'Сохранить', onClick: () => void save() },
            { key: 'delete', label: 'Удалить', variant: 'danger', onClick: () => void remove() },
          ]}
        />
      </td>
    </tr>
  )
}
