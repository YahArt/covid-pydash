export class TimeRange {

    private _identifier: string;
    private _startDateString: string;
    private _endDateString: string;

    public constructor(public start: Date, public end: Date) {
        this._identifier = `${this.start.getTime()} - ${this.end.getTime()}`;
        this._startDateString = this.start.toLocaleDateString();
        this._endDateString = this.end.toLocaleDateString();
    }

    public toString(): string {
        return `${this._startDateString} - ${this._endDateString}`;
    }


    public get identifier(): string {
        return this._identifier;
    }
}