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
    })
})