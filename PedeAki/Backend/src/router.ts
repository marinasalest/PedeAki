import { Router } from 'express'
import multer from 'multer'

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
import UpdateCategoriaController from './controllers/categoria/UpdateCategoriaController'
import DeleteCategoriaController from './controllers/categoria/DeleteCategoriaController'

import CreateRestauranteController from './controllers/restaurante/CreateRestauranteController'
import RestauranteController from './controllers/restaurante/RestauranteController'
import UpdateRestauranteController from './controllers/restaurante/UpdateRestauranteController'
import DeleteRestauranteController from './controllers/restaurante/DeleteRestauranteController'

import CreateProdutosController from './controllers/produto/CreateProdutosController'

import uploadConfig from './config/multer'

const router = Router();
const storage = uploadConfig.upload('./tmp').Storage;
const upload = multer({ storage });

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
const updateCategoriaController = new UpdateCategoriaController;
const deleteCategoriaController = new DeleteCategoriaController;

const createRestauranteController = new CreateRestauranteController;
const restauranteController = new RestauranteController;
const updateRestauranteController = new UpdateRestauranteController;
const deleteRestauranteController = new DeleteRestauranteController;

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
router.put('/categoria/:id', updateCategoriaController.updateCategoria);
router.delete('/categoria/:id', deleteCategoriaController.deleteCategoria);

//restaurante
router.post('/restaurante', createRestauranteController.createRestaurante);
router.get('/allRestaurantes', restauranteController.getAllRestaurantes);
router.put('/restaurante/:id', updateRestauranteController.updateRestaurante);
router.delete('/restaurante/:id', deleteRestauranteController.deleteRestaurante);

//produtos
router.post('/produto', upload.single('file'), createProdutosController.createProduto);

export { router };