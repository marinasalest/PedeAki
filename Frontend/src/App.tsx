import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import UsuariosPage from './pages/UsuariosPage';
import LoginPage from './pages/LoginPage';
import RestaurantesPage from './pages/RestaurantesPage';
import ProdutosPage from './pages/ProdutosPage';
import CarrinhoPage from './pages/CarrinhoPage';
import PedidosPage from './pages/PedidosPage';
import NotaFiscalPage from './pages/NotaFiscalPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function Navbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <img 
          src="/images/logo.png" 
          alt="Pede Aki" 
          className="logo"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            if (!e.currentTarget.nextSibling) {
              const fallback = document.createElement('h1');
              fallback.textContent = 'PedeAki';
              fallback.style.color = 'white';
              fallback.style.margin = '0';
              e.currentTarget.parentElement?.appendChild(fallback);
            }
          }}
        />
      </Link>
      <div className="navbar-login">
        {isAuthenticated && user ? (
          <span className="navbar-login-btn">Oi, {user.name}!</span>
        ) : (
          <Link to="/login" className="navbar-login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/restaurantes" element={<RestaurantesPage />} />
            <Route path="/produtos" element={<ProdutosPage />} />
            <Route path="/carrinho" element={<CarrinhoPage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
            <Route path="/pedidos/:pedidoId/nota-fiscal" element={<NotaFiscalPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

