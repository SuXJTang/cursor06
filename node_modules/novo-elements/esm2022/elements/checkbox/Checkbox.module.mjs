import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NovoCheckboxElement } from './Checkbox';
import { NovoCheckListElement } from './CheckList';
import * as i0 from "@angular/core";
export class NovoCheckboxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoCheckboxModule, declarations: [NovoCheckboxElement, NovoCheckListElement], imports: [CommonModule, A11yModule, FormsModule], exports: [NovoCheckboxElement, NovoCheckListElement] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCheckboxModule, imports: [CommonModule, A11yModule, FormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, A11yModule, FormsModule],
                    declarations: [NovoCheckboxElement, NovoCheckListElement],
                    exports: [NovoCheckboxElement, NovoCheckListElement],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hlY2tib3gubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvY2hlY2tib3gvQ2hlY2tib3gubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFPbkQsTUFBTSxPQUFPLGtCQUFrQjsrR0FBbEIsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBSGQsbUJBQW1CLEVBQUUsb0JBQW9CLGFBRDlDLFlBQVksRUFBRSxVQUFVLEVBQUUsV0FBVyxhQUVyQyxtQkFBbUIsRUFBRSxvQkFBb0I7Z0hBRXhDLGtCQUFrQixZQUpuQixZQUFZLEVBQUUsVUFBVSxFQUFFLFdBQVc7OzRGQUlwQyxrQkFBa0I7a0JBTDlCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUM7b0JBQ2hELFlBQVksRUFBRSxDQUFDLG1CQUFtQixFQUFFLG9CQUFvQixDQUFDO29CQUN6RCxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQztpQkFDckQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBMTF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE5vdm9DaGVja2JveEVsZW1lbnQgfSBmcm9tICcuL0NoZWNrYm94JztcbmltcG9ydCB7IE5vdm9DaGVja0xpc3RFbGVtZW50IH0gZnJvbSAnLi9DaGVja0xpc3QnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBBMTF5TW9kdWxlLCBGb3Jtc01vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW05vdm9DaGVja2JveEVsZW1lbnQsIE5vdm9DaGVja0xpc3RFbGVtZW50XSxcbiAgZXhwb3J0czogW05vdm9DaGVja2JveEVsZW1lbnQsIE5vdm9DaGVja0xpc3RFbGVtZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgTm92b0NoZWNrYm94TW9kdWxlIHt9XG4iXX0=