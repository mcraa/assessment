import { expect } from 'chai';
import 'mocha';
import { JSDOM } from 'jsdom';


declare var global: any;
const window = new JSDOM("").window;
const document = window.document;
global.window = window;
global.document = document;

import { App } from '../scripts/index'
import { DomHandling } from '../scripts/domHandling'

describe('App', () => {  

  it('should get a number', () => {
    const app = new App(new DomHandling(window));

    app.handleNumberParsing();

    expect(app).to.be.not.null;
  });
})