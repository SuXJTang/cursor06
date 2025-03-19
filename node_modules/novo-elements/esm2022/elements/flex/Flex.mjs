// NG2
import { Component, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class NovoFlexElement {
    constructor() {
        this.direction = 'row';
        this.align = 'center';
        this.justify = 'flex-start';
        this.wrap = 'nowrap';
    }
    get display() {
        return 'flex';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFlexElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoFlexElement, selector: "novo-flex,novo-row", inputs: { direction: "direction", align: "align", justify: "justify", wrap: "wrap", gap: "gap" }, host: { properties: { "style.display": "this.display", "style.flex-direction": "this.direction", "style.align-items": "this.align", "style.justify-content": "this.justify", "style.flex-wrap": "this.wrap", "style.gap": "this.gap" } }, ngImport: i0, template: ` <ng-content></ng-content> `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFlexElement, decorators: [{
            type: Component,
            args: [{
                    selector: 'novo-flex,novo-row',
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
export class NovoStackElement extends NovoFlexElement {
    constructor() {
        super(...arguments);
        this.direction = 'column';
        this.align = 'start';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoStackElement, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoStackElement, selector: "novo-stack,novo-column", inputs: { direction: "direction", align: "align" }, host: { properties: { "style.flex-direction": "this.direction", "style.align-items": "this.align" } }, usesInheritance: true, ngImport: i0, template: ` <ng-content></ng-content> `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoStackElement, decorators: [{
            type: Component,
            args: [{
                    selector: 'novo-stack,novo-column',
                    template: ` <ng-content></ng-content> `,
                }]
        }], propDecorators: { direction: [{
                type: HostBinding,
                args: ['style.flex-direction']
            }, {
                type: Input
            }], align: [{
                type: HostBinding,
                args: ['style.align-items']
            }, {
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmxleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2ZsZXgvRmxleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQU05RCxNQUFNLE9BQU8sZUFBZTtJQUo1QjtRQVlFLGNBQVMsR0FBVyxLQUFLLENBQUM7UUFJMUIsVUFBSyxHQUFXLFFBQVEsQ0FBQztRQUl6QixZQUFPLEdBQVcsWUFBWSxDQUFDO1FBSS9CLFNBQUksR0FBVyxRQUFRLENBQUM7S0FTekI7SUE1QkMsSUFDSSxPQUFPO1FBQ1QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzsrR0FKVSxlQUFlO21HQUFmLGVBQWUsc1lBRmhCLDZCQUE2Qjs7NEZBRTVCLGVBQWU7a0JBSjNCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsUUFBUSxFQUFFLDZCQUE2QjtpQkFDeEM7OEJBR0ssT0FBTztzQkFEVixXQUFXO3VCQUFDLGVBQWU7Z0JBTzVCLFNBQVM7c0JBRlIsV0FBVzt1QkFBQyxzQkFBc0I7O3NCQUNsQyxLQUFLO2dCQUtOLEtBQUs7c0JBRkosV0FBVzt1QkFBQyxtQkFBbUI7O3NCQUMvQixLQUFLO2dCQUtOLE9BQU87c0JBRk4sV0FBVzt1QkFBQyx1QkFBdUI7O3NCQUNuQyxLQUFLO2dCQUtOLElBQUk7c0JBRkgsV0FBVzt1QkFBQyxpQkFBaUI7O3NCQUM3QixLQUFLO2dCQUtOLEdBQUc7c0JBRkYsV0FBVzt1QkFBQyxXQUFXOztzQkFDdkIsS0FBSzs7QUFZUixNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZUFBZTtJQUpyRDs7UUFPRSxjQUFTLEdBQVcsUUFBUSxDQUFDO1FBSTdCLFVBQUssR0FBVyxPQUFPLENBQUM7S0FDekI7K0dBUlksZ0JBQWdCO21HQUFoQixnQkFBZ0IsZ1BBRmpCLDZCQUE2Qjs7NEZBRTVCLGdCQUFnQjtrQkFKNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxRQUFRLEVBQUUsNkJBQTZCO2lCQUN4Qzs4QkFJQyxTQUFTO3NCQUZSLFdBQVc7dUJBQUMsc0JBQXNCOztzQkFDbEMsS0FBSztnQkFLTixLQUFLO3NCQUZKLFdBQVc7dUJBQUMsbUJBQW1COztzQkFDL0IsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8vIE5HMlxuaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0QmluZGluZywgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1mbGV4LG5vdm8tcm93JyxcbiAgdGVtcGxhdGU6IGAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiBgLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvRmxleEVsZW1lbnQge1xuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmRpc3BsYXknKVxuICBnZXQgZGlzcGxheSgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnZmxleCc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmZsZXgtZGlyZWN0aW9uJylcbiAgQElucHV0KClcbiAgZGlyZWN0aW9uOiBzdHJpbmcgPSAncm93JztcblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmFsaWduLWl0ZW1zJylcbiAgQElucHV0KClcbiAgYWxpZ246IHN0cmluZyA9ICdjZW50ZXInO1xuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuanVzdGlmeS1jb250ZW50JylcbiAgQElucHV0KClcbiAganVzdGlmeTogc3RyaW5nID0gJ2ZsZXgtc3RhcnQnO1xuXG4gIEBIb3N0QmluZGluZygnc3R5bGUuZmxleC13cmFwJylcbiAgQElucHV0KClcbiAgd3JhcDogc3RyaW5nID0gJ25vd3JhcCc7XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5nYXAnKVxuICBASW5wdXQoKVxuICBnYXA6IHN0cmluZztcblxuICAvLyBnZXQgaGJfZ3JpZENvbHMoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuX3Nhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0U3R5bGUoYHJlcGVhdCgke3RoaXMuY29sdW1uc30sICR7UmVzb3VyY2VTZXR0aW5ncy5ldmVudFdpZHRofSlgKTtcbiAgLy8gfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdub3ZvLXN0YWNrLG5vdm8tY29sdW1uJyxcbiAgdGVtcGxhdGU6IGAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiBgLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvU3RhY2tFbGVtZW50IGV4dGVuZHMgTm92b0ZsZXhFbGVtZW50IHtcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5mbGV4LWRpcmVjdGlvbicpXG4gIEBJbnB1dCgpXG4gIGRpcmVjdGlvbjogc3RyaW5nID0gJ2NvbHVtbic7XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5hbGlnbi1pdGVtcycpXG4gIEBJbnB1dCgpXG4gIGFsaWduOiBzdHJpbmcgPSAnc3RhcnQnO1xufVxuIl19