import React, { useEffect, useState } from 'react';
import Nav from '../../Components/Navigation/Nav';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { IoMdShuffle } from "react-icons/io";
import LastFlashCard from '../../Components/LastFlashCard/LastFlashCard';
import './ViewFlashcards.css';
import BackButton from '../../Components/BackButton/BackButton';
import Loading from '../../Components/Loading/Loading';
const ViewFlashcards = () => {
  const { id } = useParams(); // Get the set ID from the URL
  const [set, setSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [originalOrder, setOriginalOrder] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const getSet = async () => {
    try {
      const setDoc = doc(db, "Sets", id);
      const setSnap = await getDoc(setDoc);
      if (setSnap.exists()) {
        const data = setSnap.data();
        setSet({ id: setSnap.id, ...data });
        setFlashcards(data.Flashcards);
        setOriginalOrder(data.Flashcards);
      } else {
        console.error("No such document!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSet();
  }, [id]);

  if (!set) {
    return <div><Loading /></div>;
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFlashcards(shuffled);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (flashcards === originalOrder) {
      shuffleCards();
    } else {
      setFlashcards(originalOrder);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const showLastCard = currentIndex === flashcards.length;

  return (
    <div className='wrapper-pages'>
      <Nav />
      <Link to={`/set/${id}`}><BackButton></BackButton></Link>
      <h1>Flashcards
        <button 
          className={`shuffle-button ${isShuffled ? 'active' : ''}`}
          onClick={toggleShuffle}
        >
          <IoMdShuffle />
        </button>
      </h1>
      
      <div className="flashcard-container">
        <button 
          className="nav-button prev" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ←
        </button>
        {showLastCard ? (
            <LastFlashCard onReset={handleReset} />
          ) : (
          <div 
            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front">
                {flashcards[currentIndex].Term}
              </div>
              <div className="flashcard-back">
                {flashcards[currentIndex].Definition}
              </div>
            </div>
          </div>
        )}
        <button 
          className="nav-button next"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length}
        >
          →
        </button>
      </div>

      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{
            width: `${((currentIndex ) / flashcards.length) * 100}%`
          }}
        ></div>
      </div>
    </div>
  );
};

export default ViewFlashcards;