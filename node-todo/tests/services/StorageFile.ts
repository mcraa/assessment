import * as sinon from 'sinon'
import { expect } from 'chai'

import { StorageFile } from '../../src/services/StorageFile'

describe('StorageFile', () => {
    // const sandbox = sinon.createSandbox()
    // afterEach(() => {
    //     sandbox.restore();
    // })

    it('should exist', () => { 
        let sut = new StorageFile();

        expect(sut).to.be.not.null
    })
})