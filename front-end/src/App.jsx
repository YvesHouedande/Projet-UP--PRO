import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginForm from './components/authentication/LoginForm';

function App() { 
  return (
    <Routes>
            <Route
        path='/login'
        element={<LoginForm/>}
      ></Route>
      <Route
        path='/'
        element={<Home/>}
      >
      </Route>
            <Route
        path='/profile'
        element={<Profile/>}
      >
      </Route>
    </Routes>
    // <Home></Home>
  );
}


export default App;
