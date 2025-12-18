import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PedidosPage.css';

interface Pedido {
  id: string;
  data_pedido: string;
  total: number;
  status: string;
  restaurantes: {
    name: string;
  };
}

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadPedidos();
    }
  }, [isAuthenticated]);

  const loadPedidos = async () => {
    // Como não temos endpoint de listar pedidos do usuário, vamos simular
    // Na prática, você precisaria criar esse endpoint no backend
    setLoading(true);
    // Aqui você faria: const response = await api.get('/pedidos');
    // setPedidos(response.data.pedidos || []);
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="card">
        <p>Você precisa estar logado para ver seus pedidos.</p>
      </div>
    );
  }

  return (
    <div className="pedidos-page">
      <h2>📦 Meus Pedidos</h2>
      <div className="card">
        {loading ? (
          <p>Carregando...</p>
        ) : pedidos.length === 0 ? (
          <p>Nenhum pedido encontrado</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Restaurante</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</td>
                  <td>{pedido.restaurantes?.name}</td>
                  <td>R$ {pedido.total.toFixed(2)}</td>
                  <td>{pedido.status}</td>
                  <td>
                    <Link
                      to={`/pedidos/${pedido.id}/nota-fiscal`}
                      className="btn btn-primary"
                    >
                      Ver NF
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PedidosPage;












