import { expect } from 'chai'
import { HMap } from './HMap'

describe('HMap history API', () => {
    it('remembers set mutations', () => {
        const m = new HMap<number, boolean>();
        m.set(0, true);
        m.set(1, true);
        m.set(2, true);

        expect(m.history).has.length(3)

        m.history.forEach((h, i) => {
            expect(h).has.property('action', 'set')
            expect(h).has.deep.property('args', [i, true])
        });

        expect(m.history[2]).has.deep.property('dataAfter', [
            [0, true],
            [1, true],
            [2, true],
        ])
    })


    it('remembers delete mutations', () => {
        const m = new HMap<number, boolean>();
        m.set(0, true);
        m.set(1, true);
        m.set(2, true);
        m.delete(1)

        expect(m.history).has.length(4)

        const { action, args, dataAfter} = m.history[3]

        expect(action).eq('delete')
        expect(args).deep.eq([1])
        expect(dataAfter).deep.eq([
            [0, true],
            [2, true]
        ])
    })


    it('remembers clear mutations', () => {
        const m = new HMap<number, boolean>();
        m.set(0, true);
        m.set(1, true);
        m.set(2, true);
        m.clear();

        expect(m.history).has.length(4)

        const { action, args, dataBefore, dataAfter} = m.history[3]

        expect(action).eq('clear')
        expect(args).deep.eq([])
        expect(dataBefore).deep.eq([
            [0, true],
            [1, true],
            [2, true],
        ])
        expect(dataAfter).deep.eq([])
    })
})
