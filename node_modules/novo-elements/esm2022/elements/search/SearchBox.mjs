// NG2
import { ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, NgZone, Output, ViewChild, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
// APP
import { NovoLabelService } from 'novo-elements/services';
import { NovoOverlayTemplateComponent } from 'novo-elements/elements/common';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "novo-elements/elements/icon";
import * as i3 from "novo-elements/elements/tooltip";
import * as i4 from "novo-elements/elements/common";
// Value accessor for the component (supports ngModel)
const SEARCH_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NovoSearchBoxElement),
    multi: true,
};
export class NovoSearchBoxElement {
    constructor(element, labels, _changeDetectorRef, _zone) {
        this.element = element;
        this.labels = labels;
        this._changeDetectorRef = _changeDetectorRef;
        this._zone = _zone;
        this.icon = 'search';
        this.position = 'bottom-left';
        this.placeholder = 'Search...';
        this.alwaysOpen = false;
        this.color = 'positive';
        this.closeOnSelect = true;
        this.keepOpen = false;
        this.hasBackdrop = false;
        this.allowPropagation = false;
        this.searchChanged = new EventEmitter();
        this.applySearch = new EventEmitter();
        this.focused = false;
        /** View -> model callback called when value changes */
        this._onChange = () => { };
        /** View -> model callback called when autocomplete has been touched */
        this._onTouched = () => { };
    }
    ngOnInit() {
        if (this.overrideElement) {
            this.element = this.overrideElement;
        }
    }
    /**
     * @name showFasterFind
     * @description This function shows the picker and adds the active class (for animation)
     */
    showSearch(event, forceClose = false) {
        if (!this.panelOpen) {
            // Reset search
            // Set focus on search
            setTimeout(() => {
                const element = this.input.nativeElement;
                if (element) {
                    element.focus();
                }
            }, 10);
        }
        else {
            this.closePanel();
        }
    }
    onFocus() {
        this._zone.run(() => {
            this.focused = true;
            this.openPanel();
        });
    }
    onBlur() {
        if (!this.keepOpen || !this.panelOpen) {
            this.focused = false;
        }
    }
    onSelect() {
        if (!this.keepOpen) {
            this.closePanel();
        }
    }
    /** BEGIN: Convenient Panel Methods. */
    openPanel() {
        this.overlay.openPanel();
    }
    closePanel() {
        setTimeout(() => this.overlay.closePanel());
        this.focused = false;
    }
    get panelOpen() {
        return this.overlay && this.overlay.panelOpen;
    }
    get active() {
        return this.panelOpen || this.alwaysOpen;
    }
    /** END: Convenient Panel Methods. */
    _handleKeydown(event) {
        if ((event.key === "Escape" /* Key.Escape */ || event.key === "Enter" /* Key.Enter */ || event.key === "Tab" /* Key.Tab */) && this.panelOpen) {
            if (event.keyCode === ENTER) {
                this.applySearch.emit(event);
            }
            this.closePanel();
            if (!this.allowPropagation) {
                event.stopPropagation();
            }
        }
    }
    _handleInput(event) {
        if (document.activeElement === event.target) {
            this.value = event.target.value;
            this._onChange(event.target.value);
            if (this.debounceSearchChange) {
                clearTimeout(this.debounceSearchChange);
            }
            this.debounceSearchChange = setTimeout(() => {
                this.searchChanged.emit(event.target.value);
            }, 400);
        }
    }
    writeValue(value) {
        this._setValue(value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    _setValue(value) {
        this.value = value;
        let toDisplay = value;
        if (value && this.displayField) {
            toDisplay = value.hasOwnProperty(this.displayField) ? value[this.displayField] : value;
        }
        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
        this.displayValue = toDisplay ? toDisplay : '';
        this.input.nativeElement.value = this.displayValue;
        this._changeDetectorRef.markForCheck();
    }
    /**
     * This method closes the panel, and if a value is specified, also sets the associated
     * control to that value. It will also mark the control as dirty if this interaction
     * stemmed from the user.
     */
    setValueAndClose(event) {
        if (event && event.value) {
            this._setValue(event.value);
            this._onChange(event.value);
        }
        this.closePanel();
    }
    /**
     * Clear any previous selected option and emit a selection change event for this option
     */
    clearValue(skip) {
        this.writeValue(null);
        this._onChange(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSearchBoxElement, deps: [{ token: i0.ElementRef }, { token: i1.NovoLabelService }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoSearchBoxElement, selector: "novo-search", inputs: { name: "name", icon: "icon", position: "position", placeholder: "placeholder", alwaysOpen: "alwaysOpen", theme: "theme", color: "color", closeOnSelect: "closeOnSelect", displayField: "displayField", displayValue: "displayValue", hint: "hint", keepOpen: "keepOpen", hasBackdrop: "hasBackdrop", allowPropagation: "allowPropagation", overrideElement: "overrideElement" }, outputs: { searchChanged: "searchChanged", applySearch: "applySearch" }, host: { properties: { "class.always-open": "this.alwaysOpen", "class.focused": "this.focused", "class.active": "this.active" } }, providers: [SEARCH_VALUE_ACCESSOR], viewQueries: [{ propertyName: "overlay", first: true, predicate: NovoOverlayTemplateComponent, descendants: true }, { propertyName: "input", first: true, predicate: ["input"], descendants: true, static: true }], ngImport: i0, template: `
    <!-- SEARCH ICON -->
    <novo-icon (click)="showSearch($event)" [tooltip]="hint" tooltipPosition="bottom">{{ icon }}</novo-icon>
    <!-- SEARCH INPUT -->
    <input
      type="text"
      [attr.name]="name"
      [attr.value]="displayValue"
      [attr.placeholder]="placeholder"
      (focus)="onFocus()"
      (blur)="onBlur()"
      (keydown)="_handleKeydown($event)"
      (input)="_handleInput($event)"
      #input
      data-automation-id="novo-search-input"
    />
    <!-- SEARCH OVERLAY -->
    <novo-overlay-template
      [parent]="element"
      [closeOnSelect]="closeOnSelect"
      [position]="position"
      [hasBackdrop]="hasBackdrop"
      (select)="onSelect()"
      (closing)="onBlur()"
    >
      <ng-content></ng-content>
    </novo-overlay-template>
  `, isInline: true, styles: [":host{display:grid;grid-template-areas:\"icon input\";grid-template-columns:3.2rem 1fr;grid-template-rows:1fr;align-items:center;height:3.2rem;background:#fff;font-size:1.4rem;border:1px solid #dbdbdb;border-radius:.2rem;max-width:400px;min-width:100px;transition:all .25s ease-in-out}:host[size=small]{font-size:1rem;height:2.4rem;grid-template-columns:2.4rem 1fr}:host[size=large]{font-size:1.8rem;height:4rem;grid-template-columns:4rem 1fr}:host>button[theme][theme=fab]{width:2.8em;height:2.8em;min-height:2.8em}:host>input{height:100%;display:block;background:transparent;position:relative;color:var(--text-main);z-index:10;border:none;transition:all .25s;backface-visibility:hidden}:host>input:focus,:host>input:active{outline:none}:host novo-icon{color:var(--text-main)}:host.focused{border:1px solid var(--selection)}:host.focused>novo-icon{color:var(--selection)!important}:host.focused[color=black]>novo-icon{color:#000!important}:host.focused[color=white]>novo-icon{color:#fff!important}:host.focused[color=gray]>novo-icon{color:#9e9e9e!important}:host.focused[color=grey]>novo-icon{color:#9e9e9e!important}:host.focused[color=offWhite]>novo-icon{color:#f7f7f7!important}:host.focused[color=bright]>novo-icon{color:#f7f7f7!important}:host.focused[color=light]>novo-icon{color:#dbdbdb!important}:host.focused[color=neutral]>novo-icon{color:#4f5361!important}:host.focused[color=dark]>novo-icon{color:#3d464d!important}:host.focused[color=orange]>novo-icon{color:#ff6900!important}:host.focused[color=navigation]>novo-icon{color:#202945!important}:host.focused[color=skyBlue]>novo-icon{color:#009bdf!important}:host.focused[color=steel]>novo-icon{color:#5b6770!important}:host.focused[color=metal]>novo-icon{color:#637893!important}:host.focused[color=sand]>novo-icon{color:#f4f4f4!important}:host.focused[color=silver]>novo-icon{color:#e2e2e2!important}:host.focused[color=stone]>novo-icon{color:#bebebe!important}:host.focused[color=ash]>novo-icon{color:#a0a0a0!important}:host.focused[color=slate]>novo-icon{color:#707070!important}:host.focused[color=onyx]>novo-icon{color:#526980!important}:host.focused[color=charcoal]>novo-icon{color:#282828!important}:host.focused[color=moonlight]>novo-icon{color:#1a242f!important}:host.focused[color=midnight]>novo-icon{color:#202945!important}:host.focused[color=darkness]>novo-icon{color:#161f27!important}:host.focused[color=navy]>novo-icon{color:#0d2d42!important}:host.focused[color=aqua]>novo-icon{color:#3bafda!important}:host.focused[color=ocean]>novo-icon{color:#4a89dc!important}:host.focused[color=mint]>novo-icon{color:#37bc9b!important}:host.focused[color=grass]>novo-icon{color:#8cc152!important}:host.focused[color=sunflower]>novo-icon{color:#f6b042!important}:host.focused[color=bittersweet]>novo-icon{color:#eb6845!important}:host.focused[color=grapefruit]>novo-icon{color:#da4453!important}:host.focused[color=carnation]>novo-icon{color:#d770ad!important}:host.focused[color=lavender]>novo-icon{color:#967adc!important}:host.focused[color=mountain]>novo-icon{color:#9678b6!important}:host.focused[color=info]>novo-icon{color:#4a89dc!important}:host.focused[color=positive]>novo-icon{color:#4a89dc!important}:host.focused[color=success]>novo-icon{color:#8cc152!important}:host.focused[color=negative]>novo-icon{color:#da4453!important}:host.focused[color=danger]>novo-icon{color:#da4453!important}:host.focused[color=error]>novo-icon{color:#da4453!important}:host.focused[color=warning]>novo-icon{color:#f6b042!important}:host.focused[color=empty]>novo-icon{color:#cccdcc!important}:host.focused[color=disabled]>novo-icon{color:#bebebe!important}:host.focused[color=background]>novo-icon{color:#f7f7f7!important}:host.focused[color=backgroundDark]>novo-icon{color:#e2e2e2!important}:host.focused[color=presentation]>novo-icon{color:#5b6770!important}:host.focused[color=bullhorn]>novo-icon{color:#ff6900!important}:host.focused[color=pulse]>novo-icon{color:#3bafda!important}:host.focused[color=company]>novo-icon{color:#39d!important}:host.focused[color=candidate]>novo-icon{color:#4b7!important}:host.focused[color=lead]>novo-icon{color:#a69!important}:host.focused[color=contact]>novo-icon{color:#fa4!important}:host.focused[color=clientcontact]>novo-icon{color:#fa4!important}:host.focused[color=opportunity]>novo-icon{color:#625!important}:host.focused[color=job]>novo-icon{color:#b56!important}:host.focused[color=joborder]>novo-icon{color:#b56!important}:host.focused[color=submission]>novo-icon{color:#a9adbb!important}:host.focused[color=sendout]>novo-icon{color:#747884!important}:host.focused[color=placement]>novo-icon{color:#0b344f!important}:host.focused[color=note]>novo-icon{color:#747884!important}:host.focused[color=contract]>novo-icon{color:#454ea0!important}:host.focused[color=jobCode]>novo-icon{color:#696d79!important}:host.focused[color=earnCode]>novo-icon{color:#696d79!important}:host.focused[color=invoiceStatement]>novo-icon{color:#696d79!important}:host.focused[color=billableCharge]>novo-icon{color:#696d79!important}:host.focused[color=payableCharge]>novo-icon{color:#696d79!important}:host.focused[color=user]>novo-icon{color:#696d79!important}:host.focused[color=corporateUser]>novo-icon{color:#696d79!important}:host.focused[color=distributionList]>novo-icon{color:#696d79!important}:host.focused[color=credential]>novo-icon{color:#696d79!important}:host.focused[color=person]>novo-icon{color:#696d79!important}header novo-search.always-open:not(.focused) button{background:#ffffff40!important;color:#4a89dc40!important}header novo-search.always-open:not(.focused) input{background-color:#ffffff40!important;border-color:#ffffff40!important;color:#4a89dc40!important}header novo-search.always-open:not(.focused) input::placeholder{color:#cccdcc!important}\n"], dependencies: [{ kind: "component", type: i2.NovoIconComponent, selector: "novo-icon", inputs: ["raised", "theme", "shape", "color", "size", "smaller", "larger", "alt", "name"] }, { kind: "directive", type: i3.TooltipDirective, selector: "[tooltip]", inputs: ["tooltip", "tooltipPosition", "tooltipType", "tooltipSize", "tooltipBounce", "tooltipNoAnimate", "tooltipRounded", "tooltipAlways", "tooltipPreline", "removeTooltipArrow", "tooltipAutoPosition", "tooltipIsHTML", "tooltipCloseOnClick", "tooltipOnOverflow", "tooltipActive"] }, { kind: "component", type: i4.NovoOverlayTemplateComponent, selector: "novo-overlay-template", inputs: ["position", "scrollStrategy", "width", "minWidth", "height", "closeOnSelect", "hasBackdrop", "parent"], outputs: ["select", "opening", "closing", "backDropClicked"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSearchBoxElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-search', providers: [SEARCH_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <!-- SEARCH ICON -->
    <novo-icon (click)="showSearch($event)" [tooltip]="hint" tooltipPosition="bottom">{{ icon }}</novo-icon>
    <!-- SEARCH INPUT -->
    <input
      type="text"
      [attr.name]="name"
      [attr.value]="displayValue"
      [attr.placeholder]="placeholder"
      (focus)="onFocus()"
      (blur)="onBlur()"
      (keydown)="_handleKeydown($event)"
      (input)="_handleInput($event)"
      #input
      data-automation-id="novo-search-input"
    />
    <!-- SEARCH OVERLAY -->
    <novo-overlay-template
      [parent]="element"
      [closeOnSelect]="closeOnSelect"
      [position]="position"
      [hasBackdrop]="hasBackdrop"
      (select)="onSelect()"
      (closing)="onBlur()"
    >
      <ng-content></ng-content>
    </novo-overlay-template>
  `, styles: [":host{display:grid;grid-template-areas:\"icon input\";grid-template-columns:3.2rem 1fr;grid-template-rows:1fr;align-items:center;height:3.2rem;background:#fff;font-size:1.4rem;border:1px solid #dbdbdb;border-radius:.2rem;max-width:400px;min-width:100px;transition:all .25s ease-in-out}:host[size=small]{font-size:1rem;height:2.4rem;grid-template-columns:2.4rem 1fr}:host[size=large]{font-size:1.8rem;height:4rem;grid-template-columns:4rem 1fr}:host>button[theme][theme=fab]{width:2.8em;height:2.8em;min-height:2.8em}:host>input{height:100%;display:block;background:transparent;position:relative;color:var(--text-main);z-index:10;border:none;transition:all .25s;backface-visibility:hidden}:host>input:focus,:host>input:active{outline:none}:host novo-icon{color:var(--text-main)}:host.focused{border:1px solid var(--selection)}:host.focused>novo-icon{color:var(--selection)!important}:host.focused[color=black]>novo-icon{color:#000!important}:host.focused[color=white]>novo-icon{color:#fff!important}:host.focused[color=gray]>novo-icon{color:#9e9e9e!important}:host.focused[color=grey]>novo-icon{color:#9e9e9e!important}:host.focused[color=offWhite]>novo-icon{color:#f7f7f7!important}:host.focused[color=bright]>novo-icon{color:#f7f7f7!important}:host.focused[color=light]>novo-icon{color:#dbdbdb!important}:host.focused[color=neutral]>novo-icon{color:#4f5361!important}:host.focused[color=dark]>novo-icon{color:#3d464d!important}:host.focused[color=orange]>novo-icon{color:#ff6900!important}:host.focused[color=navigation]>novo-icon{color:#202945!important}:host.focused[color=skyBlue]>novo-icon{color:#009bdf!important}:host.focused[color=steel]>novo-icon{color:#5b6770!important}:host.focused[color=metal]>novo-icon{color:#637893!important}:host.focused[color=sand]>novo-icon{color:#f4f4f4!important}:host.focused[color=silver]>novo-icon{color:#e2e2e2!important}:host.focused[color=stone]>novo-icon{color:#bebebe!important}:host.focused[color=ash]>novo-icon{color:#a0a0a0!important}:host.focused[color=slate]>novo-icon{color:#707070!important}:host.focused[color=onyx]>novo-icon{color:#526980!important}:host.focused[color=charcoal]>novo-icon{color:#282828!important}:host.focused[color=moonlight]>novo-icon{color:#1a242f!important}:host.focused[color=midnight]>novo-icon{color:#202945!important}:host.focused[color=darkness]>novo-icon{color:#161f27!important}:host.focused[color=navy]>novo-icon{color:#0d2d42!important}:host.focused[color=aqua]>novo-icon{color:#3bafda!important}:host.focused[color=ocean]>novo-icon{color:#4a89dc!important}:host.focused[color=mint]>novo-icon{color:#37bc9b!important}:host.focused[color=grass]>novo-icon{color:#8cc152!important}:host.focused[color=sunflower]>novo-icon{color:#f6b042!important}:host.focused[color=bittersweet]>novo-icon{color:#eb6845!important}:host.focused[color=grapefruit]>novo-icon{color:#da4453!important}:host.focused[color=carnation]>novo-icon{color:#d770ad!important}:host.focused[color=lavender]>novo-icon{color:#967adc!important}:host.focused[color=mountain]>novo-icon{color:#9678b6!important}:host.focused[color=info]>novo-icon{color:#4a89dc!important}:host.focused[color=positive]>novo-icon{color:#4a89dc!important}:host.focused[color=success]>novo-icon{color:#8cc152!important}:host.focused[color=negative]>novo-icon{color:#da4453!important}:host.focused[color=danger]>novo-icon{color:#da4453!important}:host.focused[color=error]>novo-icon{color:#da4453!important}:host.focused[color=warning]>novo-icon{color:#f6b042!important}:host.focused[color=empty]>novo-icon{color:#cccdcc!important}:host.focused[color=disabled]>novo-icon{color:#bebebe!important}:host.focused[color=background]>novo-icon{color:#f7f7f7!important}:host.focused[color=backgroundDark]>novo-icon{color:#e2e2e2!important}:host.focused[color=presentation]>novo-icon{color:#5b6770!important}:host.focused[color=bullhorn]>novo-icon{color:#ff6900!important}:host.focused[color=pulse]>novo-icon{color:#3bafda!important}:host.focused[color=company]>novo-icon{color:#39d!important}:host.focused[color=candidate]>novo-icon{color:#4b7!important}:host.focused[color=lead]>novo-icon{color:#a69!important}:host.focused[color=contact]>novo-icon{color:#fa4!important}:host.focused[color=clientcontact]>novo-icon{color:#fa4!important}:host.focused[color=opportunity]>novo-icon{color:#625!important}:host.focused[color=job]>novo-icon{color:#b56!important}:host.focused[color=joborder]>novo-icon{color:#b56!important}:host.focused[color=submission]>novo-icon{color:#a9adbb!important}:host.focused[color=sendout]>novo-icon{color:#747884!important}:host.focused[color=placement]>novo-icon{color:#0b344f!important}:host.focused[color=note]>novo-icon{color:#747884!important}:host.focused[color=contract]>novo-icon{color:#454ea0!important}:host.focused[color=jobCode]>novo-icon{color:#696d79!important}:host.focused[color=earnCode]>novo-icon{color:#696d79!important}:host.focused[color=invoiceStatement]>novo-icon{color:#696d79!important}:host.focused[color=billableCharge]>novo-icon{color:#696d79!important}:host.focused[color=payableCharge]>novo-icon{color:#696d79!important}:host.focused[color=user]>novo-icon{color:#696d79!important}:host.focused[color=corporateUser]>novo-icon{color:#696d79!important}:host.focused[color=distributionList]>novo-icon{color:#696d79!important}:host.focused[color=credential]>novo-icon{color:#696d79!important}:host.focused[color=person]>novo-icon{color:#696d79!important}header novo-search.always-open:not(.focused) button{background:#ffffff40!important;color:#4a89dc40!important}header novo-search.always-open:not(.focused) input{background-color:#ffffff40!important;border-color:#ffffff40!important;color:#4a89dc40!important}header novo-search.always-open:not(.focused) input::placeholder{color:#cccdcc!important}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.NovoLabelService }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }], propDecorators: { name: [{
                type: Input
            }], icon: [{
                type: Input
            }], position: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], alwaysOpen: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.always-open']
            }], theme: [{
                type: Input
            }], color: [{
                type: Input
            }], closeOnSelect: [{
                type: Input
            }], displayField: [{
                type: Input
            }], displayValue: [{
                type: Input
            }], hint: [{
                type: Input
            }], keepOpen: [{
                type: Input
            }], hasBackdrop: [{
                type: Input
            }], allowPropagation: [{
                type: Input
            }], overrideElement: [{
                type: Input
            }], searchChanged: [{
                type: Output
            }], applySearch: [{
                type: Output
            }], focused: [{
                type: HostBinding,
                args: ['class.focused']
            }], overlay: [{
                type: ViewChild,
                args: [NovoOverlayTemplateComponent]
            }], input: [{
                type: ViewChild,
                args: ['input', { static: true }]
            }], active: [{
                type: HostBinding,
                args: ['class.active']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VhcmNoQm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvc2VhcmNoL1NlYXJjaEJveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFFLEtBQUssRUFBZSxNQUFNLHVCQUF1QixDQUFDO0FBQzNELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxNQUFNO0FBQ04sT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFMUQsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sK0JBQStCLENBQUM7Ozs7OztBQUU3RSxzREFBc0Q7QUFDdEQsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUM7SUFDbkQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBb0NGLE1BQU0sT0FBTyxvQkFBb0I7SUFxRC9CLFlBQ1MsT0FBbUIsRUFDbkIsTUFBd0IsRUFDdkIsa0JBQXFDLEVBQ3JDLEtBQWE7UUFIZCxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBQ3ZCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQXJEaEIsU0FBSSxHQUFXLFFBQVEsQ0FBQztRQUV4QixhQUFRLEdBQVcsYUFBYSxDQUFDO1FBRWpDLGdC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QUMsbUVBOEV2Qiw0QkFBNEIsK0lBNUU3Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkJUOzs0RkFHVSxvQkFBb0I7a0JBbENoQyxTQUFTOytCQUNFLGFBQWEsYUFDWixDQUFDLHFCQUFxQixDQUFDLG1CQUNqQix1QkFBdUIsQ0FBQyxNQUFNLFlBQ3JDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQlQ7bUtBS00sSUFBSTtzQkFEVixLQUFLO2dCQUdDLElBQUk7c0JBRFYsS0FBSztnQkFHQyxRQUFRO3NCQURkLEtBQUs7Z0JBR0MsV0FBVztzQkFEakIsS0FBSztnQkFJQyxVQUFVO3NCQUZoQixLQUFLOztzQkFDTCxXQUFXO3VCQUFDLG1CQUFtQjtnQkFHekIsS0FBSztzQkFEWCxLQUFLO2dCQUdDLEtBQUs7c0JBRFgsS0FBSztnQkFHQyxhQUFhO3NCQURuQixLQUFLO2dCQUdDLFlBQVk7c0JBRGxCLEtBQUs7Z0JBR0MsWUFBWTtzQkFEbEIsS0FBSztnQkFHQyxJQUFJO3NCQURWLEtBQUs7Z0JBR0MsUUFBUTtzQkFEZCxLQUFLO2dCQUdDLFdBQVc7c0JBRGpCLEtBQUs7Z0JBR0MsZ0JBQWdCO3NCQUR0QixLQUFLO2dCQUdDLGVBQWU7c0JBRHJCLEtBQUs7Z0JBR0MsYUFBYTtzQkFEbkIsTUFBTTtnQkFHQSxXQUFXO3NCQURqQixNQUFNO2dCQUdQLE9BQU87c0JBRE4sV0FBVzt1QkFBQyxlQUFlO2dCQVc1QixPQUFPO3NCQUROLFNBQVM7dUJBQUMsNEJBQTRCO2dCQUd2QyxLQUFLO3NCQURKLFNBQVM7dUJBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFnRWhDLE1BQU07c0JBRFQsV0FBVzt1QkFBQyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBFTlRFUiwgRVNDQVBFLCBUQUIgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuLy8gQVBQXG5pbXBvcnQgeyBOb3ZvTGFiZWxTZXJ2aWNlIH0gZnJvbSAnbm92by1lbGVtZW50cy9zZXJ2aWNlcyc7XG5pbXBvcnQgeyBLZXkgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3V0aWxzJztcbmltcG9ydCB7IE5vdm9PdmVybGF5VGVtcGxhdGVDb21wb25lbnQgfSBmcm9tICdub3ZvLWVsZW1lbnRzL2VsZW1lbnRzL2NvbW1vbic7XG5cbi8vIFZhbHVlIGFjY2Vzc29yIGZvciB0aGUgY29tcG9uZW50IChzdXBwb3J0cyBuZ01vZGVsKVxuY29uc3QgU0VBUkNIX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTm92b1NlYXJjaEJveEVsZW1lbnQpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25vdm8tc2VhcmNoJyxcbiAgcHJvdmlkZXJzOiBbU0VBUkNIX1ZBTFVFX0FDQ0VTU09SXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgXG4gICAgPCEtLSBTRUFSQ0ggSUNPTiAtLT5cbiAgICA8bm92by1pY29uIChjbGljayk9XCJzaG93U2VhcmNoKCRldmVudClcIiBbdG9vbHRpcF09XCJoaW50XCIgdG9vbHRpcFBvc2l0aW9uPVwiYm90dG9tXCI+e3sgaWNvbiB9fTwvbm92by1pY29uPlxuICAgIDwhLS0gU0VBUkNIIElOUFVUIC0tPlxuICAgIDxpbnB1dFxuICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgW2F0dHIubmFtZV09XCJuYW1lXCJcbiAgICAgIFthdHRyLnZhbHVlXT1cImRpc3BsYXlWYWx1ZVwiXG4gICAgICBbYXR0ci5wbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclwiXG4gICAgICAoZm9jdXMpPVwib25Gb2N1cygpXCJcbiAgICAgIChibHVyKT1cIm9uQmx1cigpXCJcbiAgICAgIChrZXlkb3duKT1cIl9oYW5kbGVLZXlkb3duKCRldmVudClcIlxuICAgICAgKGlucHV0KT1cIl9oYW5kbGVJbnB1dCgkZXZlbnQpXCJcbiAgICAgICNpbnB1dFxuICAgICAgZGF0YS1hdXRvbWF0aW9uLWlkPVwibm92by1zZWFyY2gtaW5wdXRcIlxuICAgIC8+XG4gICAgPCEtLSBTRUFSQ0ggT1ZFUkxBWSAtLT5cbiAgICA8bm92by1vdmVybGF5LXRlbXBsYXRlXG4gICAgICBbcGFyZW50XT1cImVsZW1lbnRcIlxuICAgICAgW2Nsb3NlT25TZWxlY3RdPVwiY2xvc2VPblNlbGVjdFwiXG4gICAgICBbcG9zaXRpb25dPVwicG9zaXRpb25cIlxuICAgICAgW2hhc0JhY2tkcm9wXT1cImhhc0JhY2tkcm9wXCJcbiAgICAgIChzZWxlY3QpPVwib25TZWxlY3QoKVwiXG4gICAgICAoY2xvc2luZyk9XCJvbkJsdXIoKVwiXG4gICAgPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvbm92by1vdmVybGF5LXRlbXBsYXRlPlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9TZWFyY2hCb3guc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvU2VhcmNoQm94RWxlbWVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQge1xuICBASW5wdXQoKVxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKVxuICBwdWJsaWMgaWNvbjogc3RyaW5nID0gJ3NlYXJjaCc7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBwb3NpdGlvbjogc3RyaW5nID0gJ2JvdHRvbS1sZWZ0JztcbiAgQElucHV0KClcbiAgcHVibGljIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnU2VhcmNoLi4uJztcbiAgQElucHV0KClcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5hbHdheXMtb3BlbicpXG4gIHB1YmxpYyBhbHdheXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyB0aGVtZTogc3RyaW5nO1xuICBASW5wdXQoKVxuICBwdWJsaWMgY29sb3I6IHN0cmluZyA9ICdwb3NpdGl2ZSc7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjbG9zZU9uU2VsZWN0OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KClcbiAgcHVibGljIGRpc3BsYXlGaWVsZDogc3RyaW5nO1xuICBASW5wdXQoKVxuICBwdWJsaWMgZGlzcGxheVZhbHVlOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBoaW50OiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBrZWVwT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBwdWJsaWMgaGFzQmFja2Ryb3A6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgcHVibGljIGFsbG93UHJvcGFnYXRpb246IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgcHVibGljIG92ZXJyaWRlRWxlbWVudDogRWxlbWVudFJlZjtcbiAgQE91dHB1dCgpXG4gIHB1YmxpYyBzZWFyY2hDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuICBAT3V0cHV0KClcbiAgcHVibGljIGFwcGx5U2VhcmNoOiBFdmVudEVtaXR0ZXI8S2V5Ym9hcmRFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPEtleWJvYXJkRXZlbnQ+KCk7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuZm9jdXNlZCcpXG4gIGZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIHZhbHVlOiBhbnk7XG5cbiAgLyoqIFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdmFsdWUgY2hhbmdlcyAqL1xuICBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG4gIC8qKiBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIGF1dG9jb21wbGV0ZSBoYXMgYmVlbiB0b3VjaGVkICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogRWxlbWVudCBmb3IgdGhlIHBhbmVsIGNvbnRhaW5pbmcgdGhlIGF1dG9jb21wbGV0ZSBvcHRpb25zLiAqL1xuICBAVmlld0NoaWxkKE5vdm9PdmVybGF5VGVtcGxhdGVDb21wb25lbnQpXG4gIG92ZXJsYXk6IGFueTtcbiAgQFZpZXdDaGlsZCgnaW5wdXQnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBpbnB1dDogYW55O1xuXG4gIHByaXZhdGUgZGVib3VuY2VTZWFyY2hDaGFuZ2U6IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgbGFiZWxzOiBOb3ZvTGFiZWxTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF96b25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5vdmVycmlkZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMub3ZlcnJpZGVFbGVtZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbmFtZSBzaG93RmFzdGVyRmluZFxuICAgKiBAZGVzY3JpcHRpb24gVGhpcyBmdW5jdGlvbiBzaG93cyB0aGUgcGlja2VyIGFuZCBhZGRzIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBhbmltYXRpb24pXG4gICAqL1xuICBzaG93U2VhcmNoKGV2ZW50PzogYW55LCBmb3JjZUNsb3NlOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAvLyBSZXNldCBzZWFyY2hcbiAgICAgIC8vIFNldCBmb2N1cyBvbiBzZWFyY2hcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgICB9XG4gIH1cbiAgb25Gb2N1cygpIHtcbiAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuICAgICAgdGhpcy5vcGVuUGFuZWwoKTtcbiAgICB9KTtcbiAgfVxuICBvbkJsdXIoKSB7XG4gICAgaWYgKCF0aGlzLmtlZXBPcGVuIHx8ICF0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIG9uU2VsZWN0KCkge1xuICAgIGlmICghdGhpcy5rZWVwT3Blbikge1xuICAgICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gICAgfVxuICB9XG4gIC8qKiBCRUdJTjogQ29udmVuaWVudCBQYW5lbCBNZXRob2RzLiAqL1xuICBvcGVuUGFuZWwoKTogdm9pZCB7XG4gICAgdGhpcy5vdmVybGF5Lm9wZW5QYW5lbCgpO1xuICB9XG4gIGNsb3NlUGFuZWwoKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm92ZXJsYXkuY2xvc2VQYW5lbCgpKTtcbiAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbiAgfVxuICBnZXQgcGFuZWxPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm92ZXJsYXkgJiYgdGhpcy5vdmVybGF5LnBhbmVsT3BlbjtcbiAgfVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmFjdGl2ZScpXG4gIGdldCBhY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWxPcGVuIHx8IHRoaXMuYWx3YXlzT3BlbjtcbiAgfVxuICAvKiogRU5EOiBDb252ZW5pZW50IFBhbmVsIE1ldGhvZHMuICovXG5cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoKGV2ZW50LmtleSA9PT0gS2V5LkVzY2FwZSB8fCBldmVudC5rZXkgPT09IEtleS5FbnRlciB8fCBldmVudC5rZXkgPT09IEtleS5UYWIpICYmIHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gRU5URVIpIHtcbiAgICAgICAgdGhpcy5hcHBseVNlYXJjaC5lbWl0KGV2ZW50KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xvc2VQYW5lbCgpO1xuICAgICAgaWYgKCF0aGlzLmFsbG93UHJvcGFnYXRpb24pIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIF9oYW5kbGVJbnB1dChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBldmVudC50YXJnZXQpIHtcbiAgICAgIHRoaXMudmFsdWUgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgICAgdGhpcy5fb25DaGFuZ2UoKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLmRlYm91bmNlU2VhcmNoQ2hhbmdlKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmRlYm91bmNlU2VhcmNoQ2hhbmdlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGVib3VuY2VTZWFyY2hDaGFuZ2UgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5zZWFyY2hDaGFuZ2VkLmVtaXQoKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSk7XG4gICAgICB9LCA0MDApO1xuICAgIH1cbiAgfVxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRWYWx1ZSh2YWx1ZSk7XG4gIH1cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuICBwcml2YXRlIF9zZXRWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIGxldCB0b0Rpc3BsYXkgPSB2YWx1ZTtcbiAgICBpZiAodmFsdWUgJiYgdGhpcy5kaXNwbGF5RmllbGQpIHtcbiAgICAgIHRvRGlzcGxheSA9IHZhbHVlLmhhc093blByb3BlcnR5KHRoaXMuZGlzcGxheUZpZWxkKSA/IHZhbHVlW3RoaXMuZGlzcGxheUZpZWxkXSA6IHZhbHVlO1xuICAgIH1cbiAgICAvLyBTaW1wbHkgZmFsbGluZyBiYWNrIHRvIGFuIGVtcHR5IHN0cmluZyBpZiB0aGUgZGlzcGxheSB2YWx1ZSBpcyBmYWxzeSBkb2VzIG5vdCB3b3JrIHByb3Blcmx5LlxuICAgIC8vIFRoZSBkaXNwbGF5IHZhbHVlIGNhbiBhbHNvIGJlIHRoZSBudW1iZXIgemVybyBhbmQgc2hvdWxkbid0IGZhbGwgYmFjayB0byBhbiBlbXB0eSBzdHJpbmcuXG4gICAgdGhpcy5kaXNwbGF5VmFsdWUgPSB0b0Rpc3BsYXkgPyB0b0Rpc3BsYXkgOiAnJztcbiAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLmRpc3BsYXlWYWx1ZTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBjbG9zZXMgdGhlIHBhbmVsLCBhbmQgaWYgYSB2YWx1ZSBpcyBzcGVjaWZpZWQsIGFsc28gc2V0cyB0aGUgYXNzb2NpYXRlZFxuICAgKiBjb250cm9sIHRvIHRoYXQgdmFsdWUuIEl0IHdpbGwgYWxzbyBtYXJrIHRoZSBjb250cm9sIGFzIGRpcnR5IGlmIHRoaXMgaW50ZXJhY3Rpb25cbiAgICogc3RlbW1lZCBmcm9tIHRoZSB1c2VyLlxuICAgKi9cbiAgcHVibGljIHNldFZhbHVlQW5kQ2xvc2UoZXZlbnQ6IGFueSB8IG51bGwpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQgJiYgZXZlbnQudmFsdWUpIHtcbiAgICAgIHRoaXMuX3NldFZhbHVlKGV2ZW50LnZhbHVlKTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKGV2ZW50LnZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYW55IHByZXZpb3VzIHNlbGVjdGVkIG9wdGlvbiBhbmQgZW1pdCBhIHNlbGVjdGlvbiBjaGFuZ2UgZXZlbnQgZm9yIHRoaXMgb3B0aW9uXG4gICAqL1xuICBwdWJsaWMgY2xlYXJWYWx1ZShza2lwOiBhbnkpIHtcbiAgICB0aGlzLndyaXRlVmFsdWUobnVsbCk7XG4gICAgdGhpcy5fb25DaGFuZ2UobnVsbCk7XG4gIH1cbn1cbiJdfQ==