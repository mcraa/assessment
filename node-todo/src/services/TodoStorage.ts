import * as fs from 'fs'
import { nanoid } from 'nanoid'

import { Todo } from '../models'

export class TodoStorage {

    archiveQueue: { [index: string]: number } = {}

    constructor(private path: string) { }

    init = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            fs.stat(this.path, (err, stats) => {
                if (err) {
                    fs.open(this.path, "w+", (err, fd) => {
                        if (err) {
                            console.log("Can't create storage", err);
                            reject(err)                        
                        } else {
                            console.log("Todo store created");   
                            fs.writeFile(this.path, "[]", (err) => {
                                if (err) {
                                    console.log("Can't initialze storage with []", err); 
                                    reject(err);                          
                                }
                            }) 
                            console.log("Initialized store with empty list");  
                            
                            resolve(true);
                        }                        
                    });

                    
                } else {
                    console.log(`Data stored in ${this.path}`);
                    console.log(`Existing size ${stats.size} bytes`);                
                    
                    resolve(true);
                }

            })

        })
    }

    getPath(): string {
        return this.path
    }

    getTodos = (): Promise<Todo[]> => {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, (err, data) => {
                if (err) {
                    reject(err)
                }

                resolve(this.parseTodos(data));
             })
        })
    }

    getTodoById = async (id: string): Promise<Todo | undefined> => {
        let all = await this.getTodos();
        return all.find((v) => v.id === id)
    }

    parseTodos = (file: Buffer): Todo[] => {
        if (file) {
            let todos: Todo[] = JSON.parse(file.toString());
            let originalLength = todos.length
            let expiringTodos = Object.keys(this.archiveQueue);

            let expiredTodos = expiringTodos
                .map(v => this.archiveQueue[v] < Date.now() ? v : undefined) as string[];

            for (var i = 0; i < expiredTodos.length; ++i) {
                if (expiredTodos[i]) {
                    let expiredIndex = todos.findIndex(v => v.id == expiredTodos[i]);
                    todos.splice(expiredIndex, 1);
                    delete this.archiveQueue[expiredTodos[i]]
                }
            }

            if (originalLength != todos.length) {
                this.persistTodos(todos);
            }

            return todos;
        } else {
            return [];
        }
    }

    createTodo = async (todo: Todo) => {
        this.validateTodo(todo);

        todo.id = nanoid();

        let existingTodos = await this.getTodos();
        existingTodos.push(todo);
        await this.persistTodos(existingTodos);

        if (todo.done) {
            this.setArchiveQueue(todo.id, todo.done);
        }

        return todo;
    }

    persistTodos = (todos: Todo[]): Promise<void> => {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, JSON.stringify(todos), (err) => {
                if (err) {
                    console.log("Can't save todos", err);
                    reject(err);                    
                }

                resolve();
            })
        })
    } 

    removeTodo = async (todoId: string) => {
        let existingTodos = await this.getTodos();
        let index = existingTodos.findIndex(v => v.id == todoId)
        if (index < 0) {
            throw new Error("Todo does not exist");
        }
        
        existingTodos.splice(index, 1);

        await this.persistTodos(existingTodos);
    }

    updateTodo = async (id:string, update: Todo) => {
        let { text, priority, done } = update;
        let existingTodos = await this.getTodos();

        let oldTodo = existingTodos.findIndex(v => v.id === id);

        if (oldTodo < 0) {
            throw new Error("Todo does not exist");            
        }

        if (text) {
            existingTodos[oldTodo].text = text;
        }

        if (priority) {
            existingTodos[oldTodo].priority = priority;
        }

        if (typeof(done) === "boolean") {
            this.setArchiveQueue(id, done);
            existingTodos[oldTodo].done = done;
        }

        this.validateTodo(existingTodos[oldTodo]);
        await this.persistTodos(existingTodos);

        return existingTodos[oldTodo];        
    }

    validateTodo(todo: Todo) {
        if (!todo.text) {
            throw new Error("Todo text must be set")
        }

        if (todo.priority > 5 || todo.priority < 1) {
            throw new Error("Invalid priority")
        }

        if (!todo.priority) {
            todo.priority = 3
        }

        if (!todo.done) {
            todo.done = false;
        }

        if (typeof(todo.done) !== 'boolean') {
            throw new Error("Invalid value for done");            
        }
    }

    setArchiveQueue(id:string, remove: boolean) {
        if (remove) {
            this.archiveQueue[id] = Date.now() + (1000 * 60 * 5)
        } else {
            delete this.archiveQueue[id];
        }
    }
}