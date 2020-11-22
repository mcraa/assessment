var express = require('express');
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

    app.mountRoutes('/todos', todoRoutes(router, storage))
    
    app.start();
    
})();
