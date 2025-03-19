import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class IsoDatePipe {
    constructor() { }
    transform(date) {
        if (date instanceof Date) {
            return date.toISOString().slice(0, 10);
        }
        return date.slice(0, 10);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IsoDatePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: IsoDatePipe, name: "isoDate" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IsoDatePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'isoDate' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNvLWRhdGUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL3BpcGVzL2lzbzg2MDEvaXNvLWRhdGUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFHcEQsTUFBTSxPQUFPLFdBQVc7SUFDdEIsZ0JBQWUsQ0FBQztJQUNoQixTQUFTLENBQUMsSUFBbUI7UUFDM0IsSUFBSSxJQUFJLFlBQVksSUFBSSxFQUFFLENBQUM7WUFDekIsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsT0FBUSxJQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDOytHQVBVLFdBQVc7NkdBQVgsV0FBVzs7NEZBQVgsV0FBVztrQkFEdkIsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBQaXBlKHsgbmFtZTogJ2lzb0RhdGUnIH0pXG5leHBvcnQgY2xhc3MgSXNvRGF0ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICB0cmFuc2Zvcm0oZGF0ZTogc3RyaW5nIHwgRGF0ZSk6IHN0cmluZyB7XG4gICAgaWYgKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKTtcbiAgICB9XG4gICAgcmV0dXJuIChkYXRlIGFzIHN0cmluZykuc2xpY2UoMCwgMTApO1xuICB9XG59XG4iXX0=