
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
}