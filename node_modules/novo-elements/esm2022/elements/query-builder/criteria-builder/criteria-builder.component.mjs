import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ContentChildren, forwardRef, Input, QueryList, viewChild, viewChildren, } from '@angular/core';
import { ControlContainer, FormBuilder, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { interval, Subject } from 'rxjs';
import { debounce, filter, startWith, takeUntil } from 'rxjs/operators';
import { NovoTabbedGroupPickerElement } from 'novo-elements/elements/tabbed-group-picker';
import { NovoLabelService } from 'novo-elements/services';
import { Helpers } from 'novo-elements/utils';
import { ConditionGroupComponent } from '../condition-group/condition-group.component';
import { NovoConditionFieldDef } from '../query-builder.directives';
import { QueryBuilderService } from '../query-builder.service';
import { NOVO_CRITERIA_BUILDER } from '../query-builder.tokens';
import { Conjunction } from '../query-builder.types';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../query-builder.service";
import * as i3 from "novo-elements/services";
import * as i4 from "@angular/common";
import * as i5 from "novo-elements/elements/common";
import * as i6 from "novo-elements/elements/flex";
import * as i7 from "novo-elements/elements/tabbed-group-picker";
import * as i8 from "../condition-group/condition-group.component";
import * as i9 from "../condition-templates/condition-templates.component";
const EMPTY_CONDITION = {
    conditionType: '$and',
    field: null,
    operator: null,
    scope: null,
    value: null,
};
export class CriteriaBuilderComponent {
    set HideFirstOperator(hide) {
        if (!Helpers.isEmpty(hide)) {
            this._hideFirstOperator = hide;
        }
    }
    get hideFirstOperator() {
        return this._hideFirstOperator;
    }
    constructor(controlContainer, formBuilder, cdr, qbs, labels) {
        this.controlContainer = controlContainer;
        this.formBuilder = formBuilder;
        this.cdr = cdr;
        this.qbs = qbs;
        this.labels = labels;
        this.allowedGroupings = [Conjunction.AND, Conjunction.OR, Conjunction.NOT];
        this.canBeEmpty = false;
        this._hideFirstOperator = true;
        this.scopedFieldPicker = viewChild(NovoTabbedGroupPickerElement);
        this.conditionGroups = viewChildren(ConditionGroupComponent);
        this.tabbedGroupPickerTabs = computed(() => {
            const tabs = [];
            this.qbs.scopes()?.forEach((scope) => {
                tabs.push({
                    typeName: scope,
                    typeLabel: scope,
                    valueField: 'name',
                    labelField: 'label',
                    data: this.qbs.config.fields.find((field) => field.value === scope)?.options || [],
                });
            });
            return tabs;
        });
        this.addButtonConfig = {
            theme: 'dialogue',
            side: 'left',
            size: 'sm',
            icon: 'add-thin',
            label: this.labels.addCondition,
        };
        /** Subject that emits when the component has been destroyed. */
        this._onDestroy = new Subject();
        if (!qbs.componentHost) {
            qbs.componentHost = this;
        }
    }
    ngOnInit() {
        this.parentForm = this.controlContainer.control;
        this.innerForm = this.formBuilder.group({
            criteria: this.formBuilder.array([]),
        });
        this.parentForm.valueChanges.pipe(startWith(this.parentForm.value), filter(v => v?.criteria), takeUntil(this._onDestroy)).subscribe((value) => {
            Promise.resolve().then(() => {
                this.setInitialValue(value[this.controlName]);
                this.cdr.markForCheck();
            });
        });
        this.innerForm.valueChanges
            .pipe(debounce(() => interval(10)), takeUntil(this._onDestroy))
            .subscribe((value) => {
            const result = value.criteria.filter((it, i) => {
                const key = Object.keys(it)[0];
                if (it[key].length === 0) {
                    this.removeConditionGroupAt(i);
                }
                return it[key].length > 0;
            });
            Promise.resolve().then(() => {
                this.parentForm.get(this.controlName).setValue(result, { emitEvent: false });
                this.cdr.markForCheck();
            });
        });
    }
    ngAfterContentChecked() {
        this._configureQueryBuilderService();
        this.cdr.detectChanges();
    }
    ngAfterViewInit() {
        this._registerFieldDefs();
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    isConditionGroup(group) {
        return Object.keys(group).every((key) => ['$and', '$or', '$not'].includes(key));
    }
    setInitialValue(value) {
        if (value.length) {
            if (this.isConditionGroup(value[0])) {
                value.forEach((it) => this.addConditionGroup(it));
            }
            else {
                const conditions = [...value];
                if (this.qbs.hasMultipleScopes()) {
                    // divide up by scope into separate groups
                    const scopedConditions = {};
                    conditions.forEach((condition) => {
                        scopedConditions[condition.scope] = scopedConditions[condition.scope] || [];
                        scopedConditions[condition.scope].push(condition);
                    });
                    for (const scope in scopedConditions) {
                        this.addConditionGroup({ $and: scopedConditions[scope] });
                    }
                }
                else {
                    this.addConditionGroup({ $and: conditions });
                }
            }
        }
        else {
            this.addConditionGroup({ $and: value });
        }
    }
    get root() {
        return this.innerForm.get('criteria');
    }
    addConditionGroup(data = { $and: [EMPTY_CONDITION] }) {
        this.root.push(this.newConditionGroup(data));
        this.cdr.markForCheck();
    }
    newConditionGroup(data) {
        const controls = Object.entries(data).reduce((obj, [key, val]) => {
            return {
                ...obj,
                [key]: this.formBuilder.array(val.map((it) => this.newCondition(it))),
            };
        }, {});
        return this.formBuilder.group(controls);
    }
    newCondition({ field, operator, scope, value } = EMPTY_CONDITION) {
        return this.formBuilder.group({
            conditionType: '$and',
            field: [field, Validators.required],
            operator: [operator, Validators.required],
            scope: [scope],
            value: [value],
        });
    }
    removeConditionGroupAt(index) {
        this.root.removeAt(index, { emitEvent: false });
    }
    clearAllConditions() {
        while (this.root.length) {
            this.root.removeAt(0);
        }
    }
    onFieldSelect(field) {
        this.scopedFieldPicker().dropdown.closePanel();
        const condition = { field: field.name, operator: null, scope: field.scope, value: null };
        const group = this.conditionGroups().find((group) => group.scope === field.scope);
        if (group) {
            group.addCondition(condition);
        }
        else {
            this.addConditionGroup({ $and: [condition] });
        }
    }
    _configureQueryBuilderService() {
        this.qbs.scopes.set(this.config?.fields.map((f) => f.value));
        this.qbs.config = this.config;
        this.qbs.editTypeFn = this.editTypeFn;
        this.qbs.allowedGroupings = this.allowedGroupings;
    }
    _registerFieldDefs() {
        const defs = [...Array.from(this._contentFieldDefs)];
        defs.forEach((fieldDef) => {
            this.qbs.registerFieldDef(fieldDef);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CriteriaBuilderComponent, deps: [{ token: i1.ControlContainer }, { token: i1.FormBuilder }, { token: i0.ChangeDetectorRef }, { token: i2.QueryBuilderService }, { token: i3.NovoLabelService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.2.0", version: "17.3.12", type: CriteriaBuilderComponent, selector: "novo-criteria-builder", inputs: { config: "config", controlName: "controlName", allowedGroupings: "allowedGroupings", editTypeFn: "editTypeFn", addressConfig: "addressConfig", canBeEmpty: "canBeEmpty", HideFirstOperator: ["hideFirstOperator", "HideFirstOperator"] }, host: { classAttribute: "novo-criteria-builder" }, providers: [
            { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CriteriaBuilderComponent), multi: true },
            { provide: NOVO_CRITERIA_BUILDER, useExisting: CriteriaBuilderComponent },
            { provide: QueryBuilderService, useClass: QueryBuilderService },
        ], queries: [{ propertyName: "_contentFieldDefs", predicate: NovoConditionFieldDef, descendants: true }], viewQueries: [{ propertyName: "scopedFieldPicker", first: true, predicate: NovoTabbedGroupPickerElement, descendants: true, isSignal: true }, { propertyName: "conditionGroups", predicate: ConditionGroupComponent, descendants: true, isSignal: true }], ngImport: i0, template: "<form [formGroup]=\"innerForm\">\n  <novo-stack [formArrayName]=\"controlName\" class=\"criteria-builder-inner\">\n    <ng-container\n      *ngFor=\"let andGroup of root.controls; let andIndex = index; let isFirst = first;let isLastAnd = last;\">\n      <novo-label *ngIf=\"!isFirst\" color=\"ash\" size=\"xs\" uppercase padding=\"sm\">{{ qbs.hasMultipleScopes() ? conditionGroup.scope + ' ' + labels.filterss : qbs.getConjunctionLabel('and') }}</novo-label>\n      <novo-condition-group [hideFirstOperator]=\"hideFirstOperator\" [canBeEmpty]=\"canBeEmpty\" [groupIndex]=\"andIndex\" [formGroupName]=\"andIndex\" #conditionGroup></novo-condition-group>\n    </ng-container>\n  </novo-stack>\n  <novo-tabbed-group-picker\n    *ngIf=\"qbs.hasMultipleScopes()\"\n    [tabs]=\"tabbedGroupPickerTabs()\"\n    [selectionEnabled]=\"false\"\n    [buttonConfig]=\"addButtonConfig\"\n    (activation)=\"onFieldSelect($event)\">\n  </novo-tabbed-group-picker>\n</form>\n<novo-condition-templates [addressConfig]=\"addressConfig\"/>\n\n<!--\n  {\n    $and: [{\n      $or: [{\n        entity: 'JobOrder'\n        field: 'categories',\n        operator: 'doesNotContain',\n        value: 'Healthcare'\n      }]\n    }]\n  }\n -->\n", styles: [":host{position:relative;display:block;width:76rem}:host .criteria-builder-inner{padding-bottom:1rem}\n"], dependencies: [{ kind: "directive", type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormGroupName, selector: "[formGroupName]", inputs: ["formGroupName"] }, { kind: "directive", type: i1.FormArrayName, selector: "[formArrayName]", inputs: ["formArrayName"] }, { kind: "component", type: i5.NovoLabel, selector: "novo-label,[novo-label]" }, { kind: "directive", type: i5.PaddingDirective, selector: "[p],[padding],[paddingTop],[paddingRight],[paddingBottom],[paddingLeft],[paddingX],[paddingY],[pt],[pr],[pb],[pl],[px],[py]", inputs: ["padding", "p", "paddingLeft", "pl", "paddingRight", "pr", "paddingTop", "pt", "paddingBottom", "pb", "paddingX", "px", "paddingY", "py"] }, { kind: "component", type: i6.NovoStackElement, selector: "novo-stack,novo-column", inputs: ["direction", "align"] }, { kind: "component", type: i7.NovoTabbedGroupPickerElement, selector: "novo-tabbed-group-picker", inputs: ["buttonConfig", "tabs", "quickSelectConfig", "showFooter", "selectionEnabled"], outputs: ["activation", "selectionChange", "applyChange", "cancelChange"] }, { kind: "component", type: i8.ConditionGroupComponent, selector: "novo-condition-group", inputs: ["controlName", "groupIndex", "hideFirstOperator", "canBeEmpty", "formGroupName"] }, { kind: "component", type: i9.NovoConditionTemplatesComponent, selector: "novo-condition-templates", inputs: ["addressConfig"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CriteriaBuilderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'novo-criteria-builder', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CriteriaBuilderComponent), multi: true },
                        { provide: NOVO_CRITERIA_BUILDER, useExisting: CriteriaBuilderComponent },
                        { provide: QueryBuilderService, useClass: QueryBuilderService },
                    ], host: {
                        class: 'novo-criteria-builder',
                    }, template: "<form [formGroup]=\"innerForm\">\n  <novo-stack [formArrayName]=\"controlName\" class=\"criteria-builder-inner\">\n    <ng-container\n      *ngFor=\"let andGroup of root.controls; let andIndex = index; let isFirst = first;let isLastAnd = last;\">\n      <novo-label *ngIf=\"!isFirst\" color=\"ash\" size=\"xs\" uppercase padding=\"sm\">{{ qbs.hasMultipleScopes() ? conditionGroup.scope + ' ' + labels.filterss : qbs.getConjunctionLabel('and') }}</novo-label>\n      <novo-condition-group [hideFirstOperator]=\"hideFirstOperator\" [canBeEmpty]=\"canBeEmpty\" [groupIndex]=\"andIndex\" [formGroupName]=\"andIndex\" #conditionGroup></novo-condition-group>\n    </ng-container>\n  </novo-stack>\n  <novo-tabbed-group-picker\n    *ngIf=\"qbs.hasMultipleScopes()\"\n    [tabs]=\"tabbedGroupPickerTabs()\"\n    [selectionEnabled]=\"false\"\n    [buttonConfig]=\"addButtonConfig\"\n    (activation)=\"onFieldSelect($event)\">\n  </novo-tabbed-group-picker>\n</form>\n<novo-condition-templates [addressConfig]=\"addressConfig\"/>\n\n<!--\n  {\n    $and: [{\n      $or: [{\n        entity: 'JobOrder'\n        field: 'categories',\n        operator: 'doesNotContain',\n        value: 'Healthcare'\n      }]\n    }]\n  }\n -->\n", styles: [":host{position:relative;display:block;width:76rem}:host .criteria-builder-inner{padding-bottom:1rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.ControlContainer }, { type: i1.FormBuilder }, { type: i0.ChangeDetectorRef }, { type: i2.QueryBuilderService }, { type: i3.NovoLabelService }], propDecorators: { config: [{
                type: Input
            }], controlName: [{
                type: Input
            }], allowedGroupings: [{
                type: Input
            }], editTypeFn: [{
                type: Input
            }], addressConfig: [{
                type: Input
            }], canBeEmpty: [{
                type: Input
            }], HideFirstOperator: [{
                type: Input,
                args: ['hideFirstOperator']
            }], _contentFieldDefs: [{
                type: ContentChildren,
                args: [NovoConditionFieldDef, { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JpdGVyaWEtYnVpbGRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9xdWVyeS1idWlsZGVyL2NyaXRlcmlhLWJ1aWxkZXIvY3JpdGVyaWEtYnVpbGRlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9xdWVyeS1idWlsZGVyL2NyaXRlcmlhLWJ1aWxkZXIvY3JpdGVyaWEtYnVpbGRlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsUUFBUSxFQUNSLGVBQWUsRUFDZixVQUFVLEVBQ1YsS0FBSyxFQUdMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxnQkFBZ0IsRUFBYSxXQUFXLEVBQUUsaUJBQWlCLEVBQW9CLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNILE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RSxPQUFPLEVBQUUsNEJBQTRCLEVBQXVELE1BQU0sNENBQTRDLENBQUM7QUFDL0ksT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZCQUE2QixDQUFD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QUMsTUFBTSxhQUNwQzt3QkFDVCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7d0JBQ3BHLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFdBQVcsMEJBQTBCLEVBQUU7d0JBQ3pFLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRTtxQkFDaEUsUUFDSzt3QkFDSixLQUFLLEVBQUUsdUJBQXVCO3FCQUMvQjtnTkFHUSxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ0csVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBR0YsaUJBQWlCO3NCQURwQixLQUFLO3VCQUFDLG1CQUFtQjtnQkFXcUMsaUJBQWlCO3NCQUEvRSxlQUFlO3VCQUFDLHFCQUFxQixFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBjb21wdXRlZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBmb3J3YXJkUmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFF1ZXJ5TGlzdCxcbiAgdmlld0NoaWxkLFxuICB2aWV3Q2hpbGRyZW4sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbENvbnRhaW5lciwgRm9ybUFycmF5LCBGb3JtQnVpbGRlciwgTkdfVkFMVUVfQUNDRVNTT1IsIFVudHlwZWRGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBpbnRlcnZhbCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2UsIGZpbHRlciwgc3RhcnRXaXRoLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOb3ZvVGFiYmVkR3JvdXBQaWNrZXJFbGVtZW50LCBUYWJiZWRHcm91cFBpY2tlckJ1dHRvbkNvbmZpZywgVGFiYmVkR3JvdXBQaWNrZXJUYWIgfSBmcm9tICdub3ZvLWVsZW1lbnRzL2VsZW1lbnRzL3RhYmJlZC1ncm91cC1waWNrZXInO1xuaW1wb3J0IHsgTm92b0xhYmVsU2VydmljZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvc2VydmljZXMnO1xuaW1wb3J0IHsgSGVscGVycyB9IGZyb20gJ25vdm8tZWxlbWVudHMvdXRpbHMnO1xuaW1wb3J0IHsgQ29uZGl0aW9uR3JvdXBDb21wb25lbnQgfSBmcm9tICcuLi9jb25kaXRpb24tZ3JvdXAvY29uZGl0aW9uLWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOb3ZvQ29uZGl0aW9uRmllbGREZWYgfSBmcm9tICcuLi9xdWVyeS1idWlsZGVyLmRpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgUXVlcnlCdWlsZGVyU2VydmljZSB9IGZyb20gJy4uL3F1ZXJ5LWJ1aWxkZXIuc2VydmljZSc7XG5pbXBvcnQgeyBOT1ZPX0NSSVRFUklBX0JVSUxERVIgfSBmcm9tICcuLi9xdWVyeS1idWlsZGVyLnRva2Vucyc7XG5pbXBvcnQgeyBCYXNlRmllbGREZWYsIENvbmRpdGlvbiwgQ29uZGl0aW9uR3JvdXAsIENvbmp1bmN0aW9uLCBBZGRyZXNzQ3JpdGVyaWFDb25maWcgfSBmcm9tICcuLi9xdWVyeS1idWlsZGVyLnR5cGVzJztcblxuY29uc3QgRU1QVFlfQ09ORElUSU9OOiBDb25kaXRpb24gPSB7XG4gIGNvbmRpdGlvblR5cGU6ICckYW5kJyxcbiAgZmllbGQ6IG51bGwsXG4gIG9wZXJhdG9yOiBudWxsLFxuICBzY29wZTogbnVsbCxcbiAgdmFsdWU6IG51bGwsXG59O1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1jcml0ZXJpYS1idWlsZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NyaXRlcmlhLWJ1aWxkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jcml0ZXJpYS1idWlsZGVyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBDcml0ZXJpYUJ1aWxkZXJDb21wb25lbnQpLCBtdWx0aTogdHJ1ZSB9LFxuICAgIHsgcHJvdmlkZTogTk9WT19DUklURVJJQV9CVUlMREVSLCB1c2VFeGlzdGluZzogQ3JpdGVyaWFCdWlsZGVyQ29tcG9uZW50IH0sXG4gICAgeyBwcm92aWRlOiBRdWVyeUJ1aWxkZXJTZXJ2aWNlLCB1c2VDbGFzczogUXVlcnlCdWlsZGVyU2VydmljZSB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdub3ZvLWNyaXRlcmlhLWJ1aWxkZXInLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDcml0ZXJpYUJ1aWxkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIGNvbmZpZzogYW55O1xuICBASW5wdXQoKSBjb250cm9sTmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBhbGxvd2VkR3JvdXBpbmdzID0gW0Nvbmp1bmN0aW9uLkFORCwgQ29uanVuY3Rpb24uT1IsIENvbmp1bmN0aW9uLk5PVF07XG4gIEBJbnB1dCgpIGVkaXRUeXBlRm46IChmaWVsZDogQmFzZUZpZWxkRGVmKSA9PiBzdHJpbmc7XG4gIEBJbnB1dCgpIGFkZHJlc3NDb25maWc6IEFkZHJlc3NDcml0ZXJpYUNvbmZpZztcbiAgQElucHV0KCkgY2FuQmVFbXB0eTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgnaGlkZUZpcnN0T3BlcmF0b3InKVxuICBzZXQgSGlkZUZpcnN0T3BlcmF0b3IoaGlkZTogYm9vbGVhbikge1xuICAgICAgaWYgKCFIZWxwZXJzLmlzRW1wdHkoaGlkZSkpIHtcbiAgICAgICAgdGhpcy5faGlkZUZpcnN0T3BlcmF0b3IgPSBoaWRlO1xuICAgICAgfVxuICB9XG4gIGdldCBoaWRlRmlyc3RPcGVyYXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZUZpcnN0T3BlcmF0b3I7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZUZpcnN0T3BlcmF0b3I6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTm92b0NvbmRpdGlvbkZpZWxkRGVmLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pIF9jb250ZW50RmllbGREZWZzOiBRdWVyeUxpc3Q8Tm92b0NvbmRpdGlvbkZpZWxkRGVmPjtcbiAgc2NvcGVkRmllbGRQaWNrZXIgPSB2aWV3Q2hpbGQoTm92b1RhYmJlZEdyb3VwUGlja2VyRWxlbWVudCk7XG4gIGNvbmRpdGlvbkdyb3VwcyA9IHZpZXdDaGlsZHJlbihDb25kaXRpb25Hcm91cENvbXBvbmVudCk7XG5cbiAgcHVibGljIHBhcmVudEZvcm06IFVudHlwZWRGb3JtR3JvdXA7XG4gIHB1YmxpYyBpbm5lckZvcm06IFVudHlwZWRGb3JtR3JvdXA7XG4gIHB1YmxpYyB0YWJiZWRHcm91cFBpY2tlclRhYnMgPSBjb21wdXRlZDxUYWJiZWRHcm91cFBpY2tlclRhYltdPigoKSA9PiB7XG4gICAgY29uc3QgdGFicyA9IFtdO1xuICAgIHRoaXMucWJzLnNjb3BlcygpPy5mb3JFYWNoKChzY29wZSkgPT4ge1xuICAgICAgdGFicy5wdXNoKHtcbiAgICAgICAgdHlwZU5hbWU6IHNjb3BlLFxuICAgICAgICB0eXBlTGFiZWw6IHNjb3BlLFxuICAgICAgICB2YWx1ZUZpZWxkOiAnbmFtZScsXG4gICAgICAgIGxhYmVsRmllbGQ6ICdsYWJlbCcsXG4gICAgICAgIGRhdGE6IHRoaXMucWJzLmNvbmZpZy5maWVsZHMuZmluZCgoZmllbGQpID0+IGZpZWxkLnZhbHVlID09PSBzY29wZSk/Lm9wdGlvbnMgfHwgW10sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGFicztcbiAgfSk7XG4gIHB1YmxpYyBhZGRCdXR0b25Db25maWc6IFRhYmJlZEdyb3VwUGlja2VyQnV0dG9uQ29uZmlnID0ge1xuICAgIHRoZW1lOiAnZGlhbG9ndWUnLFxuICAgIHNpZGU6ICdsZWZ0JyxcbiAgICBzaXplOiAnc20nLFxuICAgIGljb246ICdhZGQtdGhpbicsXG4gICAgbGFiZWw6IHRoaXMubGFiZWxzLmFkZENvbmRpdGlvbixcbiAgfTtcbiAgLyoqIFN1YmplY3QgdGhhdCBlbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gZGVzdHJveWVkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9vbkRlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY29udHJvbENvbnRhaW5lcjogQ29udHJvbENvbnRhaW5lcixcbiAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHVibGljIHFiczogUXVlcnlCdWlsZGVyU2VydmljZSxcbiAgICBwdWJsaWMgbGFiZWxzOiBOb3ZvTGFiZWxTZXJ2aWNlLFxuICApIHtcbiAgICBpZiAoIXFicy5jb21wb25lbnRIb3N0KSB7XG4gICAgICBxYnMuY29tcG9uZW50SG9zdCA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5wYXJlbnRGb3JtID0gdGhpcy5jb250cm9sQ29udGFpbmVyLmNvbnRyb2wgYXMgVW50eXBlZEZvcm1Hcm91cDtcbiAgICB0aGlzLmlubmVyRm9ybSA9IHRoaXMuZm9ybUJ1aWxkZXIuZ3JvdXAoe1xuICAgICAgY3JpdGVyaWE6IHRoaXMuZm9ybUJ1aWxkZXIuYXJyYXkoW10pLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wYXJlbnRGb3JtLnZhbHVlQ2hhbmdlcy5waXBlKFxuICAgICAgc3RhcnRXaXRoKHRoaXMucGFyZW50Rm9ybS52YWx1ZSksXG4gICAgICBmaWx0ZXIodiA9PiB2Py5jcml0ZXJpYSksXG4gICAgICB0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KVxuICAgICkuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0SW5pdGlhbFZhbHVlKHZhbHVlW3RoaXMuY29udHJvbE5hbWVdKTtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmlubmVyRm9ybS52YWx1ZUNoYW5nZXNcbiAgICAgIC5waXBlKFxuICAgICAgICBkZWJvdW5jZSgoKSA9PiBpbnRlcnZhbCgxMCkpLFxuICAgICAgICB0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbHVlLmNyaXRlcmlhLmZpbHRlcigoaXQsIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBrZXkgPSBPYmplY3Qua2V5cyhpdClbMF07XG4gICAgICAgICAgaWYgKGl0W2tleV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNvbmRpdGlvbkdyb3VwQXQoaSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpdFtrZXldLmxlbmd0aCA+IDA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMucGFyZW50Rm9ybS5nZXQodGhpcy5jb250cm9sTmFtZSkuc2V0VmFsdWUocmVzdWx0LCB7IGVtaXRFdmVudDogZmFsc2UgfSk7XG4gICAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29uZmlndXJlUXVlcnlCdWlsZGVyU2VydmljZSgpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9yZWdpc3RlckZpZWxkRGVmcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fb25EZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9vbkRlc3Ryb3kuY29tcGxldGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNDb25kaXRpb25Hcm91cChncm91cDogdW5rbm93bik6IGdyb3VwIGlzIENvbmRpdGlvbkdyb3VwIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZ3JvdXApLmV2ZXJ5KChrZXkpID0+IFsnJGFuZCcsICckb3InLCAnJG5vdCddLmluY2x1ZGVzKGtleSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRJbml0aWFsVmFsdWUodmFsdWU6IENvbmRpdGlvbkdyb3VwW10gfCBDb25kaXRpb25bXSkge1xuICAgIGlmICh2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmlzQ29uZGl0aW9uR3JvdXAodmFsdWVbMF0pKSB7XG4gICAgICAgIHZhbHVlLmZvckVhY2goKGl0KSA9PiB0aGlzLmFkZENvbmRpdGlvbkdyb3VwKGl0KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBjb25kaXRpb25zOiBDb25kaXRpb25bXSA9IFsuLi52YWx1ZV0gYXMgQ29uZGl0aW9uW107XG4gICAgICAgIGlmICh0aGlzLnFicy5oYXNNdWx0aXBsZVNjb3BlcygpKSB7XG4gICAgICAgICAgLy8gZGl2aWRlIHVwIGJ5IHNjb3BlIGludG8gc2VwYXJhdGUgZ3JvdXBzXG4gICAgICAgICAgY29uc3Qgc2NvcGVkQ29uZGl0aW9uczogeyBba2V5OiBzdHJpbmddOiBDb25kaXRpb25bXSB9ID0ge307XG4gICAgICAgICAgY29uZGl0aW9ucy5mb3JFYWNoKChjb25kaXRpb24pID0+IHtcbiAgICAgICAgICAgIHNjb3BlZENvbmRpdGlvbnNbY29uZGl0aW9uLnNjb3BlXSA9IHNjb3BlZENvbmRpdGlvbnNbY29uZGl0aW9uLnNjb3BlXSB8fCBbXTtcbiAgICAgICAgICAgIHNjb3BlZENvbmRpdGlvbnNbY29uZGl0aW9uLnNjb3BlXS5wdXNoKGNvbmRpdGlvbik7XG4gICAgICAgICAgfSlcbiAgICAgICAgICBmb3IgKGNvbnN0IHNjb3BlIGluIHNjb3BlZENvbmRpdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ29uZGl0aW9uR3JvdXAoeyAkYW5kOiBzY29wZWRDb25kaXRpb25zW3Njb3BlXSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5hZGRDb25kaXRpb25Hcm91cCh7ICRhbmQ6IGNvbmRpdGlvbnMgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRDb25kaXRpb25Hcm91cCh7ICRhbmQ6IHZhbHVlIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCByb290KCk6IEZvcm1BcnJheSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJGb3JtLmdldCgnY3JpdGVyaWEnKSBhcyBGb3JtQXJyYXk7XG4gIH1cblxuICBhZGRDb25kaXRpb25Hcm91cChkYXRhOiBhbnkgPSB7ICRhbmQ6IFtFTVBUWV9DT05ESVRJT05dIH0pIHtcbiAgICB0aGlzLnJvb3QucHVzaCh0aGlzLm5ld0NvbmRpdGlvbkdyb3VwKGRhdGEpKTtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG5ld0NvbmRpdGlvbkdyb3VwKGRhdGE6IENvbmRpdGlvbkdyb3VwKTogVW50eXBlZEZvcm1Hcm91cCB7XG4gICAgY29uc3QgY29udHJvbHMgPSBPYmplY3QuZW50cmllcyhkYXRhKS5yZWR1Y2UoKG9iaiwgW2tleSwgdmFsXSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ub2JqLFxuICAgICAgICBba2V5XTogdGhpcy5mb3JtQnVpbGRlci5hcnJheSh2YWwubWFwKChpdCkgPT4gdGhpcy5uZXdDb25kaXRpb24oaXQpKSksXG4gICAgICB9O1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gdGhpcy5mb3JtQnVpbGRlci5ncm91cChjb250cm9scyk7XG4gIH1cblxuICBuZXdDb25kaXRpb24oeyBmaWVsZCwgb3BlcmF0b3IsIHNjb3BlLCB2YWx1ZSB9OiBDb25kaXRpb24gPSBFTVBUWV9DT05ESVRJT04pOiBVbnR5cGVkRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7XG4gICAgICBjb25kaXRpb25UeXBlOiAnJGFuZCcsXG4gICAgICBmaWVsZDogW2ZpZWxkLCBWYWxpZGF0b3JzLnJlcXVpcmVkXSxcbiAgICAgIG9wZXJhdG9yOiBbb3BlcmF0b3IsIFZhbGlkYXRvcnMucmVxdWlyZWRdLFxuICAgICAgc2NvcGU6IFtzY29wZV0sXG4gICAgICB2YWx1ZTogW3ZhbHVlXSxcbiAgICB9KTtcbiAgfVxuXG4gIHJlbW92ZUNvbmRpdGlvbkdyb3VwQXQoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMucm9vdC5yZW1vdmVBdChpbmRleCwgeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICB9XG5cbiAgY2xlYXJBbGxDb25kaXRpb25zKCkge1xuICAgIHdoaWxlICh0aGlzLnJvb3QubGVuZ3RoKSB7XG4gICAgICB0aGlzLnJvb3QucmVtb3ZlQXQoMCk7XG4gICAgfVxuICB9XG5cbiAgb25GaWVsZFNlbGVjdChmaWVsZCkge1xuICAgIHRoaXMuc2NvcGVkRmllbGRQaWNrZXIoKS5kcm9wZG93bi5jbG9zZVBhbmVsKCk7XG4gICAgY29uc3QgY29uZGl0aW9uID0geyBmaWVsZDogZmllbGQubmFtZSwgb3BlcmF0b3I6IG51bGwsIHNjb3BlOiBmaWVsZC5zY29wZSwgdmFsdWU6IG51bGwgfTtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuY29uZGl0aW9uR3JvdXBzKCkuZmluZCgoZ3JvdXApID0+IGdyb3VwLnNjb3BlID09PSBmaWVsZC5zY29wZSk7XG4gICAgaWYgKGdyb3VwKSB7XG4gICAgICBncm91cC5hZGRDb25kaXRpb24oY29uZGl0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRDb25kaXRpb25Hcm91cCh7ICRhbmQ6IFtjb25kaXRpb25dIH0pXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY29uZmlndXJlUXVlcnlCdWlsZGVyU2VydmljZSgpIHtcbiAgICB0aGlzLnFicy5zY29wZXMuc2V0KHRoaXMuY29uZmlnPy5maWVsZHMubWFwKChmKSA9PiBmLnZhbHVlKSk7XG4gICAgdGhpcy5xYnMuY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgdGhpcy5xYnMuZWRpdFR5cGVGbiA9IHRoaXMuZWRpdFR5cGVGbjtcbiAgICB0aGlzLnFicy5hbGxvd2VkR3JvdXBpbmdzID0gdGhpcy5hbGxvd2VkR3JvdXBpbmdzIGFzIENvbmp1bmN0aW9uW107XG4gIH1cblxuICBwcml2YXRlIF9yZWdpc3RlckZpZWxkRGVmcygpIHtcbiAgICBjb25zdCBkZWZzID0gWy4uLkFycmF5LmZyb20odGhpcy5fY29udGVudEZpZWxkRGVmcyldO1xuICAgIGRlZnMuZm9yRWFjaCgoZmllbGREZWYpID0+IHtcbiAgICAgIHRoaXMucWJzLnJlZ2lzdGVyRmllbGREZWYoZmllbGREZWYpO1xuICAgIH0pO1xuICB9XG59XG4iLCI8Zm9ybSBbZm9ybUdyb3VwXT1cImlubmVyRm9ybVwiPlxuICA8bm92by1zdGFjayBbZm9ybUFycmF5TmFtZV09XCJjb250cm9sTmFtZVwiIGNsYXNzPVwiY3JpdGVyaWEtYnVpbGRlci1pbm5lclwiPlxuICAgIDxuZy1jb250YWluZXJcbiAgICAgICpuZ0Zvcj1cImxldCBhbmRHcm91cCBvZiByb290LmNvbnRyb2xzOyBsZXQgYW5kSW5kZXggPSBpbmRleDsgbGV0IGlzRmlyc3QgPSBmaXJzdDtsZXQgaXNMYXN0QW5kID0gbGFzdDtcIj5cbiAgICAgIDxub3ZvLWxhYmVsICpuZ0lmPVwiIWlzRmlyc3RcIiBjb2xvcj1cImFzaFwiIHNpemU9XCJ4c1wiIHVwcGVyY2FzZSBwYWRkaW5nPVwic21cIj57eyBxYnMuaGFzTXVsdGlwbGVTY29wZXMoKSA/IGNvbmRpdGlvbkdyb3VwLnNjb3BlICsgJyAnICsgbGFiZWxzLmZpbHRlcnNzIDogcWJzLmdldENvbmp1bmN0aW9uTGFiZWwoJ2FuZCcpIH19PC9ub3ZvLWxhYmVsPlxuICAgICAgPG5vdm8tY29uZGl0aW9uLWdyb3VwIFtoaWRlRmlyc3RPcGVyYXRvcl09XCJoaWRlRmlyc3RPcGVyYXRvclwiIFtjYW5CZUVtcHR5XT1cImNhbkJlRW1wdHlcIiBbZ3JvdXBJbmRleF09XCJhbmRJbmRleFwiIFtmb3JtR3JvdXBOYW1lXT1cImFuZEluZGV4XCIgI2NvbmRpdGlvbkdyb3VwPjwvbm92by1jb25kaXRpb24tZ3JvdXA+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvbm92by1zdGFjaz5cbiAgPG5vdm8tdGFiYmVkLWdyb3VwLXBpY2tlclxuICAgICpuZ0lmPVwicWJzLmhhc011bHRpcGxlU2NvcGVzKClcIlxuICAgIFt0YWJzXT1cInRhYmJlZEdyb3VwUGlja2VyVGFicygpXCJcbiAgICBbc2VsZWN0aW9uRW5hYmxlZF09XCJmYWxzZVwiXG4gICAgW2J1dHRvbkNvbmZpZ109XCJhZGRCdXR0b25Db25maWdcIlxuICAgIChhY3RpdmF0aW9uKT1cIm9uRmllbGRTZWxlY3QoJGV2ZW50KVwiPlxuICA8L25vdm8tdGFiYmVkLWdyb3VwLXBpY2tlcj5cbjwvZm9ybT5cbjxub3ZvLWNvbmRpdGlvbi10ZW1wbGF0ZXMgW2FkZHJlc3NDb25maWddPVwiYWRkcmVzc0NvbmZpZ1wiLz5cblxuPCEtLVxuICB7XG4gICAgJGFuZDogW3tcbiAgICAgICRvcjogW3tcbiAgICAgICAgZW50aXR5OiAnSm9iT3JkZXInXG4gICAgICAgIGZpZWxkOiAnY2F0ZWdvcmllcycsXG4gICAgICAgIG9wZXJhdG9yOiAnZG9lc05vdENvbnRhaW4nLFxuICAgICAgICB2YWx1ZTogJ0hlYWx0aGNhcmUnXG4gICAgICB9XVxuICAgIH1dXG4gIH1cbiAtLT5cbiJdfQ==