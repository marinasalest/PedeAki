import  prismaClient from '../../prisma';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface AuthRequest{
    email: string;
    password: string;
}

class AuthUsuarioService {
    async execute({email, password}: AuthRequest){
        try{
            // Validação: Email deve ser válido
            if(!email){
                throw new Error("Email é obrigatório");
            }

            // Verificar se email existe
            const user = await prismaClient.usuarios.findFirst({
                where: {
                    email: email
                }
            })
        
            console.log('User from database:', user);

            if(!user){
                throw new Error("Email ou senha incorretos");
            }

            // Verificar se senha está correta
            const passwordMatch = await compare(password, user.password);

            console.log('Password match:', passwordMatch);
            if(!passwordMatch){
                throw new Error("Email ou senha incorretos");
            }

            // Gerar token JWT com expiração de 24 horas
            const jwtSecret = process.env.JWT_SECRET || 'pedeaki_jwt_secret_key_2024';
            const token = jwt.sign(
                { 
                    userId: user.id,
                    email: user.email
                },
                jwtSecret,
                { 
                    expiresIn: '24h' // Sessão expira após 24 horas
                }
            );
        
            return{ 
                message: "Login efetuado com sucesso",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    cpf: user.cpf,
                    data_nascimento: user.data_nascimento
                }
            }
        }catch (error) {
            console.error('Error in AuthUsuarioService:', error);
            throw error;
        }
    }

}

export { AuthUsuarioService};