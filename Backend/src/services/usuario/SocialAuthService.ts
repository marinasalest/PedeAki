import prismaClient from '../../prisma';
import jwt from 'jsonwebtoken';

interface SocialUser {
  id: string;
  name: string;
  email: string;
  provider: string;
}

class SocialAuthService {
  async generateToken(user: SocialUser): Promise<string> {
    const jwtSecret = process.env.JWT_SECRET || 'pedeaki_jwt_secret_key_2024';
    
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email
      },
      jwtSecret,
      { 
        expiresIn: '24h'
      }
    );

    return token;
  }

  async getUserById(userId: string) {
    const user = await prismaClient.usuarios.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        data_nascimento: true,
        provider: true
      }
    });

    return user;
  }

  async loginWithFacebook(email: string) {
    // Busca usuário pelo email que tenha provider = 'facebook'
    const user = await prismaClient.usuarios.findFirst({
      where: {
        email: email,
        provider: 'facebook'
      }
    });

    if (!user) {
      throw new Error('Usuário não encontrado ou não cadastrado com Facebook');
    }

    const token = await this.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider || 'facebook'
    });

    return {
      message: 'Login com Facebook realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        data_nascimento: user.data_nascimento,
        provider: user.provider
      }
    };
  }

  async loginWithGoogle(email: string) {
    // Busca usuário pelo email que tenha provider = 'google'
    const user = await prismaClient.usuarios.findFirst({
      where: {
        email: email,
        provider: 'google'
      }
    });

    if (!user) {
      throw new Error('Usuário não encontrado ou não cadastrado com Google');
    }

    const token = await this.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider || 'google'
    });

    return {
      message: 'Login com Google realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        data_nascimento: user.data_nascimento,
        provider: user.provider
      }
    };
  }
}

export default SocialAuthService;















