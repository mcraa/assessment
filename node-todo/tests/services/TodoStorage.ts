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

        expect(initialized).to.be.eql([true, true]);
        expect(statBefore).to.be.null
        expect(statAfter).to.be.not.null
        expect(errBefore).to.be.not.null
        expect(errAfter).to.be.null
    })

    it("should parse Todos", () => {
        let todos = [] as Todo[]
        let sut = new TodoStorage("");

        let todoFile = Buffer.from(JSON.stringify(todos));

        let res = sut.parseContent<Todo[]>(todoFile);

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

    it("should throw with missing field", async () => {
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

    it("should remove a todo", async () => {        
        let sut = new TodoStorage("noname");
        let saveStub = sandbox.stub(sut, "persistTodos").returns(new Promise((res, _) => { res() }));        
        sandbox.stub(sut, "getTodos").returns(new Promise((res, _) => { res([{ id: "id" } as Todo, { id: "id2" } as Todo ]) }));        

        let err = null;
        try {
            await sut.removeTodo("id");
        } catch (error) {
            
        }

        expect(saveStub.calledOnceWithExactly([{ id: "id2" } as Todo ])).to.be.true
    })

    it("should not remove a not existing todo", async () => {        
        let sut = new TodoStorage("noname");
        let saveStub = sandbox.stub(sut, "persistTodos").returns(new Promise((res, _) => { res() }));        
        sandbox.stub(sut, "getTodos").returns(new Promise((res, _) => { res([{ id: "id" } as Todo ]) }));        

        let err = null;
        try {
            await sut.removeTodo("nope")
        } catch (error) {
            err = error
        }

        expect(err).to.be.not.null
        expect(saveStub.notCalled).to.be.true
    })

    it("should validate a valid todo", () => {
        let sut = new TodoStorage("noneam");

        let validTodo: Todo = { id: "id", text: "hello", done: false, priority: 3 }
        let err = null;
        try {
            sut.validateTodo(validTodo)            
        } catch (error) {
            err = error
        }

        expect(err).to.be.null;
    })

    it("should validate a invalid todo", () => {
        let sut = new TodoStorage("noneam");

        let invalidTodo: Todo = { id: "id", done: false, priority: 3 } as Todo
        let err = null;
        try {
            sut.validateTodo(invalidTodo)            
        } catch (error) {
            err = error
        }

        expect(err).to.be.not.null;
    })

    it("should extend a valid todo", () => {
        let sut = new TodoStorage("noneam");

        let validTodo: Todo = { id: "id", text: "hello" } as Todo
        let err = null;
        try {
            sut.validateTodo(validTodo)            
        } catch (error) {
            err = error
        }

        expect(err).to.be.null;
    })

    it("should update a valid todo", async () => {        
        let sut = new TodoStorage("noname");
        let saveStub = sandbox.stub(sut, "persistTodos").returns(new Promise((res, _) => { res() }));        
        sandbox.stub(sut, "getTodos").returns(new Promise((res, _) => { res([{ id: "id" } as Todo ]) }));        

        let err = null;
        let res = null;
        try {
            res = await sut.updateTodo("id", { text: "hello" } as Todo)
        } catch (error) {
            err = error
        }

        let expectation: Todo = { id: "id", text: "hello", done: false, priority: 3 }
        expect(err).to.be.null
        expect(saveStub.calledOnceWithExactly([expectation])).to.be.true
        expect(res).to.be.eql(expectation)
    })

    it("should queue a done todo", async () => {    
        let filePath = path.join(__dirname, "todos.json");
        let filePathQue = filePath + '.que'
        tryCleanQue(filePath)
        setupFile(filePathQue, "{}")

        let sut = new TodoStorage(filePath);
        let saveStub = sandbox.stub(sut, "persistTodos").returns(new Promise((res, _) => { res() }));        
        sandbox.stub(sut, "getTodos").returns(new Promise((res, _) => { res([{ id: "id" } as Todo ]) }));        

        let err = null;
        let res = null;
        try {
            res = await sut.updateTodo("id", { text: "hello", done: true } as Todo)
        } catch (error) {
            err = error
        }

        let queue = JSON.parse(fs.readFileSync(filePathQue).toString())

        tryCleanQue(filePath, true)  

        let expectation: Todo = { id: "id", text: "hello", done: true, priority: 3 }
        expect(err).to.be.null
        expect(saveStub.calledOnceWithExactly([expectation])).to.be.true
        expect(queue["id"]).to.be.not.null
    })

    it("should remove undone todo from queue", async () => { 
        let filePath = path.join(__dirname, "todos.json");
        let filePathQue = filePath + '.que'
        tryCleanQue(filePath);
        setupFile(filePathQue, "{}")

        let sut = new TodoStorage(filePath);
        let saveStub = sandbox.stub(sut, "persistTodos").returns(new Promise((res, _) => { res() }));        
        sandbox.stub(sut, "getTodos").returns(new Promise((res, _) => { res([{ id: "id" } as Todo ]) }));        

        let err = null;
        let res = null;
        try {
            res = await sut.updateTodo("id", { text: "hello", done: true } as Todo)
            res = await sut.updateTodo("id", { text: "hello", done: false } as Todo)
        } catch (error) {
            err = error
        }

        let queue = JSON.parse(fs.readFileSync(filePathQue).toString())
        tryCleanQue(filePath, true)  

        expect(err).to.be.null
        expect(saveStub.calledTwice).to.be.true
        expect(queue["id"]).to.be.undefined
    })

    it("should not show expired todos", async () => {  
        let filePath = path.join(__dirname, "todos.json");
        let filePathQue = filePath + '.que'
        tryCleanAll(filePath)
        setupFile(filePath, [{ id: "id", done: true}]);
        setupFile(filePathQue, { id: Date.now() - 200 });

        let sut = new TodoStorage(filePath);

        let saveStub = sandbox.stub(sut, "persistTodos").returns(new Promise((res, _) => { res() }));            

        let res = await sut.getTodos()
        tryCleanAll(filePath, true)

        expect(res).to.be.eql([])
        expect(saveStub.calledOnceWithExactly([])).to.be.true
    })

    


})

let setupFile = (path: string, content: any) => {
    fs.openSync(path, "w+");
    fs.writeFileSync(path, JSON.stringify(content))
}

let tryCleanAll = (path, raise = false) => {
    tryCleanTodos(path, raise)
    tryCleanQue(path, raise)
}

let tryCleanQue = (path, raise = false) => {
    tryClean(`${path}.que`, raise)
}

let tryCleanTodos = (path, raise = false) => {
    tryClean(`${path}`, raise)
}

let tryClean = (path: string, raise = false) => {
    try {
        fs.unlinkSync(path);  
    } catch (error) {
        if (raise) {
            console.log(`Can't delete ${path}`);        
        }
    }
}