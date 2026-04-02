/*
  NewsArticlePage — одна новость (полный текст).
  Десктоп: HF_desktop_about news_1 — сетка 12 кол., фото 9 кол., текст 8 кол.;
  порядок: заголовок статьи → дата → абзацы; кнопка «Назад».
  id в URL совпадает с полем id из API.
*/

import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import type { NewsArticle } from '../types/news'
import { fetchNewsById } from '../services/newsService'
import { formatNewsDate } from '../utils/formatNewsDate'

function NewsArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className={isMenuOpen ? 'bg-brown-button min-w-[320px]' : 'bg-brown-bg min-w-[320px]'}>
      <Header
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      <main className="px-4 lg:px-16 xl:px-28 pt-[88px] lg:pt-[149px] pb-12 lg:pb-[97px]">
        {!id && (
          <div className="max-w-2xl">
            <p className="text-cream text-lg">Новость не найдена.</p>
            <Link
              to="/news"
              className="inline-block mt-6 text-brown-button underline underline-offset-4 hover:opacity-90"
            >
              К списку новостей
            </Link>
          </div>
        )}

        {id && <NewsArticleBody key={id} id={id} />}
      </main>

      <Footer />
    </div>
  )
}

function NewsArticleBody({ id }: { id: string }) {
  const [article, setArticle] = useState<NewsArticle | null | undefined>(undefined)

  useEffect(() => {
    const decoded = decodeURIComponent(id)
    fetchNewsById(decoded).then(setArticle)
  }, [id])

  if (article === undefined) {
    return <p className="text-cream-dark text-lg">Загрузка…</p>
  }

  if (article === null) {
    return (
      <div className="max-w-2xl">
        <p className="text-cream text-lg">Новость не найдена.</p>
        <Link
          to="/news"
          className="inline-block mt-6 text-brown-button underline underline-offset-4 hover:opacity-90"
        >
          К списку новостей
        </Link>
      </div>
    )
  }

  return (
    <article className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      {/* Раздел как в макете */}
      <h2 className="font-heading font-semibold text-cream text-[28px] lg:text-[36px] leading-tight lg:col-span-12">
        Новости и акции
      </h2>

      {/* Превью: 9/12 колонок (904px в макете при контенте 1216px) */}
      <div className="mt-12 lg:col-span-9 w-full">
        <div className="aspect-[904/560] overflow-hidden rounded-[10px]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Текст: 8/12 — уже блока фото; межстрочный интервал как в Figma (18px / ~22px) */}
      <div className="mt-8 lg:col-span-8 flex flex-col">
        <h1 className="text-cream text-2xl font-normal leading-[29px]">
          {article.title}
        </h1>

        <time
          dateTime={article.publishedAt}
          className="mt-4 block text-news-date/90 text-base font-normal leading-[19px]"
        >
          {formatNewsDate(article.publishedAt)}
        </time>

        {/* Тело статьи: Figma 130:1020 — Inter 18 / Regular, line-height 21.78px (#efe7dd) */}
        <div className="mt-6 space-y-3 text-cream-dark text-[18px] font-normal leading-[21.78px]">
          {article.content.map((paragraph, i) => (
            <p key={i} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>

        <Link
          to="/news"
          className="mt-10 inline-flex w-full max-w-[280px] min-h-[54px] shrink-0 items-center justify-center rounded-[10px] bg-brown-button px-6 text-center text-lg font-medium text-brown-dark transition-opacity hover:opacity-90"
        >
          Назад
        </Link>
      </div>
    </article>
  )
}

export default NewsArticlePage
