import { expect } from "chai";
import { HSet } from "./HSet";

describe("HSet", function () {
  describe("history API", function () {
    it("remembers add mutations", function () {
      const s = new HSet<number>();
      const out = s.add(1);

      expect(out).eq(s);
      expect(s.history).has.length(1);
      const { action, args, dataBefore, dataAfter } = s.history[0];
      expect(action).eq("add");
      expect(args).deep.eq([1]);
      expect(dataBefore).deep.eq([]);
      expect(dataAfter).deep.eq([1]);
    });

    it("remembers clear mutations", function () {
      const s = new HSet<number>([1, 2, 3, 4, 5]);
      s.clear();

      expect(s.history).has.length(1);
      const { action, args, dataBefore, dataAfter } = s.history[0];
      expect(action).eq("clear");
      expect(args).deep.eq([]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([]);
    });

    it("remembers delete mutations", function () {
      const s = new HSet<number>([1, 2, 3, 4, 5]);
      const out = s.delete(3);

      expect(out).true;
      expect(s.history).has.length(1);
      const { action, args, dataBefore, dataAfter } = s.history[0];
      expect(action).eq("delete");
      expect(args).deep.eq([3]);
      expect(dataBefore).deep.eq([1, 2, 3, 4, 5]);
      expect(dataAfter).deep.eq([1, 2, 4, 5]);
    });
  });

  describe("remark chainable API", function () {
    it("remarks on add mutations", function () {
      const s = new HSet<number>();
      s.remark("test add remark").add(1);

      expect(s.history).has.length(1);
      expect(s.history[0].remark).eq("test add remark");
    });

    it("remarks on clear mutations", function () {
      const s = new HSet<number>([1, 2, 3, 4, 5]);
      s.remark("test clear remark").clear();

      expect(s.history).has.length(1);
      expect(s.history[0].remark).eq("test clear remark");
    });

    it("remarks on delete mutations", function () {
      const s = new HSet<number>([1, 2, 3, 4, 5]);
      s.remark("test delete remark").delete(3);

      expect(s.history).has.length(1);
      expect(s.history[0].remark).eq("test delete remark");
    });

    it("only remarks on the next mutation", function () {
      const m = new HSet<number>();
      m.add(1);
      m.remark("only the second add").add(2);
      m.add(3);

      expect(m.history).has.length(3);
      expect(m.history[0].remark).eq(null);
      expect(m.history[1].remark).eq("only the second add");
      expect(m.history[2].remark).eq(null);
    });
  });
});
