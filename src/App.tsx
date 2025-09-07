import Home from './screens/Home';
import Login from './screens/Login';
import SolicitationDetails from './screens/Solicitacao';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/solicitacao/:id" element={<SolicitationDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
