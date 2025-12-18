import prismaClient from '../../prisma';

interface RestauranteRequest {
  name: string;
  cnpj: string;
  nome_fantasia: string;
  senha: string;
  telefone: string;
  email: string;
  avaliacao?: number | string; // Opcional, pode ser número ou string
  enderecoId: string;
  categoriaId: string; // Obrigatório, ID da categoria do restaurante
}

class CreateRestauranteService {
  async createRestaurante({
    name,
    cnpj,
    nome_fantasia,
    senha,
    telefone,
    email,
    avaliacao,
    enderecoId,
    categoriaId,
  }: RestauranteRequest): Promise<any> {
    try {
      console.log('=== CREATE RESTAURANTE ===');
      console.log('Dados recebidos:', { name, cnpj, nome_fantasia, email, enderecoId, categoriaId });

      // Valida se o endereço existe
      const enderecoExiste = await prismaClient.enderecos.findUnique({
        where: { id: enderecoId }
      });

      if (!enderecoExiste) {
        throw new Error('Endereço não encontrado');
      }

      console.log('Endereço encontrado:', enderecoExiste.id);

      // Valida se a categoria existe
      const categoriaExiste = await prismaClient.categorias.findUnique({
        where: { id: categoriaId }
      });

      if (!categoriaExiste) {
        throw new Error('Categoria não encontrada');
      }

      console.log('Categoria encontrada:', categoriaExiste.id);

      // Converte avaliacao para número se for string
      const avaliacaoNumero = avaliacao ? Number(avaliacao) : 0;

      console.log('Criando restaurante com id_endereco:', enderecoId, 'e id_categoria:', categoriaId);

      const restaurante = await prismaClient.restaurantes.create({
        data: {
          name,
          cnpj,
          nome_fantasia,
          senha,
          telefone,
          email,
          avaliacao: avaliacaoNumero,
          // O ID será gerado automaticamente pelo Prisma (UUID)
          id_endereco: enderecoId, // Usa o campo direto do schema (não usa connect)
          id_categoria: categoriaId, // Categoria obrigatória
        },
      });

      console.log('Restaurante criado com sucesso, ID:', restaurante.id);
      return restaurante;
    } catch (error: any) {
      console.error('Error in createRestaurante:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta
      });
      throw new Error(error.message || 'Erro ao criar o restaurante.');
    }
  }
}

export default CreateRestauranteService;
