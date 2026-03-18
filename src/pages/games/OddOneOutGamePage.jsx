import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { oddOneOutGame } from '../../data/oddOneOutGame'
import { recordGameStart } from '../../lib/userMetrics'

function OddOneOutGamePage() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [selectedWord, setSelectedWord] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [completedLevels, setCompletedLevels] = useState([])

  useEffect(() => {
    recordGameStart()
  }, [])

  const currentLevel = oddOneOutGame.levels[currentLevelIndex]
  const isCorrect = selectedWord === currentLevel.answer
  const allLevelsCompleted = completedLevels.length === oddOneOutGame.levels.length

  const handleSubmit = () => {
    if (!selectedWord) {
      return
    }
    setSubmitted(true)

    if (isCorrect && !completedLevels.includes(currentLevelIndex)) {
      setCompletedLevels([...completedLevels, currentLevelIndex])
    }
  }

  const nextLevel = () => {
    if (currentLevelIndex < oddOneOutGame.levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1)
      setSelectedWord('')
      setSubmitted(false)
    }
  }

  const resetGame = () => {
    setSelectedWord('')
    setSubmitted(false)
  }

  const restartAllGame = () => {
    setCurrentLevelIndex(0)
    setSelectedWord('')
    setSubmitted(false)
    setCompletedLevels([])
  }

  if (allLevelsCompleted && submitted) {
    return (
      <section className="odd-page route-panel">
        <div className="odd-panel odd-panel-large">
          <p className="eyebrow">Trò chơi: Kẻ Ngoại Đạo</p>
          <h2>Xin chúc mừng! 🎉</h2>
          <p className="odd-subtitle">Bạn đã hoàn thành tất cả 5 cấp độ của trò chơi Kẻ Ngoại Đạo.</p>

          <div className="odd-victory">
            <div className="victory-icon">🏆</div>
            <p className="victory-text">Bạn đã trả lời chính xác {completedLevels.length}/5 cấp độ</p>
          </div>

          <div className="odd-actions">
            <button type="button" className="odd-control primary-btn" onClick={restartAllGame}>
              Chơi lại từ đầu
            </button>
          </div>

          <NavLink to="/game" className="primary-link secondary-link">
            Quay lại danh sách trò chơi
          </NavLink>
        </div>
      </section>
    )
  }

  return (
    <section className="odd-page route-panel">
      <div className="odd-panel">
        <div className="odd-header">
          <p className="eyebrow">Trò chơi: Kẻ Ngoại Đạo</p>
          <div className="odd-progress">
            <span className="odd-level-info">
              {currentLevel.level} ({currentLevelIndex + 1}/{oddOneOutGame.levels.length})
            </span>
            <div className="odd-progress-bar">
              <div
                className="odd-progress-fill"
                style={{
                  width: `${((currentLevelIndex + 1) / oddOneOutGame.levels.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="odd-content">
          <h2 className="odd-title">Hãy chọn từ khác nhóm</h2>
          <p className="odd-subtitle">Chọn 1 đáp án trong danh sách. Sau khi nộp, hệ thống sẽ cho biết đúng/sai.</p>

          <div className="odd-word-grid" role="group" aria-label="Danh sách đáp án">
            {currentLevel.words.map((word) => {
              const isActive = selectedWord === word
              const isAnswer = word === currentLevel.answer
              const classNames = [
                'odd-word-btn',
                isActive ? 'active' : '',
                submitted && isCorrect && isAnswer ? 'correct' : '',
                submitted && isActive && !isAnswer ? 'wrong' : '',
              ]
                .join(' ')
                .trim()

              return (
                <button
                  key={word}
                  type="button"
                  className={classNames}
                  onClick={() => !submitted && setSelectedWord(word)}
                  disabled={submitted}
                  aria-pressed={isActive}
                >
                  {word}
                </button>
              )
            })}
          </div>
        </div>

        <div className="odd-actions">
          <button
            type="button"
            className="odd-control primary-btn"
            onClick={handleSubmit}
            disabled={!selectedWord || submitted}
          >
            Nộp đáp án
          </button>
          <button type="button" className="odd-control ghost-btn" onClick={resetGame} disabled={!selectedWord && !submitted}>
            Chọn lại
          </button>
        </div>

        {submitted ? (
          <article
            className={`odd-result ${isCorrect ? 'correct' : 'wrong'}`}
            aria-live="polite"
            role="status"
          >
            <div className="odd-result-header">
              <div className="odd-result-icon">
                {isCorrect ? '✓' : '✗'}
              </div>
              <h3>{isCorrect ? 'Chính xác! Tuyệt vời!' : 'Chưa chính xác'}</h3>
            </div>

            {isCorrect ? (
              <>
                <p className="odd-result-answer">
                  Đáp án đúng: <strong>{currentLevel.answer}</strong>
                </p>
                <p className="odd-explanation">{currentLevel.explanation}</p>

                {currentLevelIndex < oddOneOutGame.levels.length - 1 ? (
                  <button type="button" className="odd-control primary-btn next-btn" onClick={nextLevel}>
                    Sang cấp độ tiếp theo →
                  </button>
                ) : (
                  <button type="button" className="odd-control primary-btn next-btn" onClick={nextLevel}>
                    Hoàn thành trò chơi 🎉
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="odd-retry-message">Hãy thử lại! Chọn một đáp án khác.</p>
                <button
                  type="button"
                  className="odd-control ghost-btn"
                  onClick={resetGame}
                >
                  Thử lại
                </button>
              </>
            )}
          </article>
        ) : null}

        <NavLink to="/game" className="primary-link secondary-link">
          Quay lại danh sách trò chơi
        </NavLink>
      </div>
    </section>
  )
}

export default OddOneOutGamePage
