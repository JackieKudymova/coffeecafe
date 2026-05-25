import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchMessage, patchMessageRead, type MessageRow } from '../../services/adminService'
import AdminCheckbox from '../../components/admin/AdminCheckbox'

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-sm text-cream-dark leading-[22px]">{label}</span>
      <div className="mt-2 min-h-[51px] rounded-[5px] border-2 border-transparent bg-input-bg px-4 py-3 text-base text-cream">
        {children}
      </div>
    </div>
  )
}

export default function AdminMessageDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [row, setRow] = useState<MessageRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingRead, setSavingRead] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setError(null)
    setLoading(true)
    try {
      const m = await fetchMessage(id)
      setRow(m)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
      setRow(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  async function onReadChange(checked: boolean) {
    if (!id || !row) return
    setSavingRead(true)
    setError(null)
    try {
      const updated = await patchMessageRead(id, checked)
      setRow(updated)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сохранения')
    } finally {
      setSavingRead(false)
    }
  }

  return (
    <div>
      <h1 className="font-heading text-[36px] leading-[49px] tracking-[0.02em] text-cream uppercase mb-8">Обращение</h1>

      {error ? <p className="text-input-border-error mb-4">{error}</p> : null}

      {loading ? (
        <p className="text-cream-dark">Загрузка…</p>
      ) : row ? (
        <div className="rounded-[5px] border border-cream/15 bg-[#382a22] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AdminCheckbox
              checked={row.is_read}
              disabled={savingRead}
              onChange={(v) => void onReadChange(v)}
              label={<span className="text-sm">Прочитано</span>}
            />
            {savingRead ? <span className="text-xs text-cream-dark">Сохранение…</span> : null}
          </div>

          <div className="space-y-4 pt-2">
            <DetailField label="Дата">
              {row.created_at ? new Date(row.created_at).toLocaleString('ru-RU') : '-'}
            </DetailField>
            <DetailField label="Имя">{row.name}</DetailField>
            <DetailField label="Телефон">
              <span className="font-mono tracking-tight">{row.phone}</span>
            </DetailField>
            <div>
              <span className="block text-sm text-cream-dark leading-[22px]">Сообщение</span>
              <div className="mt-2 min-h-[120px] rounded-[5px] border-2 border-transparent bg-input-bg px-4 py-3 text-base leading-[22px] text-cream whitespace-pre-wrap break-words">
                {row.message?.trim() ? row.message : '-'}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/messages')}
              className="
                h-11 px-6 rounded-[5px] border border-cream/30 text-sm text-cream
                transition-colors hover:bg-white/[0.06]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/25
              "
            >
              Назад к списку
            </button>
          </div>
        </div>
      ) : !error ? (
        <p className="text-cream-dark">Обращение не найдено.</p>
      ) : null}
    </div>
  )
}
