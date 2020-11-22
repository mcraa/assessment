import 'mocha'
import * as sinon from 'sinon'
import { expect } from 'chai'
import { TodoController } from '../../src/controllers/TodoController'
var express = require('express')

describe("TodoController", () => {
    const sandbox = sinon.createSandbox()
    afterEach(() => {
        sandbox.restore();
    })

    it("should mount get route", () => {
        let router = express.Router()
        let spy = sandbox.spy(router, "get")

        let sut = new TodoController(router);

        expect(spy.calledOnce).to.be.true
    })
})