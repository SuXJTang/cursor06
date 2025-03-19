import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class IsoDateRangePipe {
    constructor() { }
    transform(dates) {
        // TODO: Lookup Locale to convert to Users DateFormat
        const [start, end] = dates.map((date) => {
            if (date instanceof Date) {
                return date.toISOString().slice(0, 10);
            }
            return date.slice(0, 10);
        });
        return `${start} - ${end}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IsoDateRangePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: IsoDateRangePipe, name: "isoDateRange" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IsoDateRangePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'isoDateRange' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNvLWRhdGUtcmFuZ2UucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL3BpcGVzL2lzbzg2MDEvaXNvLWRhdGUtcmFuZ2UucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFLcEQsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixnQkFBZSxDQUFDO0lBQ2hCLFNBQVMsQ0FBQyxLQUF1QjtRQUMvQixxREFBcUQ7UUFDckQsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDdEMsSUFBSSxJQUFJLFlBQVksSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUNELE9BQVEsSUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7K0dBWlUsZ0JBQWdCOzZHQUFoQixnQkFBZ0I7OzRGQUFoQixnQkFBZ0I7a0JBRDVCLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG50eXBlIElzb0RhdGVSYW5nZUFyZ3MgPSAoc3RyaW5nIHwgRGF0ZSlbXTtcblxuQFBpcGUoeyBuYW1lOiAnaXNvRGF0ZVJhbmdlJyB9KVxuZXhwb3J0IGNsYXNzIElzb0RhdGVSYW5nZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICB0cmFuc2Zvcm0oZGF0ZXM6IElzb0RhdGVSYW5nZUFyZ3MpOiBzdHJpbmcge1xuICAgIC8vIFRPRE86IExvb2t1cCBMb2NhbGUgdG8gY29udmVydCB0byBVc2VycyBEYXRlRm9ybWF0XG4gICAgY29uc3QgW3N0YXJ0LCBlbmRdID0gZGF0ZXMubWFwKChkYXRlKSA9PiB7XG4gICAgICBpZiAoZGF0ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuIGRhdGUudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKGRhdGUgYXMgc3RyaW5nKS5zbGljZSgwLCAxMCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYCR7c3RhcnR9IC0gJHtlbmR9YDtcbiAgfVxufVxuIl19