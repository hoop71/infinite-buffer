"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfiniteBuffer {
    constructor(data, capacity, startIndex = 0) {
        this.data = data;
        this.capacity = capacity;
        this.startIndex = startIndex;
    }
    add(data, index) {
        if (data.length > this.capacity)
            throw new Error('cannot add more than capacity');
        if (index > this.startIndex + this.data.length)
            throw new Error('add index too high');
        if (index + data.length < this.startIndex)
            throw new Error('add index too low');
        // appending
        if (index === this.startIndex + this.data.length) {
            const toTrim = this.data.length + data.length - this.capacity;
            if (toTrim > 0) {
                this.data.splice(0, toTrim);
                this.startIndex += toTrim;
            }
            this.data = this.data.concat(data);
            return;
        }
        // prepending
        if (index + data.length === this.startIndex) {
            const toTrim = this.data.length + data.length - this.capacity;
            if (toTrim > 0)
                this.data.splice(this.data.length - toTrim);
            this.data = data.concat(this.data);
            this.startIndex = index;
            return;
        }
    }
    has(index) {
        return index >= this.startIndex && index < this.startIndex + this.data.length;
    }
    item(index) {
        return this.data[index - this.startIndex];
    }
}
exports.default = InfiniteBuffer;
//# sourceMappingURL=index.js.map