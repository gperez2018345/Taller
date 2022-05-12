var mongoose = require('mongoose');
const app = require('./app');
UsuarioController = require('./src/controllers/usuarios.controller');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/labtaller', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos");

    app.listen(3000, function(){
        console.log("Esta funcionando en el puerto 3000")
    })

UsuarioController.registrarAdmin();

}).catch(err => console.log(err))