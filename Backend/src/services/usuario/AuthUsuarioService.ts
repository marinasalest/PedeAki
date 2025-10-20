import  prismaClient from '../../prisma';
import { compare } from 'bcryptjs';	

interface AuthRequest{
    email: string;
    password: string;
}

class AuthUsuarioService {
    async execute({email, password}: AuthRequest){
        try{
            // Verificar se email existe
            const user = await prismaClient.usuarios.findFirst({
                where: {
                    email: email
                }
            })
        
            console.log('User from database:', user);

            if(!user){
            throw new Error("Email ou Password está incorreto");
            }
            // Verificar se senha está correta
            const passwordMatch = await compare(password, user.password);

            console.log('Password match:', passwordMatch);
            if(!passwordMatch){
                throw new Error("Email ou Password está incorreto");
            }
        
            return{ 
                message: "Login efetuado com sucesso",
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