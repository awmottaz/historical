import { HMap } from './HMap'
export * from './HMap'

const m = new HMap<string, number>()
m.set('one', 1)
m.set('two', 2)
m.set('three', 3)
m.delete('one')
m.clear()

console.log(m.history)
