
// to dismiss warning
declare var window: any;

export class App {
    handleNumberParsing(selector: string) {
        let val = ""
        let element = document.getElementById(selector) as HTMLInputElement
        if (element) {
            val = element.value
        }
        console.log(val);
    }
}

window.numberHandler = new App()