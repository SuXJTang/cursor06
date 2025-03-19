// NG2
import { Injectable, Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class DefaultPipe {
    transform(value, defaultValue) {
        return value || defaultValue;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DefaultPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: DefaultPipe, name: "default" }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DefaultPipe }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: DefaultPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'default', pure: true }]
        }, {
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL3BpcGVzL2RlZmF1bHQvRGVmYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOztBQUloRSxNQUFNLE9BQU8sV0FBVztJQUN0QixTQUFTLENBQUMsS0FBVSxFQUFFLFlBQWlCO1FBQ3JDLE9BQU8sS0FBSyxJQUFJLFlBQVksQ0FBQztJQUMvQixDQUFDOytHQUhVLFdBQVc7NkdBQVgsV0FBVzttSEFBWCxXQUFXOzs0RkFBWCxXQUFXO2tCQUZ2QixJQUFJO21CQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFOztrQkFDcEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE5HMlxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7IG5hbWU6ICdkZWZhdWx0JywgcHVyZTogdHJ1ZSB9KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBkZWZhdWx0VmFsdWU6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZhbHVlIHx8IGRlZmF1bHRWYWx1ZTtcbiAgfVxufVxuIl19