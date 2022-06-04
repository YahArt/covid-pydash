export class TimeRange {
    public constructor(public start: Date, public end: Date) { }

    public get identifier(): string {
        return `${this.start.toLocaleDateString()} - ${this.end.toLocaleDateString()}`;
    }
}