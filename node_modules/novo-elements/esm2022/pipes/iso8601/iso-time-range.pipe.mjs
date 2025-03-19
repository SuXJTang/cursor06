import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class IsoTimeRangePipe {
    constructor() { }
    transform(dates) {
        // TODO: Lookup Locale to convert to 12hour
        const [start, end] = dates.map((date) => {
            if (date instanceof Date) {
                return date.toISOString().slice(11, 16);
            }
            return date.slice(11, 16);
        });
        return `${start} - ${end}`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IsoTimeRangePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: IsoTimeRangePipe, name: "isoTimeRange" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IsoTimeRangePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'isoTimeRange' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNvLXRpbWUtcmFuZ2UucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL3BpcGVzL2lzbzg2MDEvaXNvLXRpbWUtcmFuZ2UucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFLcEQsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixnQkFBZSxDQUFDO0lBQ2hCLFNBQVMsQ0FBQyxLQUF1QjtRQUMvQiwyQ0FBMkM7UUFDM0MsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDdEMsSUFBSSxJQUFJLFlBQVksSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUMsQ0FBQztZQUNELE9BQVEsSUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQzdCLENBQUM7K0dBWlUsZ0JBQWdCOzZHQUFoQixnQkFBZ0I7OzRGQUFoQixnQkFBZ0I7a0JBRDVCLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG50eXBlIElzb1RpbWVSYW5nZUFyZ3MgPSAoc3RyaW5nIHwgRGF0ZSlbXTtcblxuQFBpcGUoeyBuYW1lOiAnaXNvVGltZVJhbmdlJyB9KVxuZXhwb3J0IGNsYXNzIElzb1RpbWVSYW5nZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICB0cmFuc2Zvcm0oZGF0ZXM6IElzb1RpbWVSYW5nZUFyZ3MpOiBzdHJpbmcge1xuICAgIC8vIFRPRE86IExvb2t1cCBMb2NhbGUgdG8gY29udmVydCB0byAxMmhvdXJcbiAgICBjb25zdCBbc3RhcnQsIGVuZF0gPSBkYXRlcy5tYXAoKGRhdGUpID0+IHtcbiAgICAgIGlmIChkYXRlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDExLCAxNik7XG4gICAgICB9XG4gICAgICByZXR1cm4gKGRhdGUgYXMgc3RyaW5nKS5zbGljZSgxMSwgMTYpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGAke3N0YXJ0fSAtICR7ZW5kfWA7XG4gIH1cbn1cbiJdfQ==