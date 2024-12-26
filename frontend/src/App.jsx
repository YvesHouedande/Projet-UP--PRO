import './App.css';
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './components/routing/ProtectedRoute';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginForm from './components/authentication/LoginForm';
import RegisterForm from './components/authentication/RegisterForm';
import TimeLinePage from './pages/TimeLinePage';
import PeerPage from './pages/PeerPage';
import Community from './pages/Community';
import ServicePage from './pages/ServicePage';
import ScrollToTop from './components/ScrollToTop';

function App() { 
  return (
    <Routes>
      <Route
        path='/login'
        element={<LoginForm/>}
      />

      <Route
        path='/timeline'
        element={
          <ProtectedRoute>
            <TimeLinePage/>
          </ProtectedRoute>
        }
      />

      <Route
        path='/register'
        element={<RegisterForm/>}
      />

      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile/:profileId/"
        element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/peer/:peerId"
        element={
          <ProtectedRoute>
            <PeerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/service/:serviceId" 
        element={
          <ProtectedRoute>
            <ServicePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
    // <Home></Home>
  );
}


export default App;
