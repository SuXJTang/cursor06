import { QueryList } from '@angular/core';
import { NovoPickerToggleElement } from 'novo-elements/elements/field';
import { AbstractConditionFieldDef } from './abstract-condition.definition';
import { Operator } from '../query-builder.types';
import { NovoLabelService } from 'novo-elements/services';
import * as i0 from "@angular/core";
/**
 * Most complicated of the default conditions defs, a date needs to provide a different
 * input type depending on the operator selected.
 */
export declare class NovoDefaultDateConditionDef extends AbstractConditionFieldDef {
    overlayChildren: QueryList<NovoPickerToggleElement>;
    defaultOperator: Operator;
    constructor(labelService: NovoLabelService);
    closePanel(event: any, viewIndex: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NovoDefaultDateConditionDef, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NovoDefaultDateConditionDef, "novo-date-condition-def", never, {}, {}, never, never, false, never>;
}
