import { expect } from 'chai';
import 'mocha';


import { NumberParser } from '../scripts/numberParser'

describe('NumberParser', () => {

    it('should return text', () => {
        const parser = new NumberParser();

        let result = parser.convertToText("7")

        expect(result).to.be.equal("7");
    });

    it('should analyze the digits', () => {
        const parser = new NumberParser();

        let analitycs = parser.analyzeDigits(1111,1000);
        let a2 = parser.analyzeDigits(2222, 1000000)

        expect(analitycs.bases).to.eql([1000,100,10,1])
        expect(analitycs.nums).to.eql([1,1,1,1])

        expect(a2.bases).to.eql([1000000,1000,100,10,1])
        expect(a2.nums).to.eql([0,2,2,2,2])
    });

    it('should get text for the digits', () => {
        const parser = new NumberParser();

        let digits = { bases: [1000,100,10,1], nums: [1,1,0,1]}
        let texts = parser.getTextsForDigits(digits)

        expect(texts).to.be.eql(["one thousand", "one hundred", "", "one"])
    })

    it('should get the base word', () => {
        const parser = new NumberParser();

        let million = parser.getBaseWord(1000000);
        let thousand = parser.getBaseWord(1000);
        let hundred = parser.getBaseWord(100);
        let none = parser.getBaseWord(10);

        expect(million).equal(" million");
        expect(thousand).equal(" thousand");
        expect(hundred).equal(" hundred");
        expect(none).equal("");
    })
})