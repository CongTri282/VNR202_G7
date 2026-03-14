import { NavLink } from 'react-router-dom'

function HomePage() {
  return (
    <section className="home-panel route-panel">
      <p className="eyebrow">Trải nghiệm mốc thời gian tương tác</p>
      <h2>Khám phá nội dung thuyết trình theo 7 level</h2>
      <p>
        Hệ thống gồm hai phần: Thuyết trình để xem nội dung theo level, và Game để học tập tương tác.
      </p>
      <div className="home-actions">
        <NavLink to="/presentation" className="primary-link">
          Xem thuyết trình
        </NavLink>
        <NavLink to="/game" className="primary-link secondary-link">
          Vào Game
        </NavLink>
      </div>
    </section>
  )
}

export default HomePage
