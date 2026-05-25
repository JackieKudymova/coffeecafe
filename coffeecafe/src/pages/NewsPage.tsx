/*
  NewsPage - список новостей с пагинацией.
  Данные через newsService (моки → позже API).
  Карточка: порядок и отступы как в Figma HF_desktop_news_1 (фото → заголовок → текст → дата #a8a5a1 → кнопка на всю ширину).
*/

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Pagination from '../components/Pagination'
import type { NewsArticle } from '../types/news'
import { fetchNewsPage, getNewsPageSizeForViewport } from '../services/newsService'
import { formatNewsDate } from '../utils/formatNewsDate'
import { useNewsCardRowHeights } from '../hooks/useNewsCardRowHeights'

function NewsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [items, setItems] = useState<NewsArticle[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(getNewsPageSizeForViewport)
  const newsGridRef = useRef<HTMLDivElement>(null)

  useNewsCardRowHeights(newsGridRef, items.length, page, pageSize)

  useEffect(() => {
    const onResize = () => {
      const next = getNewsPageSizeForViewport()
      setPageSize((prev) => {
        if (next === prev) return prev
        setPage(1)
        return next
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    fetchNewsPage(page, pageSize).then((res) => {
      setItems(res.items)
      setTotal(res.total)
    })
  }, [page, pageSize])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      <main className="px-4 lg:px-16 xl:px-28 pt-[88px] lg:pt-[149px] pb-12 md:pb-14 lg:pb-[97px]">
        <h1 className="font-heading font-normal text-cream text-[24px] lg:text-[36px] leading-tight uppercase tracking-[0.02em]">
          Новости и акции
        </h1>

        {/* Отступ от h1 до карточек; между карточками по вертикали на моб - 55px (HF_phone_news_1) */}
        <div
          ref={newsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[55px] gap-x-6 md:gap-x-4 md:gap-y-10 lg:gap-x-8 lg:gap-y-[50px] mt-[32px] lg:mt-[50px]"
        >
          {items.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        <Pagination
          className="mt-14 lg:mt-16"
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>

      <Footer />
    </div>
  )
}

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex flex-col h-full" data-news-card>
      {/* Превью 384×272 в макете → то же соотношение сторон. Планшет: 386×240 */}
      <div className="aspect-[384/272] md:aspect-[386/240] lg:aspect-[384/272] rounded-[5px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Высоты заголовка/анонса в ряду выравниваются в useNewsCardRowHeights */}
      <h2
        data-news-title
        className="text-cream font-medium text-[20px] md:text-[22px] lg:text-2xl leading-[1.2] mt-6 lg:mt-8 md:line-clamp-2"
      >
        {article.title}
      </h2>

      <p
        data-news-excerpt
        className="text-cream-dark text-base md:text-[17px] lg:text-lg font-normal leading-[22px] md:leading-[21px] lg:leading-[22px] mt-4 md:mt-4 lg:mt-[18px] line-clamp-3 overflow-hidden"
      >
        {article.excerpt}
      </p>

      <time
        dateTime={article.publishedAt}
        className="block text-news-date/90 text-[13px] md:text-[14px] lg:text-base font-normal leading-[19px] mt-6 md:mt-4 lg:mt-8"
      >
        {formatNewsDate(article.publishedAt)}
      </time>

      <Link
        to={`/news/${encodeURIComponent(article.id)}`}
        className="mt-8 md:mt-6 lg:mt-[35px] flex w-full min-h-[67px] shrink-0 items-center justify-center bg-transparent border border-[#FDD4A9] text-[#FDD4A9] px-4 text-center text-base font-medium uppercase tracking-wider transition-colors hover:border-[#FFC68A] hover:text-[#FFC68A] active:border-[#EDC091] active:text-[#EDC091] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-bg lg:min-h-[54px] lg:w-full lg:text-lg rounded-[5px]"
      >
        Подробнее
      </Link>
    </article>
  )
}

export default NewsPage
