import { useCallback, useEffect, useState } from 'react'
import {
  createItem,
  deleteItem,
  fetchCategories,
  fetchItems,
  updateItem,
  type CategoryRow,
  type MenuItemRow,
} from '../../services/adminService'
import AdminTable from '../../components/admin/AdminTable'
import AdminTextField from '../../components/admin/AdminTextField'
import AdminSelect from '../../components/admin/AdminSelect'
import AdminTextArea from '../../components/admin/AdminTextArea'
import AdminCheckbox from '../../components/admin/AdminCheckbox'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import AdminRowActionsMenu from '../../components/admin/AdminRowActionsMenu'
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog'
import { adminSelectClassName } from '../../components/admin/adminFieldStyles'
import { formatAdminDateTime } from '../../utils/formatAdminDate'

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

function sortItemsByCreated(items: MenuItemRow[]): MenuItemRow[] {
  return [...items].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
    if (tb !== ta) return tb - ta
    return Number(b.id) - Number(a.id)
  })
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
  const [ingredients, setIngredients] = useState('')
  const [allergenMilk, setAllergenMilk] = useState(false)
  const [allergenGluten, setAllergenGluten] = useState(false)
  const [allergenEgg, setAllergenEgg] = useState(false)

  const [errName, setErrName] = useState(false)
  const [errCategory, setErrCategory] = useState(false)
  const [errVariants, setErrVariants] = useState(false)
  const [errImage, setErrImage] = useState(false)

  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null)

  const loadCats = useCallback(async () => {
    const c = await fetchCategories()
    setCategories(c)
    setCategoryId((prev) => prev || (c.length ? c[0].id : ''))
  }, [])

  /**
   * Загружаем все позиции один раз и фильтруем на клиенте.
   * Так в форме редактирования всегда известно количество позиций
   * в любой выбранной категории - это нужно для валидации «Порядок» (1..N / 1..N+1).
   */
  const loadItems = useCallback(async () => {
    setError(null)
    try {
      const data = await fetchItems()
      setItems(sortItemsByCreated(data))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCats().catch(() => {})
  }, [loadCats])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  // Сколько позиций уже в выбранной для формы категории (без учёта самой редактируемой).
  const itemsInSelectedCategory = items.filter((it) => it.category_id === categoryId)
  const countInCategory =
    editingId && editingId !== 'new'
      ? itemsInSelectedCategory.filter((it) => it.id !== editingId).length
      : itemsInSelectedCategory.length
  // При создании - можно встать на любую позицию от 1 до N+1, при редактировании - 1..N (где N включает текущий item).
  const orderMin = 1
  const orderMax = editingId === 'new' ? countInCategory + 1 : countInCategory + 1
  // countInCategory + 1 в обоих случаях, потому что при редактировании N = countInCategory (другие) + 1 (сам item) = countInCategory + 1.

  function clearFieldErrors() {
    setErrName(false)
    setErrCategory(false)
    setErrVariants(false)
    setErrImage(false)
  }

  function startCreate() {
    setError(null)
    setEditingId('new')
    setName('')
    // По умолчанию ставим в конец списка выбранной категории.
    const defaultCat = categoryId || (categories.length ? categories[0].id : '')
    const nDefault = items.filter((it) => it.category_id === defaultCat).length
    setSortOrder(nDefault + 1)
    setIsVisible(true)
    setImagePath(null)
    setVariantsText('200 мл | 150')
    setIngredients('')
    setAllergenMilk(false)
    setAllergenGluten(false)
    setAllergenEgg(false)
    clearFieldErrors()
    if (categories.length) setCategoryId(categories[0].id)
  }

  function startEdit(row: MenuItemRow) {
    setError(null)
    setEditingId(row.id)
    setName(row.name)
    setCategoryId(row.category_id)
    setSortOrder(row.sort_order)
    setIsVisible(row.is_visible)
    setImagePath(row.image)
    setVariantsText(variantsToText(row.variants))
    setIngredients(row.ingredients ?? '')
    setAllergenMilk(Boolean(row.allergen_milk))
    setAllergenGluten(Boolean(row.allergen_gluten))
    setAllergenEgg(Boolean(row.allergen_egg))
    clearFieldErrors()
  }

  function cancelEdit() {
    setError(null)
    setEditingId(null)
    clearFieldErrors()
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const variants = parseVariants(variantsText)
    const cid = Number(categoryId)
    const missName = !name.trim()
    const missCat = !cid
    const missVar = !variants.length
    const missImage = !imagePath?.trim()

    setErrName(missName)
    setErrCategory(missCat)
    setErrVariants(missVar)
    setErrImage(missImage)

    if (missName || missCat || missVar || missImage) {
      return
    }

    // Зажимаем порядковый номер в допустимом диапазоне.
    // Если пользователь ввёл что-то некорректное - ставим в конец списка.
    const safeOrder = Math.min(Math.max(sortOrder || orderMax, orderMin), orderMax)

    const ingredientsTrim = ingredients.trim()
    try {
      if (editingId === 'new') {
        await createItem({
          category_id: cid,
          name: name.trim(),
          image: imagePath,
          sort_order: safeOrder,
          is_visible: isVisible,
          variants,
          ingredients: ingredientsTrim || null,
          allergen_milk: allergenMilk,
          allergen_gluten: allergenGluten,
          allergen_egg: allergenEgg,
        })
      } else if (editingId) {
        await updateItem(editingId, {
          category_id: cid,
          name: name.trim(),
          image: imagePath,
          sort_order: safeOrder,
          is_visible: isVisible,
          variants,
          ingredients: ingredientsTrim || null,
          allergen_milk: allergenMilk,
          allergen_gluten: allergenGluten,
          allergen_egg: allergenEgg,
        })
      }
      cancelEdit()
      await loadItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  function askDelete(id: string) {
    const row = items.find((r) => r.id === id)
    setPendingDelete({ id, name: row?.name ?? '' })
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    const id = pendingDelete.id
    setPendingDelete(null)
    setError(null)
    try {
      await deleteItem(id)
      if (editingId === id) cancelEdit()
      await loadItems()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-cream mb-8">Позиции меню</h1>

      {!editingId ? (
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <label className="block">
            <span className="block text-sm text-cream-dark">Категория</span>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className={`${adminSelectClassName} !mt-1 min-w-[200px] h-10`}
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
            className="
              h-10 px-6 rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase text-sm tracking-wider
              transition-colors hover:bg-brown-button-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50
            "
          >
            Новая позиция
          </button>
        </div>
      ) : null}

      {editingId ? (
        <form
          key={editingId}
          onSubmit={(e) => void saveItem(e)}
          noValidate
          className="mb-8 rounded-[10px] border border-cream/15 bg-[#4b372b] p-6 space-y-4"
        >
          <p className="text-cream font-medium">
            {editingId === 'new' ? 'Новая позиция' : 'Редактирование'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminTextField
                label={errName ? 'Введите название' : 'Название'}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrName(false)
                }}
                error={errName}
                maxLength={25}
              />
              {/* Счётчик символов: показывает оставшееся количество, чтобы заголовки не вылезали за карточки на сайте. */}
              <p className="mt-1 text-xs text-cream-dark">{name.length}/25</p>
            </div>
            <AdminSelect
              label={errCategory ? 'Выберите категорию' : 'Категория'}
              value={categoryId}
              onChange={(e) => {
                const newCat = e.target.value
                setCategoryId(newCat)
                setErrCategory(false)
                // При создании новой позиции автоматически предлагаем порядок «в конец» выбранной категории.
                if (editingId === 'new') {
                  const n = items.filter((it) => it.category_id === newCat).length
                  setSortOrder(n + 1)
                }
              }}
              error={errCategory}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </AdminSelect>
            <div>
              <AdminTextField
                label="Порядок"
                type="number"
                min={orderMin}
                max={orderMax}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="max-w-[8rem]"
              />
              {/* Подсказка: при создании - 1..N+1, при редактировании - 1..N (N = позиций в категории). */}
              <p className="mt-1 text-xs text-cream-dark">
                от {orderMin} до {orderMax}
              </p>
            </div>
            <AdminCheckbox
              className="sm:mt-8"
              checked={isVisible}
              onChange={setIsVisible}
              label="Видна на сайте"
            />
          </div>
          <AdminImageUpload
            kind="menu"
            value={imagePath}
            onChange={(path) => {
              setImagePath(path)
              setErrImage(false)
            }}
            onError={setError}
            error={errImage}
            label={errImage ? 'Загрузите изображение' : 'Изображение'}
          />
          <AdminTextArea
            label={
              errVariants
                ? 'Добавьте варианты (строка: «подпись | цена»)'
                : 'Варианты (каждая строка: «подпись | цена в рублях»)'
            }
            value={variantsText}
            onChange={(e) => {
              setVariantsText(e.target.value)
              setErrVariants(false)
            }}
            error={errVariants}
            rows={5}
            className="font-mono text-sm"
          />
          {/* Состав - отображается на сайте поверх фото при наведении/тапе. Может быть пустым.
              Каждый ингредиент с новой строки - переносы сохраняются на сайте. */}
          <AdminTextArea
            label="Состав (каждый ингредиент с новой строки)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={4}
            placeholder={'Например:\nЭспрессо\nМолоко\nКакао'}
          />
          {/* Аллергены - 3 чекбокса. На сайте появляются иконкой в углу фото; заполнение снизу вверх. */}
          <fieldset>
            <legend className="block text-sm text-cream-dark mb-2">Аллергены</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <AdminCheckbox checked={allergenMilk} onChange={setAllergenMilk} label="Молоко" />
              <AdminCheckbox checked={allergenGluten} onChange={setAllergenGluten} label="Глютен" />
              <AdminCheckbox checked={allergenEgg} onChange={setAllergenEgg} label="Яйца" />
            </div>
          </fieldset>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="
                h-11 px-6 rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase text-sm
                transition-colors hover:bg-brown-button-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50
              "
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="
                h-11 px-6 rounded-[10px] border border-cream/30 text-cream text-sm
                hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/25
              "
            >
              Отмена
            </button>
          </div>
        </form>
      ) : null}

      {error ? <p className="text-input-border-error mb-4">{error}</p> : null}
      {editingId !== 'new' ? (
        loading ? (
          <p className="text-cream-dark">Загрузка…</p>
        ) : (
          <AdminTable>
            <thead className="bg-[#5d483c] text-cream text-sm uppercase tracking-wider">
              <tr>
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Название</th>
                <th className="p-3 font-medium whitespace-nowrap">Добавлено</th>
                <th className="p-3 font-medium">Категория</th>
                <th className="p-3 font-medium">Видна</th>
                <th className="p-3 font-medium w-14 text-right pr-4">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Фильтрация по категории - на клиенте, потому что fetchItems грузит все позиции сразу. */}
              {(filterCat ? items.filter((it) => it.category_id === filterCat) : items).map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-cream/10 cursor-pointer hover:bg-white/[0.04] transition-colors"
                  onClick={() => startEdit(row)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      startEdit(row)
                    }
                  }}
                >
                  <td className="p-3 text-cream">{row.id}</td>
                  <td className="p-3 text-cream">{row.name}</td>
                  <td className="p-3 text-cream-dark text-sm whitespace-nowrap">
                    {formatAdminDateTime(row.createdAt)}
                  </td>
                  <td className="p-3 text-cream-dark">
                    {categories.find((c) => c.id === row.category_id)?.name ?? row.category_id}
                  </td>
                  <td className="p-3 text-cream-dark">{row.is_visible ? 'да' : 'нет'}</td>
                  <td className="p-2 align-middle">
                    <AdminRowActionsMenu
                      items={[
                        { key: 'edit', label: 'Редактировать', onClick: () => startEdit(row) },
                        { key: 'del', label: 'Удалить', variant: 'danger', onClick: () => askDelete(row.id) },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        )
      ) : null}

      <AdminConfirmDialog
        open={pendingDelete !== null}
        title="Удалить позицию?"
        message={
          pendingDelete?.name
            ? `Удалить «${pendingDelete.name}»? Это действие нельзя отменить.`
            : 'Удалить эту позицию? Это действие нельзя отменить.'
        }
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
