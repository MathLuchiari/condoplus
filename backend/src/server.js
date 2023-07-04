const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
// const hbs = require('hbs');
const exphbs = require('express-handlebars');
const routes = require('../routes/routes');
const connectionDB = require(`./api/services/connectionDB`)

let app = express()
let port = process.env.PORT || 3000;

//Definição do caminho para a pasta public
const publicDiretoryPath = path.join(__dirname, '../../public')

//Definição do caminho para a pasta que irá conter as views
const viewsPath = path.join(__dirname, '../../frontend/views')

//Definição do caminho para a pasta que irá conter os layouts
const layoutsPath = path.join(__dirname, '../../frontend/layouts')

// SECTION Conectando com o banco de dados
    connectionDB.connectDB()
// !SECTION


// SECTION Subindo o web server
    //Configurando a pasta puclic como static para o server
    app.use(express.static(publicDiretoryPath))
    
    //Configuração da engine do app como HBS, e definição da localização dos layouts
    app.engine('hbs', 
        exphbs.engine({
            extname: '.hbs',
            layoutsDir: layoutsPath
        })
    );
    
    app.set('view engine', 'hbs')
    app.set('views', viewsPath)
    app.set('layouts', layoutsPath)
    // hbs.registerPartials(partialsPath)
    
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    // app.get('/', function(req, res) { res.json({hello : 'world'});})
    routes(app)

    app.listen(port);

    console.log('Message RESTful API server started on: ' + port);
// !SECTION
