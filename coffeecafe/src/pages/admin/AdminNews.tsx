import { useEffect, useRef, useState } from 'react'
import {
  createNews,
  deleteNews,
  fetchAdminNews,
  updateNews,
  uploadImage,
  type NewsAdminRow,
} from '../../services/adminService'
import AdminTable from '../../components/admin/AdminTable'

function contentToText(lines: string[]): string {
  return lines.join('\n\n')
}

function textToContent(text: string): string[] {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
}

/** Кнопка «три точки» и строгое контекстное меню (редактирование / удаление). */
function NewsRowMenu({
  row,
  onEdit,
  onDelete,
}: {
  row: NewsAdminRow
  onEdit: (row: NewsAdminRow) => void
  onDelete: (id: string) => void | Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="relative flex justify-end" ref={rootRef}>
      <button
        type="button"
        aria-label="Меню действий"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="
          flex h-9 w-9 shrink-0 items-center justify-center rounded-md
          text-cream/75 transition-colors
          hover:bg-white/[0.06] hover:text-cream
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/25
        "
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="
            absolute right-0 top-full z-30 mt-1 min-w-[200px]
            rounded-md border border-cream/12 bg-[#1f1814]
            py-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)]
          "
        >
          <button
            type="button"
            role="menuitem"
            className="
              flex w-full px-3 py-2.5 text-left text-sm font-normal tracking-normal text-cream/95
              transition-colors hover:bg-white/[0.06]
              focus-visible:bg-white/[0.06] focus-visible:outline-none
            "
            onClick={() => {
              onEdit(row)
              setOpen(false)
            }}
          >
            Редактировать
          </button>
          <button
            type="button"
            role="menuitem"
            className="
              flex w-full px-3 py-2.5 text-left text-sm font-normal tracking-normal
              text-[#c49a8f] transition-colors hover:bg-red-950/40 hover:text-[#e8b4a8]
              focus-visible:bg-red-950/40 focus-visible:outline-none
            "
            onClick={() => {
              void onDelete(row.id)
              setOpen(false)
            }}
          >
            Удалить
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function AdminNews() {
  const [rows, setRows] = useState<NewsAdminRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [contentText, setContentText] = useState('')
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [isPublished, setIsPublished] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')

  async function load() {
    setError(null)
    try {
      const data = await fetchAdminNews()
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

  function startCreate() {
    setEditingId('new')
    setTitle('')
    setExcerpt('')
    setContentText('')
    setImagePath(null)
    setIsPublished(false)
    setPublishedAt('')
  }

  function startEdit(row: NewsAdminRow) {
    setEditingId(row.id)
    setTitle(row.title)
    setExcerpt(row.excerpt)
    setContentText(contentToText(row.content))
    setImagePath(row.image)
    setIsPublished(row.is_published)
    setPublishedAt(row.publishedAt ?? '')
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const content = textToContent(contentText)
    if (!content.length) {
      setError('Добавьте текст новости (абзацы через пустую строку)')
      return
    }
    try {
      const pub = publishedAt.trim() || null
      if (editingId === 'new') {
        await createNews({
          title: title.trim(),
          excerpt,
          content,
          image: imagePath,
          is_published: isPublished,
          published_at: pub,
        })
      } else if (editingId) {
        await updateNews(editingId, {
          title: title.trim(),
          excerpt,
          content,
          image: imagePath,
          is_published: isPublished,
          published_at: pub,
        })
      }
      cancelEdit()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  async function remove(id: string) {
    if (!confirm('Удалить новость?')) return
    setError(null)
    try {
      await deleteNews(id)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  async function onPickFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0]
    if (!f) return
    setError(null)
    try {
      const path = await uploadImage(f, 'news')
      setImagePath(path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    }
    ev.target.value = ''
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-cream mb-8">Новости</h1>

      <button
        type="button"
        onClick={startCreate}
        className="mb-6 h-10 px-6 rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase text-sm tracking-wider"
      >
        Добавить новость
      </button>

      {editingId ? (
        <form
          onSubmit={(e) => void save(e)}
          className="mb-8 rounded-[10px] border border-cream/15 bg-[#4b372b] p-6 space-y-4"
        >
          <p className="text-cream font-medium">{editingId === 'new' ? 'Новая новость' : 'Редактирование'}</p>
          <label className="flex flex-col gap-1">
            <span className="text-cream-dark text-sm">Заголовок</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-11 px-3 rounded-[10px] bg-input-bg text-cream"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-cream-dark text-sm">Краткое описание (карточка)</span>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 rounded-[10px] bg-input-bg text-cream"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-cream-dark text-sm">Полный текст (абзацы через пустую строку)</span>
            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              required
              rows={8}
              className="w-full px-3 py-2 rounded-[10px] bg-input-bg text-cream"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-cream-dark text-sm">Картинка</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => void onPickFile(e)} />
            {imagePath ? <span className="text-cream-dark text-xs break-all">{imagePath}</span> : null}
          </label>
          <label className="flex items-center gap-2 text-cream">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Опубликовано
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-cream-dark text-sm">Дата публикации (YYYY-MM-DD)</span>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="h-11 px-3 rounded-[10px] bg-input-bg text-cream w-48"
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
              <th className="p-3 font-medium">Заголовок</th>
              <th className="p-3 font-medium">Статус</th>
              <th className="p-3 font-medium w-14 text-right pr-4">
                <span className="sr-only">Действия</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-cream/10">
                <td className="p-3 text-cream">{row.id}</td>
                <td className="p-3 text-cream">{row.title}</td>
                <td className="p-3 text-cream-dark">{row.is_published ? 'опубликована' : 'черновик'}</td>
                <td className="p-2 align-middle">
                  <NewsRowMenu row={row} onEdit={startEdit} onDelete={remove} />
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  )
}
