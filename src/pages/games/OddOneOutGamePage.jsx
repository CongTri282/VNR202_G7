import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { oddOneOutGame } from '../../data/oddOneOutGame'

function OddOneOutGamePage() {
  const [selectedWord, setSelectedWord] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = selectedWord === oddOneOutGame.answer

  const handleSubmit = () => {
    if (!selectedWord) {
      return
    }
    setSubmitted(true)
  }

  const resetGame = () => {
    setSelectedWord('')
    setSubmitted(false)
  }

  return (
    <section className="odd-page route-panel">
      <div className="odd-panel">
        <p className="eyebrow">Trò 1: Kẻ Ngoại Đạo</p>
        <h2>Hãy chọn tổ chức khác nhóm</h2>
        <p>Chọn 1 đáp án trong danh sách. Sau khi nộp, hệ thống sẽ cho biết đúng/sai.</p>

        <div className="odd-word-grid" role="group" aria-label="Danh sách đáp án">
          {oddOneOutGame.words.map((word) => {
            const isActive = selectedWord === word
            const isAnswer = word === oddOneOutGame.answer
            const classNames = [
              'odd-word-btn',
              isActive ? 'active' : '',
              submitted && isAnswer ? 'correct' : '',
              submitted && isActive && !isAnswer ? 'wrong' : '',
            ]
              .join(' ')
              .trim()

            return (
              <button
                key={word}
                type="button"
                className={classNames}
                onClick={() => setSelectedWord(word)}
                disabled={submitted}
                aria-pressed={isActive}
              >
                {word}
              </button>
            )
          })}
        </div>

        <div className="odd-actions">
          <button
            type="button"
            className="odd-control"
            onClick={handleSubmit}
            disabled={!selectedWord || submitted}
          >
            Nộp đáp án
          </button>
          <button type="button" className="odd-control ghost" onClick={resetGame}>
            Chơi lại
          </button>
        </div>

        {submitted ? (
          <article className={`odd-result ${isCorrect ? 'correct' : 'wrong'}`} aria-live="polite">
            <h3>{isCorrect ? 'Chính xác!' : 'Chưa chính xác'}</h3>
            <p>
              Đáp án đúng: <strong>{oddOneOutGame.answer}</strong>
            </p>
            <p>{oddOneOutGame.explanation}</p>
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
