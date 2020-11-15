import { expect } from "chai";
import { HMap } from "./HMap";

describe("HMap history API", function () {
  it("remembers set mutations", function () {
    const m = new HMap<number, boolean>();
    m.set(0, true);
    m.set(1, true);
    m.set(2, true);

    expect(m.history).has.length(3);

    m.history.forEach(({ action, args }, i) => {
      expect(action).eq("set");
      expect(args).deep.eq([i, true]);
    });

    expect(m.history[2]).has.deep.property("dataAfter", [
      [0, true],
      [1, true],
      [2, true],
    ]);
  });

  it("remembers delete mutations", function () {
    const m = new HMap<number, boolean>();
    m.set(0, true);
    m.set(1, true);
    m.set(2, true);
    m.delete(1);

    expect(m.history).has.length(4);

    const { action, args, dataAfter } = m.history[3];

    expect(action).eq("delete");
    expect(args).deep.eq([1]);
    expect(dataAfter).deep.eq([
      [0, true],
      [2, true],
    ]);
  });

  it("remembers clear mutations", function () {
    const m = new HMap<number, boolean>();
    m.set(0, true);
    m.set(1, true);
    m.set(2, true);
    m.clear();

    expect(m.history).has.length(4);

    const { action, args, dataBefore, dataAfter } = m.history[3];

    expect(action).eq("clear");
    expect(args).deep.eq([]);
    expect(dataBefore).deep.eq([
      [0, true],
      [1, true],
      [2, true],
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
