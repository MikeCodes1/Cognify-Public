import React from 'react'
import '../../Pages/ViewFlashcards/ViewFlashcards.css'
import './LastFlashCard.css'
const LastFlashCard = ({ onReset }) => {
  return (
    <div className='flashcard'>
      <div className="flashcard-inner">
        <div className="flashcard-front2">
          <div className='Congrats'>Congratulations!</div>
          <p>You've completed all flashcards</p>
          <button 
            className="reset-button"
            onClick={onReset}
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}

export default LastFlashCard