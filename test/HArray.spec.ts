import { expect } from "chai";
import { HArray } from "../src/HArray";

describe("HArray", function() {
  describe("methods", function() {
    it('returns as HArray from static "from" method', function() {
      const a = HArray.from([1, 2, 3]);
      expect(a).instanceof(HArray);
    });

    it('returns an HArray from static "of" method', function() {
      const a = HArray.of(1, 2, 3);
      expect(a).instanceof(HArray);
    });

    it('static method "isArray" returns true for regular arrays', function() {
      const a = [1, 2, 3];
      expect(HArray.isArray(a)).to.be.true;
    });

    it('static method "isArray" returns true for HArrays', function() {
      const a = HArray.from([1, 2, 3]);
      expect(HArray.isArray(a)).to.be.true;
    });

    it('static method "isHArray" returns false for regular arrays', function() {
      const a = [1, 2, 3];
      expect(HArray.isHArray(a)).to.be.false;
    });

    it('static method "isHArray" returns true for HArrays', function() {
      const a = HArray.from([1, 2, 3]);
      expect(HArray.isHArray(a)).to.be.true;
    });
  });

  describe("history API", function() {
    it("remembers copyWithin mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.copyWithin(1, 0, 3);

      expect(out).to.equal(a);
      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.deep.include({
        action: "copyWithin",
        args: [1, 0, 3],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: [1, 1, 2, 3, 5],
      });
    });

    it("remembers fill mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.fill(0, 1, 3);

      expect(out).to.equal(a);
      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.deep.include({
        action: "fill",
        args: [0, 1, 3],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: [1, 0, 0, 4, 5],
      });
    });

    it("remembers pop mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.pop();

      expect(out).to.equal(5);
      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.deep.include({
        action: "pop",
        args: [],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: [1, 2, 3, 4],
      });
    });

    it("remembers push mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.push(6, 7, 8);

      expect(out).to.equal(8);
      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.deep.include({
        action: "push",
        args: [6, 7, 8],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: [1, 2, 3, 4, 5, 6, 7, 8],
      });
    });

    it("remembers reverse mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.reverse();

      expect(out).to.deep.equal([5, 4, 3, 2, 1]);
      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.deep.include({
        action: "reverse",
        args: [],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: [5, 4, 3, 2, 1],
      });
    });

    it("remembers shift mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.shift();

      expect(out).to.equal(1);
      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.deep.include({
        action: "shift",
        args: [],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: [2, 3, 4, 5],
      });
    });

    it("remembers sort mutations", function() {
      const a = HArray.from([3, 2, 5, 1, 4]);
      const out = a.sort();

      expect(out).to.equal(a);
      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.deep.include({
        action: "sort",
        args: [],
        dataBefore: [3, 2, 5, 1, 4],
        dataAfter: [1, 2, 3, 4, 5],
      });
    });

    it("remembers splice mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.splice(1, 2, 6, 7);

      expect(out).to.deep.equal([2, 3]);
      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.deep.include({
        action: "splice",
        args: [1, 2, 6, 7],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: [1, 6, 7, 4, 5],
      });
    });

    it("remembers unshift mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.unshift(-2, -1, 0);

      expect(out).to.equal(8);
      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.deep.include({
        action: "unshift",
        args: [-2, -1, 0],
        dataBefore: [1, 2, 3, 4, 5],
        dataAfter: [-2, -1, 0, 1, 2, 3, 4, 5],
      });
    });
  });

  describe("remark API", function() {
    it("remarks on copyWithin mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test copyWithin remark").copyWithin(1, 0, 3);

      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.have.property("remark", "test copyWithin remark");
    });

    it("remarks on fill mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test fill remark").fill(0, 1, 3);

      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.have.property("remark", "test fill remark");
    });

    it("remarks on pop mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test pop remark").pop();

      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.have.property("remark", "test pop remark");
    });

    it("remarks on push mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test push remark").push(6);

      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.have.property("remark", "test push remark");
    });

    it("remarks on reverse mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test reverse remark").reverse();

      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.have.property("remark", "test reverse remark");
    });

    it("remarks on shift mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test shift remark").shift();

      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.have.property("remark", "test shift remark");
    });

    it("remarks on sort mutations", function() {
      const a = HArray.from([3, 1, 4, 2, 5]);
      a.remark("test sort remark").sort();

      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.have.property("remark", "test sort remark");
    });

    it("remarks on splice mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test splice remark").splice(1, 2, 6, 7);

      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.have.property("remark", "test splice remark");
    });

    it("remarks on unshift mutations", function() {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test unshift remark").unshift(0);

      expect(a.history).to.have.length(1);
      expect(a.history[0]).to.have.property("remark", "test unshift remark");
    });

    it("only remarks on the next mutation", function() {
      const m = new HArray<number>();
      m.push(1);
      m.remark("only the second push").push(2);
      m.push(3);

      expect(m.history).to.have.length(3);
      expect(m.history[0]).to.deep.include({ remark: null });
      expect(m.history[1]).to.deep.include({ remark: "only the second push" });
      expect(m.history[2]).to.deep.include({ remark: null });
    });
  });
});
