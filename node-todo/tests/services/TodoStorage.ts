import * as sinon from 'sinon'
import { expect } from 'chai'

import { TodoStorage } from '../../src/services/TodoStorage'

describe('TodoStorage', () => {
    // const sandbox = sinon.createSandbox()
    // afterEach(() => {
    //     sandbox.restore();
    // })

    it('should exist', () => { 
        let sut = new TodoStorage("");

        expect(sut).to.be.not.null
    })
})