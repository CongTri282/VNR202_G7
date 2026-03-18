import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import puzzleImage from '../../assets/vnr2.jpg'

const GRID_OPTIONS = [3, 4]

const buildSolvedTiles = (size) => {
  const lastTile = size * size - 1
  return Array.from({ length: size * size }, (_, idx) => (idx === lastTile ? null : idx))
}

const getNeighborIndexes = (emptyIndex, size) => {
  const neighbors = []
  const row = Math.floor(emptyIndex / size)
  const col = emptyIndex % size

  if (row > 0) neighbors.push(emptyIndex - size)
  if (row < size - 1) neighbors.push(emptyIndex + size)
  if (col > 0) neighbors.push(emptyIndex - 1)
  if (col < size - 1) neighbors.push(emptyIndex + 1)

  return neighbors
}

const shuffleTiles = (size, iterations = size * size * 24) => {
  const tiles = buildSolvedTiles(size)
  let emptyIndex = tiles.indexOf(null)

  for (let i = 0; i < iterations; i += 1) {
    const neighbors = getNeighborIndexes(emptyIndex, size)
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)]
    ;[tiles[emptyIndex], tiles[randomNeighbor]] = [tiles[randomNeighbor], tiles[emptyIndex]]
    emptyIndex = randomNeighbor
  }

  return tiles
}

const isSolvedBoard = (tiles) => {
  const lastIndex = tiles.length - 1
  for (let i = 0; i < lastIndex; i += 1) {
    if (tiles[i] !== i) {
      return false
    }
  }
  return tiles[lastIndex] === null
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function Game2PlaceholderPage() {
  const [gridSize, setGridSize] = useState(3)
  const [tiles, setTiles] = useState(() => shuffleTiles(3))
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isSolved, setIsSolved] = useState(false)

  const solvedPreview = useMemo(() => buildSolvedTiles(gridSize), [gridSize])

  const resetGame = (size = gridSize) => {
    setGridSize(size)
    setTiles(shuffleTiles(size))
    setMoves(0)
    setSeconds(0)
    setIsStarted(false)
    setIsSolved(false)
  }

  useEffect(() => {
    if (!isStarted || isSolved) {
      return
    }

    const timer = window.setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isStarted, isSolved])

  const handleTileClick = (tileIndex) => {
    if (isSolved) {
      return
    }

    const emptyIndex = tiles.indexOf(null)
    const allowedMoves = getNeighborIndexes(emptyIndex, gridSize)
    if (!allowedMoves.includes(tileIndex)) {
      return
    }

    const nextTiles = [...tiles]
    ;[nextTiles[emptyIndex], nextTiles[tileIndex]] = [nextTiles[tileIndex], nextTiles[emptyIndex]]
    const solvedNow = isSolvedBoard(nextTiles)

    setTiles(nextTiles)
    setMoves((prev) => prev + 1)
    setIsStarted(true)
    setIsSolved(solvedNow)
  }

  return (
    <section className="game2-page route-panel" aria-label="Trò chơi xếp hình lịch sử">
      <div className="game2-panel">
        <div className="game2-header">
          <p className="eyebrow">Trò 2</p>
          <h2>Xếp hình Đại hội VI</h2>
          <p>
            Di chuyển các mảnh liền kề vào ô trống để ghép lại bức ảnh gốc. Bạn có thể chọn mức 3x3 hoặc 4x4.
          </p>
        </div>

        <div className="game2-toolbar" role="group" aria-label="Điều khiển trò chơi">
          <div className="game2-levels">
            {GRID_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                className={`game2-chip${gridSize === size ? ' is-active' : ''}`}
                onClick={() => resetGame(size)}
              >
                {size} x {size}
              </button>
            ))}
          </div>

          <div className="game2-stats" aria-live="polite">
            <span>Nước đi: {moves}</span>
            <span>Thời gian: {formatTime(seconds)}</span>
          </div>

          <button type="button" className="odd-control ghost-btn" onClick={() => resetGame()}>
            Xáo trộn lại
          </button>
        </div>

        {isSolved ? (
          <div className="game2-win" role="status">
            <h3>Hoàn thành xuất sắc!</h3>
            <p>
              Bạn đã ghép xong trong <strong>{moves}</strong> nước đi và <strong>{formatTime(seconds)}</strong>.
            </p>
          </div>
        ) : null}

        <div className="game2-layout">
          <div
            className="game2-board"
            style={{ '--game2-size': gridSize }}
            aria-label={`Bàn xếp hình ${gridSize} x ${gridSize}`}
          >
            {tiles.map((tile, index) => {
              if (tile === null) {
                return <div key={`empty-${index}`} className="game2-tile game2-empty" aria-hidden="true" />
              }

              const row = Math.floor(tile / gridSize)
              const col = tile % gridSize

              return (
                <button
                  key={`tile-${tile}`}
                  type="button"
                  className="game2-tile"
                  onClick={() => handleTileClick(index)}
                  style={{
                    backgroundImage: `url(${puzzleImage})`,
                    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                    backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
                  }}
                  aria-label={`Mảnh ${tile + 1}`}
                />
              )
            })}
          </div>

          <aside className="game2-preview">
            <h3>Ảnh gốc tham chiếu</h3>
            <div className="game2-preview-image-wrap">
              <img src={puzzleImage} alt="Ảnh Đại hội VI dùng để xếp hình" className="game2-preview-image" />
            </div>
            <p>Mẹo: xếp theo từng hàng từ trên xuống để giảm số nước đi.</p>
          </aside>
        </div>

        <div className="game2-actions">
          <NavLink to="/game" className="primary-link secondary-link">
            Quay lại danh sách trò chơi
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default Game2PlaceholderPage
