import { React, useState, useEffect} from 'react';
import Nav from '../../Components/Navigation/Nav';
import '../Pages.css';
import { Link, useParams} from 'react-router-dom';
import './LearnFlashcards.css';
import { getDoc, doc} from 'firebase/firestore';
import { db } from '../../config/firebase';
import BackButton from '../../Components/BackButton/BackButton';
import Loading from '../../Components/Loading/Loading';
const LearnFlashcards = () => {
    const { id } = useParams();
    const [set, setSet] = useState(null);
    const [currentCard, setCurrentCard] = useState(null);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const getSet = async () => {
    try {
      const setDoc = doc(db, "Sets", id);
      const setSnap = await getDoc(setDoc);
      if (setSnap.exists()) {
        setSet({ id: setSnap.id, ...setSnap.data() });
        //generateQuestion(setSnap.data().Flashcards);
      }
    } catch (err) {
      console.error(err);
    }
  };
   // Function to generate a new question from the flashcards
   const generateQuestion = (flashcards) => {
        // Check if flashcards are available and there are at least 4 cards
        if (!flashcards || flashcards.length < 4) return;

        // Select a random index for the current question card
        const randomIndex = Math.floor(Math.random() * flashcards.length);
        // Get the card at the random index
        const selectedCard = flashcards[randomIndex];

        // Filter out the selected card to avoid duplicates, shuffle, and pick 3 wrong options
        let wrongOptions = flashcards
            .filter(card => card.Term !== selectedCard.Term) // Exclude the correct term
            .sort(() => 0.5 - Math.random()) // Shuffle the remaining cards
            .slice(0, 3) // Select the first 3 as wrong options
            .map(card => card.Term); // Extract the term from each card

        // Combine the correct term with wrong options and shuffle them
        const allOptions = [...wrongOptions, selectedCard.Term]
            .sort(() => 0.5 - Math.random()); // Shuffle all options

        // Update the state with the selected card and options
        setCurrentCard(selectedCard);
        setOptions(allOptions);
        setSelectedOption(null); // Reset the selected option
        setIsAnswered(false); // Reset the answered state
    };

    // Function to handle the user's answer selection
    const handleAnswer = (selectedTerm) => {
        // If the question has already been answered, do nothing
        if (isAnswered) return;

        // Update the state with the selected option
        setSelectedOption(selectedTerm);
        // Mark the question as answered
        setIsAnswered(true);

        // Check if the selected term is correct and update the score
        if (selectedTerm === currentCard.Term) {
            // Increment the correct score
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            // Increment the incorrect score
            setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }

        // Wait 1 second before generating the next question
        setTimeout(() => {
            generateQuestion(set.Flashcards); // Generate a new question
        }, 1000);
    };

    useEffect(() => {
        const initializeSet = async () => {
            await getSet();
            const setDoc = await getDoc(doc(db, "Sets", id));
            if (setDoc.exists()) {
                const setData = { id: setDoc.id, ...setDoc.data() };
                setSet(setData);
                generateQuestion(setData.Flashcards);
            }
        };
        
        initializeSet();
    }, [id]);

    if (!set || !currentCard) return <div><Loading /></div>;

    return (
        <div className='wrapper-pages'>
            <Nav/>
            <Link to={`/set/${id}`}><BackButton></BackButton></Link>
            
            <div className='learn-flashcard-container'>
                <div><h1>Learn</h1></div>
                <div className='score'>
                    Correct: {score.correct} | Incorrect: {score.incorrect}
                </div>
                <div className='flashcard-term'>{currentCard.Definition}</div>
                <div className='options-container'>
                    {options.map((option, index) => (
                        <button
                            key={index} // Unique key for each button
                            className={`option-button ${
                                isAnswered
                                    ? option === currentCard.Term
                                        ? 'correct' // Apply 'correct' class if the option is correct
                                        : option === selectedOption
                                            ? 'incorrect' // Apply 'incorrect' class if the option is incorrect
                                            : ''
                                    : ''
                            }`}
                            onClick={() => handleAnswer(option)} // Handle button click
                            disabled={isAnswered} // Disable button if answered
                        >
                            {option} {/* Display the option text*/}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LearnFlashcards;