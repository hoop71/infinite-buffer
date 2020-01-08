class InfiniteBuffer<T> {
    data: T[]
    readonly capacity: number
    startIndex: number

    constructor(data: T[], capacity: number, startIndex = 0) {
        this.data = data
        this.capacity = capacity
        this.startIndex = startIndex
    }

    add(data: T[], index: number): void {
        if (data.length > this.capacity) throw new Error('cannot add more than capacity')
        if (index > this.startIndex + this.data.length) throw new Error('add index too high')
        if (index + data.length < this.startIndex) throw new Error('add index too low')

        // appending
        if (index === this.startIndex + this.data.length) {
            const toTrim = this.data.length + data.length - this.capacity
            if (toTrim > 0) {
                this.data.splice(0, toTrim)
                this.startIndex += toTrim
            }

            this.data = this.data.concat(data)
            return
        }

        // prepending
        if (index + data.length === this.startIndex) {
            const toTrim = this.data.length + data.length - this.capacity
            if (toTrim > 0) this.data.splice(this.data.length - toTrim)

            this.data = data.concat(this.data)
            this.startIndex = index
            return
        }
    }

    has(index: number): boolean {
        return index >= this.startIndex && index < this.startIndex + this.data.length
    }

    item(index: number): T {
        return this.data[index - this.startIndex]
    }
}

export default InfiniteBuffer
