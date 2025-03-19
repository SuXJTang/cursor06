import { ElementRef, InputSignal, OnDestroy, QueryList, Signal, WritableSignal } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { NovoPickerToggleElement } from 'novo-elements/elements/field';
import { PlacesListComponent } from 'novo-elements/elements/places';
import { NovoLabelService } from 'novo-elements/services';
import { AddressCriteriaConfig, AddressData, AddressRadiusUnitsName, Operator } from '../query-builder.types';
import { AbstractConditionFieldDef } from './abstract-condition.definition';
import * as i0 from "@angular/core";
/**
 * Handle selection of field values when a list of options is provided.
 */
export declare class NovoDefaultAddressConditionDef extends AbstractConditionFieldDef implements OnDestroy {
    overlayChildren: QueryList<NovoPickerToggleElement>;
    inputChildren: QueryList<ElementRef>;
    placesPicker: PlacesListComponent;
    addressSideTest: any;
    radiusValues: number[];
    defaultRadius: number;
    defaults: AddressCriteriaConfig;
    config: InputSignal<AddressCriteriaConfig>;
    radiusUnits: Signal<AddressRadiusUnitsName>;
    radiusEnabled: Signal<boolean>;
    radius: WritableSignal<number>;
    radiusOptions: Signal<{
        label: string;
        value: number;
    }[]>;
    defaultOperator: Operator;
    chipListModel: any;
    term: string;
    private _addressChangesSubscription;
    element: ElementRef<any>;
    constructor(labelService: NovoLabelService);
    frameAfterViewInit(): void;
    ngOnDestroy(): void;
    onKeyup(event: any, viewIndex: any): void;
    onKeydown(event: any, viewIndex: any): void;
    getValue(formGroup: AbstractControl): AddressData[];
    getCurrentOverlay(viewIndex: string): NovoPickerToggleElement;
    getCurrentInput(viewIndex: string): ElementRef;
    openPlacesList(viewIndex: any): void;
    closePlacesList(viewIndex: any): void;
    selectPlace(event: any, formGroup: AbstractControl, viewIndex: string): void;
    remove(valueToRemove: AddressData, formGroup: AbstractControl, viewIndex: string): void;
    onOperatorSelect(formGroup: UntypedFormGroup): void;
    onRadiusSelect(formGroup: AbstractControl, radius: number): void;
    private assignRadiusFromValue;
    private updateRadiusInValues;
    private getRadiusData;
    private getRadius;
    private isRadiusOperatorSelected;
    static ɵfac: i0.ɵɵFactoryDeclaration<NovoDefaultAddressConditionDef, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NovoDefaultAddressConditionDef, "novo-address-condition-def", never, { "config": { "alias": "config"; "required": false; "isSignal": true; }; }, {}, never, never, false, never>;
}
