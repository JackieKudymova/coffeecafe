/*
  NewsPage — список новостей с пагинацией.
  Данные через newsService (моки → позже API).
  Карточка: порядок и отступы как в Figma HF_desktop_news_1 (фото → заголовок → текст → дата #a8a5a1 → кнопка на всю ширину).
*/

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Pagination from '../components/Pagination'
import type { NewsArticle } from '../types/news'
import { fetchNewsPage, NEWS_PAGE_SIZE } from '../services/newsService'
import { formatNewsDate } from '../utils/formatNewsDate'

function NewsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [items, setItems] = useState<NewsArticle[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchNewsPage(page, NEWS_PAGE_SIZE).then((res) => {
      setItems(res.items)
      setTotal(res.total)
    })
  }, [page])

  const totalPages = Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE))

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      <main className="px-4 lg:px-16 xl:px-28 pt-[88px] lg:pt-[149px] pb-12 lg:pb-[97px]">
        <h1 className="font-heading font-semibold text-cream text-[28px] lg:text-[36px] leading-tight">
          Новости и акции
        </h1>

        {/* Отступ от h1 до карточек; между карточками по вертикали на моб — 55px (HF_phone_news_1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[55px] gap-x-6 md:gap-x-8 md:gap-y-8 lg:gap-x-8 lg:gap-y-[50px] mt-[32px] lg:mt-[50px]">
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
    <article className="flex flex-col h-full">
      {/* Превью 384×272 в макете → то же соотношение сторон */}
      <div className="aspect-[384/272] overflow-hidden rounded-[10px]">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Отступы по фрейму: под фото → заголовок → текст → дата → кнопка */}
      <h2 className="text-cream font-medium text-2xl leading-[1.2] mt-6 lg:mt-8">
        {article.title}
      </h2>

      <p className="text-cream-dark text-lg font-normal leading-[22px] mt-[14px] lg:mt-[18px] line-clamp-3">
        {article.excerpt}
      </p>

      <time
        dateTime={article.publishedAt}
        className="block text-news-date/90 text-base font-normal leading-[19px] mt-6 lg:mt-8"
      >
        {formatNewsDate(article.publishedAt)}
      </time>

      <Link
        to={`/news/${encodeURIComponent(article.id)}`}
        className="mt-[35px] flex w-full min-h-[80px] shrink-0 items-center justify-center rounded-[10px] bg-brown-button px-4 text-center text-base font-medium uppercase tracking-wider text-brown-dark transition-opacity hover:opacity-90 lg:min-h-[54px] lg:w-[calc(75%-12px)] lg:self-start lg:text-lg"
      >
        Подробнее
      </Link>
    </article>
  )
}

export default NewsPage
