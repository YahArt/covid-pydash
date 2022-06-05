export class TimeRange {

    private _identifier: string;
    private _startDateString: string;
    private _endDateString: string;

    private getDateString(date: Date): string {
        // 2022-05-21
        const day = date.getDate();
        const dayPrefix = day < 10 ? '0' : '';
        const month = date.getMonth() + 1;
        const monthPrefix = month < 10 ? '0' : '';
        return `${date.getFullYear()}-${monthPrefix}${month}-${dayPrefix}${day}`;
    }

    public constructor(public start: Date, public end: Date) {
        this._identifier = `${this.getDateString(this.start)} - ${this.getDateString(this.end)}`;
        this._startDateString = this.getDateString(this.start);
        this._endDateString = this.getDateString(this.end);
    }

    public get startDateString(): string {
        return this._startDateString;
    }

    public get endDateString(): string {
        return this._endDateString;
    }


    public get identifier(): string {
        return this._identifier;
    }
}