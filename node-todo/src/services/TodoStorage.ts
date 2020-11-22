import * as fs from 'fs'

import { Todo } from '../models'

export class TodoStorage {

    constructor(private path: string) {

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

    parseTodos = (file: Buffer): Todo[] => {
        return JSON.parse(file.toString());
    }

    

}