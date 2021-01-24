import { expect } from 'chai'
import { HSet } from '../src/HSet'

describe('HSet', function () {
  describe('history API', function () {
    it('remembers add mutations', function () {
      const s = new HSet<number>()
      const out = s.add(1)

      expect(out).to.equal(s)
      expect(s.history).to.have.length(1)
      expect(s.history[0]).to.deep.include({
        action: 'add',
        args: [1],
        dataBefore: [],
        dataAfter: [1]
      })
    })

    it('remembers clear mutations', function () {
      const s = new HSet<number>([1, 2, 3, 4, 5])
      s.clear()

      expect(s.history).to.have.length(1)
      expect(s.history[0]).to.deep.include({
        action: 'clear',
        args: [],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: []
      })
    })

    it('remembers delete mutations', function () {
      const s = new HSet<number>([1, 2, 3, 4, 5])
      const out = s.delete(3)

      expect(out).to.equal(true)
      expect(s.history).to.have.length(1)
      expect(s.history[0]).to.deep.include({
        action: 'delete',
        args: [3],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: [1, 2, 4, 5]
      })
    })
  })

  describe('remark API', function () {
    it('remarks on add mutations', function () {
      const s = new HSet<number>()
      s.remark('test add remark').add(1)

      expect(s.history).to.have.length(1)
      expect(s.history[0]).to.have.property('remark', 'test add remark')
    })

    it('remarks on clear mutations', function () {
      const s = new HSet<number>([1, 2, 3, 4, 5])
      s.remark('test clear remark').clear()

      expect(s.history).to.have.length(1)
      expect(s.history[0]).to.have.property('remark', 'test clear remark')
    })

    it('remarks on delete mutations', function () {
      const s = new HSet<number>([1, 2, 3, 4, 5])
      s.remark('test delete remark').delete(3)

      expect(s.history).to.have.length(1)
      expect(s.history[0]).to.have.property('remark', 'test delete remark')
    })

    it('only remarks on the next mutation', function () {
      const s = new HSet<number>()
      s.add(1)
      s.remark('only the second add').add(2)
      s.add(3)

      expect(s.history).to.have.length(3)
      expect(s.history[0]).to.have.property('remark', null)
      expect(s.history[1]).to.have.property('remark', 'only the second add')
      expect(s.history[2]).to.have.property('remark', null)
    })
  })
})
