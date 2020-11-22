import { Router, Request, Response } from "express";
import { TodoStorage } from "../services/TodoStorage";

export class TodoController {
    constructor(
        public router: Router,
        private storage: TodoStorage,
    ) { 
        router.get('/', this.getTodos)
    }

    getTodos = async (req: Request, res: Response) => {
        let result = await this.storage.getTodos()
        res.json(result);
    }
}

export const todoRoutes = (router: Router, store: TodoStorage) => new TodoController(router, store).router