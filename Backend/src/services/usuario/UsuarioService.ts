import prismaClient from '../../prisma';

class UsuarioService {
  async getUsuarioById(userId: string): Promise<any> {
    try {
      const usuario = await prismaClient.usuarios.findUnique({
        where: {
          id: userId,
        },
        include: {
          enderecos: true
        }
      });

      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      return usuario;
    } catch (error) {
      console.error('Erro em getUsuarioById:', error);
      throw new Error('Erro ao obter dados do usuário.');
    }
  }

  async getAllUsuarios(): Promise<any[]> {
    try {
      const usuarios = await prismaClient.usuarios.findMany({
        select: {
          id: true,
          name: true,
          cpf: true,
          data_nascimento: true,
          email: true,
          enderecos: true
        }
      });

      return usuarios;
    } catch (error) {
      console.error('Erro em getAllUsuarios:', error);
      throw new Error('Erro ao obter lista de usuários.');
    }
  }
}

export default UsuarioService;
