import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, HostBinding, Input, Optional, SkipSelf, ViewChild, ViewContainerRef, computed, input } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { NovoLabelService } from 'novo-elements/services';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { QueryBuilderService } from '../query-builder.service';
import { NOVO_CONDITION_BUILDER } from '../query-builder.tokens';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "../query-builder.service";
import * as i3 from "@angular/forms";
import * as i4 from "@angular/common";
import * as i5 from "novo-elements/elements/common";
import * as i6 from "novo-elements/elements/select";
import * as i7 from "novo-elements/elements/field";
import * as i8 from "novo-elements/elements/flex";
import * as i9 from "novo-elements/elements/loading";
import * as i10 from "novo-elements/elements/select-search";
import * as i11 from "../condition-templates/condition-templates.component";
/**
 * Provides a handle for the table to grab the view container's ng-container to insert data rows.
 * @docs-private
 */
export class ConditionInputOutlet {
    constructor(viewContainer, elementRef) {
        this.viewContainer = viewContainer;
        this.elementRef = elementRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConditionInputOutlet, deps: [{ token: i0.ViewContainerRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: ConditionInputOutlet, selector: "[conditionInputOutlet]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConditionInputOutlet, decorators: [{
            type: Directive,
            args: [{ selector: '[conditionInputOutlet]' }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.ElementRef }] });
/**
 * Provides a handle for the table to grab the view container's ng-container to insert data rows.
 * @docs-private
 */
export class ConditionOperatorOutlet {
    constructor(viewContainer, elementRef) {
        this.viewContainer = viewContainer;
        this.elementRef = elementRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConditionOperatorOutlet, deps: [{ token: i0.ViewContainerRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: ConditionOperatorOutlet, selector: "[conditionOperatorOutlet]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConditionOperatorOutlet, decorators: [{
            type: Directive,
            args: [{ selector: '[conditionOperatorOutlet]' }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.ElementRef }] });
export class ConditionBuilderComponent {
    constructor(labels, cdr, queryBuilderService, controlContainer) {
        this.labels = labels;
        this.cdr = cdr;
        this.queryBuilderService = queryBuilderService;
        this.controlContainer = controlContainer;
        this.hideOperator = input(true);
        this.conditionType = input();
        // This component can either be directly hosted as a host to a condition, or it can be part of a condition group within a criteria builder.
        // In the former case, config will come from inputs, and we will instantiate our own QueryBuilderService. In the latter, it comes from
        // the QueryBuilderService.
        this.inputConfig = input(null, { alias: 'config' });
        this.inputEditTypeFn = input(null, { alias: 'editTypeFn' });
        this.config = computed(() => {
            if (this.isConditionHost) {
                this.queryBuilderService.config = this.inputConfig();
            }
            return this.queryBuilderService.config;
        });
        this.editTypeFn = computed(() => {
            if (this.isConditionHost) {
                this.queryBuilderService.editTypeFn = this.inputEditTypeFn();
            }
            return this.queryBuilderService.editTypeFn;
        });
        this.searchTerm = new FormControl();
        this.staticFieldSelection = computed(() => this.config().staticFieldSelection);
        this._lastContext = {};
        this.isConditionHost = false;
        this.gridColumns = computed(() => {
            if (this.staticFieldSelection()) {
                return '13rem 1fr';
            }
            else {
                const firstColumnWidth = this.hideOperator() ? '20rem' : '16rem';
                return `${firstColumnWidth} 13rem 1fr`;
            }
        });
        /** Subject that emits when the component has been destroyed. */
        this._onDestroy = new Subject();
        if (!queryBuilderService.componentHost) {
            queryBuilderService.componentHost = this;
            this.isConditionHost = true;
            this.groupIndex = 0;
            this.andIndex = 0;
        }
    }
    ngOnInit() {
        this.parentForm = this.controlContainer.control;
        this.parentForm.controls.field.valueChanges.subscribe((value) => {
            Promise.resolve().then(() => this.updateFieldSelection());
        });
    }
    ngOnChanges(changes) {
        if (changes.inputConfig?.previousValue?.staticFieldSelection &&
            changes.inputConfig.previousValue.staticFieldSelection !== changes.inputConfig.currentValue.staticFieldSelection) {
            this.parentForm.controls.field.setValue(changes.inputConfig.currentValue.staticFieldSelection);
        }
    }
    ngAfterContentInit() {
        const allFields = this.config()?.fields || [];
        const scopedFields = this.scope ? allFields.find((field) => field.value === this.scope) : allFields[0];
        allFields.length && this.changeFieldOptions(scopedFields);
        this.searches = this.searchTerm.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
            this.results$ = Promise.resolve(this.fieldConfig.options.filter((f) => f.name.toLowerCase().includes(term.toLowerCase()) || f.label?.toLowerCase().includes(term.toLowerCase())));
            this.cdr.markForCheck();
        });
    }
    ngAfterViewInit() {
        if (this.parentForm.value?.field !== null) {
            Promise.resolve().then(() => this.updateFieldSelection());
        }
    }
    ngOnDestroy() {
        this.searches.unsubscribe();
        // Clear all outlets and Maps
        [this._operatorOutlet.viewContainer, this._inputOutlet.viewContainer].forEach((def) => {
            def.clear();
        });
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    /**
     * Updates the Conditions "Field" Options to Change base on new Scope
     * @param fieldConfig
     */
    changeFieldOptions(fieldConfig) {
        this.fieldConfig = fieldConfig;
        this.searchTerm.setValue('');
        this.results$ = Promise.resolve(this.fieldConfig.options);
    }
    /**
     * Resets the input and operator view containers, regenerates the field templates,
     * and marks the component for change detection.
     *
     * Use this method after updating form controls to reinitialize the input and
     * operator fields so that the view reflects the latest form control changes.
     *
     * @returns void
     */
    resetInputAndOperator() {
        this._inputOutlet.viewContainer.clear();
        this._operatorOutlet.viewContainer.clear();
        this.createFieldTemplates();
        this.cdr.markForCheck();
    }
    getField() {
        const field = this.parentForm?.value?.field;
        if (!field)
            return null;
        return this.fieldConfig.find(field);
    }
    getDefaultField() {
        const fields = this.fieldConfig.options;
        if (fields?.length) {
            return fields[0].name;
        }
        return null;
    }
    updateFieldSelection() {
        const fieldConf = this.getField();
        if (!fieldConf) {
            this.parentForm.get('field').setValue(this.getDefaultField());
            return;
        }
        else {
            this.fieldDisplayWith = () => fieldConf.label || fieldConf.name;
            this.displayIcon = fieldConf.icon || null;
        }
        const { field } = this.parentForm.value;
        if (this._lastContext.field !== field) {
            if (this._lastContext.field) {
                // only clearing operator/value if field was previously defined so we can preload values onto the form
                this.parentForm.get('value').setValue(null);
                this.parentForm.get('operator').setValue(null);
            }
            this.createFieldTemplates();
        }
        setTimeout(() => this.updateConditionType());
        this._lastContext = { ...this.parentForm.value };
        this.cdr.markForCheck();
    }
    updateConditionType() {
        this.parentForm.get('conditionType')?.setValue(this.conditionType());
    }
    findDefinitionForField(field) {
        if (!field)
            return;
        const editType = this.editTypeFn()(field);
        // Don't look at dataSpecialization it is no good, this misses currency, and percent
        const { name } = field;
        const fieldDefsByName = this.queryBuilderService.getFieldDefsByName();
        // Check Fields by priority for match Field Definition
        const key = [name, editType?.toUpperCase(), 'DEFAULT'].find((it) => fieldDefsByName.has(it));
        return fieldDefsByName.get(key);
    }
    createFieldTemplates() {
        const definition = this.findDefinitionForField(this.getField());
        if (!this.parentForm.get('operator').value) {
            this.parentForm.get('operator').setValue(definition.defaultOperator);
        }
        this.createFieldOperators(definition);
        this.createFieldInput(definition);
    }
    createFieldOperators(definition) {
        this._operatorOutlet.viewContainer.clear();
        if (definition) {
            const context = { $implicit: this.parentForm, fieldMeta: this.getField() };
            this._operatorOutlet.viewContainer.createEmbeddedView(definition.fieldOperators.template, context);
        }
        this.cdr.markForCheck();
    }
    createFieldInput(definition) {
        this._inputOutlet.viewContainer.clear();
        if (definition) {
            const context = { $implicit: this.parentForm, fieldMeta: this.getField(), viewIndex: this.groupIndex.toString() + this.andIndex.toString() };
            this._inputOutlet.viewContainer.createEmbeddedView(definition.fieldInput.template, context);
        }
        this.cdr.markForCheck();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConditionBuilderComponent, deps: [{ token: i1.NovoLabelService }, { token: i0.ChangeDetectorRef }, { token: i2.QueryBuilderService }, { token: i3.ControlContainer }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "17.3.12", type: ConditionBuilderComponent, selector: "novo-condition-builder", inputs: { label: { classPropertyName: "label", publicName: "label", isSignal: false, isRequired: false, transformFunction: null }, scope: { classPropertyName: "scope", publicName: "scope", isSignal: false, isRequired: false, transformFunction: null }, andIndex: { classPropertyName: "andIndex", publicName: "andIndex", isSignal: false, isRequired: false, transformFunction: null }, groupIndex: { classPropertyName: "groupIndex", publicName: "groupIndex", isSignal: false, isRequired: false, transformFunction: null }, addressConfig: { classPropertyName: "addressConfig", publicName: "addressConfig", isSignal: false, isRequired: false, transformFunction: null }, hideOperator: { classPropertyName: "hideOperator", publicName: "hideOperator", isSignal: true, isRequired: false, transformFunction: null }, conditionType: { classPropertyName: "conditionType", publicName: "conditionType", isSignal: true, isRequired: false, transformFunction: null }, inputConfig: { classPropertyName: "inputConfig", publicName: "config", isSignal: true, isRequired: false, transformFunction: null }, inputEditTypeFn: { classPropertyName: "inputEditTypeFn", publicName: "editTypeFn", isSignal: true, isRequired: false, transformFunction: null } }, host: { properties: { "class.condition-host": "this.isConditionHost" } }, providers: [{ provide: NOVO_CONDITION_BUILDER, useExisting: ConditionBuilderComponent },
            {
                provide: QueryBuilderService,
                deps: [NovoLabelService, [new SkipSelf(), new Optional(), QueryBuilderService]],
                useFactory: (labelService, queryBuilderService) => {
                    if (!queryBuilderService) {
                        queryBuilderService = new QueryBuilderService(labelService);
                    }
                    return queryBuilderService;
                }
            }
        ], viewQueries: [{ propertyName: "_operatorOutlet", first: true, predicate: ConditionOperatorOutlet, descendants: true, static: true }, { propertyName: "_inputOutlet", first: true, predicate: ConditionInputOutlet, descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<form [formGroup]=\"parentForm\">\n  <novo-grid gap=\"1rem\" [columns]=\"gridColumns()\" align=\"end\">\n    <novo-field class=\"condition-field\" *ngIf=\"!staticFieldSelection()\">\n      <novo-select\n        [placeholder]=\"labels.chooseAField\"\n        formControlName=\"field\"\n        (onSelect)=\"updateFieldSelection()\"\n        overlayWidth=\"24rem\"\n        overlayHeight=\"20rem\"\n        [displayWith]=\"fieldDisplayWith\"\n        [style.minWidth.px]=\"160\"\n        [style.maxWidth.px]=\"(hideOperator() || isConditionHost) ? 200 : 160\"\n        [displayIcon]=\"displayIcon\">\n        <novo-optgroup class=\"filter-search-results\">\n          <novo-option>\n            <novo-select-search [formControl]=\"searchTerm\" [clearSearchInput]=\"false\"></novo-select-search>\n          </novo-option>\n          <ng-container *ngIf=\"results$ | async as results; else loading\">\n            <ng-container *ngIf=\"results.length\">\n              <novo-option *ngFor=\"let field of results\" value=\"{{ field.name }}\"\n                [attr.data-automation-id]=\"field.name\">\n                {{ field.label || field.name }}\n              </novo-option>\n            </ng-container>\n          </ng-container>\n        </novo-optgroup>\n      </novo-select>\n    </novo-field>\n\n    <div class=\"condition-operator\">\n      <ng-container conditionOperatorOutlet></ng-container>\n    </div>\n\n    <div class=\"condition-input\">\n      <ng-container conditionInputOutlet></ng-container>\n    </div>\n  </novo-grid>\n  <ng-content></ng-content>\n</form>\n\n<novo-condition-templates *ngIf=\"isConditionHost\" [addressConfig]=\"addressConfig\"/>\n\n<!-- LOADING TEMPLATE -->\n<ng-template #loading>\n  <novo-loading></novo-loading>\n</ng-template>\n", styles: [":host{position:relative;display:block;width:100%}:host.condition-host{padding:var(--spacing-md);margin-bottom:1rem}:host .condition-field{grid-template-columns:minmax(fit-content,1fr);width:100%;width:-webkit-fill-available}:host .condition-operator::ng-deep .novo-select{min-width:13rem}:host .condition-input::ng-deep novo-field.novo-field-layout-vertical{grid-template-columns:minmax(fit-content,1fr);width:-webkit-fill-available}:host .condition-input::ng-deep novo-field.novo-field-layout-vertical .novo-input-element{width:100%}:host .condition-input::ng-deep novo-field{width:fit-content}:host .condition-input::ng-deep novo-field.address-radius{width:100px;min-width:100px;max-width:100px;margin-right:1rem}:host .condition-input::ng-deep novo-field.address-radius novo-select{min-width:70px}:host .condition-input::ng-deep .novo-field-infix{white-space:nowrap;overflow:hidden}:host .condition-input::ng-deep novo-chip-list{flex-grow:1}:host .condition-input::ng-deep novo-chip-list novo-chip{max-width:min(33rem,100% - 9px)}:host .condition-input::ng-deep novo-chips{border-bottom:none!important}:host .condition-input::ng-deep novo-chips input{padding-left:0!important}:host .condition-input::ng-deep novo-radio-group{padding:0!important}:host .and-or-filter-button{box-sizing:border-box;background:#fff;border:1px solid #ddd;color:#5691f5;display:inline-block;position:relative;cursor:pointer;margin:.4rem auto;align-items:center;text-align:center;-webkit-user-select:none;user-select:none;outline:none;white-space:nowrap;text-transform:uppercase;overflow:hidden;transition:box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}\n"], dependencies: [{ kind: "directive", type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i5.GapDirective, selector: "[gap]", inputs: ["gap"] }, { kind: "component", type: i6.NovoSelectElement, selector: "novo-select", inputs: ["disabled", "required", "tabIndex", "id", "name", "options", "placeholder", "readonly", "headerConfig", "position", "overlayWidth", "overlayHeight", "displayIcon", "displayWith", "compareWith", "value", "multiple"], outputs: ["onSelect", "selectionChange", "valueChange", "openedChange", "opened", "closed"] }, { kind: "component", type: i7.NovoFieldElement, selector: "novo-field", inputs: ["layout", "appearance", "customOverlayOrigin", "width"], outputs: ["valueChanges", "stateChanges"] }, { kind: "component", type: i5.NovoOption, selector: "novo-option", inputs: ["selected", "keepOpen", "novoInert", "value", "disabled"], exportAs: ["novoOption"] }, { kind: "component", type: i5.NovoOptgroup, selector: "novo-optgroup", inputs: ["disabled", "label"], exportAs: ["novoOptgroup"] }, { kind: "component", type: i8.NovoGridElement, selector: "novo-grid", inputs: ["direction", "align", "justify", "columns"] }, { kind: "component", type: i9.NovoLoadingElement, selector: "novo-loading", inputs: ["theme", "color", "size"] }, { kind: "component", type: i10.NovoSelectSearchComponent, selector: "novo-select-search", inputs: ["name", "placeholderLabel", "type", "noEntriesFoundLabel", "indexAndLengthScreenReaderText", "clearSearchInput", "searching", "disableInitialFocus", "enableClearOnEscapePressed", "preventHomeEndKeyPropagation", "disableScrollToActiveOnOptionsChanged", "ariaLabel", "showToggleAllCheckbox", "toggleAllCheckboxChecked", "toggleAllCheckboxIndeterminate", "toggleAllCheckboxTooltipMessage", "toogleAllCheckboxTooltipPosition", "hideClearSearchButton", "alwaysRestoreSelectedOptionsMulti"], outputs: ["toggleAll"] }, { kind: "directive", type: ConditionInputOutlet, selector: "[conditionInputOutlet]" }, { kind: "directive", type: ConditionOperatorOutlet, selector: "[conditionOperatorOutlet]" }, { kind: "component", type: i11.NovoConditionTemplatesComponent, selector: "novo-condition-templates", inputs: ["addressConfig"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ConditionBuilderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'novo-condition-builder', providers: [{ provide: NOVO_CONDITION_BUILDER, useExisting: ConditionBuilderComponent },
                        {
                            provide: QueryBuilderService,
                            deps: [NovoLabelService, [new SkipSelf(), new Optional(), QueryBuilderService]],
                            useFactory: (labelService, queryBuilderService) => {
                                if (!queryBuilderService) {
                                    queryBuilderService = new QueryBuilderService(labelService);
                                }
                                return queryBuilderService;
                            }
                        }
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<form [formGroup]=\"parentForm\">\n  <novo-grid gap=\"1rem\" [columns]=\"gridColumns()\" align=\"end\">\n    <novo-field class=\"condition-field\" *ngIf=\"!staticFieldSelection()\">\n      <novo-select\n        [placeholder]=\"labels.chooseAField\"\n        formControlName=\"field\"\n        (onSelect)=\"updateFieldSelection()\"\n        overlayWidth=\"24rem\"\n        overlayHeight=\"20rem\"\n        [displayWith]=\"fieldDisplayWith\"\n        [style.minWidth.px]=\"160\"\n        [style.maxWidth.px]=\"(hideOperator() || isConditionHost) ? 200 : 160\"\n        [displayIcon]=\"displayIcon\">\n        <novo-optgroup class=\"filter-search-results\">\n          <novo-option>\n            <novo-select-search [formControl]=\"searchTerm\" [clearSearchInput]=\"false\"></novo-select-search>\n          </novo-option>\n          <ng-container *ngIf=\"results$ | async as results; else loading\">\n            <ng-container *ngIf=\"results.length\">\n              <novo-option *ngFor=\"let field of results\" value=\"{{ field.name }}\"\n                [attr.data-automation-id]=\"field.name\">\n                {{ field.label || field.name }}\n              </novo-option>\n            </ng-container>\n          </ng-container>\n        </novo-optgroup>\n      </novo-select>\n    </novo-field>\n\n    <div class=\"condition-operator\">\n      <ng-container conditionOperatorOutlet></ng-container>\n    </div>\n\n    <div class=\"condition-input\">\n      <ng-container conditionInputOutlet></ng-container>\n    </div>\n  </novo-grid>\n  <ng-content></ng-content>\n</form>\n\n<novo-condition-templates *ngIf=\"isConditionHost\" [addressConfig]=\"addressConfig\"/>\n\n<!-- LOADING TEMPLATE -->\n<ng-template #loading>\n  <novo-loading></novo-loading>\n</ng-template>\n", styles: [":host{position:relative;display:block;width:100%}:host.condition-host{padding:var(--spacing-md);margin-bottom:1rem}:host .condition-field{grid-template-columns:minmax(fit-content,1fr);width:100%;width:-webkit-fill-available}:host .condition-operator::ng-deep .novo-select{min-width:13rem}:host .condition-input::ng-deep novo-field.novo-field-layout-vertical{grid-template-columns:minmax(fit-content,1fr);width:-webkit-fill-available}:host .condition-input::ng-deep novo-field.novo-field-layout-vertical .novo-input-element{width:100%}:host .condition-input::ng-deep novo-field{width:fit-content}:host .condition-input::ng-deep novo-field.address-radius{width:100px;min-width:100px;max-width:100px;margin-right:1rem}:host .condition-input::ng-deep novo-field.address-radius novo-select{min-width:70px}:host .condition-input::ng-deep .novo-field-infix{white-space:nowrap;overflow:hidden}:host .condition-input::ng-deep novo-chip-list{flex-grow:1}:host .condition-input::ng-deep novo-chip-list novo-chip{max-width:min(33rem,100% - 9px)}:host .condition-input::ng-deep novo-chips{border-bottom:none!important}:host .condition-input::ng-deep novo-chips input{padding-left:0!important}:host .condition-input::ng-deep novo-radio-group{padding:0!important}:host .and-or-filter-button{box-sizing:border-box;background:#fff;border:1px solid #ddd;color:#5691f5;display:inline-block;position:relative;cursor:pointer;margin:.4rem auto;align-items:center;text-align:center;-webkit-user-select:none;user-select:none;outline:none;white-space:nowrap;text-transform:uppercase;overflow:hidden;transition:box-shadow .4s cubic-bezier(.25,.8,.25,1),background-color .4s cubic-bezier(.25,.8,.25,1)}\n"] }]
        }], ctorParameters: () => [{ type: i1.NovoLabelService }, { type: i0.ChangeDetectorRef }, { type: i2.QueryBuilderService }, { type: i3.ControlContainer }], propDecorators: { _operatorOutlet: [{
                type: ViewChild,
                args: [ConditionOperatorOutlet, { static: true }]
            }], _inputOutlet: [{
                type: ViewChild,
                args: [ConditionInputOutlet, { static: true }]
            }], label: [{
                type: Input
            }], scope: [{
                type: Input
            }], andIndex: [{
                type: Input
            }], groupIndex: [{
                type: Input
            }], addressConfig: [{
                type: Input
            }], isConditionHost: [{
                type: HostBinding,
                args: ['class.condition-host']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uLWJ1aWxkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvcXVlcnktYnVpbGRlci9jb25kaXRpb24tYnVpbGRlci9jb25kaXRpb24tYnVpbGRlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9xdWVyeS1idWlsZGVyL2NvbmRpdGlvbi1idWlsZGVyL2NvbmRpdGlvbi1idWlsZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFdBQVcsRUFDWCxLQUFLLEVBSUwsUUFBUSxFQUVSLFFBQVEsRUFDUixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLFFBQVEsRUFDUixLQUFLLEVBQ04sTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBYSxNQUFNLGdCQUFnQixDQUFDO0FBQzFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRSxPQUFPLEVBQXNCLG1CQUFtQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDbkYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0seUJBQXlCLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFHakU7OztHQUdHO0FBRUgsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUFtQixhQUErQixFQUFTLFVBQXNCO1FBQTlELGtCQUFhLEdBQWIsYUFBYSxD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O3FCQUNGLG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNO3NMQUdPLGVBQWU7c0JBQXBFLFNBQVM7dUJBQUMsdUJBQXVCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUNELFlBQVk7c0JBQTlELFNBQVM7dUJBQUMsb0JBQW9CLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUV4QyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQWlDQyxlQUFlO3NCQURyQixXQUFXO3VCQUFDLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFNraXBTZWxmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIGNvbXB1dGVkLFxuICBpbnB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xDb250YWluZXIsIEZvcm1Db250cm9sLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBOb3ZvTGFiZWxTZXJ2aWNlIH0gZnJvbSAnbm92by1lbGVtZW50cy9zZXJ2aWNlcyc7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZGlzdGluY3RVbnRpbENoYW5nZWQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBCYXNlQ29uZGl0aW9uRmllbGREZWYgfSBmcm9tICcuLi9xdWVyeS1idWlsZGVyLmRpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgUXVlcnlCdWlsZGVyQ29uZmlnLCBRdWVyeUJ1aWxkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcXVlcnktYnVpbGRlci5zZXJ2aWNlJztcbmltcG9ydCB7IE5PVk9fQ09ORElUSU9OX0JVSUxERVIgfSBmcm9tICcuLi9xdWVyeS1idWlsZGVyLnRva2Vucyc7XG5pbXBvcnQgeyBBZGRyZXNzQ3JpdGVyaWFDb25maWcsIEJhc2VGaWVsZERlZiwgRmllbGRDb25maWcsIFF1ZXJ5RmlsdGVyT3V0bGV0IH0gZnJvbSAnLi4vcXVlcnktYnVpbGRlci50eXBlcyc7XG5cbi8qKlxuICogUHJvdmlkZXMgYSBoYW5kbGUgZm9yIHRoZSB0YWJsZSB0byBncmFiIHRoZSB2aWV3IGNvbnRhaW5lcidzIG5nLWNvbnRhaW5lciB0byBpbnNlcnQgZGF0YSByb3dzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbY29uZGl0aW9uSW5wdXRPdXRsZXRdJyB9KVxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbklucHV0T3V0bGV0IGltcGxlbWVudHMgUXVlcnlGaWx0ZXJPdXRsZXQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZiwgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYSBoYW5kbGUgZm9yIHRoZSB0YWJsZSB0byBncmFiIHRoZSB2aWV3IGNvbnRhaW5lcidzIG5nLWNvbnRhaW5lciB0byBpbnNlcnQgZGF0YSByb3dzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbY29uZGl0aW9uT3BlcmF0b3JPdXRsZXRdJyB9KVxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbk9wZXJhdG9yT3V0bGV0IGltcGxlbWVudHMgUXVlcnlGaWx0ZXJPdXRsZXQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZiwgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25vdm8tY29uZGl0aW9uLWJ1aWxkZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vY29uZGl0aW9uLWJ1aWxkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb25kaXRpb24tYnVpbGRlci5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5PVk9fQ09ORElUSU9OX0JVSUxERVIsIHVzZUV4aXN0aW5nOiBDb25kaXRpb25CdWlsZGVyQ29tcG9uZW50IH0sXG4gICAge1xuICAgICAgcHJvdmlkZTogUXVlcnlCdWlsZGVyU2VydmljZSxcbiAgICAgIGRlcHM6IFtOb3ZvTGFiZWxTZXJ2aWNlLCBbbmV3IFNraXBTZWxmKCksIG5ldyBPcHRpb25hbCgpLCBRdWVyeUJ1aWxkZXJTZXJ2aWNlXV0sXG4gICAgICB1c2VGYWN0b3J5OiAobGFiZWxTZXJ2aWNlOiBOb3ZvTGFiZWxTZXJ2aWNlLCBxdWVyeUJ1aWxkZXJTZXJ2aWNlPzogUXVlcnlCdWlsZGVyU2VydmljZSkgPT4ge1xuICAgICAgICBpZiAoIXF1ZXJ5QnVpbGRlclNlcnZpY2UpIHtcbiAgICAgICAgICBxdWVyeUJ1aWxkZXJTZXJ2aWNlID0gbmV3IFF1ZXJ5QnVpbGRlclNlcnZpY2UobGFiZWxTZXJ2aWNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcXVlcnlCdWlsZGVyU2VydmljZTtcbiAgICAgIH1cbiAgICB9XG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBDb25kaXRpb25CdWlsZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBWaWV3Q2hpbGQoQ29uZGl0aW9uT3BlcmF0b3JPdXRsZXQsIHsgc3RhdGljOiB0cnVlIH0pIF9vcGVyYXRvck91dGxldDogQ29uZGl0aW9uT3BlcmF0b3JPdXRsZXQ7XG4gIEBWaWV3Q2hpbGQoQ29uZGl0aW9uSW5wdXRPdXRsZXQsIHsgc3RhdGljOiB0cnVlIH0pIF9pbnB1dE91dGxldDogQ29uZGl0aW9uSW5wdXRPdXRsZXQ7XG5cbiAgQElucHV0KCkgbGFiZWw6IGFueTtcbiAgQElucHV0KCkgc2NvcGU6IHN0cmluZztcbiAgQElucHV0KCkgYW5kSW5kZXg6IG51bWJlcjtcbiAgQElucHV0KCkgZ3JvdXBJbmRleDogbnVtYmVyO1xuICBASW5wdXQoKSBhZGRyZXNzQ29uZmlnOiBBZGRyZXNzQ3JpdGVyaWFDb25maWc7XG4gIGhpZGVPcGVyYXRvciA9IGlucHV0KHRydWUpO1xuICBjb25kaXRpb25UeXBlID0gaW5wdXQoKTtcblxuICAvLyBUaGlzIGNvbXBvbmVudCBjYW4gZWl0aGVyIGJlIGRpcmVjdGx5IGhvc3RlZCBhcyBhIGhvc3QgdG8gYSBjb25kaXRpb24sIG9yIGl0IGNhbiBiZSBwYXJ0IG9mIGEgY29uZGl0aW9uIGdyb3VwIHdpdGhpbiBhIGNyaXRlcmlhIGJ1aWxkZXIuXG4gIC8vIEluIHRoZSBmb3JtZXIgY2FzZSwgY29uZmlnIHdpbGwgY29tZSBmcm9tIGlucHV0cywgYW5kIHdlIHdpbGwgaW5zdGFudGlhdGUgb3VyIG93biBRdWVyeUJ1aWxkZXJTZXJ2aWNlLiBJbiB0aGUgbGF0dGVyLCBpdCBjb21lcyBmcm9tXG4gIC8vIHRoZSBRdWVyeUJ1aWxkZXJTZXJ2aWNlLlxuICBpbnB1dENvbmZpZyA9IGlucHV0PFF1ZXJ5QnVpbGRlckNvbmZpZz4obnVsbCwgeyBhbGlhczogJ2NvbmZpZyd9KTtcbiAgaW5wdXRFZGl0VHlwZUZuID0gaW5wdXQ8KGZpZWxkOiBCYXNlRmllbGREZWYpID0+IHN0cmluZz4obnVsbCwgeyBhbGlhczogJ2VkaXRUeXBlRm4nfSk7XG4gIHByaXZhdGUgY29uZmlnID0gY29tcHV0ZWQ8UXVlcnlCdWlsZGVyQ29uZmlnPigoKSA9PiB7XG4gICAgaWYgKHRoaXMuaXNDb25kaXRpb25Ib3N0KSB7XG4gICAgICB0aGlzLnF1ZXJ5QnVpbGRlclNlcnZpY2UuY29uZmlnID0gdGhpcy5pbnB1dENvbmZpZygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5xdWVyeUJ1aWxkZXJTZXJ2aWNlLmNvbmZpZztcbiAgfSk7XG4gIHByaXZhdGUgZWRpdFR5cGVGbiA9IGNvbXB1dGVkPChmaWVsZDogQmFzZUZpZWxkRGVmKSA9PiBzdHJpbmc+KCgpID0+IHtcbiAgICBpZiAodGhpcy5pc0NvbmRpdGlvbkhvc3QpIHtcbiAgICAgIHRoaXMucXVlcnlCdWlsZGVyU2VydmljZS5lZGl0VHlwZUZuID0gdGhpcy5pbnB1dEVkaXRUeXBlRm4oKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucXVlcnlCdWlsZGVyU2VydmljZS5lZGl0VHlwZUZuO1xuICB9KTtcblxuICBwdWJsaWMgcGFyZW50Rm9ybTogRm9ybUdyb3VwO1xuICBwdWJsaWMgZmllbGRDb25maWc6IEZpZWxkQ29uZmlnPEJhc2VGaWVsZERlZj47XG4gIHB1YmxpYyBzZWFyY2hlcyE6IFN1YnNjcmlwdGlvbjtcbiAgcHVibGljIHJlc3VsdHMkOiBQcm9taXNlPGFueVtdPjtcbiAgcHVibGljIHNlYXJjaFRlcm06IEZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG4gIHB1YmxpYyBmaWVsZERpc3BsYXlXaXRoO1xuICBwdWJsaWMgZGlzcGxheUljb246IHN0cmluZztcblxuICBwdWJsaWMgc3RhdGljRmllbGRTZWxlY3Rpb24gPSBjb21wdXRlZCgoKSA9PiB0aGlzLmNvbmZpZygpLnN0YXRpY0ZpZWxkU2VsZWN0aW9uKTtcbiAgcHJpdmF0ZSBfbGFzdENvbnRleHQ6IGFueSA9IHt9O1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmNvbmRpdGlvbi1ob3N0JylcbiAgcHVibGljIGlzQ29uZGl0aW9uSG9zdCA9IGZhbHNlO1xuXG4gIHB1YmxpYyBncmlkQ29sdW1ucyA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICBpZiAodGhpcy5zdGF0aWNGaWVsZFNlbGVjdGlvbigpKSB7XG4gICAgICByZXR1cm4gJzEzcmVtIDFmcic7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGZpcnN0Q29sdW1uV2lkdGggPSB0aGlzLmhpZGVPcGVyYXRvcigpID8gJzIwcmVtJyA6ICcxNnJlbSc7XG4gICAgICByZXR1cm4gYCR7Zmlyc3RDb2x1bW5XaWR0aH0gMTNyZW0gMWZyYDtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKiBTdWJqZWN0IHRoYXQgZW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfb25EZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgbGFiZWxzOiBOb3ZvTGFiZWxTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHF1ZXJ5QnVpbGRlclNlcnZpY2U6IFF1ZXJ5QnVpbGRlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb250cm9sQ29udGFpbmVyOiBDb250cm9sQ29udGFpbmVyLFxuICApIHtcbiAgICBpZiAoIXF1ZXJ5QnVpbGRlclNlcnZpY2UuY29tcG9uZW50SG9zdCkge1xuICAgICAgcXVlcnlCdWlsZGVyU2VydmljZS5jb21wb25lbnRIb3N0ID0gdGhpcztcbiAgICAgIHRoaXMuaXNDb25kaXRpb25Ib3N0ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZ3JvdXBJbmRleCA9IDA7XG4gICAgICB0aGlzLmFuZEluZGV4ID0gMDtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnBhcmVudEZvcm0gPSB0aGlzLmNvbnRyb2xDb250YWluZXIuY29udHJvbCBhcyBGb3JtR3JvdXA7XG4gICAgdGhpcy5wYXJlbnRGb3JtLmNvbnRyb2xzLmZpZWxkLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMudXBkYXRlRmllbGRTZWxlY3Rpb24oKSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuaW5wdXRDb25maWc/LnByZXZpb3VzVmFsdWU/LnN0YXRpY0ZpZWxkU2VsZWN0aW9uICYmXG4gICAgICBjaGFuZ2VzLmlucHV0Q29uZmlnLnByZXZpb3VzVmFsdWUuc3RhdGljRmllbGRTZWxlY3Rpb24gIT09IGNoYW5nZXMuaW5wdXRDb25maWcuY3VycmVudFZhbHVlLnN0YXRpY0ZpZWxkU2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMucGFyZW50Rm9ybS5jb250cm9scy5maWVsZC5zZXRWYWx1ZShjaGFuZ2VzLmlucHV0Q29uZmlnLmN1cnJlbnRWYWx1ZS5zdGF0aWNGaWVsZFNlbGVjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGNvbnN0IGFsbEZpZWxkcyA9IHRoaXMuY29uZmlnKCk/LmZpZWxkcyB8fCBbXTtcbiAgICBjb25zdCBzY29wZWRGaWVsZHMgPSB0aGlzLnNjb3BlID8gYWxsRmllbGRzLmZpbmQoKGZpZWxkKSA9PiBmaWVsZC52YWx1ZSA9PT0gdGhpcy5zY29wZSkgOiBhbGxGaWVsZHNbMF07XG4gICAgYWxsRmllbGRzLmxlbmd0aCAmJiB0aGlzLmNoYW5nZUZpZWxkT3B0aW9ucyhzY29wZWRGaWVsZHMpO1xuICAgIHRoaXMuc2VhcmNoZXMgPSB0aGlzLnNlYXJjaFRlcm0udmFsdWVDaGFuZ2VzLnBpcGUoZGVib3VuY2VUaW1lKDMwMCksIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpLnN1YnNjcmliZSgodGVybSkgPT4ge1xuICAgICAgdGhpcy5yZXN1bHRzJCA9IFByb21pc2UucmVzb2x2ZShcbiAgICAgICAgdGhpcy5maWVsZENvbmZpZy5vcHRpb25zLmZpbHRlcihcbiAgICAgICAgICAoZikgPT4gZi5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGVybS50b0xvd2VyQ2FzZSgpKSB8fCBmLmxhYmVsPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRlcm0udG9Mb3dlckNhc2UoKSksXG4gICAgICAgICksXG4gICAgICApO1xuICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50Rm9ybS52YWx1ZT8uZmllbGQgIT09IG51bGwpIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy51cGRhdGVGaWVsZFNlbGVjdGlvbigpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnNlYXJjaGVzLnVuc3Vic2NyaWJlKCk7XG4gICAgLy8gQ2xlYXIgYWxsIG91dGxldHMgYW5kIE1hcHNcbiAgICBbdGhpcy5fb3BlcmF0b3JPdXRsZXQudmlld0NvbnRhaW5lciwgdGhpcy5faW5wdXRPdXRsZXQudmlld0NvbnRhaW5lcl0uZm9yRWFjaCgoZGVmKSA9PiB7XG4gICAgICBkZWYuY2xlYXIoKTtcbiAgICB9KTtcbiAgICB0aGlzLl9vbkRlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX29uRGVzdHJveS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIENvbmRpdGlvbnMgXCJGaWVsZFwiIE9wdGlvbnMgdG8gQ2hhbmdlIGJhc2Ugb24gbmV3IFNjb3BlXG4gICAqIEBwYXJhbSBmaWVsZENvbmZpZ1xuICAgKi9cbiAgY2hhbmdlRmllbGRPcHRpb25zKGZpZWxkQ29uZmlnOiBGaWVsZENvbmZpZzxCYXNlRmllbGREZWY+KSB7XG4gICAgdGhpcy5maWVsZENvbmZpZyA9IGZpZWxkQ29uZmlnO1xuICAgIHRoaXMuc2VhcmNoVGVybS5zZXRWYWx1ZSgnJyk7XG4gICAgdGhpcy5yZXN1bHRzJCA9IFByb21pc2UucmVzb2x2ZSh0aGlzLmZpZWxkQ29uZmlnLm9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgaW5wdXQgYW5kIG9wZXJhdG9yIHZpZXcgY29udGFpbmVycywgcmVnZW5lcmF0ZXMgdGhlIGZpZWxkIHRlbXBsYXRlcyxcbiAgICogYW5kIG1hcmtzIHRoZSBjb21wb25lbnQgZm9yIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAqXG4gICAqIFVzZSB0aGlzIG1ldGhvZCBhZnRlciB1cGRhdGluZyBmb3JtIGNvbnRyb2xzIHRvIHJlaW5pdGlhbGl6ZSB0aGUgaW5wdXQgYW5kXG4gICAqIG9wZXJhdG9yIGZpZWxkcyBzbyB0aGF0IHRoZSB2aWV3IHJlZmxlY3RzIHRoZSBsYXRlc3QgZm9ybSBjb250cm9sIGNoYW5nZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIHZvaWRcbiAgICovXG4gIHJlc2V0SW5wdXRBbmRPcGVyYXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLl9pbnB1dE91dGxldC52aWV3Q29udGFpbmVyLmNsZWFyKCk7XG4gICAgdGhpcy5fb3BlcmF0b3JPdXRsZXQudmlld0NvbnRhaW5lci5jbGVhcigpO1xuICAgIHRoaXMuY3JlYXRlRmllbGRUZW1wbGF0ZXMoKTtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldEZpZWxkKCkge1xuICAgIGNvbnN0IGZpZWxkID0gdGhpcy5wYXJlbnRGb3JtPy52YWx1ZT8uZmllbGQ7XG4gICAgaWYgKCFmaWVsZCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRoaXMuZmllbGRDb25maWcuZmluZChmaWVsZCk7XG4gIH1cblxuICBnZXREZWZhdWx0RmllbGQoKSB7XG4gICAgY29uc3QgZmllbGRzID0gdGhpcy5maWVsZENvbmZpZy5vcHRpb25zO1xuICAgIGlmIChmaWVsZHM/Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZpZWxkc1swXS5uYW1lO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZUZpZWxkU2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IGZpZWxkQ29uZiA9IHRoaXMuZ2V0RmllbGQoKTtcbiAgICBpZiAoIWZpZWxkQ29uZikge1xuICAgICAgdGhpcy5wYXJlbnRGb3JtLmdldCgnZmllbGQnKS5zZXRWYWx1ZSh0aGlzLmdldERlZmF1bHRGaWVsZCgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maWVsZERpc3BsYXlXaXRoID0gKCkgPT4gZmllbGRDb25mLmxhYmVsIHx8IGZpZWxkQ29uZi5uYW1lO1xuICAgICAgdGhpcy5kaXNwbGF5SWNvbiA9IGZpZWxkQ29uZi5pY29uIHx8IG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHsgZmllbGQgfSA9IHRoaXMucGFyZW50Rm9ybS52YWx1ZTtcblxuICAgIGlmICh0aGlzLl9sYXN0Q29udGV4dC5maWVsZCAhPT0gZmllbGQpIHtcbiAgICAgIGlmICh0aGlzLl9sYXN0Q29udGV4dC5maWVsZCkge1xuICAgICAgICAvLyBvbmx5IGNsZWFyaW5nIG9wZXJhdG9yL3ZhbHVlIGlmIGZpZWxkIHdhcyBwcmV2aW91c2x5IGRlZmluZWQgc28gd2UgY2FuIHByZWxvYWQgdmFsdWVzIG9udG8gdGhlIGZvcm1cbiAgICAgICAgdGhpcy5wYXJlbnRGb3JtLmdldCgndmFsdWUnKS5zZXRWYWx1ZShudWxsKTtcbiAgICAgICAgdGhpcy5wYXJlbnRGb3JtLmdldCgnb3BlcmF0b3InKS5zZXRWYWx1ZShudWxsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY3JlYXRlRmllbGRUZW1wbGF0ZXMoKTtcbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZUNvbmRpdGlvblR5cGUoKSk7XG5cbiAgICB0aGlzLl9sYXN0Q29udGV4dCA9IHsgLi4udGhpcy5wYXJlbnRGb3JtLnZhbHVlIH07XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICB1cGRhdGVDb25kaXRpb25UeXBlKCkge1xuICAgIHRoaXMucGFyZW50Rm9ybS5nZXQoJ2NvbmRpdGlvblR5cGUnKT8uc2V0VmFsdWUodGhpcy5jb25kaXRpb25UeXBlKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBmaW5kRGVmaW5pdGlvbkZvckZpZWxkKGZpZWxkKSB7XG4gICAgaWYgKCFmaWVsZCkgcmV0dXJuO1xuICAgIGNvbnN0IGVkaXRUeXBlID0gdGhpcy5lZGl0VHlwZUZuKCkoZmllbGQpO1xuICAgIC8vIERvbid0IGxvb2sgYXQgZGF0YVNwZWNpYWxpemF0aW9uIGl0IGlzIG5vIGdvb2QsIHRoaXMgbWlzc2VzIGN1cnJlbmN5LCBhbmQgcGVyY2VudFxuICAgIGNvbnN0IHsgbmFtZSB9ID0gZmllbGQ7XG4gICAgY29uc3QgZmllbGREZWZzQnlOYW1lID0gdGhpcy5xdWVyeUJ1aWxkZXJTZXJ2aWNlLmdldEZpZWxkRGVmc0J5TmFtZSgpO1xuICAgIC8vIENoZWNrIEZpZWxkcyBieSBwcmlvcml0eSBmb3IgbWF0Y2ggRmllbGQgRGVmaW5pdGlvblxuICAgIGNvbnN0IGtleSA9IFtuYW1lLCBlZGl0VHlwZT8udG9VcHBlckNhc2UoKSwgJ0RFRkFVTFQnXS5maW5kKChpdCkgPT4gZmllbGREZWZzQnlOYW1lLmhhcyhpdCkpO1xuICAgIHJldHVybiBmaWVsZERlZnNCeU5hbWUuZ2V0KGtleSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZpZWxkVGVtcGxhdGVzKCkge1xuICAgIGNvbnN0IGRlZmluaXRpb24gPSB0aGlzLmZpbmREZWZpbml0aW9uRm9yRmllbGQodGhpcy5nZXRGaWVsZCgpKTtcblxuICAgIGlmICghdGhpcy5wYXJlbnRGb3JtLmdldCgnb3BlcmF0b3InKS52YWx1ZSkge1xuICAgICAgdGhpcy5wYXJlbnRGb3JtLmdldCgnb3BlcmF0b3InKS5zZXRWYWx1ZShkZWZpbml0aW9uLmRlZmF1bHRPcGVyYXRvcik7XG4gICAgfVxuXG4gICAgdGhpcy5jcmVhdGVGaWVsZE9wZXJhdG9ycyhkZWZpbml0aW9uKTtcbiAgICB0aGlzLmNyZWF0ZUZpZWxkSW5wdXQoZGVmaW5pdGlvbik7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZpZWxkT3BlcmF0b3JzKGRlZmluaXRpb246IEJhc2VDb25kaXRpb25GaWVsZERlZikge1xuICAgIHRoaXMuX29wZXJhdG9yT3V0bGV0LnZpZXdDb250YWluZXIuY2xlYXIoKTtcbiAgICBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgY29uc3QgY29udGV4dCA9IHsgJGltcGxpY2l0OiB0aGlzLnBhcmVudEZvcm0sIGZpZWxkTWV0YTogdGhpcy5nZXRGaWVsZCgpIH07XG4gICAgICB0aGlzLl9vcGVyYXRvck91dGxldC52aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyhkZWZpbml0aW9uLmZpZWxkT3BlcmF0b3JzLnRlbXBsYXRlLCBjb250ZXh0KTtcbiAgICB9XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUZpZWxkSW5wdXQoZGVmaW5pdGlvbjogQmFzZUNvbmRpdGlvbkZpZWxkRGVmKSB7XG4gICAgdGhpcy5faW5wdXRPdXRsZXQudmlld0NvbnRhaW5lci5jbGVhcigpO1xuICAgIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0geyAkaW1wbGljaXQ6IHRoaXMucGFyZW50Rm9ybSwgZmllbGRNZXRhOiB0aGlzLmdldEZpZWxkKCksIHZpZXdJbmRleDogdGhpcy5ncm91cEluZGV4LnRvU3RyaW5nKCkgKyB0aGlzLmFuZEluZGV4LnRvU3RyaW5nKCkgfTtcbiAgICAgIHRoaXMuX2lucHV0T3V0bGV0LnZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KGRlZmluaXRpb24uZmllbGRJbnB1dC50ZW1wbGF0ZSwgY29udGV4dCk7XG4gICAgfVxuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iLCI8Zm9ybSBbZm9ybUdyb3VwXT1cInBhcmVudEZvcm1cIj5cbiAgPG5vdm8tZ3JpZCBnYXA9XCIxcmVtXCIgW2NvbHVtbnNdPVwiZ3JpZENvbHVtbnMoKVwiIGFsaWduPVwiZW5kXCI+XG4gICAgPG5vdm8tZmllbGQgY2xhc3M9XCJjb25kaXRpb24tZmllbGRcIiAqbmdJZj1cIiFzdGF0aWNGaWVsZFNlbGVjdGlvbigpXCI+XG4gICAgICA8bm92by1zZWxlY3RcbiAgICAgICAgW3BsYWNlaG9sZGVyXT1cImxhYmVscy5jaG9vc2VBRmllbGRcIlxuICAgICAgICBmb3JtQ29udHJvbE5hbWU9XCJmaWVsZFwiXG4gICAgICAgIChvblNlbGVjdCk9XCJ1cGRhdGVGaWVsZFNlbGVjdGlvbigpXCJcbiAgICAgICAgb3ZlcmxheVdpZHRoPVwiMjRyZW1cIlxuICAgICAgICBvdmVybGF5SGVpZ2h0PVwiMjByZW1cIlxuICAgICAgICBbZGlzcGxheVdpdGhdPVwiZmllbGREaXNwbGF5V2l0aFwiXG4gICAgICAgIFtzdHlsZS5taW5XaWR0aC5weF09XCIxNjBcIlxuICAgICAgICBbc3R5bGUubWF4V2lkdGgucHhdPVwiKGhpZGVPcGVyYXRvcigpIHx8IGlzQ29uZGl0aW9uSG9zdCkgPyAyMDAgOiAxNjBcIlxuICAgICAgICBbZGlzcGxheUljb25dPVwiZGlzcGxheUljb25cIj5cbiAgICAgICAgPG5vdm8tb3B0Z3JvdXAgY2xhc3M9XCJmaWx0ZXItc2VhcmNoLXJlc3VsdHNcIj5cbiAgICAgICAgICA8bm92by1vcHRpb24+XG4gICAgICAgICAgICA8bm92by1zZWxlY3Qtc2VhcmNoIFtmb3JtQ29udHJvbF09XCJzZWFyY2hUZXJtXCIgW2NsZWFyU2VhcmNoSW5wdXRdPVwiZmFsc2VcIj48L25vdm8tc2VsZWN0LXNlYXJjaD5cbiAgICAgICAgICA8L25vdm8tb3B0aW9uPlxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJyZXN1bHRzJCB8IGFzeW5jIGFzIHJlc3VsdHM7IGVsc2UgbG9hZGluZ1wiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInJlc3VsdHMubGVuZ3RoXCI+XG4gICAgICAgICAgICAgIDxub3ZvLW9wdGlvbiAqbmdGb3I9XCJsZXQgZmllbGQgb2YgcmVzdWx0c1wiIHZhbHVlPVwie3sgZmllbGQubmFtZSB9fVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cImZpZWxkLm5hbWVcIj5cbiAgICAgICAgICAgICAgICB7eyBmaWVsZC5sYWJlbCB8fCBmaWVsZC5uYW1lIH19XG4gICAgICAgICAgICAgIDwvbm92by1vcHRpb24+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9ub3ZvLW9wdGdyb3VwPlxuICAgICAgPC9ub3ZvLXNlbGVjdD5cbiAgICA8L25vdm8tZmllbGQ+XG5cbiAgICA8ZGl2IGNsYXNzPVwiY29uZGl0aW9uLW9wZXJhdG9yXCI+XG4gICAgICA8bmctY29udGFpbmVyIGNvbmRpdGlvbk9wZXJhdG9yT3V0bGV0PjwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImNvbmRpdGlvbi1pbnB1dFwiPlxuICAgICAgPG5nLWNvbnRhaW5lciBjb25kaXRpb25JbnB1dE91dGxldD48L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbiAgPC9ub3ZvLWdyaWQ+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvZm9ybT5cblxuPG5vdm8tY29uZGl0aW9uLXRlbXBsYXRlcyAqbmdJZj1cImlzQ29uZGl0aW9uSG9zdFwiIFthZGRyZXNzQ29uZmlnXT1cImFkZHJlc3NDb25maWdcIi8+XG5cbjwhLS0gTE9BRElORyBURU1QTEFURSAtLT5cbjxuZy10ZW1wbGF0ZSAjbG9hZGluZz5cbiAgPG5vdm8tbG9hZGluZz48L25vdm8tbG9hZGluZz5cbjwvbmctdGVtcGxhdGU+XG4iXX0=