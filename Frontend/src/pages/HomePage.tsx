import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './HomePage.css';

interface Categoria {
  id: string;
  name: string;
}

interface Restaurante {
  id: string;
  nome_fantasia: string;
  avaliacao?: number;
}

function HomePage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar categorias
        const categoriasResponse = await api.get('/allCategorias');
        const categoriasData = categoriasResponse.data.categorias || [];
        console.log('Categorias recebidas:', categoriasData);
        if (categoriasData.length > 0) {
          console.log('Primeira categoria:', categoriasData[0]);
          console.log('ID:', categoriasData[0].id);
          console.log('Caminho esperado:', `/images/categorias/${categoriasData[0].id.toLowerCase()}.svg`);
        }
        setCategorias(categoriasData);

        // Buscar restaurantes e pegar os 8 melhores por avaliação
        const restaurantesResponse = await api.get('/allRestaurantes');
        const todosRestaurantes = restaurantesResponse.data.restaurantes || [];
        
        // Ordenar por avaliação (maior primeiro) e pegar os 8 primeiros
        const melhoresRestaurantes = todosRestaurantes
          .filter((r: any) => r.ativo !== false)
          .sort((a: any, b: any) => {
            const avalA = parseFloat(a.avaliacao || '0');
            const avalB = parseFloat(b.avaliacao || '0');
            return avalB - avalA;
          })
          .slice(0, 8);
        
        setRestaurantes(melhoresRestaurantes);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="home-page" style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Carregando...</h2>
        <p>Aguarde enquanto carregamos as categorias e restaurantes.</p>
      </div>
    );
  }

  if (categorias.length === 0 && restaurantes.length === 0) {
    return (
      <div className="home-page" style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Erro ao carregar dados</h2>
        <p>Não foi possível conectar ao servidor.</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Verifique se o backend está rodando em http://localhost:3000
        </p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Carrossel de Categorias */}
      <div className="carrossel-section">
        <h2 className="carrossel-title">Categorias</h2>
        <div className="carrossel-container">
          <div className="carrossel">
            {categorias.map((categoria) => {
              const imagePath = `/images/categorias/${(categoria.id || '').toLowerCase()}.svg`;
              console.log('Tentando carregar imagem:', categoria.id, '->', imagePath);
              return (
                <div key={categoria.id} className="carrossel-item">
                  <Link to={`/produtos?categoria=${categoria.id}`} className="carrossel-link">
                    <img
                      src={imagePath}
                      alt={categoria.name || categoria.id}
                      className="carrossel-image"
                      onError={(e) => {
                        console.error('Erro ao carregar imagem:', categoria.id, 'Caminho:', e.currentTarget.src);
                        e.currentTarget.src = '/images/categorias/default.svg';
                      }}
                      onLoad={() => {
                        console.log('Imagem carregada:', categoria.id);
                      }}
                    />
                    <div className="carrossel-legenda">{categoria.name || categoria.id}</div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Carrossel de Melhores Restaurantes */}
      <div className="carrossel-section">
        <h2 className="carrossel-title">Melhores Restaurantes</h2>
        <div className="carrossel-container">
          <div className="carrossel">
            {restaurantes.map((restaurante) => (
              <div key={restaurante.id} className="carrossel-item">
                <Link to={`/restaurantes?restaurante=${restaurante.id}`} className="carrossel-link">
                  <img
                    src={`/images/restaurantes/${restaurante.id}.png`}
                    alt={restaurante.nome_fantasia}
                    className="carrossel-image restaurante-logo"
                    onError={(e) => {
                      e.currentTarget.src = '/images/restaurantes/default.png';
                    }}
                  />
                  <div className="carrossel-legenda">{restaurante.nome_fantasia}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

