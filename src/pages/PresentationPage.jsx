import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { timeline1986to1991 } from '../data/timeline1986_1991'

function PresentationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const navigateTimeoutRef = useRef(null)
  const [isLeavingToDetail, setIsLeavingToDetail] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const cards = Array.from(container.querySelectorAll('[data-section-card]'))
    if (!cards.length) {
      return
    }

    const returnToPartId = location.state?.returnToPartId
    const targetCard = returnToPartId
      ? cards.find((card) => card.getAttribute('data-part-id') === returnToPartId)
      : null

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    ;(targetCard || cards[0]).classList.add('is-visible')

    if (targetCard) {
      container.scrollTo({ top: targetCard.offsetTop, behavior: 'auto' })
    }

    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return () => {
        document.documentElement.style.overflow = previousHtmlOverflow
        document.body.style.overflow = previousBodyOverflow
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const shouldShow = entry.isIntersecting && entry.intersectionRatio >= 0.55
          entry.target.classList.toggle('is-visible', shouldShow)
        })
      },
      {
        root: container,
        threshold: [0.35, 0.55, 0.75],
        rootMargin: '0px 0px -6% 0px',
      }
    )

    cards.forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
      if (navigateTimeoutRef.current) {
        window.clearTimeout(navigateTimeoutRef.current)
      }
    }
  }, [location.state])

  const openSection = (partId) => {
    if (isLeavingToDetail) {
      return
    }

    setIsLeavingToDetail(true)
    navigateTimeoutRef.current = window.setTimeout(() => {
      navigate(`/presentation/parts/${partId}`, {
        state: { enterAnimation: 'slide-from-right' },
      })
    }, 340)
  }

  const handleSectionKeyDown = (event, partId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openSection(partId)
    }
  }

  return (
    <section
      className={`presentation-wrapper route-panel${
        isLeavingToDetail ? ' route-slide-out-left' : ''
      }${location.state?.enterAnimation === 'slide-from-left' ? ' route-slide-in-left' : ''}`}
    >
      <div ref={containerRef} className="game-screen" aria-label="Các phần nội dung lịch sử">
        {timeline1986to1991.map((item, index) => (
          <article
            key={item.id}
            className="section-screen"
            style={{ '--section-gradient': item.gradient }}
            onClick={() => openSection(item.id)}
            onKeyDown={(event) => handleSectionKeyDown(event, item.id)}
            role="button"
            tabIndex={0}
            aria-label={`Mở ${item.section}: ${item.title}`}
            data-section-card
            data-part-id={item.id}
          >
            <div className="section-bg" data-section-bg aria-hidden="true">
              <img src={item.image} alt="" className="section-bg-image" loading="lazy" />
            </div>
            <div className="section-overlay" />
            <div className="section-content">
              <p className="section-tag">{item.section}</p>
              <p className="section-period">{item.period}</p>
              <h2>{item.title}</h2>
              <p className="section-marker">{item.marker}</p>
              <p className="section-hint">Nhấn để mở chi tiết phần</p>
              <p className="section-progress">
                Mục {index + 1}/{timeline1986to1991.length}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PresentationPage
