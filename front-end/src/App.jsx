import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginForm from './components/authentication/LoginForm';
import RegisterForm from './components/authentication/RegisterForm';
import TimeLinePage from './pages/TimeLinePage';
import PeerPage from './pages/PeerPage';
import Community from './pages/Community';

function App() { 
  return (
    <Routes>
      <Route
        path='/login'
        element={<LoginForm/>}
      />

      <Route
        path='/timeline'
        element={<TimeLinePage/>}
      />

      <Route
        path='/register'
        element={<RegisterForm/>}
      />

      <Route
        path='/'
        element={<Home/>}
      />
      
      <Route
        path="/profile/:profileId/"
        element={<Profile/>}
      />
      
      <Route
        path="/peer/:peerId"
        element={<PeerPage />}
      />
      <Route
        path="/community"
        element={<Community />} />
    </Routes>
    // <Home></Home>
  );
}


export default App;
