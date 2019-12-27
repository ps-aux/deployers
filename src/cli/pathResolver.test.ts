import { absPath } from './pathResolver'

it('works', () => {
    const r = absPath('hovno')
    expect(r).toMatch(/.*\/hovno/)
})
