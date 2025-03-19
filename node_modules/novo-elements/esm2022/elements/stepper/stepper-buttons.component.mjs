import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/** Button that moves to the next step in a stepper workflow. */
export class NovoStepperNext extends CdkStepperNext {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoStepperNext, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: NovoStepperNext, selector: "button[novoStepperNext],novo-button[novoStepperNext]", inputs: { type: "type" }, host: { properties: { "type": "type" }, classAttribute: "novo-stepper-next" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoStepperNext, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[novoStepperNext],novo-button[novoStepperNext]',
                    host: {
                        class: 'novo-stepper-next',
                        '[type]': 'type',
                    },
                    inputs: ['type'],
                }]
        }] });
/** Button that moves to the previous step in a stepper workflow. */
export class NovoStepperPrevious extends CdkStepperPrevious {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoStepperPrevious, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: NovoStepperPrevious, selector: "button[novoStepperPrevious],novo-button[novoStepperPrevious]", inputs: { type: "type" }, host: { properties: { "type": "type" }, classAttribute: "novo-stepper-previous" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoStepperPrevious, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[novoStepperPrevious],novo-button[novoStepperPrevious]',
                    host: {
                        class: 'novo-stepper-previous',
                        '[type]': 'type',
                    },
                    inputs: ['type'],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1idXR0b25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL3N0ZXBwZXIvc3RlcHBlci1idXR0b25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFMUMsZ0VBQWdFO0FBU2hFLE1BQU0sT0FBTyxlQUFnQixTQUFRLGNBQWM7K0dBQXRDLGVBQWU7bUdBQWYsZUFBZTs7NEZBQWYsZUFBZTtrQkFSM0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0RBQXNEO29CQUNoRSxJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLG1CQUFtQjt3QkFDMUIsUUFBUSxFQUFFLE1BQU07cUJBQ2pCO29CQUNELE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDakI7O0FBR0Qsb0VBQW9FO0FBU3BFLE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxrQkFBa0I7K0dBQTlDLG1CQUFtQjttR0FBbkIsbUJBQW1COzs0RkFBbkIsbUJBQW1CO2tCQVIvQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw4REFBOEQ7b0JBQ3hFLElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsdUJBQXVCO3dCQUM5QixRQUFRLEVBQUUsTUFBTTtxQkFDakI7b0JBQ0QsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENka1N0ZXBwZXJOZXh0LCBDZGtTdGVwcGVyUHJldmlvdXMgfSBmcm9tICdAYW5ndWxhci9jZGsvc3RlcHBlcic7XG5pbXBvcnQgeyBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqIEJ1dHRvbiB0aGF0IG1vdmVzIHRvIHRoZSBuZXh0IHN0ZXAgaW4gYSBzdGVwcGVyIHdvcmtmbG93LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnYnV0dG9uW25vdm9TdGVwcGVyTmV4dF0sbm92by1idXR0b25bbm92b1N0ZXBwZXJOZXh0XScsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ25vdm8tc3RlcHBlci1uZXh0JyxcbiAgICAnW3R5cGVdJzogJ3R5cGUnLFxuICB9LFxuICBpbnB1dHM6IFsndHlwZSddLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvU3RlcHBlck5leHQgZXh0ZW5kcyBDZGtTdGVwcGVyTmV4dCB7fVxuXG4vKiogQnV0dG9uIHRoYXQgbW92ZXMgdG8gdGhlIHByZXZpb3VzIHN0ZXAgaW4gYSBzdGVwcGVyIHdvcmtmbG93LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnYnV0dG9uW25vdm9TdGVwcGVyUHJldmlvdXNdLG5vdm8tYnV0dG9uW25vdm9TdGVwcGVyUHJldmlvdXNdJyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbm92by1zdGVwcGVyLXByZXZpb3VzJyxcbiAgICAnW3R5cGVdJzogJ3R5cGUnLFxuICB9LFxuICBpbnB1dHM6IFsndHlwZSddLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvU3RlcHBlclByZXZpb3VzIGV4dGVuZHMgQ2RrU3RlcHBlclByZXZpb3VzIHt9XG4iXX0=