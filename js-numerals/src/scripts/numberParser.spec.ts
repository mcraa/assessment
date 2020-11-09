import { expect } from 'chai';
import 'mocha';


import { NumberParser } from '../scripts/numberParser'

describe('NumberParser', () => {

    it('should return text', () => {
        const parser = new NumberParser();

        let result = parser.convertToText("7")

        expect(result).to.be.equal("seven");
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

    it('should get text for the multiple digits', () => {
        const parser = new NumberParser();

        let digits = { bases: [1000,100,10,1], nums: [115,0,0,0]}
        let texts = parser.getTextsForDigits(digits)

        expect(texts).to.be.eql(["one hundred and fifteen thousand", "", "", ""])
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

    it('should create the separators with and', () => {
        const parser = new NumberParser();

        let digits = { bases: [1000,100,10,1], nums: [1,1,0,1]}
        let separators = parser.getSeparators(digits);

        expect(separators).to.eql([ " ", " ", "", " and "])
    });

    it('should create the separators without and', () => {
        const parser = new NumberParser();

        let digits = { bases: [1000,100,10,1], nums: [0,1,0,0]}
        let separators = parser.getSeparators(digits);

        expect(separators).to.eql([ "", " ","","" ])
    })

    it('should create the separators with dash', () => {
        const parser = new NumberParser();

        let digits = { bases: [1000,100,10,1], nums: [0,0,4,2]}
        let separators = parser.getSeparators(digits);

        expect(separators).to.eql([ "",""," ","-" ])
    })

    it('should create the separators with dash and and', () => {
        const parser = new NumberParser();

        let digits = { bases: [1000,100,10,1], nums: [1,0,4,2]}
        let separators = parser.getSeparators(digits);

        expect(separators).to.eql([ " ", ""," and ","-" ])
    })

    it('should join the parts with separator', () => {
        const parser = new NumberParser();

        let separators = [ "",""," and ","-" ];
        let parts = ["one thousand", "", "fourty", "two"]
        let result = parser.concatFragments(parts, separators)

        expect(result).to.eql("one thousand and fourty-two")
    })



})