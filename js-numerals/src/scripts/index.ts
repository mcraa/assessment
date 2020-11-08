import '../styles/style.scss';

import { DomHandling } from './domHandling';
import { NumberParser } from './numberParser'

export class App {

    constructor(
        private domHandling: DomHandling,
        private numberParser: NumberParser
    ) { }

    handleNumberParsing() {
        let num = this.domHandling.getQueryVariable("num")
        
        if (num) {
            let text = this.numberParser.convertToText(num)
            this.domHandling.setInputValue(num);
            this.domHandling.setResult(text);
        }
    }    
}

window.onload = () => new App(new DomHandling(window), new NumberParser()).handleNumberParsing()