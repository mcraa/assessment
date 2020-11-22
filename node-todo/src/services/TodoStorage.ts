import * as fs from 'fs'
import { nanoid } from 'nanoid'

import { Todo } from '../models'

export class TodoStorage {

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
            return JSON.parse(file.toString());
        } else {
            return [];
        }
    }

    createTodo = async (todo: Todo) => {
        if (!todo.text) {
            throw new Error("Todo text must be set")
        }

        todo.id = nanoid();
        if (!todo.priority) {
            todo.priority = 3
        }

        if (!todo.done) { 
            todo.done = false;
        }

        let existingTodos = await this.getTodos();
        existingTodos.push(todo);
        await this.persistTodos(existingTodos);

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



}