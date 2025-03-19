// NG2
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NovoListModule } from 'novo-elements/elements/list';
import { NovoTabModule } from 'novo-elements/elements/tabs';
// APP
import { NovoCategoryDropdownElement } from './CategoryDropdown';
import * as i0 from "@angular/core";
export class NovoCategoryDropdownModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCategoryDropdownModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoCategoryDropdownModule, declarations: [NovoCategoryDropdownElement], imports: [CommonModule, NovoTabModule, NovoListModule], exports: [NovoCategoryDropdownElement] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCategoryDropdownModule, imports: [CommonModule, NovoTabModule, NovoListModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCategoryDropdownModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NovoTabModule, NovoListModule],
                    declarations: [NovoCategoryDropdownElement],
                    exports: [NovoCategoryDropdownElement],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F0ZWdvcnlEcm9wZG93bi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9jYXRlZ29yeS1kcm9wZG93bi9DYXRlZ29yeURyb3Bkb3duLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM1RCxNQUFNO0FBQ04sT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7O0FBT2pFLE1BQU0sT0FBTywwQkFBMEI7K0dBQTFCLDBCQUEwQjtnSEFBMUIsMEJBQTBCLGlCQUh0QiwyQkFBMkIsYUFEaEMsWUFBWSxFQUFFLGFBQWEsRUFBRSxjQUFjLGFBRTNDLDJCQUEyQjtnSEFFMUIsMEJBQTBCLFlBSjNCLFlBQVksRUFBRSxhQUFhLEVBQUUsY0FBYzs7NEZBSTFDLDBCQUEwQjtrQkFMdEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQztvQkFDdEQsWUFBWSxFQUFFLENBQUMsMkJBQTJCLENBQUM7b0JBQzNDLE9BQU8sRUFBRSxDQUFDLDJCQUEyQixDQUFDO2lCQUN2QyIsInNvdXJjZXNDb250ZW50IjpbIi8vIE5HMlxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOb3ZvTGlzdE1vZHVsZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvZWxlbWVudHMvbGlzdCc7XG5pbXBvcnQgeyBOb3ZvVGFiTW9kdWxlIH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy90YWJzJztcbi8vIEFQUFxuaW1wb3J0IHsgTm92b0NhdGVnb3J5RHJvcGRvd25FbGVtZW50IH0gZnJvbSAnLi9DYXRlZ29yeURyb3Bkb3duJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTm92b1RhYk1vZHVsZSwgTm92b0xpc3RNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtOb3ZvQ2F0ZWdvcnlEcm9wZG93bkVsZW1lbnRdLFxuICBleHBvcnRzOiBbTm92b0NhdGVnb3J5RHJvcGRvd25FbGVtZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgTm92b0NhdGVnb3J5RHJvcGRvd25Nb2R1bGUge31cbiJdfQ==