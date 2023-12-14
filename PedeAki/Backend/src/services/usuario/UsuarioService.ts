import prismaClient from '../../prisma';

class UsuarioService {
  async getUsuarioById(userId: string): Promise<any> {
    try {
      const usuario = await prismaClient.usuarios.findUnique({
        where: {
          id: userId,
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
}

export default UsuarioService;
