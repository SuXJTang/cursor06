import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NovoButtonModule } from 'novo-elements/elements/button';
import { NovoIconModule } from 'novo-elements/elements/icon';
import { NovoStepHeader } from './step-header.component';
import { NovoStepLabel } from './step-label.component';
import { NovoStepStatus } from './step-status.component';
import { NovoStepperNext, NovoStepperPrevious } from './stepper-buttons.component';
import { NovoHorizontalStepper, NovoStep, NovoStepper, NovoVerticalStepper } from './stepper.component';
import * as i0 from "@angular/core";
export class NovoStepperModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoStepperModule, declarations: [NovoHorizontalStepper,
            NovoVerticalStepper,
            NovoStep,
            NovoStepLabel,
            NovoStepper,
            NovoStepHeader,
            NovoStepStatus,
            NovoStepperNext,
            NovoStepperPrevious], imports: [CommonModule, PortalModule, NovoButtonModule, CdkStepperModule, NovoIconModule, A11yModule], exports: [NovoHorizontalStepper,
            NovoVerticalStepper,
            NovoStep,
            NovoStepLabel,
            NovoStepper,
            NovoStepHeader,
            NovoStepStatus,
            NovoStepperNext,
            NovoStepperPrevious] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoStepperModule, imports: [CommonModule, PortalModule, NovoButtonModule, CdkStepperModule, NovoIconModule, A11yModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, PortalModule, NovoButtonModule, CdkStepperModule, NovoIconModule, A11yModule],
                    exports: [
                        NovoHorizontalStepper,
                        NovoVerticalStepper,
                        NovoStep,
                        NovoStepLabel,
                        NovoStepper,
                        NovoStepHeader,
                        NovoStepStatus,
                        NovoStepperNext,
                        NovoStepperPrevious,
                    ],
                    declarations: [
                        NovoHorizontalStepper,
                        NovoVerticalStepper,
                        NovoStep,
                        NovoStepLabel,
                        NovoStepper,
                        NovoStepHeader,
                        NovoStepStatus,
                        NovoStepperNext,
                        NovoStepperPrevious,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9zdGVwcGVyL3N0ZXBwZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDakUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNuRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDOztBQTBCeEcsTUFBTSxPQUFPLGlCQUFpQjsrR0FBakIsaUJBQWlCO2dIQUFqQixpQkFBaUIsaUJBWDFCLHFCQUFxQjtZQUNyQixtQkFBbUI7WUFDbkIsUUFBUTtZQUNSLGFBQWE7WUFDYixXQUFXO1lBQ1gsY0FBYztZQUNkLGNBQWM7WUFDZCxlQUFlO1lBQ2YsbUJBQW1CLGFBckJYLFlBQVksRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLFVBQVUsYUFFbEcscUJBQXFCO1lBQ3JCLG1CQUFtQjtZQUNuQixRQUFRO1lBQ1IsYUFBYTtZQUNiLFdBQVc7WUFDWCxjQUFjO1lBQ2QsY0FBYztZQUNkLGVBQWU7WUFDZixtQkFBbUI7Z0hBY1YsaUJBQWlCLFlBeEJsQixZQUFZLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxVQUFVOzs0RkF3QnpGLGlCQUFpQjtrQkF6QjdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsVUFBVSxDQUFDO29CQUNyRyxPQUFPLEVBQUU7d0JBQ1AscUJBQXFCO3dCQUNyQixtQkFBbUI7d0JBQ25CLFFBQVE7d0JBQ1IsYUFBYTt3QkFDYixXQUFXO3dCQUNYLGNBQWM7d0JBQ2QsY0FBYzt3QkFDZCxlQUFlO3dCQUNmLG1CQUFtQjtxQkFDcEI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLHFCQUFxQjt3QkFDckIsbUJBQW1CO3dCQUNuQixRQUFRO3dCQUNSLGFBQWE7d0JBQ2IsV0FBVzt3QkFDWCxjQUFjO3dCQUNkLGNBQWM7d0JBQ2QsZUFBZTt3QkFDZixtQkFBbUI7cUJBQ3BCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQTExeU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IFBvcnRhbE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgQ2RrU3RlcHBlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTm92b0J1dHRvbk1vZHVsZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvZWxlbWVudHMvYnV0dG9uJztcbmltcG9ydCB7IE5vdm9JY29uTW9kdWxlIH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy9pY29uJztcbmltcG9ydCB7IE5vdm9TdGVwSGVhZGVyIH0gZnJvbSAnLi9zdGVwLWhlYWRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTm92b1N0ZXBMYWJlbCB9IGZyb20gJy4vc3RlcC1sYWJlbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTm92b1N0ZXBTdGF0dXMgfSBmcm9tICcuL3N0ZXAtc3RhdHVzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOb3ZvU3RlcHBlck5leHQsIE5vdm9TdGVwcGVyUHJldmlvdXMgfSBmcm9tICcuL3N0ZXBwZXItYnV0dG9ucy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTm92b0hvcml6b250YWxTdGVwcGVyLCBOb3ZvU3RlcCwgTm92b1N0ZXBwZXIsIE5vdm9WZXJ0aWNhbFN0ZXBwZXIgfSBmcm9tICcuL3N0ZXBwZXIuY29tcG9uZW50JztcbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFBvcnRhbE1vZHVsZSwgTm92b0J1dHRvbk1vZHVsZSwgQ2RrU3RlcHBlck1vZHVsZSwgTm92b0ljb25Nb2R1bGUsIEExMXlNb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTm92b0hvcml6b250YWxTdGVwcGVyLFxuICAgIE5vdm9WZXJ0aWNhbFN0ZXBwZXIsXG4gICAgTm92b1N0ZXAsXG4gICAgTm92b1N0ZXBMYWJlbCxcbiAgICBOb3ZvU3RlcHBlcixcbiAgICBOb3ZvU3RlcEhlYWRlcixcbiAgICBOb3ZvU3RlcFN0YXR1cyxcbiAgICBOb3ZvU3RlcHBlck5leHQsXG4gICAgTm92b1N0ZXBwZXJQcmV2aW91cyxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTm92b0hvcml6b250YWxTdGVwcGVyLFxuICAgIE5vdm9WZXJ0aWNhbFN0ZXBwZXIsXG4gICAgTm92b1N0ZXAsXG4gICAgTm92b1N0ZXBMYWJlbCxcbiAgICBOb3ZvU3RlcHBlcixcbiAgICBOb3ZvU3RlcEhlYWRlcixcbiAgICBOb3ZvU3RlcFN0YXR1cyxcbiAgICBOb3ZvU3RlcHBlck5leHQsXG4gICAgTm92b1N0ZXBwZXJQcmV2aW91cyxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTm92b1N0ZXBwZXJNb2R1bGUge31cbiJdfQ==