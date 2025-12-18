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

      // Extrai apenas os campos necessários, ignorando o 'id' se vier no body
      // O ID será gerado automaticamente pelo banco de dados (UUID)
      const { rua, numero, complemento, bairro, cidade, estado, cep, latitude, longitude } = req.body;

      console.log('=== CREATE ENDERECO ===');
      console.log('Body completo:', JSON.stringify(req.body, null, 2));
      console.log('Dados extraídos:', { rua, numero, complemento, bairro, cidade, estado, cep });

      // Validação: verifica se todos os campos obrigatórios foram fornecidos
      const camposObrigatorios = { rua, numero, bairro, cidade, estado, cep };
      const camposFaltando = Object.entries(camposObrigatorios)
        .filter(([key, value]) => !value || (typeof value === 'string' && value.trim().length === 0))
        .map(([key]) => key);

      if (camposFaltando.length > 0) {
        console.log('Campos faltando:', camposFaltando);
        return res.status(400).json({ 
          error: `Campos obrigatórios faltando: ${camposFaltando.join(', ')}`,
          camposFaltando
        });
      }

      // Se todos os dados foram fornecidos, usar diretamente (não usar API)
      console.log('Todos os dados fornecidos, criando endereço diretamente');
      const enderecoDetails = {
        rua: String(rua).trim(),
        numero: String(numero).trim(),
        complemento: complemento ? String(complemento).trim() : '',
        bairro: String(bairro).trim(),
        cidade: String(cidade).trim(),
        estado: String(estado).trim(),
        cep: String(cep).replace(/\D/g, ''), // Remove formatação do CEP
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null
      };

      console.log('Dados processados:', enderecoDetails);

      // Salvar no banco de dados usando Prisma
      const enderecoId = await enderecoService.saveEndereco(enderecoDetails);

      console.log('Endereço criado com sucesso, ID:', enderecoId);

      return res.status(201).json({ 
        message: 'Endereço criado com sucesso', 
        enderecoId: enderecoId 
      });

    } catch (error: any) {
      console.error('Error in createAddress:', error);
      return res.status(500).json({ 
        message: 'Erro ao criar o endereço',
        error: error.message 
      });
    }
  }
}

export default EnderecoController;
