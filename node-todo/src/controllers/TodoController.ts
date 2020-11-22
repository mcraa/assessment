import { Router, Request, Response } from "express";
import { TodoStorage } from "../services/TodoStorage";

export class TodoController {
    constructor(
        public router: Router,
        private storage: TodoStorage,
    ) { 
        router.get('/', this.getTodos)
        router.get('/:id', this.getOneTodo)
    } 

    getTodos = async (req: Request, res: Response) => {
        let result = await this.storage.getTodos()
        res.json(result);
    }

    getOneTodo = async (req: Request, res: Response) => {
        let todo = await this.storage.getTodoById(req.params.id)
        res.json(todo);
    }
}

export const todoRoutes = (router: Router, store: TodoStorage) => new TodoController(router, store).router