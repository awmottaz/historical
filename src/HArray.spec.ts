import { expect } from "chai";
import { HArray } from "./HArray";

describe("HArray history API", function () {
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
