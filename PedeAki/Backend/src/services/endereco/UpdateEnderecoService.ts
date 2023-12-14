import prismaClient from "../../prisma";

interface CamposAtualizados {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  }


class UpdateEnderecoService {
    async updateEnderecoField(id: string, camposAtualizados: CamposAtualizados): Promise<any> {
        try {
          const endereco = await prismaClient.enderecos.findUnique({
            where: { id: id },
          });
    
          if (!endereco) {
            throw new Error('Endereço não encontrado.');
          }
    
          const enderecoAtualizado = await prismaClient.enderecos.update({
            where: { id: id },
            data: { ...endereco, ...camposAtualizados },
          });
    
          return enderecoAtualizado;
        } catch (error) {
          console.error('Error in updateEnderecoField:', error);
          throw new Error('Erro ao atualizar campos do endereço.');
        }
      }
}

export default UpdateEnderecoService;