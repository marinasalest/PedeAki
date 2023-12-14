import { Router } from 'express'

import { CreateUsuarioController } from './controllers/usuario/CreateUsuarioController'
import { AuthUsuarioController } from './controllers/usuario/AuthUsuarioController'
import UsuarioController from './controllers/usuario/UsuarioController'
import UpdateUsuarioController from './controllers/usuario/UpdateUsuarioController'
import DeleteUsuarioController from './controllers/usuario/DeleteUsuarioController'
import  EnderecoController from './controllers/endereco/EnderecoController'
import  ReadEnderecoController from './controllers/endereco/ReadEnderecoController'
import  UpdateEnderecoController from './controllers/endereco/UpdateEnderecoController'
import DeleteEnderecoController from './controllers/endereco/DeleteEnderecoController'


const router = Router();
const createUsuarioController = new CreateUsuarioController();
const authUsuarioController = new AuthUsuarioController();
const usuarioController = new UsuarioController;
const updateUsuarioController = new UpdateUsuarioController();
const deleteUsuarioController = new DeleteUsuarioController();

const enderecoController = new EnderecoController;
const readEnderecoController = new ReadEnderecoController;
const updateEnderecoController = new UpdateEnderecoController;
const deleteEnderecoController = new DeleteEnderecoController;


//usuario
router.post('/users', createUsuarioController.handle);
router.post('/login', authUsuarioController.handle);
router.get('/usuario/:id', usuarioController.getUsuarioById);
router.put('/usuario/:id', updateUsuarioController.updateUser);
router.delete('/usuario/:id', deleteUsuarioController.deleteUsuario);

//endereco
router.post('/endereco', enderecoController.createAddress);
router.get('/allEnderecos', readEnderecoController.getAllEnderecos);
router.put('/endereco/:id', updateEnderecoController.updateEnderecoField);
router.delete('/endereco/:id', deleteEnderecoController.deleteEndereco);


export { router };