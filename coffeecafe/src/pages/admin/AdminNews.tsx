import { useEffect, useState } from 'react'
import {
  createNews,
  deleteNews,
  fetchAdminNews,
  updateNews,
  type NewsAdminRow,
} from '../../services/adminService'
import AdminTable from '../../components/admin/AdminTable'
import AdminTextField from '../../components/admin/AdminTextField'
import AdminTextArea from '../../components/admin/AdminTextArea'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import AdminRowActionsMenu from '../../components/admin/AdminRowActionsMenu'
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog'
import { formatAdminDateTime } from '../../utils/formatAdminDate'

function contentToText(lines: string[]): string {
  return lines.join('\n\n')
}

function textToContent(text: string): string[] {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
}

function sortNewsByCreated(rows: NewsAdminRow[]): NewsAdminRow[] {
  return [...rows].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
    if (tb !== ta) return tb - ta
    return Number(b.id) - Number(a.id)
  })
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

  const [errTitle, setErrTitle] = useState(false)
  const [errExcerpt, setErrExcerpt] = useState(false)
  const [errContent, setErrContent] = useState(false)
  const [errImage, setErrImage] = useState(false)

  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null)

  async function load() {
    setError(null)
    try {
      const data = await fetchAdminNews()
      setRows(sortNewsByCreated(data))
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
    setError(null)
    setEditingId('new')
    setTitle('')
    setExcerpt('')
    setContentText('')
    setImagePath(null)
    setIsPublished(false)
    setErrTitle(false)
    setErrExcerpt(false)
    setErrContent(false)
    setErrImage(false)
  }

  function startEdit(row: NewsAdminRow) {
    setError(null)
    setEditingId(row.id)
    setTitle(row.title)
    setExcerpt(row.excerpt)
    setContentText(contentToText(row.content))
    setImagePath(row.image)
    setIsPublished(row.is_published)
    setErrTitle(false)
    setErrExcerpt(false)
    setErrContent(false)
    setErrImage(false)
  }

  function cancelEdit() {
    setError(null)
    setEditingId(null)
    setErrTitle(false)
    setErrExcerpt(false)
    setErrContent(false)
    setErrImage(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const t = title.trim()
    const ex = excerpt.trim()
    const content = textToContent(contentText)

    const missTitle = !t
    const missExcerpt = !ex
    const missContent = !content.length
    const missImage = !imagePath?.trim()

    setErrTitle(missTitle)
    setErrExcerpt(missExcerpt)
    setErrContent(missContent)
    setErrImage(missImage)
    if (missTitle || missExcerpt || missContent || missImage) {
      return
    }

    try {
      if (editingId === 'new') {
        await createNews({
          title: t,
          excerpt: ex,
          content,
          image: imagePath,
          is_published: isPublished,
          published_at: null,
        })
      } else if (editingId) {
        await updateNews(editingId, {
          title: t,
          excerpt: ex,
          content,
          image: imagePath,
          is_published: isPublished,
        })
      }
      cancelEdit()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка')
    }
  }

  function askDelete(id: string) {
    const row = rows.find((r) => r.id === id)
    setPendingDelete({ id, title: row?.title ?? '' })
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    const id = pendingDelete.id
    setPendingDelete(null)
    setError(null)
    try {
      await deleteNews(id)
      if (editingId === id) cancelEdit()
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-cream mb-8">Новости и акции</h1>

      {!editingId ? (
        <button
          type="button"
          onClick={startCreate}
          className="
            mb-6 h-10 px-6 rounded-[10px] bg-brown-button text-brown-dark font-medium uppercase text-sm tracking-wider
            transition-colors hover:bg-brown-button-hover active:bg-brown-button-active
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50
          "
        >
          Добавить новость
        </button>
      ) : null}

      {editingId ? (
        <form
          key={editingId}
          onSubmit={(e) => void save(e)}
          noValidate
          className="mb-8 rounded-[10px] border border-cream/15 bg-[#4b372b] p-6 space-y-4"
        >
          <p className="text-cream font-medium">{editingId === 'new' ? 'Новая новость' : 'Редактирование'}</p>
          <AdminTextField
            label={errTitle ? 'Введите заголовок' : 'Заголовок'}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setErrTitle(false)
            }}
            error={errTitle}
          />
          <AdminTextArea
            label={errExcerpt ? 'Введите краткое описание' : 'Краткое описание (карточка)'}
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value)
              setErrExcerpt(false)
            }}
            error={errExcerpt}
            rows={3}
          />
          <AdminTextArea
            label={errContent ? 'Введите полный текст новости' : 'Полный текст (абзацы через пустую строку)'}
            value={contentText}
            onChange={(e) => {
              setContentText(e.target.value)
              setErrContent(false)
            }}
            error={errContent}
            rows={8}
          />
          <AdminImageUpload
            kind="news"
            value={imagePath}
            onChange={(path) => {
              setImagePath(path)
              setErrImage(false)
            }}
            onError={setError}
            error={errImage}
            label={errImage ? 'Загрузите изображение' : 'Изображение'}
          />
          <label className="flex items-center gap-2 text-cream">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-cream/30 bg-input-bg text-brown-button focus:ring-input-border-focus"
            />
            Опубликовано
          </label>
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
                transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/25
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
                <th className="p-3 font-medium">Заголовок</th>
                <th className="p-3 font-medium whitespace-nowrap">Добавлено</th>
                <th className="p-3 font-medium">Статус</th>
                <th className="p-3 font-medium w-14 text-right pr-4">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
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
                  <td className="p-3 text-cream">{row.title}</td>
                  <td className="p-3 text-cream-dark text-sm whitespace-nowrap">
                    {formatAdminDateTime(row.createdAt)}
                  </td>
                  <td className="p-3 text-cream-dark">{row.is_published ? 'опубликована' : 'черновик'}</td>
                  <td className="p-2 align-middle">
                    <AdminRowActionsMenu
                      items={[
                        {
                          key: 'edit',
                          label: 'Редактировать',
                          onClick: () => startEdit(row),
                        },
                        {
                          key: 'delete',
                          label: 'Удалить',
                          variant: 'danger',
                          onClick: () => askDelete(row.id),
                        },
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
        title="Удалить новость?"
        message={
          pendingDelete?.title
            ? `Удалить «${pendingDelete.title}»? Это действие нельзя отменить.`
            : 'Удалить эту новость? Это действие нельзя отменить.'
        }
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
