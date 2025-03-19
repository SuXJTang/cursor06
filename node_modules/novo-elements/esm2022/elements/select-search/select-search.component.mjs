import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostBinding, Inject, Input, Optional, Output, ViewChild, } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { delay, filter, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { isAlphaNumeric } from 'novo-elements/utils';
import { NovoOption, _countGroupLabelsBeforeOption } from 'novo-elements/elements/common';
import { NovoFieldElement } from 'novo-elements/elements/field';
import { NovoSelectElement } from 'novo-elements/elements/select';
import { NovoSelectSearchClearDirective } from './select-search-clear.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/cdk/a11y";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "novo-elements/elements/checkbox";
import * as i6 from "novo-elements/elements/button";
import * as i7 from "novo-elements/elements/common";
import * as i8 from "novo-elements/elements/icon";
import * as i9 from "novo-elements/elements/loading";
import * as i10 from "novo-elements/elements/tooltip";
import * as i11 from "novo-elements/elements/field";
import * as i12 from "novo-elements/elements/select";
/** The max height of the select's overlay panel. */
const SELECT_PANEL_MAX_HEIGHT = 256;
let autoIncrement = 1;
/* tslint:disable:member-ordering component-selector */
/**
 * Component providing an input field for searching NovoSelectElement options.
 *
 * Example usage:
 *
 * interface Bank {
 *  id: string;
 *  name: string;
 * }
 *
 * @Component({
 *   selector: 'my-app-data-selection',
 *   template: `
 *     <novo-form-field>
 *       <novo-select [formControl]="bankCtrl" placeholder="Bank">
 *         <novo-option>
 *           <ngx-novo-select-search [formControl]="bankFilterCtrl"></ngx-novo-select-search>
 *         </novo-option>
 *         <novo-option *ngFor="let bank of filteredBanks | async" [value]="bank.id">
 *           {{bank.name}}
 *         </novo-option>
 *       </novo-select>
 *     </novo-form-field>
 *   `
 * })
 * export class DataSelectionComponent implements OnInit, OnDestroy {
 *
 *   // control for the selected bank
 *   public bankCtrl: FormControl = new FormControl();
 *   // control for the NovoSelectElement filter keyword
 *   public bankFilterCtrl: FormControl = new FormControl();
 *
 *   // list of banks
 *   private banks: Bank[] = [{name: 'Bank A', id: 'A'}, {name: 'Bank B', id: 'B'}, {name: 'Bank C', id: 'C'}];
 *   // list of banks filtered by search keyword
 *   public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
 *
 *   // Subject that emits when the component has been destroyed.
 *   private _onDestroy = new Subject<void>();
 *
 *
 *   ngOnInit() {
 *     // load the initial bank list
 *     this.filteredBanks.next(this.banks.slice());
 *     // listen for search field value changes
 *     this.bankFilterCtrl.valueChanges
 *       .pipe(takeUntil(this._onDestroy))
 *       .subscribe(() => {
 *         this.filterBanks();
 *       });
 *   }
 *
 *   ngOnDestroy() {
 *     this._onDestroy.next();
 *     this._onDestroy.complete();
 *   }
 *
 *   private filterBanks() {
 *     if (!this.banks) {
 *       return;
 *     }
 *
 *     // get the search keyword
 *     let search = this.bankFilterCtrl.value;
 *     if (!search) {
 *       this.filteredBanks.next(this.banks.slice());
 *       return;
 *     } else {
 *       search = search.toLowerCase();
 *     }
 *
 *     // filter the banks
 *     this.filteredBanks.next(
 *       this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
 *     );
 *   }
 * }
 */
export class NovoSelectSearchComponent {
    get isInsideNovoOption() {
        return !!this.novoOption;
    }
    /** Current search value */
    get value() {
        return this._formControl.value;
    }
    /** Reference to the NovoSelectElement options */
    set _options(_options) {
        this._options$.next(_options);
    }
    get _options() {
        return this._options$.getValue();
    }
    constructor(novoSelect, changeDetectorRef, _viewportRuler, novoOption = null, liveAnnouncer, matFormField = null) {
        this.novoSelect = novoSelect;
        this.changeDetectorRef = changeDetectorRef;
        this._viewportRuler = _viewportRuler;
        this.novoOption = novoOption;
        this.liveAnnouncer = liveAnnouncer;
        this.matFormField = matFormField;
        this.name = 'select-search-' + autoIncrement++;
        /** Label of the search placeholder */
        this.placeholderLabel = 'Search';
        /** Type of the search input field */
        this.type = 'text';
        /** Label to be shown when no entries are found. Set to null if no message should be shown. */
        this.noEntriesFoundLabel = 'No Records Found';
        /**
         *  Text that is appended to the currently active item label announced by screen readers,
         *  informing the user of the current index, value and total options.
         *  eg: Bank R (Germany) 1 of 6
         */
        this.indexAndLengthScreenReaderText = ' of ';
        /**
         * Whether or not the search field should be cleared after the dropdown menu is closed.
         * Useful for server-side filtering.
         */
        this.clearSearchInput = true;
        /** Whether to show the search-in-progress indicator */
        this.searching = false;
        /** Disables initial focusing of the input field */
        this.disableInitialFocus = false;
        /** Enable clear input on escape pressed */
        this.enableClearOnEscapePressed = false;
        /**
         * Prevents home / end key being propagated to novo-select,
         * allowing to move the cursor within the search input instead of navigating the options
         */
        this.preventHomeEndKeyPropagation = false;
        /** Disables scrolling to active options when option list changes. Useful for server-side search */
        this.disableScrollToActiveOnOptionsChanged = false;
        /** Adds 508 screen reader support for search box */
        this.ariaLabel = 'dropdown search';
        /** Whether to show Select All Checkbox (for novo-select[multi=true]) */
        this.showToggleAllCheckbox = false;
        /** select all checkbox checked state */
        this.toggleAllCheckboxChecked = false;
        /** select all checkbox indeterminate state */
        this.toggleAllCheckboxIndeterminate = false;
        /** Display a message in a tooltip on the toggle-all checkbox */
        this.toggleAllCheckboxTooltipMessage = '';
        /** Define the position of the tooltip on the toggle-all checkbox. */
        this.toogleAllCheckboxTooltipPosition = 'below';
        /** Show/Hide the search clear button of the search input */
        this.hideClearSearchButton = false;
        /**
         * Always restore selected options on selectionChange for mode multi (e.g. for lazy loading/infinity scrolling).
         * Defaults to false, so selected options are only restored while filtering is active.
         */
        this.alwaysRestoreSelectedOptionsMulti = false;
        /** Output emitter to send to parent component with the toggle all boolean */
        this.toggleAll = new EventEmitter();
        this.onTouched = (_) => { };
        this._options$ = new BehaviorSubject(null);
        this.optionsList$ = this._options$.pipe(switchMap((_options) => _options
            ? _options.changes.pipe(map((options) => options.toArray()), startWith(_options.toArray()))
            : of(null)));
        this.optionsLength$ = this.optionsList$.pipe(map((options) => (options ? options.length : 0)));
        this._formControl = new FormControl('');
        /** whether to show the no entries found message */
        this._showNoEntriesFound$ = combineLatest([this._formControl.valueChanges, this.optionsLength$]).pipe(map(([value, optionsLength]) => this.noEntriesFoundLabel && value && optionsLength === this.getOptionsLengthOffset()));
        /** Subject that emits when the component has been destroyed. */
        this._onDestroy = new Subject();
    }
    ngOnInit() {
        // set custom panel class
        // const panelClass = 'novo-select-search-panel';
        // if (this.novoSelect.panelClass) {
        //   if (Array.isArray(this.novoSelect.panelClass)) {
        //     (<string[]>this.novoSelect.panelClass).push(panelClass);
        //   } else if (typeof this.novoSelect.panelClass === 'string') {
        //     this.novoSelect.panelClass = [this.novoSelect.panelClass, panelClass];
        //   } else if (typeof this.novoSelect.panelClass === 'object') {
        //     this.novoSelect.panelClass[panelClass] = true;
        //   }
        // } else {
        //   this.novoSelect.panelClass = panelClass;
        // }
        // set custom novo-option class if the component was placed inside a novo-option
        if (this.novoOption) {
            this.novoOption.novoInert = true;
            this.novoOption._getHostElement().classList.add('contains-novo-select-search');
        }
        else {
            console.error('<novo-select-search> must be placed inside a <novo-option> element');
        }
        // when the select dropdown panel is opened or closed
        this.novoSelect.openedChange.pipe(delay(1), takeUntil(this._onDestroy)).subscribe((opened) => {
            if (opened) {
                this.updateInputWidth();
                // focus the search field when opening
                if (!this.disableInitialFocus) {
                    this._focus();
                }
            }
            else {
                // clear it when closing
                if (this.clearSearchInput) {
                    this._reset();
                }
            }
        });
        // set the first item active after the options changed
        this.novoSelect.openedChange
            .pipe(take(1))
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
            if (this.novoSelect._keyManager) {
                this.novoSelect._keyManager.change
                    .pipe(takeUntil(this._onDestroy))
                    .subscribe(() => this.adjustScrollTopToFitActiveOptionIntoView());
            }
            else {
                console.log('_keyManager was not initialized.');
            }
            this._options = this.novoSelect.contentOptions;
            // Closure variable for tracking the most recent first option.
            // In order to avoid avoid causing the list to
            // scroll to the top when options are added to the bottom of
            // the list (eg: infinite scroll), we compare only
            // the changes to the first options to determine if we
            // should set the first item as active.
            // This prevents unnecessary scrolling to the top of the list
            // when options are appended, but allows the first item
            // in the list to be set as active by default when there
            // is no active selection
            let previousFirstOption = this._options.toArray()[this.getOptionsLengthOffset()];
            this._options.changes.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                // avoid "expression has been changed" error
                setTimeout(() => {
                    // Convert the QueryList to an array
                    const options = this._options.toArray();
                    // The true first item is offset by 1
                    const currentFirstOption = options[this.getOptionsLengthOffset()];
                    const keyManager = this.novoSelect._keyManager;
                    if (keyManager && this.novoSelect.panelOpen) {
                        // set first item active and input width
                        // Check to see if the first option in these changes is different from the previous.
                        const firstOptionIsChanged = !this.novoSelect.compareWith(previousFirstOption, currentFirstOption);
                        // CASE: The first option is different now.
                        // Indiciates we should set it as active and scroll to the top.
                        if (firstOptionIsChanged ||
                            !keyManager.activeItem ||
                            !options.find((option) => this.novoSelect.compareWith(option, keyManager.activeItem))) {
                            keyManager.setFirstItemActive();
                        }
                        // wait for panel width changes
                        setTimeout(() => {
                            this.updateInputWidth();
                        });
                        if (!this.disableScrollToActiveOnOptionsChanged) {
                            this.adjustScrollTopToFitActiveOptionIntoView();
                        }
                    }
                    // Update our reference
                    previousFirstOption = currentFirstOption;
                });
            });
        });
        // add or remove css class depending on whether to show the no entries found message
        // note: this is hacky
        this._showNoEntriesFound$.pipe(takeUntil(this._onDestroy)).subscribe((showNoEntriesFound) => {
            // set no entries found class on mat option
            if (this.novoOption) {
                if (showNoEntriesFound) {
                    this.novoOption._getHostElement().classList.add('novo-select-search-no-entries-found');
                }
                else {
                    this.novoOption._getHostElement().classList.remove('novo-select-search-no-entries-found');
                }
            }
        });
        // resize the input width when the viewport is resized, i.e. the trigger width could potentially be resized
        this._viewportRuler
            .change()
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
            if (this.novoSelect.panelOpen) {
                this.updateInputWidth();
            }
        });
        this.initMultipleHandling();
        this.optionsList$.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            // update view when available options change
            this.changeDetectorRef.markForCheck();
        });
    }
    _emitSelectAllBooleanToParent(state) {
        this.toggleAll.emit(state);
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    _isToggleAllCheckboxVisible() {
        return this.novoSelect.multiple && this.showToggleAllCheckbox;
    }
    /**
     * Handles the key down event with NovoSelectElement.
     * Allows e.g. selecting with enter key, navigation with arrow keys, etc.
     * @param event
     */
    _handleKeydown(event) {
        // Prevent propagation for all alphanumeric characters in order to avoid selection issues
        if ((event.key && event.key.length === 1) ||
            isAlphaNumeric(event.key) ||
            event.key === " " /* Key.Space */ ||
            (this.preventHomeEndKeyPropagation && (event.key === "Home" /* Key.Home */ || event.key === "End" /* Key.End */))) {
            event.stopPropagation();
        }
        if (this.novoSelect.multiple && event.key && event.key === "Enter" /* Key.Enter */) {
            // Regain focus after multiselect, so we can further type
            setTimeout(() => this._focus());
        }
        // Special case if click Escape, if input is empty, close the dropdown, if not, empty out the search field
        if (this.enableClearOnEscapePressed === true && event.key === "Escape" /* Key.Escape */ && this.value) {
            this._reset(true);
            event.stopPropagation();
        }
    }
    /**
     * Handles the key up event with NovoSelectElement.
     * Allows e.g. the announcing of the currently activeDescendant by screen readers.
     */
    _handleKeyup(event) {
        if (event.key === "ArrowUp" /* Key.ArrowUp */ || event.key === "ArrowDown" /* Key.ArrowDown */) {
            const ariaActiveDescendantId = this.novoSelect._getAriaActiveDescendant();
            const index = this._options.toArray().findIndex((item) => item.id === ariaActiveDescendantId);
            if (index !== -1) {
                const activeDescendant = this._options.toArray()[index];
                this.liveAnnouncer.announce(activeDescendant.viewValue + ' ' + this.getAriaIndex(index) + this.indexAndLengthScreenReaderText + this.getAriaLength());
            }
        }
    }
    /**
     * Calculate the index of the current option, taking the offset to length into account.
     * examples:
     *    Case 1 [Search, 1, 2, 3] will have offset of 1, due to search and will read index of total.
     *    Case 2 [1, 2, 3] will have offset of 0 and will read index +1 of total.
     */
    getAriaIndex(optionIndex) {
        if (this.getOptionsLengthOffset() === 0) {
            return optionIndex + 1;
        }
        return optionIndex;
    }
    /**
     * Calculate the length of the options, taking the offset to length into account.
     * examples:
     *    Case 1 [Search, 1, 2, 3] will have length of options.length -1, due to search.
     *    Case 2 [1, 2, 3] will have length of options.length.
     */
    getAriaLength() {
        return this._options.toArray().length - this.getOptionsLengthOffset();
    }
    writeValue(value) {
        this._lastExternalInputValue = value;
        this._formControl.setValue(value);
        this.changeDetectorRef.markForCheck();
    }
    onBlur() {
        this.onTouched();
    }
    registerOnChange(fn) {
        this._formControl.valueChanges
            .pipe(filter((value) => value !== this._lastExternalInputValue), tap(() => (this._lastExternalInputValue = undefined)), takeUntil(this._onDestroy))
            .subscribe(fn);
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Focuses the search input field
     */
    _focus() {
        if (!this.searchSelectInput || !this.novoSelect.panel) {
            return;
        }
        // save and restore scrollTop of panel, since it will be reset by focus()
        // note: this is hacky
        const panel = this.novoSelect.panel.nativeElement;
        const scrollTop = panel.scrollTop;
        // focus
        this.searchSelectInput.nativeElement.focus();
        panel.scrollTop = scrollTop;
    }
    /**
     * Resets the current search value
     * @param focus whether to focus after resetting
     */
    _reset(focus) {
        this._formControl.setValue('');
        if (focus) {
            this._focus();
        }
    }
    /**
     * Initializes handling <novo-select [multiple]="true">
     * Note: to improve this code, novo-select should be extended to allow disabling resetting the selection while filtering.
     */
    initMultipleHandling() {
        if (!this.novoSelect.ngControl) {
            if (this.novoSelect.multiple) {
                // note: the access to novoSelect.ngControl (instead of novoSelect.value / novoSelect.valueChanges)
                // is necessary to properly work in multi-selection mode.
                console.error('the novo-select containing novo-select-search must have a ngModel or formControl directive when multiple=true');
            }
            return;
        }
        // if <novo-select [multiple]="true">
        // store previously selected values and restore them when they are deselected
        // because the option is not available while we are currently filtering
        this.previousSelectedValues = this.novoSelect.ngControl.value;
        this.novoSelect.ngControl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe((values) => {
            let restoreSelectedValues = false;
            if (this.novoSelect.multiple) {
                if ((this.alwaysRestoreSelectedOptionsMulti || (this._formControl.value && this._formControl.value.length)) &&
                    this.previousSelectedValues &&
                    Array.isArray(this.previousSelectedValues)) {
                    if (!values || !Array.isArray(values)) {
                        values = [];
                    }
                    const optionValues = this.novoSelect.options.map((option) => option.value);
                    this.previousSelectedValues.forEach((previousValue) => {
                        if (!values.some((v) => this.novoSelect.compareWith(v, previousValue)) &&
                            !optionValues.some((v) => this.novoSelect.compareWith(v, previousValue))) {
                            // if a value that was selected before is deselected and not found in the options, it was deselected
                            // due to the filtering, so we restore it.
                            values.push(previousValue);
                            restoreSelectedValues = true;
                        }
                    });
                }
            }
            this.previousSelectedValues = values;
            if (restoreSelectedValues) {
                // TODO: Fix this
                // this.novoSelect._onChange(values);
            }
        });
    }
    /**
     * Scrolls the currently active option into the view if it is not yet visible.
     */
    adjustScrollTopToFitActiveOptionIntoView() {
        if (this.novoSelect.panel && this.novoSelect.contentOptions.length > 0) {
            const novoOptionHeight = this.getNovoOptionHeight();
            const activeOptionIndex = this.novoSelect._keyManager.activeItemIndex || 0;
            const labelCount = _countGroupLabelsBeforeOption(activeOptionIndex, this.novoSelect.contentOptions, this.novoSelect.optionGroups);
            // If the component is in a NovoOption, the activeItemIndex will be offset by one.
            const indexOfOptionToFitIntoView = (this.novoOption ? -1 : 0) + labelCount + activeOptionIndex;
            const currentScrollTop = this.novoSelect.panel.nativeElement.scrollTop;
            const searchInputHeight = this.innerSelectSearch.nativeElement.offsetHeight;
            const amountOfVisibleOptions = Math.floor((SELECT_PANEL_MAX_HEIGHT - searchInputHeight) / novoOptionHeight);
            const indexOfFirstVisibleOption = Math.round((currentScrollTop + searchInputHeight) / novoOptionHeight) - 1;
            if (indexOfFirstVisibleOption >= indexOfOptionToFitIntoView) {
                this.novoSelect.panel.nativeElement.scrollTop = indexOfOptionToFitIntoView * novoOptionHeight;
            }
            else if (indexOfFirstVisibleOption + amountOfVisibleOptions <= indexOfOptionToFitIntoView) {
                this.novoSelect.panel.nativeElement.scrollTop =
                    (indexOfOptionToFitIntoView + 1) * novoOptionHeight - (SELECT_PANEL_MAX_HEIGHT - searchInputHeight);
            }
        }
    }
    /**
     *  Set the width of the innerSelectSearch to fit even custom scrollbars
     *  And support all Operation Systems
     */
    updateInputWidth() {
        if (!this.innerSelectSearch || !this.innerSelectSearch.nativeElement) {
            return;
        }
        let element = this.innerSelectSearch.nativeElement;
        let panelElement;
        while ((element = element.parentElement)) {
            if (element.classList.contains('novo-select-panel')) {
                panelElement = element;
                break;
            }
        }
        if (panelElement) {
            this.innerSelectSearch.nativeElement.style.width = panelElement.clientWidth + 'px';
        }
    }
    getNovoOptionHeight() {
        if (this.novoSelect.contentOptions.length > 0) {
            return this.novoSelect.contentOptions.first._getHostElement().getBoundingClientRect().height;
        }
        return 0;
    }
    /**
     * Determine the offset to length that can be caused by the optional novoOption used as a search input.
     */
    getOptionsLengthOffset() {
        if (this.novoOption) {
            return 1;
        }
        else {
            return 0;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSelectSearchComponent, deps: [{ token: NovoSelectElement }, { token: i0.ChangeDetectorRef }, { token: i1.ViewportRuler }, { token: NovoOption, optional: true }, { token: i2.LiveAnnouncer }, { token: NovoFieldElement, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoSelectSearchComponent, selector: "novo-select-search", inputs: { name: "name", placeholderLabel: "placeholderLabel", type: "type", noEntriesFoundLabel: "noEntriesFoundLabel", indexAndLengthScreenReaderText: "indexAndLengthScreenReaderText", clearSearchInput: "clearSearchInput", searching: "searching", disableInitialFocus: "disableInitialFocus", enableClearOnEscapePressed: "enableClearOnEscapePressed", preventHomeEndKeyPropagation: "preventHomeEndKeyPropagation", disableScrollToActiveOnOptionsChanged: "disableScrollToActiveOnOptionsChanged", ariaLabel: "ariaLabel", showToggleAllCheckbox: "showToggleAllCheckbox", toggleAllCheckboxChecked: "toggleAllCheckboxChecked", toggleAllCheckboxIndeterminate: "toggleAllCheckboxIndeterminate", toggleAllCheckboxTooltipMessage: "toggleAllCheckboxTooltipMessage", toogleAllCheckboxTooltipPosition: "toogleAllCheckboxTooltipPosition", hideClearSearchButton: "hideClearSearchButton", alwaysRestoreSelectedOptionsMulti: "alwaysRestoreSelectedOptionsMulti" }, outputs: { toggleAll: "toggleAll" }, host: { properties: { "class.novo-select-search-inside-novo-option": "this.isInsideNovoOption" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => NovoSelectSearchComponent),
                multi: true,
            },
        ], queries: [{ propertyName: "clearIcon", first: true, predicate: NovoSelectSearchClearDirective, descendants: true }], viewQueries: [{ propertyName: "searchSelectInput", first: true, predicate: ["searchSelectInput"], descendants: true, read: ElementRef, static: true }, { propertyName: "innerSelectSearch", first: true, predicate: ["innerSelectSearch"], descendants: true, read: ElementRef, static: true }], ngImport: i0, template: "<novo-field\n  #innerSelectSearch\n  class=\"novo-select-search-inner\"\n  [ngClass]=\"{'novo-select-search-inner-multiple': novoSelect.multiple, 'novo-select-search-inner-toggle-all': _isToggleAllCheckboxVisible() }\">\n\n  <novo-checkbox *ngIf=\"_isToggleAllCheckboxVisible()\"\n    novoPrefix\n    [color]=\"'primary'\"\n    class=\"novo-select-search-toggle-all-checkbox\"\n    [checked]=\"toggleAllCheckboxChecked\"\n    [indeterminate]=\"toggleAllCheckboxIndeterminate\"\n    [tooltip]=\"toggleAllCheckboxTooltipMessage\"\n    tooltipClass=\"ngx-novo-select-search-toggle-all-tooltip\"\n    [tooltipPosition]=\"toogleAllCheckboxTooltipPosition\"\n    (change)=\"_emitSelectAllBooleanToParent($event.checked)\"></novo-checkbox>\n\n  <novo-icon\n    novoPrefix\n    class=\"novo-select-search-icon\">search</novo-icon>\n\n  <input class=\"novo-select-search-input\"\n    #searchSelectInput\n    novoInput\n    [name]=\"name\"\n    autocomplete=\"off\"\n    [type]=\"type\"\n    [formControl]=\"_formControl\"\n    (keydown)=\"_handleKeydown($event)\"\n    (keyup)=\"_handleKeyup($event)\"\n    (blur)=\"onBlur()\"\n    [placeholder]=\"placeholderLabel\"\n    [attr.aria-label]=\"ariaLabel\" />\n\n  <novo-spinner *ngIf=\"searching\"\n    novoSuffix\n    class=\"novo-select-search-spinner\"\n    diameter=\"16\"></novo-spinner>\n\n  <novo-button\n    novoSuffix\n    *ngIf=\"!hideClearSearchButton && value && !searching\"\n    aria-label=\"Clear\"\n    (click)=\"_reset(true)\"\n    theme=\"icon\"\n    size=\"small\"\n    class=\"novo-select-search-clear\">\n    <ng-content *ngIf=\"clearIcon; else defaultIcon\" select=\"[novoSelectSearchClear]\"></ng-content>\n    <ng-template #defaultIcon>\n      <novo-icon>close</novo-icon>\n    </ng-template>\n  </novo-button>\n\n  <ng-content select=\".novo-select-search-custom-header-content\"></ng-content>\n\n</novo-field>\n\n<div *ngIf=\"_showNoEntriesFound$ | async\"\n  class=\"novo-select-search-no-entries-found\">\n  {{noEntriesFoundLabel}}\n</div>", styles: [":host{display:block;width:100%}.novo-select-search-hidden{visibility:hidden}.novo-select-search-inner{width:100%;background-color:var(--background-bright);-webkit-transform:translate3d(0,0,0)}.novo-select-search-inner.novo-select-search-inner-multiple{width:100%}.novo-select-search-inner.novo-select-search-inner-multiple.novo-select-search-inner-toggle-all{display:flex;align-items:center}.novo-select-search-icon{padding:var(--spacing-md)}::ng-deep .novo-select-search-panel{transform:none!important;overflow-x:hidden}.novo-select-search-no-entries-found{padding:16px}:host.novo-select-search-inside-novo-option .novo-select-search-input{padding-top:0;padding-bottom:0;height:3.6rem;line-height:3.6rem}:host.novo-select-search-inside-novo-option .novo-select-search-clear{top:6px}:host.novo-select-search-inside-novo-option .novo-select-search-icon-prefix{left:16px;top:7px}::ng-deep .novo-option.contains-novo-select-search{padding:0!important;border:none}::ng-deep .novo-option.contains-novo-select-search .novo-icon{margin-right:0;margin-left:0}::ng-deep .novo-option.contains-novo-select-search .novo-option-pseudo-checkbox{display:none}.novo-select-search-toggle-all-checkbox{padding-left:16px;padding-bottom:2px}:host-context([dir=rtl]) .novo-select-search-toggle-all-checkbox{padding-left:0;padding-right:16px}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: i5.NovoCheckboxElement, selector: "novo-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "id", "name", "label", "disabled", "layoutOptions", "color", "value", "tabIndex", "required", "checked", "indeterminate"], outputs: ["change", "indeterminateChange", "onSelect"] }, { kind: "component", type: i6.NovoButtonElement, selector: "novo-button,button[theme]", inputs: ["color", "side", "size", "theme", "loading", "icon", "secondIcon", "disabled"] }, { kind: "directive", type: i7.ThemeColorDirective, selector: "[theme]", inputs: ["theme"] }, { kind: "component", type: i8.NovoIconComponent, selector: "novo-icon", inputs: ["raised", "theme", "shape", "color", "size", "smaller", "larger", "alt", "name"] }, { kind: "component", type: i9.NovoSpinnerElement, selector: "novo-spinner", inputs: ["theme", "color", "size", "inverse"] }, { kind: "directive", type: i10.TooltipDirective, selector: "[tooltip]", inputs: ["tooltip", "tooltipPosition", "tooltipType", "tooltipSize", "tooltipBounce", "tooltipNoAnimate", "tooltipRounded", "tooltipAlways", "tooltipPreline", "removeTooltipArrow", "tooltipAutoPosition", "tooltipIsHTML", "tooltipCloseOnClick", "tooltipOnOverflow", "tooltipActive"] }, { kind: "component", type: i11.NovoFieldElement, selector: "novo-field", inputs: ["layout", "appearance", "customOverlayOrigin", "width"], outputs: ["valueChanges", "stateChanges"] }, { kind: "directive", type: i11.NovoInput, selector: "input[novoInput], textarea[novoInput], select[novoInput]", inputs: ["disabled", "id", "placeholder", "required", "type", "value", "readonly"] }, { kind: "directive", type: i11.NovoFieldPrefixDirective, selector: "[novoPrefix]" }, { kind: "directive", type: i11.NovoFieldSuffixDirective, selector: "[novoSuffix]" }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSelectSearchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'novo-select-search', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => NovoSelectSearchComponent),
                            multi: true,
                        },
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<novo-field\n  #innerSelectSearch\n  class=\"novo-select-search-inner\"\n  [ngClass]=\"{'novo-select-search-inner-multiple': novoSelect.multiple, 'novo-select-search-inner-toggle-all': _isToggleAllCheckboxVisible() }\">\n\n  <novo-checkbox *ngIf=\"_isToggleAllCheckboxVisible()\"\n    novoPrefix\n    [color]=\"'primary'\"\n    class=\"novo-select-search-toggle-all-checkbox\"\n    [checked]=\"toggleAllCheckboxChecked\"\n    [indeterminate]=\"toggleAllCheckboxIndeterminate\"\n    [tooltip]=\"toggleAllCheckboxTooltipMessage\"\n    tooltipClass=\"ngx-novo-select-search-toggle-all-tooltip\"\n    [tooltipPosition]=\"toogleAllCheckboxTooltipPosition\"\n    (change)=\"_emitSelectAllBooleanToParent($event.checked)\"></novo-checkbox>\n\n  <novo-icon\n    novoPrefix\n    class=\"novo-select-search-icon\">search</novo-icon>\n\n  <input class=\"novo-select-search-input\"\n    #searchSelectInput\n    novoInput\n    [name]=\"name\"\n    autocomplete=\"off\"\n    [type]=\"type\"\n    [formControl]=\"_formControl\"\n    (keydown)=\"_handleKeydown($event)\"\n    (keyup)=\"_handleKeyup($event)\"\n    (blur)=\"onBlur()\"\n    [placeholder]=\"placeholderLabel\"\n    [attr.aria-label]=\"ariaLabel\" />\n\n  <novo-spinner *ngIf=\"searching\"\n    novoSuffix\n    class=\"novo-select-search-spinner\"\n    diameter=\"16\"></novo-spinner>\n\n  <novo-button\n    novoSuffix\n    *ngIf=\"!hideClearSearchButton && value && !searching\"\n    aria-label=\"Clear\"\n    (click)=\"_reset(true)\"\n    theme=\"icon\"\n    size=\"small\"\n    class=\"novo-select-search-clear\">\n    <ng-content *ngIf=\"clearIcon; else defaultIcon\" select=\"[novoSelectSearchClear]\"></ng-content>\n    <ng-template #defaultIcon>\n      <novo-icon>close</novo-icon>\n    </ng-template>\n  </novo-button>\n\n  <ng-content select=\".novo-select-search-custom-header-content\"></ng-content>\n\n</novo-field>\n\n<div *ngIf=\"_showNoEntriesFound$ | async\"\n  class=\"novo-select-search-no-entries-found\">\n  {{noEntriesFoundLabel}}\n</div>", styles: [":host{display:block;width:100%}.novo-select-search-hidden{visibility:hidden}.novo-select-search-inner{width:100%;background-color:var(--background-bright);-webkit-transform:translate3d(0,0,0)}.novo-select-search-inner.novo-select-search-inner-multiple{width:100%}.novo-select-search-inner.novo-select-search-inner-multiple.novo-select-search-inner-toggle-all{display:flex;align-items:center}.novo-select-search-icon{padding:var(--spacing-md)}::ng-deep .novo-select-search-panel{transform:none!important;overflow-x:hidden}.novo-select-search-no-entries-found{padding:16px}:host.novo-select-search-inside-novo-option .novo-select-search-input{padding-top:0;padding-bottom:0;height:3.6rem;line-height:3.6rem}:host.novo-select-search-inside-novo-option .novo-select-search-clear{top:6px}:host.novo-select-search-inside-novo-option .novo-select-search-icon-prefix{left:16px;top:7px}::ng-deep .novo-option.contains-novo-select-search{padding:0!important;border:none}::ng-deep .novo-option.contains-novo-select-search .novo-icon{margin-right:0;margin-left:0}::ng-deep .novo-option.contains-novo-select-search .novo-option-pseudo-checkbox{display:none}.novo-select-search-toggle-all-checkbox{padding-left:16px;padding-bottom:2px}:host-context([dir=rtl]) .novo-select-search-toggle-all-checkbox{padding-left:0;padding-right:16px}\n"] }]
        }], ctorParameters: () => [{ type: i12.NovoSelectElement, decorators: [{
                    type: Inject,
                    args: [NovoSelectElement]
                }] }, { type: i0.ChangeDetectorRef }, { type: i1.ViewportRuler }, { type: i7.NovoOption, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NovoOption]
                }] }, { type: i2.LiveAnnouncer }, { type: i11.NovoFieldElement, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NovoFieldElement]
                }] }], propDecorators: { name: [{
                type: Input
            }], placeholderLabel: [{
                type: Input
            }], type: [{
                type: Input
            }], noEntriesFoundLabel: [{
                type: Input
            }], indexAndLengthScreenReaderText: [{
                type: Input
            }], clearSearchInput: [{
                type: Input
            }], searching: [{
                type: Input
            }], disableInitialFocus: [{
                type: Input
            }], enableClearOnEscapePressed: [{
                type: Input
            }], preventHomeEndKeyPropagation: [{
                type: Input
            }], disableScrollToActiveOnOptionsChanged: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], showToggleAllCheckbox: [{
                type: Input
            }], toggleAllCheckboxChecked: [{
                type: Input
            }], toggleAllCheckboxIndeterminate: [{
                type: Input
            }], toggleAllCheckboxTooltipMessage: [{
                type: Input
            }], toogleAllCheckboxTooltipPosition: [{
                type: Input
            }], hideClearSearchButton: [{
                type: Input
            }], alwaysRestoreSelectedOptionsMulti: [{
                type: Input
            }], toggleAll: [{
                type: Output
            }], searchSelectInput: [{
                type: ViewChild,
                args: ['searchSelectInput', { read: ElementRef, static: true }]
            }], innerSelectSearch: [{
                type: ViewChild,
                args: ['innerSelectSearch', { read: ElementRef, static: true }]
            }], clearIcon: [{
                type: ContentChild,
                args: [NovoSelectSearchClearDirective, { static: false }]
            }], isInsideNovoOption: [{
                type: HostBinding,
                args: ['class.novo-select-search-inside-novo-option']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXNlYXJjaC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9zZWxlY3Qtc2VhcmNoL3NlbGVjdC1zZWFyY2guY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvc2VsZWN0LXNlYXJjaC9zZWxlY3Qtc2VhcmNoLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUVOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3RGLE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0UsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRyxPQUFPLEVBQUUsY0FBYyxFQUFPLE1BQU0scUJBQXFCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSw2QkFBNkIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzFGLE9BQU8sRUFBRSxnQkFB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QXFDO3NCQUE3QyxLQUFLO2dCQUdHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBR0cscUJBQXFCO3NCQUE3QixLQUFLO2dCQUdHLHdCQUF3QjtzQkFBaEMsS0FBSztnQkFHRyw4QkFBOEI7c0JBQXRDLEtBQUs7Z0JBR0csK0JBQStCO3NCQUF2QyxLQUFLO2dCQUdHLGdDQUFnQztzQkFBeEMsS0FBSztnQkFHRyxxQkFBcUI7c0JBQTdCLEtBQUs7Z0JBTUcsaUNBQWlDO3NCQUF6QyxLQUFLO2dCQUdJLFNBQVM7c0JBQWxCLE1BQU07Z0JBRzZELGlCQUFpQjtzQkFBcEYsU0FBUzt1QkFBQyxtQkFBbUIsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFHRSxpQkFBaUI7c0JBQXBGLFNBQVM7dUJBQUMsbUJBQW1CLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBR0QsU0FBUztzQkFBekUsWUFBWTt1QkFBQyw4QkFBOEIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0JBRzNELGtCQUFrQjtzQkFEckIsV0FBVzt1QkFBQyw2Q0FBNkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMaXZlQW5ub3VuY2VyIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgVmlld3BvcnRSdWxlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3JtQ29udHJvbCwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIG9mLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWxheSwgZmlsdGVyLCBtYXAsIHN0YXJ0V2l0aCwgc3dpdGNoTWFwLCB0YWtlLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzQWxwaGFOdW1lcmljLCBLZXkgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3V0aWxzJztcbmltcG9ydCB7IE5vdm9PcHRpb24sIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uIH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy9jb21tb24nO1xuaW1wb3J0IHsgTm92b0ZpZWxkRWxlbWVudCB9IGZyb20gJ25vdm8tZWxlbWVudHMvZWxlbWVudHMvZmllbGQnO1xuaW1wb3J0IHsgTm92b1NlbGVjdEVsZW1lbnQgfSBmcm9tICdub3ZvLWVsZW1lbnRzL2VsZW1lbnRzL3NlbGVjdCc7XG5pbXBvcnQgeyBOb3ZvU2VsZWN0U2VhcmNoQ2xlYXJEaXJlY3RpdmUgfSBmcm9tICcuL3NlbGVjdC1zZWFyY2gtY2xlYXIuZGlyZWN0aXZlJztcblxuLyoqIFRoZSBtYXggaGVpZ2h0IG9mIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsLiAqL1xuY29uc3QgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQgPSAyNTY7XG5sZXQgYXV0b0luY3JlbWVudCA9IDE7XG4vKiB0c2xpbnQ6ZGlzYWJsZTptZW1iZXItb3JkZXJpbmcgY29tcG9uZW50LXNlbGVjdG9yICovXG4vKipcbiAqIENvbXBvbmVudCBwcm92aWRpbmcgYW4gaW5wdXQgZmllbGQgZm9yIHNlYXJjaGluZyBOb3ZvU2VsZWN0RWxlbWVudCBvcHRpb25zLlxuICpcbiAqIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogaW50ZXJmYWNlIEJhbmsge1xuICogIGlkOiBzdHJpbmc7XG4gKiAgbmFtZTogc3RyaW5nO1xuICogfVxuICpcbiAqIEBDb21wb25lbnQoe1xuICogICBzZWxlY3RvcjogJ215LWFwcC1kYXRhLXNlbGVjdGlvbicsXG4gKiAgIHRlbXBsYXRlOiBgXG4gKiAgICAgPG5vdm8tZm9ybS1maWVsZD5cbiAqICAgICAgIDxub3ZvLXNlbGVjdCBbZm9ybUNvbnRyb2xdPVwiYmFua0N0cmxcIiBwbGFjZWhvbGRlcj1cIkJhbmtcIj5cbiAqICAgICAgICAgPG5vdm8tb3B0aW9uPlxuICogICAgICAgICAgIDxuZ3gtbm92by1zZWxlY3Qtc2VhcmNoIFtmb3JtQ29udHJvbF09XCJiYW5rRmlsdGVyQ3RybFwiPjwvbmd4LW5vdm8tc2VsZWN0LXNlYXJjaD5cbiAqICAgICAgICAgPC9ub3ZvLW9wdGlvbj5cbiAqICAgICAgICAgPG5vdm8tb3B0aW9uICpuZ0Zvcj1cImxldCBiYW5rIG9mIGZpbHRlcmVkQmFua3MgfCBhc3luY1wiIFt2YWx1ZV09XCJiYW5rLmlkXCI+XG4gKiAgICAgICAgICAge3tiYW5rLm5hbWV9fVxuICogICAgICAgICA8L25vdm8tb3B0aW9uPlxuICogICAgICAgPC9ub3ZvLXNlbGVjdD5cbiAqICAgICA8L25vdm8tZm9ybS1maWVsZD5cbiAqICAgYFxuICogfSlcbiAqIGV4cG9ydCBjbGFzcyBEYXRhU2VsZWN0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICpcbiAqICAgLy8gY29udHJvbCBmb3IgdGhlIHNlbGVjdGVkIGJhbmtcbiAqICAgcHVibGljIGJhbmtDdHJsOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICogICAvLyBjb250cm9sIGZvciB0aGUgTm92b1NlbGVjdEVsZW1lbnQgZmlsdGVyIGtleXdvcmRcbiAqICAgcHVibGljIGJhbmtGaWx0ZXJDdHJsOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICpcbiAqICAgLy8gbGlzdCBvZiBiYW5rc1xuICogICBwcml2YXRlIGJhbmtzOiBCYW5rW10gPSBbe25hbWU6ICdCYW5rIEEnLCBpZDogJ0EnfSwge25hbWU6ICdCYW5rIEInLCBpZDogJ0InfSwge25hbWU6ICdCYW5rIEMnLCBpZDogJ0MnfV07XG4gKiAgIC8vIGxpc3Qgb2YgYmFua3MgZmlsdGVyZWQgYnkgc2VhcmNoIGtleXdvcmRcbiAqICAgcHVibGljIGZpbHRlcmVkQmFua3M6IFJlcGxheVN1YmplY3Q8QmFua1tdPiA9IG5ldyBSZXBsYXlTdWJqZWN0PEJhbmtbXT4oMSk7XG4gKlxuICogICAvLyBTdWJqZWN0IHRoYXQgZW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC5cbiAqICAgcHJpdmF0ZSBfb25EZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAqXG4gKlxuICogICBuZ09uSW5pdCgpIHtcbiAqICAgICAvLyBsb2FkIHRoZSBpbml0aWFsIGJhbmsgbGlzdFxuICogICAgIHRoaXMuZmlsdGVyZWRCYW5rcy5uZXh0KHRoaXMuYmFua3Muc2xpY2UoKSk7XG4gKiAgICAgLy8gbGlzdGVuIGZvciBzZWFyY2ggZmllbGQgdmFsdWUgY2hhbmdlc1xuICogICAgIHRoaXMuYmFua0ZpbHRlckN0cmwudmFsdWVDaGFuZ2VzXG4gKiAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSlcbiAqICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICogICAgICAgICB0aGlzLmZpbHRlckJhbmtzKCk7XG4gKiAgICAgICB9KTtcbiAqICAgfVxuICpcbiAqICAgbmdPbkRlc3Ryb3koKSB7XG4gKiAgICAgdGhpcy5fb25EZXN0cm95Lm5leHQoKTtcbiAqICAgICB0aGlzLl9vbkRlc3Ryb3kuY29tcGxldGUoKTtcbiAqICAgfVxuICpcbiAqICAgcHJpdmF0ZSBmaWx0ZXJCYW5rcygpIHtcbiAqICAgICBpZiAoIXRoaXMuYmFua3MpIHtcbiAqICAgICAgIHJldHVybjtcbiAqICAgICB9XG4gKlxuICogICAgIC8vIGdldCB0aGUgc2VhcmNoIGtleXdvcmRcbiAqICAgICBsZXQgc2VhcmNoID0gdGhpcy5iYW5rRmlsdGVyQ3RybC52YWx1ZTtcbiAqICAgICBpZiAoIXNlYXJjaCkge1xuICogICAgICAgdGhpcy5maWx0ZXJlZEJhbmtzLm5leHQodGhpcy5iYW5rcy5zbGljZSgpKTtcbiAqICAgICAgIHJldHVybjtcbiAqICAgICB9IGVsc2Uge1xuICogICAgICAgc2VhcmNoID0gc2VhcmNoLnRvTG93ZXJDYXNlKCk7XG4gKiAgICAgfVxuICpcbiAqICAgICAvLyBmaWx0ZXIgdGhlIGJhbmtzXG4gKiAgICAgdGhpcy5maWx0ZXJlZEJhbmtzLm5leHQoXG4gKiAgICAgICB0aGlzLmJhbmtzLmZpbHRlcihiYW5rID0+IGJhbmsubmFtZS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSA+IC0xKVxuICogICAgICk7XG4gKiAgIH1cbiAqIH1cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1zZWxlY3Qtc2VhcmNoJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NlbGVjdC1zZWFyY2guY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zZWxlY3Qtc2VhcmNoLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTm92b1NlbGVjdFNlYXJjaENvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTm92b1NlbGVjdFNlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpIG5hbWUgPSAnc2VsZWN0LXNlYXJjaC0nICsgYXV0b0luY3JlbWVudCsrO1xuICAvKiogTGFiZWwgb2YgdGhlIHNlYXJjaCBwbGFjZWhvbGRlciAqL1xuICBASW5wdXQoKSBwbGFjZWhvbGRlckxhYmVsID0gJ1NlYXJjaCc7XG5cbiAgLyoqIFR5cGUgb2YgdGhlIHNlYXJjaCBpbnB1dCBmaWVsZCAqL1xuICBASW5wdXQoKSB0eXBlID0gJ3RleHQnO1xuXG4gIC8qKiBMYWJlbCB0byBiZSBzaG93biB3aGVuIG5vIGVudHJpZXMgYXJlIGZvdW5kLiBTZXQgdG8gbnVsbCBpZiBubyBtZXNzYWdlIHNob3VsZCBiZSBzaG93bi4gKi9cbiAgQElucHV0KCkgbm9FbnRyaWVzRm91bmRMYWJlbCA9ICdObyBSZWNvcmRzIEZvdW5kJztcblxuICAvKipcbiAgICogIFRleHQgdGhhdCBpcyBhcHBlbmRlZCB0byB0aGUgY3VycmVudGx5IGFjdGl2ZSBpdGVtIGxhYmVsIGFubm91bmNlZCBieSBzY3JlZW4gcmVhZGVycyxcbiAgICogIGluZm9ybWluZyB0aGUgdXNlciBvZiB0aGUgY3VycmVudCBpbmRleCwgdmFsdWUgYW5kIHRvdGFsIG9wdGlvbnMuXG4gICAqICBlZzogQmFuayBSIChHZXJtYW55KSAxIG9mIDZcbiAgICovXG4gIEBJbnB1dCgpIGluZGV4QW5kTGVuZ3RoU2NyZWVuUmVhZGVyVGV4dCA9ICcgb2YgJztcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIHNlYXJjaCBmaWVsZCBzaG91bGQgYmUgY2xlYXJlZCBhZnRlciB0aGUgZHJvcGRvd24gbWVudSBpcyBjbG9zZWQuXG4gICAqIFVzZWZ1bCBmb3Igc2VydmVyLXNpZGUgZmlsdGVyaW5nLlxuICAgKi9cbiAgQElucHV0KCkgY2xlYXJTZWFyY2hJbnB1dCA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgdG8gc2hvdyB0aGUgc2VhcmNoLWluLXByb2dyZXNzIGluZGljYXRvciAqL1xuICBASW5wdXQoKSBzZWFyY2hpbmcgPSBmYWxzZTtcblxuICAvKiogRGlzYWJsZXMgaW5pdGlhbCBmb2N1c2luZyBvZiB0aGUgaW5wdXQgZmllbGQgKi9cbiAgQElucHV0KCkgZGlzYWJsZUluaXRpYWxGb2N1cyA9IGZhbHNlO1xuXG4gIC8qKiBFbmFibGUgY2xlYXIgaW5wdXQgb24gZXNjYXBlIHByZXNzZWQgKi9cbiAgQElucHV0KCkgZW5hYmxlQ2xlYXJPbkVzY2FwZVByZXNzZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJldmVudHMgaG9tZSAvIGVuZCBrZXkgYmVpbmcgcHJvcGFnYXRlZCB0byBub3ZvLXNlbGVjdCxcbiAgICogYWxsb3dpbmcgdG8gbW92ZSB0aGUgY3Vyc29yIHdpdGhpbiB0aGUgc2VhcmNoIGlucHV0IGluc3RlYWQgb2YgbmF2aWdhdGluZyB0aGUgb3B0aW9uc1xuICAgKi9cbiAgQElucHV0KCkgcHJldmVudEhvbWVFbmRLZXlQcm9wYWdhdGlvbiA9IGZhbHNlO1xuXG4gIC8qKiBEaXNhYmxlcyBzY3JvbGxpbmcgdG8gYWN0aXZlIG9wdGlvbnMgd2hlbiBvcHRpb24gbGlzdCBjaGFuZ2VzLiBVc2VmdWwgZm9yIHNlcnZlci1zaWRlIHNlYXJjaCAqL1xuICBASW5wdXQoKSBkaXNhYmxlU2Nyb2xsVG9BY3RpdmVPbk9wdGlvbnNDaGFuZ2VkID0gZmFsc2U7XG5cbiAgLyoqIEFkZHMgNTA4IHNjcmVlbiByZWFkZXIgc3VwcG9ydCBmb3Igc2VhcmNoIGJveCAqL1xuICBASW5wdXQoKSBhcmlhTGFiZWwgPSAnZHJvcGRvd24gc2VhcmNoJztcblxuICAvKiogV2hldGhlciB0byBzaG93IFNlbGVjdCBBbGwgQ2hlY2tib3ggKGZvciBub3ZvLXNlbGVjdFttdWx0aT10cnVlXSkgKi9cbiAgQElucHV0KCkgc2hvd1RvZ2dsZUFsbENoZWNrYm94ID0gZmFsc2U7XG5cbiAgLyoqIHNlbGVjdCBhbGwgY2hlY2tib3ggY2hlY2tlZCBzdGF0ZSAqL1xuICBASW5wdXQoKSB0b2dnbGVBbGxDaGVja2JveENoZWNrZWQgPSBmYWxzZTtcblxuICAvKiogc2VsZWN0IGFsbCBjaGVja2JveCBpbmRldGVybWluYXRlIHN0YXRlICovXG4gIEBJbnB1dCgpIHRvZ2dsZUFsbENoZWNrYm94SW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBEaXNwbGF5IGEgbWVzc2FnZSBpbiBhIHRvb2x0aXAgb24gdGhlIHRvZ2dsZS1hbGwgY2hlY2tib3ggKi9cbiAgQElucHV0KCkgdG9nZ2xlQWxsQ2hlY2tib3hUb29sdGlwTWVzc2FnZSA9ICcnO1xuXG4gIC8qKiBEZWZpbmUgdGhlIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIG9uIHRoZSB0b2dnbGUtYWxsIGNoZWNrYm94LiAqL1xuICBASW5wdXQoKSB0b29nbGVBbGxDaGVja2JveFRvb2x0aXBQb3NpdGlvbjogJ2xlZnQnIHwgJ3JpZ2h0JyB8ICdhYm92ZScgfCAnYmVsb3cnIHwgJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2JlbG93JztcblxuICAvKiogU2hvdy9IaWRlIHRoZSBzZWFyY2ggY2xlYXIgYnV0dG9uIG9mIHRoZSBzZWFyY2ggaW5wdXQgKi9cbiAgQElucHV0KCkgaGlkZUNsZWFyU2VhcmNoQnV0dG9uID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEFsd2F5cyByZXN0b3JlIHNlbGVjdGVkIG9wdGlvbnMgb24gc2VsZWN0aW9uQ2hhbmdlIGZvciBtb2RlIG11bHRpIChlLmcuIGZvciBsYXp5IGxvYWRpbmcvaW5maW5pdHkgc2Nyb2xsaW5nKS5cbiAgICogRGVmYXVsdHMgdG8gZmFsc2UsIHNvIHNlbGVjdGVkIG9wdGlvbnMgYXJlIG9ubHkgcmVzdG9yZWQgd2hpbGUgZmlsdGVyaW5nIGlzIGFjdGl2ZS5cbiAgICovXG4gIEBJbnB1dCgpIGFsd2F5c1Jlc3RvcmVTZWxlY3RlZE9wdGlvbnNNdWx0aSA9IGZhbHNlO1xuXG4gIC8qKiBPdXRwdXQgZW1pdHRlciB0byBzZW5kIHRvIHBhcmVudCBjb21wb25lbnQgd2l0aCB0aGUgdG9nZ2xlIGFsbCBib29sZWFuICovXG4gIEBPdXRwdXQoKSB0b2dnbGVBbGwgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgc2VhcmNoIGlucHV0IGZpZWxkICovXG4gIEBWaWV3Q2hpbGQoJ3NlYXJjaFNlbGVjdElucHV0JywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSkgc2VhcmNoU2VsZWN0SW5wdXQ6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgc2VhcmNoIGlucHV0IGZpZWxkICovXG4gIEBWaWV3Q2hpbGQoJ2lubmVyU2VsZWN0U2VhcmNoJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSkgaW5uZXJTZWxlY3RTZWFyY2g6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBjdXN0b20gc2VhcmNoIGlucHV0IGNsZWFyIGljb24gKi9cbiAgQENvbnRlbnRDaGlsZChOb3ZvU2VsZWN0U2VhcmNoQ2xlYXJEaXJlY3RpdmUsIHsgc3RhdGljOiBmYWxzZSB9KSBjbGVhckljb246IE5vdm9TZWxlY3RTZWFyY2hDbGVhckRpcmVjdGl2ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm5vdm8tc2VsZWN0LXNlYXJjaC1pbnNpZGUtbm92by1vcHRpb24nKVxuICBnZXQgaXNJbnNpZGVOb3ZvT3B0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMubm92b09wdGlvbjtcbiAgfVxuXG4gIC8qKiBDdXJyZW50IHNlYXJjaCB2YWx1ZSAqL1xuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybUNvbnRyb2wudmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfbGFzdEV4dGVybmFsSW5wdXRWYWx1ZTogc3RyaW5nO1xuXG4gIG9uVG91Y2hlZDogRnVuY3Rpb24gPSAoXzogYW55KSA9PiB7fTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBOb3ZvU2VsZWN0RWxlbWVudCBvcHRpb25zICovXG4gIHB1YmxpYyBzZXQgX29wdGlvbnMoX29wdGlvbnM6IFF1ZXJ5TGlzdDxOb3ZvT3B0aW9uPikge1xuICAgIHRoaXMuX29wdGlvbnMkLm5leHQoX29wdGlvbnMpO1xuICB9XG4gIHB1YmxpYyBnZXQgX29wdGlvbnMoKTogUXVlcnlMaXN0PE5vdm9PcHRpb24+IHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucyQuZ2V0VmFsdWUoKTtcbiAgfVxuICBwdWJsaWMgX29wdGlvbnMkOiBCZWhhdmlvclN1YmplY3Q8UXVlcnlMaXN0PE5vdm9PcHRpb24+PiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UXVlcnlMaXN0PE5vdm9PcHRpb24+PihudWxsKTtcblxuICBwcml2YXRlIG9wdGlvbnNMaXN0JDogT2JzZXJ2YWJsZTxOb3ZvT3B0aW9uW10+ID0gdGhpcy5fb3B0aW9ucyQucGlwZShcbiAgICBzd2l0Y2hNYXAoKF9vcHRpb25zKSA9PlxuICAgICAgX29wdGlvbnNcbiAgICAgICAgPyBfb3B0aW9ucy5jaGFuZ2VzLnBpcGUoXG4gICAgICAgICAgICBtYXAoKG9wdGlvbnMpID0+IG9wdGlvbnMudG9BcnJheSgpKSxcbiAgICAgICAgICAgIHN0YXJ0V2l0aDxOb3ZvT3B0aW9uW10+KF9vcHRpb25zLnRvQXJyYXkoKSksXG4gICAgICAgICAgKVxuICAgICAgICA6IG9mKG51bGwpLFxuICAgICksXG4gICk7XG5cbiAgcHJpdmF0ZSBvcHRpb25zTGVuZ3RoJDogT2JzZXJ2YWJsZTxudW1iZXI+ID0gdGhpcy5vcHRpb25zTGlzdCQucGlwZShtYXAoKG9wdGlvbnMpID0+IChvcHRpb25zID8gb3B0aW9ucy5sZW5ndGggOiAwKSkpO1xuXG4gIC8qKiBQcmV2aW91c2x5IHNlbGVjdGVkIHZhbHVlcyB3aGVuIHVzaW5nIDxub3ZvLXNlbGVjdCBbbXVsdGlwbGVdPVwidHJ1ZVwiPiovXG4gIHByaXZhdGUgcHJldmlvdXNTZWxlY3RlZFZhbHVlczogYW55W107XG5cbiAgcHVibGljIF9mb3JtQ29udHJvbDogRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycpO1xuXG4gIC8qKiB3aGV0aGVyIHRvIHNob3cgdGhlIG5vIGVudHJpZXMgZm91bmQgbWVzc2FnZSAqL1xuICBwdWJsaWMgX3Nob3dOb0VudHJpZXNGb3VuZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSBjb21iaW5lTGF0ZXN0KFt0aGlzLl9mb3JtQ29udHJvbC52YWx1ZUNoYW5nZXMsIHRoaXMub3B0aW9uc0xlbmd0aCRdKS5waXBlKFxuICAgIG1hcCgoW3ZhbHVlLCBvcHRpb25zTGVuZ3RoXSkgPT4gdGhpcy5ub0VudHJpZXNGb3VuZExhYmVsICYmIHZhbHVlICYmIG9wdGlvbnNMZW5ndGggPT09IHRoaXMuZ2V0T3B0aW9uc0xlbmd0aE9mZnNldCgpKSxcbiAgKTtcblxuICAvKiogU3ViamVjdCB0aGF0IGVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgX29uRGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChOb3ZvU2VsZWN0RWxlbWVudCkgcHVibGljIG5vdm9TZWxlY3Q6IE5vdm9TZWxlY3RFbGVtZW50LFxuICAgIHB1YmxpYyBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE5vdm9PcHRpb24pIHB1YmxpYyBub3ZvT3B0aW9uOiBOb3ZvT3B0aW9uID0gbnVsbCxcbiAgICBwcml2YXRlIGxpdmVBbm5vdW5jZXI6IExpdmVBbm5vdW5jZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChOb3ZvRmllbGRFbGVtZW50KSBwdWJsaWMgbWF0Rm9ybUZpZWxkOiBOb3ZvRmllbGRFbGVtZW50ID0gbnVsbCxcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIHNldCBjdXN0b20gcGFuZWwgY2xhc3NcbiAgICAvLyBjb25zdCBwYW5lbENsYXNzID0gJ25vdm8tc2VsZWN0LXNlYXJjaC1wYW5lbCc7XG4gICAgLy8gaWYgKHRoaXMubm92b1NlbGVjdC5wYW5lbENsYXNzKSB7XG4gICAgLy8gICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLm5vdm9TZWxlY3QucGFuZWxDbGFzcykpIHtcbiAgICAvLyAgICAgKDxzdHJpbmdbXT50aGlzLm5vdm9TZWxlY3QucGFuZWxDbGFzcykucHVzaChwYW5lbENsYXNzKTtcbiAgICAvLyAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMubm92b1NlbGVjdC5wYW5lbENsYXNzID09PSAnc3RyaW5nJykge1xuICAgIC8vICAgICB0aGlzLm5vdm9TZWxlY3QucGFuZWxDbGFzcyA9IFt0aGlzLm5vdm9TZWxlY3QucGFuZWxDbGFzcywgcGFuZWxDbGFzc107XG4gICAgLy8gICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLm5vdm9TZWxlY3QucGFuZWxDbGFzcyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyAgICAgdGhpcy5ub3ZvU2VsZWN0LnBhbmVsQ2xhc3NbcGFuZWxDbGFzc10gPSB0cnVlO1xuICAgIC8vICAgfVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICB0aGlzLm5vdm9TZWxlY3QucGFuZWxDbGFzcyA9IHBhbmVsQ2xhc3M7XG4gICAgLy8gfVxuXG4gICAgLy8gc2V0IGN1c3RvbSBub3ZvLW9wdGlvbiBjbGFzcyBpZiB0aGUgY29tcG9uZW50IHdhcyBwbGFjZWQgaW5zaWRlIGEgbm92by1vcHRpb25cbiAgICBpZiAodGhpcy5ub3ZvT3B0aW9uKSB7XG4gICAgICB0aGlzLm5vdm9PcHRpb24ubm92b0luZXJ0ID0gdHJ1ZTtcbiAgICAgIHRoaXMubm92b09wdGlvbi5fZ2V0SG9zdEVsZW1lbnQoKS5jbGFzc0xpc3QuYWRkKCdjb250YWlucy1ub3ZvLXNlbGVjdC1zZWFyY2gnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignPG5vdm8tc2VsZWN0LXNlYXJjaD4gbXVzdCBiZSBwbGFjZWQgaW5zaWRlIGEgPG5vdm8tb3B0aW9uPiBlbGVtZW50Jyk7XG4gICAgfVxuXG4gICAgLy8gd2hlbiB0aGUgc2VsZWN0IGRyb3Bkb3duIHBhbmVsIGlzIG9wZW5lZCBvciBjbG9zZWRcbiAgICB0aGlzLm5vdm9TZWxlY3Qub3BlbmVkQ2hhbmdlLnBpcGUoZGVsYXkoMSksIHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKS5zdWJzY3JpYmUoKG9wZW5lZCkgPT4ge1xuICAgICAgaWYgKG9wZW5lZCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUlucHV0V2lkdGgoKTtcbiAgICAgICAgLy8gZm9jdXMgdGhlIHNlYXJjaCBmaWVsZCB3aGVuIG9wZW5pbmdcbiAgICAgICAgaWYgKCF0aGlzLmRpc2FibGVJbml0aWFsRm9jdXMpIHtcbiAgICAgICAgICB0aGlzLl9mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBjbGVhciBpdCB3aGVuIGNsb3NpbmdcbiAgICAgICAgaWYgKHRoaXMuY2xlYXJTZWFyY2hJbnB1dCkge1xuICAgICAgICAgIHRoaXMuX3Jlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHNldCB0aGUgZmlyc3QgaXRlbSBhY3RpdmUgYWZ0ZXIgdGhlIG9wdGlvbnMgY2hhbmdlZFxuICAgIHRoaXMubm92b1NlbGVjdC5vcGVuZWRDaGFuZ2VcbiAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5ub3ZvU2VsZWN0Ll9rZXlNYW5hZ2VyKSB7XG4gICAgICAgICAgdGhpcy5ub3ZvU2VsZWN0Ll9rZXlNYW5hZ2VyLmNoYW5nZVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuYWRqdXN0U2Nyb2xsVG9wVG9GaXRBY3RpdmVPcHRpb25JbnRvVmlldygpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnX2tleU1hbmFnZXIgd2FzIG5vdCBpbml0aWFsaXplZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB0aGlzLm5vdm9TZWxlY3QuY29udGVudE9wdGlvbnM7XG5cbiAgICAgICAgLy8gQ2xvc3VyZSB2YXJpYWJsZSBmb3IgdHJhY2tpbmcgdGhlIG1vc3QgcmVjZW50IGZpcnN0IG9wdGlvbi5cbiAgICAgICAgLy8gSW4gb3JkZXIgdG8gYXZvaWQgYXZvaWQgY2F1c2luZyB0aGUgbGlzdCB0b1xuICAgICAgICAvLyBzY3JvbGwgdG8gdGhlIHRvcCB3aGVuIG9wdGlvbnMgYXJlIGFkZGVkIHRvIHRoZSBib3R0b20gb2ZcbiAgICAgICAgLy8gdGhlIGxpc3QgKGVnOiBpbmZpbml0ZSBzY3JvbGwpLCB3ZSBjb21wYXJlIG9ubHlcbiAgICAgICAgLy8gdGhlIGNoYW5nZXMgdG8gdGhlIGZpcnN0IG9wdGlvbnMgdG8gZGV0ZXJtaW5lIGlmIHdlXG4gICAgICAgIC8vIHNob3VsZCBzZXQgdGhlIGZpcnN0IGl0ZW0gYXMgYWN0aXZlLlxuICAgICAgICAvLyBUaGlzIHByZXZlbnRzIHVubmVjZXNzYXJ5IHNjcm9sbGluZyB0byB0aGUgdG9wIG9mIHRoZSBsaXN0XG4gICAgICAgIC8vIHdoZW4gb3B0aW9ucyBhcmUgYXBwZW5kZWQsIGJ1dCBhbGxvd3MgdGhlIGZpcnN0IGl0ZW1cbiAgICAgICAgLy8gaW4gdGhlIGxpc3QgdG8gYmUgc2V0IGFzIGFjdGl2ZSBieSBkZWZhdWx0IHdoZW4gdGhlcmVcbiAgICAgICAgLy8gaXMgbm8gYWN0aXZlIHNlbGVjdGlvblxuICAgICAgICBsZXQgcHJldmlvdXNGaXJzdE9wdGlvbiA9IHRoaXMuX29wdGlvbnMudG9BcnJheSgpW3RoaXMuZ2V0T3B0aW9uc0xlbmd0aE9mZnNldCgpXTtcblxuICAgICAgICB0aGlzLl9vcHRpb25zLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAvLyBhdm9pZCBcImV4cHJlc3Npb24gaGFzIGJlZW4gY2hhbmdlZFwiIGVycm9yXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBDb252ZXJ0IHRoZSBRdWVyeUxpc3QgdG8gYW4gYXJyYXlcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zLnRvQXJyYXkoKTtcblxuICAgICAgICAgICAgLy8gVGhlIHRydWUgZmlyc3QgaXRlbSBpcyBvZmZzZXQgYnkgMVxuICAgICAgICAgICAgY29uc3QgY3VycmVudEZpcnN0T3B0aW9uID0gb3B0aW9uc1t0aGlzLmdldE9wdGlvbnNMZW5ndGhPZmZzZXQoKV07XG5cbiAgICAgICAgICAgIGNvbnN0IGtleU1hbmFnZXIgPSB0aGlzLm5vdm9TZWxlY3QuX2tleU1hbmFnZXI7XG4gICAgICAgICAgICBpZiAoa2V5TWFuYWdlciAmJiB0aGlzLm5vdm9TZWxlY3QucGFuZWxPcGVuKSB7XG4gICAgICAgICAgICAgIC8vIHNldCBmaXJzdCBpdGVtIGFjdGl2ZSBhbmQgaW5wdXQgd2lkdGhcblxuICAgICAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGZpcnN0IG9wdGlvbiBpbiB0aGVzZSBjaGFuZ2VzIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBwcmV2aW91cy5cbiAgICAgICAgICAgICAgY29uc3QgZmlyc3RPcHRpb25Jc0NoYW5nZWQgPSAhdGhpcy5ub3ZvU2VsZWN0LmNvbXBhcmVXaXRoKHByZXZpb3VzRmlyc3RPcHRpb24sIGN1cnJlbnRGaXJzdE9wdGlvbik7XG5cbiAgICAgICAgICAgICAgLy8gQ0FTRTogVGhlIGZpcnN0IG9wdGlvbiBpcyBkaWZmZXJlbnQgbm93LlxuICAgICAgICAgICAgICAvLyBJbmRpY2lhdGVzIHdlIHNob3VsZCBzZXQgaXQgYXMgYWN0aXZlIGFuZCBzY3JvbGwgdG8gdGhlIHRvcC5cbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGZpcnN0T3B0aW9uSXNDaGFuZ2VkIHx8XG4gICAgICAgICAgICAgICAgIWtleU1hbmFnZXIuYWN0aXZlSXRlbSB8fFxuICAgICAgICAgICAgICAgICFvcHRpb25zLmZpbmQoKG9wdGlvbikgPT4gdGhpcy5ub3ZvU2VsZWN0LmNvbXBhcmVXaXRoKG9wdGlvbiwga2V5TWFuYWdlci5hY3RpdmVJdGVtKSlcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAga2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIHdhaXQgZm9yIHBhbmVsIHdpZHRoIGNoYW5nZXNcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJbnB1dFdpZHRoKCk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGlmICghdGhpcy5kaXNhYmxlU2Nyb2xsVG9BY3RpdmVPbk9wdGlvbnNDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGp1c3RTY3JvbGxUb3BUb0ZpdEFjdGl2ZU9wdGlvbkludG9WaWV3KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXBkYXRlIG91ciByZWZlcmVuY2VcbiAgICAgICAgICAgIHByZXZpb3VzRmlyc3RPcHRpb24gPSBjdXJyZW50Rmlyc3RPcHRpb247XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBhZGQgb3IgcmVtb3ZlIGNzcyBjbGFzcyBkZXBlbmRpbmcgb24gd2hldGhlciB0byBzaG93IHRoZSBubyBlbnRyaWVzIGZvdW5kIG1lc3NhZ2VcbiAgICAvLyBub3RlOiB0aGlzIGlzIGhhY2t5XG4gICAgdGhpcy5fc2hvd05vRW50cmllc0ZvdW5kJC5waXBlKHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKS5zdWJzY3JpYmUoKHNob3dOb0VudHJpZXNGb3VuZCkgPT4ge1xuICAgICAgLy8gc2V0IG5vIGVudHJpZXMgZm91bmQgY2xhc3Mgb24gbWF0IG9wdGlvblxuICAgICAgaWYgKHRoaXMubm92b09wdGlvbikge1xuICAgICAgICBpZiAoc2hvd05vRW50cmllc0ZvdW5kKSB7XG4gICAgICAgICAgdGhpcy5ub3ZvT3B0aW9uLl9nZXRIb3N0RWxlbWVudCgpLmNsYXNzTGlzdC5hZGQoJ25vdm8tc2VsZWN0LXNlYXJjaC1uby1lbnRyaWVzLWZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5ub3ZvT3B0aW9uLl9nZXRIb3N0RWxlbWVudCgpLmNsYXNzTGlzdC5yZW1vdmUoJ25vdm8tc2VsZWN0LXNlYXJjaC1uby1lbnRyaWVzLWZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHJlc2l6ZSB0aGUgaW5wdXQgd2lkdGggd2hlbiB0aGUgdmlld3BvcnQgaXMgcmVzaXplZCwgaS5lLiB0aGUgdHJpZ2dlciB3aWR0aCBjb3VsZCBwb3RlbnRpYWxseSBiZSByZXNpemVkXG4gICAgdGhpcy5fdmlld3BvcnRSdWxlclxuICAgICAgLmNoYW5nZSgpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5ub3ZvU2VsZWN0LnBhbmVsT3Blbikge1xuICAgICAgICAgIHRoaXMudXBkYXRlSW5wdXRXaWR0aCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRoaXMuaW5pdE11bHRpcGxlSGFuZGxpbmcoKTtcblxuICAgIHRoaXMub3B0aW9uc0xpc3QkLnBpcGUodGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvLyB1cGRhdGUgdmlldyB3aGVuIGF2YWlsYWJsZSBvcHRpb25zIGNoYW5nZVxuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9lbWl0U2VsZWN0QWxsQm9vbGVhblRvUGFyZW50KHN0YXRlOiBib29sZWFuKSB7XG4gICAgdGhpcy50b2dnbGVBbGwuZW1pdChzdGF0ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9vbkRlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX29uRGVzdHJveS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgX2lzVG9nZ2xlQWxsQ2hlY2tib3hWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm5vdm9TZWxlY3QubXVsdGlwbGUgJiYgdGhpcy5zaG93VG9nZ2xlQWxsQ2hlY2tib3g7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUga2V5IGRvd24gZXZlbnQgd2l0aCBOb3ZvU2VsZWN0RWxlbWVudC5cbiAgICogQWxsb3dzIGUuZy4gc2VsZWN0aW5nIHdpdGggZW50ZXIga2V5LCBuYXZpZ2F0aW9uIHdpdGggYXJyb3cga2V5cywgZXRjLlxuICAgKiBAcGFyYW0gZXZlbnRcbiAgICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgLy8gUHJldmVudCBwcm9wYWdhdGlvbiBmb3IgYWxsIGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIGluIG9yZGVyIHRvIGF2b2lkIHNlbGVjdGlvbiBpc3N1ZXNcbiAgICBpZiAoXG4gICAgICAoZXZlbnQua2V5ICYmIGV2ZW50LmtleS5sZW5ndGggPT09IDEpIHx8XG4gICAgICBpc0FscGhhTnVtZXJpYyhldmVudC5rZXkpIHx8XG4gICAgICBldmVudC5rZXkgPT09IEtleS5TcGFjZSB8fFxuICAgICAgKHRoaXMucHJldmVudEhvbWVFbmRLZXlQcm9wYWdhdGlvbiAmJiAoZXZlbnQua2V5ID09PSBLZXkuSG9tZSB8fCBldmVudC5rZXkgPT09IEtleS5FbmQpKVxuICAgICkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubm92b1NlbGVjdC5tdWx0aXBsZSAmJiBldmVudC5rZXkgJiYgZXZlbnQua2V5ID09PSBLZXkuRW50ZXIpIHtcbiAgICAgIC8vIFJlZ2FpbiBmb2N1cyBhZnRlciBtdWx0aXNlbGVjdCwgc28gd2UgY2FuIGZ1cnRoZXIgdHlwZVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLl9mb2N1cygpKTtcbiAgICB9XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgaWYgY2xpY2sgRXNjYXBlLCBpZiBpbnB1dCBpcyBlbXB0eSwgY2xvc2UgdGhlIGRyb3Bkb3duLCBpZiBub3QsIGVtcHR5IG91dCB0aGUgc2VhcmNoIGZpZWxkXG4gICAgaWYgKHRoaXMuZW5hYmxlQ2xlYXJPbkVzY2FwZVByZXNzZWQgPT09IHRydWUgJiYgZXZlbnQua2V5ID09PSBLZXkuRXNjYXBlICYmIHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuX3Jlc2V0KHRydWUpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIGtleSB1cCBldmVudCB3aXRoIE5vdm9TZWxlY3RFbGVtZW50LlxuICAgKiBBbGxvd3MgZS5nLiB0aGUgYW5ub3VuY2luZyBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZURlc2NlbmRhbnQgYnkgc2NyZWVuIHJlYWRlcnMuXG4gICAqL1xuICBfaGFuZGxlS2V5dXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5ID09PSBLZXkuQXJyb3dVcCB8fCBldmVudC5rZXkgPT09IEtleS5BcnJvd0Rvd24pIHtcbiAgICAgIGNvbnN0IGFyaWFBY3RpdmVEZXNjZW5kYW50SWQgPSB0aGlzLm5vdm9TZWxlY3QuX2dldEFyaWFBY3RpdmVEZXNjZW5kYW50KCk7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX29wdGlvbnMudG9BcnJheSgpLmZpbmRJbmRleCgoaXRlbSkgPT4gaXRlbS5pZCA9PT0gYXJpYUFjdGl2ZURlc2NlbmRhbnRJZCk7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZURlc2NlbmRhbnQgPSB0aGlzLl9vcHRpb25zLnRvQXJyYXkoKVtpbmRleF07XG4gICAgICAgIHRoaXMubGl2ZUFubm91bmNlci5hbm5vdW5jZShcbiAgICAgICAgICBhY3RpdmVEZXNjZW5kYW50LnZpZXdWYWx1ZSArICcgJyArIHRoaXMuZ2V0QXJpYUluZGV4KGluZGV4KSArIHRoaXMuaW5kZXhBbmRMZW5ndGhTY3JlZW5SZWFkZXJUZXh0ICsgdGhpcy5nZXRBcmlhTGVuZ3RoKCksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgb3B0aW9uLCB0YWtpbmcgdGhlIG9mZnNldCB0byBsZW5ndGggaW50byBhY2NvdW50LlxuICAgKiBleGFtcGxlczpcbiAgICogICAgQ2FzZSAxIFtTZWFyY2gsIDEsIDIsIDNdIHdpbGwgaGF2ZSBvZmZzZXQgb2YgMSwgZHVlIHRvIHNlYXJjaCBhbmQgd2lsbCByZWFkIGluZGV4IG9mIHRvdGFsLlxuICAgKiAgICBDYXNlIDIgWzEsIDIsIDNdIHdpbGwgaGF2ZSBvZmZzZXQgb2YgMCBhbmQgd2lsbCByZWFkIGluZGV4ICsxIG9mIHRvdGFsLlxuICAgKi9cbiAgZ2V0QXJpYUluZGV4KG9wdGlvbkluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLmdldE9wdGlvbnNMZW5ndGhPZmZzZXQoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG9wdGlvbkluZGV4ICsgMTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbkluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgbGVuZ3RoIG9mIHRoZSBvcHRpb25zLCB0YWtpbmcgdGhlIG9mZnNldCB0byBsZW5ndGggaW50byBhY2NvdW50LlxuICAgKiBleGFtcGxlczpcbiAgICogICAgQ2FzZSAxIFtTZWFyY2gsIDEsIDIsIDNdIHdpbGwgaGF2ZSBsZW5ndGggb2Ygb3B0aW9ucy5sZW5ndGggLTEsIGR1ZSB0byBzZWFyY2guXG4gICAqICAgIENhc2UgMiBbMSwgMiwgM10gd2lsbCBoYXZlIGxlbmd0aCBvZiBvcHRpb25zLmxlbmd0aC5cbiAgICovXG4gIGdldEFyaWFMZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucy50b0FycmF5KCkubGVuZ3RoIC0gdGhpcy5nZXRPcHRpb25zTGVuZ3RoT2Zmc2V0KCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9sYXN0RXh0ZXJuYWxJbnB1dFZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fZm9ybUNvbnRyb2wuc2V0VmFsdWUodmFsdWUpO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fZm9ybUNvbnRyb2wudmFsdWVDaGFuZ2VzXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUgIT09IHRoaXMuX2xhc3RFeHRlcm5hbElucHV0VmFsdWUpLFxuICAgICAgICB0YXAoKCkgPT4gKHRoaXMuX2xhc3RFeHRlcm5hbElucHV0VmFsdWUgPSB1bmRlZmluZWQpKSxcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKGZuKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbikge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgc2VhcmNoIGlucHV0IGZpZWxkXG4gICAqL1xuICBwdWJsaWMgX2ZvY3VzKCkge1xuICAgIGlmICghdGhpcy5zZWFyY2hTZWxlY3RJbnB1dCB8fCAhdGhpcy5ub3ZvU2VsZWN0LnBhbmVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHNhdmUgYW5kIHJlc3RvcmUgc2Nyb2xsVG9wIG9mIHBhbmVsLCBzaW5jZSBpdCB3aWxsIGJlIHJlc2V0IGJ5IGZvY3VzKClcbiAgICAvLyBub3RlOiB0aGlzIGlzIGhhY2t5XG4gICAgY29uc3QgcGFuZWwgPSB0aGlzLm5vdm9TZWxlY3QucGFuZWwubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSBwYW5lbC5zY3JvbGxUb3A7XG5cbiAgICAvLyBmb2N1c1xuICAgIHRoaXMuc2VhcmNoU2VsZWN0SW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuXG4gICAgcGFuZWwuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgY3VycmVudCBzZWFyY2ggdmFsdWVcbiAgICogQHBhcmFtIGZvY3VzIHdoZXRoZXIgdG8gZm9jdXMgYWZ0ZXIgcmVzZXR0aW5nXG4gICAqL1xuICBwdWJsaWMgX3Jlc2V0KGZvY3VzPzogYm9vbGVhbikge1xuICAgIHRoaXMuX2Zvcm1Db250cm9sLnNldFZhbHVlKCcnKTtcbiAgICBpZiAoZm9jdXMpIHtcbiAgICAgIHRoaXMuX2ZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIGhhbmRsaW5nIDxub3ZvLXNlbGVjdCBbbXVsdGlwbGVdPVwidHJ1ZVwiPlxuICAgKiBOb3RlOiB0byBpbXByb3ZlIHRoaXMgY29kZSwgbm92by1zZWxlY3Qgc2hvdWxkIGJlIGV4dGVuZGVkIHRvIGFsbG93IGRpc2FibGluZyByZXNldHRpbmcgdGhlIHNlbGVjdGlvbiB3aGlsZSBmaWx0ZXJpbmcuXG4gICAqL1xuICBwcml2YXRlIGluaXRNdWx0aXBsZUhhbmRsaW5nKCkge1xuICAgIGlmICghdGhpcy5ub3ZvU2VsZWN0Lm5nQ29udHJvbCkge1xuICAgICAgaWYgKHRoaXMubm92b1NlbGVjdC5tdWx0aXBsZSkge1xuICAgICAgICAvLyBub3RlOiB0aGUgYWNjZXNzIHRvIG5vdm9TZWxlY3QubmdDb250cm9sIChpbnN0ZWFkIG9mIG5vdm9TZWxlY3QudmFsdWUgLyBub3ZvU2VsZWN0LnZhbHVlQ2hhbmdlcylcbiAgICAgICAgLy8gaXMgbmVjZXNzYXJ5IHRvIHByb3Blcmx5IHdvcmsgaW4gbXVsdGktc2VsZWN0aW9uIG1vZGUuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ3RoZSBub3ZvLXNlbGVjdCBjb250YWluaW5nIG5vdm8tc2VsZWN0LXNlYXJjaCBtdXN0IGhhdmUgYSBuZ01vZGVsIG9yIGZvcm1Db250cm9sIGRpcmVjdGl2ZSB3aGVuIG11bHRpcGxlPXRydWUnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gaWYgPG5vdm8tc2VsZWN0IFttdWx0aXBsZV09XCJ0cnVlXCI+XG4gICAgLy8gc3RvcmUgcHJldmlvdXNseSBzZWxlY3RlZCB2YWx1ZXMgYW5kIHJlc3RvcmUgdGhlbSB3aGVuIHRoZXkgYXJlIGRlc2VsZWN0ZWRcbiAgICAvLyBiZWNhdXNlIHRoZSBvcHRpb24gaXMgbm90IGF2YWlsYWJsZSB3aGlsZSB3ZSBhcmUgY3VycmVudGx5IGZpbHRlcmluZ1xuICAgIHRoaXMucHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IHRoaXMubm92b1NlbGVjdC5uZ0NvbnRyb2wudmFsdWU7XG5cbiAgICB0aGlzLm5vdm9TZWxlY3QubmdDb250cm9sLnZhbHVlQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKS5zdWJzY3JpYmUoKHZhbHVlcykgPT4ge1xuICAgICAgbGV0IHJlc3RvcmVTZWxlY3RlZFZhbHVlcyA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMubm92b1NlbGVjdC5tdWx0aXBsZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKHRoaXMuYWx3YXlzUmVzdG9yZVNlbGVjdGVkT3B0aW9uc011bHRpIHx8ICh0aGlzLl9mb3JtQ29udHJvbC52YWx1ZSAmJiB0aGlzLl9mb3JtQ29udHJvbC52YWx1ZS5sZW5ndGgpKSAmJlxuICAgICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3RlZFZhbHVlcyAmJlxuICAgICAgICAgIEFycmF5LmlzQXJyYXkodGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzKVxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoIXZhbHVlcyB8fCAhQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWVzID0gdGhpcy5ub3ZvU2VsZWN0Lm9wdGlvbnMubWFwKChvcHRpb24pID0+IG9wdGlvbi52YWx1ZSk7XG4gICAgICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzLmZvckVhY2goKHByZXZpb3VzVmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgIXZhbHVlcy5zb21lKCh2KSA9PiB0aGlzLm5vdm9TZWxlY3QuY29tcGFyZVdpdGgodiwgcHJldmlvdXNWYWx1ZSkpICYmXG4gICAgICAgICAgICAgICFvcHRpb25WYWx1ZXMuc29tZSgodikgPT4gdGhpcy5ub3ZvU2VsZWN0LmNvbXBhcmVXaXRoKHYsIHByZXZpb3VzVmFsdWUpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIC8vIGlmIGEgdmFsdWUgdGhhdCB3YXMgc2VsZWN0ZWQgYmVmb3JlIGlzIGRlc2VsZWN0ZWQgYW5kIG5vdCBmb3VuZCBpbiB0aGUgb3B0aW9ucywgaXQgd2FzIGRlc2VsZWN0ZWRcbiAgICAgICAgICAgICAgLy8gZHVlIHRvIHRoZSBmaWx0ZXJpbmcsIHNvIHdlIHJlc3RvcmUgaXQuXG4gICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHByZXZpb3VzVmFsdWUpO1xuICAgICAgICAgICAgICByZXN0b3JlU2VsZWN0ZWRWYWx1ZXMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMgPSB2YWx1ZXM7XG5cbiAgICAgIGlmIChyZXN0b3JlU2VsZWN0ZWRWYWx1ZXMpIHtcbiAgICAgICAgLy8gVE9ETzogRml4IHRoaXNcbiAgICAgICAgLy8gdGhpcy5ub3ZvU2VsZWN0Ll9vbkNoYW5nZSh2YWx1ZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdGhlIGN1cnJlbnRseSBhY3RpdmUgb3B0aW9uIGludG8gdGhlIHZpZXcgaWYgaXQgaXMgbm90IHlldCB2aXNpYmxlLlxuICAgKi9cbiAgcHJpdmF0ZSBhZGp1c3RTY3JvbGxUb3BUb0ZpdEFjdGl2ZU9wdGlvbkludG9WaWV3KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm5vdm9TZWxlY3QucGFuZWwgJiYgdGhpcy5ub3ZvU2VsZWN0LmNvbnRlbnRPcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG5vdm9PcHRpb25IZWlnaHQgPSB0aGlzLmdldE5vdm9PcHRpb25IZWlnaHQoKTtcbiAgICAgIGNvbnN0IGFjdGl2ZU9wdGlvbkluZGV4ID0gdGhpcy5ub3ZvU2VsZWN0Ll9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCB8fCAwO1xuICAgICAgY29uc3QgbGFiZWxDb3VudCA9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKGFjdGl2ZU9wdGlvbkluZGV4LCB0aGlzLm5vdm9TZWxlY3QuY29udGVudE9wdGlvbnMsIHRoaXMubm92b1NlbGVjdC5vcHRpb25Hcm91cHMpO1xuICAgICAgLy8gSWYgdGhlIGNvbXBvbmVudCBpcyBpbiBhIE5vdm9PcHRpb24sIHRoZSBhY3RpdmVJdGVtSW5kZXggd2lsbCBiZSBvZmZzZXQgYnkgb25lLlxuICAgICAgY29uc3QgaW5kZXhPZk9wdGlvblRvRml0SW50b1ZpZXcgPSAodGhpcy5ub3ZvT3B0aW9uID8gLTEgOiAwKSArIGxhYmVsQ291bnQgKyBhY3RpdmVPcHRpb25JbmRleDtcbiAgICAgIGNvbnN0IGN1cnJlbnRTY3JvbGxUb3AgPSB0aGlzLm5vdm9TZWxlY3QucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3A7XG5cbiAgICAgIGNvbnN0IHNlYXJjaElucHV0SGVpZ2h0ID0gdGhpcy5pbm5lclNlbGVjdFNlYXJjaC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgIGNvbnN0IGFtb3VudE9mVmlzaWJsZU9wdGlvbnMgPSBNYXRoLmZsb29yKChTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCAtIHNlYXJjaElucHV0SGVpZ2h0KSAvIG5vdm9PcHRpb25IZWlnaHQpO1xuXG4gICAgICBjb25zdCBpbmRleE9mRmlyc3RWaXNpYmxlT3B0aW9uID0gTWF0aC5yb3VuZCgoY3VycmVudFNjcm9sbFRvcCArIHNlYXJjaElucHV0SGVpZ2h0KSAvIG5vdm9PcHRpb25IZWlnaHQpIC0gMTtcblxuICAgICAgaWYgKGluZGV4T2ZGaXJzdFZpc2libGVPcHRpb24gPj0gaW5kZXhPZk9wdGlvblRvRml0SW50b1ZpZXcpIHtcbiAgICAgICAgdGhpcy5ub3ZvU2VsZWN0LnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gaW5kZXhPZk9wdGlvblRvRml0SW50b1ZpZXcgKiBub3ZvT3B0aW9uSGVpZ2h0O1xuICAgICAgfSBlbHNlIGlmIChpbmRleE9mRmlyc3RWaXNpYmxlT3B0aW9uICsgYW1vdW50T2ZWaXNpYmxlT3B0aW9ucyA8PSBpbmRleE9mT3B0aW9uVG9GaXRJbnRvVmlldykge1xuICAgICAgICB0aGlzLm5vdm9TZWxlY3QucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPVxuICAgICAgICAgIChpbmRleE9mT3B0aW9uVG9GaXRJbnRvVmlldyArIDEpICogbm92b09wdGlvbkhlaWdodCAtIChTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCAtIHNlYXJjaElucHV0SGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogIFNldCB0aGUgd2lkdGggb2YgdGhlIGlubmVyU2VsZWN0U2VhcmNoIHRvIGZpdCBldmVuIGN1c3RvbSBzY3JvbGxiYXJzXG4gICAqICBBbmQgc3VwcG9ydCBhbGwgT3BlcmF0aW9uIFN5c3RlbXNcbiAgICovXG4gIHB1YmxpYyB1cGRhdGVJbnB1dFdpZHRoKCkge1xuICAgIGlmICghdGhpcy5pbm5lclNlbGVjdFNlYXJjaCB8fCAhdGhpcy5pbm5lclNlbGVjdFNlYXJjaC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuaW5uZXJTZWxlY3RTZWFyY2gubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgcGFuZWxFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICB3aGlsZSAoKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQpKSB7XG4gICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vdm8tc2VsZWN0LXBhbmVsJykpIHtcbiAgICAgICAgcGFuZWxFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYW5lbEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuaW5uZXJTZWxlY3RTZWFyY2gubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IHBhbmVsRWxlbWVudC5jbGllbnRXaWR0aCArICdweCc7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXROb3ZvT3B0aW9uSGVpZ2h0KCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMubm92b1NlbGVjdC5jb250ZW50T3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub3ZvU2VsZWN0LmNvbnRlbnRPcHRpb25zLmZpcnN0Ll9nZXRIb3N0RWxlbWVudCgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIG9mZnNldCB0byBsZW5ndGggdGhhdCBjYW4gYmUgY2F1c2VkIGJ5IHRoZSBvcHRpb25hbCBub3ZvT3B0aW9uIHVzZWQgYXMgYSBzZWFyY2ggaW5wdXQuXG4gICAqL1xuICBwcml2YXRlIGdldE9wdGlvbnNMZW5ndGhPZmZzZXQoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5ub3ZvT3B0aW9uKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICB9XG59XG4iLCI8bm92by1maWVsZFxuICAjaW5uZXJTZWxlY3RTZWFyY2hcbiAgY2xhc3M9XCJub3ZvLXNlbGVjdC1zZWFyY2gtaW5uZXJcIlxuICBbbmdDbGFzc109XCJ7J25vdm8tc2VsZWN0LXNlYXJjaC1pbm5lci1tdWx0aXBsZSc6IG5vdm9TZWxlY3QubXVsdGlwbGUsICdub3ZvLXNlbGVjdC1zZWFyY2gtaW5uZXItdG9nZ2xlLWFsbCc6IF9pc1RvZ2dsZUFsbENoZWNrYm94VmlzaWJsZSgpIH1cIj5cblxuICA8bm92by1jaGVja2JveCAqbmdJZj1cIl9pc1RvZ2dsZUFsbENoZWNrYm94VmlzaWJsZSgpXCJcbiAgICBub3ZvUHJlZml4XG4gICAgW2NvbG9yXT1cIidwcmltYXJ5J1wiXG4gICAgY2xhc3M9XCJub3ZvLXNlbGVjdC1zZWFyY2gtdG9nZ2xlLWFsbC1jaGVja2JveFwiXG4gICAgW2NoZWNrZWRdPVwidG9nZ2xlQWxsQ2hlY2tib3hDaGVja2VkXCJcbiAgICBbaW5kZXRlcm1pbmF0ZV09XCJ0b2dnbGVBbGxDaGVja2JveEluZGV0ZXJtaW5hdGVcIlxuICAgIFt0b29sdGlwXT1cInRvZ2dsZUFsbENoZWNrYm94VG9vbHRpcE1lc3NhZ2VcIlxuICAgIHRvb2x0aXBDbGFzcz1cIm5neC1ub3ZvLXNlbGVjdC1zZWFyY2gtdG9nZ2xlLWFsbC10b29sdGlwXCJcbiAgICBbdG9vbHRpcFBvc2l0aW9uXT1cInRvb2dsZUFsbENoZWNrYm94VG9vbHRpcFBvc2l0aW9uXCJcbiAgICAoY2hhbmdlKT1cIl9lbWl0U2VsZWN0QWxsQm9vbGVhblRvUGFyZW50KCRldmVudC5jaGVja2VkKVwiPjwvbm92by1jaGVja2JveD5cblxuICA8bm92by1pY29uXG4gICAgbm92b1ByZWZpeFxuICAgIGNsYXNzPVwibm92by1zZWxlY3Qtc2VhcmNoLWljb25cIj5zZWFyY2g8L25vdm8taWNvbj5cblxuICA8aW5wdXQgY2xhc3M9XCJub3ZvLXNlbGVjdC1zZWFyY2gtaW5wdXRcIlxuICAgICNzZWFyY2hTZWxlY3RJbnB1dFxuICAgIG5vdm9JbnB1dFxuICAgIFtuYW1lXT1cIm5hbWVcIlxuICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgW3R5cGVdPVwidHlwZVwiXG4gICAgW2Zvcm1Db250cm9sXT1cIl9mb3JtQ29udHJvbFwiXG4gICAgKGtleWRvd24pPVwiX2hhbmRsZUtleWRvd24oJGV2ZW50KVwiXG4gICAgKGtleXVwKT1cIl9oYW5kbGVLZXl1cCgkZXZlbnQpXCJcbiAgICAoYmx1cik9XCJvbkJsdXIoKVwiXG4gICAgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyTGFiZWxcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCIgLz5cblxuICA8bm92by1zcGlubmVyICpuZ0lmPVwic2VhcmNoaW5nXCJcbiAgICBub3ZvU3VmZml4XG4gICAgY2xhc3M9XCJub3ZvLXNlbGVjdC1zZWFyY2gtc3Bpbm5lclwiXG4gICAgZGlhbWV0ZXI9XCIxNlwiPjwvbm92by1zcGlubmVyPlxuXG4gIDxub3ZvLWJ1dHRvblxuICAgIG5vdm9TdWZmaXhcbiAgICAqbmdJZj1cIiFoaWRlQ2xlYXJTZWFyY2hCdXR0b24gJiYgdmFsdWUgJiYgIXNlYXJjaGluZ1wiXG4gICAgYXJpYS1sYWJlbD1cIkNsZWFyXCJcbiAgICAoY2xpY2spPVwiX3Jlc2V0KHRydWUpXCJcbiAgICB0aGVtZT1cImljb25cIlxuICAgIHNpemU9XCJzbWFsbFwiXG4gICAgY2xhc3M9XCJub3ZvLXNlbGVjdC1zZWFyY2gtY2xlYXJcIj5cbiAgICA8bmctY29udGVudCAqbmdJZj1cImNsZWFySWNvbjsgZWxzZSBkZWZhdWx0SWNvblwiIHNlbGVjdD1cIltub3ZvU2VsZWN0U2VhcmNoQ2xlYXJdXCI+PC9uZy1jb250ZW50PlxuICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdEljb24+XG4gICAgICA8bm92by1pY29uPmNsb3NlPC9ub3ZvLWljb24+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC9ub3ZvLWJ1dHRvbj5cblxuICA8bmctY29udGVudCBzZWxlY3Q9XCIubm92by1zZWxlY3Qtc2VhcmNoLWN1c3RvbS1oZWFkZXItY29udGVudFwiPjwvbmctY29udGVudD5cblxuPC9ub3ZvLWZpZWxkPlxuXG48ZGl2ICpuZ0lmPVwiX3Nob3dOb0VudHJpZXNGb3VuZCQgfCBhc3luY1wiXG4gIGNsYXNzPVwibm92by1zZWxlY3Qtc2VhcmNoLW5vLWVudHJpZXMtZm91bmRcIj5cbiAge3tub0VudHJpZXNGb3VuZExhYmVsfX1cbjwvZGl2PiJdfQ==