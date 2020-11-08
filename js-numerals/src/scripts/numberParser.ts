
export interface DigitAnalytics {
    bases: number[];
    nums: number[];
}

export class NumberParser {

    ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    steps: { [index: number]: number } = {
        1000000: 1000,
        1000: 10,
        100: 10,
        10: 10,
        1: 0
    }

    words: { [index: number]: string } = {
        1000000: " million",
        1000: " thousand",
        100: " hundred"
    }

    convertToText(numText: string): string {
        let parsed = parseInt(numText);
        if (isNaN(parsed)) {
            return "";
        }

        return numText;
    }

    analyzeDigits(num: number, base: number): DigitAnalytics {
        let bases = [];        
        let nums = [];
        bases.push(base);
        nums.push(Math.floor(num / base))
        let nextStepBase = this.steps[base] != 0;
        while(nextStepBase) {            
            num = num % base;
            base = base / this.steps[base];
            bases.push(base);
            nums.push(Math.floor(num / base));
            nextStepBase = this.steps[base] != 0;
        }
        
        return { bases, nums }
    }

    sayDigitAnalisys(digits: DigitAnalytics): string {
        let result = "";

        for (var i = 0; i < digits.bases.length; ++i) {
            if (digits.nums[i] == 0) { continue; }

            let astext = digits.nums[i].toString()            
            if (astext.length > 2) {
                result = result.concat(this.sayDigitAnalisys(this.analyzeDigits(digits.nums[i], digits.bases[i])) + this.words[digits.bases[i]]);
            } else if (astext.length == 2) {   
                if (astext[0] == '1'){
                    result = result.concat(this.teens[parseInt(astext[1])] + this.words[digits.bases[i]])
                } else {
                    result = result.concat(this.tens[parseInt(astext[0])] + this.words[digits.bases[i]])
                }
            } else {
                if (digits.bases[i] == 10) {
                    if (digits.nums[i] == 1) {
                        result = result.concat(this.teens[digits.nums[i+1]] +this.words[digits.bases[i]])
                        digits.nums[i+1] = 0;
                    } else {
                        result = result.concat(this.tens[digits.nums[i]] +this.words[digits.bases[i]])
                    }
                }
                else {
                    result = result.concat(this.ones[digits.nums[i]] + this.words[digits.bases[i]])
                }
            }
        }

        return result;
    }
}