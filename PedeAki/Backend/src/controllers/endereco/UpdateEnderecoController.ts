import { Request, Response } from "express";
import UpdateEnderecoService from "../../services/endereco/UpdateEnderecoService";

class UpdateEnderecoController {
    async updateEnderecoField(req: Request, res: Response): Promise<void> {
        try {
          const { id } = req.params;
          const camposAtualizados = req.body;
    
          const updateEnderecoFieldService = new UpdateEnderecoService();
    
          const enderecoAtualizado = await updateEnderecoFieldService.updateEnderecoField(id, camposAtualizados);
    
          res.status(200).json({ endereco: enderecoAtualizado });
        } catch (error) {
          console.error('Error in updateEnderecoField:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
}

export default UpdateEnderecoController;