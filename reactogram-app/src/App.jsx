import './App.css';
import Login from './pages/login';
import Signup from './pages/singup';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import PostOverview from './pages/PostOverview';
import Profile from './pages/Profile';


// Wrapper component so we can use useLocation
function AppWrapper() {
  const location = useLocation();
  const hideNavPaths = ['/login', '/signup'];

  return (
    <div>
      {/* NavBar show only if current path is not login or signup */}
      {!hideNavPaths.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/posts" element={<PostOverview />} />
        <Route exact path="/myprofile" element={<Profile />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
