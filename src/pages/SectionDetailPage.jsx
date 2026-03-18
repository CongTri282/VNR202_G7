import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { timeline1986to1991 } from '../data/timeline1986_1991'
import placeholderImage from '../assets/home-bg.jpg'

const legacySectionToPart = {
  lv1: 'part-1',
  lv2: 'part-1',
  lv3: 'part-1',
  lv4: 'part-2',
  lv5: 'part-2',
  lv6: 'part-3',
  lv7: 'part-3',
}

function SectionDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const containerRef = useRef(null)
  const modalImageRef = useRef(null)
  const backTimeoutRef = useRef(null)
  const { partId, legacyId } = useParams()
  const shouldSlideIn = location.state?.enterAnimation === 'slide-from-right'
  const activeId = partId || legacySectionToPart[legacyId] || legacyId
  const startIndex = useMemo(() => {
    const foundIndex = timeline1986to1991.findIndex((item) => item.id === activeId)
    return foundIndex >= 0 ? foundIndex : 0
  }, [activeId])

  const [isReturningToList, setIsReturningToList] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [flyImage, setFlyImage] = useState(null)
  const [isModalContentVisible, setIsModalContentVisible] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [visibleSlideCount, setVisibleSlideCount] = useState(3)

  const sliderImages = useMemo(() => {
    const images = [
      ...timeline1986to1991.map((part) => ({
        src: part.image,
        alt: part.imageAlt || `Tư liệu ${part.title}`,
      })),
      { src: placeholderImage, alt: 'Tư liệu minh họa lịch sử Việt Nam' },
    ].filter((item) => item.src)

    const unique = []
    const seen = new Set()
    images.forEach((item) => {
      if (!seen.has(item.src)) {
        seen.add(item.src)
        unique.push(item)
      }
    })

    return unique
  }, [])

  const goToSlide = (targetIndex) => {
    setActiveSlideIndex(targetIndex)
  }

  const goToPrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
  }

  const goToNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % sliderImages.length)
  }

  const displayedSliderImages = useMemo(() => {
    const count = Math.min(visibleSlideCount, sliderImages.length)
    return Array.from({ length: count }, (_, offset) => {
      const idx = (activeSlideIndex + offset) % sliderImages.length
      return sliderImages[idx]
    })
  }, [activeSlideIndex, sliderImages, visibleSlideCount])

  const openDetailModal = (part, section, event) => {
    const triggerElement = event?.currentTarget
    const triggerBlock = triggerElement?.closest('.detail-block')
    const triggerImage =
      triggerBlock?.querySelector('.section-image') || triggerElement?.querySelector('img') || null
    const triggerRect = triggerImage ? triggerImage.getBoundingClientRect() : null

    setIsModalContentVisible(false)
    setActiveModal({
      partId: part.id,
      partTitle: part.title,
      sectionTitle: section.title,
      image: section.image || part.image,
      imageAlt: section.imageAlt || `Minh họa cho ${section.title}`,
      points: section.points || [],
      triggerRect,
    })
  }

  const closeDetailModal = () => {
    setFlyImage(null)
    setIsModalContentVisible(false)
    setActiveModal(null)
  }

  const handleModalOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closeDetailModal()
    }
  }

  const backToPresentation = () => {
    if (isReturningToList) {
      return
    }

    setIsReturningToList(true)
    backTimeoutRef.current = window.setTimeout(() => {
      navigate('/presentation', {
        state: {
          enterAnimation: 'slide-from-left',
          returnToPartId: timeline1986to1991[startIndex]?.id,
        },
      })
    }, 340)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const sections = Array.from(container.querySelectorAll('[data-detail-part]'))
    if (!sections.length) {
      return
    }

    const targetSection = sections[startIndex] || sections[0]
    container.scrollTo({ top: targetSection.offsetTop, behavior: 'auto' })

    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [startIndex])

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const revealItems = Array.from(container.querySelectorAll('[data-detail-reveal]'))
    if (!revealItems.length) {
      return
    }

    revealItems.forEach((item) => item.classList.remove('is-visible'))

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      {
        root: container,
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    let setupTimer = window.setTimeout(
      () => {
        revealItems.forEach((item) => observer.observe(item))
      },
      shouldSlideIn ? 260 : 0,
    )

    return () => {
      window.clearTimeout(setupTimer)
      observer.disconnect()
      if (backTimeoutRef.current) {
        window.clearTimeout(backTimeoutRef.current)
      }
    }
  }, [startIndex, shouldSlideIn])

  useEffect(() => {
    if (!activeModal) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDetailModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModal])

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth <= 640) {
        setVisibleSlideCount(1)
        return
      }

      if (window.innerWidth <= 1080) {
        setVisibleSlideCount(2)
        return
      }

      setVisibleSlideCount(3)
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  useEffect(() => {
    if (sliderImages.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % sliderImages.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [sliderImages.length])

  useEffect(() => {
    if (!activeModal) {
      return
    }

    let raf1 = null
    let raf2 = null
    let doneTimer = null

    const targetImage = modalImageRef.current
    if (!targetImage) {
      setIsModalContentVisible(true)
      return
    }

    if (!activeModal.triggerRect) {
      setIsModalContentVisible(true)
      return
    }

    const targetRect = targetImage.getBoundingClientRect()

    setFlyImage({
      src: activeModal.image,
      alt: activeModal.imageAlt,
      fromRect: activeModal.triggerRect,
      toRect: targetRect,
      phase: 'from',
    })

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setFlyImage((prev) => (prev ? { ...prev, phase: 'to' } : prev))
      })
    })

    doneTimer = window.setTimeout(() => {
      setFlyImage(null)
      setIsModalContentVisible(true)
    }, 430)

    return () => {
      if (raf1) {
        window.cancelAnimationFrame(raf1)
      }
      if (raf2) {
        window.cancelAnimationFrame(raf2)
      }
      if (doneTimer) {
        window.clearTimeout(doneTimer)
      }
    }
  }, [activeModal])

  return (
    <section
      ref={pageRef}
      className={`detail-page detail-merged route-panel${shouldSlideIn ? ' route-slide-in-right' : ''}${
        isReturningToList ? ' route-slide-out-right' : ''
      }`}
      aria-live="polite"
    >
      <div ref={containerRef} className="detail-scroll-shell" aria-label="Chi tiết các phần nội dung lịch sử">
        {timeline1986to1991.map((part, partIndex) => {
          return (
            <article key={part.id} className="detail-part-screen" data-detail-part>
              <div className="detail-layout">
                <main className="detail-main">
                  <header className="detail-header detail-reveal" data-detail-reveal>
                    <div className="detail-hero-image-wrap detail-image-wrap">
                      <img
                        src={part.image}
                        alt={part.imageAlt}
                        className="detail-hero-image"
                        loading="lazy"
                      />
                    </div>
                    <p>
                      {part.section} | {part.period}
                    </p>
                    <h2>{part.title}</h2>
                    <p>{part.summary}</p>
                  </header>

                  <section className="detail-section detail-reveal" aria-label="Điểm nhấn nội dung" data-detail-reveal>
                    <div className="detail-toolbar">
                      <h3>Nội dung chính</h3>
                    </div>

                    <div className="section-grid">
                      {part.sections.map((section, index) => (
                        <article
                          key={section.title}
                          className="detail-block detail-reveal"
                          data-detail-reveal
                          style={{ '--reveal-delay': `${index * 70}ms` }}
                        >
                          <button
                            type="button"
                            className="section-media-trigger"
                            onClick={(event) => openDetailModal(part, section, event)}
                            aria-label={`Mở chi tiết ${section.title}`}
                          >
                            <div className="section-media" aria-hidden="true">
                              <img
                                src={section.image || part.image}
                                alt={section.imageAlt || `Minh họa cho ${section.title}`}
                                className="section-image"
                                loading="lazy"
                              />
                            </div>
                          </button>
                          <button
                            type="button"
                            className="section-title-trigger"
                            onClick={(event) => openDetailModal(part, section, event)}
                          >
                            {section.title}
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                </main>

                <aside className="detail-side" aria-label="Thông tin phụ trợ">
                  <div
                    className="detail-side-block detail-reveal"
                    data-detail-reveal
                    style={{ '--reveal-delay': '80ms' }}
                  >
                    <h3>Từ khóa chủ đề</h3>
                    <div className="chip-list" aria-label="Từ khóa chủ đề">
                      {part.keywords.map((tag) => (
                        <span key={tag} className="chip-item">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <section
                    className="impact-box detail-reveal"
                    aria-label="Ý nghĩa lịch sử"
                    data-detail-reveal
                    style={{ '--reveal-delay': '140ms' }}
                  >
                    <h3>Ý nghĩa lịch sử</h3>
                    <p>{part.impact}</p>
                  </section>

                  <p
                    className="detail-scroll-hint detail-reveal"
                    data-detail-reveal
                    style={{ '--reveal-delay': '200ms' }}
                  >
                    Lăn chuột xuống hoặc lên để xem phần kế tiếp/trước đó.
                  </p>

                  <p
                    className="detail-scroll-hint detail-reveal"
                    data-detail-reveal
                    style={{ '--reveal-delay': '240ms' }}
                  >
                    Phần {partIndex + 1}/{timeline1986to1991.length}
                  </p>

                  <button
                    type="button"
                    onClick={backToPresentation}
                    className="primary-link detail-reveal detail-back-button"
                    data-detail-reveal
                    style={{ '--reveal-delay': '280ms' }}
                  >
                    Quay lại danh sách các phần
                  </button>
                </aside>
              </div>

              <section className="party-slider detail-reveal" data-detail-reveal aria-label="Trình chiếu hình ảnh tư liệu về Đảng">
                <div className="party-slider-header">
                  <h3>Thư viện ảnh tư liệu</h3>
                </div>

                <div className="party-slider-stage">
                  {displayedSliderImages.map((image, index) => (
                    <figure key={`${image.src}-${index}`} className="party-slider-card">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="party-slider-image"
                        loading="lazy"
                      />
                    </figure>
                  ))}

                  {sliderImages.length > 1 ? (
                    <>
                      <button
                        type="button"
                        className="party-slider-nav party-slider-prev"
                        onClick={goToPrevSlide}
                        aria-label="Ảnh trước"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="party-slider-nav party-slider-next"
                        onClick={goToNextSlide}
                        aria-label="Ảnh tiếp theo"
                      >
                        ›
                      </button>
                    </>
                  ) : null}
                </div>

                {sliderImages.length > 1 ? (
                  <div className="party-slider-dots" role="tablist" aria-label="Điều hướng ảnh">
                    {sliderImages.map((image, index) => (
                      <button
                        key={`dot-${image.src}-${index}`}
                        type="button"
                        className={`party-slider-dot ${index === activeSlideIndex ? 'is-active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Chuyển tới ảnh ${index + 1}`}
                        aria-selected={index === activeSlideIndex}
                        role="tab"
                      />
                    ))}
                  </div>
                ) : null}
              </section>
            </article>
          )
        })}
      </div>

      {activeModal ? (
        <div
          className="detail-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Chi tiết ${activeModal.sectionTitle}`}
          onClick={handleModalOverlayClick}
        >
          <article className={`detail-modal-card${isModalContentVisible ? ' modal-ready' : ' modal-opening'}`}>
            <button
              type="button"
              className="detail-modal-close"
              onClick={closeDetailModal}
              aria-label="Đóng cửa sổ chi tiết"
            >
              ×
            </button>
            <div className="detail-modal-layout">
              <div className="detail-modal-image-col">
                <img
                  ref={modalImageRef}
                  src={activeModal.image}
                  alt={activeModal.imageAlt}
                  className="detail-modal-image"
                  loading="lazy"
                />
              </div>
              <div className="detail-modal-content-col">
                <p className="detail-modal-kicker">{activeModal.partTitle}</p>
                <h3>{activeModal.sectionTitle}</h3>
                <ul className="detail-modal-list">
                  {activeModal.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
          {flyImage ? (
            <img
              src={flyImage.src}
              alt={flyImage.alt}
              className="detail-modal-fly-image"
              style={{
                top: `${(flyImage.phase === 'to' ? flyImage.toRect : flyImage.fromRect).top}px`,
                left: `${(flyImage.phase === 'to' ? flyImage.toRect : flyImage.fromRect).left}px`,
                width: `${(flyImage.phase === 'to' ? flyImage.toRect : flyImage.fromRect).width}px`,
                height: `${(flyImage.phase === 'to' ? flyImage.toRect : flyImage.fromRect).height}px`,
                opacity: flyImage.phase === 'to' ? 0.2 : 1,
              }}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export default SectionDetailPage
