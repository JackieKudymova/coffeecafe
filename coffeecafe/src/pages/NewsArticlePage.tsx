/*
  NewsArticlePage — одна новость (полный текст).
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

/* Отдельный экран с key=id — при смене id состояние загрузки сбрасывается без лишнего setState в эффекте */
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
    <article className="max-w-[800px] mx-auto lg:mx-0">
      <div className="aspect-[3/2] overflow-hidden rounded-[10px] w-full max-w-full">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <time
        dateTime={article.publishedAt}
        className="block text-cream-dark text-base mt-6 lg:mt-10"
      >
        {formatNewsDate(article.publishedAt)}
      </time>

      <h1 className="font-heading font-semibold text-cream text-[28px] lg:text-[36px] leading-tight mt-3 lg:mt-4">
        {article.title}
      </h1>

      <div className="mt-6 lg:mt-10 space-y-4 text-cream-dark text-lg leading-relaxed">
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <Link
        to="/news"
        className="inline-block mt-10 lg:mt-12 text-brown-button text-lg font-medium uppercase tracking-wider hover:opacity-90"
      >
        ← Все новости
      </Link>
    </article>
  )
}

export default NewsArticlePage
