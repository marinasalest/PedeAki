import prismaClient from "../../prisma";
import { hash } from "bcryptjs";
import { validateCPF, validateEmail, validateAge, validatePassword } from "../../utils/validators";


interface UserRequest{
    name: string; 
    cpf: string;
    data_nascimento: Date | null;
    email: string;
    password: string;
    enderecoId: string;
}

class CreateUsuarioService {
    async execute({name, cpf, data_nascimento, email, password, enderecoId}: UserRequest  ){
        try{
            console.log('Creating user with EnderecoId:', enderecoId);
            
            // Validação: Endereço é obrigatório apenas para cadastro local
            // Para OAuth, o endereço pode ser adicionado depois
            if(enderecoId){
                // Verificar se o endereço existe
                const enderecoExists = await prismaClient.enderecos.findUnique({
                    where: { id: enderecoId }
                });
                if(!enderecoExists){
                    throw new Error("Endereço não encontrado");
                }
            }

            // Validação: Email deve ser válido
            if(!email){
                throw new Error("Email é obrigatório");
            }
            if(!validateEmail(email)){
                throw new Error("Email inválido");
            }

            // Validação: Email deve ser único
            const userWithEmail = await prismaClient.usuarios.findFirst({
                where: {
                    email: email
                }
            });
            if(userWithEmail){
                throw new Error("Email já cadastrado no sistema");
            }

            // Validação: CPF deve ser válido (opcional para OAuth)
            if(cpf){
                if(!validateCPF(cpf)){
                    throw new Error("CPF inválido");
                }

                // Validação: CPF deve ser único
                const userWithCPF = await prismaClient.usuarios.findFirst({
                    where: {
                        cpf: cpf
                    }
                });
                if(userWithCPF){
                    throw new Error("CPF já cadastrado no sistema");
                }
            }

            // Validação: Usuário deve ter pelo menos 18 anos (opcional para OAuth)
            if(data_nascimento){
                if(!validateAge(data_nascimento)){
                    throw new Error("Usuário deve ter pelo menos 18 anos");
                }
            }

            // Validação: Senha deve ter mínimo 6 caracteres (opcional para OAuth)
            if(password){
                if(!validatePassword(password)){
                    throw new Error("Senha deve ter no mínimo 6 caracteres");
                }
            } else {
                // Se não tem senha, é obrigatório ter endereço (para OAuth)
                if(!enderecoId){
                    throw new Error("Para cadastro sem senha, é necessário informar um endereço");
                }
            }

            const passwordHash = await hash (password, 8)

            const userData: any = {
                name: name,
                email: email,
                cpf: cpf || null,
                data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
                password: passwordHash || null,
                provider: 'local'
            };

            if(enderecoId){
                userData.enderecos = {
                    connect: { id: enderecoId }
                };
            }

            const user = await prismaClient.usuarios.create({
                data: userData,
                select:{
                    id: true, 
                    name: true, 
                    cpf: true,
                    data_nascimento: true,
                    email: true,
                }
            });

            console.log('User created in database:', user);
            return user;
        }catch (error) {
            console.error('Error in CreateUsuarioService:', error);
            throw error;
        }
    }
}

export { CreateUsuarioService}

