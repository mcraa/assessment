import { Router, Request, Response } from "express";
import { Todo } from "../models";
import { TodoStorage } from "../services/TodoStorage";

export class TodoController {
    constructor(
        public router: Router,
        private storage: TodoStorage,
    ) { 
        router.get('/', this.getTodos)
        router.get('/:id', this.getOneTodo)
        router.post('/', this.postTodo)
        router.delete('/:id', this.deleteTodo)
    } 

    getTodos = async (req: Request, res: Response) => {
        let result = await this.storage.getTodos()
        res.json(result);
    }

    getOneTodo = async (req: Request, res: Response) => {
        let todo = await this.storage.getTodoById(req.params.id)
        res.json(todo);
    }

    postTodo = async (req: Request, res: Response) => {
        try {
            let { text, priority, done } = req.body;
            let todo = {
                text,
                priority,
                done
            } as Todo
            let newTodo = await this.storage.createTodo(todo);

            res.json(newTodo);
            
        } catch (error) {
            res.status(405).send(error);
        }
    }

    deleteTodo = async (req: Request, res: Response) => {
        try {
            await this.storage.removeTodo(req.params.id)
            res.send();
        } catch (error) {
            res.status(404).send(error)
        }
    }

}

export const todoRoutes = (router: Router, store: TodoStorage) => new TodoController(router, store).router