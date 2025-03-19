// tslint:disable: directive-selector
import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class BorderDirective {
    // @HostBinding('style.borderStyle') get getBorderStyle() {
    //   return this.border;
    // }
    // @HostBinding('style.borderWidth') get getBorderWidth() {
    //   return this.width;
    // }
    // @HostBinding('style.borderColor') get getBorderColor() {
    //   return this.borderColor;
    // }
    get hb_border() {
        return `border-${this.border}`;
    }
    get hb_border_left() {
        return this.borderLeft || this.bl || this.bx || this.borderX;
    }
    get hb_border_right() {
        return this.borderRight || this.bt || this.bx || this.borderX;
    }
    get hb_border_top() {
        return this.borderTop || this.bt || this.by || this.borderY;
    }
    get hb_border_bottom() {
        return this.borderBottom || this.bt || this.by || this.borderY;
    }
    constructor(el) {
        this.el = el;
        this.borderStyle = 'solid';
        this.borderColor = '#eaecef';
        this.borderWidth = 1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: BorderDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: BorderDirective, selector: "[border], [bb], [borderBottom], [bt], [borderTop], [bl], [borderLeft], [br], [borderRight], [bx], [borderX], [by], [borderY]", inputs: { borderStyle: "borderStyle", borderColor: "borderColor", borderWidth: "borderWidth", border: "border", borderLeft: "borderLeft", bl: "bl", borderRight: "borderRight", br: "br", borderTop: "borderTop", bt: "bt", borderBottom: "borderBottom", bb: "bb", borderX: "borderX", bx: "bx", borderY: "borderY", by: "by" }, host: { properties: { "class": "this.hb_border", "style.border-left": "this.hb_border_left", "style.border-right": "this.hb_border_right", "style.border-top": "this.hb_border_top", "style.border-bottom": "this.hb_border_bottom" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: BorderDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[border], [bb], [borderBottom], [bt], [borderTop], [bl], [borderLeft], [br], [borderRight], [bx], [borderX], [by], [borderY]',
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { borderStyle: [{
                type: Input
            }], borderColor: [{
                type: Input
            }], borderWidth: [{
                type: Input
            }], border: [{
                type: Input
            }], borderLeft: [{
                type: Input
            }], bl: [{
                type: Input
            }], borderRight: [{
                type: Input
            }], br: [{
                type: Input
            }], borderTop: [{
                type: Input
            }], bt: [{
                type: Input
            }], borderBottom: [{
                type: Input
            }], bb: [{
                type: Input
            }], borderX: [{
                type: Input
            }], bx: [{
                type: Input
            }], borderY: [{
                type: Input
            }], by: [{
                type: Input
            }], hb_border: [{
                type: HostBinding,
                args: ['class']
            }], hb_border_left: [{
                type: HostBinding,
                args: ['style.border-left']
            }], hb_border_right: [{
                type: HostBinding,
                args: ['style.border-right']
            }], hb_border_top: [{
                type: HostBinding,
                args: ['style.border-top']
            }], hb_border_bottom: [{
                type: HostBinding,
                args: ['style.border-bottom']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9yZGVyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2NvbW1vbi9kaXJlY3RpdmVzL2JvcmRlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUNBQXFDO0FBQ3JDLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSTFFLE1BQU0sT0FBTyxlQUFlO0lBbUIxQiwyREFBMkQ7SUFDM0Qsd0JBQXdCO0lBQ3hCLElBQUk7SUFFSiwyREFBMkQ7SUFDM0QsdUJBQXVCO0lBQ3ZCLElBQUk7SUFFSiwyREFBMkQ7SUFDM0QsNkJBQTZCO0lBQzdCLElBQUk7SUFFSixJQUEwQixTQUFTO1FBQ2pDLE9BQU8sVUFBVSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUNELElBQXNDLGNBQWM7UUFDbEQsT0FBTyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQy9ELENBQUM7SUFDRCxJQUF1QyxlQUFlO1FBQ3BELE9BQU8sSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNoRSxDQUFDO0lBQ0QsSUFBcUMsYUFBYTtRQUNoRCxPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDOUQsQ0FBQztJQUNELElBQXdDLGdCQUFnQjtRQUN0RCxPQUFPLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDakUsQ0FBQztJQUVELFlBQW9CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBOUN6QixnQkFBVyxHQUFHLE9BQU8sQ0FBQztRQUN0QixnQkFBVyxHQUFHLFNBQVMsQ0FBQztRQUN4QixnQkFBVyxHQUFHLENBQUMsQ0FBQztJQTRDWSxDQUFDOytHQS9DM0IsZUFBZTttR0FBZixlQUFlOzs0RkFBZixlQUFlO2tCQUgzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw4SEFBOEg7aUJBQ3pJOytFQUVVLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUVHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csRUFBRTtzQkFBVixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxFQUFFO3NCQUFWLEtBQUs7Z0JBY29CLFNBQVM7c0JBQWxDLFdBQVc7dUJBQUMsT0FBTztnQkFHa0IsY0FBYztzQkFBbkQsV0FBVzt1QkFBQyxtQkFBbUI7Z0JBR08sZUFBZTtzQkFBckQsV0FBVzt1QkFBQyxvQkFBb0I7Z0JBR0ksYUFBYTtzQkFBakQsV0FBVzt1QkFBQyxrQkFBa0I7Z0JBR1MsZ0JBQWdCO3NCQUF2RCxXQUFXO3VCQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlOiBkaXJlY3RpdmUtc2VsZWN0b3JcbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdEJpbmRpbmcsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYm9yZGVyXSwgW2JiXSwgW2JvcmRlckJvdHRvbV0sIFtidF0sIFtib3JkZXJUb3BdLCBbYmxdLCBbYm9yZGVyTGVmdF0sIFticl0sIFtib3JkZXJSaWdodF0sIFtieF0sIFtib3JkZXJYXSwgW2J5XSwgW2JvcmRlclldJyxcbn0pXG5leHBvcnQgY2xhc3MgQm9yZGVyRGlyZWN0aXZlIHtcbiAgQElucHV0KCkgYm9yZGVyU3R5bGUgPSAnc29saWQnO1xuICBASW5wdXQoKSBib3JkZXJDb2xvciA9ICcjZWFlY2VmJztcbiAgQElucHV0KCkgYm9yZGVyV2lkdGggPSAxO1xuXG4gIEBJbnB1dCgpIGJvcmRlcjogc3RyaW5nO1xuICBASW5wdXQoKSBib3JkZXJMZWZ0OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGJsOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGJvcmRlclJpZ2h0OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGJyOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGJvcmRlclRvcDogc3RyaW5nO1xuICBASW5wdXQoKSBidDogc3RyaW5nO1xuICBASW5wdXQoKSBib3JkZXJCb3R0b206IHN0cmluZztcbiAgQElucHV0KCkgYmI6IHN0cmluZztcbiAgQElucHV0KCkgYm9yZGVyWDogc3RyaW5nO1xuICBASW5wdXQoKSBieDogc3RyaW5nO1xuICBASW5wdXQoKSBib3JkZXJZOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGJ5OiBzdHJpbmc7XG5cbiAgLy8gQEhvc3RCaW5kaW5nKCdzdHlsZS5ib3JkZXJTdHlsZScpIGdldCBnZXRCb3JkZXJTdHlsZSgpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5ib3JkZXI7XG4gIC8vIH1cblxuICAvLyBASG9zdEJpbmRpbmcoJ3N0eWxlLmJvcmRlcldpZHRoJykgZ2V0IGdldEJvcmRlcldpZHRoKCkge1xuICAvLyAgIHJldHVybiB0aGlzLndpZHRoO1xuICAvLyB9XG5cbiAgLy8gQEhvc3RCaW5kaW5nKCdzdHlsZS5ib3JkZXJDb2xvcicpIGdldCBnZXRCb3JkZXJDb2xvcigpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5ib3JkZXJDb2xvcjtcbiAgLy8gfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBnZXQgaGJfYm9yZGVyKCkge1xuICAgIHJldHVybiBgYm9yZGVyLSR7dGhpcy5ib3JkZXJ9YDtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJvcmRlci1sZWZ0JykgZ2V0IGhiX2JvcmRlcl9sZWZ0KCkge1xuICAgIHJldHVybiB0aGlzLmJvcmRlckxlZnQgfHwgdGhpcy5ibCB8fCB0aGlzLmJ4IHx8IHRoaXMuYm9yZGVyWDtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJvcmRlci1yaWdodCcpIGdldCBoYl9ib3JkZXJfcmlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYm9yZGVyUmlnaHQgfHwgdGhpcy5idCB8fCB0aGlzLmJ4IHx8IHRoaXMuYm9yZGVyWDtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJvcmRlci10b3AnKSBnZXQgaGJfYm9yZGVyX3RvcCgpIHtcbiAgICByZXR1cm4gdGhpcy5ib3JkZXJUb3AgfHwgdGhpcy5idCB8fCB0aGlzLmJ5IHx8IHRoaXMuYm9yZGVyWTtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJvcmRlci1ib3R0b20nKSBnZXQgaGJfYm9yZGVyX2JvdHRvbSgpIHtcbiAgICByZXR1cm4gdGhpcy5ib3JkZXJCb3R0b20gfHwgdGhpcy5idCB8fCB0aGlzLmJ5IHx8IHRoaXMuYm9yZGVyWTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHt9XG59XG4iXX0=