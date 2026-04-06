import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    function onChange() {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

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
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-brown-bg">
      {/* Мобилка: шапка с бургером — как на сайте, слева сверху */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[120] flex h-14 items-center gap-3 border-b border-cream/10 bg-[#3d2d24] px-4">
        <button
          type="button"
          className="text-cream transition-colors hover:text-brown-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 rounded-sm -ml-1 p-1"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <span className="font-heading text-lg text-cream">Админка</span>
      </header>

      {/* Затемнение под выдвижной панелью (не перекрывает шапку с бургером) */}
      {menuOpen ? (
        <button
          type="button"
          className="lg:hidden fixed inset-0 top-14 z-[100] bg-black/55"
          aria-label="Закрыть меню"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen flex-col pt-14 lg:flex-row lg:pt-0">
        <AdminSidebar mobileOpen={menuOpen} onMobileClose={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-8 lg:px-12 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
