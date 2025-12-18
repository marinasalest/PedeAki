import { Request, Response } from 'express';
import UpdateRestauranteService from '../../services/restaurante/UpdateRestauranteService';

class UpdateRestauranteController {
  async updateRestaurante(req: Request, res: Response): Promise<void> {
    try {
      console.log('=== UPDATE RESTAURANTE ===');
      console.log('Body completo:', JSON.stringify(req.body, null, 2));
      console.log('Content-Type:', req.headers['content-type']);
      
      const { id } = req.params;
      const {
        name,
        cnpj,
        nome_fantasia,
        senha,
        telefone,
        email,
        avaliacao,
        enderecoId,
        id_endereco, // Aceita ambos os nomes
      } = req.body;
      
      console.log('Dados extraídos:', { id, name, cnpj, nome_fantasia, email, enderecoId, id_endereco });

      // Usa enderecoId ou id_endereco (qualquer um que vier)
      const enderecoIdFinal = enderecoId || id_endereco;

      const restauranteService = new UpdateRestauranteService();
      const restaurante = await restauranteService.updateRestaurante(id, {
        name,
        cnpj,
        nome_fantasia,
        senha,
        telefone,
        email,
        avaliacao,
        enderecoId: enderecoIdFinal,
      });

      res.status(200).json({ restaurante });
    } catch (error: any) {
      console.error('Error in updateRestaurante:', error);
      res.status(500).json({ error: error.message || 'Erro ao atualizar restaurante' });
    }
  }
}

export default UpdateRestauranteController;















