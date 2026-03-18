import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { timeline1986to1991 } from '../data/timeline1986_1991'
import placeholderImage from '../assets/home-bg.jpg'
import { Row } from 'antd'

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
  const { partId, levelId: legacyId } = useParams()
  const activeId = partId || legacySectionToPart[legacyId] || legacyId
  const shouldSlideIn = location.state?.enterAnimation === 'slide-from-right'
  const backTimeoutRef = useRef(null)
  const currentIndex = useMemo(
    () => timeline1986to1991.findIndex((item) => item.id === activeId),
    [activeId],
  )

  const currentSection = currentIndex >= 0 ? timeline1986to1991[currentIndex] : null
  const previousSection = currentIndex > 0 ? timeline1986to1991[currentIndex - 1] : null
  const nextSection =
    currentIndex >= 0 && currentIndex < timeline1986to1991.length - 1
      ? timeline1986to1991[currentIndex + 1]
      : null

  const [expandedSections, setExpandedSections] = useState(() => new Set([0]))
  const [isReturningToList, setIsReturningToList] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionIndex)) {
        next.delete(sectionIndex)
      } else {
        next.add(sectionIndex)
      }
      return next
    })
  }

  const expandAllSections = () => {
    if (!currentSection) {
      return
    }
    setExpandedSections(new Set(currentSection.sections.map((_, index) => index)))
  }

  const collapseAllSections = () => {
    setExpandedSections(new Set())
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
          returnToPartId: currentSection?.id,
        },
      })
    }, 340)
  }

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('[data-detail-reveal]'))
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
          const shouldShow = entry.isIntersecting && entry.intersectionRatio >= 0.12
          entry.target.classList.toggle('is-visible', shouldShow)
        })
      },
      {
        root: null,
        threshold: [0.12, 0.25, 0.35],
        rootMargin: '0px 0px -10% 0px',
      }
    )

    const setupTimer = window.setTimeout(
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
  }, [currentSection, shouldSlideIn])

  const buildVisuals = (section) => {
    const visuals = [
      section.image,
      currentSection?.image,
      previousSection?.image,
      nextSection?.image,
      placeholderImage,
    ].filter(Boolean)

    return [visuals[0], visuals[1] || visuals[0], visuals[2] || visuals[1] || visuals[0]].map(
      (image) => image || placeholderImage,
    )
  }

  const sliderImages = useMemo(() => {
    if (!currentSection) {
      return [{ src: placeholderImage, alt: 'Hình minh họa tư liệu lịch sử' }]
    }

    const rawImages = [
      { src: currentSection.image, alt: currentSection.imageAlt || currentSection.title },
      {
        src: previousSection?.image,
        alt: previousSection?.imageAlt || (previousSection ? previousSection.title : ''),
      },
      {
        src: nextSection?.image,
        alt: nextSection?.imageAlt || (nextSection ? nextSection.title : ''),
      },
      ...currentSection.sections.map((section) => ({
        src: section.image,
        alt: section.imageAlt || `Minh họa cho ${section.title}`,
      })),
      { src: placeholderImage, alt: 'Hình minh họa lịch sử Việt Nam' },
    ].filter((item) => item.src)

    const uniqueImages = []
    const seen = new Set()

    rawImages.forEach((item) => {
      if (!seen.has(item.src)) {
        seen.add(item.src)
        uniqueImages.push(item)
      }
    })

    return uniqueImages.length ? uniqueImages : [{ src: placeholderImage, alt: 'Hình minh họa lịch sử Việt Nam' }]
  }, [currentSection, previousSection, nextSection])

  useEffect(() => {
    setActiveSlideIndex(0)
  }, [currentSection?.id])

  useEffect(() => {
    if (sliderImages.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % sliderImages.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [sliderImages.length])

  const goToSlide = (targetIndex) => {
    setActiveSlideIndex(targetIndex)
  }

  const goToPrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
  }

  const goToNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % sliderImages.length)
  }

  if (!currentSection) {
    return (
      <section className="detail-page route-panel">
        <h2>Không tìm thấy phần nội dung</h2>
        <p>Phần bạn chọn không tồn tại. Hãy quay lại mục Nội dung để chọn lại.</p>
        <NavLink to="/presentation" className="primary-link">
          Quay lại Nội dung
        </NavLink>
      </section>
    )
  }

  return (
    <section
      className={`detail-page route-panel${
        isReturningToList ? ' route-slide-out-right' : ''
      }${shouldSlideIn ? ' route-slide-in-right' : ''}`}
      aria-live="polite"
    >
      <div className="detail-layout">
        <Row className="detail-row" gutter={[32, 32]}>
        <main className="detail-main">
          <header className="detail-header detail-reveal" data-detail-reveal>
            <div className="section-image-wrap detail-image-wrap">
              <img src={currentSection.image} alt={currentSection.imageAlt} className="section-image" loading="lazy" />
            </div>
            <p>
              {currentSection.section} | {currentSection.period}
            </p>
            <h2>{currentSection.title}</h2>
            <p>{currentSection.summary}</p>
          </header>

          <section className="detail-section detail-reveal" aria-label="Điểm nhấn nội dung" data-detail-reveal>
            <div className="detail-toolbar">
              <h3>Nội dung chính</h3>
              <div className="detail-toolbar-actions">
                <button type="button" className="detail-tool-button" onClick={expandAllSections}>
                  Mở tất cả
                </button>
                <button type="button" className="detail-tool-button" onClick={collapseAllSections}>
                  Thu gọn tất cả
                </button>
              </div>
            </div>

            <div className="section-grid">
              {currentSection.sections.map((section, index) => (
                <article
                  key={section.title}
                  className="detail-block detail-reveal"
                  data-detail-reveal
                  style={{ '--reveal-delay': `${index * 70}ms` }}
                >
                  <div className="section-media" aria-hidden="true">
                    <img
                      src={section.image || currentSection.image}
                      alt={section.imageAlt || `Minh họa cho ${section.title}`}
                      className="section-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="detail-image-gallery" aria-hidden="true">
                    {buildVisuals(section).map((image, imageIndex) => (
                      <img key={`${section.title}-${imageIndex}`} src={image} alt="" className="detail-thumb-image" loading="lazy" />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="section-toggle"
                    onClick={() => toggleSection(index)}
                    aria-expanded={expandedSections.has(index)}
                  >
                    <span>{section.title}</span>
                    <span className="section-toggle-indicator">
                      {expandedSections.has(index) ? '−' : '+'}
                    </span>
                  </button>
                  <div className={`section-panel ${expandedSections.has(index) ? 'expanded' : ''}`}>
                    <ul>
                      {section.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="detail-side" aria-label="Thông tin phụ trợ">
          <div className="detail-side-block detail-reveal" data-detail-reveal style={{ '--reveal-delay': '80ms' }}>
            <h3>Từ khóa chủ đề</h3>
            <div className="chip-list" aria-label="Từ khóa chủ đề">
              {currentSection.keywords.map((tag) => (
                <span key={tag} className="chip-item">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <section className="impact-box detail-reveal" aria-label="Ý nghĩa lịch sử" data-detail-reveal style={{ '--reveal-delay': '140ms' }}>
            <h3>Ý nghĩa lịch sử</h3>
            <p>{currentSection.impact}</p>
          </section>

          <div className="detail-nav-links detail-reveal" aria-label="Điều hướng giữa các mục" data-detail-reveal style={{ '--reveal-delay': '200ms' }}>
            {previousSection ? (
              <NavLink to={`/presentation/parts/${previousSection.id}`} className="primary-link secondary-link">
                ← {previousSection.section}
              </NavLink>
            ) : (
              <span className="nav-link-placeholder">Đang ở phần đầu tiên</span>
            )}

            {nextSection ? (
              <NavLink to={`/presentation/parts/${nextSection.id}`} className="primary-link secondary-link">
                {nextSection.section} →
              </NavLink>
            ) : (
              <span className="nav-link-placeholder">Đang ở phần cuối cùng</span>
            )}
          </div>

          <button
            type="button"
            onClick={backToPresentation}
            className="primary-link detail-reveal"
            data-detail-reveal
            style={{ '--reveal-delay': '260ms' }}
          >
            Quay lại danh sách các phần
          </button>
        </aside>
        </Row>
        
      </div>
    </section>
  )
}

export default SectionDetailPage
