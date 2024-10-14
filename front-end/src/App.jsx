import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginForm from './components/authentication/LoginForm';
import RegisterForm from './components/authentication/RegisterForm';
import TimeLinePage from './pages/TimeLinePage';

function App() { 
  return (
    <Routes>
      <Route
        path='/login'
        element={<LoginForm/>}
      ></Route>
      <Route
        path='/timeline'
        element={<TimeLinePage/>}
      ></Route>
      <Route
        path='/register'
        element={<RegisterForm/>}
      ></Route>
      <Route
        path='/'
        element={<Home/>}
      >
      </Route>
      <Route
        path="/profile/:profileId/"
        element={<Profile/>}
      >
      </Route>
    </Routes>
    // <Home></Home>
  );
}


export default App;
