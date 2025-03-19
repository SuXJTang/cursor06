import { Directive, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { NovoLabelService } from 'novo-elements/services';
import { NovoConditionFieldDef } from '../query-builder.directives';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
export class AbstractConditionFieldDef {
    /** Column name that should be used to reference this column. */
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
        // With Ivy, inputs can be initialized before static query results are
        // available. In that case, we defer the synchronization until "ngOnInit" fires.
        this._syncFieldDefName();
    }
    constructor(labels) {
        this.labels = labels;
        this.operatorEditGroups = [];
    }
    ngOnInit() {
        this._syncFieldDefName();
        this._syncFieldDefOperatorValue();
        this._previousOperatorValue = this.defaultOperator;
        // Need to add self to FilterBuilder because "ContentChildren won't find it"
        this.fieldDef?.register();
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.frameAfterViewInit();
        });
    }
    frameAfterViewInit() {
        const operatorField = this.formControlsByName.find(formControlDirective => formControlDirective.name === 'operator')?.control;
        if (operatorField) {
            this._previousOperatorValue = operatorField.value;
        }
    }
    ngOnDestroy() {
        this.fieldDef?.unregister();
    }
    /**
     * Define an edit group of operators. Once defined, if the user switches from one of these operators to another,
     * then the condition value will not be cleared. This makes sense if both operators use the same UI controls for editing.
     * @param operators The set of Operator values intended to share UI controls.
     */
    defineOperatorEditGroup(...operators) {
        this.operatorEditGroups.push(new Set(operators));
    }
    onOperatorSelect(formGroup) {
        let clearVal = true;
        if (this._previousOperatorValue && this.operatorEditGroups?.length) {
            const previousOperatorGroupIndex = this.operatorEditGroups.findIndex(grp => grp.has(this._previousOperatorValue));
            const newOperatorValue = formGroup.get('operator').getRawValue();
            const newOperatorGroupIndex = this.operatorEditGroups.findIndex(grp => grp.has(newOperatorValue));
            if (previousOperatorGroupIndex !== -1 && newOperatorGroupIndex !== -1 && previousOperatorGroupIndex === newOperatorGroupIndex) {
                clearVal = false;
            }
        }
        this._previousOperatorValue = formGroup.get('operator').value;
        if (clearVal) {
            formGroup.get('value').setValue(null);
        }
    }
    /** Synchronizes the column definition name with the text column name. */
    _syncFieldDefName() {
        if (this.fieldDef) {
            this.fieldDef.name = this.name;
        }
    }
    _syncFieldDefOperatorValue() {
        if (this.fieldDef) {
            this.fieldDef.defaultOperator = this.defaultOperator;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: AbstractConditionFieldDef, deps: [{ token: i1.NovoLabelService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: AbstractConditionFieldDef, inputs: { name: "name" }, viewQueries: [{ propertyName: "fieldDef", first: true, predicate: NovoConditionFieldDef, descendants: true, static: true }, { propertyName: "formControlsByName", predicate: FormControlName, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: AbstractConditionFieldDef, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i1.NovoLabelService }], propDecorators: { name: [{
                type: Input
            }], fieldDef: [{
                type: ViewChild,
                args: [NovoConditionFieldDef, { static: true }]
            }], formControlsByName: [{
                type: ViewChildren,
                args: [FormControlName]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3QtY29uZGl0aW9uLmRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9xdWVyeS1idWlsZGVyL2NvbmRpdGlvbi1kZWZpbml0aW9ucy9hYnN0cmFjdC1jb25kaXRpb24uZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZILE9BQU8sRUFBd0IsZUFBZSxFQUFvQixNQUFNLGdCQUFnQixDQUFDO0FBQ3pGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBRSxxQkFBcUIsRUFBNkIsTUFBTSw2QkFBNkIsQ0FBQzs7O0FBSS9GLE1BQU0sT0FBZ0IseUJBQXlCO0lBQzdDLGdFQUFnRTtJQUNoRSxJQUNJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUNELElBQUksSUFBSSxDQUFDLElBQVk7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsc0VBQXNFO1FBQ3RFLGdGQUFnRjtRQUNoRixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBV0QsWUFBbUIsTUFBd0I7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFMakMsdUJBQWtCLEdBQW9CLEVBQUUsQ0FBQztJQUtMLENBQUM7SUFFL0MsUUFBUTtRQUNOLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsZUFBMkIsQ0FBQztRQUMvRCw0RUFBNEU7UUFD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ZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBRdWVyeUxpc3QsIFZpZXdDaGlsZCwgVmlld0NoaWxkcmVuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbERpcmVjdGl2ZSwgRm9ybUNvbnRyb2xOYW1lLCBVbnR5cGVkRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTm92b0xhYmVsU2VydmljZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvc2VydmljZXMnO1xuaW1wb3J0IHsgTm92b0NvbmRpdGlvbkZpZWxkRGVmLCBOb3ZvQ29uZGl0aW9uT3BlcmF0b3JzRGVmIH0gZnJvbSAnLi4vcXVlcnktYnVpbGRlci5kaXJlY3RpdmVzJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vcXVlcnktYnVpbGRlci50eXBlcyc7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29uZGl0aW9uRmllbGREZWYgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIC8qKiBDb2x1bW4gbmFtZSB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIHJlZmVyZW5jZSB0aGlzIGNvbHVtbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuICBzZXQgbmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICAvLyBXaXRoIEl2eSwgaW5wdXRzIGNhbiBiZSBpbml0aWFsaXplZCBiZWZvcmUgc3RhdGljIHF1ZXJ5IHJlc3VsdHMgYXJlXG4gICAgLy8gYXZhaWxhYmxlLiBJbiB0aGF0IGNhc2UsIHdlIGRlZmVyIHRoZSBzeW5jaHJvbml6YXRpb24gdW50aWwgXCJuZ09uSW5pdFwiIGZpcmVzLlxuICAgIHRoaXMuX3N5bmNGaWVsZERlZk5hbWUoKTtcbiAgfVxuICBfbmFtZTogc3RyaW5nO1xuXG4gIGRlZmF1bHRPcGVyYXRvcjogT3BlcmF0b3IgfCBzdHJpbmc7XG4gIHByb3RlY3RlZCBfcHJldmlvdXNPcGVyYXRvclZhbHVlOiBPcGVyYXRvcjtcblxuICBwcm90ZWN0ZWQgb3BlcmF0b3JFZGl0R3JvdXBzOiBTZXQ8T3BlcmF0b3I+W10gPSBbXTtcblxuICBAVmlld0NoaWxkKE5vdm9Db25kaXRpb25GaWVsZERlZiwgeyBzdGF0aWM6IHRydWUgfSkgZmllbGREZWY6IE5vdm9Db25kaXRpb25GaWVsZERlZjtcbiAgQFZpZXdDaGlsZHJlbihGb3JtQ29udHJvbE5hbWUpIGZvcm1Db250cm9sc0J5TmFtZTogUXVlcnlMaXN0PEZvcm1Db250cm9sTmFtZT47XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxhYmVsczogTm92b0xhYmVsU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9zeW5jRmllbGREZWZOYW1lKCk7XG4gICAgdGhpcy5fc3luY0ZpZWxkRGVmT3BlcmF0b3JWYWx1ZSgpO1xuICAgIHRoaXMuX3ByZXZpb3VzT3BlcmF0b3JWYWx1ZSA9IHRoaXMuZGVmYXVsdE9wZXJhdG9yIGFzIE9wZXJhdG9yO1xuICAgIC8vIE5lZWQgdG8gYWRkIHNlbGYgdG8gRmlsdGVyQnVpbGRlciBiZWNhdXNlIFwiQ29udGVudENoaWxkcmVuIHdvbid0IGZpbmQgaXRcIlxuICAgIHRoaXMuZmllbGREZWY/LnJlZ2lzdGVyKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmZyYW1lQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnJhbWVBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IG9wZXJhdG9yRmllbGQgPSB0aGlzLmZvcm1Db250cm9sc0J5TmFtZS5maW5kKGZvcm1Db250cm9sRGlyZWN0aXZlID0+IGZvcm1Db250cm9sRGlyZWN0aXZlLm5hbWUgPT09ICdvcGVyYXRvcicpPy5jb250cm9sO1xuICAgIGlmIChvcGVyYXRvckZpZWxkKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c09wZXJhdG9yVmFsdWUgPSBvcGVyYXRvckZpZWxkLnZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZmllbGREZWY/LnVucmVnaXN0ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgYW4gZWRpdCBncm91cCBvZiBvcGVyYXRvcnMuIE9uY2UgZGVmaW5lZCwgaWYgdGhlIHVzZXIgc3dpdGNoZXMgZnJvbSBvbmUgb2YgdGhlc2Ugb3BlcmF0b3JzIHRvIGFub3RoZXIsXG4gICAqIHRoZW4gdGhlIGNvbmRpdGlvbiB2YWx1ZSB3aWxsIG5vdCBiZSBjbGVhcmVkLiBUaGlzIG1ha2VzIHNlbnNlIGlmIGJvdGggb3BlcmF0b3JzIHVzZSB0aGUgc2FtZSBVSSBjb250cm9scyBmb3IgZWRpdGluZy5cbiAgICogQHBhcmFtIG9wZXJhdG9ycyBUaGUgc2V0IG9mIE9wZXJhdG9yIHZhbHVlcyBpbnRlbmRlZCB0byBzaGFyZSBVSSBjb250cm9scy5cbiAgICovXG4gIHByb3RlY3RlZCBkZWZpbmVPcGVyYXRvckVkaXRHcm91cCguLi5vcGVyYXRvcnM6IE9wZXJhdG9yW10pOiB2b2lkIHtcbiAgICB0aGlzLm9wZXJhdG9yRWRpdEdyb3Vwcy5wdXNoKG5ldyBTZXQob3BlcmF0b3JzKSk7XG4gIH1cblxuICBvbk9wZXJhdG9yU2VsZWN0KGZvcm1Hcm91cDogVW50eXBlZEZvcm1Hcm91cCk6IHZvaWQge1xuICAgIGxldCBjbGVhclZhbCA9IHRydWU7XG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzT3BlcmF0b3JWYWx1ZSAmJiB0aGlzLm9wZXJhdG9yRWRpdEdyb3Vwcz8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwcmV2aW91c09wZXJhdG9yR3JvdXBJbmRleCA9IHRoaXMub3BlcmF0b3JFZGl0R3JvdXBzLmZpbmRJbmRleChncnAgPT4gZ3JwLmhhcyh0aGlzLl9wcmV2aW91c09wZXJhdG9yVmFsdWUpKTtcbiAgICAgIGNvbnN0IG5ld09wZXJhdG9yVmFsdWUgPSBmb3JtR3JvdXAuZ2V0KCdvcGVyYXRvcicpLmdldFJhd1ZhbHVlKCk7XG4gICAgICBjb25zdCBuZXdPcGVyYXRvckdyb3VwSW5kZXggPSB0aGlzLm9wZXJhdG9yRWRpdEdyb3Vwcy5maW5kSW5kZXgoZ3JwID0+IGdycC5oYXMobmV3T3BlcmF0b3JWYWx1ZSkpO1xuICAgICAgaWYgKHByZXZpb3VzT3BlcmF0b3JHcm91cEluZGV4ICE9PSAtMSAmJiBuZXdPcGVyYXRvckdyb3VwSW5kZXggIT09IC0xICYmIHByZXZpb3VzT3BlcmF0b3JHcm91cEluZGV4ID09PSBuZXdPcGVyYXRvckdyb3VwSW5kZXgpIHtcbiAgICAgICAgY2xlYXJWYWwgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fcHJldmlvdXNPcGVyYXRvclZhbHVlID0gZm9ybUdyb3VwLmdldCgnb3BlcmF0b3InKS52YWx1ZTtcbiAgICBpZiAoY2xlYXJWYWwpIHtcbiAgICAgIGZvcm1Hcm91cC5nZXQoJ3ZhbHVlJykuc2V0VmFsdWUobnVsbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFN5bmNocm9uaXplcyB0aGUgY29sdW1uIGRlZmluaXRpb24gbmFtZSB3aXRoIHRoZSB0ZXh0IGNvbHVtbiBuYW1lLiAqL1xuICBwcml2YXRlIF9zeW5jRmllbGREZWZOYW1lKCkge1xuICAgIGlmICh0aGlzLmZpZWxkRGVmKSB7XG4gICAgICB0aGlzLmZpZWxkRGVmLm5hbWUgPSB0aGlzLm5hbWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc3luY0ZpZWxkRGVmT3BlcmF0b3JWYWx1ZSgpIHtcbiAgICBpZiAodGhpcy5maWVsZERlZikge1xuICAgICAgdGhpcy5maWVsZERlZi5kZWZhdWx0T3BlcmF0b3IgPSB0aGlzLmRlZmF1bHRPcGVyYXRvcjtcbiAgICB9XG4gIH1cbn1cbiJdfQ==