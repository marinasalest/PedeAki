import prismaClient from '../../prisma';

interface UpdateUsuarioRequest {
  id: string;
  name?: string;
  cpf?: string;
  data_nascimento?: Date;
  password?: string;
}

class UpdateUsuarioService {
  async updateUser({ id, name, cpf, data_nascimento, password }: UpdateUsuarioRequest): Promise<any> {
    try {
      const updatedUser = await prismaClient.usuarios.update({
        where: { id },
        data: {
          name,
          cpf,
          data_nascimento,
          password,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw new Error('Erro ao atualizar usuário.');
    }
  }
}

export default UpdateUsuarioService;
