import 'mocha'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { TodoController } from '../../src/controllers/TodoController'
import { TodoStorage } from '../../src/services/TodoStorage'
var express = require('express')

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

        expect(spy.calledOnce).to.be.true
    })
})