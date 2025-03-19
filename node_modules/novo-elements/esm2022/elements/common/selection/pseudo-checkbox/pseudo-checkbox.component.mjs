import { ChangeDetectionStrategy, Component, Inject, Input, Optional, ViewEncapsulation } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that theming is meant to be handled by the parent element, e.g.
 * `novo-primary .novo-pseudo-checkbox`.
 *
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with `<novo-checkbox>` and should *not* be used if the user would directly
 * interact with the checkbox. The pseudo-checkbox should only be used as an implementation detail
 * of more complex components that appropriately handle selected / checked state.
 * @docs-private
 */
export class NovoPseudoCheckbox {
    constructor(_animationMode) {
        this._animationMode = _animationMode;
        /** Display state of the checkbox. */
        this.state = 'unchecked';
        /** Display state of the checkbox. */
        this.shape = 'box';
        /** Whether the checkbox is disabled. */
        this.disabled = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoPseudoCheckbox, deps: [{ token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoPseudoCheckbox, selector: "novo-pseudo-checkbox", inputs: { state: "state", shape: "shape", disabled: "disabled" }, host: { properties: { "class.novo-pseudo-checkbox-indeterminate": "state === \"indeterminate\"", "class.novo-pseudo-checkbox-checked": "state === \"checked\"", "class.novo-pseudo-checkbox-disabled": "disabled", "class._novo-animation-noopable": "_animationMode === \"NoopAnimations\"" }, classAttribute: "novo-pseudo-checkbox" }, ngImport: i0, template: ` <i
    [class.bhi-checkbox-empty]="state === 'unchecked' && shape === 'box'"
    [class.bhi-checkbox-filled]="state === 'checked' && shape === 'box'"
    [class.bhi-checkbox-indeterminate]="state === 'indeterminate' && shape === 'box'"
    [class.bhi-circle-o]="state === 'unchecked' && shape === 'circle'"
    [class.bhi-check-circle-filled]="state === 'checked' && shape === 'circle'"
    [class.bhi-circle]="state === 'indeterminate' && shape === 'circle'"
    [class.bhi-box-empty]="state === 'unchecked' && shape === 'line'"
    [class.bhi-check]="state === 'checked' && shape === 'line'"
    [class.bhi-box-minus-o]="state === 'indeterminate' && shape === 'line'"
  ></i>`, isInline: true, styles: [".novo-pseudo-checkbox{width:16px;height:16px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;flex-shrink:0;transition:color .3s ease-in-out}.novo-pseudo-checkbox.novo-pseudo-checkbox-checked,.novo-pseudo-checkbox.novo-pseudo-checkbox-indeterminate{color:#4a89dc;animation:iconEnter .16s ease-in-out}.novo-pseudo-checkbox i{font-size:1.4rem;line-height:1rem}.novo-pseudo-checkbox-disabled{cursor:default}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoPseudoCheckbox, decorators: [{
            type: Component,
            args: [{ encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, selector: 'novo-pseudo-checkbox', template: ` <i
    [class.bhi-checkbox-empty]="state === 'unchecked' && shape === 'box'"
    [class.bhi-checkbox-filled]="state === 'checked' && shape === 'box'"
    [class.bhi-checkbox-indeterminate]="state === 'indeterminate' && shape === 'box'"
    [class.bhi-circle-o]="state === 'unchecked' && shape === 'circle'"
    [class.bhi-check-circle-filled]="state === 'checked' && shape === 'circle'"
    [class.bhi-circle]="state === 'indeterminate' && shape === 'circle'"
    [class.bhi-box-empty]="state === 'unchecked' && shape === 'line'"
    [class.bhi-check]="state === 'checked' && shape === 'line'"
    [class.bhi-box-minus-o]="state === 'indeterminate' && shape === 'line'"
  ></i>`, host: {
                        class: 'novo-pseudo-checkbox',
                        '[class.novo-pseudo-checkbox-indeterminate]': 'state === "indeterminate"',
                        '[class.novo-pseudo-checkbox-checked]': 'state === "checked"',
                        '[class.novo-pseudo-checkbox-disabled]': 'disabled',
                        '[class._novo-animation-noopable]': '_animationMode === "NoopAnimations"',
                    }, styles: [".novo-pseudo-checkbox{width:16px;height:16px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;flex-shrink:0;transition:color .3s ease-in-out}.novo-pseudo-checkbox.novo-pseudo-checkbox-checked,.novo-pseudo-checkbox.novo-pseudo-checkbox-indeterminate{color:#4a89dc;animation:iconEnter .16s ease-in-out}.novo-pseudo-checkbox i{font-size:1.4rem;line-height:1rem}.novo-pseudo-checkbox-disabled{cursor:default}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }], propDecorators: { state: [{
                type: Input
            }], shape: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHNldWRvLWNoZWNrYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2NvbW1vbi9zZWxlY3Rpb24vcHNldWRvLWNoZWNrYm94L3BzZXVkby1jaGVja2JveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7QUFTN0U7Ozs7Ozs7Ozs7OztHQVlHO0FBeUJILE1BQU0sT0FBTyxrQkFBa0I7SUFRN0IsWUFBOEQsY0FBdUI7UUFBdkIsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUFQckYscUNBQXFDO1FBQzVCLFVBQUssR0FBNEIsV0FBVyxDQUFDO1FBQ3RELHFDQUFxQztRQUM1QixVQUFLLEdBQTRCLEtBQUssQ0FBQztRQUNoRCx3Q0FBd0M7UUFDL0IsYUFBUSxHQUFZLEtBQUssQ0FBQztJQUVxRCxDQUFDOytHQVI5RSxrQkFBa0Isa0JBUUcscUJBQXFCO21HQVIxQyxrQkFBa0Isd2NBbkJuQjs7Ozs7Ozs7OztRQVVKOzs0RkFTSyxrQkFBa0I7a0JBeEI5QixTQUFTO29DQUNPLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU0sWUFDckMsc0JBQXNCLFlBRXRCOzs7Ozs7Ozs7O1FBVUosUUFDQTt3QkFDSixLQUFLLEVBQUUsc0JBQXNCO3dCQUM3Qiw0Q0FBNEMsRUFBRSwyQkFBMkI7d0JBQ3pFLHNDQUFzQyxFQUFFLHFCQUFxQjt3QkFDN0QsdUNBQXVDLEVBQUUsVUFBVTt3QkFDbkQsa0NBQWtDLEVBQUUscUNBQXFDO3FCQUMxRTs7MEJBVVksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7eUNBTjVDLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEluamVjdCwgSW5wdXQsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQU5JTUFUSU9OX01PRFVMRV9UWVBFIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBQb3NzaWJsZSBzdGF0ZXMgZm9yIGEgcHNldWRvIGNoZWNrYm94LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgdHlwZSBOb3ZvUHNldWRvQ2hlY2tib3hTdGF0ZSA9ICd1bmNoZWNrZWQnIHwgJ2NoZWNrZWQnIHwgJ2luZGV0ZXJtaW5hdGUnO1xuZXhwb3J0IHR5cGUgTm92b1BzZXVkb0NoZWNrYm94U2hhcGUgPSAnYm94JyB8ICdjaXJjbGUnIHwgJ2xpbmUnO1xuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IHNob3dzIGEgc2ltcGxpZmllZCBjaGVja2JveCB3aXRob3V0IGluY2x1ZGluZyBhbnkga2luZCBvZiBcInJlYWxcIiBjaGVja2JveC5cbiAqIE1lYW50IHRvIGJlIHVzZWQgd2hlbiB0aGUgY2hlY2tib3ggaXMgcHVyZWx5IGRlY29yYXRpdmUgYW5kIGEgbGFyZ2UgbnVtYmVyIG9mIHRoZW0gd2lsbCBiZVxuICogaW5jbHVkZWQsIHN1Y2ggYXMgZm9yIHRoZSBvcHRpb25zIGluIGEgbXVsdGktc2VsZWN0LiBVc2VzIG5vIFNWR3Mgb3IgY29tcGxleCBhbmltYXRpb25zLlxuICogTm90ZSB0aGF0IHRoZW1pbmcgaXMgbWVhbnQgdG8gYmUgaGFuZGxlZCBieSB0aGUgcGFyZW50IGVsZW1lbnQsIGUuZy5cbiAqIGBub3ZvLXByaW1hcnkgLm5vdm8tcHNldWRvLWNoZWNrYm94YC5cbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBjb21wb25lbnQgd2lsbCBiZSBjb21wbGV0ZWx5IGludmlzaWJsZSB0byBzY3JlZW4tcmVhZGVyIHVzZXJzLiBUaGlzIGlzICpub3QqXG4gKiBpbnRlcmNoYW5nZWFibGUgd2l0aCBgPG5vdm8tY2hlY2tib3g+YCBhbmQgc2hvdWxkICpub3QqIGJlIHVzZWQgaWYgdGhlIHVzZXIgd291bGQgZGlyZWN0bHlcbiAqIGludGVyYWN0IHdpdGggdGhlIGNoZWNrYm94LiBUaGUgcHNldWRvLWNoZWNrYm94IHNob3VsZCBvbmx5IGJlIHVzZWQgYXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsXG4gKiBvZiBtb3JlIGNvbXBsZXggY29tcG9uZW50cyB0aGF0IGFwcHJvcHJpYXRlbHkgaGFuZGxlIHNlbGVjdGVkIC8gY2hlY2tlZCBzdGF0ZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzZWxlY3RvcjogJ25vdm8tcHNldWRvLWNoZWNrYm94JyxcbiAgc3R5bGVVcmxzOiBbJ3BzZXVkby1jaGVja2JveC5jb21wb25lbnQuc2NzcyddLFxuICB0ZW1wbGF0ZTogYCA8aVxuICAgIFtjbGFzcy5iaGktY2hlY2tib3gtZW1wdHldPVwic3RhdGUgPT09ICd1bmNoZWNrZWQnICYmIHNoYXBlID09PSAnYm94J1wiXG4gICAgW2NsYXNzLmJoaS1jaGVja2JveC1maWxsZWRdPVwic3RhdGUgPT09ICdjaGVja2VkJyAmJiBzaGFwZSA9PT0gJ2JveCdcIlxuICAgIFtjbGFzcy5iaGktY2hlY2tib3gtaW5kZXRlcm1pbmF0ZV09XCJzdGF0ZSA9PT0gJ2luZGV0ZXJtaW5hdGUnICYmIHNoYXBlID09PSAnYm94J1wiXG4gICAgW2NsYXNzLmJoaS1jaXJjbGUtb109XCJzdGF0ZSA9PT0gJ3VuY2hlY2tlZCcgJiYgc2hhcGUgPT09ICdjaXJjbGUnXCJcbiAgICBbY2xhc3MuYmhpLWNoZWNrLWNpcmNsZS1maWxsZWRdPVwic3RhdGUgPT09ICdjaGVja2VkJyAmJiBzaGFwZSA9PT0gJ2NpcmNsZSdcIlxuICAgIFtjbGFzcy5iaGktY2lyY2xlXT1cInN0YXRlID09PSAnaW5kZXRlcm1pbmF0ZScgJiYgc2hhcGUgPT09ICdjaXJjbGUnXCJcbiAgICBbY2xhc3MuYmhpLWJveC1lbXB0eV09XCJzdGF0ZSA9PT0gJ3VuY2hlY2tlZCcgJiYgc2hhcGUgPT09ICdsaW5lJ1wiXG4gICAgW2NsYXNzLmJoaS1jaGVja109XCJzdGF0ZSA9PT0gJ2NoZWNrZWQnICYmIHNoYXBlID09PSAnbGluZSdcIlxuICAgIFtjbGFzcy5iaGktYm94LW1pbnVzLW9dPVwic3RhdGUgPT09ICdpbmRldGVybWluYXRlJyAmJiBzaGFwZSA9PT0gJ2xpbmUnXCJcbiAgPjwvaT5gLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdub3ZvLXBzZXVkby1jaGVja2JveCcsXG4gICAgJ1tjbGFzcy5ub3ZvLXBzZXVkby1jaGVja2JveC1pbmRldGVybWluYXRlXSc6ICdzdGF0ZSA9PT0gXCJpbmRldGVybWluYXRlXCInLFxuICAgICdbY2xhc3Mubm92by1wc2V1ZG8tY2hlY2tib3gtY2hlY2tlZF0nOiAnc3RhdGUgPT09IFwiY2hlY2tlZFwiJyxcbiAgICAnW2NsYXNzLm5vdm8tcHNldWRvLWNoZWNrYm94LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5fbm92by1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvUHNldWRvQ2hlY2tib3gge1xuICAvKiogRGlzcGxheSBzdGF0ZSBvZiB0aGUgY2hlY2tib3guICovXG4gIEBJbnB1dCgpIHN0YXRlOiBOb3ZvUHNldWRvQ2hlY2tib3hTdGF0ZSA9ICd1bmNoZWNrZWQnO1xuICAvKiogRGlzcGxheSBzdGF0ZSBvZiB0aGUgY2hlY2tib3guICovXG4gIEBJbnB1dCgpIHNoYXBlOiBOb3ZvUHNldWRvQ2hlY2tib3hTaGFwZSA9ICdib3gnO1xuICAvKiogV2hldGhlciB0aGUgY2hlY2tib3ggaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge31cbn1cbiJdfQ==