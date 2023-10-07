import { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SignedInContext, SignedInProvider } from './hooks/Context';
import Navbar from './components/Navbar';
import Trip from './pages/Trip';
import Login from './Login';
import Home from './pages/Home';
import Configuration from './pages/Configurations';
import './css/style.css'
import 'leaflet/dist/leaflet.css';


const Private = ({ Item }) => {
  const signed = useContext(SignedInContext);
  return signed.signedIn ? <Item /> : <Login />;
}

function App() {

  return (
    <>
      <BrowserRouter>
        <SignedInProvider>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path='/principal' element={<Private Item={Home} />} />
              <Route path='/trip/:id' element={<Private Item={Trip} />} />
              <Route path='/config' element={<Private Item={Configuration} />} />
              <Route exact path='/*' element={<Login />} />
            </Routes>
          </div>
        </SignedInProvider>
      </BrowserRouter>
    </>
  )
}

export default App
