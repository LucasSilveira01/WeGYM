import { useContext, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SignedInContext, SignedInProvider } from './hooks/Context';
import Navbar from './components/Navbar';
import Login from './Login';
import Home from './pages/Home';
import Metrics from './pages/Metrics'
import Treinos from './pages/Treinos'
import './css/style.css'
import 'leaflet/dist/leaflet.css';
import Register from './components/Register'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import WorkoutPage from './components/Workout';

const Private = ({ Item }) => {
  const signed = useContext(SignedInContext);
  return signed.signedIn ? <Item /> : <Login />;
}

function App() {
  const { theme } = useTheme(); // Obtém o tema do contexto

  return (
    <>
      <BrowserRouter>
        <SignedInProvider>
          <Navbar className={`${theme}`} />
          <div className={`container ${theme}`}>
            <Routes>
              <Route path='/principal' element={<Private Item={Home} />} />
              <Route path='/metrics' element={<Private Item={Metrics} />} />
              <Route path='/treinos' element={<Private Item={Treinos} />} />
              <Route path='/workout' element={<Private Item={WorkoutPage} />} />
              <Route exact path='/*' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </Routes>
          </div>
        </SignedInProvider>
      </BrowserRouter>
    </>
  )
}

export default App
