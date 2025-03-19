import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NovoBoxElement } from './Box';
import { NovoFlexElement, NovoStackElement } from './Flex';
import { NovoGridElement } from './Grid';
import * as i0 from "@angular/core";
export class NovoFlexModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFlexModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoFlexModule, declarations: [NovoFlexElement, NovoStackElement, NovoGridElement, NovoBoxElement], imports: [CommonModule], exports: [NovoFlexElement, NovoStackElement, NovoGridElement, NovoBoxElement] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFlexModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFlexModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [NovoFlexElement, NovoStackElement, NovoGridElement, NovoBoxElement],
                    exports: [NovoFlexElement, NovoStackElement, NovoGridElement, NovoBoxElement],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmxleC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9mbGV4L0ZsZXgubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDdkMsT0FBTyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sUUFBUSxDQUFDOztBQU96QyxNQUFNLE9BQU8sY0FBYzsrR0FBZCxjQUFjO2dIQUFkLGNBQWMsaUJBSFYsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxjQUFjLGFBRHZFLFlBQVksYUFFWixlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLGNBQWM7Z0hBRWpFLGNBQWMsWUFKZixZQUFZOzs0RkFJWCxjQUFjO2tCQUwxQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxjQUFjLENBQUM7b0JBQ2xGLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDO2lCQUM5RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTm92b0JveEVsZW1lbnQgfSBmcm9tICcuL0JveCc7XG5pbXBvcnQgeyBOb3ZvRmxleEVsZW1lbnQsIE5vdm9TdGFja0VsZW1lbnQgfSBmcm9tICcuL0ZsZXgnO1xuaW1wb3J0IHsgTm92b0dyaWRFbGVtZW50IH0gZnJvbSAnLi9HcmlkJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW05vdm9GbGV4RWxlbWVudCwgTm92b1N0YWNrRWxlbWVudCwgTm92b0dyaWRFbGVtZW50LCBOb3ZvQm94RWxlbWVudF0sXG4gIGV4cG9ydHM6IFtOb3ZvRmxleEVsZW1lbnQsIE5vdm9TdGFja0VsZW1lbnQsIE5vdm9HcmlkRWxlbWVudCwgTm92b0JveEVsZW1lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvRmxleE1vZHVsZSB7fVxuIl19