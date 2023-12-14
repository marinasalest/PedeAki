import prismaClient from "../../prisma";
import { hash } from "bcryptjs";


interface UserRequest{
    name: string; 
    cpf: string;
    data_nascimento: Date;
    email: string;
    password: string;
    enderecoId: string;
}

class CreateUsuarioService {
    async execute({name, cpf, data_nascimento, email, password, enderecoId}: UserRequest  ){
        try{
            console.log('Creating user with EnderecoId:', enderecoId);
            
            //verificar se o email foi preenchido
            if(!email){
                throw new Error("Email incorreto")
            }
            //verificar se email existe
            const userAlreadyExists = await prismaClient.usuarios.findFirst({
                where: {
                    email: email
                }
            })
            if(userAlreadyExists){
                throw new Error("Usuário já existe")
            }

            const passwordHash = await hash (password, 8)

            const user = await prismaClient.usuarios.create({
                data: {
                    name: name,
                    cpf: cpf,
                    data_nascimento: data_nascimento,
                    email: email,
                    password: passwordHash,
                    enderecos: {
                        connect: { id: enderecoId }, 
                
                    }
                },
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

