import { expect } from "chai";
import { HArray } from "./HArray";

describe("HArray", function () {
  describe("history API", function () {
    it("returns an HArray from static 'from' method", function () {
      const a = HArray.from([1, 2, 3]);
      expect(a).instanceOf(HArray);
    });

    it("returns an HArray from static 'of' method", function () {
      const a = HArray.of(1, 2, 3);
      expect(a).instanceOf(HArray);
    });

    it("static method 'isArray' returns true for regular arrays", function () {
      const a = [1, 2, 3];
      expect(HArray.isArray(a)).eq(true);
    });

    it("static method 'isArray' returns true for HArrays", function () {
      const a = HArray.from([1, 2, 3]);
      expect(HArray.isArray(a)).eq(true);
    });

    it("static method 'isHArray' returns false for regular arrays", function () {
      const a = [1, 2, 3];
      expect(HArray.isHArray(a)).eq(false);
    });

    it("static method 'isHArray' returns true for HArrays", function () {
      const a = HArray.from([1, 2, 3]);
      expect(HArray.isHArray(a)).eq(true);
    });

    it("remembers copyWithin mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.copyWithin(1, 0, 3);

      expect(out).eq(a);
      expect(a.history).to.have.length(1);
      const { action, args, dataBefore, dataAfter } = a.history[0];
      expect(action).eq("copyWithin");
      expect(args).deep.eq([1, 0, 3]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([1, 1, 2, 3, 5]);
    });

    it("remembers fill mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.fill(0, 1, 3);

      expect(out).eq(a);
      expect(a.history).to.have.length(1);
      const { action, args, dataBefore, dataAfter } = a.history[0];
      expect(action).eq("fill");
      expect(args).deep.eq([0, 1, 3]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([1, 0, 0, 4, 5]);
    });

    it("remembers pop mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.pop();

      expect(out).eq(5);
      expect(a.history).to.have.length(1);
      const { action, args, dataBefore, dataAfter } = a.history[0];
      expect(action).eq("pop");
      expect(args).deep.eq([]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([1, 2, 3, 4]);
    });

    it("remembers push mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.push(6, 7, 8);

      expect(out).eq(8);
      expect(a.history).to.have.length(1);
      const { action, args, dataBefore, dataAfter } = a.history[0];
      expect(action).eq("push");
      expect(args).deep.eq([6, 7, 8]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("remembers reverse mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.reverse();

      expect(out).deep.eq([5, 4, 3, 2, 1]);
      expect(out).eq(a);
      expect(a.history).to.have.length(1);
      const { action, args, dataBefore, dataAfter } = a.history[0];
      expect(action).eq("reverse");
      expect(args).deep.eq([]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([5, 4, 3, 2, 1]);
    });

    it("remembers shift mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.shift();

      expect(out).eq(1);
      expect(a.history).to.have.length(1);
      const { action, args, dataBefore, dataAfter } = a.history[0];
      expect(action).eq("shift");
      expect(args).deep.eq([]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([2, 3, 4, 5]);
    });

    it("remembers sort mutations", function () {
      const a = HArray.from([3, 2, 5, 1, 4]);
      const out = a.sort();

      expect(out).eq(a);
      expect(a.history).to.have.length(1);
      const { action, args, dataBefore, dataAfter } = a.history[0];
      expect(action).eq("sort");
      expect(args).deep.eq([]);
      expect(dataBefore).deep.eq([3, 2, 5, 1, 4]);
      expect(dataAfter).deep.eq([1, 2, 3, 4, 5]);
    });

    it("remembers splice mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.splice(1, 2, 6, 7);

      expect(out).deep.eq([2, 3]);
      expect(a.history).to.have.length(1);
      const { action, args, dataBefore, dataAfter } = a.history[0];
      expect(action).eq("splice");
      expect(args).deep.eq([1, 2, 6, 7]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([1, 6, 7, 4, 5]);
    });

    it("remembers unshift mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      const out = a.unshift(-2, -1, 0);

      expect(out).eq(8);
      expect(a.history).to.have.length(1);
      const { action, args, dataBefore, dataAfter } = a.history[0];
      expect(action).eq("unshift");
      expect(args).deep.eq([-2, -1, 0]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([-2, -1, 0, 1, 2, 3, 4, 5]);
    });
  });

  describe("remark chainable API", function () {
    it("remarks on copyWithin mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test copyWithin remark").copyWithin(1, 0, 3);

      expect(a.history).has.length(1);
      expect(a.history[0].remark).eq("test copyWithin remark");
    });

    it("remarks on fill mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test fill remark").fill(0, 1, 3);

      expect(a.history).has.length(1);
      expect(a.history[0].remark).eq("test fill remark");
    });

    it("remarks on pop mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test pop remark").pop();

      expect(a.history).has.length(1);
      expect(a.history[0].remark).eq("test pop remark");
    });

    it("remarks on push mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test push remark").push(6);

      expect(a.history).has.length(1);
      expect(a.history[0].remark).eq("test push remark");
    });

    it("remarks on reverse mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test reverse remark").reverse();

      expect(a.history).has.length(1);
      expect(a.history[0].remark).eq("test reverse remark");
    });

    it("remarks on shift mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test shift remark").shift();

      expect(a.history).has.length(1);
      expect(a.history[0].remark).eq("test shift remark");
    });

    it("remarks on sort mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test sort remark").sort();

      expect(a.history).has.length(1);
      expect(a.history[0].remark).eq("test sort remark");
    });

    it("remarks on splice mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test splice remark").splice(1, 2, 6, 7);

      expect(a.history).has.length(1);
      expect(a.history[0].remark).eq("test splice remark");
    });

    it("remarks on unshift mutations", function () {
      const a = HArray.from([1, 2, 3, 4, 5]);
      a.remark("test unshift remark").unshift(0);

      expect(a.history).has.length(1);
      expect(a.history[0].remark).eq("test unshift remark");
    });

    it("only remarks on the next mutation", function () {
      const m = new HArray<number>();
      m.push(1);
      m.remark("only the second push").push(2);
      m.push(3);

      expect(m.history).has.length(3);
      expect(m.history[0].remark).eq(null);
      expect(m.history[1].remark).eq("only the second push");
      expect(m.history[2].remark).eq(null);
    });
  });
});
