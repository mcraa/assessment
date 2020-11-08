
export class App {
    handleNumberParsing() {
        let val = ""
        let num = this.getQueryVariable("num")
        
        if (num) {
            let resultSpan = document.getElementById("result");
            if (resultSpan) {
                resultSpan.innerHTML = num;
            }
        }
        console.log(num);
    }

    getQueryVariable(variable: string): string | undefined {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }

        return (undefined);
    }
}

window.onload = () => new App().handleNumberParsing()