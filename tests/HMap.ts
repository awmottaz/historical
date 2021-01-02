import * as uvu from "uvu";
import * as assert from "uvu/assert";
import { HMap } from "../src/HMap";

const Hist = uvu.suite("history API");

Hist("remembers set mutations", () => {
  const m = new HMap<number, boolean>();
  const out = m.set(1, true);

  assert.is(out, m);
  assert.equal(m.history.length, 1);
  const { action, args, dataBefore, dataAfter } = m.history[0];
  assert.equal(action, "set");
  assert.equal(args, [1, true]);
  assert.equal(dataBefore, []);
  assert.equal(dataAfter, [[1, true]]);
});

Hist("remembers delete mutations", () => {
  const m = new HMap<number, boolean>([
    [1, true],
    [2, true],
    [3, true],
  ]);
  const out = m.delete(2);

  assert.equal(out, true);
  assert.equal(m.history.length, 1);
  const { action, args, dataBefore, dataAfter } = m.history[0];
  assert.equal(action, "delete");
  assert.equal(args, [2]);
  assert.equal(dataBefore, [
    [1, true],
    [2, true],
    [3, true],
  ]);
  assert.equal(dataAfter, [
    [1, true],
    [3, true],
  ]);
});

Hist("remembers clear mutations", () => {
  const m = new HMap<number, boolean>([
    [1, true],
    [2, true],
    [3, true],
  ]);
  m.clear();

  assert.equal(m.history.length, 1);
  const { action, args, dataBefore, dataAfter } = m.history[0];
  assert.equal(action, "clear");
  assert.equal(args, []);
  assert.equal(dataBefore, [
    [1, true],
    [2, true],
    [3, true],
  ]);
  assert.equal(dataAfter, []);
});

const Rem = uvu.suite("remark chainable API");

Rem("remarks on set mutation", () => {
  const m = new HMap<number, boolean>();
  m.remark("test set remark").set(1, true);

  assert.equal(m.history.length, 1);
  assert.equal(m.history[0].remark, "test set remark");
});

Rem("remarks on delete mutation", () => {
  const m = new HMap<number, boolean>([
    [1, true],
    [2, true],
    [3, true],
  ]);
  m.remark("test delete remark").delete(2);

  assert.equal(m.history.length, 1);
  assert.equal(m.history[0].remark, "test delete remark");
});

Rem("remarks on clear mutation", () => {
  const m = new HMap<number, boolean>([
    [1, true],
    [2, true],
    [3, true],
  ]);
  m.remark("test clear remark").clear();

  assert.equal(m.history.length, 1);
  assert.equal(m.history[0].remark, "test clear remark");
});

Rem("only remarks on the next mutation", () => {
  const m = new HMap<number, boolean>();
  m.set(1, true);
  m.remark("only the second set").set(2, true);
  m.set(3, true);

  assert.equal(m.history.length, 3);
  assert.equal(m.history[0].remark, null);
  assert.equal(m.history[1].remark, "only the second set");
  assert.equal(m.history[2].remark, null);
});

Hist.run();
Rem.run();
