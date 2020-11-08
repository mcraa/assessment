
import { DomHandling } from './domHandling'

export class App {

    constructor(
        private domHandling: DomHandling
    ) { }

    handleNumberParsing() {
        let val = ""
        let num = this.domHandling.getQueryVariable("num")
        
        if (num) {
            let resultSpan = document.getElementById("result");
            if (resultSpan) {
                resultSpan.innerHTML = num;
            }
        }
    }

    
}

window.onload = () => new App(new DomHandling()).handleNumberParsing()