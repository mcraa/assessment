import { expect } from 'chai'
import * as fs from 'fs'
import path from 'path'

import { TodoStorage } from '../../src/services/TodoStorage'
import { Todo } from '../../src/models'

describe('TodoStorage', () => {
    // const sandbox = sinon.createSandbox()
    // afterEach(() => {
    //     sandbox.restore();
    // })

    it('should exist', () => {
        let sut = new TodoStorage("");

        expect(sut).to.be.not.null
    })

    it("should parse Todos", () => {
        let todos = [] as Todo[]
        let sut = new TodoStorage("");

        let todoFile = Buffer.from(JSON.stringify(todos));

        let res = sut.parseTodos(todoFile);

        expect(res).to.be.eql([])
    })

    it("should get 0 Todos", async () => {
        let filePath = path.join(__dirname, "todos.json");
        fs.openSync(filePath, "w+");
        fs.writeFileSync(filePath, "[]")

        let sut = new TodoStorage(filePath);

        let res = await sut.getTodos()

        fs.unlinkSync(filePath);

        expect(res).to.be.eql([])
    })

    it("should get Todos", async () => {
        let todos: Todo[] = [
            {
                id: "id",
                text: "text",
                priority: 3,
                done: false,
            },
            {
                id: "id",
                text: "text",
                priority: 3,
                done: false,
            }
        ]
        let filePath = path.join(__dirname, "todos.json");
        fs.openSync(filePath, "w+");
        fs.writeFileSync(filePath, JSON.stringify(todos))

        let sut = new TodoStorage(filePath);

        let res = await sut.getTodos()

        fs.unlinkSync(filePath);

        expect(res).to.be.eql(todos)
    })
})