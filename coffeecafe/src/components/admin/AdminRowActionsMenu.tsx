import { useEffect, useRef, useState } from 'react'

export type AdminRowMenuItem = {
  key: string
  label: string
  onClick: () => void | Promise<void>
  variant?: 'default' | 'danger'
}

export default function AdminRowActionsMenu({ items }: { items: AdminRowMenuItem[] }) {
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
    <div className="relative flex justify-end" ref={rootRef} onClick={(e) => e.stopPropagation()}>
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
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              className={
                item.variant === 'danger'
                  ? `
                    flex w-full px-3 py-2.5 text-left text-sm font-normal tracking-normal
                    text-[#c49a8f] transition-colors hover:bg-red-950/40 hover:text-[#e8b4a8]
                    focus-visible:bg-red-950/40 focus-visible:outline-none
                  `
                  : `
                    flex w-full px-3 py-2.5 text-left text-sm font-normal tracking-normal text-cream/95
                    transition-colors hover:bg-white/[0.06]
                    focus-visible:bg-white/[0.06] focus-visible:outline-none
                  `
              }
              onClick={() => {
                void item.onClick()
                setOpen(false)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
