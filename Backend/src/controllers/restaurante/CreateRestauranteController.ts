// src/controllers/restaurante/RestauranteController.ts
import { Request, Response } from 'express';
import CreateRestauranteService from '../../services/restaurante/CreateRestauranteService';

class RestauranteController {
  async createRestaurante(req: Request, res: Response): Promise<void> {
    try {
      // Extrai apenas os campos necessários, ignorando o 'id' se vier no body
      // O ID será gerado automaticamente pelo banco de dados (UUID)
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
        categoriaId,
        id_categoria, // Aceita ambos os nomes
      } = req.body;

      // Usa enderecoId ou id_endereco (qualquer um que vier)
      const enderecoIdFinal = enderecoId || id_endereco;
      // Usa categoriaId ou id_categoria (qualquer um que vier)
      const categoriaIdFinal = categoriaId || id_categoria;

      if (!enderecoIdFinal) {
        return res.status(400).json({ 
          error: 'enderecoId ou id_endereco é obrigatório' 
        });
      }

      if (!categoriaIdFinal) {
        return res.status(400).json({ 
          error: 'categoriaId ou id_categoria é obrigatório' 
        });
      }

      const restauranteService = new CreateRestauranteService();
      const restaurante = await restauranteService.createRestaurante({
        name,
        cnpj,
        nome_fantasia,
        senha,
        telefone,
        email,
        avaliacao,
        enderecoId: enderecoIdFinal,
        categoriaId: categoriaIdFinal,
      });

      res.status(201).json({ restaurante });
    } catch (error: any) {
      console.error('Error in createRestaurante:', error);
      res.status(500).json({ 
        error: error.message || 'Internal Server Error' 
      });
    }
  }
}

export default RestauranteController;
