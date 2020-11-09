import { expect, should } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { JSDOM } from 'jsdom';


declare var global: any;

const jsdom = new JSDOM(`<span id="test"></span>`, { url: "http://domain.locator/?num=1" });
const window = jsdom.window;

import { DomHandling } from '../scripts/domHandling'

describe('Domhandling', () => {
    const sandbox = sinon.createSandbox()
    afterEach(() => {
        sandbox.restore();
    })

    it('should get query value', () => {
        const handler = new DomHandling(window);

        let result = handler.getQueryVariable("num");

        expect(result).to.be.equal("1");
    });

    it('should try to get element with id #result', () => {
        let spy = sandbox.spy(window.document, 'getElementById');
        const handler = new DomHandling(window);

        handler.setResult("Success");

        expect(spy.calledWithExactly("result")).to.be.true;
    })

    it('should try to get element with id #message', () => {
        let spy = sandbox.spy(window.document, 'getElementById');
        const handler = new DomHandling(window);

        handler.setMessage("Success");

        expect(spy.calledWithExactly("message")).to.be.true;
    })
})