/*
  NewsArticlePage — одна новость (полный текст).
  Десктоп: HF_desktop_about news_1 — сетка 12 кол., фото 9 кол., текст 8 кол.;
  Мобилка: HF_phone_about news_1 — отступы и кнопка 358×80 как в макете.
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

      <main className="px-4 lg:px-16 xl:px-28 pt-[88px] lg:pt-[149px] pb-[48px] lg:pb-[97px]">
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
      <h2 className="m-0 font-heading font-semibold text-cream text-[28px] lg:text-[36px] leading-tight lg:col-span-12">
        Новости и акции
      </h2>

      {/* Превью: моб. слот 358×240; десктоп 9/12 кол. Отступы под замер: −4/−10px к «сырому» mt из‑за line-box заголовков. */}
      <div className="mt-[32px] lg:mt-12 lg:col-span-9 w-full">
        <div className="aspect-[358/240] lg:aspect-[904/560] overflow-hidden rounded-[10px]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Текст: моб. отступы по HF_phone_about news_1; десктоп 8 кол. */}
      <div className="mt-[22px] lg:mt-8 lg:col-span-8 flex flex-col">
        <h1 className="m-0 text-cream text-xl font-normal leading-[24px] lg:text-2xl lg:leading-[29px]">
          {article.title}
        </h1>

        <time
          dateTime={article.publishedAt}
          className="mt-[10px] lg:mt-4 block text-news-date/90 text-[13px] font-normal leading-[15.73px] lg:text-base lg:leading-[19px]"
        >
          {formatNewsDate(article.publishedAt)}
        </time>

        {/* Десктоп: 130:1020 — 18px / 21.78px; моб.: 400:2390 — 16px / 19.36px */}
        <div className="mt-[16px] lg:mt-6 space-y-3 text-cream-dark text-[16px] font-normal leading-[19.36px] lg:text-[18px] lg:leading-[21.78px]">
          {article.content.map((paragraph, i) => (
            <p key={i} className="m-0">
              {paragraph}
            </p>
          ))}
        </div>

        <Link
          to="/news"
          className="mt-[33px] lg:mt-10 inline-flex w-full shrink-0 items-center justify-center rounded-[10px] bg-brown-button px-6 text-center font-medium uppercase tracking-wider text-brown-dark transition-colors hover:bg-brown-button-hover active:bg-brown-button-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-bg max-[763px]:max-w-none max-[763px]:min-h-[80px] max-[763px]:text-base min-[764px]:max-w-[280px] min-[764px]:min-h-[54px] min-[764px]:text-lg"
        >
          Назад
        </Link>
      </div>
    </article>
  )
}

export default NewsArticlePage
