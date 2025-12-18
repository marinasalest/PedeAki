import prismaClient from '../../prisma';
import jwt from 'jsonwebtoken';
import CodigoVerificacaoService from '../auth/CodigoVerificacaoService';
import EnvioCodigoService from '../auth/EnvioCodigoService';

class LoginComCodigoService {
  async solicitarCodigo(tipo: 'email' | 'sms' | 'whatsapp', destino: string) {
    try {
      // Valida formato
      if (tipo === 'email' && !this.validarEmail(destino)) {
        throw new Error('Email inválido');
      }

      if ((tipo === 'sms' || tipo === 'whatsapp') && !this.validarTelefone(destino)) {
        throw new Error('Telefone inválido');
      }

      // Gera código
      const codigoService = new CodigoVerificacaoService();
      const codigoData = await codigoService.gerarCodigo({ tipo, destino });

      // Envia código
      const envioService = new EnvioCodigoService();
      await envioService.enviarCodigo(tipo, destino, codigoData.codigo_6_digitos);

      return {
        message: `Código de verificação enviado para ${codigoData.destino}`,
        tipo,
        destino_mascarado: codigoData.destino,
        expira_em: codigoData.expira_em
      };
    } catch (error) {
      console.error('Error in LoginComCodigoService.solicitarCodigo:', error);
      throw error;
    }
  }

  async validarCodigoELogar(
    tipo: 'email' | 'sms' | 'whatsapp',
    destino: string,
    codigo: string
  ) {
    try {
      // Valida código
      const codigoService = new CodigoVerificacaoService();
      await codigoService.validarCodigo(destino, codigo, tipo);

      // Busca ou cria usuário
      let usuario;

      if (tipo === 'email') {
        usuario = await prismaClient.usuarios.findUnique({
          where: { email: destino }
        });

        if (!usuario) {
          // Cria usuário se não existir (login social)
          usuario = await prismaClient.usuarios.create({
            data: {
              name: destino.split('@')[0],
              email: destino,
              provider: 'email_codigo',
              cpf: null,
              data_nascimento: null,
              password: null,
              id_endereco: null
            }
          });
        }
      } else {
        // Para SMS/WhatsApp, busca por telefone (precisa adicionar campo telefone na tabela)
        // Por enquanto, busca por email ou cria novo
        usuario = await prismaClient.usuarios.findFirst({
          where: {
            OR: [
              { email: `${destino}@pedeaki.com` },
              // Adicionar campo telefone quando necessário
            ]
          }
        });

        if (!usuario) {
          usuario = await prismaClient.usuarios.create({
            data: {
              name: `Usuário ${destino}`,
              email: `${destino}@pedeaki.com`,
              provider: tipo === 'whatsapp' ? 'whatsapp_codigo' : 'sms_codigo',
              cpf: null,
              data_nascimento: null,
              password: null,
              id_endereco: null
            }
          });
        }
      }

      // Gera token JWT
      const jwtSecret = process.env.JWT_SECRET || 'pedeaki_jwt_secret_key_2024';
      const token = jwt.sign(
        {
          userId: usuario.id,
          email: usuario.email
        },
        jwtSecret,
        {
          expiresIn: '24h'
        }
      );

      return {
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
          provider: usuario.provider
        }
      };
    } catch (error) {
      console.error('Error in LoginComCodigoService.validarCodigoELogar:', error);
      throw error;
    }
  }

  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validarTelefone(telefone: string): boolean {
    // Remove caracteres não numéricos
    const numeroLimpo = telefone.replace(/\D/g, '');
    // Valida se tem 10 ou 11 dígitos (com DDD)
    return numeroLimpo.length >= 10 && numeroLimpo.length <= 11;
  }
}

export default LoginComCodigoService;















