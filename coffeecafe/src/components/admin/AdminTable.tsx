import type { ReactNode } from 'react'

export default function AdminTable({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`overflow-x-auto rounded-[10px] border border-cream/15 bg-[#4b372b] ${className}`}
    >
      <table className="w-full min-w-[640px] text-left text-cream-dark text-sm lg:text-base">
        {children}
      </table>
    </div>
  )
}
