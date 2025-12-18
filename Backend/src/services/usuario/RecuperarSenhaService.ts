import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';
import CodigoVerificacaoService from '../auth/CodigoVerificacaoService';
import EnvioCodigoService from '../auth/EnvioCodigoService';
import { validateEmail } from '../../utils/validators';
import { validatePassword } from '../../utils/validators';

class RecuperarSenhaService {
  async solicitarRecuperacao(email: string) {
    try {
      if (!email) {
        throw new Error('Email é obrigatório');
      }

      if (!validateEmail(email)) {
        throw new Error('Email inválido');
      }

      // Verifica se o usuário existe
      const usuario = await prismaClient.usuarios.findUnique({
        where: { email }
      });

      if (!usuario) {
        // Por segurança, não revela se o email existe ou não
        return {
          message: 'Se o email estiver cadastrado, você receberá um código de recuperação',
          email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mascara email
        };
      }

      // Gera código de verificação
      const codigoService = new CodigoVerificacaoService();
      const codigoData = await codigoService.gerarCodigo({
        tipo: 'email',
        destino: email
      });

      // Envia código por email
      const envioService = new EnvioCodigoService();
      await envioService.enviarPorEmail(
        email,
        codigoData.codigo_6_digitos
      );

      return {
        message: 'Código de recuperação enviado para seu email',
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
        expira_em: codigoData.expira_em
      };
    } catch (error: any) {
      console.error('Error in RecuperarSenhaService.solicitarRecuperacao:', error);
      throw error;
    }
  }

  async redefinirSenha(email: string, codigo: string, novaSenha: string) {
    try {
      if (!email || !codigo || !novaSenha) {
        throw new Error('Email, código e nova senha são obrigatórios');
      }

      if (!validateEmail(email)) {
        throw new Error('Email inválido');
      }

      if (!validatePassword(novaSenha)) {
        throw new Error('Senha deve ter no mínimo 6 caracteres');
      }

      // Valida código
      const codigoService = new CodigoVerificacaoService();
      await codigoService.validarCodigo(email, codigo, 'email');

      // Busca usuário
      const usuario = await prismaClient.usuarios.findUnique({
        where: { email }
      });

      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      // Atualiza senha
      const senhaHash = await hash(novaSenha, 8);
      await prismaClient.usuarios.update({
        where: { id: usuario.id },
        data: {
          password: senhaHash
        }
      });

      return {
        message: 'Senha redefinida com sucesso'
      };
    } catch (error: any) {
      console.error('Error in RecuperarSenhaService.redefinirSenha:', error);
      throw error;
    }
  }
}

export default RecuperarSenhaService;












