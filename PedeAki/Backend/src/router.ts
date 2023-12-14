import { Router } from 'express'

import { CreateUsuarioController } from './controllers/usuario/CreateUsuarioController'
import { AuthUsuarioController } from './controllers/usuario/AuthUsuarioController'
import  EnderecoController from './controllers/endereco/EnderecoController'

const router = Router();
const createUsuarioController = new CreateUsuarioController();
const authUsuarioController = new AuthUsuarioController();
const enderecoController = new EnderecoController;


router.post('/users', createUsuarioController.handle);
router.post('/login', authUsuarioController.handle);
router.post('/endereco', enderecoController.createAddress);

export { router };