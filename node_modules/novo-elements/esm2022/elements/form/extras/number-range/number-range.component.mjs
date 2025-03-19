import { Component, forwardRef } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NovoLabelService } from 'novo-elements/services';
import { Helpers } from 'novo-elements/utils';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "@angular/forms";
import * as i3 from "@angular/common";
import * as i4 from "novo-elements/elements/flex";
import * as i5 from "novo-elements/elements/field";
export class NumberRangeComponent {
    constructor(labels, formBuilder) {
        this.labels = labels;
        this.formBuilder = formBuilder;
        this._onChange = () => { };
        this._onTouched = () => { };
        this._destroyed = new Subject();
    }
    ngOnInit() {
        this.rangeForm = this.formBuilder.group({ min: null, max: null }, { validators: this.minLessThanMaxValidator });
        // Notify parent form when the value changes (and it's valid)
        this.rangeForm.valueChanges.pipe(takeUntil(this._destroyed), filter(() => this.rangeForm.valid)).subscribe(value => this._onChange(value));
    }
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }
    minLessThanMaxValidator(group) {
        const min = group.get('min').value;
        const max = group.get('max').value;
        const hasError = !Helpers.isBlank(min) && !Helpers.isBlank(max) && min > max;
        const error = hasError ? { minGreaterThanMax: true } : null;
        group.get('min').setErrors(error); // sets error styling
        group.get('max').setErrors(error);
        return error;
    }
    writeValue(value) {
        if (value) {
            this.rangeForm.setValue(value, { emitEvent: false });
        }
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setDisabledState(isDisabled) {
        isDisabled ? this.rangeForm.disable() : this.rangeForm.enable();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NumberRangeComponent, deps: [{ token: i1.NovoLabelService }, { token: i2.FormBuilder }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NumberRangeComponent, selector: "novo-number-range", providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => NumberRangeComponent),
                multi: true
            }
        ], ngImport: i0, template: `
    <form [formGroup]="rangeForm">
      <novo-flex justify='space-between' align='end' gap="1rem">
        <novo-field mr="sm">
          <input formControlName="min" novoInput type='number' [placeholder]="labels.minimumPlaceholder"/>
        </novo-field>
        <novo-field ml="sm">
          <input formControlName="max" novoInput type='number' [placeholder]="labels.maximumPlaceholder"/>
        </novo-field>
      </novo-flex>
      <novo-error *ngIf="rangeForm.hasError('minGreaterThanMax')" style="position: absolute">
        {{ labels.minGreaterThanMax }}
      </novo-error>
    </form>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "component", type: i4.NovoFlexElement, selector: "novo-flex,novo-row", inputs: ["direction", "align", "justify", "wrap", "gap"] }, { kind: "component", type: i5.NovoFieldElement, selector: "novo-field", inputs: ["layout", "appearance", "customOverlayOrigin", "width"], outputs: ["valueChanges", "stateChanges"] }, { kind: "component", type: i5.NovoErrorElement, selector: "novo-error" }, { kind: "directive", type: i5.NovoInput, selector: "input[novoInput], textarea[novoInput], select[novoInput]", inputs: ["disabled", "id", "placeholder", "required", "type", "value", "readonly"] }, { kind: "directive", type: i2.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i2.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NumberRangeComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'novo-number-range',
                    template: `
    <form [formGroup]="rangeForm">
      <novo-flex justify='space-between' align='end' gap="1rem">
        <novo-field mr="sm">
          <input formControlName="min" novoInput type='number' [placeholder]="labels.minimumPlaceholder"/>
        </novo-field>
        <novo-field ml="sm">
          <input formControlName="max" novoInput type='number' [placeholder]="labels.maximumPlaceholder"/>
        </novo-field>
      </novo-flex>
      <novo-error *ngIf="rangeForm.hasError('minGreaterThanMax')" style="position: absolute">
        {{ labels.minGreaterThanMax }}
      </novo-error>
    </form>
  `,
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => NumberRangeComponent),
                            multi: true
                        }
                    ]
                }]
        }], ctorParameters: () => [{ type: i1.NovoLabelService }, { type: i2.FormBuilder }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLXJhbmdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2Zvcm0vZXh0cmFzL251bWJlci1yYW5nZS9udW1iZXItcmFuZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUN6RSxPQUFPLEVBQXdCLFdBQVcsRUFBYSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2pHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7QUEyQm5ELE1BQU0sT0FBTyxvQkFBb0I7SUFNL0IsWUFBbUIsTUFBd0IsRUFBVSxXQUF3QjtRQUExRCxXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBSjdFLGNBQVMsR0FBeUIsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLGVBQVUsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDZixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztJQUV3QyxDQUFDO0lBRWxGLFFBQVE7UUFDTixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztRQUVoSCw2REFBNkQ7UUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUM5QixTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUMxQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FDbkMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELHVCQUF1QixDQUFDLEtBQWdCO1FBQ3RDLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ25DLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ25DLE1BQU0sUUFBUSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUM3RSxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUM1RCxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtRQUN4RCxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBbUM7UUFDNUMsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNWLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBTztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBTztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsVUFBbUI7UUFDbEMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2xFLENBQUM7K0dBakRVLG9CQUFvQjttR0FBcEIsb0JBQW9CLDRDQVJwQjtZQUNUO2dCQUNFLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUM7Z0JBQ25ELEtBQUssRUFBRSxJQUFJO2FBQ1o7U0FDRiwwQkFyQlM7Ozs7Ozs7Ozs7Ozs7O0dBY1Q7OzRGQVNVLG9CQUFvQjtrQkF6QmhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7OztHQWNUO29CQUNELFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsaUJBQWlCOzRCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsQ0FBQzs0QkFDbkQsS0FBSyxFQUFFLElBQUk7eUJBQ1o7cUJBQ0Y7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUJ1aWxkZXIsIEZvcm1Hcm91cCwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBOb3ZvTGFiZWxTZXJ2aWNlIH0gZnJvbSAnbm92by1lbGVtZW50cy9zZXJ2aWNlcyc7XG5pbXBvcnQgeyBIZWxwZXJzIH0gZnJvbSAnbm92by1lbGVtZW50cy91dGlscyc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1udW1iZXItcmFuZ2UnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxmb3JtIFtmb3JtR3JvdXBdPVwicmFuZ2VGb3JtXCI+XG4gICAgICA8bm92by1mbGV4IGp1c3RpZnk9J3NwYWNlLWJldHdlZW4nIGFsaWduPSdlbmQnIGdhcD1cIjFyZW1cIj5cbiAgICAgICAgPG5vdm8tZmllbGQgbXI9XCJzbVwiPlxuICAgICAgICAgIDxpbnB1dCBmb3JtQ29udHJvbE5hbWU9XCJtaW5cIiBub3ZvSW5wdXQgdHlwZT0nbnVtYmVyJyBbcGxhY2Vob2xkZXJdPVwibGFiZWxzLm1pbmltdW1QbGFjZWhvbGRlclwiLz5cbiAgICAgICAgPC9ub3ZvLWZpZWxkPlxuICAgICAgICA8bm92by1maWVsZCBtbD1cInNtXCI+XG4gICAgICAgICAgPGlucHV0IGZvcm1Db250cm9sTmFtZT1cIm1heFwiIG5vdm9JbnB1dCB0eXBlPSdudW1iZXInIFtwbGFjZWhvbGRlcl09XCJsYWJlbHMubWF4aW11bVBsYWNlaG9sZGVyXCIvPlxuICAgICAgICA8L25vdm8tZmllbGQ+XG4gICAgICA8L25vdm8tZmxleD5cbiAgICAgIDxub3ZvLWVycm9yICpuZ0lmPVwicmFuZ2VGb3JtLmhhc0Vycm9yKCdtaW5HcmVhdGVyVGhhbk1heCcpXCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGVcIj5cbiAgICAgICAge3sgbGFiZWxzLm1pbkdyZWF0ZXJUaGFuTWF4IH19XG4gICAgICA8L25vdm8tZXJyb3I+XG4gICAgPC9mb3JtPlxuICBgLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE51bWJlclJhbmdlQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE51bWJlclJhbmdlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgcmFuZ2VGb3JtOiBGb3JtR3JvdXA7XG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7IH07XG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7IH07XG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxhYmVsczogTm92b0xhYmVsU2VydmljZSwgcHJpdmF0ZSBmb3JtQnVpbGRlcjogRm9ybUJ1aWxkZXIpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucmFuZ2VGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7IG1pbjogbnVsbCwgbWF4OiBudWxsIH0sIHsgdmFsaWRhdG9yczogdGhpcy5taW5MZXNzVGhhbk1heFZhbGlkYXRvciB9KTtcblxuICAgIC8vIE5vdGlmeSBwYXJlbnQgZm9ybSB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzIChhbmQgaXQncyB2YWxpZClcbiAgICB0aGlzLnJhbmdlRm9ybS52YWx1ZUNoYW5nZXMucGlwZShcbiAgICAgIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpLFxuICAgICAgZmlsdGVyKCgpID0+IHRoaXMucmFuZ2VGb3JtLnZhbGlkKVxuICAgICkuc3Vic2NyaWJlKHZhbHVlID0+IHRoaXMuX29uQ2hhbmdlKHZhbHVlKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgbWluTGVzc1RoYW5NYXhWYWxpZGF0b3IoZ3JvdXA6IEZvcm1Hcm91cCk6IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9IHwgbnVsbCB7XG4gICAgY29uc3QgbWluID0gZ3JvdXAuZ2V0KCdtaW4nKS52YWx1ZTtcbiAgICBjb25zdCBtYXggPSBncm91cC5nZXQoJ21heCcpLnZhbHVlO1xuICAgIGNvbnN0IGhhc0Vycm9yID0gIUhlbHBlcnMuaXNCbGFuayhtaW4pICYmICFIZWxwZXJzLmlzQmxhbmsobWF4KSAmJiBtaW4gPiBtYXg7XG4gICAgY29uc3QgZXJyb3IgPSBoYXNFcnJvciA/IHsgbWluR3JlYXRlclRoYW5NYXg6IHRydWUgfSA6IG51bGw7XG4gICAgZ3JvdXAuZ2V0KCdtaW4nKS5zZXRFcnJvcnMoZXJyb3IpOyAvLyBzZXRzIGVycm9yIHN0eWxpbmdcbiAgICBncm91cC5nZXQoJ21heCcpLnNldEVycm9ycyhlcnJvcik7XG4gICAgcmV0dXJuIGVycm9yO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogeyBtaW46IG51bWJlciwgbWF4OiBudW1iZXIgfSk6IHZvaWQge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5yYW5nZUZvcm0uc2V0VmFsdWUodmFsdWUsIHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgaXNEaXNhYmxlZCA/IHRoaXMucmFuZ2VGb3JtLmRpc2FibGUoKSA6IHRoaXMucmFuZ2VGb3JtLmVuYWJsZSgpO1xuICB9XG59XG4iXX0=