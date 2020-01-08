import InfiniteBuffer from './index'

const arr = (from: number, to: number): number[] =>
    Array(to - from)
        .join()
        .split(',')
        .map((e, i) => i + from)

test('initializes with an array', () => {
    const data = arr(0, 10)
    const buf = new InfiniteBuffer<number>(data, 10)
    expect(buf.data.length).toEqual(10)
    expect(buf.item(2)).toEqual(2)
    expect(buf.has(0)).toEqual(true)
    expect(buf.has(9)).toEqual(true)
    expect(buf.has(10)).toEqual(false)
})

test('throws if adding too far ahead', () => {
    const data1 = arr(0, 10)
    const data2 = arr(10, 20)
    const buf = new InfiniteBuffer(data1, 100)
    expect(() => buf.add(data2, 50)).toThrow()
})

test('throws if adding too early', () => {
    const data1 = arr(0, 10)
    const data2 = arr(10, 20)
    const buf = new InfiniteBuffer(data1, 100, 50)
    expect(() => buf.add(data2, 0)).toThrow()
})

test('throws if adding more than capacity', () => {
    const data1 = arr(0, 10)
    const tooBig = arr(0, 1000)
    const buf = new InfiniteBuffer(data1, 20)
    expect(() => buf.add(tooBig, 10)).toThrow()
})

test('appends data when there is available capacity', () => {
    const data1 = arr(0, 10)
    const data2 = arr(10, 20)
    const buf = new InfiniteBuffer(data1, 20)

    expect(buf.has(9)).toEqual(true)
    expect(buf.has(10)).toEqual(false)
    buf.add(data2, 10)
    expect(buf.has(10)).toEqual(true)
    expect(buf.has(20)).toEqual(false)

    expect(buf.data.length).toEqual(data1.length + data2.length)
    expect(buf.item(9)).toEqual(9)
    expect(buf.item(10)).toEqual(10)
    expect(buf.item(11)).toEqual(11)
})

test('drops early data when appending to stay at capacity', () => {
    const data1 = arr(0, 10)
    const data2 = arr(10, 15)
    const buf = new InfiniteBuffer(data1, 10) // index 0-9 is valid

    expect(buf.has(0)).toEqual(true)
    buf.add(data2, 10) // adding something at index 10-14 should invalidate 0-4
    expect(buf.has(0)).toEqual(false)

    expect(buf.data.length).toEqual(buf.capacity)
    expect(buf.item(5)).toEqual(5)
    expect(buf.item(14)).toEqual(14)
})

test('prepends data when there is available capacity', () => {
    const data1 = arr(0, 10)
    const data2 = arr(10, 20)
    const buf = new InfiniteBuffer(data2, 20, 10)

    buf.add(data1, 0)

    expect(buf.data.length).toEqual(data1.length + data2.length)
    expect(buf.item(9)).toEqual(9)
    expect(buf.item(10)).toEqual(10)
    expect(buf.item(11)).toEqual(11)
})

test('truncates data when prepending to stay at capacity', () => {
    const data1 = arr(0, 5)
    const data2 = arr(5, 25)
    const buf = new InfiniteBuffer(data2, 20, 5) // index 5-24 is valid

    expect(buf.has(20)).toEqual(true)
    buf.add(data1, 0) // adding at 0-5 should invalidate index 20-24
    expect(buf.has(20)).toEqual(false)

    expect(buf.data.length).toEqual(buf.capacity)
    expect(buf.item(0)).toEqual(0)
    expect(buf.item(19)).toEqual(19)
})
