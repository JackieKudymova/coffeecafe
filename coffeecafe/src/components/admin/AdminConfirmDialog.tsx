import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevBodyPosition = body.style.position
    const prevBodyTop = body.style.top
    const prevBodyLeft = body.style.left
    const prevBodyRight = body.style.right
    const prevBodyWidth = body.style.width
    const scrollY = window.scrollY

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      body.style.position = prevBodyPosition
      body.style.top = prevBodyTop
      body.style.left = prevBodyLeft
      body.style.right = prevBodyRight
      body.style.width = prevBodyWidth
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="admin-confirm-title"
      aria-describedby="admin-confirm-desc"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Закрыть"
        onClick={onCancel}
      />
      <div
        className="relative w-full max-w-md rounded-[10px] border border-cream/15 bg-[#4b372b] px-6 py-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="admin-confirm-title" className="font-heading text-xl text-cream">
          {title}
        </h2>
        <p id="admin-confirm-desc" className="mt-3 text-sm leading-relaxed text-cream-dark">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="
              h-11 min-w-[120px] rounded-[10px] border border-cream/30 px-5 text-sm text-cream
              transition-colors hover:bg-white/[0.06]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/25
            "
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="
              h-11 min-w-[120px] rounded-[10px] bg-[#8b3d36] px-5 text-sm font-medium text-cream
              transition-colors hover:bg-[#a34d45]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/30
            "
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
