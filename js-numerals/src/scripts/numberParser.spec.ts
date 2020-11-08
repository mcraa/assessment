import { expect } from 'chai';
import 'mocha';


import { NumberParser } from '../scripts/numberParser'

describe('NumberParser', () => {

    it('should return text', () => {
        const parser = new NumberParser();

        let result = parser.convertToText("7")

        expect(result).to.be.equal("7");
    });
})