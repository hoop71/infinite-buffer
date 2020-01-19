declare class InfiniteBuffer<T> {
    data: T[];
    readonly capacity: number;
    startIndex: number;
    constructor(data: T[], capacity: number, startIndex?: number);
    add(data: T[], index: number): void;
    has(index: number): boolean;
    item(index: number): T;
}
export default InfiniteBuffer;
