import { NgSwitch } from '@angular/common';
import { Directive, Host, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class SwitchCasesDirective {
    constructor(viewContainer, templateRef, ngSwitch) {
        this.viewContainer = viewContainer;
        this.templateRef = templateRef;
        this._created = false;
        this.ngSwitch = ngSwitch;
    }
    ngOnInit() {
        (this.novoSwitchCases || []).forEach(() => this.ngSwitch._addCase());
    }
    ngDoCheck() {
        let enforce = false;
        (this.novoSwitchCases || []).forEach((value) => (enforce = this.ngSwitch._matchCase(value) || enforce));
        this.enforceState(enforce);
    }
    enforceState(created) {
        if (created && !this._created) {
            this._created = true;
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
        else if (!created && this._created) {
            this._created = false;
            this.viewContainer.clear();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SwitchCasesDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }, { token: i1.NgSwitch, host: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: SwitchCasesDirective, selector: "[novoSwitchCases]", inputs: { novoSwitchCases: "novoSwitchCases" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: SwitchCasesDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[novoSwitchCases]',
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }, { type: i1.NgSwitch, decorators: [{
                    type: Host
                }] }], propDecorators: { novoSwitchCases: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoLWNhc2VzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2NvbW1vbi9kaXJlY3RpdmVzL3N3aXRjaC1jYXNlcy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQVcsSUFBSSxFQUFFLEtBQUssRUFBVSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUt2RyxNQUFNLE9BQU8sb0JBQW9CO0lBTy9CLFlBQW9CLGFBQStCLEVBQVUsV0FBZ0MsRUFBVSxRQUFrQjtRQUFyRyxrQkFBYSxHQUFiLGFBQWEsQ0FBa0I7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBcUI7UUFMckYsYUFBUSxHQUFHLEtBQUssQ0FBQztRQU12QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRUQsUUFBUTtRQUNOLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDeEcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsWUFBWSxDQUFDLE9BQWdCO1FBQzNCLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFELENBQUM7YUFBTSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLENBQUM7SUFDSCxDQUFDOytHQTdCVSxvQkFBb0I7bUdBQXBCLG9CQUFvQjs7NEZBQXBCLG9CQUFvQjtrQkFIaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2lCQUM5Qjs7MEJBUWlHLElBQUk7eUNBRnBHLGVBQWU7c0JBRGQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nU3dpdGNoIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERpcmVjdGl2ZSwgRG9DaGVjaywgSG9zdCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25vdm9Td2l0Y2hDYXNlc10nLFxufSlcbmV4cG9ydCBjbGFzcyBTd2l0Y2hDYXNlc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjayB7XG4gIHByaXZhdGUgbmdTd2l0Y2g6IGFueTtcbiAgcHJpdmF0ZSBfY3JlYXRlZCA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIG5vdm9Td2l0Y2hDYXNlczogYW55W107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB2aWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLCBwcml2YXRlIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxPYmplY3Q+LCBASG9zdCgpIG5nU3dpdGNoOiBOZ1N3aXRjaCkge1xuICAgIHRoaXMubmdTd2l0Y2ggPSBuZ1N3aXRjaDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgICh0aGlzLm5vdm9Td2l0Y2hDYXNlcyB8fCBbXSkuZm9yRWFjaCgoKSA9PiB0aGlzLm5nU3dpdGNoLl9hZGRDYXNlKCkpO1xuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGxldCBlbmZvcmNlID0gZmFsc2U7XG4gICAgKHRoaXMubm92b1N3aXRjaENhc2VzIHx8IFtdKS5mb3JFYWNoKCh2YWx1ZSkgPT4gKGVuZm9yY2UgPSB0aGlzLm5nU3dpdGNoLl9tYXRjaENhc2UodmFsdWUpIHx8IGVuZm9yY2UpKTtcbiAgICB0aGlzLmVuZm9yY2VTdGF0ZShlbmZvcmNlKTtcbiAgfVxuXG4gIGVuZm9yY2VTdGF0ZShjcmVhdGVkOiBib29sZWFuKSB7XG4gICAgaWYgKGNyZWF0ZWQgJiYgIXRoaXMuX2NyZWF0ZWQpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy52aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzLnRlbXBsYXRlUmVmKTtcbiAgICB9IGVsc2UgaWYgKCFjcmVhdGVkICYmIHRoaXMuX2NyZWF0ZWQpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMudmlld0NvbnRhaW5lci5jbGVhcigpO1xuICAgIH1cbiAgfVxufVxuIl19