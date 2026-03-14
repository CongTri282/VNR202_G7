import { NavLink } from 'react-router-dom'

function HeaderNav() {
  return (
    <header className="top-header">
      <div className="brand-block">
        <p className="brand-kicker">Chế độ Lịch sử Việt Nam</p>
        <h1>Đảng Cộng sản Việt Nam 1986 - 1991</h1>
      </div>
      <nav className="top-nav" aria-label="Điều hướng chính">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          Home
        </NavLink>
        <NavLink
          to="/presentation"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          Thuyết trình
        </NavLink>
        <NavLink to="/game" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          Game
        </NavLink>
      </nav>
    </header>
  )
}

export default HeaderNav
