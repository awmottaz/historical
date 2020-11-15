import { expect } from "chai";
import { HMap } from "./HMap";

describe("HMap history API", function () {
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

  it("captures remarks about mutations", function () {
    const m = new HMap<number, boolean>();

    m.set(0, true, "set operation");
    m.delete(0, "delete operation");
    m.clear("clear operation");

    expect(m.history).to.have.length(3);
    expect(m.history[0].remark).to.eq("set operation");
    expect(m.history[1].remark).to.eq("delete operation");
    expect(m.history[2].remark).to.eq("clear operation");
  });
});
