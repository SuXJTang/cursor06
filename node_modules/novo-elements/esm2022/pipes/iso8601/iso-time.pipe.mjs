import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class IsoTimePipe {
    constructor() { }
    transform(date) {
        // TODO: Lookup Locale to convert to 12hour
        if (date instanceof Date) {
            return date.toISOString().slice(11, 16);
        }
        return date.slice(11, 16);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IsoTimePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: IsoTimePipe, name: "isoTime" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: IsoTimePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'isoTime' }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNvLXRpbWUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL3BpcGVzL2lzbzg2MDEvaXNvLXRpbWUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFHcEQsTUFBTSxPQUFPLFdBQVc7SUFDdEIsZ0JBQWUsQ0FBQztJQUNoQixTQUFTLENBQUMsSUFBbUI7UUFDM0IsMkNBQTJDO1FBQzNDLElBQUksSUFBSSxZQUFZLElBQUksRUFBRSxDQUFDO1lBQ3pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNELE9BQVEsSUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEMsQ0FBQzsrR0FSVSxXQUFXOzZHQUFYLFdBQVc7OzRGQUFYLFdBQVc7a0JBRHZCLElBQUk7bUJBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7IG5hbWU6ICdpc29UaW1lJyB9KVxuZXhwb3J0IGNsYXNzIElzb1RpbWVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgdHJhbnNmb3JtKGRhdGU6IHN0cmluZyB8IERhdGUpOiBzdHJpbmcge1xuICAgIC8vIFRPRE86IExvb2t1cCBMb2NhbGUgdG8gY29udmVydCB0byAxMmhvdXJcbiAgICBpZiAoZGF0ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCkuc2xpY2UoMTEsIDE2KTtcbiAgICB9XG4gICAgcmV0dXJuIChkYXRlIGFzIHN0cmluZykuc2xpY2UoMTEsIDE2KTtcbiAgfVxufVxuIl19