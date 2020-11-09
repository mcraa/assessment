import { DomHandling } from './domHandling';
import { NumberParser } from './numberParser'

export class App {

    constructor(
        private domHandling: DomHandling,
        private numberParser: NumberParser
    ) { }

    handleNumberParsing() {
        let num = this.domHandling.getQueryVariable("num")

        if (num && num.length) {
            let text = this.numberParser.convertToText(num)
            if (text && text.length) {
                this.domHandling.setInputValue(num);
                this.domHandling.setResult(text);
            } else {
                this.displayError()
            }
        }
    }

    onTyped(event: KeyboardEvent) {        
        if (event.keyCode < 47 || event.keyCode > 57) { // number keys
            if (event.key != 'Backspace' && event.key != 'Enter' && event.key != '-') {
                this.displayError()
            }
        }
    }

    displayError() {
        this.domHandling.setMessage("Only integers please.");
        setTimeout(() => {
            this.domHandling.setMessage("");
        }, 5000);
    }
}

export const appFactory = () => new App(new DomHandling(window), new NumberParser())