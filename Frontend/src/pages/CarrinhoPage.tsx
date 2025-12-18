import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CarrinhoPage.css';

interface ItemCarrinho {
  id: string;
  produto: {
    id: string;
    name_produto: string;
    preco: number;
  };
  quantidade: number;
  subtotal: number;
}

interface Endereco {
  id: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

const CarrinhoPage: React.FC = () => {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState('padrao');
  const [formaPagamento, setFormaPagamento] = useState('credito');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadCarrinho();
      loadEnderecos();
    }
  }, [isAuthenticated]);

  const loadCarrinho = async () => {
    try {
      const response = await api.get('/carrinho');
      setCarrinho(response.data.itens || []);
    } catch (err: any) {
      console.error('Erro ao carregar carrinho:', err);
    }
  };

  const loadEnderecos = async () => {
    try {
      const response = await api.get('/allEnderecos');
      setEnderecos(response.data.enderecos || []);
      if (response.data.enderecos?.length > 0) {
        setEnderecoSelecionado(response.data.enderecos[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar endereços:', err);
    }
  };

  const atualizarQuantidade = async (itemId: string, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    try {
      await api.put(`/carrinho/item/${itemId}`, { quantidade: novaQuantidade });
      loadCarrinho();
    } catch (err: any) {
      setError('Erro ao atualizar quantidade: ' + (err.response?.data?.error || err.message));
    }
  };

  const removerItem = async (itemId: string) => {
    try {
      await api.delete(`/carrinho/item/${itemId}`);
      loadCarrinho();
    } catch (err: any) {
      setError('Erro ao remover item: ' + (err.response?.data?.error || err.message));
    }
  };

  const calcularTotal = () => {
    const subtotal = carrinho.reduce((sum, item) => sum + item.subtotal, 0);
    const taxaEntrega = tipoEntrega === 'retirada' ? 0 : 5.0; // Taxa fixa de exemplo
    return {
      subtotal,
      taxaEntrega,
      total: subtotal + taxaEntrega,
    };
  };

  const finalizarPedido = async () => {
    if (!enderecoSelecionado) {
      setError('Selecione um endereço de entrega');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const itens = carrinho.map((item) => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
      }));

      const response = await api.post('/pedidos', {
        restauranteId: carrinho[0]?.produto?.id || '', // Simplificado
        enderecoId: enderecoSelecionado,
        itens,
        tipoEntrega,
        formaPagamento,
        observacoes,
      });

      const pedidoId = response.data.pedido.id;
      
      // Processar pagamento
      await api.post('/pagamento', {
        pedidoId,
        formaPagamento,
        dadosPagamento: {
          numeroCartao: '1234567890123456',
          nomeTitular: 'Teste',
          validadeCartao: '12/25',
          cvv: '123',
        },
      });

      alert('Pedido realizado com sucesso!');
      navigate(`/pedidos/${pedidoId}/nota-fiscal`);
    } catch (err: any) {
      setError('Erro ao finalizar pedido: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="card">
        <p>Você precisa estar logado para ver o carrinho.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Fazer Login
        </button>
      </div>
    );
  }

  const totais = calcularTotal();

  return (
    <div className="carrinho-page">
      <h2>🛒 Carrinho de Compras</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="carrinho-content">
        <div className="card">
          <h3>Itens do Carrinho</h3>
          {carrinho.length === 0 ? (
            <p>Carrinho vazio</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map((item) => (
                  <tr key={item.id}>
                    <td>{item.produto.name_produto}</td>
                    <td>
                      <button
                        onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                        className="btn"
                      >
                        -
                      </button>
                      <span style={{ margin: '0 10px' }}>{item.quantidade}</span>
                      <button
                        onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                        className="btn"
                      >
                        +
                      </button>
                    </td>
                    <td>R$ {item.produto.preco.toFixed(2)}</td>
                    <td>R$ {item.subtotal.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => removerItem(item.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {carrinho.length > 0 && (
          <div className="card">
            <h3>Finalizar Pedido</h3>
            <div className="form-group">
              <label>Endereço de Entrega:</label>
              <select
                value={enderecoSelecionado}
                onChange={(e) => setEnderecoSelecionado(e.target.value)}
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
            <div className="form-group">
              <label>Tipo de Entrega:</label>
              <select
                value={tipoEntrega}
                onChange={(e) => setTipoEntrega(e.target.value)}
              >
                <option value="padrao">Entrega Padrão</option>
                <option value="prioritaria">Entrega Prioritária</option>
                <option value="retirada">Retirada no Local</option>
              </select>
            </div>
            <div className="form-group">
              <label>Forma de Pagamento:</label>
              <select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
              >
                <option value="credito">Cartão de Crédito</option>
                <option value="debito">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="carteira">Carteira Digital</option>
              </select>
            </div>
            <div className="form-group">
              <label>Observações:</label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="resumo-pedido">
              <p><strong>Subtotal:</strong> R$ {totais.subtotal.toFixed(2)}</p>
              <p><strong>Taxa de Entrega:</strong> R$ {totais.taxaEntrega.toFixed(2)}</p>
              <p className="total"><strong>Total:</strong> R$ {totais.total.toFixed(2)}</p>
            </div>
            <button
              className="btn btn-success"
              onClick={finalizarPedido}
              disabled={loading}
              style={{ width: '100%', marginTop: '20px' }}
            >
              {loading ? 'Processando...' : 'Finalizar Pedido'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrinhoPage;












