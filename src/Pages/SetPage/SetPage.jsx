import { React, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from '../../Components/Navigation/Nav';
import '../Pages.css';
import { db, auth } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './SetPage.css';
import BackButton from '../../Components/BackButton/BackButton';
import Loading from '../../Components/Loading/Loading';
const SetPage = () => {
  const { id } = useParams(); // Get the set ID from the URL
  const [set, setSet] = useState(null);
  const [newTerm, setNewTerm] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [updatedTerms, setUpdatedTerms] = useState({});
  const [updatedDefinitions, setUpdatedDefinitions] = useState({});
  // Fetch the specific set based on the set ID
  const getSet = async () => {
    try {
      const setDoc = doc(db, "Sets", id);
      const setSnap = await getDoc(setDoc);
      if (setSnap.exists()) {
        setSet({ id: setSnap.id, ...setSnap.data() });
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

  // Update Flashcard in the Set
  const updateFlashcardDef = async (flashcardIndex, newDefinition) => {
    const setDocRef = doc(db, "Sets", id);
    const updatedFlashcards = [...set.Flashcards];
    updatedFlashcards[flashcardIndex].Definition = newDefinition;
    await updateDoc(setDocRef, { Flashcards: updatedFlashcards });
    setSet({ ...set, Flashcards: updatedFlashcards });
  };

  const updateFlashcardTerm = async (flashcardIndex, newUpdatedTerm) => {
    const setDocRef = doc(db, "Sets", id);
    const updatedFlashcards = [...set.Flashcards];
    updatedFlashcards[flashcardIndex].Term = newUpdatedTerm;
    await updateDoc(setDocRef, { Flashcards: updatedFlashcards });
    setSet({ ...set, Flashcards: updatedFlashcards });
  };

  const deleteFlashCard = async (flashcardIndex) => {
    try {
      const setDocRef = doc(db, "Sets", id);
      const updatedFlashcards = set.Flashcards.filter((_, index) => index !== flashcardIndex);
      await updateDoc(setDocRef, { Flashcards: updatedFlashcards });
      setSet({ ...set, Flashcards: updatedFlashcards });
    } catch (err) {
      console.error(err);
    }
  };

  // Add new flashcard to the set and update the database
  const addFlashcard = async () => {
    const setDocRef = doc(db, "Sets", id);
    const updatedFlashcards = [...set.Flashcards, { Term: newTerm, Definition: newDefinition, Correct: 0, Incorrect: 0 }];
    await updateDoc(setDocRef, { Flashcards: updatedFlashcards });
    setSet({ ...set, Flashcards: updatedFlashcards });
    setNewTerm("");
    setNewDefinition("");
  };

  if (!set) {
    return <Loading />;
  }

  return (
    <div className='wrapper-pages'>
      <Nav/>
      <div>
        <Link to="/Sets"><BackButton></BackButton></Link>
      </div>
      <div className='Sets-Flashcards'>
        <h3 className='Set-Title2'>{set.SetName}</h3>
        <div className='Nav-Button2'>
          <Link to={`/flashcards/${id}`}><button disabled={!set.Flashcards || set.Flashcards.length === 0}>
          View Flashcards</button></Link>
          <Link to={`/learn/${id}`}><button disabled={!set.Flashcards || set.Flashcards.length === 0}>
          Learn</button></Link>
          <Link to={`/quiz/${id}`}><button disabled={!set.Flashcards || set.Flashcards.length === 0}>
          Start Quiz</button></Link>
        </div>

  {set.Flashcards && set.Flashcards.map((flashcard, index) => (
    <div className = 'display-flashcards' key={index}>
      <p>Term: {flashcard.Term}</p>
      <p>Definition: {flashcard.Definition}</p>
      <p>Correct: {flashcard.Correct}</p>
      <p>Incorrect: {flashcard.Incorrect}</p>
      <input 
        placeholder="New Term..." 
        value={updatedTerms[index] || ''} 
        onChange={(e) => setUpdatedTerms(prev => ({
        ...prev,
        [index]: e.target.value
        }))} 
      />
      <button onClick={() => {
        updateFlashcardTerm(index, updatedTerms[index]);
        setUpdatedTerms(prev => ({...prev, [index]: ''}));
      }}>
        Update Term
      </button>

      <input 
        placeholder="New Definition..." 
        value={updatedDefinitions[index] || ''} 
        onChange={(e) => setUpdatedDefinitions(prev => ({
          ...prev,
          [index]: e.target.value
        }))} 
      />
      <button onClick={() => {
        updateFlashcardDef(index, updatedDefinitions[index]);
        setUpdatedDefinitions(prev => ({...prev, [index]: ''}));
      }}>
      Update Definition
      </button>
      
      <button onClick={() => deleteFlashCard(index)}>Delete FlashCard</button>
    </div>
    ))}
        {/* Add new flashcard to the set */}
        <div className = 'Add-Flashcard'>
          <input placeholder="Term..." value={newTerm} onChange={(e) => setNewTerm(e.target.value)} />
          <input placeholder="Definition..." value={newDefinition} onChange={(e) => setNewDefinition(e.target.value)} />
          <button onClick={addFlashcard}>Add Flashcard</button>
        </div>
      </div>
    </div>
  );
};

export default SetPage;