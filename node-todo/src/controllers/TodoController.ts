import { Router, Request, Response } from "express";

export class TodoController {
    constructor(
        public router: Router
    ) { 
        router.get('/', this.getTodos)
    }

    getTodos = (req: Request, res: Response) => {
        res.send("Hola Todo")
    }
}

export const todoRoutes = (router: Router) => new TodoController(router).router