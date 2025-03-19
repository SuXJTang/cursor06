// NG2
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// APP
import { NovoIsLoadingDirective, NovoLoadedDirective, NovoLoadingElement, NovoSkeletonDirective, NovoSpinnerElement } from './Loading';
import * as i0 from "@angular/core";
export class NovoLoadingModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoLoadingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoLoadingModule, declarations: [NovoLoadingElement, NovoSpinnerElement, NovoIsLoadingDirective, NovoLoadedDirective, NovoSkeletonDirective], imports: [CommonModule], exports: [NovoLoadingElement, NovoSpinnerElement, NovoIsLoadingDirective, NovoLoadedDirective, NovoSkeletonDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoLoadingModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoLoadingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [NovoLoadingElement, NovoSpinnerElement, NovoIsLoadingDirective, NovoLoadedDirective, NovoSkeletonDirective],
                    exports: [NovoLoadingElement, NovoSpinnerElement, NovoIsLoadingDirective, NovoLoadedDirective, NovoSkeletonDirective],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9hZGluZy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9sb2FkaW5nL0xvYWRpbmcubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU07QUFDTixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxNQUFNO0FBQ04sT0FBTyxFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLGtCQUFrQixFQUFFLHFCQUFxQixFQUFFLGtCQUFrQixFQUFFLE1BQU0sV0FBVyxDQUFDOztBQU92SSxNQUFNLE9BQU8saUJBQWlCOytHQUFqQixpQkFBaUI7Z0hBQWpCLGlCQUFpQixpQkFIYixrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsYUFEL0csWUFBWSxhQUVaLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLHFCQUFxQjtnSEFFekcsaUJBQWlCLFlBSmxCLFlBQVk7OzRGQUlYLGlCQUFpQjtrQkFMN0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLG1CQUFtQixFQUFFLHFCQUFxQixDQUFDO29CQUMxSCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsQ0FBQztpQkFDdEgiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBORzJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuLy8gQVBQXG5pbXBvcnQgeyBOb3ZvSXNMb2FkaW5nRGlyZWN0aXZlLCBOb3ZvTG9hZGVkRGlyZWN0aXZlLCBOb3ZvTG9hZGluZ0VsZW1lbnQsIE5vdm9Ta2VsZXRvbkRpcmVjdGl2ZSwgTm92b1NwaW5uZXJFbGVtZW50IH0gZnJvbSAnLi9Mb2FkaW5nJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW05vdm9Mb2FkaW5nRWxlbWVudCwgTm92b1NwaW5uZXJFbGVtZW50LCBOb3ZvSXNMb2FkaW5nRGlyZWN0aXZlLCBOb3ZvTG9hZGVkRGlyZWN0aXZlLCBOb3ZvU2tlbGV0b25EaXJlY3RpdmVdLFxuICBleHBvcnRzOiBbTm92b0xvYWRpbmdFbGVtZW50LCBOb3ZvU3Bpbm5lckVsZW1lbnQsIE5vdm9Jc0xvYWRpbmdEaXJlY3RpdmUsIE5vdm9Mb2FkZWREaXJlY3RpdmUsIE5vdm9Ta2VsZXRvbkRpcmVjdGl2ZV0sXG59KVxuZXhwb3J0IGNsYXNzIE5vdm9Mb2FkaW5nTW9kdWxlIHt9XG4iXX0=