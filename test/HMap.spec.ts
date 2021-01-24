import { expect } from 'chai'
import { HMap } from '../src/HMap'

describe('HMap', function () {
  describe('history API', function () {
    it('remembers set mutations', function () {
      const m = new HMap<number, boolean>()
      const out = m.set(1, true)

      expect(out).to.equal(m)
      expect(m.history).to.have.length(1)
      expect(m.history[0]).to.deep.include({
        action: 'set',
        args: [1, true],
        dataBefore: [],
        dataAfter: [[1, true]]
      })
    })

    it('remembers delete mutations', function () {
      const m = new HMap<number, boolean>([
        [1, true],
        [2, true],
        [3, true]
      ])
      const out = m.delete(2)

      expect(out).to.equal(true)
      expect(m.history).to.have.length(1)
      expect(m.history[0]).to.deep.include({
        action: 'delete',
        args: [2],
        dataBefore: [
          [1, true],
          [2, true],
          [3, true]
        ],
        dataAfter: [
          [1, true],
          [3, true]
        ]
      })
    })

    it('remembers clear mutations', function () {
      const m = new HMap<number, boolean>([
        [1, true],
        [2, true],
        [3, true]
      ])
      m.clear()

      expect(m.history).to.have.length(1)
      expect(m.history[0]).to.deep.include({
        action: 'clear',
        args: [],
        dataBefore: [
          [1, true],
          [2, true],
          [3, true]
        ],
        dataAfter: []
      })
    })
  })

  describe('remark API', function () {
    it('remarks on set mutation', function () {
      const m = new HMap<number, boolean>()
      m.remark('test set remark').set(1, true)

      expect(m.history).to.have.length(1)
      expect(m.history[0]).to.have.property('remark', 'test set remark')
    })

    it('remarks on delete mutation', function () {
      const m = new HMap<number, boolean>([
        [1, true],
        [2, true],
        [3, true]
      ])
      m.remark('test delete remark').delete(2)

      expect(m.history).to.have.length(1)
      expect(m.history[0]).to.have.property('remark', 'test delete remark')
    })

    it('remarks on clear mutation', function () {
      const m = new HMap<number, boolean>([
        [1, true],
        [2, true],
        [3, true]
      ])
      m.remark('test clear remark').clear()

      expect(m.history).to.have.length(1)
      expect(m.history[0]).to.have.property('remark', 'test clear remark')
    })

    it('only remarks on the next mutation', function () {
      const m = new HMap<number, boolean>()
      m.set(1, true)
      m.remark('only the second set').set(2, true)
      m.set(3, true)

      expect(m.history).to.have.length(3)
      expect(m.history[0]).to.have.property('remark', null)
      expect(m.history[1]).to.have.property('remark', 'only the second set')
      expect(m.history[2]).to.have.property('remark', null)
    })
  })
})
