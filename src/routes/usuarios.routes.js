const express = require('express');
const usuarioController = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

var api = express.Router();

api.post('/registrarAdmin',usuarioController.registrarAdmin);
api.post('/registrarEmpresa',[md_autenticacion.Auth, md_roles.verAdmin],usuarioController.registrarEmpresaAdmin);
api.post('/login',usuarioController.login);
api.put('/editarEmpresa/:idUsuario',[md_autenticacion.Auth, md_roles.verAdmin],usuarioController.editarEmpresaAdmin);
api.delete('/eliminarEmpresa/:idUsuario',[md_autenticacion.Auth, md_roles.verAdmin],usuarioController.eliminarEmpresaAdmin);

module.exports =api;