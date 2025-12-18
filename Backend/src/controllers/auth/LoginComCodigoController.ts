import { Request, Response } from 'express';
import LoginComCodigoService from '../../services/usuario/LoginComCodigoService';

class LoginComCodigoController {
  async solicitarCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { tipo, destino } = req.body;

      if (!tipo || !destino) {
        return res.status(400).json({
          error: 'Tipo e destino são obrigatórios'
        });
      }

      if (!['email', 'sms', 'whatsapp'].includes(tipo)) {
        return res.status(400).json({
          error: 'Tipo deve ser: email, sms ou whatsapp'
        });
      }

      const service = new LoginComCodigoService();
      const resultado = await service.solicitarCodigo(tipo, destino);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in LoginComCodigoController.solicitarCodigo:', error);
      res.status(400).json({ error: error.message || 'Erro ao solicitar código' });
    }
  }

  async validarCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { tipo, destino, codigo } = req.body;

      if (!tipo || !destino || !codigo) {
        return res.status(400).json({
          error: 'Tipo, destino e código são obrigatórios'
        });
      }

      if (!['email', 'sms', 'whatsapp'].includes(tipo)) {
        return res.status(400).json({
          error: 'Tipo deve ser: email, sms ou whatsapp'
        });
      }

      if (codigo.length !== 6 || !/^\d{6}$/.test(codigo)) {
        return res.status(400).json({
          error: 'Código deve ter 6 dígitos numéricos'
        });
      }

      const service = new LoginComCodigoService();
      const resultado = await service.validarCodigoELogar(tipo, destino, codigo);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error('Error in LoginComCodigoController.validarCodigo:', error);
      res.status(400).json({ error: error.message || 'Erro ao validar código' });
    }
  }
}

export default LoginComCodigoController;















