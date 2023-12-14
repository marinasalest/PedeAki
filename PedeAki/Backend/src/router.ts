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

import CreateCategoriaController from './controllers/categoria/CreateCategoriaController'
import CategoriaController from './controllers/categoria/CategoriaController'

import CreateRestauranteController from './controllers/restaurante/CreateRestauranteController'
import RestauranteController from './controllers/restaurante/RestauranteController'

import CreateProdutosController from './controllers/produto/CreateProdutosController'


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

const createCategoriaController = new CreateCategoriaController;
const categoriaController = new CategoriaController;

const createRestauranteController = new CreateRestauranteController;
const restauranteController = new RestauranteController;

const createProdutosController = new CreateProdutosController;


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

//categoria
router.post('/categoria', createCategoriaController.createCategoria);
router.get('/allCategorias', categoriaController.getAllCategorias);

//restaurante
router.post('/restaurante', createRestauranteController.createRestaurante);
router.get('/allRestaurantes', restauranteController.getAllRestaurantes);

//produtos
router.post('/produto', createProdutosController.createProduto);
export { router };