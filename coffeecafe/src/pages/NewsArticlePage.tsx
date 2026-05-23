/*
  NewsArticlePage - одна новость (полный текст).
  Десктоп: HF_desktop_about news_1 - сетка 12 кол., фото 9 кол., текст 8 кол.;
  Мобилка: HF_phone_about news_1 - отступы и кнопка 358×80 как в макете.
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

  const mid = Math.ceil(article.content.length / 2)
  const leftParagraphs = article.content.slice(0, mid)
  const rightParagraphs = article.content.slice(mid)

  return (
    <article className="md:grid md:grid-cols-12 md:gap-x-8">
      {/* Заголовок раздела */}
      <h2 className="m-0 font-heading font-normal text-cream text-[24px] md:text-[32px] lg:text-[36px] leading-tight md:col-span-12 uppercase">
        Новости и акции
      </h2>

      {/* Фото: мобилка — aspect 358/240; планшет и десктоп — 12 колонок */}
      <div className="mt-[32px] md:mt-10 lg:mt-12 md:col-span-12">
        <div className="aspect-[358/240] md:aspect-auto md:h-[380px] lg:h-[500px] rounded-[10px] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Название + дата — под фото, полная ширина */}
      <div className="mt-[24px] md:mt-8 md:col-span-12">
        <h1 className="m-0 text-cream text-xl md:text-[22px] font-normal leading-[24px] md:leading-[26.4px] lg:text-2xl lg:leading-[29px]">
          {article.title}
        </h1>
        <time
          dateTime={article.publishedAt}
          className="mt-3 md:mt-4 block text-news-date/90 text-[13px] md:text-[14px] font-normal leading-[16px] md:leading-[17px] lg:text-base lg:leading-[19px]"
        >
          {formatNewsDate(article.publishedAt)}
        </time>
      </div>

      {/* Только мобилка: весь текст в одну колонку */}
      <div className="md:hidden mt-5 space-y-3 text-cream-dark text-[16px] font-normal leading-[19.36px]">
        {article.content.map((p, i) => (
          <p key={i} className="m-0">{p}</p>
        ))}
      </div>

      {/* Планшет и десктоп: описание в двух колонках 6+6, gap 32px */}
      <div className="hidden md:block md:col-span-6 md:mt-6 space-y-3 text-cream-dark md:text-[17px] md:leading-[21px] lg:text-[18px] lg:leading-[21.78px] font-normal">
        {leftParagraphs.map((p, i) => (
          <p key={i} className="m-0">{p}</p>
        ))}
      </div>
      <div className="hidden md:block md:col-span-6 md:mt-6 space-y-3 text-cream-dark md:text-[17px] md:leading-[21px] lg:text-[18px] lg:leading-[21.78px] font-normal">
        {rightParagraphs.map((p, i) => (
          <p key={i} className="m-0">{p}</p>
        ))}
      </div>

      {/* Кнопка «Назад» */}
      <div className="md:col-span-12">
        <Link
          to="/news"
          className="mt-[33px] md:mt-10 inline-flex w-full min-h-[67px] text-base shrink-0 items-center justify-center bg-brown-button px-6 text-center font-medium uppercase tracking-wider text-brown-dark transition-colors hover:bg-brown-button-hover active:bg-brown-button-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-bg md:max-w-[386px] md:min-h-[67px] lg:max-w-[280px] lg:min-h-[54px] lg:text-lg rounded-[10px]"
        >
          Назад
        </Link>
      </div>
    </article>
  )
}

export default NewsArticlePage
