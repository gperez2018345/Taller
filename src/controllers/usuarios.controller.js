// importaciones
const express = require('express');
const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');


function registrarAdmin(req, res) {
  var usuarioModelo = new Usuarios();

  usuarioModelo.nombre = "admin";
  usuarioModelo.email = "admin@kinal.edu.gt";
  usuarioModelo.rol = "ROL_ADMIN";

  Usuarios.find({ email: "admin@kinal.edu.gt", nombre: "admin" }, (err, usuarioAgregado) => {
    if (usuarioAgregado.length == 0) {
      bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
        usuarioModelo.password = passwordEncriptada;
        usuarioModelo.save((err, usuarioGuardado) => {
          console.log(err);
        });
      });
    } else {
      console.log("Este usuario ya está creado");
    }
  });
}


function registrarEmpresaAdmin(req, res){
    var paramentros = req.body;
    var usuariosModel = new Usuarios();
 
    if(paramentros.nombre, paramentros.email, paramentros.password){
        usuariosModel.nombre = paramentros.nombre;
        usuariosModel.email = paramentros.email;
        usuariosModel.rol = "ROL_EMPRESA";

        Usuarios.find({email: paramentros.email},
            (err, empresaAgregado) => {
                if(empresaAgregado.length == 0){

                bcrypt.hash(paramentros.password, null,null, (err, passwordEncriptada)=>{
                    usuariosModel.password = passwordEncriptada;

                    usuariosModel.save((err, empresaGuardado) => {
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                        if(!empresaGuardado) return res.status(404).send({mensaje: 'No se puede agregar la empresa'});
        
                        return res.status(201).send({usuarios: empresaGuardado});
                     })

                })

            }else{
                return res.status(500).send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
            }
        })
    }
         
} 


function login(req, res) {
    var parametros = req.body;

    Usuarios.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ message: "error en la peticion" });
        if (usuarioEncontrado) {

            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, verificacionPassword) => {
                if (verificacionPassword) {

                    if (parametros.obtenerToken === 'true') {
                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuario: usuarioEncontrado })
                    }


                } else {
                    return res.status(500).send({ mensaje: 'las contraseñas no coinciden' });
                }
            })

        } else {
            return res.status(404).send({ message: "Error, correo no registrado" })
        }
    })
}


function editarEmpresaAdmin(req, res){
    var idUser = req.params.idUsuario;
    var paramentros = req.body;

        Usuarios.findByIdAndUpdate({_id: idUser, email: paramentros.email, password: paramentros.password, rol: paramentros.rol}, paramentros,{new:true},
            (err, empresaEditada)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!empresaEditada) return res.status(400).send({mensaje: 'No se puede ediar la empresa'});
                
                return res.status(200).send({usuarios: empresaEditada});
            })
}


function eliminarEmpresaAdmin(req, res){
    var idUser = req.params.idUsuario;
    var paramentros = req.body;

        Usuarios.findByIdAndDelete({_id: idUser,  email: paramentros.email, password: paramentros.password, rol: paramentros.rol},(err, empresaEliminada)=>{
                
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!empresaEliminada) return res.status(400).send({mensaje: 'No es puede eliminar la empresa'});
                
                return res.status(200).send({usuarios: empresaEliminada});
            })
}


module.exports = {
    registrarAdmin,
    registrarEmpresaAdmin,
    login,
    editarEmpresaAdmin,
    eliminarEmpresaAdmin
}