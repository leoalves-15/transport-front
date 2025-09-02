import Home from './screens/Home';
import './App.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {/* <Link to="/sobre">Sobre</Link> */}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/sobre" element={<Sobre />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
