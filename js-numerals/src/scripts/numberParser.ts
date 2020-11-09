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

        let isNegative = false;
        let result = "";

        if (parsed == 0) return "zero"
        if (parsed < 0) { isNegative = true; parsed = parsed * -1}

        if (numText.length == 4 && numText[1] != '0') {
            result = `${this.addParity(isNegative)}${this.convertProcess(parsed, 100)}`
        } else {
            result = `${this.addParity(isNegative)}${this.convertProcess(parsed, 1000000)}`
        }

        return result.trim()
    }

    addParity(isNegative: boolean) {
        return `${isNegative ? "negative " : ""}`
    }

    convertProcess(num: number, base: number): string {
        let digits = this.analyzeDigits(num, base);
        let parts = this.getTextsForDigits(digits);
        let separators = this.getSeparators(digits);
        return this.concatFragments(parts, separators, digits.bases.length)
    }

    analyzeDigits(num: number, base: number): DigitAnalytics {
        let bases = [];
        let nums = [];
        bases.push(base);
        nums.push(Math.floor(num / base))
        let nextStepBase = this.steps[base] != 0;
        while (nextStepBase) {
            num = num % base;
            base = base / this.steps[base];
            bases.push(base);
            nums.push(Math.floor(num / base));
            nextStepBase = this.steps[base] != 0;
        }

        return { bases, nums }
    }

    getTextsForDigits(digits: DigitAnalytics): string[] {
        let result: string[] = [];        

        for (var i = 0; i < digits.bases.length; ++i) {
            if (digits.nums[i] == 0) { result.push(""); continue; }

            let astext = digits.nums[i].toString()
            if (astext.length > 1) {
                result.push(`${this.convertProcess(digits.nums[i], digits.bases[i])}${this.getBaseWord(digits.bases[i])}`);                
            } else {
                if (digits.bases[i] == 10) {
                    if (digits.nums[i] == 1) {
                        result.push(this.getFragment('teens', digits, i+1, i))
                        digits.nums[i + 1] = 0;
                    } else {
                        result.push(this.getFragment('tens', digits, i))
                    }
                }
                else {
                    result.push(this.getFragment('ones', digits, i))
                }
            }
        }


        return result;
    }

    getFragment(scale: 'ones' | 'tens' | 'teens', digits: DigitAnalytics, numPosition: number, basePosition?: number): string {
        if (!basePosition) basePosition = numPosition;
        
        return `${this[scale][digits.nums[numPosition]]}${this.getBaseWord(digits.bases[basePosition])}`
    }

    getBaseWord(base: number): string {
        let word = this.words[base];
        if (!word) word = "";
        return word;
    }

    getSeparators(info: DigitAnalytics): string[] {
        let needsAnd = info.nums.filter(v => v > 0 ).length > 1;
        if (needsAnd) {
            let copy = [...info.nums]
            copy.pop()
            copy.pop()
            needsAnd = copy.filter(v => v > 0).length > 0
        }

        let separators: string[] = [];
        if (info.nums[info.nums.length-1] > 0 && info.nums[info.nums.length-2] > 1) {
            separators[info.nums.length-1] = "-";
        }

        for (var i = info.nums.length-1; i >= 0; --i) {
            if (!separators[i]) {
                if (needsAnd) {
                    if (info.nums[i] > 0) {
                        needsAnd = false
                        separators[i] = " and ";
                    } 
                } else {
                    if (info.nums[i]) {
                        separators[i] = " ";
                    } else {
                        separators[i] = ""
                    }
                }
            } 
        }
        
        return separators;
    }

    concatFragments(fragments: string[], separators: string[], count: number): string {        
        let result = "";        
        
        for (var i = 0; i < count; ++i) {
            if (fragments[i] && fragments[i].length){
                result = `${result}${separators[i]}${fragments[i]}`
            }   
        }

        return result.trim();
    }
}