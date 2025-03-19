// tslint:disable: directive-selector
import { Directive, HostBinding, Input } from '@angular/core';
import * as tokens from 'novo-design-tokens';
import * as i0 from "@angular/core";
/*
Prop	CSS Property	Theme Field
m, margin	margin	space
mt, marginTop	margin-top	space
mr, marginRight	margin-right	space
mb, marginBottom	margin-bottom	space
ml, marginLeft	margin-left	space
mx	margin-left and margin-right	space
my	margin-top and margin-bottom	space
p, padding	padding	space
pt, paddingTop	padding-top	space
pr, paddingRight	padding-right	space
pb, paddingBottom	padding-bottom	space
pl, paddingLeft	padding-left	space
px	padding-left and padding-right	space
py	padding-top and padding-bottom	space
*/
/*
// Selectors generated with the following code
const directions = ['Top', 'Right', 'Bottom', 'Left', 'X', 'Y'];
const abbrDirections = directions.map((d) => d.slice(0, 1).toLowerCase());
const marginAttrs = [
  '[m]',
  '[margin]',
  ...directions.map((dir) => `[margin${dir}]`),
  ...abbrDirections.map((dir) => `[m${dir}]`),
];
const paddingAttrs = [
  '[p]',
  '[padding]',
  ...directions.map((dir) => `[padding${dir}]`),
  ...abbrDirections.map((dir) => `[p${dir}]`),
];

const selectors = [...marginAttrs, ...paddingAttrs];
*/
export const getSpacingToken = (value) => {
    if (Object.keys(tokens.spacing).includes(value)) {
        return tokens.spacing[value];
    }
    // TODO: Maybe Validate Value ie.(rem, px)
    return value;
};
export class MarginDirective {
    // @HostBinding('style.margin') get hb_margin() {
    //   return getSpacingToken(this.margin || this.m);
    // }
    get hb_margin() {
        return `margin-${this.margin || this.m}`;
    }
    get hb_margin_left() {
        return getSpacingToken(this.marginLeft || this.ml || this.mx || this.marginX);
    }
    get hb_margin_right() {
        return getSpacingToken(this.marginRight || this.mr || this.mx || this.marginX);
    }
    get hb_margin_top() {
        return getSpacingToken(this.marginTop || this.mt || this.my || this.marginY);
    }
    get hb_margin_bottom() {
        return getSpacingToken(this.marginBottom || this.mb || this.my || this.marginY);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MarginDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: MarginDirective, selector: "[m],[margin],[marginTop],[marginRight],[marginBottom],[marginLeft],[marginX],[marginY],[mt],[mr],[mb],[ml],[mx],[my]", inputs: { margin: "margin", m: "m", marginLeft: "marginLeft", ml: "ml", marginRight: "marginRight", mr: "mr", marginTop: "marginTop", mt: "mt", marginBottom: "marginBottom", mb: "mb", marginX: "marginX", mx: "mx", marginY: "marginY", my: "my" }, host: { properties: { "class": "this.hb_margin", "style.margin-left": "this.hb_margin_left", "style.margin-right": "this.hb_margin_right", "style.margin-top": "this.hb_margin_top", "style.margin-bottom": "this.hb_margin_bottom" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MarginDirective, decorators: [{
            type: Directive,
            args: [{
                    // tslint:disable-next-line: max-line-length
                    selector: '[m],[margin],[marginTop],[marginRight],[marginBottom],[marginLeft],[marginX],[marginY],[mt],[mr],[mb],[ml],[mx],[my]',
                }]
        }], propDecorators: { margin: [{
                type: Input
            }], m: [{
                type: Input
            }], marginLeft: [{
                type: Input
            }], ml: [{
                type: Input
            }], marginRight: [{
                type: Input
            }], mr: [{
                type: Input
            }], marginTop: [{
                type: Input
            }], mt: [{
                type: Input
            }], marginBottom: [{
                type: Input
            }], mb: [{
                type: Input
            }], marginX: [{
                type: Input
            }], mx: [{
                type: Input
            }], marginY: [{
                type: Input
            }], my: [{
                type: Input
            }], hb_margin: [{
                type: HostBinding,
                args: ['class']
            }], hb_margin_left: [{
                type: HostBinding,
                args: ['style.margin-left']
            }], hb_margin_right: [{
                type: HostBinding,
                args: ['style.margin-right']
            }], hb_margin_top: [{
                type: HostBinding,
                args: ['style.margin-top']
            }], hb_margin_bottom: [{
                type: HostBinding,
                args: ['style.margin-bottom']
            }] } });
export class PaddingDirective {
    get hb_padding() {
        return `padding-${this.padding || this.p}`;
    }
    // @HostBinding('class') get hb_padding() {
    //   return `padding-${this.padding || this.p}`;
    // }
    get hb_padding_left() {
        return getSpacingToken(this.paddingLeft || this.pl || this.px || this.paddingX);
    }
    get hb_padding_right() {
        return getSpacingToken(this.paddingRight || this.pr || this.px || this.paddingX);
    }
    get hb_padding_top() {
        return getSpacingToken(this.paddingTop || this.pt || this.py || this.paddingY);
    }
    get hb_padding_bottom() {
        return getSpacingToken(this.paddingBottom || this.pb || this.py || this.paddingY);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PaddingDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: PaddingDirective, selector: "[p],[padding],[paddingTop],[paddingRight],[paddingBottom],[paddingLeft],[paddingX],[paddingY],[pt],[pr],[pb],[pl],[px],[py]", inputs: { padding: "padding", p: "p", paddingLeft: "paddingLeft", pl: "pl", paddingRight: "paddingRight", pr: "pr", paddingTop: "paddingTop", pt: "pt", paddingBottom: "paddingBottom", pb: "pb", paddingX: "paddingX", px: "px", paddingY: "paddingY", py: "py" }, host: { properties: { "class": "this.hb_padding", "style.padding-left": "this.hb_padding_left", "style.padding-right": "this.hb_padding_right", "style.padding-top": "this.hb_padding_top", "style.padding-bottom": "this.hb_padding_bottom" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: PaddingDirective, decorators: [{
            type: Directive,
            args: [{
                    // tslint:disable-next-line: max-line-length
                    selector: '[p],[padding],[paddingTop],[paddingRight],[paddingBottom],[paddingLeft],[paddingX],[paddingY],[pt],[pr],[pb],[pl],[px],[py]',
                }]
        }], propDecorators: { padding: [{
                type: Input
            }], p: [{
                type: Input
            }], paddingLeft: [{
                type: Input
            }], pl: [{
                type: Input
            }], paddingRight: [{
                type: Input
            }], pr: [{
                type: Input
            }], paddingTop: [{
                type: Input
            }], pt: [{
                type: Input
            }], paddingBottom: [{
                type: Input
            }], pb: [{
                type: Input
            }], paddingX: [{
                type: Input
            }], px: [{
                type: Input
            }], paddingY: [{
                type: Input
            }], py: [{
                type: Input
            }], hb_padding: [{
                type: HostBinding,
                args: ['class']
            }], hb_padding_left: [{
                type: HostBinding,
                args: ['style.padding-left']
            }], hb_padding_right: [{
                type: HostBinding,
                args: ['style.padding-right']
            }], hb_padding_top: [{
                type: HostBinding,
                args: ['style.padding-top']
            }], hb_padding_bottom: [{
                type: HostBinding,
                args: ['style.padding-bottom']
            }] } });
export class GapDirective {
    get hb_gap() {
        return getSpacingToken(this.gap);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: GapDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: GapDirective, selector: "[gap]", inputs: { gap: "gap" }, host: { properties: { "style.gap": "this.hb_gap" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: GapDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[gap]',
                }]
        }], propDecorators: { gap: [{
                type: Input
            }], hb_gap: [{
                type: HostBinding,
                args: ['style.gap']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhY2UuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvY29tbW9uL2RpcmVjdGl2ZXMvc3BhY2UuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFDQUFxQztBQUNyQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxLQUFLLE1BQU0sTUFBTSxvQkFBb0IsQ0FBQzs7QUFDN0M7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0JFO0FBRUYsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7SUFDL0MsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNoRCxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELDBDQUEwQztJQUMxQyxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQU1GLE1BQU0sT0FBTyxlQUFlO0lBaUIxQixpREFBaUQ7SUFDakQsbURBQW1EO0lBQ25ELElBQUk7SUFDSixJQUEwQixTQUFTO1FBQ2pDLE9BQU8sVUFBVSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBc0MsY0FBYztRQUNsRCxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUNELElBQXVDLGVBQWU7UUFDcEQsT0FBTyxl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QkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFFb0IsVUFBVTtzQkFBbkMsV0FBVzt1QkFBQyxPQUFPO2dCQU9tQixlQUFlO3NCQUFyRCxXQUFXO3VCQUFDLG9CQUFvQjtnQkFHTyxnQkFBZ0I7c0JBQXZELFdBQVc7dUJBQUMscUJBQXFCO2dCQUdJLGNBQWM7c0JBQW5ELFdBQVc7dUJBQUMsbUJBQW1CO2dCQUdTLGlCQUFpQjtzQkFBekQsV0FBVzt1QkFBQyxzQkFBc0I7O0FBUXJDLE1BQU0sT0FBTyxZQUFZO0lBR3ZCLElBQ0ksTUFBTTtRQUNSLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQyxDQUFDOytHQU5VLFlBQVk7bUdBQVosWUFBWTs7NEZBQVosWUFBWTtrQkFIeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsT0FBTztpQkFDbEI7OEJBRVUsR0FBRztzQkFBWCxLQUFLO2dCQUdGLE1BQU07c0JBRFQsV0FBVzt1QkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHNsaW50OmRpc2FibGU6IGRpcmVjdGl2ZS1zZWxlY3RvclxuaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0QmluZGluZywgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIHRva2VucyBmcm9tICdub3ZvLWRlc2lnbi10b2tlbnMnO1xuLypcblByb3BcdENTUyBQcm9wZXJ0eVx0VGhlbWUgRmllbGRcbm0sIG1hcmdpblx0bWFyZ2luXHRzcGFjZVxubXQsIG1hcmdpblRvcFx0bWFyZ2luLXRvcFx0c3BhY2Vcbm1yLCBtYXJnaW5SaWdodFx0bWFyZ2luLXJpZ2h0XHRzcGFjZVxubWIsIG1hcmdpbkJvdHRvbVx0bWFyZ2luLWJvdHRvbVx0c3BhY2Vcbm1sLCBtYXJnaW5MZWZ0XHRtYXJnaW4tbGVmdFx0c3BhY2Vcbm14XHRtYXJnaW4tbGVmdCBhbmQgbWFyZ2luLXJpZ2h0XHRzcGFjZVxubXlcdG1hcmdpbi10b3AgYW5kIG1hcmdpbi1ib3R0b21cdHNwYWNlXG5wLCBwYWRkaW5nXHRwYWRkaW5nXHRzcGFjZVxucHQsIHBhZGRpbmdUb3BcdHBhZGRpbmctdG9wXHRzcGFjZVxucHIsIHBhZGRpbmdSaWdodFx0cGFkZGluZy1yaWdodFx0c3BhY2VcbnBiLCBwYWRkaW5nQm90dG9tXHRwYWRkaW5nLWJvdHRvbVx0c3BhY2VcbnBsLCBwYWRkaW5nTGVmdFx0cGFkZGluZy1sZWZ0XHRzcGFjZVxucHhcdHBhZGRpbmctbGVmdCBhbmQgcGFkZGluZy1yaWdodFx0c3BhY2VcbnB5XHRwYWRkaW5nLXRvcCBhbmQgcGFkZGluZy1ib3R0b21cdHNwYWNlXG4qL1xuXG4vKlxuLy8gU2VsZWN0b3JzIGdlbmVyYXRlZCB3aXRoIHRoZSBmb2xsb3dpbmcgY29kZVxuY29uc3QgZGlyZWN0aW9ucyA9IFsnVG9wJywgJ1JpZ2h0JywgJ0JvdHRvbScsICdMZWZ0JywgJ1gnLCAnWSddO1xuY29uc3QgYWJickRpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLm1hcCgoZCkgPT4gZC5zbGljZSgwLCAxKS50b0xvd2VyQ2FzZSgpKTtcbmNvbnN0IG1hcmdpbkF0dHJzID0gW1xuICAnW21dJyxcbiAgJ1ttYXJnaW5dJyxcbiAgLi4uZGlyZWN0aW9ucy5tYXAoKGRpcikgPT4gYFttYXJnaW4ke2Rpcn1dYCksXG4gIC4uLmFiYnJEaXJlY3Rpb25zLm1hcCgoZGlyKSA9PiBgW20ke2Rpcn1dYCksXG5dO1xuY29uc3QgcGFkZGluZ0F0dHJzID0gW1xuICAnW3BdJyxcbiAgJ1twYWRkaW5nXScsXG4gIC4uLmRpcmVjdGlvbnMubWFwKChkaXIpID0+IGBbcGFkZGluZyR7ZGlyfV1gKSxcbiAgLi4uYWJickRpcmVjdGlvbnMubWFwKChkaXIpID0+IGBbcCR7ZGlyfV1gKSxcbl07XG5cbmNvbnN0IHNlbGVjdG9ycyA9IFsuLi5tYXJnaW5BdHRycywgLi4ucGFkZGluZ0F0dHJzXTtcbiovXG5cbmV4cG9ydCBjb25zdCBnZXRTcGFjaW5nVG9rZW4gPSAodmFsdWU6IHN0cmluZykgPT4ge1xuICBpZiAoT2JqZWN0LmtleXModG9rZW5zLnNwYWNpbmcpLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgIHJldHVybiB0b2tlbnMuc3BhY2luZ1t2YWx1ZV07XG4gIH1cbiAgLy8gVE9ETzogTWF5YmUgVmFsaWRhdGUgVmFsdWUgaWUuKHJlbSwgcHgpXG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG1heC1saW5lLWxlbmd0aFxuICBzZWxlY3RvcjogJ1ttXSxbbWFyZ2luXSxbbWFyZ2luVG9wXSxbbWFyZ2luUmlnaHRdLFttYXJnaW5Cb3R0b21dLFttYXJnaW5MZWZ0XSxbbWFyZ2luWF0sW21hcmdpblldLFttdF0sW21yXSxbbWJdLFttbF0sW214XSxbbXldJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFyZ2luRGlyZWN0aXZlIHtcbiAgLy8gTWFyZ2luXG4gIEBJbnB1dCgpIG1hcmdpbjogc3RyaW5nO1xuICBASW5wdXQoKSBtOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG1hcmdpbkxlZnQ6IHN0cmluZztcbiAgQElucHV0KCkgbWw6IHN0cmluZztcbiAgQElucHV0KCkgbWFyZ2luUmlnaHQ6IHN0cmluZztcbiAgQElucHV0KCkgbXI6IHN0cmluZztcbiAgQElucHV0KCkgbWFyZ2luVG9wOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG10OiBzdHJpbmc7XG4gIEBJbnB1dCgpIG1hcmdpbkJvdHRvbTogc3RyaW5nO1xuICBASW5wdXQoKSBtYjogc3RyaW5nO1xuICBASW5wdXQoKSBtYXJnaW5YOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG14OiBzdHJpbmc7XG4gIEBJbnB1dCgpIG1hcmdpblk6IHN0cmluZztcbiAgQElucHV0KCkgbXk6IHN0cmluZztcblxuICAvLyBASG9zdEJpbmRpbmcoJ3N0eWxlLm1hcmdpbicpIGdldCBoYl9tYXJnaW4oKSB7XG4gIC8vICAgcmV0dXJuIGdldFNwYWNpbmdUb2tlbih0aGlzLm1hcmdpbiB8fCB0aGlzLm0pO1xuICAvLyB9XG4gIEBIb3N0QmluZGluZygnY2xhc3MnKSBnZXQgaGJfbWFyZ2luKCkge1xuICAgIHJldHVybiBgbWFyZ2luLSR7dGhpcy5tYXJnaW4gfHwgdGhpcy5tfWA7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLm1hcmdpbi1sZWZ0JykgZ2V0IGhiX21hcmdpbl9sZWZ0KCkge1xuICAgIHJldHVybiBnZXRTcGFjaW5nVG9rZW4odGhpcy5tYXJnaW5MZWZ0IHx8IHRoaXMubWwgfHwgdGhpcy5teCB8fCB0aGlzLm1hcmdpblgpO1xuICB9XG4gIEBIb3N0QmluZGluZygnc3R5bGUubWFyZ2luLXJpZ2h0JykgZ2V0IGhiX21hcmdpbl9yaWdodCgpIHtcbiAgICByZXR1cm4gZ2V0U3BhY2luZ1Rva2VuKHRoaXMubWFyZ2luUmlnaHQgfHwgdGhpcy5tciB8fCB0aGlzLm14IHx8IHRoaXMubWFyZ2luWCk7XG4gIH1cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5tYXJnaW4tdG9wJykgZ2V0IGhiX21hcmdpbl90b3AoKSB7XG4gICAgcmV0dXJuIGdldFNwYWNpbmdUb2tlbih0aGlzLm1hcmdpblRvcCB8fCB0aGlzLm10IHx8IHRoaXMubXkgfHwgdGhpcy5tYXJnaW5ZKTtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLm1hcmdpbi1ib3R0b20nKSBnZXQgaGJfbWFyZ2luX2JvdHRvbSgpIHtcbiAgICByZXR1cm4gZ2V0U3BhY2luZ1Rva2VuKHRoaXMubWFyZ2luQm90dG9tIHx8IHRoaXMubWIgfHwgdGhpcy5teSB8fCB0aGlzLm1hcmdpblkpO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG1heC1saW5lLWxlbmd0aFxuICBzZWxlY3RvcjogJ1twXSxbcGFkZGluZ10sW3BhZGRpbmdUb3BdLFtwYWRkaW5nUmlnaHRdLFtwYWRkaW5nQm90dG9tXSxbcGFkZGluZ0xlZnRdLFtwYWRkaW5nWF0sW3BhZGRpbmdZXSxbcHRdLFtwcl0sW3BiXSxbcGxdLFtweF0sW3B5XScsXG59KVxuZXhwb3J0IGNsYXNzIFBhZGRpbmdEaXJlY3RpdmUge1xuICAvLyBQYWRkaW5nXG4gIEBJbnB1dCgpIHBhZGRpbmc6IHN0cmluZztcbiAgQElucHV0KCkgcDogc3RyaW5nO1xuICBASW5wdXQoKSBwYWRkaW5nTGVmdDogc3RyaW5nO1xuICBASW5wdXQoKSBwbDogc3RyaW5nO1xuICBASW5wdXQoKSBwYWRkaW5nUmlnaHQ6IHN0cmluZztcbiAgQElucHV0KCkgcHI6IHN0cmluZztcbiAgQElucHV0KCkgcGFkZGluZ1RvcDogc3RyaW5nO1xuICBASW5wdXQoKSBwdDogc3RyaW5nO1xuICBASW5wdXQoKSBwYWRkaW5nQm90dG9tOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHBiOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHBhZGRpbmdYOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHB4OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHBhZGRpbmdZOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHB5OiBzdHJpbmc7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpIGdldCBoYl9wYWRkaW5nKCkge1xuICAgIHJldHVybiBgcGFkZGluZy0ke3RoaXMucGFkZGluZyB8fCB0aGlzLnB9YDtcbiAgfVxuICAvLyBASG9zdEJpbmRpbmcoJ2NsYXNzJykgZ2V0IGhiX3BhZGRpbmcoKSB7XG4gIC8vICAgcmV0dXJuIGBwYWRkaW5nLSR7dGhpcy5wYWRkaW5nIHx8IHRoaXMucH1gO1xuICAvLyB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5wYWRkaW5nLWxlZnQnKSBnZXQgaGJfcGFkZGluZ19sZWZ0KCkge1xuICAgIHJldHVybiBnZXRTcGFjaW5nVG9rZW4odGhpcy5wYWRkaW5nTGVmdCB8fCB0aGlzLnBsIHx8IHRoaXMucHggfHwgdGhpcy5wYWRkaW5nWCk7XG4gIH1cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5wYWRkaW5nLXJpZ2h0JykgZ2V0IGhiX3BhZGRpbmdfcmlnaHQoKSB7XG4gICAgcmV0dXJuIGdldFNwYWNpbmdUb2tlbih0aGlzLnBhZGRpbmdSaWdodCB8fCB0aGlzLnByIHx8IHRoaXMucHggfHwgdGhpcy5wYWRkaW5nWCk7XG4gIH1cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5wYWRkaW5nLXRvcCcpIGdldCBoYl9wYWRkaW5nX3RvcCgpIHtcbiAgICByZXR1cm4gZ2V0U3BhY2luZ1Rva2VuKHRoaXMucGFkZGluZ1RvcCB8fCB0aGlzLnB0IHx8IHRoaXMucHkgfHwgdGhpcy5wYWRkaW5nWSk7XG4gIH1cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5wYWRkaW5nLWJvdHRvbScpIGdldCBoYl9wYWRkaW5nX2JvdHRvbSgpIHtcbiAgICByZXR1cm4gZ2V0U3BhY2luZ1Rva2VuKHRoaXMucGFkZGluZ0JvdHRvbSB8fCB0aGlzLnBiIHx8IHRoaXMucHkgfHwgdGhpcy5wYWRkaW5nWSk7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2dhcF0nLFxufSlcbmV4cG9ydCBjbGFzcyBHYXBEaXJlY3RpdmUge1xuICBASW5wdXQoKSBnYXA6IHN0cmluZztcblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmdhcCcpXG4gIGdldCBoYl9nYXAoKSB7XG4gICAgcmV0dXJuIGdldFNwYWNpbmdUb2tlbih0aGlzLmdhcCk7XG4gIH1cbn1cbiJdfQ==