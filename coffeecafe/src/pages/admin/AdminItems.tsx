import { useCallback, useEffect, useState } from 'react'
import {
  createItem,
  deleteItem,
  fetchCategories,
  fetchItems,
  updateItem,
  uploadImage,
  type CategoryRow,
  type MenuItemRow,
} from '../../services/adminService'
import AdminTable from '../../components/admin/AdminTable'

function parseVariants(text: string): { label: string; price: number; sort_order: number }[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const out: { label: string; price: number; sort_order: number }[] = []
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const m = line.match(/^(.+?)\s*[|]\s*(\d+)\s*$/)
    if (m) {
      out.push({ label: m[1].trim(), price: Number(m[2]), sort_order: i })
    }
  }
  return out
}

function variantsToText(variants: { label: string; price: number }[]): string {
  return variants.map((v) => `${v.label} | ${v.price}`).join('\n')
}

export default function AdminItems() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [filterCat, setFilterCat] = useState<string>('')
  const [items, setItems] = useState<MenuItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [variantsText, setVariantsText] = useState('200 мл | 150')

  const loadCats = useCallback(async () => {
    const c = await fetchCategories()
    setCategories(c)
    setCategoryId((prev) => prev || (c.length ? c[0].id : ''))
  }, [])

  const loadItems = useCallback(async () => {
    setError(null)
    try {
      const data = await fetchItems(filterCat || undefined)
      setItems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }, [filterCat])

  useEffect(() => {
    loadCats().catch(() => {})
  }, [loadCats])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  function startCreate() {
    setEditingId('new')
    setName('')
    setSortOrder(0)
    setIsVisible(true)
    setImagePath(null)
    setVariantsText('200 мл | 150')
    if (categories.length) setCategoryId(categories[0].id)
  }

  function startEdit(row: MenuItemRow) {
    setEditingId(row.id)
    setName(row.name)
    setCategoryId(row.category_id)
    setSortOrder(row.sort_order)
    setIsVisible(row.is_visible)
    setImagePath(row.image)
    setVariantsText(variantsToText(row.variants))
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault()
    const variants = parseVariants(variantsText)
    if (!variants.length) {
      setError('Добавьте хотя бы один вариант (формат: «200 мл | 150»)')
      return
    }
    setError(null)
    const cid = Number(categoryId)
    if (!cid) {
      setError('Выберите категорию')
      return
    }
    try {
      if (editingId === 'new') {
        await createItem({
          category_id: cid,
          name: name.trim(),
          image: imagePath,
          sort_order: sortOrder,
          is_visible: isVisible,
          variants,
        })
      } else if (editingId) {
        await updateItem(editingId, {
          category_id: cid,
          name: name.trim(),
          image: imagePath,
          sort_order: sortOrder,
          is_visible: isVisible,
          variants,
        })
      }
      cancelEdit()
      await loadItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  async function remove(id: string) {
    if (!confirm('Удалить позицию?')) return
    setError(null)
    try {
      await deleteItem(id)
      await loadItems()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setError(null)
    try {
      const path = await uploadImage(f, 'menu')
      setImagePath(path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    }
    e.target.value = ''
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-cream mb-8">Позиции меню</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="flex items-center gap-2 text-cream-dark">
          <span>Категория:</span>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="h-10 px-3 rounded-[10px] bg-input-bg text-cream border border-cream/20"
          >
            <option value="">Все</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={startCreate}
          className="h-10 px-6 rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase text-sm tracking-wider"
        >
          Новая позиция
        </button>
      </div>

      {editingId ? (
        <form
          onSubmit={(e) => void saveItem(e)}
          className="mb-8 rounded-[10px] border border-cream/15 bg-[#4b372b] p-6 space-y-4"
        >
          <p className="text-cream font-medium">
            {editingId === 'new' ? 'Новая позиция' : 'Редактирование'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-cream-dark text-sm">Название</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 px-3 rounded-[10px] bg-input-bg text-cream"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-cream-dark text-sm">Категория</span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-11 px-3 rounded-[10px] bg-input-bg text-cream"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-cream-dark text-sm">Порядок</span>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="h-11 px-3 rounded-[10px] bg-input-bg text-cream w-32"
              />
            </label>
            <label className="flex items-center gap-2 text-cream mt-6">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
              />
              Видна на сайте
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-cream-dark text-sm">Картинка</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => void onPickFile(e)} />
            {imagePath ? <span className="text-cream-dark text-xs break-all">{imagePath}</span> : null}
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-cream-dark text-sm">
              Варианты (каждая строка: «подпись | цена в рублях»)
            </span>
            <textarea
              value={variantsText}
              onChange={(e) => setVariantsText(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 rounded-[10px] bg-input-bg text-cream font-mono text-sm"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              className="h-11 px-6 rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase text-sm"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="h-11 px-6 rounded-[10px] border border-cream/30 text-cream text-sm"
            >
              Отмена
            </button>
          </div>
        </form>
      ) : null}

      {error ? <p className="text-input-border-error mb-4">{error}</p> : null}
      {loading ? (
        <p className="text-cream-dark">Загрузка…</p>
      ) : (
        <AdminTable>
          <thead className="bg-[#5d483c] text-cream text-sm uppercase tracking-wider">
            <tr>
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Название</th>
              <th className="p-3 font-medium">Категория</th>
              <th className="p-3 font-medium">Видна</th>
              <th className="p-3 font-medium w-44">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} className="border-t border-cream/10">
                <td className="p-3 text-cream">{row.id}</td>
                <td className="p-3 text-cream">{row.name}</td>
                <td className="p-3 text-cream-dark">
                  {categories.find((c) => c.id === row.category_id)?.name ?? row.category_id}
                </td>
                <td className="p-3 text-cream-dark">{row.is_visible ? 'да' : 'нет'}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="px-3 py-1.5 rounded-[8px] bg-brown-button text-brown-dark text-xs font-medium uppercase"
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(row.id)}
                    className="px-3 py-1.5 rounded-[8px] border border-input-border-error text-input-border-error text-xs uppercase"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  )
}
