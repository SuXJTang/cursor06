import { NovoLabelService } from 'novo-elements/services';
import { Operator } from '../query-builder.types';
import { AbstractConditionFieldDef } from './abstract-condition.definition';
import * as i0 from "@angular/core";
/**
 * Handle selection of field values when a list of options is provided.
 */
export declare class NovoDefaultPickerConditionDef extends AbstractConditionFieldDef {
    defaultOperator: Operator;
    constructor(labelService: NovoLabelService);
    static ɵfac: i0.ɵɵFactoryDeclaration<NovoDefaultPickerConditionDef, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NovoDefaultPickerConditionDef, "novo-picker-condition-def", never, {}, {}, never, never, false, never>;
}
