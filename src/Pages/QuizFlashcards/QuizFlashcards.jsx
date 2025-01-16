import { React} from 'react';
import Nav from '../../Components/Navigation/Nav';
import '../Pages.css';
import { Link, useParams} from 'react-router-dom';
import BackButton from '../../Components/BackButton/BackButton';

const QuizFlashcards = () => {

    const { id } = useParams(); // Get the set ID from the URL
  return (
    <div div className='wrapper-pages'>
      <Nav/>
        <Link to={`/set/${id}`}><BackButton></BackButton></Link>
    </div>
  )
}

export default QuizFlashcards