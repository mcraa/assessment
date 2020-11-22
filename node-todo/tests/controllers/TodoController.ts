import 'mocha'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { TodoController } from '../../src/controllers/TodoController'
import { TodoStorage } from '../../src/services/TodoStorage'
var express = require('express')
import { Request, Response } from 'express'

describe("TodoController", () => {
    const sandbox = sinon.createSandbox()
    afterEach(() => {
        sandbox.restore();
    })

    it("should mount get route", () => {
        let router = express.Router()
        let spy = sandbox.spy(router, "get")
        let storage = new TodoStorage("noname.json")
        
        let sut = new TodoController(router, storage);

        expect(spy.called).to.be.true
    })

    it("should retrieve todos", () => {
        let router = express.Router()
        let storage = new TodoStorage("noname.json");
        let spy = sandbox.spy(storage, "getTodos")
        
        let sut = new TodoController(router, storage);
        sut.getTodos({} as Request, {} as Response)

        expect(spy.calledOnce).to.be.true

    })

    it("should retrieve one todo", () => {
        let router = express.Router()
        let storage = new TodoStorage("noname.json");
        let spy = sandbox.spy(storage, "getTodoById")
        let req = { params: {} } as Request
        req.params["id"] = "id" 
        
        let sut = new TodoController(router, storage);
        sut.getOneTodo(req, {} as Response)

        expect(spy.calledOnce).to.be.true
    })

    it("should create one todo", () => {
        let router = express.Router()
        let storage = new TodoStorage("noname.json");
        let spyCreate = sandbox.spy(storage, "createTodo")

        let req = { body: {
            id: "id",
            text: "text",
            priority: 3,
            done: false,
        } } as Request
        
        let sut = new TodoController(router, storage);
        sut.postTodo(req, {} as Response)

        expect(spyCreate.calledOnce).to.be.true
    })

    it("should delete one todo", () => {
        let router = express.Router()
        let storage = new TodoStorage("noname.json");
        let spyDelete = sandbox.spy(storage, "removeTodo")

        let req = { params: {} } as Request
        req.params["id"] = "id" 
        
        let sut = new TodoController(router, storage);
        sut.deleteTodo(req, {} as Response)

        expect(spyDelete.calledOnceWithExactly("id")).to.be.true
    })
})