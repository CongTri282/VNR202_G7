import { NavLink } from 'react-router-dom'
import homeBackgroundImage from '../assets/home-bg.jpg'

function HomePage() {
  const quickHighlights = [
    { label: 'Timeline', value: '1986 - 1991' },
    { label: 'Mốc nội dung', value: '3 phần chính' },
    { label: 'Hình thức học', value: 'Nội dung + Game' },
  ]

  return (
    <section className="home-panel route-panel" style={{ '--home-screen-image': `url(${homeBackgroundImage})` }}>
      <div className="home-hero-shell">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="home-hero-content">
          <p className="eyebrow home-reveal home-reveal-1">Trải nghiệm mốc thời gian tương tác</p>
          <h2 className="home-reveal home-reveal-2">Khám phá Việt Nam đổi mới qua từng phần sống động</h2>
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
        </div>


      </div>
    </section>
  )
}

export default HomePage
