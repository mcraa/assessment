import { expect } from 'chai';
import 'mocha';
import { JSDOM } from 'jsdom';
import * as sinon from 'sinon';

declare var global: any;

const jsdom = new JSDOM(`<span id="test"></span>`, { url: "http://domain.locator/?num=1" });
const window = jsdom.window;
global.window = window

import { App, appFactory } from '../scripts/app'
import { DomHandling } from '../scripts/domHandling'
import { NumberParser } from './numberParser'

describe('App', () => {  
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.reset();
  })

  it('should exist', () => {
    const app = new App(new DomHandling(window), new NumberParser());

    app.handleNumberParsing();

    expect(app).to.be.not.null;
  });

  it('should create instance', () => {
    const app = appFactory()

    app.handleNumberParsing();

    expect(app).to.be.not.null;
  });

  it('should display an error if not number', () => {
    let handler = new DomHandling(window);
    let parser = new NumberParser()

    let getQuery = sinon.fake.returns('hello');
    sinon.replace(handler, 'getQueryVariable', getQuery);
    let setResult = sinon.fake()
    sinon.replace(handler, 'setResult', setResult);
    let convertToText = sinon.fake.returns("")
    sinon.replace(parser, 'convertToText', convertToText);
    
    const app = new App(handler, parser);
    let displayError = sinon.spy(app, 'displayError');

    app.handleNumberParsing();

    expect(setResult.notCalled).to.be.true;
    expect(convertToText.calledOnce).to.be.true;
    expect(displayError.calledOnce).to.be.true;
  });

  it('should display convert if a number', () => {
    let handler = new DomHandling(window);
    let parser = new NumberParser()

    let getQuery = sinon.fake.returns('12');
    sinon.replace(handler, 'getQueryVariable', getQuery);
    let setResult = sinon.fake()
    sinon.replace(handler, 'setResult', setResult);
    let convertToText = sinon.fake.returns("twelve")
    sinon.replace(parser, 'convertToText', convertToText);
    
    const app = new App(handler, parser);
    let displayError = sinon.spy(app, 'displayError');

    app.handleNumberParsing();

    expect(setResult.calledOnceWith("twelve")).to.be.true;
    expect(convertToText.calledOnceWith("12")).to.be.true;
    expect(displayError.notCalled).to.be.true;
  });

  it('should display message on typo', () => {
    let handler = new DomHandling(window);
    let parser = new NumberParser()
    
    const app = new App(handler, parser);
    let displayError = sinon.spy(app, 'displayError');

    let typoEvent: any = { keyCode: 100 };
    app.onTyped(typoEvent);

    expect(displayError.calledOnce).to.be.true;
  });

  it('should not display message on correct key', () => {
    let handler = new DomHandling(window);
    let parser = new NumberParser()
    
    const app = new App(handler, parser);
    let displayError = sinon.spy(app, 'displayError');

    let backEvent: any = { keyCode: 100, key: 'Backspace' };
    let enterEvent: any = { keyCode: 100, key: 'Enter' };
    let dashEvent: any = { keyCode: 100, key: '-' };
    let numEvent: any = { keyCode: 49, key: '1' };
    app.onTyped(backEvent);
    app.onTyped(enterEvent);
    app.onTyped(dashEvent);
    app.onTyped(numEvent);

    expect(displayError.notCalled).to.be.true;
  });


})