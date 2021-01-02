import * as uvu from "uvu";
import * as assert from "uvu/assert";
import { HSet } from "../src/HSet";

const Hist = uvu.suite("history API");

Hist("remembers add mutations", () => {
  const s = new HSet<number>();
  const out = s.add(1);

  assert.is(out, s);
  assert.equal(s.history.length, 1);
  const { action, args, dataBefore, dataAfter } = s.history[0];
  assert.equal(action, "add");
  assert.equal(args, [1]);
  assert.equal(dataBefore, []);
  assert.equal(dataAfter, [1]);
});

Hist("remembers clear mutations", () => {
  const s = new HSet<number>([1, 2, 3, 4, 5]);
  s.clear();

  assert.equal(s.history.length, 1);
  const { action, args, dataBefore, dataAfter } = s.history[0];
  assert.equal(action, "clear");
  assert.equal(args, []);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, []);
});

Hist("remembers delete mutations", () => {
  const s = new HSet<number>([1, 2, 3, 4, 5]);
  const out = s.delete(3);

  assert.equal(out, true);
  assert.equal(s.history.length, 1);
  const { action, args, dataBefore, dataAfter } = s.history[0];
  assert.equal(action, "delete");
  assert.equal(args, [3]);
  assert.equal(dataBefore, [1, 2, 3, 4, 5]);
  assert.equal(dataAfter, [1, 2, 4, 5]);
});

const Rem = uvu.suite("remark chainable API");

Rem("remarks on add mutations", () => {
  const s = new HSet<number>();
  s.remark("test add remark").add(1);

  assert.equal(s.history.length, 1);
  assert.equal(s.history[0].remark, "test add remark");
});

Rem("remarks on clear mutations", () => {
  const s = new HSet<number>();
  s.remark("test clear remark").clear();

  assert.equal(s.history.length, 1);
  assert.equal(s.history[0].remark, "test clear remark");
});

Rem("remarks on delete mutations", () => {
  const s = new HSet<number>();
  s.remark("test delete remark").delete(3);

  assert.equal(s.history.length, 1);
  assert.equal(s.history[0].remark, "test delete remark");
});

Rem("only remarks on the next mutation", () => {
  const s = new HSet<number>();
  s.add(1);
  s.remark("only the second add").add(2);
  s.add(3);

  assert.equal(s.history.length, 3);
  assert.equal(s.history[0].remark, null);
  assert.equal(s.history[1].remark, "only the second add");
  assert.equal(s.history[2].remark, null);
});

Hist.run();
Rem.run();
