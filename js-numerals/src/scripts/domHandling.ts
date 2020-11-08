import { DOMWindow } from "jsdom";

export class DomHandling {

    constructor(private window: Window | DOMWindow) {}

    getQueryVariable(variable: string): string | undefined {
        var query = this.window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }

        return (undefined);
    }

    setInputValue(value: string) {
        let element = this.window.document.getElementById('inputtext') as HTMLInputElement;
        if (element) {
            element.value =  value;
        }
    }

    setResult(text: string) {
        let resultSpan = this.window.document.getElementById("result");
        if (resultSpan) {
            resultSpan.innerHTML = text;
        }
    }

}