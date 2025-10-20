import { Request, Response } from 'express';
import EnderecoService from '../../services/endereco/EnderecoService';

class EnderecoController {

  async createAddress(req: Request, res: Response): Promise<Response> {
    try {

        const enderecoService = new EnderecoService();
      if (!enderecoService) {
        console.error('EnderecoService is not defined in EnderecoController');
        return res.status(500).json({ message: 'Erro ao acessar a classe' });
      }

      const { cep } = req.body;

      // Obter detalhes do endereço usando o serviço
      console.log('Calling getAddressDetails method');
      const enderecoDetails = await enderecoService.getAddressDetails(cep);

      // Salvar no banco de dados usando Prisma
      const enderecoId = await enderecoService.saveEndereco(enderecoDetails);

      return res.status(201).json({ message: 'Endereço criado com sucesso', enderecoId: enderecoId })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar o endereço' });
    }
  }
}

export default EnderecoController;
