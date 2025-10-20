import prismaClient from '../../prisma';

class DeleteUsuarioService {
  async deleteUserById(userId: string): Promise<void> {
    try {
      await prismaClient.usuarios.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.error('Error in deleteUserById:', error);
      throw new Error('Erro ao excluir usuário.');
    }
  }
}

export default DeleteUsuarioService;
