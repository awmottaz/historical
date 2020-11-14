import { expect } from 'chai'
import { HMap } from './HMap'

describe('HMap', () => {
    it('sets values', () => {
        const m = new HMap<string, boolean>();
        m.set('foo', true);
        expect(Array.from(m.entries())).deep.equals([['foo', true]])
    })
})
