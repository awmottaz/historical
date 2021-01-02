import * as uvu from "uvu";
import * as assert from "uvu/assert";
import { HArray } from "../src/HArray";

const Hist = uvu.suite("history API");

Hist('returns as HArray from static "from" method', () => {
  const a = HArray.from([1, 2, 3]);
  assert.instance(a, HArray);
});

Hist('returns an HArray from static "of" method', () => {
  const a = HArray.of(1, 2, 3);
  assert.instance(a, HArray);
});

Hist('static method "isArray" returns true for regular arrays', () => {
  const a = [1, 2, 3];
  assert.equal(HArray.isArray(a), true);
});

Hist('static method "isArray" returns true for HArrays', () => {
  const a = HArray.from([1, 2, 3]);
  assert.equal(HArray.isArray(a), true);
});

Hist('static method "isHArray" returns false for regular arrays', () => {
  const a = [1, 2, 3];
  assert.equal(HArray.isHArray(a), false);
});

Hist('static method "isHArray" returns true for HArrays', () => {
  const a = HArray.from([1, 2, 3]);
  assert.equal(HArray.isHArray(a), true);
});

Hist("remembers copyWithin mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  const out = a.copyWithin(1, 0, 3);

  assert.is(out, a);
  assert.equal(a.history.length, 1);
  const { action, args, dataBefore, dataAfter } = a.history[0];
  assert.equal(action, "copyWithin");
  assert.equal(args, [1, 0, 3]);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, [1, 1, 2, 3, 5]);
});

Hist("remembers fill mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  const out = a.fill(0, 1, 3);

  assert.is(out, a);
  assert.equal(a.history.length, 1);
  const { action, args, dataBefore, dataAfter } = a.history[0];
  assert.equal(action, "fill");
  assert.equal(args, [0, 1, 3]);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, [1, 0, 0, 4, 5]);
});

Hist("remembers pop mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  const out = a.pop();

  assert.equal(out, 5);
  assert.equal(a.history.length, 1);
  const { action, args, dataBefore, dataAfter } = a.history[0];
  assert.equal(action, "pop");
  assert.equal(args, []);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, [1, 2, 3, 4]);
});

Hist("remembers push mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  const out = a.push(6, 7, 8);

  assert.equal(out, 8);
  assert.equal(a.history.length, 1);
  const { action, args, dataBefore, dataAfter } = a.history[0];
  assert.equal(action, "push");
  assert.equal(args, [6, 7, 8]);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, [1, 2, 3, 4, 5, 6, 7, 8]);
});

Hist("remembers reverse mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  const out = a.reverse();

  assert.equal(out, HArray.from([5, 4, 3, 2, 1]));
  assert.equal(a.history.length, 1);
  const { action, args, dataBefore, dataAfter } = a.history[0];
  assert.equal(action, "reverse");
  assert.equal(args, []);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, [5, 4, 3, 2, 1]);
});

Hist("remembers shift mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  const out = a.shift();

  assert.equal(out, 1);
  assert.equal(a.history.length, 1);
  const { action, args, dataBefore, dataAfter } = a.history[0];
  assert.equal(action, "shift");
  assert.equal(args, []);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, [2, 3, 4, 5]);
});

Hist("remembers sort mutations", () => {
  const a = HArray.from([3, 2, 5, 1, 4]);
  const out = a.sort();

  assert.is(out, a);
  assert.equal(a.history.length, 1);
  const { action, args, dataBefore, dataAfter } = a.history[0];
  assert.equal(action, "sort");
  assert.equal(args, []);
  assert.equal(dataBefore, [3, 2, 5, 1, 4]);
  assert.equal(dataAfter, [1, 2, 3, 4, 5]);
});

Hist("remembers splice mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  const out = a.splice(1, 2, 6, 7);

  assert.equal(out, HArray.from([2, 3]));
  assert.equal(a.history.length, 1);
  const { action, args, dataBefore, dataAfter } = a.history[0];
  assert.equal(action, "splice");
  assert.equal(args, [1, 2, 6, 7]);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, [1, 6, 7, 4, 5]);
});

Hist("remembers unshift mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  const out = a.unshift(-2, -1, 0);

  assert.equal(out, 8);
  assert.equal(a.history.length, 1);
  const { action, args, dataBefore, dataAfter } = a.history[0];
  assert.equal(action, "unshift");
  assert.equal(args, [-2, -1, 0]);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, [-2, -1, 0, 1, 2, 3, 4, 5]);
});

const Rem = uvu.suite("remark chainable API");

Rem("remarks on copyWithin mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  a.remark("test copyWithin remark").copyWithin(1, 0, 3);

  assert.equal(a.history.length, 1);
  assert.equal(a.history[0].remark, "test copyWithin remark");
});

Rem("remarks on fill mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  a.remark("test fill remark").fill(0, 1, 3);

  assert.equal(a.history.length, 1);
  assert.equal(a.history[0].remark, "test fill remark");
});

Rem("remarks on pop mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  a.remark("test pop remark").pop();

  assert.equal(a.history.length, 1);
  assert.equal(a.history[0].remark, "test pop remark");
});

Rem("remarks on push mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  a.remark("test push remark").push(6);

  assert.equal(a.history.length, 1);
  assert.equal(a.history[0].remark, "test push remark");
});

Rem("remarks on reverse mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  a.remark("test reverse remark").reverse();

  assert.equal(a.history.length, 1);
  assert.equal(a.history[0].remark, "test reverse remark");
});

Rem("remarks on shift mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  a.remark("test shift remark").shift();

  assert.equal(a.history.length, 1);
  assert.equal(a.history[0].remark, "test shift remark");
});

Rem("remarks on sort mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  a.remark("test sort remark").sort();

  assert.equal(a.history.length, 1);
  assert.equal(a.history[0].remark, "test sort remark");
});

Rem("remarks on splice mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  a.remark("test splice remark").splice(1, 2, 6, 7);

  assert.equal(a.history.length, 1);
  assert.equal(a.history[0].remark, "test splice remark");
});

Rem("remarks on unshift mutations", () => {
  const a = HArray.from([1, 2, 3, 4, 5]);
  a.remark("test unshift remark").unshift(0);

  assert.equal(a.history.length, 1);
  assert.equal(a.history[0].remark, "test unshift remark");
});

Rem("only remarks on the next mutation", () => {
  const m = new HArray<number>();
  m.push(1);
  m.remark("only the second push").push(2);
  m.push(3);

  assert.equal(m.history.length, 3);
  assert.equal(m.history[0].remark, null);
  assert.equal(m.history[1].remark, "only the second push");
  assert.equal(m.history[2].remark, null);
});

Hist.run();
Rem.run();
