import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import homeBackgroundImage from '../assets/home-bg.jpg'
import { getUserMetrics } from '../lib/userMetrics'

function HomePage() {
  const quickHighlights = [
    { label: 'Timeline', value: '1986 - 1991' },
    { label: 'Mốc nội dung', value: '3 phần chính' },
    { label: 'Hình thức học', value: 'Nội dung + Game' },
  ]

  const [metrics, setMetrics] = useState(() => getUserMetrics())

  useEffect(() => {
    document.title = 'Trang chủ | Đảng Cộng sản Việt Nam 1986 - 1991'
  }, [])

  useEffect(() => {
    const refreshMetrics = () => setMetrics(getUserMetrics())
    const timerId = window.setInterval(refreshMetrics, 2000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  const metricsCards = useMemo(
    () => [
      { label: 'Tổng lượt truy cập', value: metrics.totalVisits },
      { label: 'Lượt truy cập hôm nay', value: metrics.visitsToday },
      { label: 'Lượt vào game', value: metrics.gameStarts },
      { label: 'Tin nhắn hỗ trợ', value: metrics.chatMessagesSent },
    ],
    [metrics],
  )

  const formattedLastActive = metrics.lastActiveAt
    ? new Date(metrics.lastActiveAt).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'Chưa có hoạt động'

  return (
    <section className="home-panel route-panel" style={{ '--home-screen-image': `url(${homeBackgroundImage})` }}>
      <div className="home-hero-shell">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="home-hero-content">
          <p className="eyebrow home-reveal home-reveal-1">Trải nghiệm mốc thời gian tương tác</p>
          <h2 className="home-reveal home-reveal-2">Khám phá Đảng Cộng sản Việt Nam giai đoạn 1986 - 1991</h2>
          <p className="home-lead home-reveal home-reveal-3">
            Mỗi phần là một lát cắt lịch sử được kể bằng hình ảnh, điểm nhấn kiến thức và tương tác trực quan,
            giúp bạn ghi nhớ nhanh hơn thay vì chỉ đọc văn bản.
          </p>

          <div className="home-actions home-reveal home-reveal-4">
            <NavLink to="/presentation" className="primary-link home-cta-main">
              Bắt đầu nội dung
            </NavLink>
            <NavLink to="/game" className="primary-link secondary-link home-cta-alt">
              Thử game ngay
            </NavLink>
          </div>

          <div className="home-highlight-grid home-reveal home-reveal-5">
            {quickHighlights.map((item) => (
              <article key={item.label} className="home-highlight-card">
                <p>{item.label}</p>
                <h3>{item.value}</h3>
              </article>
            ))}
          </div>

          <section className="home-user-metrics home-reveal home-reveal-6" aria-label="Số liệu người dùng">
            <div className="home-user-metrics-head">
              <h3>Số liệu người dùng</h3>
              <p>Cập nhật tự động theo hoạt động thực tế trên thiết bị này.</p>
            </div>

            <div className="home-user-grid">
              {metricsCards.map((item) => (
                <article key={item.label} className="home-user-card">
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>

            <p className="home-user-updated">Hoạt động gần nhất: {formattedLastActive}</p>
          </section>
        </div>


      </div>
    </section>
  )
}

export default HomePage
