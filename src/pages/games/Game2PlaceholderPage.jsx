import { NavLink } from 'react-router-dom'

function Game2PlaceholderPage() {
  return (
    <section className="odd-page route-panel">
      <div className="odd-panel">
        <p className="eyebrow">Trò 2</p>
        <h2>Không gian trò chơi thứ hai</h2>
        <p>Route đã sẵn sàng. Hãy gửi luật chơi để mình tích hợp ngay.</p>
        <NavLink to="/game" className="primary-link secondary-link">
          Quay lại danh sách trò chơi
        </NavLink>
      </div>
    </section>
  )
}

export default Game2PlaceholderPage
