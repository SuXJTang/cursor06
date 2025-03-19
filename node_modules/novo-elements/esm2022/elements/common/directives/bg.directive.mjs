// tslint:disable: directive-selector
import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class BackgroundColorDirective {
    get hb_bgColor() {
        return isValidColor(this.bg) ? 'novo-background-custom' : `novo-background-${this.bg}`;
    }
    get hb_bgStyle() {
        return isValidColor(this.bg) ? this.bg : null;
    }
    constructor(el) {
        this.el = el;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: BackgroundColorDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: BackgroundColorDirective, selector: "[bg]", inputs: { bg: "bg" }, host: { properties: { "class": "this.hb_bgColor", "style.background-color": "this.hb_bgStyle" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: BackgroundColorDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[bg]',
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { bg: [{
                type: Input
            }], hb_bgColor: [{
                type: HostBinding,
                args: ['class']
            }], hb_bgStyle: [{
                type: HostBinding,
                args: ['style.background-color']
            }] } });
function isValidColor(color) {
    return color.startsWith('#') || color.startsWith('rgb');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmcuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvY29tbW9uL2RpcmVjdGl2ZXMvYmcuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQUNyQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUsxRSxNQUFNLE9BQU8sd0JBQXdCO0lBR25DLElBQ0ksVUFBVTtRQUNaLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDekYsQ0FBQztJQUNELElBQ0ksVUFBVTtRQUNaLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2hELENBQUM7SUFFRCxZQUFvQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtJQUFHLENBQUM7K0dBWjNCLHdCQUF3QjttR0FBeEIsd0JBQXdCOzs0RkFBeEIsd0JBQXdCO2tCQUhwQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxNQUFNO2lCQUNqQjsrRUFFVSxFQUFFO3NCQUFWLEtBQUs7Z0JBR0YsVUFBVTtzQkFEYixXQUFXO3VCQUFDLE9BQU87Z0JBS2hCLFVBQVU7c0JBRGIsV0FBVzt1QkFBQyx3QkFBd0I7O0FBUXZDLFNBQVMsWUFBWSxDQUFDLEtBQWE7SUFDakMsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlOiBkaXJlY3RpdmUtc2VsZWN0b3JcbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tiZ10nLFxufSlcbmV4cG9ydCBjbGFzcyBCYWNrZ3JvdW5kQ29sb3JEaXJlY3RpdmUge1xuICBASW5wdXQoKSBiZzogc3RyaW5nO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBnZXQgaGJfYmdDb2xvcigpIHtcbiAgICByZXR1cm4gaXNWYWxpZENvbG9yKHRoaXMuYmcpID8gJ25vdm8tYmFja2dyb3VuZC1jdXN0b20nIDogYG5vdm8tYmFja2dyb3VuZC0ke3RoaXMuYmd9YDtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJhY2tncm91bmQtY29sb3InKVxuICBnZXQgaGJfYmdTdHlsZSgpIHtcbiAgICByZXR1cm4gaXNWYWxpZENvbG9yKHRoaXMuYmcpID8gdGhpcy5iZyA6IG51bGw7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7fVxufVxuXG5mdW5jdGlvbiBpc1ZhbGlkQ29sb3IoY29sb3I6IHN0cmluZykge1xuICByZXR1cm4gY29sb3Iuc3RhcnRzV2l0aCgnIycpIHx8IGNvbG9yLnN0YXJ0c1dpdGgoJ3JnYicpO1xufVxuIl19