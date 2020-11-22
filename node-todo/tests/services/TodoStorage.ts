import { expect } from 'chai'
import * as fs from 'fs'
import path from 'path'
import * as sinon from 'sinon'

import { TodoStorage } from '../../src/services/TodoStorage'
import { Todo } from '../../src/models'

describe('TodoStorage', () => {
    const sandbox = sinon.createSandbox()
    afterEach(() => {
        sandbox.restore();
    })

    it('should initialize storage', async () => {   
        let filePath = path.join(__dirname, "todos.json");

        let statBefore = null;
        let errBefore = null;
        let statAfter = null;
        let errAfter = null 

        try {
            statBefore = fs.statSync(filePath)
        } catch (error) {
            errBefore = error
        }

        let sut = new TodoStorage(filePath);
        let initialized = await sut.init();

        try {
            statAfter = fs.statSync(filePath)
            fs.unlinkSync(filePath);            
        } catch (error) {
            errAfter = error
        }

        expect(initialized).to.be.true;
        expect(statBefore).to.be.null
        expect(statAfter).to.be.not.null
        expect(errBefore).to.be.not.null
        expect(errAfter).to.be.null
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

    it("should get Todo by id", async () => {
        let todos: Todo[] = [
            {
                id: "id",
                text: "text",
                priority: 3,
                done: false,
            },
            {
                id: "id2",
                text: "text",
                priority: 3,
                done: false,
            }
        ]

        let sut = new TodoStorage("noname");
        sandbox.stub(sut, "getTodos").returns(new Promise((res, _) => { res(todos) }));        

        let res = await sut.getTodoById("id2")

        expect(res).to.be.eql(todos[1])
    })

    it("should create a todo with default fields", async () => {
        let todo: Todo = 
            {
                text: "text"
            } as Todo

        let sut = new TodoStorage("noname");
        sandbox.stub(sut, "persistTodos").returns(new Promise((res, _) => { res() }));        
        sandbox.stub(sut, "getTodos").returns(new Promise((res, _) => { res([]) }));        

        let res = await sut.createTodo(todo);

        expect(res.text).to.be.eql(todo.text)
        expect(res.id).to.be.not.null
        expect(res.priority).to.be.equal(3)
        expect(res.done).to.be.false
    })

    it("should create throw with missing field", async () => {
        let todo: Todo = 
            {
                priority: 1
            } as Todo

        let sut = new TodoStorage("noname");
        sandbox.stub(sut, "persistTodos").returns(new Promise((res, _) => { res() }));        
        sandbox.stub(sut, "getTodos").returns(new Promise((res, _) => { res([]) }));        

        let res = null;
        let err = null;
        try {
            res = await sut.createTodo(todo);
        } catch (error) {
            err = error
        }
        expect(err).to.be.not.null
        expect(res).to.be.null
    })


})