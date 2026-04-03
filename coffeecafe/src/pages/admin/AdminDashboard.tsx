import { useEffect, useState } from 'react'
import { fetchAdminStats, type AdminStats } from '../../services/adminService'

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-[10px] bg-[#4b372b] border border-cream/15 px-6 py-6">
      <p className="text-cream-dark text-sm uppercase tracking-wider">{title}</p>
      <p className="font-heading text-4xl text-cream mt-2">{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchAdminStats()
      .then((s) => {
        if (!cancelled) setStats(s)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return <p className="text-input-border-error">{error}</p>
  }
  if (!stats) {
    return <p className="text-cream-dark">Загрузка…</p>
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-cream mb-8">Дашборд</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Позиций в меню" value={stats.menu_items_count} />
        <StatCard title="Опубликованных новостей" value={stats.published_news_count} />
        <StatCard title="Непрочитанных обращений" value={stats.unread_messages_count} />
      </div>
    </div>
  )
}
