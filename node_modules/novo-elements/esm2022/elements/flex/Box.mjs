// NG2
import { Component, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class NovoBoxElement {
    constructor() {
        this.direction = 'row';
        this.align = 'center';
        this.justify = 'flex-start';
        this.wrap = 'nowrap';
    }
    get display() {
        return 'block';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoBoxElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoBoxElement, selector: "novo-box", inputs: { direction: "direction", align: "align", justify: "justify", wrap: "wrap", gap: "gap" }, host: { properties: { "style.display": "this.display", "style.flex-direction": "this.direction", "style.align-items": "this.align", "style.justify-content": "this.justify", "style.flex-wrap": "this.wrap", "style.gap": "this.gap" } }, ngImport: i0, template: ` <ng-content></ng-content> `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoBoxElement, decorators: [{
            type: Component,
            args: [{
                    selector: 'novo-box',
                    template: ` <ng-content></ng-content> `,
                }]
        }], propDecorators: { display: [{
                type: HostBinding,
                args: ['style.display']
            }], direction: [{
                type: HostBinding,
                args: ['style.flex-direction']
            }, {
                type: Input
            }], align: [{
                type: HostBinding,
                args: ['style.align-items']
            }, {
                type: Input
            }], justify: [{
                type: HostBinding,
                args: ['style.justify-content']
            }, {
                type: Input
            }], wrap: [{
                type: HostBinding,
                args: ['style.flex-wrap']
            }, {
                type: Input
            }], gap: [{
                type: HostBinding,
                args: ['style.gap']
            }, {
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvZmxleC9Cb3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTTtBQUNOLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFNOUQsTUFBTSxPQUFPLGNBQWM7SUFKM0I7UUFZRSxjQUFTLEdBQVcsS0FBSyxDQUFDO1FBSTFCLFVBQUssR0FBVyxRQUFRLENBQUM7UUFJekIsWUFBTyxHQUFXLFlBQVksQ0FBQztRQUkvQixTQUFJLEdBQVcsUUFBUSxDQUFDO0tBU3pCO0lBNUJDLElBQ0ksT0FBTztRQUNULE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7K0dBSlUsY0FBYzttR0FBZCxjQUFjLDRYQUZmLDZCQUE2Qjs7NEZBRTVCLGNBQWM7a0JBSjFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFFBQVEsRUFBRSw2QkFBNkI7aUJBQ3hDOzhCQUdLLE9BQU87c0JBRFYsV0FBVzt1QkFBQyxlQUFlO2dCQU81QixTQUFTO3NCQUZSLFdBQVc7dUJBQUMsc0JBQXNCOztzQkFDbEMsS0FBSztnQkFLTixLQUFLO3NCQUZKLFdBQVc7dUJBQUMsbUJBQW1COztzQkFDL0IsS0FBSztnQkFLTixPQUFPO3NCQUZOLFdBQVc7dUJBQUMsdUJBQXVCOztzQkFDbkMsS0FBSztnQkFLTixJQUFJO3NCQUZILFdBQVc7dUJBQUMsaUJBQWlCOztzQkFDN0IsS0FBSztnQkFLTixHQUFHO3NCQUZGLFdBQVc7dUJBQUMsV0FBVzs7c0JBQ3ZCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBORzJcbmltcG9ydCB7IENvbXBvbmVudCwgSG9zdEJpbmRpbmcsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25vdm8tYm94JyxcbiAgdGVtcGxhdGU6IGAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiBgLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvQm94RWxlbWVudCB7XG4gIEBIb3N0QmluZGluZygnc3R5bGUuZGlzcGxheScpXG4gIGdldCBkaXNwbGF5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICdibG9jayc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmZsZXgtZGlyZWN0aW9uJylcbiAgQElucHV0KClcbiAgZGlyZWN0aW9uOiBzdHJpbmcgPSAncm93JztcblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmFsaWduLWl0ZW1zJylcbiAgQElucHV0KClcbiAgYWxpZ246IHN0cmluZyA9ICdjZW50ZXInO1xuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuanVzdGlmeS1jb250ZW50JylcbiAgQElucHV0KClcbiAganVzdGlmeTogc3RyaW5nID0gJ2ZsZXgtc3RhcnQnO1xuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuZmxleC13cmFwJylcbiAgQElucHV0KClcbiAgd3JhcDogc3RyaW5nID0gJ25vd3JhcCc7XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5nYXAnKVxuICBASW5wdXQoKVxuICBnYXA6IHN0cmluZztcblxuICAvLyBnZXQgaGJfZ3JpZENvbHMoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuX3Nhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0U3R5bGUoYHJlcGVhdCgke3RoaXMuY29sdW1uc30sICR7UmVzb3VyY2VTZXR0aW5ncy5ldmVudFdpZHRofSlgKTtcbiAgLy8gfVxufVxuIl19