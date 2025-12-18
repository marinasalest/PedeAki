import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './UsuariosPage.css';

interface Usuario {
  id: string;
  name: string;
  email: string;
  cpf: string;
  data_nascimento: string;
}

interface Endereco {
  id: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
}

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    data_nascimento: '',
    password: '',
    enderecoId: '',
  });

  useEffect(() => {
    loadUsuarios();
    loadEnderecos();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data.usuarios || []);
    } catch (err: any) {
      setError('Erro ao carregar usuários: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const loadEnderecos = async () => {
    try {
      const response = await api.get('/allEnderecos');
      setEnderecos(response.data.enderecos || []);
    } catch (err) {
      console.error('Erro ao carregar endereços:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        // UPDATE
        await api.put(`/usuario/${editingId}`, {
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          data_nascimento: formData.data_nascimento,
          password: formData.password || undefined,
        });
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        // CREATE
        await api.post('/users', formData);
        setSuccess('Usuário criado com sucesso!');
      }
      
      resetForm();
      loadUsuarios();
    } catch (err: any) {
      setError('Erro: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const response = await api.get(`/usuario/${id}`);
      const usuario = response.data.usuario;
      setFormData({
        name: usuario.name || '',
        email: usuario.email || '',
        cpf: usuario.cpf || '',
        data_nascimento: usuario.data_nascimento ? usuario.data_nascimento.split('T')[0] : '',
        password: '',
        enderecoId: usuario.id_endereco || '',
      });
      setEditingId(id);
      setShowForm(true);
    } catch (err: any) {
      setError('Erro ao carregar usuário: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      await api.delete(`/usuario/${id}`);
      setSuccess('Usuário deletado com sucesso!');
      loadUsuarios();
    } catch (err: any) {
      setError('Erro ao deletar: ' + (err.response?.data?.error || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      cpf: '',
      data_nascimento: '',
      password: '',
      enderecoId: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="usuarios-page">
      <div className="page-header">
        <h2>📋 CRUD de Usuários</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card">
          <h3>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>CPF:</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="form-group">
              <label>Data de Nascimento:</label>
              <input
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
              />
            </div>
            {!editingId && (
              <div className="form-group">
                <label>Senha:</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            )}
            {editingId && (
              <div className="form-group">
                <label>Nova Senha (opcional):</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}
            {!editingId && (
              <div className="form-group">
                <label>Endereço:</label>
                <select
                  value={formData.enderecoId}
                  onChange={(e) => setFormData({ ...formData, enderecoId: e.target.value })}
                  required
                >
                  <option value="">Selecione um endereço</option>
                  {enderecos.map((end) => (
                    <option key={end.id} value={end.id}>
                      {end.rua}, {end.numero} - {end.bairro}, {end.cidade}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Atualizar' : 'Criar'}
              </button>
              <button type="button" className="btn" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Lista de Usuários</h3>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Data Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    Nenhum usuário cadastrado
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.name}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.cpf || '-'}</td>
                    <td>
                      {usuario.data_nascimento
                        ? new Date(usuario.data_nascimento).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(usuario.id)}
                        style={{ marginRight: '10px' }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(usuario.id)}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;












