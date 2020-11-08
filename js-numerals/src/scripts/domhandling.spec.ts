import { expect } from 'chai';
import 'mocha';
import { JSDOM } from 'jsdom';


declare var global: any;

const jsdom = new JSDOM("", { url: "http://domain.locator/?num=1" });
const window = jsdom.window;

import { DomHandling } from '../scripts/domHandling'

describe('Domhandling', () => {

    it('should get query value', () => {
        const handler = new DomHandling(window);

        let result = handler.getQueryVariable("num");

        expect(result).to.be.equal("1");
    });
})