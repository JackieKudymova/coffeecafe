import { useEffect, useState } from 'react'
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
              <th className="p-3 font-medium w-40">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-cream/10">
                <td className="p-3 text-cream">{row.id}</td>
                <td className="p-3 text-cream">{row.title}</td>
                <td className="p-3 text-cream-dark">{row.is_published ? 'опубликована' : 'черновик'}</td>
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
