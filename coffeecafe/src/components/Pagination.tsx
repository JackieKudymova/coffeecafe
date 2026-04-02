/*
  Пагинация: квадратные кнопки без скругления (UI-KIT), состояния default / hover / active.
  «Назад» только если страница не первая, «Вперёд» — если не последняя (не disabled, а скрытие).
*/

import type { ButtonHTMLAttributes } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages < 2) return null

  const pages: number[] = []
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i)
  }

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      aria-label="Страницы новостей"
    >
      {currentPage > 1 && (
        <PaginationButton
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Предыдущая страница"
        >
          ‹
        </PaginationButton>
      )}

      {pages.map((p) => (
        <PaginationButton
          key={p}
          type="button"
          isActive={p === currentPage}
          onClick={() => onPageChange(p)}
          aria-label={`Страница ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </PaginationButton>
      ))}

      {currentPage < totalPages && (
        <PaginationButton
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Следующая страница"
        >
          ›
        </PaginationButton>
      )}
    </nav>
  )
}

interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

function PaginationButton({
  isActive = false,
  className = '',
  disabled,
  children,
  ...rest
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        inline-flex size-10 shrink-0 items-center justify-center rounded-none p-0 text-center text-lg font-medium transition-colors
        ${disabled
          ? 'bg-pagination-bg-disabled text-pagination-text-disabled cursor-not-allowed'
          : isActive
            ? 'bg-pagination-bg-active text-cream cursor-default'
            : 'bg-pagination-bg text-cream-dark hover:bg-pagination-bg-hover hover:text-cream cursor-pointer'
        }
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Pagination
