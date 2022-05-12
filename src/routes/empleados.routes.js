const express = require('express');
const empleadoController = require('../controllers/empleados.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

var api = express.Router();

api.post('/agregarEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.agregarEmpleadoEmpresa);
api.put('/editarEmpleado/:idEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.editarEmpleadoEmpresa);
api.delete('/eliminarEmpleado/:idEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.eliminarEmpleadoEmpresa);
api.get('/obtenerPorId/:idEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.ObtenerEmpleadoId);
api.get('/obtenerPorNombre/:nombreEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.ObtenerEmpleadoNombre);
api.get('/obtenerPorPuesto/:puestoEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.ObtenerEmpleadoPuesto);
api.get('/obtenerPorDepartamento/:departamentoEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.ObtenerEmpleadoDepartamento);
api.get('/ObtenerEmpleado',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.ObtenerEmpleados);
api.get('/contarEmpleados',[md_autenticacion.Auth, md_roles.verEmpresa],empleadoController.contarEmpleados);
api.get('/PDF', [md_autenticacion.Auth,md_roles.verEmpresa], empleadoController.PDF);
module.exports =api;