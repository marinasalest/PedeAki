import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [codigo, setCodigo] = useState('');
  const [tipoCodigo, setTipoCodigo] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post('/login', { email, password });
      login(response.data.token, response.data.user);
      setSuccess('Login realizado com sucesso!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setError('Erro no login: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSolicitarCodigo = async () => {
    if (!email) {
      setError('Digite o email primeiro');
      return;
    }
    setError(null);
    try {
      await api.post('/auth/solicitar-codigo', { email, tipo: tipoCodigo });
      setSuccess(`Código enviado por ${tipoCodigo}! Verifique sua caixa de entrada.`);
      setMostrarCodigo(true);
    } catch (err: any) {
      setError('Erro ao solicitar código: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLoginCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post('/auth/login-com-codigo', { email, codigo });
      login(response.data.token, response.data.user);
      setSuccess('Login realizado com sucesso!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setError('Erro no login: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSocialLogin = (provider: 'facebook' | 'google') => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  return (
    <div className="login-page">
      <div className="card">
        <h2>🔐 Login</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Login com Email e Senha */}
        <div className="login-section">
          <h3>Login com Email e Senha</h3>
          <form onSubmit={handleLoginEmail}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Senha:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Entrar
            </button>
          </form>
        </div>

        <div className="divider">OU</div>

        {/* Login com Código */}
        <div className="login-section">
          <h3>Login com Código de 6 Dígitos</h3>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo de Envio:</label>
            <select
              value={tipoCodigo}
              onChange={(e) => setTipoCodigo(e.target.value as 'email' | 'sms' | 'whatsapp')}
            >
              <option value="email">📧 Email</option>
              <option value="sms">📱 SMS</option>
              <option value="whatsapp">💬 WhatsApp</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSolicitarCodigo}
            style={{ marginBottom: '15px' }}
          >
            Solicitar Código
          </button>

          {mostrarCodigo && (
            <form onSubmit={handleLoginCodigo}>
              <div className="form-group">
                <label>Código de 6 dígitos:</label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  maxLength={6}
                  placeholder="000000"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Entrar com Código
              </button>
            </form>
          )}
        </div>

        <div className="divider">OU</div>

        {/* Login Social */}
        <div className="login-section">
          <h3>Login com Redes Sociais</h3>
          <button
            className="btn btn-primary"
            onClick={() => handleSocialLogin('facebook')}
            style={{ width: '100%', marginBottom: '10px', backgroundColor: '#1877F2' }}
          >
            🔵 Entrar com Facebook
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleSocialLogin('google')}
            style={{ width: '100%', backgroundColor: '#DB4437' }}
          >
            🔴 Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;












