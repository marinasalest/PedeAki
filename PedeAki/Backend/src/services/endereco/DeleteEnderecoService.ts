import prismaClient from "../../prisma";

class DeleteEnderecoService {
    async deleteEndereco(id: string): Promise<void> {
        try {
          const endereco = await prismaClient.enderecos.findUnique({
            where: { id: id },
          });
    
          if (!endereco) {
            throw new Error('Endereço não encontrado.');
          }
    
          await prismaClient.enderecos.delete({
            where: { id: id },
          });
        } catch (error) {
          console.error('Error in deleteEndereco:', error);
          throw new Error('Erro ao deletar endereço.');
        }
      }
}

export default DeleteEnderecoService ;