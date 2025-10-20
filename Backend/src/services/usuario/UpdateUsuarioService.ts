import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';

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
      const updateData: any = {};
      
      if (name) updateData.name = name;
      if (cpf) updateData.cpf = cpf;
      if (data_nascimento) updateData.data_nascimento = data_nascimento;
      if (password) {
        updateData.password = await hash(password, 8);
      }

      const updatedUser = await prismaClient.usuarios.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          cpf: true,
          data_nascimento: true,
          email: true,
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw new Error('Erro ao atualizar usuário.');
    }
  }
}

export default UpdateUsuarioService;
