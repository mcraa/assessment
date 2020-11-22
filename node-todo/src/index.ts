var express = require('express');
import { App } from './App';
import { todoRoutes } from './controllers/TodoController'

let port = process.env.port || '2233';
let app = new App(express(), port);
let router = express.Router();

app.mountRoutes('/todos', todoRoutes(router))

app.start();