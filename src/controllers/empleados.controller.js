// importaciones
const express = require('express');
const Empleados = require('../models/empleados.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const { restart } = require('nodemon');

const req = require('express/lib/request');

function agregarEmpleadoEmpresa(req, res) {
    var parametros = req.body;
    var empleadoModel = new Empleados();

    if (parametros.nombre && parametros.puesto && parametros.departamento) {
        empleadoModel.nombre = parametros.nombre;
        empleadoModel.puesto = parametros.puesto;
        empleadoModel.departamento = parametros.departamento;
        empleadoModel.idEmpresa = req.user.sub; 
    }else {
        return res.status(500).send({ message: "error" })
    }

    Empleados.find({ nombre: parametros.nombre,puesto:parametros.puesto,departamento:parametros.departamento,idEmpresa:req.user.sub},
        (err, empleadoGuardado) => {
        if (empleadoGuardado.length==0) {
            empleadoModel.save((err, empleadosGuardados) => {
                console.log(err)
                if (err) return res.status(500).send({ message: "error en la peticion" });
                if (!empleadosGuardados) return res.status(404).send({ message: "No se puede agregar un empleado" });
                return res.status(200).send({ empleado: empleadosGuardados  });
            });
            
        } else {
            return res.status(500).send({ message: 'empleado existente' });
        }
    })
}
    
function editarEmpleadoEmpresa(req,res){
    var idUs = req.params.idEmpleado; 
    var paramentros = req.body; 

    Empleados.findOneAndUpdate({_id:idUs, idEmpresa:req.user.sub},paramentros,{new:true},
        (err,empleadoEditado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!empleadoEditado) return res.status(400).send({mensaje: 'No se puede editar el empleado'});
        return res.status(200).send({empleado: empleadoEditado});
    })
}

function eliminarEmpleadoEmpresa(req,res){
    var idUs = req.params.idEmpleado; 

    Empleados.findOneAndDelete({_id:idUs, idEmpresa:req.user.sub},
        (err,empleadoEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!empleadoEliminado) return res.status(400).send({mensaje: 'No se puede eliminar el empleado'});
        return res.status(200).send({empleado: empleadoEliminado});

    })
}

function ObtenerEmpleadoId(req,res){
    var idEmp = req.params.idEmpleado;

    Empleados.findById(idEmp,(err,empleadoEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!empleadoEncontrado) return res.status(404).send({mensaje:'Error, no se encontraron empleados'});
        return res.send({empleado: empleadoEncontrado});
    })
}

function ObtenerEmpleadoNombre(req, res) {
    var nomEmp = req.params.nombreEmpleado;
    Empleados.find({idEmpresa: req.user.sub, nombre : {$regex:nomEmp,$options: 'i'} },(err,empleadoEncontrado) =>{
        if(err) return res.status(500).send({message: "error en la peticion"});
        if(!empleadoEncontrado) return res.status(404).send({message: "Error, no se encontraron empleados"})
        return res.status(200).send({empleado: empleadoEncontrado});
    })
}

function ObtenerEmpleadoPuesto(req, res) {
    var pEmp = req.params.puestoEmpleado;
    Empleados.find({idEmpresa: req.user.sub, puesto : {$regex:pEmp,$options: 'i'} },(err,empleadoEncontrado) =>{
        if(err) return res.status(500).send({message: "error en la peticion"});
        if(!empleadoEncontrado) return res.status(404).send({message: "Error, no se encontraron empleados"})
        return res.status(200).send({empleado: empleadoEncontrado});
    })
}

function ObtenerEmpleadoDepartamento(req, res) {
    var dEmp = req.params.departamentoEmpleado;
    Empleados.find({idEmpresa: req.user.sub, departamento : {$regex:dEmp,$options: 'i'} },(err,empleadoEncontrado) =>{
        if(err) return res.status(500).send({message: "error en la peticion"});
        if(!empleadoEncontrado) return res.status(404).send({message: "Error, no se encontraron empleados"})
        return res.status(200).send({empleado: empleadoEncontrado});
    })
}

function ObtenerEmpleados(req,res){
    Empleados.find({idEmpresa: req.user.sub},(err, empleadosObtenidos) =>{
        if(err) return res.send({mensaje:"Error: "+err})

        for(let i = 0; i<empleadosObtenidos.length; i++){
            console.log(empleadosObtenidos[i].nombre)
        }

        return res.send({empleados: empleadosObtenidos})
    })
}

function contarEmpleados(req, res) {
    Empleados.count({idEmpresa: req.user.sub},(err, empleadoEncontrado) => {
        for (let i = 0; i < empleadoEncontrado.length; i++) {
            console.log(empleadoEncontrado[i].nombre)
        }
        return res.send({ empleado: empleadoEncontrado })
    })

}

function PDF(req, res) {

    Empleados.find({idEmpresa: req.user.sub}, (err, busqueda) => {
        if(err) return res.status(500).send({ mensaje: 'error en la peticion' });
        const fs = require('fs');
        const Pdfmake = require('pdfmake');

        var fonts = {
            Roboto: {
                normal: './fonts/Roboto-Regular.ttf',
                bold: './fonts/Roboto-Medium.ttf',
                italics: './fonts/Roboto-Italic.ttf',
                bolditalics: './fonts/Roboto-MediumItalic.ttf'
            }
        };

        let pdfmake = new Pdfmake(fonts);

        let content = [{
        text:  'LISTADO DE EMPLEADOS POR EMPRESA',fontSize: 24, alignment: 'center'
        
        }]
        

        for (let i = 0; i < busqueda.length ; i++) {

            let list = i + 1;

            content.push({
                text:' ',
            })

            content.push({
                text:'Empleado No. '+list,
            })
            content.push({
                text:' ',
            })

            content.push({
                text:'Nombre: '+busqueda[i].nombre
            })
            
            content.push({
                text:'Puesto: '+busqueda[i].puesto
            })
            
            content.push({
                text:'Departamento: '+busqueda[i].departamento
            })
                            
            content.push({
                text:'Empresa: '+busqueda[i].idEmpresa.nombre
            })
            content.push({
                text:' ',
            })

            
        }

        let docDefinition = {
            content: content,

            pageSize: {
                width: 595.28,
                height: 841.89  
              },
              background: function () {
                  return {
                      canvas: [
                          {
                              type: 'rect',
                              x: 0, y: 0, w: 15, h: 841.89,
                              color: '#00BFFF'
                          }
                      ]
                  };
              },
        }
    
        let pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
        pdfDoc.pipe(fs.createWriteStream('.listado.pdf'));
        pdfDoc.end();
        return res.status(200).send({mensaje: 'pdf Creado'});

        
    }).populate('idEmpresa')

}

module.exports ={
    agregarEmpleadoEmpresa,
    editarEmpleadoEmpresa,
    eliminarEmpleadoEmpresa,
    ObtenerEmpleadoId,
    ObtenerEmpleadoNombre,
    ObtenerEmpleadoPuesto,
    ObtenerEmpleadoDepartamento,
    ObtenerEmpleados,
    contarEmpleados,
    PDF
    
}