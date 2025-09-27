import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'; // Import LoginPage
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* Add new route for ProfilePage */}
      </Routes>
    </Router>
  );
}

export default App;
