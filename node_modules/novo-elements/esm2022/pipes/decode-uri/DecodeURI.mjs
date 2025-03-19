// NG2
import { Injectable, Pipe } from '@angular/core';
// App
import { Helpers } from 'novo-elements/utils';
import * as i0 from "@angular/core";
export class DecodeURIPipe {
    transform(encodedString) {
        let decodedString = '';
        if (!Helpers.isBlank(encodedString) && typeof encodedString === 'string') {
            decodedString = decodeURIComponent(encodedString);
        }
        return decodedString;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DecodeURIPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: DecodeURIPipe, name: "decodeURI" }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DecodeURIPipe }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DecodeURIPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'decodeURI' }]
        }, {
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVjb2RlVVJJLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvcGlwZXMvZGVjb2RlLXVyaS9EZWNvZGVVUkkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTTtBQUNOLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNoRSxNQUFNO0FBQ04sT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDOztBQUk5QyxNQUFNLE9BQU8sYUFBYTtJQUN4QixTQUFTLENBQUMsYUFBcUI7UUFDN0IsSUFBSSxhQUFhLEdBQVcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLE9BQU8sYUFBYSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ3pFLGFBQWEsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQ0QsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQzsrR0FQVSxhQUFhOzZHQUFiLGFBQWE7bUhBQWIsYUFBYTs7NEZBQWIsYUFBYTtrQkFGekIsSUFBSTttQkFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7O2tCQUMxQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4vLyBBcHBcbmltcG9ydCB7IEhlbHBlcnMgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3V0aWxzJztcblxuQFBpcGUoeyBuYW1lOiAnZGVjb2RlVVJJJyB9KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlY29kZVVSSVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKGVuY29kZWRTdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IGRlY29kZWRTdHJpbmc6IHN0cmluZyA9ICcnO1xuICAgIGlmICghSGVscGVycy5pc0JsYW5rKGVuY29kZWRTdHJpbmcpICYmIHR5cGVvZiBlbmNvZGVkU3RyaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgZGVjb2RlZFN0cmluZyA9IGRlY29kZVVSSUNvbXBvbmVudChlbmNvZGVkU3RyaW5nKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY29kZWRTdHJpbmc7XG4gIH1cbn1cbiJdfQ==