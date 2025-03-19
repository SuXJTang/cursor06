import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, QueryList, signal, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NovoPickerToggleElement } from 'novo-elements/elements/field';
import { PlacesListComponent } from 'novo-elements/elements/places';
import { NovoLabelService } from 'novo-elements/services';
import { Helpers } from 'novo-elements/utils';
import { Subscription } from 'rxjs';
import { Operator, RadiusUnits } from '../query-builder.types';
import { AbstractConditionFieldDef } from './abstract-condition.definition';
import { NovoSelectElement } from 'novo-elements/elements/select';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
import * as i4 from "novo-elements/elements/places";
import * as i5 from "novo-elements/elements/common";
import * as i6 from "novo-elements/elements/select";
import * as i7 from "novo-elements/elements/field";
import * as i8 from "novo-elements/elements/flex";
import * as i9 from "novo-elements/elements/icon";
import * as i10 from "novo-elements/elements/chips";
import * as i11 from "novo-elements/elements/tooltip";
import * as i12 from "../query-builder.directives";
/**
 * Handle selection of field values when a list of options is provided.
 */
export class NovoDefaultAddressConditionDef extends AbstractConditionFieldDef {
    constructor(labelService) {
        super(labelService);
        // Static defaults
        this.radiusValues = [5, 10, 20, 30, 40, 50, 100];
        this.defaultRadius = 30;
        // Overridable defaults
        this.defaults = {
            radiusEnabled: false,
            radiusUnits: 'miles',
        };
        this.config = input();
        this.radiusUnits = computed(() => this.config()?.radiusUnits || this.defaults.radiusUnits);
        this.radiusEnabled = computed(() => this.config()?.radiusEnabled || this.defaults.radiusEnabled);
        this.radius = signal(this.defaultRadius);
        this.radiusOptions = computed(() => {
            const unitsLabel = this.radiusUnits() === RadiusUnits.miles ? this.labels.miles : this.labels.km;
            return this.radiusValues.map(value => ({
                label: `${value.toString()} ${unitsLabel}`,
                value,
            }));
        });
        this.defaultOperator = Operator.includeAny;
        this.chipListModel = '';
        this.term = '';
        this._addressChangesSubscription = Subscription.EMPTY;
        this.element = inject(ElementRef);
        this.defineOperatorEditGroup(Operator.includeAny, Operator.excludeAny, Operator.radius);
    }
    frameAfterViewInit() {
        super.frameAfterViewInit();
        // Initialize the radius value from existing data
        this.assignRadiusFromValue();
        // Update the radius on address value changes
        this._addressChangesSubscription = this.inputChildren.changes.subscribe(() => {
            this.assignRadiusFromValue();
        });
    }
    ngOnDestroy() {
        this._addressChangesSubscription.unsubscribe();
    }
    onKeyup(event, viewIndex) {
        if (!["Escape" /* Key.Escape */, "Enter" /* Key.Enter */].includes(event.key)) {
            this.openPlacesList(viewIndex);
        }
        this.term = event.target.value;
    }
    onKeydown(event, viewIndex) {
        if (!this.placesPicker.dropdownOpen) {
            this.openPlacesList(viewIndex);
            this.placesPicker.dropdownOpen = true;
        }
        if (["Escape" /* Key.Escape */, "Tab" /* Key.Tab */].includes(event.key)) {
            this.closePlacesList(viewIndex);
        }
        else {
            this.placesPicker.onKeyDown(event);
        }
    }
    getValue(formGroup) {
        return formGroup.value.value || [];
    }
    getCurrentOverlay(viewIndex) {
        return this.overlayChildren?.find(item => item.overlayId === viewIndex);
    }
    getCurrentInput(viewIndex) {
        return this.inputChildren?.find(item => item.nativeElement.id === viewIndex);
    }
    openPlacesList(viewIndex) {
        this.getCurrentOverlay(viewIndex)?.openPanel();
    }
    closePlacesList(viewIndex) {
        this.getCurrentOverlay(viewIndex)?.closePanel();
    }
    selectPlace(event, formGroup, viewIndex) {
        const valueToAdd = {
            address_components: event.address_components,
            formatted_address: event.formatted_address,
            geometry: event.geometry,
            name: event.name,
            place_id: event.place_id,
            types: event.types,
        };
        const current = this.getValue(formGroup);
        const updated = Array.isArray(current) ? [...current, valueToAdd] : [valueToAdd];
        formGroup.get('value').setValue(this.updateRadiusInValues(formGroup, updated));
        this.inputChildren.forEach(input => {
            input.nativeElement.value = '';
        });
        this.getCurrentInput(viewIndex)?.nativeElement.focus();
        this.closePlacesList(viewIndex);
    }
    remove(valueToRemove, formGroup, viewIndex) {
        const current = this.getValue(formGroup);
        const index = current.indexOf(valueToRemove);
        if (index >= 0) {
            const oldValue = [...current];
            oldValue.splice(index, 1);
            formGroup.get('value').setValue(oldValue);
        }
        this.closePlacesList(viewIndex);
    }
    // Override abstract behavior - allow moving location from includeAny to radius, but when moving the opposite direction,
    // trim out radius information from the value
    onOperatorSelect(formGroup) {
        const previousOperator = this._previousOperatorValue;
        super.onOperatorSelect(formGroup);
        if ([previousOperator, formGroup.get('operator').getRawValue()].indexOf(Operator.radius) !== -1 &&
            formGroup.get('value').getRawValue() != null) {
            formGroup.get('value').setValue(this.updateRadiusInValues(formGroup, this.getValue(formGroup)));
        }
    }
    onRadiusSelect(formGroup, radius) {
        this.radius.set(radius);
        // We must dirty the form explicitly to show up as a user modification when it was done programmatically
        formGroup.get('value').setValue(this.updateRadiusInValues(formGroup, this.getValue(formGroup)));
        formGroup.markAsDirty();
    }
    assignRadiusFromValue() {
        if (this.placesPicker?.model?.length) {
            const addressData = this.placesPicker.model[0];
            const initialRadius = addressData.radius?.value;
            if (initialRadius && Helpers.isNumber(initialRadius)) {
                this.radius.set(initialRadius);
            }
        }
    }
    updateRadiusInValues(formGroup, values) {
        return values.map(val => ({
            ...val,
            radius: this.isRadiusOperatorSelected(formGroup) ? this.getRadiusData(formGroup) : undefined,
        }));
    }
    getRadiusData(formGroup) {
        return {
            value: this.getRadius(formGroup),
            units: this.radiusUnits(),
        };
    }
    getRadius(formGroup) {
        return this.isRadiusOperatorSelected(formGroup) ? this.radius() : undefined;
    }
    isRadiusOperatorSelected(formGroup) {
        return formGroup.get('operator').value === 'radius';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoDefaultAddressConditionDef, deps: [{ token: i1.NovoLabelService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "17.3.12", type: NovoDefaultAddressConditionDef, selector: "novo-address-condition-def", inputs: { config: { classPropertyName: "config", publicName: "config", isSignal: true, isRequired: false, transformFunction: null } }, viewQueries: [{ propertyName: "placesPicker", first: true, predicate: ["placesPicker"], descendants: true }, { propertyName: "overlayChildren", predicate: NovoPickerToggleElement, descendants: true }, { propertyName: "inputChildren", predicate: ["addressInput"], descendants: true }, { propertyName: "addressSideTest", predicate: NovoSelectElement, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <ng-container novoConditionFieldDef>
      <novo-field *novoConditionOperatorsDef="let formGroup" [formGroup]="formGroup">
        <novo-select [placeholder]="labels.operator" formControlName="operator" (onSelect)="onOperatorSelect(formGroup)">
          <novo-option value="includeAny">{{ labels.includeAny }}</novo-option>
          <novo-option value="excludeAny">{{ labels.exclude }}</novo-option>
          <novo-option value="radius" *ngIf="radiusEnabled()">{{ labels.radius }}</novo-option>
        </novo-select>
      </novo-field>
      <ng-container *novoConditionInputDef="let formGroup; viewIndex as viewIndex; fieldMeta as meta" [formGroup]="formGroup">
        <novo-flex justify="space-between" align="end">
          <novo-field #novoRadiusField *ngIf="formGroup.value.operator === 'radius'" class="address-radius">
            <novo-select
              #radiusSelect [placeholder]="labels.radius"
              (onSelect)="onRadiusSelect(formGroup, $event.selected)"
              [value]="radius()"
              [options]="radiusOptions()">
            </novo-select>
          </novo-field>
          <novo-field #novoField class="address-location">
            <novo-chip-list [(ngModel)]="chipListModel" [ngModelOptions]="{ standalone: true }" (click)="openPlacesList(viewIndex)">
              <novo-chip *ngFor="let item of formGroup.get('value').value" (removed)="remove(item, formGroup, viewIndex)">
                <novo-text ellipsis [tooltip]="item.formatted_address" tooltipOnOverflow>{{ item.formatted_address }}</novo-text>
                <novo-icon novoChipRemove>close</novo-icon>
              </novo-chip>
              <input
                novoChipInput
                [id]="viewIndex"
                [placeholder]="labels.location"
                (keyup)="onKeyup($event, viewIndex)"
                (keydown)="onKeydown($event, viewIndex)"
                [picker]="placesPicker"
                #addressInput/>
            </novo-chip-list>
            <novo-picker-toggle [overlayId]="viewIndex" icon="location" novoSuffix>
              <google-places-list
                [term]="term"
                (select)="selectPlace($event, formGroup, viewIndex)"
                formControlName="value"
                #placesPicker/>
            </novo-picker-toggle>
          </novo-field>
        </novo-flex>
      </ng-container>
    </ng-container>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i3.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: i4.PlacesListComponent, selector: "google-places-list", inputs: ["userSettings"], outputs: ["termChange", "select"] }, { kind: "component", type: i5.NovoText, selector: "novo-text,[novo-text]", inputs: ["block"] }, { kind: "component", type: i6.NovoSelectElement, selector: "novo-select", inputs: ["disabled", "required", "tabIndex", "id", "name", "options", "placeholder", "readonly", "headerConfig", "position", "overlayWidth", "overlayHeight", "displayIcon", "displayWith", "compareWith", "value", "multiple"], outputs: ["onSelect", "selectionChange", "valueChange", "openedChange", "opened", "closed"] }, { kind: "component", type: i7.NovoFieldElement, selector: "novo-field", inputs: ["layout", "appearance", "customOverlayOrigin", "width"], outputs: ["valueChanges", "stateChanges"] }, { kind: "directive", type: i7.NovoFieldSuffixDirective, selector: "[novoSuffix]" }, { kind: "component", type: i7.NovoPickerToggleElement, selector: "novo-picker-toggle", inputs: ["for", "icon", "tabIndex", "aria-label", "triggerOnFocus", "overlayId", "width", "disabled"], exportAs: ["novoPickerToggle"] }, { kind: "directive", type: i7.NovoPickerDirective, selector: "input[picker]", inputs: ["picker", "autocomplete"] }, { kind: "component", type: i5.NovoOption, selector: "novo-option", inputs: ["selected", "keepOpen", "novoInert", "value", "disabled"], exportAs: ["novoOption"] }, { kind: "component", type: i8.NovoFlexElement, selector: "novo-flex,novo-row", inputs: ["direction", "align", "justify", "wrap", "gap"] }, { kind: "component", type: i9.NovoIconComponent, selector: "novo-icon", inputs: ["raised", "theme", "shape", "color", "size", "smaller", "larger", "alt", "name"] }, { kind: "component", type: i10.NovoChipElement, selector: "novo-chip, [novo-chip]", inputs: ["color", "tabIndex", "size", "type", "selected", "value", "selectable", "disabled", "removable"], outputs: ["selectionChange", "destroyed", "removed"] }, { kind: "directive", type: i10.NovoChipRemove, selector: "[novoChipRemove]" }, { kind: "directive", type: i10.NovoChipInput, selector: "input[novoChipInput]", inputs: ["novoChipInputAddOnBlur", "novoChipInputSeparatorKeyCodes", "placeholder", "id", "disabled"], outputs: ["novoChipInputTokenEnd"], exportAs: ["novoChipInput", "novoChipInputFor"] }, { kind: "component", type: i10.NovoChipList, selector: "novo-chip-list", inputs: ["errorStateMatcher", "multiple", "stacked", "compareWith", "value", "required", "placeholder", "disabled", "aria-orientation", "selectable", "tabIndex"], outputs: ["change", "valueChange"], exportAs: ["novoChipList"] }, { kind: "directive", type: i11.TooltipDirective, selector: "[tooltip]", inputs: ["tooltip", "tooltipPosition", "tooltipType", "tooltipSize", "tooltipBounce", "tooltipNoAnimate", "tooltipRounded", "tooltipAlways", "tooltipPreline", "removeTooltipArrow", "tooltipAutoPosition", "tooltipIsHTML", "tooltipCloseOnClick", "tooltipOnOverflow", "tooltipActive"] }, { kind: "directive", type: i12.NovoConditionOperatorsDef, selector: "[novoConditionOperatorsDef]" }, { kind: "directive", type: i12.NovoConditionInputDef, selector: "[novoConditionInputDef]" }, { kind: "directive", type: i12.NovoConditionFieldDef, selector: "[novoConditionFieldDef]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoDefaultAddressConditionDef, decorators: [{
            type: Component,
            args: [{
                    selector: 'novo-address-condition-def',
                    template: `
    <ng-container novoConditionFieldDef>
      <novo-field *novoConditionOperatorsDef="let formGroup" [formGroup]="formGroup">
        <novo-select [placeholder]="labels.operator" formControlName="operator" (onSelect)="onOperatorSelect(formGroup)">
          <novo-option value="includeAny">{{ labels.includeAny }}</novo-option>
          <novo-option value="excludeAny">{{ labels.exclude }}</novo-option>
          <novo-option value="radius" *ngIf="radiusEnabled()">{{ labels.radius }}</novo-option>
        </novo-select>
      </novo-field>
      <ng-container *novoConditionInputDef="let formGroup; viewIndex as viewIndex; fieldMeta as meta" [formGroup]="formGroup">
        <novo-flex justify="space-between" align="end">
          <novo-field #novoRadiusField *ngIf="formGroup.value.operator === 'radius'" class="address-radius">
            <novo-select
              #radiusSelect [placeholder]="labels.radius"
              (onSelect)="onRadiusSelect(formGroup, $event.selected)"
              [value]="radius()"
              [options]="radiusOptions()">
            </novo-select>
          </novo-field>
          <novo-field #novoField class="address-location">
            <novo-chip-list [(ngModel)]="chipListModel" [ngModelOptions]="{ standalone: true }" (click)="openPlacesList(viewIndex)">
              <novo-chip *ngFor="let item of formGroup.get('value').value" (removed)="remove(item, formGroup, viewIndex)">
                <novo-text ellipsis [tooltip]="item.formatted_address" tooltipOnOverflow>{{ item.formatted_address }}</novo-text>
                <novo-icon novoChipRemove>close</novo-icon>
              </novo-chip>
              <input
                novoChipInput
                [id]="viewIndex"
                [placeholder]="labels.location"
                (keyup)="onKeyup($event, viewIndex)"
                (keydown)="onKeydown($event, viewIndex)"
                [picker]="placesPicker"
                #addressInput/>
            </novo-chip-list>
            <novo-picker-toggle [overlayId]="viewIndex" icon="location" novoSuffix>
              <google-places-list
                [term]="term"
                (select)="selectPlace($event, formGroup, viewIndex)"
                formControlName="value"
                #placesPicker/>
            </novo-picker-toggle>
          </novo-field>
        </novo-flex>
      </ng-container>
    </ng-container>
  `,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.Default,
                }]
        }], ctorParameters: () => [{ type: i1.NovoLabelService }], propDecorators: { overlayChildren: [{
                type: ViewChildren,
                args: [NovoPickerToggleElement]
            }], inputChildren: [{
                type: ViewChildren,
                args: ['addressInput']
            }], placesPicker: [{
                type: ViewChild,
                args: ['placesPicker']
            }], addressSideTest: [{
                type: ViewChildren,
                args: [NovoSelectElement]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcmVzcy1jb25kaXRpb24uZGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL3F1ZXJ5LWJ1aWxkZXIvY29uZGl0aW9uLWRlZmluaXRpb25zL2FkZHJlc3MtY29uZGl0aW9uLmRlZmluaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsUUFBUSxFQUNSLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUdMLFNBQVMsRUFFVCxNQUFNLEVBQ04sU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsRUFFbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFFLE9BQU8sRUFBTyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUE2RSxRQUFRLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDMUksT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDNUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sK0JBQStCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBRWxFOztHQUVHO0FBb0RILE1BQU0sT0FBTyw4QkFBK0IsU0FBUSx5QkFBeUI7SUF3QzNFLFlBQVksWUFBOEI7UUFDeEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBbkN0QixrQkFBa0I7UUFDbEIsaUJBQVksR0FBYSxDQUFDLENBQUMsRUFBRSxFQUFFLEVB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VUFBVSxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQztJQUN0RCxDQUFDOytHQWxMVSw4QkFBOEI7bUdBQTlCLDhCQUE4Qiw0VUFDM0IsdUJBQXVCLHdKQUd2QixpQkFBaUIsdUVBckRyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkNUOzs0RkFJVSw4QkFBOEI7a0JBbkQxQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw0QkFBNEI7b0JBQ3RDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkNUO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsT0FBTztpQkFDakQ7cUZBRXdDLGVBQWU7c0JBQXJELFlBQVk7dUJBQUMsdUJBQXVCO2dCQUNQLGFBQWE7c0JBQTFDLFlBQVk7dUJBQUMsY0FBYztnQkFDRCxZQUFZO3NCQUF0QyxTQUFTO3VCQUFDLGNBQWM7Z0JBQ1EsZUFBZTtzQkFBL0MsWUFBWTt1QkFBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBjb21wdXRlZCxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBpbnB1dCxcbiAgSW5wdXRTaWduYWwsXG4gIE9uRGVzdHJveSxcbiAgUXVlcnlMaXN0LFxuICBTaWduYWwsXG4gIHNpZ25hbCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBXcml0YWJsZVNpZ25hbFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFic3RyYWN0Q29udHJvbCwgVW50eXBlZEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE5vdm9QaWNrZXJUb2dnbGVFbGVtZW50IH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy9maWVsZCc7XG5pbXBvcnQgeyBQbGFjZXNMaXN0Q29tcG9uZW50IH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy9wbGFjZXMnO1xuaW1wb3J0IHsgTm92b0xhYmVsU2VydmljZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvc2VydmljZXMnO1xuaW1wb3J0IHsgSGVscGVycywgS2V5IH0gZnJvbSAnbm92by1lbGVtZW50cy91dGlscyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEFkZHJlc3NDcml0ZXJpYUNvbmZpZywgQWRkcmVzc0RhdGEsIEFkZHJlc3NSYWRpdXMsIEFkZHJlc3NSYWRpdXNVbml0c05hbWUsIE9wZXJhdG9yLCBSYWRpdXNVbml0cyB9IGZyb20gJy4uL3F1ZXJ5LWJ1aWxkZXIudHlwZXMnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb25kaXRpb25GaWVsZERlZiB9IGZyb20gJy4vYWJzdHJhY3QtY29uZGl0aW9uLmRlZmluaXRpb24nO1xuaW1wb3J0IHsgTm92b1NlbGVjdEVsZW1lbnQgfSBmcm9tICdub3ZvLWVsZW1lbnRzL2VsZW1lbnRzL3NlbGVjdCc7XG5cbi8qKlxuICogSGFuZGxlIHNlbGVjdGlvbiBvZiBmaWVsZCB2YWx1ZXMgd2hlbiBhIGxpc3Qgb2Ygb3B0aW9ucyBpcyBwcm92aWRlZC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1hZGRyZXNzLWNvbmRpdGlvbi1kZWYnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgbm92b0NvbmRpdGlvbkZpZWxkRGVmPlxuICAgICAgPG5vdm8tZmllbGQgKm5vdm9Db25kaXRpb25PcGVyYXRvcnNEZWY9XCJsZXQgZm9ybUdyb3VwXCIgW2Zvcm1Hcm91cF09XCJmb3JtR3JvdXBcIj5cbiAgICAgICAgPG5vdm8tc2VsZWN0IFtwbGFjZWhvbGRlcl09XCJsYWJlbHMub3BlcmF0b3JcIiBmb3JtQ29udHJvbE5hbWU9XCJvcGVyYXRvclwiIChvblNlbGVjdCk9XCJvbk9wZXJhdG9yU2VsZWN0KGZvcm1Hcm91cClcIj5cbiAgICAgICAgICA8bm92by1vcHRpb24gdmFsdWU9XCJpbmNsdWRlQW55XCI+e3sgbGFiZWxzLmluY2x1ZGVBbnkgfX08L25vdm8tb3B0aW9uPlxuICAgICAgICAgIDxub3ZvLW9wdGlvbiB2YWx1ZT1cImV4Y2x1ZGVBbnlcIj57eyBsYWJlbHMuZXhjbHVkZSB9fTwvbm92by1vcHRpb24+XG4gICAgICAgICAgPG5vdm8tb3B0aW9uIHZhbHVlPVwicmFkaXVzXCIgKm5nSWY9XCJyYWRpdXNFbmFibGVkKClcIj57eyBsYWJlbHMucmFkaXVzIH19PC9ub3ZvLW9wdGlvbj5cbiAgICAgICAgPC9ub3ZvLXNlbGVjdD5cbiAgICAgIDwvbm92by1maWVsZD5cbiAgICAgIDxuZy1jb250YWluZXIgKm5vdm9Db25kaXRpb25JbnB1dERlZj1cImxldCBmb3JtR3JvdXA7IHZpZXdJbmRleCBhcyB2aWV3SW5kZXg7IGZpZWxkTWV0YSBhcyBtZXRhXCIgW2Zvcm1Hcm91cF09XCJmb3JtR3JvdXBcIj5cbiAgICAgICAgPG5vdm8tZmxleCBqdXN0aWZ5PVwic3BhY2UtYmV0d2VlblwiIGFsaWduPVwiZW5kXCI+XG4gICAgICAgICAgPG5vdm8tZmllbGQgI25vdm9SYWRpdXNGaWVsZCAqbmdJZj1cImZvcm1Hcm91cC52YWx1ZS5vcGVyYXRvciA9PT0gJ3JhZGl1cydcIiBjbGFzcz1cImFkZHJlc3MtcmFkaXVzXCI+XG4gICAgICAgICAgICA8bm92by1zZWxlY3RcbiAgICAgICAgICAgICAgI3JhZGl1c1NlbGVjdCBbcGxhY2Vob2xkZXJdPVwibGFiZWxzLnJhZGl1c1wiXG4gICAgICAgICAgICAgIChvblNlbGVjdCk9XCJvblJhZGl1c1NlbGVjdChmb3JtR3JvdXAsICRldmVudC5zZWxlY3RlZClcIlxuICAgICAgICAgICAgICBbdmFsdWVdPVwicmFkaXVzKClcIlxuICAgICAgICAgICAgICBbb3B0aW9uc109XCJyYWRpdXNPcHRpb25zKClcIj5cbiAgICAgICAgICAgIDwvbm92by1zZWxlY3Q+XG4gICAgICAgICAgPC9ub3ZvLWZpZWxkPlxuICAgICAgICAgIDxub3ZvLWZpZWxkICNub3ZvRmllbGQgY2xhc3M9XCJhZGRyZXNzLWxvY2F0aW9uXCI+XG4gICAgICAgICAgICA8bm92by1jaGlwLWxpc3QgWyhuZ01vZGVsKV09XCJjaGlwTGlzdE1vZGVsXCIgW25nTW9kZWxPcHRpb25zXT1cInsgc3RhbmRhbG9uZTogdHJ1ZSB9XCIgKGNsaWNrKT1cIm9wZW5QbGFjZXNMaXN0KHZpZXdJbmRleClcIj5cbiAgICAgICAgICAgICAgPG5vdm8tY2hpcCAqbmdGb3I9XCJsZXQgaXRlbSBvZiBmb3JtR3JvdXAuZ2V0KCd2YWx1ZScpLnZhbHVlXCIgKHJlbW92ZWQpPVwicmVtb3ZlKGl0ZW0sIGZvcm1Hcm91cCwgdmlld0luZGV4KVwiPlxuICAgICAgICAgICAgICAgIDxub3ZvLXRleHQgZWxsaXBzaXMgW3Rvb2x0aXBdPVwiaXRlbS5mb3JtYXR0ZWRfYWRkcmVzc1wiIHRvb2x0aXBPbk92ZXJmbG93Pnt7IGl0ZW0uZm9ybWF0dGVkX2FkZHJlc3MgfX08L25vdm8tdGV4dD5cbiAgICAgICAgICAgICAgICA8bm92by1pY29uIG5vdm9DaGlwUmVtb3ZlPmNsb3NlPC9ub3ZvLWljb24+XG4gICAgICAgICAgICAgIDwvbm92by1jaGlwPlxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICBub3ZvQ2hpcElucHV0XG4gICAgICAgICAgICAgICAgW2lkXT1cInZpZXdJbmRleFwiXG4gICAgICAgICAgICAgICAgW3BsYWNlaG9sZGVyXT1cImxhYmVscy5sb2NhdGlvblwiXG4gICAgICAgICAgICAgICAgKGtleXVwKT1cIm9uS2V5dXAoJGV2ZW50LCB2aWV3SW5kZXgpXCJcbiAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvbktleWRvd24oJGV2ZW50LCB2aWV3SW5kZXgpXCJcbiAgICAgICAgICAgICAgICBbcGlja2VyXT1cInBsYWNlc1BpY2tlclwiXG4gICAgICAgICAgICAgICAgI2FkZHJlc3NJbnB1dC8+XG4gICAgICAgICAgICA8L25vdm8tY2hpcC1saXN0PlxuICAgICAgICAgICAgPG5vdm8tcGlja2VyLXRvZ2dsZSBbb3ZlcmxheUlkXT1cInZpZXdJbmRleFwiIGljb249XCJsb2NhdGlvblwiIG5vdm9TdWZmaXg+XG4gICAgICAgICAgICAgIDxnb29nbGUtcGxhY2VzLWxpc3RcbiAgICAgICAgICAgICAgICBbdGVybV09XCJ0ZXJtXCJcbiAgICAgICAgICAgICAgICAoc2VsZWN0KT1cInNlbGVjdFBsYWNlKCRldmVudCwgZm9ybUdyb3VwLCB2aWV3SW5kZXgpXCJcbiAgICAgICAgICAgICAgICBmb3JtQ29udHJvbE5hbWU9XCJ2YWx1ZVwiXG4gICAgICAgICAgICAgICAgI3BsYWNlc1BpY2tlci8+XG4gICAgICAgICAgICA8L25vdm8tcGlja2VyLXRvZ2dsZT5cbiAgICAgICAgICA8L25vdm8tZmllbGQ+XG4gICAgICAgIDwvbm92by1mbGV4PlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIGAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTm92b0RlZmF1bHRBZGRyZXNzQ29uZGl0aW9uRGVmIGV4dGVuZHMgQWJzdHJhY3RDb25kaXRpb25GaWVsZERlZiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBWaWV3Q2hpbGRyZW4oTm92b1BpY2tlclRvZ2dsZUVsZW1lbnQpIG92ZXJsYXlDaGlsZHJlbjogUXVlcnlMaXN0PE5vdm9QaWNrZXJUb2dnbGVFbGVtZW50PjtcbiAgQFZpZXdDaGlsZHJlbignYWRkcmVzc0lucHV0JykgaW5wdXRDaGlsZHJlbjogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuICBAVmlld0NoaWxkKCdwbGFjZXNQaWNrZXInKSBwbGFjZXNQaWNrZXI6IFBsYWNlc0xpc3RDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGRyZW4oTm92b1NlbGVjdEVsZW1lbnQpIGFkZHJlc3NTaWRlVGVzdDogYW55O1xuXG4gIC8vIFN0YXRpYyBkZWZhdWx0c1xuICByYWRpdXNWYWx1ZXM6IG51bWJlcltdID0gWzUsIDEwLCAyMCwgMzAsIDQwLCA1MCwgMTAwXTtcbiAgZGVmYXVsdFJhZGl1czogbnVtYmVyID0gMzA7XG5cbiAgLy8gT3ZlcnJpZGFibGUgZGVmYXVsdHNcbiAgZGVmYXVsdHM6IEFkZHJlc3NDcml0ZXJpYUNvbmZpZyA9IHtcbiAgICByYWRpdXNFbmFibGVkOiBmYWxzZSxcbiAgICByYWRpdXNVbml0czogJ21pbGVzJyxcbiAgfTtcbiAgY29uZmlnOiBJbnB1dFNpZ25hbDxBZGRyZXNzQ3JpdGVyaWFDb25maWc+ID0gaW5wdXQoKTtcbiAgcmFkaXVzVW5pdHM6IFNpZ25hbDxBZGRyZXNzUmFkaXVzVW5pdHNOYW1lPiA9IGNvbXB1dGVkKCgpID0+XG4gICAgdGhpcy5jb25maWcoKT8ucmFkaXVzVW5pdHMgfHwgdGhpcy5kZWZhdWx0cy5yYWRpdXNVbml0c1xuICApO1xuICByYWRpdXNFbmFibGVkOiBTaWduYWw8Ym9vbGVhbj4gPSBjb21wdXRlZCgoKSA9PlxuICAgIHRoaXMuY29uZmlnKCk/LnJhZGl1c0VuYWJsZWQgfHwgdGhpcy5kZWZhdWx0cy5yYWRpdXNFbmFibGVkXG4gICk7XG5cbiAgcmFkaXVzOiBXcml0YWJsZVNpZ25hbDxudW1iZXI+ID0gc2lnbmFsKHRoaXMuZGVmYXVsdFJhZGl1cyk7XG4gIHJhZGl1c09wdGlvbnM6IFNpZ25hbDx7IGxhYmVsOiBzdHJpbmc7IHZhbHVlOiBudW1iZXI7IH1bXT4gPSBjb21wdXRlZCgoKSA9PiB7XG4gICAgY29uc3QgdW5pdHNMYWJlbCA9IHRoaXMucmFkaXVzVW5pdHMoKSA9PT0gUmFkaXVzVW5pdHMubWlsZXMgPyB0aGlzLmxhYmVscy5taWxlcyA6IHRoaXMubGFiZWxzLmttO1xuICAgIHJldHVybiB0aGlzLnJhZGl1c1ZhbHVlcy5tYXAodmFsdWUgPT4gKHtcbiAgICAgIGxhYmVsOiBgJHt2YWx1ZS50b1N0cmluZygpfSAke3VuaXRzTGFiZWx9YCxcbiAgICAgIHZhbHVlLFxuICAgIH0pKTtcbiAgfSk7XG5cbiAgZGVmYXVsdE9wZXJhdG9yID0gT3BlcmF0b3IuaW5jbHVkZUFueTtcbiAgY2hpcExpc3RNb2RlbDogYW55ID0gJyc7XG4gIHRlcm06IHN0cmluZyA9ICcnO1xuXG4gIHByaXZhdGUgX2FkZHJlc3NDaGFuZ2VzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgcHVibGljIGVsZW1lbnQgPSBpbmplY3QoRWxlbWVudFJlZik7XG5cbiAgY29uc3RydWN0b3IobGFiZWxTZXJ2aWNlOiBOb3ZvTGFiZWxTZXJ2aWNlKSB7XG4gICAgc3VwZXIobGFiZWxTZXJ2aWNlKTtcbiAgICB0aGlzLmRlZmluZU9wZXJhdG9yRWRpdEdyb3VwKE9wZXJhdG9yLmluY2x1ZGVBbnksIE9wZXJhdG9yLmV4Y2x1ZGVBbnksIE9wZXJhdG9yLnJhZGl1cyk7XG4gIH1cblxuICBmcmFtZUFmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIuZnJhbWVBZnRlclZpZXdJbml0KCk7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgcmFkaXVzIHZhbHVlIGZyb20gZXhpc3RpbmcgZGF0YVxuICAgIHRoaXMuYXNzaWduUmFkaXVzRnJvbVZhbHVlKCk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIHJhZGl1cyBvbiBhZGRyZXNzIHZhbHVlIGNoYW5nZXNcbiAgICB0aGlzLl9hZGRyZXNzQ2hhbmdlc1N1YnNjcmlwdGlvbiA9IHRoaXMuaW5wdXRDaGlsZHJlbi5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmFzc2lnblJhZGl1c0Zyb21WYWx1ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fYWRkcmVzc0NoYW5nZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG9uS2V5dXAoZXZlbnQsIHZpZXdJbmRleCkge1xuICAgIGlmICghW0tleS5Fc2NhcGUsIEtleS5FbnRlcl0uaW5jbHVkZXMoZXZlbnQua2V5KSkge1xuICAgICAgdGhpcy5vcGVuUGxhY2VzTGlzdCh2aWV3SW5kZXgpO1xuICAgIH1cbiAgICB0aGlzLnRlcm0gPSBldmVudC50YXJnZXQudmFsdWU7XG4gIH1cblxuICBvbktleWRvd24oZXZlbnQsIHZpZXdJbmRleCkge1xuICAgIGlmICghdGhpcy5wbGFjZXNQaWNrZXIuZHJvcGRvd25PcGVuKSB7XG4gICAgICB0aGlzLm9wZW5QbGFjZXNMaXN0KHZpZXdJbmRleCk7XG4gICAgICB0aGlzLnBsYWNlc1BpY2tlci5kcm9wZG93bk9wZW4gPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoW0tleS5Fc2NhcGUsIEtleS5UYWJdLmluY2x1ZGVzKGV2ZW50LmtleSkpIHtcbiAgICAgIHRoaXMuY2xvc2VQbGFjZXNMaXN0KHZpZXdJbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGxhY2VzUGlja2VyLm9uS2V5RG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VmFsdWUoZm9ybUdyb3VwOiBBYnN0cmFjdENvbnRyb2wpOiBBZGRyZXNzRGF0YVtdIHtcbiAgICByZXR1cm4gZm9ybUdyb3VwLnZhbHVlLnZhbHVlIHx8IFtdO1xuICB9XG5cbiAgZ2V0Q3VycmVudE92ZXJsYXkodmlld0luZGV4OiBzdHJpbmcpOiBOb3ZvUGlja2VyVG9nZ2xlRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMub3ZlcmxheUNoaWxkcmVuPy5maW5kKGl0ZW0gPT4gaXRlbS5vdmVybGF5SWQgPT09IHZpZXdJbmRleCk7XG4gIH1cblxuICBnZXRDdXJyZW50SW5wdXQodmlld0luZGV4OiBzdHJpbmcpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dENoaWxkcmVuPy5maW5kKGl0ZW0gPT4gKGl0ZW0gYXMgYW55KS5uYXRpdmVFbGVtZW50LmlkID09PSB2aWV3SW5kZXgpO1xuICB9XG5cbiAgb3BlblBsYWNlc0xpc3Qodmlld0luZGV4KSB7XG4gICAgdGhpcy5nZXRDdXJyZW50T3ZlcmxheSh2aWV3SW5kZXgpPy5vcGVuUGFuZWwoKTtcbiAgfVxuXG4gIGNsb3NlUGxhY2VzTGlzdCh2aWV3SW5kZXgpIHtcbiAgICB0aGlzLmdldEN1cnJlbnRPdmVybGF5KHZpZXdJbmRleCk/LmNsb3NlUGFuZWwoKTtcbiAgfVxuXG4gIHNlbGVjdFBsYWNlKGV2ZW50OiBhbnksIGZvcm1Hcm91cDogQWJzdHJhY3RDb250cm9sLCB2aWV3SW5kZXg6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlVG9BZGQ6IEFkZHJlc3NEYXRhID0ge1xuICAgICAgYWRkcmVzc19jb21wb25lbnRzOiBldmVudC5hZGRyZXNzX2NvbXBvbmVudHMsXG4gICAgICBmb3JtYXR0ZWRfYWRkcmVzczogZXZlbnQuZm9ybWF0dGVkX2FkZHJlc3MsXG4gICAgICBnZW9tZXRyeTogZXZlbnQuZ2VvbWV0cnksXG4gICAgICBuYW1lOiBldmVudC5uYW1lLFxuICAgICAgcGxhY2VfaWQ6IGV2ZW50LnBsYWNlX2lkLFxuICAgICAgdHlwZXM6IGV2ZW50LnR5cGVzLFxuICAgIH07XG4gICAgY29uc3QgY3VycmVudDogQWRkcmVzc0RhdGEgfCBBZGRyZXNzRGF0YVtdID0gdGhpcy5nZXRWYWx1ZShmb3JtR3JvdXApO1xuICAgIGNvbnN0IHVwZGF0ZWQ6IEFkZHJlc3NEYXRhW10gPSBBcnJheS5pc0FycmF5KGN1cnJlbnQpID8gWy4uLmN1cnJlbnQsIHZhbHVlVG9BZGRdIDogW3ZhbHVlVG9BZGRdO1xuICAgIGZvcm1Hcm91cC5nZXQoJ3ZhbHVlJykuc2V0VmFsdWUodGhpcy51cGRhdGVSYWRpdXNJblZhbHVlcyhmb3JtR3JvdXAsIHVwZGF0ZWQpKTtcblxuICAgIHRoaXMuaW5wdXRDaGlsZHJlbi5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgIGlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSAnJztcbiAgICB9KVxuICAgIHRoaXMuZ2V0Q3VycmVudElucHV0KHZpZXdJbmRleCk/Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB0aGlzLmNsb3NlUGxhY2VzTGlzdCh2aWV3SW5kZXgpO1xuICB9XG5cbiAgcmVtb3ZlKHZhbHVlVG9SZW1vdmU6IEFkZHJlc3NEYXRhLCBmb3JtR3JvdXA6IEFic3RyYWN0Q29udHJvbCwgdmlld0luZGV4OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5nZXRWYWx1ZShmb3JtR3JvdXApO1xuICAgIGNvbnN0IGluZGV4ID0gY3VycmVudC5pbmRleE9mKHZhbHVlVG9SZW1vdmUpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IFsuLi5jdXJyZW50XVxuICAgICAgb2xkVmFsdWUuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIGZvcm1Hcm91cC5nZXQoJ3ZhbHVlJykuc2V0VmFsdWUob2xkVmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLmNsb3NlUGxhY2VzTGlzdCh2aWV3SW5kZXgpO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgYWJzdHJhY3QgYmVoYXZpb3IgLSBhbGxvdyBtb3ZpbmcgbG9jYXRpb24gZnJvbSBpbmNsdWRlQW55IHRvIHJhZGl1cywgYnV0IHdoZW4gbW92aW5nIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24sXG4gIC8vIHRyaW0gb3V0IHJhZGl1cyBpbmZvcm1hdGlvbiBmcm9tIHRoZSB2YWx1ZVxuICBvbk9wZXJhdG9yU2VsZWN0KGZvcm1Hcm91cDogVW50eXBlZEZvcm1Hcm91cCk6IHZvaWQge1xuICAgIGNvbnN0IHByZXZpb3VzT3BlcmF0b3IgPSB0aGlzLl9wcmV2aW91c09wZXJhdG9yVmFsdWU7XG4gICAgc3VwZXIub25PcGVyYXRvclNlbGVjdChmb3JtR3JvdXApO1xuICAgIGlmIChbcHJldmlvdXNPcGVyYXRvciwgZm9ybUdyb3VwLmdldCgnb3BlcmF0b3InKS5nZXRSYXdWYWx1ZSgpXS5pbmRleE9mKE9wZXJhdG9yLnJhZGl1cykgIT09IC0xICYmXG4gICAgICAgIGZvcm1Hcm91cC5nZXQoJ3ZhbHVlJykuZ2V0UmF3VmFsdWUoKSAhPSBudWxsKSB7XG4gICAgICBmb3JtR3JvdXAuZ2V0KCd2YWx1ZScpLnNldFZhbHVlKHRoaXMudXBkYXRlUmFkaXVzSW5WYWx1ZXMoZm9ybUdyb3VwLCB0aGlzLmdldFZhbHVlKGZvcm1Hcm91cCkpKTtcbiAgICB9XG4gIH1cblxuICBvblJhZGl1c1NlbGVjdChmb3JtR3JvdXA6IEFic3RyYWN0Q29udHJvbCwgcmFkaXVzOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnJhZGl1cy5zZXQocmFkaXVzKTtcbiAgICAvLyBXZSBtdXN0IGRpcnR5IHRoZSBmb3JtIGV4cGxpY2l0bHkgdG8gc2hvdyB1cCBhcyBhIHVzZXIgbW9kaWZpY2F0aW9uIHdoZW4gaXQgd2FzIGRvbmUgcHJvZ3JhbW1hdGljYWxseVxuICAgIGZvcm1Hcm91cC5nZXQoJ3ZhbHVlJykuc2V0VmFsdWUodGhpcy51cGRhdGVSYWRpdXNJblZhbHVlcyhmb3JtR3JvdXAsIHRoaXMuZ2V0VmFsdWUoZm9ybUdyb3VwKSkpO1xuICAgIGZvcm1Hcm91cC5tYXJrQXNEaXJ0eSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NpZ25SYWRpdXNGcm9tVmFsdWUoKSB7XG4gICAgaWYgKHRoaXMucGxhY2VzUGlja2VyPy5tb2RlbD8ubGVuZ3RoKSB7XG4gICAgICBjb25zdCBhZGRyZXNzRGF0YTogQWRkcmVzc0RhdGEgPSB0aGlzLnBsYWNlc1BpY2tlci5tb2RlbFswXTtcbiAgICAgIGNvbnN0IGluaXRpYWxSYWRpdXMgPSBhZGRyZXNzRGF0YS5yYWRpdXM/LnZhbHVlO1xuICAgICAgaWYgKGluaXRpYWxSYWRpdXMgJiYgSGVscGVycy5pc051bWJlcihpbml0aWFsUmFkaXVzKSkge1xuICAgICAgICB0aGlzLnJhZGl1cy5zZXQoaW5pdGlhbFJhZGl1cyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVSYWRpdXNJblZhbHVlcyhmb3JtR3JvdXA6IEFic3RyYWN0Q29udHJvbCwgdmFsdWVzOiBBZGRyZXNzRGF0YVtdKTogQWRkcmVzc0RhdGFbXSB7XG4gICAgcmV0dXJuIHZhbHVlcy5tYXAodmFsID0+ICh7XG4gICAgICAuLi52YWwsXG4gICAgICByYWRpdXM6IHRoaXMuaXNSYWRpdXNPcGVyYXRvclNlbGVjdGVkKGZvcm1Hcm91cCkgPyB0aGlzLmdldFJhZGl1c0RhdGEoZm9ybUdyb3VwKSA6IHVuZGVmaW5lZCxcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIGdldFJhZGl1c0RhdGEoZm9ybUdyb3VwOiBBYnN0cmFjdENvbnRyb2wpOiBBZGRyZXNzUmFkaXVzIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHRoaXMuZ2V0UmFkaXVzKGZvcm1Hcm91cCksXG4gICAgICB1bml0czogdGhpcy5yYWRpdXNVbml0cygpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGdldFJhZGl1cyhmb3JtR3JvdXA6IEFic3RyYWN0Q29udHJvbCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuaXNSYWRpdXNPcGVyYXRvclNlbGVjdGVkKGZvcm1Hcm91cCkgPyB0aGlzLnJhZGl1cygpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1JhZGl1c09wZXJhdG9yU2VsZWN0ZWQoZm9ybUdyb3VwOiBBYnN0cmFjdENvbnRyb2wpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZm9ybUdyb3VwLmdldCgnb3BlcmF0b3InKS52YWx1ZSA9PT0gJ3JhZGl1cyc7XG4gIH1cbn1cbiJdfQ==