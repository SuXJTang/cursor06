// NG2
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// APP
import { NovoButtonModule } from 'novo-elements/elements/button';
import { NovoCommonModule, NovoOptionModule, NovoOverlayModule } from 'novo-elements/elements/common';
import { NovoErrorElement } from './error/error';
import { NovoFieldElement, NovoFieldPrefixDirective, NovoFieldSuffixDirective } from './field';
import { NovoFieldsElement } from './fieldset';
import { NovoDateFormatDirective } from './formats/date-format';
import { NovoDateRangeFormatDirective } from './formats/date-range-format';
import { NovoDateTimeFormatDirective } from './formats/date-time-format';
import { NovoTimeFormatDirective } from './formats/time-format';
import { NovoHintElement } from './hint/hint';
import { NovoInput } from './input';
import { NovoPickerDirective } from './picker.directive';
import { NovoPickerToggleElement } from './toggle/picker-toggle.component';
import * as i0 from "@angular/core";
export class NovoFieldModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoFieldModule, declarations: [NovoFieldElement,
            NovoHintElement,
            NovoErrorElement,
            NovoInput,
            NovoFieldPrefixDirective,
            NovoFieldSuffixDirective,
            NovoFieldsElement,
            NovoTimeFormatDirective,
            NovoDateFormatDirective,
            NovoDateTimeFormatDirective,
            NovoDateRangeFormatDirective,
            NovoPickerToggleElement,
            NovoPickerDirective], imports: [CommonModule, NovoButtonModule, NovoOverlayModule, NovoOptionModule, NovoCommonModule], exports: [NovoFieldElement,
            NovoHintElement,
            NovoErrorElement,
            NovoInput,
            NovoFieldPrefixDirective,
            NovoFieldSuffixDirective,
            NovoFieldsElement,
            NovoTimeFormatDirective,
            NovoDateFormatDirective,
            NovoDateRangeFormatDirective,
            NovoDateTimeFormatDirective,
            NovoPickerToggleElement,
            NovoPickerDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFieldModule, imports: [CommonModule, NovoButtonModule, NovoOverlayModule, NovoOptionModule, NovoCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFieldModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NovoButtonModule, NovoOverlayModule, NovoOptionModule, NovoCommonModule],
                    declarations: [
                        NovoFieldElement,
                        NovoHintElement,
                        NovoErrorElement,
                        NovoInput,
                        NovoFieldPrefixDirective,
                        NovoFieldSuffixDirective,
                        NovoFieldsElement,
                        NovoTimeFormatDirective,
                        NovoDateFormatDirective,
                        NovoDateTimeFormatDirective,
                        NovoDateRangeFormatDirective,
                        NovoPickerToggleElement,
                        NovoPickerDirective,
                    ],
                    exports: [
                        NovoFieldElement,
                        NovoHintElement,
                        NovoErrorElement,
                        NovoInput,
                        NovoFieldPrefixDirective,
                        NovoFieldSuffixDirective,
                        NovoFieldsElement,
                        NovoTimeFormatDirective,
                        NovoDateFormatDirective,
                        NovoDateRangeFormatDirective,
                        NovoDateTimeFormatDirective,
                        NovoPickerToggleElement,
                        NovoPickerDirective,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvZmllbGQvZmllbGQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU07QUFDTixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxNQUFNO0FBQ04sT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDakUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDdEcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSx3QkFBd0IsRUFBRSx3QkFBd0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMvRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDL0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDaEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDM0UsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDekUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3pELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDOztBQW1DM0UsTUFBTSxPQUFPLGVBQWU7K0dBQWYsZUFBZTtnSEFBZixlQUFlLGlCQTlCeEIsZ0JBQWdCO1lBQ2hCLGVBQWU7WUFDZixnQkFBZ0I7WUFDaEIsU0FBUztZQUNULHdCQUF3QjtZQUN4Qix3QkFBd0I7WUFDeEIsaUJBQWlCO1lBQ2pCLHVCQUF1QjtZQUN2Qix1QkFBdUI7WUFDdkIsMkJBQTJCO1lBQzNCLDRCQUE0QjtZQUM1Qix1QkFBdUI7WUFDdkIsbUJBQW1CLGFBZFgsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixhQWlCN0YsZ0JBQWdCO1lBQ2hCLGVBQWU7WUFDZixnQkFBZ0I7WUFDaEIsU0FBUztZQUNULHdCQUF3QjtZQUN4Qix3QkFBd0I7WUFDeEIsaUJBQWlCO1lBQ2pCLHVCQUF1QjtZQUN2Qix1QkFBdUI7WUFDdkIsNEJBQTRCO1lBQzVCLDJCQUEyQjtZQUMzQix1QkFBdUI7WUFDdkIsbUJBQW1CO2dIQUdWLGVBQWUsWUFoQ2hCLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7OzRGQWdDcEYsZUFBZTtrQkFqQzNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO29CQUNoRyxZQUFZLEVBQUU7d0JBQ1osZ0JBQWdCO3dCQUNoQixlQUFlO3dCQUNmLGdCQUFnQjt3QkFDaEIsU0FBUzt3QkFDVCx3QkFBd0I7d0JBQ3hCLHdCQUF3Qjt3QkFDeEIsaUJBQWlCO3dCQUNqQix1QkFBdUI7d0JBQ3ZCLHVCQUF1Qjt3QkFDdkIsMkJBQTJCO3dCQUMzQiw0QkFBNEI7d0JBQzVCLHVCQUF1Qjt3QkFDdkIsbUJBQW1CO3FCQUNwQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsZ0JBQWdCO3dCQUNoQixlQUFlO3dCQUNmLGdCQUFnQjt3QkFDaEIsU0FBUzt3QkFDVCx3QkFBd0I7d0JBQ3hCLHdCQUF3Qjt3QkFDeEIsaUJBQWlCO3dCQUNqQix1QkFBdUI7d0JBQ3ZCLHVCQUF1Qjt3QkFDdkIsNEJBQTRCO3dCQUM1QiwyQkFBMkI7d0JBQzNCLHVCQUF1Qjt3QkFDdkIsbUJBQW1CO3FCQUNwQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIE5HMlxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4vLyBBUFBcbmltcG9ydCB7IE5vdm9CdXR0b25Nb2R1bGUgfSBmcm9tICdub3ZvLWVsZW1lbnRzL2VsZW1lbnRzL2J1dHRvbic7XG5pbXBvcnQgeyBOb3ZvQ29tbW9uTW9kdWxlLCBOb3ZvT3B0aW9uTW9kdWxlLCBOb3ZvT3ZlcmxheU1vZHVsZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvZWxlbWVudHMvY29tbW9uJztcbmltcG9ydCB7IE5vdm9FcnJvckVsZW1lbnQgfSBmcm9tICcuL2Vycm9yL2Vycm9yJztcbmltcG9ydCB7IE5vdm9GaWVsZEVsZW1lbnQsIE5vdm9GaWVsZFByZWZpeERpcmVjdGl2ZSwgTm92b0ZpZWxkU3VmZml4RGlyZWN0aXZlIH0gZnJvbSAnLi9maWVsZCc7XG5pbXBvcnQgeyBOb3ZvRmllbGRzRWxlbWVudCB9IGZyb20gJy4vZmllbGRzZXQnO1xuaW1wb3J0IHsgTm92b0RhdGVGb3JtYXREaXJlY3RpdmUgfSBmcm9tICcuL2Zvcm1hdHMvZGF0ZS1mb3JtYXQnO1xuaW1wb3J0IHsgTm92b0RhdGVSYW5nZUZvcm1hdERpcmVjdGl2ZSB9IGZyb20gJy4vZm9ybWF0cy9kYXRlLXJhbmdlLWZvcm1hdCc7XG5pbXBvcnQgeyBOb3ZvRGF0ZVRpbWVGb3JtYXREaXJlY3RpdmUgfSBmcm9tICcuL2Zvcm1hdHMvZGF0ZS10aW1lLWZvcm1hdCc7XG5pbXBvcnQgeyBOb3ZvVGltZUZvcm1hdERpcmVjdGl2ZSB9IGZyb20gJy4vZm9ybWF0cy90aW1lLWZvcm1hdCc7XG5pbXBvcnQgeyBOb3ZvSGludEVsZW1lbnQgfSBmcm9tICcuL2hpbnQvaGludCc7XG5pbXBvcnQgeyBOb3ZvSW5wdXQgfSBmcm9tICcuL2lucHV0JztcbmltcG9ydCB7IE5vdm9QaWNrZXJEaXJlY3RpdmUgfSBmcm9tICcuL3BpY2tlci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTm92b1BpY2tlclRvZ2dsZUVsZW1lbnQgfSBmcm9tICcuL3RvZ2dsZS9waWNrZXItdG9nZ2xlLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE5vdm9CdXR0b25Nb2R1bGUsIE5vdm9PdmVybGF5TW9kdWxlLCBOb3ZvT3B0aW9uTW9kdWxlLCBOb3ZvQ29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTm92b0ZpZWxkRWxlbWVudCxcbiAgICBOb3ZvSGludEVsZW1lbnQsXG4gICAgTm92b0Vycm9yRWxlbWVudCxcbiAgICBOb3ZvSW5wdXQsXG4gICAgTm92b0ZpZWxkUHJlZml4RGlyZWN0aXZlLFxuICAgIE5vdm9GaWVsZFN1ZmZpeERpcmVjdGl2ZSxcbiAgICBOb3ZvRmllbGRzRWxlbWVudCxcbiAgICBOb3ZvVGltZUZvcm1hdERpcmVjdGl2ZSxcbiAgICBOb3ZvRGF0ZUZvcm1hdERpcmVjdGl2ZSxcbiAgICBOb3ZvRGF0ZVRpbWVGb3JtYXREaXJlY3RpdmUsXG4gICAgTm92b0RhdGVSYW5nZUZvcm1hdERpcmVjdGl2ZSxcbiAgICBOb3ZvUGlja2VyVG9nZ2xlRWxlbWVudCxcbiAgICBOb3ZvUGlja2VyRGlyZWN0aXZlLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgTm92b0ZpZWxkRWxlbWVudCxcbiAgICBOb3ZvSGludEVsZW1lbnQsXG4gICAgTm92b0Vycm9yRWxlbWVudCxcbiAgICBOb3ZvSW5wdXQsXG4gICAgTm92b0ZpZWxkUHJlZml4RGlyZWN0aXZlLFxuICAgIE5vdm9GaWVsZFN1ZmZpeERpcmVjdGl2ZSxcbiAgICBOb3ZvRmllbGRzRWxlbWVudCxcbiAgICBOb3ZvVGltZUZvcm1hdERpcmVjdGl2ZSxcbiAgICBOb3ZvRGF0ZUZvcm1hdERpcmVjdGl2ZSxcbiAgICBOb3ZvRGF0ZVJhbmdlRm9ybWF0RGlyZWN0aXZlLFxuICAgIE5vdm9EYXRlVGltZUZvcm1hdERpcmVjdGl2ZSxcbiAgICBOb3ZvUGlja2VyVG9nZ2xlRWxlbWVudCxcbiAgICBOb3ZvUGlja2VyRGlyZWN0aXZlLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvRmllbGRNb2R1bGUge31cbiJdfQ==