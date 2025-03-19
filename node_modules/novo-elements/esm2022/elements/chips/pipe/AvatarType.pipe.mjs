import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class AvatarTypePipe {
    transform(item, type) {
        return (type || item?.value?.searchEntity || '').toLowerCase();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: AvatarTypePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: AvatarTypePipe, name: "avatarType" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: AvatarTypePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'avatarType' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXZhdGFyVHlwZS5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvY2hpcHMvcGlwZS9BdmF0YXJUeXBlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7O0FBR3BELE1BQU0sT0FBTyxjQUFjO0lBQ3pCLFNBQVMsQ0FBQyxJQUFTLEVBQUUsSUFBVTtRQUM3QixPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRSxLQUFLLEVBQUUsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2pFLENBQUM7K0dBSFUsY0FBYzs2R0FBZCxjQUFjOzs0RkFBZCxjQUFjO2tCQUQxQixJQUFJO21CQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoeyBuYW1lOiAnYXZhdGFyVHlwZScgfSlcbmV4cG9ydCBjbGFzcyBBdmF0YXJUeXBlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0oaXRlbTogYW55LCB0eXBlPzogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gKHR5cGUgfHwgaXRlbT8udmFsdWU/LnNlYXJjaEVudGl0eSB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgfVxufVxuIl19