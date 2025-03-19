import { Directive, ElementRef, HostBinding, Input, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
export class FlexDirective {
    get flex() {
        return this._flex;
    }
    set flex(value) {
        if (!value) {
            this._flex = '1 1 auto';
        }
        else {
            this._flex = value;
        }
    }
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        // this.renderer.setStyle(this.el.nativeElement, 'display', 'flex');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: FlexDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: FlexDirective, selector: "[flex]", inputs: { flex: "flex" }, host: { properties: { "style.flex": "this.flex" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: FlexDirective, decorators: [{
            type: Directive,
            args: [{
                    // tslint:disable-next-line: directive-selector
                    selector: '[flex]',
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { flex: [{
                type: HostBinding,
                args: ['style.flex']
            }, {
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9jb21tb24vZGlyZWN0aXZlcy9mbGV4LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFNckYsTUFBTSxPQUFPLGFBQWE7SUFleEIsSUFFVyxJQUFJO1FBQ2IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFXLElBQUksQ0FBQyxLQUFhO1FBQzNCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNYLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO1FBQzFCLENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDckIsQ0FBQztJQUNILENBQUM7SUFFRCxZQUE2QixFQUFjLEVBQW1CLFFBQW1CO1FBQXBELE9BQUUsR0FBRixFQUFFLENBQVk7UUFBbUIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUMvRSxvRUFBb0U7SUFDdEUsQ0FBQzsrR0EvQlUsYUFBYTttR0FBYixhQUFhOzs0RkFBYixhQUFhO2tCQUp6QixTQUFTO21CQUFDO29CQUNULCtDQUErQztvQkFDL0MsUUFBUSxFQUFFLFFBQVE7aUJBQ25CO3VHQWtCWSxJQUFJO3NCQUZkLFdBQVc7dUJBQUMsWUFBWTs7c0JBQ3hCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3RCaW5kaW5nLCBJbnB1dCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGRpcmVjdGl2ZS1zZWxlY3RvclxuICBzZWxlY3RvcjogJ1tmbGV4XScsXG59KVxuZXhwb3J0IGNsYXNzIEZsZXhEaXJlY3RpdmUge1xuICAvLyBASG9zdEJpbmRpbmcoJ3N0eWxlLmFsaWduLWl0ZW1zJylcbiAgLy8gQElucHV0KClcbiAgLy8gYWxpZ246IHN0cmluZyA9ICdjZW50ZXInO1xuXG4gIC8vIEBIb3N0QmluZGluZygnc3R5bGUuanVzdGlmeS1jb250ZW50JylcbiAgLy8gQElucHV0KClcbiAgLy8ganVzdGlmeTogc3RyaW5nID0gJ2ZsZXgtc3RhcnQnO1xuXG4gIC8vIEBIb3N0QmluZGluZygnc3R5bGUuZmxleC1mbG93JylcbiAgLy8gQElucHV0KClcbiAgLy8gZmxvdzogc3RyaW5nID0gJ3JvdyBub3dyYXAnO1xuXG4gIHByaXZhdGUgX2ZsZXg6IHN0cmluZztcblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmZsZXgnKVxuICBASW5wdXQoKVxuICBwdWJsaWMgZ2V0IGZsZXgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZmxleDtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgZmxleCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgdGhpcy5fZmxleCA9ICcxIDEgYXV0byc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2ZsZXggPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICAvLyB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCAnZmxleCcpO1xuICB9XG59XG4iXX0=