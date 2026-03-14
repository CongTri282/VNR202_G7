import { useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { timeline1986to1991 } from '../data/timeline1986_1991'

function LevelDetailPage() {
  const { levelId } = useParams()
  const currentIndex = useMemo(
    () => timeline1986to1991.findIndex((item) => item.id === levelId),
    [levelId],
  )

  const level = currentIndex >= 0 ? timeline1986to1991[currentIndex] : null
  const previousLevel = currentIndex > 0 ? timeline1986to1991[currentIndex - 1] : null
  const nextLevel =
    currentIndex >= 0 && currentIndex < timeline1986to1991.length - 1
      ? timeline1986to1991[currentIndex + 1]
      : null

  const [expandedSections, setExpandedSections] = useState(() => new Set([0]))

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
    if (!level) {
      return
    }
    setExpandedSections(new Set(level.sections.map((_, index) => index)))
  }

  const collapseAllSections = () => {
    setExpandedSections(new Set())
  }

  if (!level) {
    return (
      <section className="detail-page route-panel">
        <h2>Không tìm thấy level</h2>
        <p>Level bạn chọn không tồn tại. Hãy quay lại phần Thuyết trình để chọn lại.</p>
        <NavLink to="/presentation" className="primary-link">
          Quay lại Thuyết trình
        </NavLink>
      </section>
    )
  }

  return (
    <section className="detail-page route-panel" aria-live="polite">
      <div className="detail-layout">
        <main className="detail-main">
          <header className="detail-header">
            <div className="level-image-wrap detail-image-wrap">
              <img src={level.image} alt={level.imageAlt} className="level-image" loading="lazy" />
            </div>
            <p>
              {level.level} | {level.period}
            </p>
            <h2>{level.title}</h2>
            <p>{level.summary}</p>
          </header>

          <section className="detail-section" aria-label="Điểm nhấn nội dung">
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
              {level.sections.map((section, index) => (
                <article key={section.title} className="detail-block">
                  <div className="section-media" aria-hidden="true">
                    <img
                      src={section.image || level.image}
                      alt={section.imageAlt || `Minh họa cho ${section.title}`}
                      className="section-image"
                      loading="lazy"
                    />
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
          <div className="detail-side-block">
            <h3>Từ khóa chủ đề</h3>
            <div className="chip-list" aria-label="Từ khóa chủ đề">
              {level.keywords.map((tag) => (
                <span key={tag} className="chip-item">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <section className="impact-box" aria-label="Ý nghĩa lịch sử">
            <h3>Ý nghĩa lịch sử</h3>
            <p>{level.impact}</p>
          </section>

          <div className="detail-nav-links" aria-label="Điều hướng giữa các mục">
            {previousLevel ? (
              <NavLink to={`/presentation/levels/${previousLevel.id}`} className="primary-link secondary-link">
                ← {previousLevel.level}
              </NavLink>
            ) : (
              <span className="nav-link-placeholder">Đang ở mục đầu tiên</span>
            )}

            {nextLevel ? (
              <NavLink to={`/presentation/levels/${nextLevel.id}`} className="primary-link secondary-link">
                {nextLevel.level} →
              </NavLink>
            ) : (
              <span className="nav-link-placeholder">Đang ở mục cuối cùng</span>
            )}
          </div>

          <NavLink to="/presentation" className="primary-link">
            Quay lại danh sách level
          </NavLink>
        </aside>
      </div>
    </section>
  )
}

export default LevelDetailPage
