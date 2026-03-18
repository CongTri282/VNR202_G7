import { NavLink } from 'react-router-dom'

function GameHubPage() {
  return (
    <section className="game-hub route-panel">
      <p className="eyebrow">Chế độ game</p>
      <h2>2 trò chơi tương tác</h2>
      <p>Trò đầu tiên đã mở: Kẻ Ngoại Đạo. Trò thứ hai sẽ bổ sung sau.</p>

      <div className="game-grid" aria-label="Danh sách trò chơi">
        <article className="game-card">
          <p className="game-card-tag">Trò 1</p>
          <h3>Kẻ Ngoại Đạo</h3>
          <p>
            Chọn tổ chức khác biệt với các tổ chức còn lại dựa trên kiến thức lịch sử.
          </p>
          <NavLink to="/game/ke-ngoai-dao" className="primary-link">
            Chơi ngay
          </NavLink>
        </article>

        <article className="game-card">
          <p className="game-card-tag">Trò 2</p>
          <h3>Xếp hình lịch sử</h3>
          <p>
            Ghép lại ảnh tư liệu Đại hội VI bằng cách di chuyển các mảnh liền kề vào ô trống.
          </p>
          <NavLink to="/game/tro-2" className="primary-link secondary-link">
            Chơi ngay
          </NavLink>
        </article>
      </div>
    </section>
  )
}

export default GameHubPage
