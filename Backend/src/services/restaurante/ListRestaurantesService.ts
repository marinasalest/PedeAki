import prismaClient from '../../prisma';
import { calculateDistance, isRestauranteAberto } from '../../utils/calculations';

interface FiltrosRestaurante {
  categoriaId?: string;
  avaliacaoMinima?: number;
  precoMin?: number;
  precoMax?: number;
  tempoMaxEntrega?: number;
  tipoEntrega?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
}

class ListRestaurantesService {
  async execute(filtros: FiltrosRestaurante) {
    try {
      const {
        categoriaId,
        avaliacaoMinima,
        precoMin,
        precoMax,
        tempoMaxEntrega,
        tipoEntrega,
        cep,
        latitude,
        longitude
      } = filtros;

      // Busca todos os restaurantes ativos
      let restaurantes = await prismaClient.restaurantes.findMany({
        where: {
          ativo: true
        },
        include: {
          enderecos: true,
          produtos: {
            where: {
              ativo: true,
              disponivel: true
            }
          },
          avaliacoes: true
        }
      });

      // Filtro 1: Apenas restaurantes abertos
      restaurantes = restaurantes.filter(restaurante =>
        isRestauranteAberto(
          restaurante.horario_abertura,
          restaurante.horario_fechamento,
          restaurante.dias_funcionamento
        )
      );

      // Filtro 2: Distância máxima de 10km
      if (latitude && longitude && restaurantes[0]?.enderecos) {
        restaurantes = restaurantes.filter(restaurante => {
          if (!restaurante.enderecos.latitude || !restaurante.enderecos.longitude) {
            return false;
          }
          const distancia = calculateDistance(
            latitude,
            longitude,
            restaurante.enderecos.latitude,
            restaurante.enderecos.longitude
          );
          return distancia <= (restaurante.raio_entrega || 10);
        });
      }

      // Filtro 3: CEP atendido
      if (cep) {
        restaurantes = restaurantes.filter(restaurante => {
          if (!restaurante.ceps_atendidos) return true; // Se não tem CEPs específicos, atende todos
          const cepsArray = restaurante.ceps_atendidos.split(',').map(c => c.trim());
          return cepsArray.includes(cep);
        });
      }

      // Filtro 4: Categoria
      if (categoriaId) {
        restaurantes = restaurantes.filter(restaurante =>
          restaurante.produtos.some(produto => produto.id_categoria === categoriaId)
        );
      }

      // Filtro 5: Avaliação mínima
      if (avaliacaoMinima) {
        restaurantes = restaurantes.filter(restaurante =>
          restaurante.avaliacao >= avaliacaoMinima
        );
      }

      // Filtro 6: Faixa de preço (baseado nos produtos)
      if (precoMin || precoMax) {
        restaurantes = restaurantes.filter(restaurante => {
          if (restaurante.produtos.length === 0) return false;
          const precos = restaurante.produtos.map(p => p.preco);
          const precoMinimo = Math.min(...precos);
          const precoMaximo = Math.max(...precos);

          if (precoMin && precoMaximo < precoMin) return false;
          if (precoMax && precoMinimo > precoMax) return false;
          return true;
        });
      }

      // Filtro 7: Tempo máximo de entrega
      if (tempoMaxEntrega) {
        restaurantes = restaurantes.filter(restaurante => {
          const tempoTotal = restaurante.tempo_medio_preparo + restaurante.tempo_medio_entrega;
          return tempoTotal <= tempoMaxEntrega;
        });
      }

      // Filtro 8: Tipo de entrega
      if (tipoEntrega) {
        restaurantes = restaurantes.filter(restaurante =>
          restaurante.tipo_entrega === tipoEntrega
        );
      }

      // Formata resposta
      return restaurantes.map(restaurante => ({
        id: restaurante.id,
        name: restaurante.name,
        nome_fantasia: restaurante.nome_fantasia,
        foto: restaurante.foto,
        avaliacao: restaurante.avaliacao,
        taxa_entrega: restaurante.taxa_entrega,
        tempo_estimado: restaurante.tempo_medio_preparo + restaurante.tempo_medio_entrega,
        entrega_gratis: restaurante.entrega_gratis,
        valor_minimo_entrega_gratis: restaurante.valor_minimo_entrega_gratis,
        aberto: isRestauranteAberto(
          restaurante.horario_abertura,
          restaurante.horario_fechamento,
          restaurante.dias_funcionamento
        ),
        horario_abertura: restaurante.horario_abertura,
        horario_fechamento: restaurante.horario_fechamento,
        tipo_entrega: restaurante.tipo_entrega,
        endereco: restaurante.enderecos
      }));
    } catch (error) {
      console.error('Error in ListRestaurantesService:', error);
      throw new Error('Erro ao listar restaurantes');
    }
  }
}

export default ListRestaurantesService;















