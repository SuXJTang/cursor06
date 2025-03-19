import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';
import { QueryBuilderService } from './query-builder.service';
import * as i0 from "@angular/core";
import * as i1 from "./query-builder.service";
/**
 * Contained within a novoConditionField definition describing what input should be
 * used to capture the compare value of the Condtion
 */
export class NovoConditionInputDef {
    constructor(/** @docs-private */ template) {
        this.template = template;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoConditionInputDef, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: NovoConditionInputDef, selector: "[novoConditionInputDef]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoConditionInputDef, decorators: [{
            type: Directive,
            args: [{ selector: '[novoConditionInputDef]' }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
/**
 * Contained within a novoConditionField definition describing what operators should be available.
 */
export class NovoConditionOperatorsDef {
    constructor(/** @docs-private */ template) {
        this.template = template;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoConditionOperatorsDef, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: NovoConditionOperatorsDef, selector: "[novoConditionOperatorsDef]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoConditionOperatorsDef, decorators: [{
            type: Directive,
            args: [{ selector: '[novoConditionOperatorsDef]' }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });
/**
 * Field Field definition for the QueryBuilder.
 * Defines the inputType and operators to use for the query builder.
 */
export class BaseConditionFieldDef {
    /** Unique name for this field. */
    get name() {
        return this._name;
    }
    set name(name) {
        this._setNameInput(name);
    }
    constructor() { }
    /**
     * Overridable method that sets the css classes that will be added to every cell in this
     * column.
     * In the future, columnCssClassName will change from type string[] to string and this
     * will set a single string value.
     * @docs-private
     */
    _updateFieldCssClassName() {
        this._fieldCssClassName = [`novo-filter-field-${this.cssClassFriendlyName}`];
    }
    _setNameInput(value) {
        // If the directive is set without a name (updated programmatically), then this setter will
        // trigger with an empty string and should not overwrite the programmatically set value.
        if (value) {
            this._name = value;
            this.cssClassFriendlyName = value.replace(/[^a-z0-9_-]/gi, '-');
            this._updateFieldCssClassName();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: BaseConditionFieldDef, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: BaseConditionFieldDef, inputs: { name: ["novoFilterFieldDef", "name"] }, queries: [{ propertyName: "fieldInput", first: true, predicate: NovoConditionInputDef, descendants: true }, { propertyName: "fieldOperators", first: true, predicate: NovoConditionOperatorsDef, descendants: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: BaseConditionFieldDef, decorators: [{
            type: Directive
        }], ctorParameters: () => [], propDecorators: { name: [{
                type: Input,
                args: ['novoFilterFieldDef']
            }], fieldInput: [{
                type: ContentChild,
                args: [NovoConditionInputDef]
            }], fieldOperators: [{
                type: ContentChild,
                args: [NovoConditionOperatorsDef]
            }] } });
export class NovoConditionFieldDef extends BaseConditionFieldDef {
    constructor(qbs) {
        super();
        this.qbs = qbs;
    }
    register() {
        this.qbs.registerFieldDef(this);
    }
    unregister() {
        this.qbs.unregisterFieldDef(this);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoConditionFieldDef, deps: [{ token: i1.QueryBuilderService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: NovoConditionFieldDef, selector: "[novoConditionFieldDef]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoConditionFieldDef, decorators: [{
            type: Directive,
            args: [{
                    selector: '[novoConditionFieldDef]',
                }]
        }], ctorParameters: () => [{ type: i1.QueryBuilderService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktYnVpbGRlci5kaXJlY3RpdmVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvcXVlcnktYnVpbGRlci9xdWVyeS1idWlsZGVyLmRpcmVjdGl2ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7O0FBTzlEOzs7R0FHRztBQUVILE1BQU0sT0FBTyxxQkFBcUI7SUFDaEMsWUFBWSxvQkFBb0IsQ0FBUSxRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFHLENBQUM7K0dBRDNELHFCQUFxQjttR0FBckIscUJBQXFCOzs0RkFBckIscUJBQXFCO2tCQURqQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLHlCQUF5QixFQUFFOztBQUtsRDs7R0FFRztBQUVILE1BQU0sT0FBTyx5QkFBeUI7SUFDcEMsWUFBWSxvQkFBb0IsQ0FBUSxRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFHLENBQUM7K0dBRDNELHlCQUF5QjttR0FBekIseUJBQXlCOzs0RkFBekIseUJBQXlCO2tCQURyQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLDZCQUE2QixFQUFFOztBQUt0RDs7O0dBR0c7QUFFSCxNQUFNLE9BQU8scUJBQXFCO0lBQ2hDLGtDQUFrQztJQUNsQyxJQUNJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUNELElBQUksSUFBSSxDQUFDLElBQVk7UUFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBZ0JELGdCQUFlLENBQUM7SUFFaEI7Ozs7OztPQU1HO0lBQ08sd0JBQXdCO1FBQ2hDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLHFCQUFxQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFUyxhQUFhLENBQUMsS0FBYTtRQUNuQywyRkFBMkY7UUFDM0Ysd0ZBQXdGO1FBQ3hGLElBQUksS0FBSyxFQUFFLENBQUM7WUFDVixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDbEMsQ0FBQztJQUNILENBQUM7K0dBN0NVLHFCQUFxQjttR0FBckIscUJBQXFCLG9IQVdsQixxQkFBcUIsaUZBQ3JCLHlCQUF5Qjs7NEZBWjVCLHFCQUFxQjtrQkFEakMsU0FBUzt3REFJSixJQUFJO3NCQURQLEtBQUs7dUJBQUMsb0JBQW9CO2dCQVNVLFVBQVU7c0JBQTlDLFlBQVk7dUJBQUMscUJBQXFCO2dCQUNNLGNBQWM7c0JBQXRELFlBQVk7dUJBQUMseUJBQXlCOztBQXVDekMsTUFBTSxPQUFPLHFCQUFzQixTQUFRLHFCQUFxQjtJQUM5RCxZQUFvQixHQUF3QjtRQUMxQyxLQUFLLEVBQUUsQ0FBQztRQURVLFFBQUcsR0FBSCxHQUFHLENBQXFCO0lBRTVDLENBQUM7SUFDRCxRQUFRO1FBQ04sSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsVUFBVTtRQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQzsrR0FUVSxxQkFBcUI7bUdBQXJCLHFCQUFxQjs7NEZBQXJCLHFCQUFxQjtrQkFIakMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUseUJBQXlCO2lCQUNwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRlbnRDaGlsZCwgRGlyZWN0aXZlLCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFF1ZXJ5QnVpbGRlclNlcnZpY2UgfSBmcm9tICcuL3F1ZXJ5LWJ1aWxkZXIuc2VydmljZSc7XG5cbi8qKiBCYXNlIGludGVyZmFjZSBmb3IgYSBjb25kaWRhdGlvbiB0ZW1wbGF0ZSBkaXJlY3RpdmVzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb25kaXRpb25EZWYge1xuICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pjtcbn1cblxuLyoqXG4gKiBDb250YWluZWQgd2l0aGluIGEgbm92b0NvbmRpdGlvbkZpZWxkIGRlZmluaXRpb24gZGVzY3JpYmluZyB3aGF0IGlucHV0IHNob3VsZCBiZVxuICogdXNlZCB0byBjYXB0dXJlIHRoZSBjb21wYXJlIHZhbHVlIG9mIHRoZSBDb25kdGlvblxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbm92b0NvbmRpdGlvbklucHV0RGVmXScgfSlcbmV4cG9ydCBjbGFzcyBOb3ZvQ29uZGl0aW9uSW5wdXREZWYgaW1wbGVtZW50cyBDb25kaXRpb25EZWYge1xuICBjb25zdHJ1Y3RvcigvKiogQGRvY3MtcHJpdmF0ZSAqLyBwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogQ29udGFpbmVkIHdpdGhpbiBhIG5vdm9Db25kaXRpb25GaWVsZCBkZWZpbml0aW9uIGRlc2NyaWJpbmcgd2hhdCBvcGVyYXRvcnMgc2hvdWxkIGJlIGF2YWlsYWJsZS5cbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25vdm9Db25kaXRpb25PcGVyYXRvcnNEZWZdJyB9KVxuZXhwb3J0IGNsYXNzIE5vdm9Db25kaXRpb25PcGVyYXRvcnNEZWYgaW1wbGVtZW50cyBDb25kaXRpb25EZWYge1xuICBjb25zdHJ1Y3RvcigvKiogQGRvY3MtcHJpdmF0ZSAqLyBwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogRmllbGQgRmllbGQgZGVmaW5pdGlvbiBmb3IgdGhlIFF1ZXJ5QnVpbGRlci5cbiAqIERlZmluZXMgdGhlIGlucHV0VHlwZSBhbmQgb3BlcmF0b3JzIHRvIHVzZSBmb3IgdGhlIHF1ZXJ5IGJ1aWxkZXIuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEJhc2VDb25kaXRpb25GaWVsZERlZiB7XG4gIC8qKiBVbmlxdWUgbmFtZSBmb3IgdGhpcyBmaWVsZC4gKi9cbiAgQElucHV0KCdub3ZvRmlsdGVyRmllbGREZWYnKVxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG4gIHNldCBuYW1lKG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuX3NldE5hbWVJbnB1dChuYW1lKTtcbiAgfVxuICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZztcblxuICBAQ29udGVudENoaWxkKE5vdm9Db25kaXRpb25JbnB1dERlZikgZmllbGRJbnB1dDogTm92b0NvbmRpdGlvbklucHV0RGVmO1xuICBAQ29udGVudENoaWxkKE5vdm9Db25kaXRpb25PcGVyYXRvcnNEZWYpIGZpZWxkT3BlcmF0b3JzOiBOb3ZvQ29uZGl0aW9uT3BlcmF0b3JzRGVmO1xuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1lZCB2ZXJzaW9uIG9mIHRoZSBjb2x1bW4gbmFtZSB0aGF0IGNhbiBiZSB1c2VkIGFzIHBhcnQgb2YgYSBDU1MgY2xhc3NuYW1lLiBFeGNsdWRlc1xuICAgKiBhbGwgbm9uLWFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIGFuZCB0aGUgc3BlY2lhbCBjaGFyYWN0ZXJzICctJyBhbmQgJ18nLiBBbnkgY2hhcmFjdGVycyB0aGF0XG4gICAqIGRvIG5vdCBtYXRjaCBhcmUgcmVwbGFjZWQgYnkgdGhlICctJyBjaGFyYWN0ZXIuXG4gICAqL1xuICBjc3NDbGFzc0ZyaWVuZGx5TmFtZTogc3RyaW5nO1xuICBfZmllbGRDc3NDbGFzc05hbWU6IHN0cmluZ1tdO1xuXG4gIGRlZmF1bHRPcGVyYXRvcjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICAvKipcbiAgICogT3ZlcnJpZGFibGUgbWV0aG9kIHRoYXQgc2V0cyB0aGUgY3NzIGNsYXNzZXMgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIGV2ZXJ5IGNlbGwgaW4gdGhpc1xuICAgKiBjb2x1bW4uXG4gICAqIEluIHRoZSBmdXR1cmUsIGNvbHVtbkNzc0NsYXNzTmFtZSB3aWxsIGNoYW5nZSBmcm9tIHR5cGUgc3RyaW5nW10gdG8gc3RyaW5nIGFuZCB0aGlzXG4gICAqIHdpbGwgc2V0IGEgc2luZ2xlIHN0cmluZyB2YWx1ZS5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcHJvdGVjdGVkIF91cGRhdGVGaWVsZENzc0NsYXNzTmFtZSgpIHtcbiAgICB0aGlzLl9maWVsZENzc0NsYXNzTmFtZSA9IFtgbm92by1maWx0ZXItZmllbGQtJHt0aGlzLmNzc0NsYXNzRnJpZW5kbHlOYW1lfWBdO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9zZXROYW1lSW5wdXQodmFsdWU6IHN0cmluZykge1xuICAgIC8vIElmIHRoZSBkaXJlY3RpdmUgaXMgc2V0IHdpdGhvdXQgYSBuYW1lICh1cGRhdGVkIHByb2dyYW1tYXRpY2FsbHkpLCB0aGVuIHRoaXMgc2V0dGVyIHdpbGxcbiAgICAvLyB0cmlnZ2VyIHdpdGggYW4gZW1wdHkgc3RyaW5nIGFuZCBzaG91bGQgbm90IG92ZXJ3cml0ZSB0aGUgcHJvZ3JhbW1hdGljYWxseSBzZXQgdmFsdWUuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLl9uYW1lID0gdmFsdWU7XG4gICAgICB0aGlzLmNzc0NsYXNzRnJpZW5kbHlOYW1lID0gdmFsdWUucmVwbGFjZSgvW15hLXowLTlfLV0vZ2ksICctJyk7XG4gICAgICB0aGlzLl91cGRhdGVGaWVsZENzc0NsYXNzTmFtZSgpO1xuICAgIH1cbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbm92b0NvbmRpdGlvbkZpZWxkRGVmXScsXG59KVxuZXhwb3J0IGNsYXNzIE5vdm9Db25kaXRpb25GaWVsZERlZiBleHRlbmRzIEJhc2VDb25kaXRpb25GaWVsZERlZiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcWJzOiBRdWVyeUJ1aWxkZXJTZXJ2aWNlKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICByZWdpc3RlcigpIHtcbiAgICB0aGlzLnFicy5yZWdpc3RlckZpZWxkRGVmKHRoaXMpO1xuICB9XG4gIHVucmVnaXN0ZXIoKSB7XG4gICAgdGhpcy5xYnMudW5yZWdpc3RlckZpZWxkRGVmKHRoaXMpO1xuICB9XG59XG4iXX0=