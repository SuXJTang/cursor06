import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NovoPseudoCheckboxModule } from '../selection/index';
import { NovoOptgroup } from './optgroup.component';
import { NovoOption } from './option.component';
import * as i0 from "@angular/core";
export class NovoOptionModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoOptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoOptionModule, declarations: [NovoOption, NovoOptgroup], imports: [CommonModule, NovoPseudoCheckboxModule], exports: [NovoOption, NovoOptgroup] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoOptionModule, imports: [CommonModule, NovoPseudoCheckboxModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoOptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NovoPseudoCheckboxModule],
                    exports: [NovoOption, NovoOptgroup],
                    declarations: [NovoOption, NovoOptgroup],
                }]
        }] });
export * from './optgroup.component';
export * from './option-parent';
export * from './option.component';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9jb21tb24vb3B0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7O0FBT2hELE1BQU0sT0FBTyxnQkFBZ0I7K0dBQWhCLGdCQUFnQjtnSEFBaEIsZ0JBQWdCLGlCQUZaLFVBQVUsRUFBRSxZQUFZLGFBRjdCLFlBQVksRUFBRSx3QkFBd0IsYUFDdEMsVUFBVSxFQUFFLFlBQVk7Z0hBR3ZCLGdCQUFnQixZQUpqQixZQUFZLEVBQUUsd0JBQXdCOzs0RkFJckMsZ0JBQWdCO2tCQUw1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSx3QkFBd0IsQ0FBQztvQkFDakQsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQztvQkFDbkMsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQztpQkFDekM7O0FBR0QsY0FBYyxzQkFBc0IsQ0FBQztBQUNyQyxjQUFjLGlCQUFpQixDQUFDO0FBQ2hDLGNBQWMsb0JBQW9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vdm9Qc2V1ZG9DaGVja2JveE1vZHVsZSB9IGZyb20gJy4uL3NlbGVjdGlvbi9pbmRleCc7XG5pbXBvcnQgeyBOb3ZvT3B0Z3JvdXAgfSBmcm9tICcuL29wdGdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOb3ZvT3B0aW9uIH0gZnJvbSAnLi9vcHRpb24uY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTm92b1BzZXVkb0NoZWNrYm94TW9kdWxlXSxcbiAgZXhwb3J0czogW05vdm9PcHRpb24sIE5vdm9PcHRncm91cF0sXG4gIGRlY2xhcmF0aW9uczogW05vdm9PcHRpb24sIE5vdm9PcHRncm91cF0sXG59KVxuZXhwb3J0IGNsYXNzIE5vdm9PcHRpb25Nb2R1bGUge31cblxuZXhwb3J0ICogZnJvbSAnLi9vcHRncm91cC5jb21wb25lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9vcHRpb24tcGFyZW50JztcbmV4cG9ydCAqIGZyb20gJy4vb3B0aW9uLmNvbXBvbmVudCc7XG4iXX0=