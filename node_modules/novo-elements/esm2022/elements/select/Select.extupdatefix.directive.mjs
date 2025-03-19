import { Directive, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NovoSelectElement } from './Select';
import * as i0 from "@angular/core";
/**
 * Fixes a <novo-select> element so that if its value is updated externally, the checkboxes in the dropdown selector
 * update accordingly. Because this is a functionality change to a core control, this fix is provided as a directive
 * to only be used if needed.
 */
export class NovoSelectExtUpdateFix {
    constructor() {
        this.control = inject(NgControl);
        this.selectElement = inject(NovoSelectElement);
    }
    ngOnInit() {
        if (this.control?.control && 'registerOnChange' in this.control.control) {
            this.control.control.registerOnChange((rawValue, viewToModelUpdate) => {
                if (this.selectElement.multiple === Array.isArray(rawValue)) {
                    this.afterExternalUpdate(rawValue);
                }
            });
        }
    }
    afterExternalUpdate(rawValue) {
        this.selectElement['_setSelectionByValue'](rawValue);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSelectExtUpdateFix, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: NovoSelectExtUpdateFix, selector: "novo-select[extupdatefix]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSelectExtUpdateFix, decorators: [{
            type: Directive,
            args: [{
                    selector: 'novo-select[extupdatefix]'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0LmV4dHVwZGF0ZWZpeC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9zZWxlY3QvU2VsZWN0LmV4dHVwZGF0ZWZpeC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUQsT0FBTyxFQUFlLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFFN0M7Ozs7R0FJRztBQUlILE1BQU0sT0FBTyxzQkFBc0I7SUFIbkM7UUFJRSxZQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVCLGtCQUFhLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FlM0M7SUFiQyxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxrQkFBa0IsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxFQUFFO2dCQUNyRixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztvQkFDNUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVELG1CQUFtQixDQUFDLFFBQWE7UUFDL0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7K0dBaEJVLHNCQUFzQjttR0FBdEIsc0JBQXNCOzs0RkFBdEIsc0JBQXNCO2tCQUhsQyxTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBPbkluaXQsIGluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE5vdm9TZWxlY3RFbGVtZW50IH0gZnJvbSAnLi9TZWxlY3QnO1xuXG4vKipcbiAqIEZpeGVzIGEgPG5vdm8tc2VsZWN0PiBlbGVtZW50IHNvIHRoYXQgaWYgaXRzIHZhbHVlIGlzIHVwZGF0ZWQgZXh0ZXJuYWxseSwgdGhlIGNoZWNrYm94ZXMgaW4gdGhlIGRyb3Bkb3duIHNlbGVjdG9yXG4gKiB1cGRhdGUgYWNjb3JkaW5nbHkuIEJlY2F1c2UgdGhpcyBpcyBhIGZ1bmN0aW9uYWxpdHkgY2hhbmdlIHRvIGEgY29yZSBjb250cm9sLCB0aGlzIGZpeCBpcyBwcm92aWRlZCBhcyBhIGRpcmVjdGl2ZVxuICogdG8gb25seSBiZSB1c2VkIGlmIG5lZWRlZC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdub3ZvLXNlbGVjdFtleHR1cGRhdGVmaXhdJ1xufSlcbmV4cG9ydCBjbGFzcyBOb3ZvU2VsZWN0RXh0VXBkYXRlRml4IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY29udHJvbCA9IGluamVjdChOZ0NvbnRyb2wpO1xuICBzZWxlY3RFbGVtZW50ID0gaW5qZWN0KE5vdm9TZWxlY3RFbGVtZW50KTtcblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5jb250cm9sPy5jb250cm9sICYmICdyZWdpc3Rlck9uQ2hhbmdlJyBpbiB0aGlzLmNvbnRyb2wuY29udHJvbCkge1xuICAgICAgKHRoaXMuY29udHJvbC5jb250cm9sIGFzIEZvcm1Db250cm9sKS5yZWdpc3Rlck9uQ2hhbmdlKChyYXdWYWx1ZSwgdmlld1RvTW9kZWxVcGRhdGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0RWxlbWVudC5tdWx0aXBsZSA9PT0gQXJyYXkuaXNBcnJheShyYXdWYWx1ZSkpIHtcbiAgICAgICAgICB0aGlzLmFmdGVyRXh0ZXJuYWxVcGRhdGUocmF3VmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhZnRlckV4dGVybmFsVXBkYXRlKHJhd1ZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnNlbGVjdEVsZW1lbnRbJ19zZXRTZWxlY3Rpb25CeVZhbHVlJ10ocmF3VmFsdWUpO1xuICB9XG59Il19