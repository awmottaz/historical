import { expect } from "chai";
import { HMap } from "./HMap";

describe("HMap", function () {
  describe("history API", function () {
    it("remembers set mutations", function () {
      const m = new HMap<number, boolean>();
      const out = m.set(1, true);

      expect(out).eq(m);
      expect(m.history).has.length(1);
      const { action, args, dataBefore, dataAfter } = m.history[0];
      expect(action).eq("set");
      expect(args).deep.eq([1, true]);
      expect(dataBefore).deep.eq([]);
      expect(dataAfter).deep.eq([[1, true]]);
    });

    it("remembers delete mutations", function () {
      const m = new HMap<number, boolean>([
        [1, true],
        [2, true],
        [3, true],
      ]);
      const out = m.delete(2);

      expect(out).true;
      expect(m.history).has.length(1);
      const { action, args, dataBefore, dataAfter } = m.history[0];
      expect(action).eq("delete");
      expect(args).deep.eq([2]);
      expect(dataBefore).deep.eq([
        [1, true],
        [2, true],
        [3, true],
      ]);
      expect(dataAfter).deep.eq([
        [1, true],
        [3, true],
      ]);
    });

    it("remembers clear mutations", function () {
      const m = new HMap<number, boolean>([
        [1, true],
        [2, true],
        [3, true],
      ]);
      m.clear();

      expect(m.history).has.length(1);
      const { action, args, dataBefore, dataAfter } = m.history[0];
      expect(action).eq("clear");
      expect(args).deep.eq([]);
      expect(dataBefore).deep.eq([
        [1, true],
        [2, true],
        [3, true],
      ]);
      expect(dataAfter).deep.eq([]);
    });
  });

  describe("remark chainable API", function () {
    it("remarks on set mutation", function () {
      const m = new HMap<number, boolean>();
      m.remark("test set remark").set(1, true);

      expect(m.history).has.length(1);
      expect(m.history[0].remark).eq("test set remark");
    });

    it("remarks on delete mutation", function () {
      const m = new HMap<number, boolean>([
        [1, true],
        [2, true],
        [3, true],
      ]);
      m.remark("test delete remark").delete(2);

      expect(m.history).has.length(1);
      expect(m.history[0].remark).eq("test delete remark");
    });

    it("remarks on clear mutation", function () {
      const m = new HMap<number, boolean>([
        [1, true],
        [2, true],
        [3, true],
      ]);
      m.remark("test clear remark").clear();

      expect(m.history).has.length(1);
      expect(m.history[0].remark).eq("test clear remark");
    });
  });
});
