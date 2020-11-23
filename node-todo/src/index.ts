var express = require('express');
var bodyParser = require('body-parser');
import path from 'path';
import { App } from './App';
import { todoRoutes } from './controllers/TodoController'
import { TodoStorage } from '../src/services/TodoStorage'

let port = process.env.port || '2233';
let app = new App(express(), port);
let storage = new TodoStorage(path.join(__dirname, "todos.json"))
let router = express.Router();

(async() => {

    await storage.init();

    app.useMiddleware(bodyParser.json())
    app.mountRoutes('/todos', todoRoutes(router, storage))
    
    app.start();
    
})();

export default { app, storage };