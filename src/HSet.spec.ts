import { expect } from "chai";
import { HSet } from "./HSet";

describe("HSet history API", function () {
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
