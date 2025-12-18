import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './RestaurantesPage.css';

interface Restaurante {
  id: string;
  name: string;
  nome_fantasia: string;
  avaliacao: number;
  taxa_entrega: number;
  tempo_medio_entrega: number;
  enderecos: {
    cidade: string;
    bairro: string;
  };
}

const RestaurantesPage: React.FC = () => {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    categoria: '',
    avaliacaoMinima: '',
    precoMaximo: '',
    tempoMaximo: '',
  });

  useEffect(() => {
    loadRestaurantes();
  }, []);

  const loadRestaurantes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      if (filtros.avaliacaoMinima) params.append('avaliacaoMinima', filtros.avaliacaoMinima);
      if (filtros.precoMaximo) params.append('precoMaximo', filtros.precoMaximo);
      if (filtros.tempoMaximo) params.append('tempoMaximo', filtros.tempoMaximo);

      const url = params.toString()
        ? `/restaurantes?${params.toString()}`
        : '/allRestaurantes';
      
      const response = await api.get(url);
      setRestaurantes(response.data.restaurantes || []);
    } catch (err: any) {
      console.error('Erro ao carregar restaurantes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (field: string, value: string) => {
    setFiltros({ ...filtros, [field]: value });
  };

  const aplicarFiltros = () => {
    loadRestaurantes();
  };

  return (
    <div className="restaurantes-page">
      <h2>🍽️ Restaurantes</h2>

      <div className="card">
        <h3>Filtros</h3>
        <div className="filtros-grid">
          <div className="form-group">
            <label>Categoria:</label>
            <select
              value={filtros.categoria}
              onChange={(e) => handleFiltroChange('categoria', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="LANCHES">Lanches</option>
              <option value="PIZZA">Pizza</option>
              <option value="JAPONESA">Japonesa</option>
              <option value="BRASILEIRA">Brasileira</option>
            </select>
          </div>
          <div className="form-group">
            <label>Avaliação Mínima:</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={filtros.avaliacaoMinima}
              onChange={(e) => handleFiltroChange('avaliacaoMinima', e.target.value)}
              placeholder="Ex: 4.0"
            />
          </div>
          <div className="form-group">
            <label>Preço Máximo:</label>
            <input
              type="number"
              value={filtros.precoMaximo}
              onChange={(e) => handleFiltroChange('precoMaximo', e.target.value)}
              placeholder="Ex: 50"
            />
          </div>
          <div className="form-group">
            <label>Tempo Máximo (min):</label>
            <input
              type="number"
              value={filtros.tempoMaximo}
              onChange={(e) => handleFiltroChange('tempoMaximo', e.target.value)}
              placeholder="Ex: 30"
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={aplicarFiltros}>
          Aplicar Filtros
        </button>
      </div>

      <div className="card">
        <h3>Resultados ({restaurantes.length})</h3>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="restaurantes-grid">
            {restaurantes.map((rest) => (
              <div key={rest.id} className="restaurante-card">
                <h4>{rest.name}</h4>
                <p className="nome-fantasia">{rest.nome_fantasia}</p>
                <p>⭐ {rest.avaliacao?.toFixed(1) || 'N/A'}</p>
                <p>🚚 Taxa: R$ {rest.taxa_entrega?.toFixed(2) || '0.00'}</p>
                <p>⏱️ {rest.tempo_medio_entrega || 0} min</p>
                <p>📍 {rest.enderecos?.bairro}, {rest.enderecos?.cidade}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantesPage;












