import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ProdutosPage.css';

interface Produto {
  id: string;
  name_produto: string;
  preco: number;
  descricao: string;
  imagem: string;
  categorias: {
    name: string;
  };
  restaurantes: {
    name: string;
  };
}

const ProdutosPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroRestaurante, setFiltroRestaurante] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    loadProdutos();
    loadRestaurantes();
    loadCategorias();
  }, []);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      let url = '/allProdutos';
      
      if (filtroCategoria) {
        url = `/produtos/categoria/${filtroCategoria}`;
      } else if (filtroRestaurante) {
        url = `/produtos/restaurante/${filtroRestaurante}`;
      }

      const response = await api.get(url);
      setProdutos(response.data.produtos || []);
    } catch (err: any) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurantes = async () => {
    try {
      const response = await api.get('/allRestaurantes');
      setRestaurantes(response.data.restaurantes || []);
    } catch (err) {
      console.error('Erro ao carregar restaurantes:', err);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await api.get('/allCategorias');
      setCategorias(response.data.categorias || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  useEffect(() => {
    loadProdutos();
  }, [filtroRestaurante, filtroCategoria]);

  return (
    <div className="produtos-page">
      <h2>🍔 Produtos</h2>

      <div className="card">
        <h3>Filtros</h3>
        <div className="filtros-row">
          <div className="form-group">
            <label>Restaurante:</label>
            <select
              value={filtroRestaurante}
              onChange={(e) => {
                setFiltroRestaurante(e.target.value);
                setFiltroCategoria('');
              }}
            >
              <option value="">Todos</option>
              {restaurantes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Categoria:</label>
            <select
              value={filtroCategoria}
              onChange={(e) => {
                setFiltroCategoria(e.target.value);
                setFiltroRestaurante('');
              }}
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Produtos ({produtos.length})</h3>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="produtos-grid">
            {produtos.map((prod) => (
              <div key={prod.id} className="produto-card">
                {prod.imagem && (
                  <img
                    src={`http://localhost:3000${prod.imagem}`}
                    alt={prod.name_produto}
                    className="produto-imagem"
                  />
                )}
                <h4>{prod.name_produto}</h4>
                <p className="categoria">{prod.categorias?.name}</p>
                <p className="restaurante">{prod.restaurantes?.name}</p>
                <p className="preco">R$ {prod.preco?.toFixed(2)}</p>
                {prod.descricao && <p className="descricao">{prod.descricao}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdutosPage;












