
export class NumberParser {
    convertToText(num: string): string {
        let parsed = parseInt(num);
        if (isNaN(parsed)) {
            return "";
        }
        
        return num;
    }
}