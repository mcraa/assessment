import * as sinon from 'sinon'
import { expect } from 'chai'
import { App } from '../src/App'
var express = require('express')

describe('App', () => {
    const sandbox = sinon.createSandbox()
    afterEach(() => {
        sandbox.restore();
    })

    it('should register routes', () => {
        let expr = express()
        let spy = sandbox.spy(expr, "use");
        let router = express.Router();

        let sut = new App(expr, "1212");
        sut.mountRoutes("path", router);

        expect(spy.calledOnceWithExactly("path", router)).to.be.true
    })

    it('should start server', () => {
        let expr = express()
        let spy = sandbox.spy(expr, "listen");

        let sut = new App(expr, "1212");
        let server = sut.start()
        server.close();

        expect(spy.calledOnce).to.be.true
    })
})