
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
            if (astext.length > 2) {
                result.push(
                    this.getTextsForDigits(this.analyzeDigits(digits.nums[i], digits.bases[i]))
                    + this.getBaseWord(digits.bases[i]));
            } else if (astext.length == 2) {
                if (astext[0] == '1') {
                    result.push(this.teens[parseInt(astext[1])] + this.getBaseWord(digits.bases[i]))
                } else {
                    result.push(this.tens[parseInt(astext[0])] + this.getBaseWord(digits.bases[i]))
                }
            } else {
                if (digits.bases[i] == 10) {
                    if (digits.nums[i] == 1) {
                        result.push(this.teens[digits.nums[i + 1]] + this.getBaseWord(digits.bases[i]))
                        digits.nums[i + 1] = 0;
                    } else {
                        result.push(this.tens[digits.nums[i]] + this.getBaseWord(digits.bases[i]))
                    }
                }
                else {
                    result.push(this.ones[digits.nums[i]] + this.getBaseWord(digits.bases[i]))
                }
            }
        }


        return result;
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

        for (var i = info.nums.length-1; i > 0; --i) {
            if (!separators[i]) {
                if (needsAnd) {
                    if (info.nums[i] > 0) {
                        needsAnd = false
                        separators[i] = " and ";
                    } 
                } else {
                    if (info.nums[i])
                        separators[i] = " ";
                }
            } 
        }
        
        return separators;
    }
}