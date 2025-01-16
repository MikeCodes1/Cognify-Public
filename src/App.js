import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/Register';
import Home from './Pages/Home/HomePage';
import Sets from './Pages/Sets/Sets';
import Explore from './Pages/Explore/Explore';
import Account from './Pages/Account/Account';
import SetPage from './Pages/SetPage/SetPage';
import ProtectedRoute from './ProtectedRoute';
import ViewFlashcards from './Pages/ViewFlashcards/ViewFlashcards';
import QuizFlashcards from './Pages/QuizFlashcards/QuizFlashcards';
import LearnFlashcards from './Pages/LearnFlashcards/LearnFlashcards';
import LandingPage from './Pages/LandingPage/LandingPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route index element={<LandingPage />} />
          <Route path ="/LandingPage" element={<LandingPage />} />
          <Route path="/LoginForm" element={<LoginForm />} />
          <Route path="/RegisterForm" element={<RegisterForm />} />
          
      
          {/* Protected Routes */}
          <Route
            path="/HomePage"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Sets"
            element={
              <ProtectedRoute>
                <Sets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Explore"
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          {/* Dynamic route for each set */}
          <Route 
          path="/set/:id" 
          element={
            <ProtectedRoute>
              <SetPage />
            </ProtectedRoute>
          }
            
          />
          <Route 
          path="/flashcards/:id" 
          element={
            <ProtectedRoute>
              <ViewFlashcards />
            </ProtectedRoute>
          }
            
          />
          <Route 
          path="/quiz/:id" 
          element={
            <ProtectedRoute>
              <QuizFlashcards />
            </ProtectedRoute>
          }
            
          />
          <Route 
          path="/learn/:id" 
          element={
            <ProtectedRoute>
              <LearnFlashcards />
            </ProtectedRoute>
          }
            
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
