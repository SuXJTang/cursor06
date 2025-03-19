// tslint:disable: directive-selector
import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class TextColorDirective {
    get hb_textColor() {
        return isValidColor(this.txc) ? 'novo-text-custom' : `novo-text-${this.txc}`;
    }
    get hb_textStyle() {
        return isValidColor(this.txc) ? this.txc : null;
    }
    constructor(el) {
        this.el = el;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TextColorDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: TextColorDirective, selector: "[txc]", inputs: { txc: "txc" }, host: { properties: { "class": "this.hb_textColor", "style.color": "this.hb_textStyle" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: TextColorDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[txc]',
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { txc: [{
                type: Input
            }], hb_textColor: [{
                type: HostBinding,
                args: ['class']
            }], hb_textStyle: [{
                type: HostBinding,
                args: ['style.color']
            }] } });
function isValidColor(color) {
    return color.startsWith('#') || color.startsWith('rgb');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3IuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvY29tbW9uL2RpcmVjdGl2ZXMvY29sb3IuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQUNyQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUsxRSxNQUFNLE9BQU8sa0JBQWtCO0lBRzdCLElBQ0ksWUFBWTtRQUNkLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQy9FLENBQUM7SUFDRCxJQUNJLFlBQVk7UUFDZCxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNsRCxDQUFDO0lBRUQsWUFBb0IsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7SUFBRyxDQUFDOytHQVozQixrQkFBa0I7bUdBQWxCLGtCQUFrQjs7NEZBQWxCLGtCQUFrQjtrQkFIOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsT0FBTztpQkFDbEI7K0VBRVUsR0FBRztzQkFBWCxLQUFLO2dCQUdGLFlBQVk7c0JBRGYsV0FBVzt1QkFBQyxPQUFPO2dCQUtoQixZQUFZO3NCQURmLFdBQVc7dUJBQUMsYUFBYTs7QUFRNUIsU0FBUyxZQUFZLENBQUMsS0FBYTtJQUNqQyxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHNsaW50OmRpc2FibGU6IGRpcmVjdGl2ZS1zZWxlY3RvclxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0QmluZGluZywgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3R4Y10nLFxufSlcbmV4cG9ydCBjbGFzcyBUZXh0Q29sb3JEaXJlY3RpdmUge1xuICBASW5wdXQoKSB0eGM6IHN0cmluZztcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGhiX3RleHRDb2xvcigpIHtcbiAgICByZXR1cm4gaXNWYWxpZENvbG9yKHRoaXMudHhjKSA/ICdub3ZvLXRleHQtY3VzdG9tJyA6IGBub3ZvLXRleHQtJHt0aGlzLnR4Y31gO1xuICB9XG4gIEBIb3N0QmluZGluZygnc3R5bGUuY29sb3InKVxuICBnZXQgaGJfdGV4dFN0eWxlKCkge1xuICAgIHJldHVybiBpc1ZhbGlkQ29sb3IodGhpcy50eGMpID8gdGhpcy50eGMgOiBudWxsO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZikge31cbn1cblxuZnVuY3Rpb24gaXNWYWxpZENvbG9yKGNvbG9yOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGNvbG9yLnN0YXJ0c1dpdGgoJyMnKSB8fCBjb2xvci5zdGFydHNXaXRoKCdyZ2InKTtcbn1cbiJdfQ==