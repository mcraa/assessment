import { expect } from 'chai';
import 'mocha';
import { JSDOM } from 'jsdom';


declare var global: any;
const window = new JSDOM("").window;
const document = window.document;
global.window = window;
global.document = document;

import { App } from '../scripts/app'
import { DomHandling } from '../scripts/domHandling'
import { NumberParser } from './numberParser'

describe('App', () => {  

  it('should exist', () => {
    const app = new App(new DomHandling(window), new NumberParser);

    app.handleNumberParsing();

    expect(app).to.be.not.null;
  });
})