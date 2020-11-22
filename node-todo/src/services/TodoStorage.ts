import * as fs from 'fs'

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



}