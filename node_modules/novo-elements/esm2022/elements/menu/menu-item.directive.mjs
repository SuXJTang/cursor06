import { ContentChild, Directive, ElementRef, Input, TemplateRef } from '@angular/core';
import { NovoOption } from 'novo-elements/elements/common';
import * as i0 from "@angular/core";
/**
 * This is a structural directive now.  Should only be used on `novo-options`
 */
export class MenuItemDirective {
    constructor(template, elementRef) {
        this.template = template;
        this.elementRef = elementRef;
        this.menuItemEnabled = true;
        this.menuItemVisible = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MenuItemDirective, deps: [{ token: i0.TemplateRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: MenuItemDirective, selector: "[menuItem]", inputs: { menuItemEnabled: "menuItemEnabled", menuItemVisible: "menuItemVisible" }, queries: [{ propertyName: "optionRef", first: true, predicate: NovoOption, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MenuItemDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[menuItem]',
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.ElementRef }], propDecorators: { menuItemEnabled: [{
                type: Input
            }], menuItemVisible: [{
                type: Input
            }], optionRef: [{
                type: ContentChild,
                args: [NovoOption]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL21lbnUvbWVudS1pdGVtLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sK0JBQStCLENBQUM7O0FBRTNEOztHQUVHO0FBSUgsTUFBTSxPQUFPLGlCQUFpQjtJQVE1QixZQUFtQixRQUFvQyxFQUFTLFVBQXNCO1FBQW5FLGFBQVEsR0FBUixRQUFRLENBQTRCO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQVB0RSxvQkFBZSxHQUF1QyxJQUFJLENBQUM7UUFDM0Qsb0JBQWUsR0FBdUMsSUFBSSxDQUFDO0lBTWMsQ0FBQzsrR0FSL0UsaUJBQWlCO21HQUFqQixpQkFBaUIsNktBSWQsVUFBVTs7NEZBSmIsaUJBQWlCO2tCQUg3QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO2lCQUN2Qjt5R0FFaUIsZUFBZTtzQkFBOUIsS0FBSztnQkFDVSxlQUFlO3NCQUE5QixLQUFLO2dCQUVvQixTQUFTO3NCQUFsQyxZQUFZO3VCQUFDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250ZW50Q2hpbGQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOb3ZvT3B0aW9uIH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy9jb21tb24nO1xuXG4vKipcbiAqIFRoaXMgaXMgYSBzdHJ1Y3R1cmFsIGRpcmVjdGl2ZSBub3cuICBTaG91bGQgb25seSBiZSB1c2VkIG9uIGBub3ZvLW9wdGlvbnNgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttZW51SXRlbV0nLFxufSlcbmV4cG9ydCBjbGFzcyBNZW51SXRlbURpcmVjdGl2ZSB7XG4gIEBJbnB1dCgpIHB1YmxpYyBtZW51SXRlbUVuYWJsZWQ6IGJvb2xlYW4gfCAoKGl0ZW06IGFueSkgPT4gYm9vbGVhbikgPSB0cnVlO1xuICBASW5wdXQoKSBwdWJsaWMgbWVudUl0ZW1WaXNpYmxlOiBib29sZWFuIHwgKChpdGVtOiBhbnkpID0+IGJvb2xlYW4pID0gdHJ1ZTtcblxuICBAQ29udGVudENoaWxkKE5vdm9PcHRpb24pIG9wdGlvblJlZjogTm92b09wdGlvbjtcblxuICBwdWJsaWMgY3VycmVudEl0ZW06IGFueTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPHsgaXRlbTogYW55IH0+LCBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cbiJdfQ==