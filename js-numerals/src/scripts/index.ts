
import { DomHandling } from './domHandling'

export class App {

    constructor(
        private domHandling: DomHandling
    ) { }

    handleNumberParsing() {
        let num = this.domHandling.getQueryVariable("num")
        
        if (num) {
            this.domHandling.setResult(num);
        }
    }

    
}

window.onload = () => new App(new DomHandling(window)).handleNumberParsing()