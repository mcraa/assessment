import { expect } from 'chai';
import 'mocha';
import { JSDOM } from 'jsdom';


declare var global: any;
const window = new JSDOM("").window;
const document = window.document;
global.window = window;
global.document = document;

import { DomHandling } from '../scripts/domHandling'

describe('Domhandling', () => {  

  it('should get query value', () => {
    const handler = new DomHandling();

    handler.getQueryVariable("num");

    expect(handler).to.be.not.null;
  });
})