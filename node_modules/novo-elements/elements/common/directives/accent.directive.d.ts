import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { NovoTheme } from '../theme/theme-options';
import * as i0 from "@angular/core";
export declare class AccentColorDirective {
    private el;
    private theme;
    protected cdr: ChangeDetectorRef;
    private subscription;
    accent: string;
    get hb_textColor(): string;
    constructor(el: ElementRef, theme: NovoTheme, cdr: ChangeDetectorRef);
    onDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccentColorDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AccentColorDirective, "[accent]", never, { "accent": { "alias": "accent"; "required": false; }; }, {}, never, never, false, never>;
}
