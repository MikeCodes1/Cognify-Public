import { React, useEffect, useState } from 'react';
import Nav from '../../Components/Navigation/Nav';
import '../Pages.css';
import './Sets.css';
import { db, auth } from '../../config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Sets = () => {
  const [sets, setSets] = useState([]);
  const [newSetName, setNewSetName] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const setsCollectionRef = collection(db, "Sets");

  const navigate = useNavigate();
  // Fetch Sets (only the ones belonging to the current user)
  const getSets = async () => {
    try {
      const setsQuery = query(
        setsCollectionRef,
        where("userId", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
  
      const data = await getDocs(setsQuery);
      const filteredData = data.docs.map((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate
          ? data.timestamp.toDate().toLocaleString()
          : "No date";
        return {
          ...data,
          id: doc.id,
          Flashcards: data.Flashcards || [],
          formattedDate: timestamp,
        };
      });
  
      console.log("Filtered Data:", filteredData); // Debug log
      setSets(filteredData);
    } catch (err) {
      console.error("Error fetching sets:", err);
    }
  };

  useEffect(() => {
    getSets();
  }, []);

  // Add Flashcard to current list (before submitting the entire set)
  const addFlashcardToList = () => {
    setFlashcards([...flashcards, { Term: newTerm, Definition: newDefinition, Correct: 0, Incorrect: 0 }]);
    setNewTerm("");
    setNewDefinition("");
  };

  // Submit New Set with all Flashcards
  const onSubmitSet = async () => {
    try {
      await addDoc(setsCollectionRef, {
        SetName: newSetName,
        userId: auth?.currentUser?.uid,
        Flashcards: flashcards,
        timestamp: serverTimestamp() // Add this line
      });
      setFlashcards([]);
      setNewSetName("");
      getSets();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Entire Set
  const deleteSet = async (id) => {
    const setDoc = doc(db, "Sets", id);
    await deleteDoc(setDoc);
    getSets();
  };
const handleViewSet = async (id) => {
  try {
    const setDocRef = doc(db, "Sets", id);
    await updateDoc(setDocRef, {
      timestamp: serverTimestamp()
    });
    navigate(`/set/${id}`);
  } catch (err) {
    console.error("Error updating timestamp:", err);
  }
};
  return (
    <div className='wrapper-pages'>
      <Nav />
      <div className="CreateSets">
        <input placeholder="Set Name" value={newSetName} onChange={(e) => setNewSetName(e.target.value)} />
        {/* <input placeholder="Term" value={newTerm} onChange={(e) => setNewTerm(e.target.value)} />
        <input placeholder="Definition" value={newDefinition} onChange={(e) => setNewDefinition(e.target.value)} />
        <button onClick={addFlashcardToList}>Add Flashcard</button> */}
        <button onClick={onSubmitSet}>Submit Set</button>
      </div>

      <div className='Sets-List'>
        {sets.map((set) => (
          <div key={set.id}>
            <h3>{set.SetName}</h3>
            <p>Date Last Modified: {set.formattedDate}</p>
            <div onClick={() => handleViewSet(set.id)}> 
              <Link to={`/set/${set.id}`}><h3 className='SetTitle'></h3></Link>
            </div>
            <button onClick={() => deleteSet(set.id)} class="delete-button">
              <svg viewBox="0 0 448 512" class="svgIcon">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 
                296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
            </button>
              
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sets;
