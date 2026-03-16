import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { timeline1986to1991 } from '../data/timeline1986_1991'

function PresentationPage() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const lockScrollRef = useRef(false)

  const openLevel = (partId) => {
    navigate(`/presentation/parts/${partId}`)
  }

  const handleLevelKeyDown = (event, partId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openLevel(partId)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return undefined
    }

    const sections = () => Array.from(container.querySelectorAll('[data-level-card]'))

    // Parallax: ảnh nền trượt chậm hơn 35% so với tốc độ cuộn
    const onScroll = () => {
      const cards = container.querySelectorAll('[data-level-card]')
      const scrollTop = container.scrollTop
      cards.forEach((card) => {
        const bg = card.querySelector('[data-level-bg]')
        if (!bg) return
        const offset = scrollTop - card.offsetTop
        bg.style.transform = `translateY(${offset * 0.35}px)`
      })
    }

    container.addEventListener('scroll', onScroll, { passive: true })

    const getNearestIndex = () => {
      const cards = sections()
      const top = container.scrollTop
      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetTop - top)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      return nearestIndex
    }

    const onWheel = (event) => {
      if (Math.abs(event.deltaY) < 8) {
        return
      }

      event.preventDefault()
      if (lockScrollRef.current) {
        return
      }

      const cards = sections()
      if (cards.length === 0) {
        return
      }

      const currentIndex = getNearestIndex()
      const step = event.deltaY > 0 ? 1 : -1
      const nextIndex = Math.min(cards.length - 1, Math.max(0, currentIndex + step))

      if (nextIndex === currentIndex) {
        return
      }

      lockScrollRef.current = true
      cards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.setTimeout(() => {
        lockScrollRef.current = false
      }, 520)
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      container.removeEventListener('scroll', onScroll)
      container.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <section className="presentation-wrapper route-panel">
      <div className="game-screen" aria-label="Các phần nội dung lịch sử" ref={containerRef}>
        {timeline1986to1991.map((item, index) => (
          <article
            key={item.id}
            className="level-screen"
            style={{ '--level-gradient': item.gradient }}
            onClick={() => openLevel(item.id)}
            onKeyDown={(event) => handleLevelKeyDown(event, item.id)}
            role="button"
            tabIndex={0}
            aria-label={`Mở ${item.level}: ${item.title}`}
            data-level-card
          >
            <div className="level-bg" data-level-bg aria-hidden="true">
              <img src={item.image} alt="" className="level-bg-image" loading="lazy" />
            </div>
            <div className="level-overlay" />
            <div className="level-content">
              <p className="level-tag">{item.level}</p>
              <p className="level-period">{item.period}</p>
              <h2>{item.title}</h2>
              <p>{item.marker}</p>
              <p className="level-hint">Nhấn để mở chi tiết phần</p>
              <p className="level-progress">
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
