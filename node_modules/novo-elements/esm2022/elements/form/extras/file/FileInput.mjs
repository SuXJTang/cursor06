import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Optional, Output, Self, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState } from 'novo-elements/elements/common';
import { NovoFieldControl } from 'novo-elements/elements/field';
import { GlobalRef, NovoLabelService } from 'novo-elements/services';
import { NovoFile } from './extras/file/File';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "novo-elements/elements/common";
import * as i3 from "@angular/forms";
import * as i4 from "@angular/common";
import * as i5 from "novo-elements/elements/button";
import * as i6 from "novo-elements/elements/loading";
import * as i7 from "@angular/cdk/drag-drop";
import * as i8 from "novo-elements/pipes";
// Value accessor for the component (supports ngModel)
// const FILE_VALUE_ACCESSOR = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => NovoFileInputElement),
//   multi: true,
// };
const LAYOUT_DEFAULTS = { order: 'default', download: true, removable: true, labelStyle: 'default', draggable: false };
// make file-input ids unique
let nextId = 0;
class NovoFileInputBase {
    constructor(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl) {
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
}
const NovoFileInputMixins = mixinErrorState(NovoFileInputBase);
export class NovoFileInputElement extends NovoFileInputMixins {
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get disabled() {
        return this.ngControl ? !!this.ngControl.disabled : this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * Implemented as part of NovoFieldControl.
     * @docs-private
     */
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    /** Implemented as part of NovoFieldControl. */
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    constructor(labels, globalRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, _ngControl) {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, _ngControl);
        this.labels = labels;
        this.globalRef = globalRef;
        this._uniqueId = `novo-file-input-${++nextId}`;
        /** Tab index for the chip list. */
        this._tabIndex = 0;
        /** User defined tab index. */
        this._userTabIndex = null;
        this.controlType = 'file-input';
        /** @docs-private Implemented as part of NovoFieldControl. */
        this.lastKeyValue = null;
        this.id = this._uniqueId;
        this.tabindex = 0;
        this.multiple = false;
        this.value = [];
        this.edit = new EventEmitter();
        this.save = new EventEmitter();
        this.delete = new EventEmitter();
        this.upload = new EventEmitter();
        this.files = [];
        this.active = false;
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this._name = this._uniqueId;
        this._value = false;
        this._required = false;
        this._disabled = false;
        if (_ngControl) {
            _ngControl.valueAccessor = this;
        }
    }
    ngOnInit() {
        this.updateLayout();
        this.setInitialFileList();
        this.dataFeatureId = this.dataFeatureId ? this.dataFeatureId : this.name;
    }
    updateLayout() {
        this.layoutOptions = Object.assign({}, LAYOUT_DEFAULTS, this.layoutOptions);
        this.insertTemplatesBasedOnLayout();
    }
    insertTemplatesBasedOnLayout() {
        let order;
        switch (this.layoutOptions.order) {
            case 'displayFilesBelow':
                order = ['fileInput', 'fileOutput'];
                break;
            default:
                order = ['fileOutput', 'fileInput'];
        }
        order.forEach((template) => {
            this.container.createEmbeddedView(this[template], 0);
        });
        return order;
    }
    get outputFileDraggingDisabled() {
        const draggable = this.layoutOptions?.draggable;
        return draggable != null && !draggable;
    }
    setInitialFileList() {
        if (this.value) {
            this.files = this.value;
        }
    }
    dragEnterHandler(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        this.target = event.target;
        this.active = true;
    }
    dragLeaveHandler(event) {
        event.preventDefault();
        if (this.target === event.target) {
            this.active = false;
        }
    }
    dragOverHandler(event) {
        event.preventDefault();
        // no-op
    }
    dropHandler(event) {
        event.preventDefault();
        this.visible = false;
        if (event.dataTransfer.types[0] !== 'Files') {
            return;
        }
        const options = this.layoutOptions;
        const filelist = Array.from(event.dataTransfer.files);
        if (options.customActions) {
            this.upload.emit(this.multiple ? filelist : [filelist[0]]);
        }
        else {
            this.process(this.multiple ? filelist : [filelist[0]]);
        }
        this.active = false;
    }
    dropOutputItem(event) {
        moveItemInArray(this.files, event.previousIndex, event.currentIndex);
    }
    writeValue(model) {
        this.model = model;
        // If model is cleared programmatically (E.g. form.patchValue({file: undefined})), empty file list.
        this.files = !model ? [] : this.files;
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    check(event) {
        this.process(Array.from(event.target.files));
        // After processing file upload, clear input element value. Allows for delete and upload of same file.
        event.target.value = '';
    }
    validate(files) {
        let passedValidation = true;
        if (this.layoutOptions.customValidation) {
            this.layoutOptions.customValidation
                .filter((validation) => validation.action === 'upload')
                .forEach((uploadValidation) => {
                passedValidation = uploadValidation.fn(files) && passedValidation;
            });
        }
        return passedValidation;
    }
    process(filelist) {
        if (this.validate(filelist)) {
            Promise.all(filelist.map((file) => this.readFile(file))).then((files) => {
                if (this.multiple) {
                    this.files.push(...files);
                }
                else {
                    this.files = files;
                }
                this.model = this.files;
                this.onModelChange(this.model);
            });
        }
    }
    download(file) {
        // Using an injected instance of window to make sure that unit tests do not open a new window, even accidentally
        this.globalRef.nativeWindow.open(file.dataURL, '_blank');
    }
    remove(file) {
        this.files.splice(this.files.findIndex((f) => f.name === file.name && f.size === file.size), 1);
        this.model = this.files;
        this.onModelChange(this.model);
    }
    readFile(file) {
        return new NovoFile(file).read();
    }
    customEdit(file) {
        this.edit.emit(file);
    }
    customSave(file) {
        this.save.emit(file);
    }
    customDelete(file) {
        this.delete.emit(file);
    }
    customCheck(event) {
        this.upload.emit(event);
    }
    setDisabledState(disabled) {
        this.disabled = disabled;
    }
    /** Whether any radio buttons has focus. */
    get focused() {
        // todo: implement this.
        return false;
    }
    /** Implemented as part of NovoFieldControl. */
    get empty() {
        return this.value === null;
    }
    /** Implemented as part of NovoFieldControl. */
    get shouldLabelFloat() {
        return !this.empty || this.focused;
    }
    /** Implemented as part of NovoFieldControl. */
    setDescribedByIds(ids) {
        this._ariaDescribedby = ids.join(' ');
    }
    /** Implemented as part of NovoFieldControl. */
    onContainerClick(event) {
        this.focus();
    }
    /**
     * Focuses the first non-disabled chip in this chip list, or the associated input when there
     * are no eligible chips.
     */
    focus(options) {
        if (this.disabled) {
            return;
        }
        // TODO
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFileInputElement, deps: [{ token: i1.NovoLabelService }, { token: i1.GlobalRef }, { token: i2.ErrorStateMatcher }, { token: i3.NgForm, optional: true }, { token: i3.FormGroupDirective, optional: true }, { token: i3.NgControl, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoFileInputElement, selector: "novo-file-input", inputs: { id: "id", tabindex: "tabindex", errorStateMatcher: "errorStateMatcher", multiple: "multiple", layoutOptions: "layoutOptions", value: "value", dataFeatureId: "dataFeatureId", name: "name", disabled: "disabled", required: "required", placeholder: "placeholder" }, outputs: { edit: "edit", save: "save", delete: "delete", upload: "upload" }, host: { listeners: { "dragenter": "dragEnterHandler($event)", "dragleave": "dragLeaveHandler($event)", "dragover": "dragOverHandler($event)", "drop": "dropHandler($event)" }, properties: { "class.disabled": "this.disabled" } }, providers: [{ provide: NovoFieldControl, useExisting: NovoFileInputElement }], viewQueries: [{ propertyName: "fileInput", first: true, predicate: ["fileInput"], descendants: true, static: true }, { propertyName: "fileOutput", first: true, predicate: ["fileOutput"], descendants: true, static: true }, { propertyName: "container", first: true, predicate: ["container"], descendants: true, read: ViewContainerRef, static: true }, { propertyName: "inputElement", first: true, predicate: ["inputElement"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<div #container></div>\n<ng-template #fileInput>\n  <div class=\"file-input-group\" [class.disabled]=\"disabled\" [class.active]=\"active\">\n    <input\n      #inputElement\n      *ngIf=\"!layoutOptions.customActions\"\n      type=\"file\"\n      [name]=\"name\"\n      [attr.id]=\"name\"\n      (change)=\"check($event)\"\n      [attr.multiple]=\"multiple\"\n      tabindex=\"-1\"\n      [attr.data-feature-id]=\"dataFeatureId\"\n    />\n    <input\n      #inputElement\n      *ngIf=\"layoutOptions.customActions\"\n      type=\"file\"\n      [name]=\"name\"\n      [attr.id]=\"name\"\n      (change)=\"customCheck($event)\"\n      [attr.multiple]=\"multiple\"\n      tabindex=\"-1\"\n      [attr.data-feature-id]=\"dataFeatureId\"\n    />\n    <section [ngSwitch]=\"layoutOptions.labelStyle\">\n      <label *ngSwitchCase=\"'no-box'\" [attr.for]=\"name\" class=\"no-box\">\n        <div>\n          <i class=\"bhi-dropzone\"></i>{{ placeholder || labels.chooseAFile }} {{ labels.or }}\n          <strong class=\"link\">{{ labels.clickToBrowse }}</strong>\n        </div>\n      </label>\n      <label *ngSwitchDefault [attr.for]=\"name\" class=\"boxed\">\n        <span>{{ placeholder || labels.chooseAFile }}</span>\n        <small\n          >{{ labels.or }} <strong class=\"link\">{{ labels.clickToBrowse }}</strong></small\n        >\n      </label>\n    </section>\n  </div>\n</ng-template>\n<ng-template #fileOutput>\n  <div class=\"file-output-group\" cdkDropList [cdkDropListDisabled]=\"outputFileDraggingDisabled\" (cdkDropListDropped)=\"dropOutputItem($event)\">\n    <div class=\"file-item\" cdkDrag *ngFor=\"let file of files\" [class.disabled]=\"disabled\">\n      <i *ngIf=\"layoutOptions.draggable\" class=\"bhi-move\"></i>\n      <label *ngIf=\"file.link\"\n        ><span\n          ><a href=\"{{ file.link }}\" target=\"_blank\">{{ file.name | decodeURI }}</a></span\n        ><span *ngIf=\"file.description\">||</span><span>{{ file.description }}</span></label\n      >\n      <label *ngIf=\"!file.link\">{{ file.name | decodeURI }}</label>\n      <div class=\"actions\" [attr.data-automation-id]=\"'file-actions'\" *ngIf=\"file.loaded\">\n        <div *ngIf=\"!layoutOptions.customActions\">\n          <button\n            *ngIf=\"layoutOptions.download\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"save\"\n            (click)=\"download(file)\"\n            [attr.data-automation-id]=\"'file-download'\"\n            tabindex=\"-1\"\n          ></button>\n          <button\n            *ngIf=\"!disabled && (layoutOptions.removable || (!layoutOptions.removable && layoutOptions.removableWhenNew && !file.link))\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"close\"\n            (click)=\"remove(file)\"\n            [attr.data-automation-id]=\"'file-remove'\"\n            tabindex=\"-1\"\n          ></button>\n        </div>\n        <div *ngIf=\"layoutOptions.customActions\">\n          <button\n            *ngIf=\"layoutOptions.edit && !disabled\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"edit\"\n            (click)=\"customEdit(file)\"\n            [attr.data-automation-id]=\"'file-edit'\"\n            tabindex=\"-1\"\n          ></button>\n          <button\n            *ngIf=\"layoutOptions.download\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"save\"\n            (click)=\"customSave(file)\"\n            [attr.data-automation-id]=\"'file-download'\"\n            tabindex=\"-1\"\n          ></button>\n          <button\n            *ngIf=\"!disabled\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"close\"\n            (click)=\"customDelete(file)\"\n            [attr.data-automation-id]=\"'file-remove'\"\n            tabindex=\"-1\"\n          ></button>\n        </div>\n      </div>\n      <novo-loading *ngIf=\"!file.loaded\"></novo-loading>\n    </div>\n  </div>\n</ng-template>", styles: ["novo-file-input{display:flex;flex-flow:row wrap}novo-file-input .files-below{padding-top:10px}novo-file-input .file-output-group{width:100%;margin-top:15px}novo-file-input .file-output-group .file-item{background-color:#fff;box-shadow:0 1px 4px #00000026,0 2px 10px #00000017;padding:4px 12px;display:flex;flex-flow:row nowrap;align-items:center;margin-bottom:15px;position:relative;width:100%}novo-file-input .file-output-group .file-item i.bhi-move{color:#9e9e9e;padding-right:.75em;padding-bottom:4px;font-size:2em;cursor:-webkit-grab;cursor:grab}novo-file-input .file-output-group .file-item label{flex:1;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}novo-file-input .file-output-group .file-item label span{margin:0 8px}novo-file-input .file-output-group .file-item button{font-size:1.4rem;width:42px;height:42px;padding:4px;color:#9e9e9e}novo-file-input .file-output-group .file-item button:hover,novo-file-input .file-output-group .file-item button:focus,novo-file-input .file-output-group .file-item button.active{background:none;color:#4a89dc}novo-file-input .file-output-group .file-item.disabled{box-shadow:none;border:2px dashed #9e9e9e}novo-file-input .file-output-group.cdk-drop-list-dragging{cursor:grabbing}novo-file-input .file-output-group.cdk-drop-list-dragging .file-item{transition:transform .25s cubic-bezier(0,0,.2,1)}novo-file-input .file-input-group{cursor:pointer;width:100%;position:relative}novo-file-input .file-input-group input[type=file]{opacity:0;position:absolute;width:100%!important;height:100%!important;cursor:pointer}novo-file-input .file-input-group:hover label.boxed,novo-file-input .file-input-group.active label.boxed{border:2px dashed #4a89dc}novo-file-input .file-input-group.disabled{opacity:.3;pointer-events:none}novo-file-input .file-input-group label{color:#9e9e9e;margin-left:0;transition:all .2s ease-in-out;display:flex;flex-flow:column;align-items:center;position:relative;padding:15px;cursor:pointer;pointer-events:none}novo-file-input .file-input-group label strong{color:#4a89dc}novo-file-input .file-input-group label small{margin-top:7px}novo-file-input .file-input-group label i.bhi-dropzone{float:left;margin:-17px .25em 0 0}novo-file-input .file-input-group label.boxed{border:2px dashed #9e9e9e}novo-file-input .file-input-group label i{font-size:3em}novo-file-input novo-loading{padding:10px;transform:scale(.8)}.gu-mirror .actions button{display:none}.cdk-drag-preview.file-item{cursor:grab;background-color:#fff;box-shadow:0 1px 4px #00000026,0 2px 10px #00000017;padding:4px 12px;display:flex;flex-flow:row nowrap;align-items:center}.cdk-drag-preview.file-item i.bhi-move{color:#9e9e9e;padding-right:.75em;padding-bottom:4px;font-size:2em;cursor:-webkit-grab;cursor:grab}.cdk-drag-preview.file-item label{flex:1;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.cdk-drag-preview.file-item label span{margin:0 8px}.cdk-drag-preview.file-item button{font-size:1.4rem;width:42px;height:42px;padding:4px;color:#9e9e9e}.cdk-drag-placeholder.file-item{opacity:0}.cdk-drag-animating.file-item{transition:transform .25s cubic-bezier(0,0,.2,1)}\n"], dependencies: [{ kind: "directive", type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i4.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i4.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "component", type: i5.NovoButtonElement, selector: "novo-button,button[theme]", inputs: ["color", "side", "size", "theme", "loading", "icon", "secondIcon", "disabled"] }, { kind: "component", type: i6.NovoLoadingElement, selector: "novo-loading", inputs: ["theme", "color", "size"] }, { kind: "directive", type: i7.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i7.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "pipe", type: i8.DecodeURIPipe, name: "decodeURI" }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoFileInputElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-file-input', providers: [{ provide: NovoFieldControl, useExisting: NovoFileInputElement }], encapsulation: ViewEncapsulation.None, template: "<div #container></div>\n<ng-template #fileInput>\n  <div class=\"file-input-group\" [class.disabled]=\"disabled\" [class.active]=\"active\">\n    <input\n      #inputElement\n      *ngIf=\"!layoutOptions.customActions\"\n      type=\"file\"\n      [name]=\"name\"\n      [attr.id]=\"name\"\n      (change)=\"check($event)\"\n      [attr.multiple]=\"multiple\"\n      tabindex=\"-1\"\n      [attr.data-feature-id]=\"dataFeatureId\"\n    />\n    <input\n      #inputElement\n      *ngIf=\"layoutOptions.customActions\"\n      type=\"file\"\n      [name]=\"name\"\n      [attr.id]=\"name\"\n      (change)=\"customCheck($event)\"\n      [attr.multiple]=\"multiple\"\n      tabindex=\"-1\"\n      [attr.data-feature-id]=\"dataFeatureId\"\n    />\n    <section [ngSwitch]=\"layoutOptions.labelStyle\">\n      <label *ngSwitchCase=\"'no-box'\" [attr.for]=\"name\" class=\"no-box\">\n        <div>\n          <i class=\"bhi-dropzone\"></i>{{ placeholder || labels.chooseAFile }} {{ labels.or }}\n          <strong class=\"link\">{{ labels.clickToBrowse }}</strong>\n        </div>\n      </label>\n      <label *ngSwitchDefault [attr.for]=\"name\" class=\"boxed\">\n        <span>{{ placeholder || labels.chooseAFile }}</span>\n        <small\n          >{{ labels.or }} <strong class=\"link\">{{ labels.clickToBrowse }}</strong></small\n        >\n      </label>\n    </section>\n  </div>\n</ng-template>\n<ng-template #fileOutput>\n  <div class=\"file-output-group\" cdkDropList [cdkDropListDisabled]=\"outputFileDraggingDisabled\" (cdkDropListDropped)=\"dropOutputItem($event)\">\n    <div class=\"file-item\" cdkDrag *ngFor=\"let file of files\" [class.disabled]=\"disabled\">\n      <i *ngIf=\"layoutOptions.draggable\" class=\"bhi-move\"></i>\n      <label *ngIf=\"file.link\"\n        ><span\n          ><a href=\"{{ file.link }}\" target=\"_blank\">{{ file.name | decodeURI }}</a></span\n        ><span *ngIf=\"file.description\">||</span><span>{{ file.description }}</span></label\n      >\n      <label *ngIf=\"!file.link\">{{ file.name | decodeURI }}</label>\n      <div class=\"actions\" [attr.data-automation-id]=\"'file-actions'\" *ngIf=\"file.loaded\">\n        <div *ngIf=\"!layoutOptions.customActions\">\n          <button\n            *ngIf=\"layoutOptions.download\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"save\"\n            (click)=\"download(file)\"\n            [attr.data-automation-id]=\"'file-download'\"\n            tabindex=\"-1\"\n          ></button>\n          <button\n            *ngIf=\"!disabled && (layoutOptions.removable || (!layoutOptions.removable && layoutOptions.removableWhenNew && !file.link))\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"close\"\n            (click)=\"remove(file)\"\n            [attr.data-automation-id]=\"'file-remove'\"\n            tabindex=\"-1\"\n          ></button>\n        </div>\n        <div *ngIf=\"layoutOptions.customActions\">\n          <button\n            *ngIf=\"layoutOptions.edit && !disabled\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"edit\"\n            (click)=\"customEdit(file)\"\n            [attr.data-automation-id]=\"'file-edit'\"\n            tabindex=\"-1\"\n          ></button>\n          <button\n            *ngIf=\"layoutOptions.download\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"save\"\n            (click)=\"customSave(file)\"\n            [attr.data-automation-id]=\"'file-download'\"\n            tabindex=\"-1\"\n          ></button>\n          <button\n            *ngIf=\"!disabled\"\n            type=\"button\"\n            theme=\"icon\"\n            icon=\"close\"\n            (click)=\"customDelete(file)\"\n            [attr.data-automation-id]=\"'file-remove'\"\n            tabindex=\"-1\"\n          ></button>\n        </div>\n      </div>\n      <novo-loading *ngIf=\"!file.loaded\"></novo-loading>\n    </div>\n  </div>\n</ng-template>", styles: ["novo-file-input{display:flex;flex-flow:row wrap}novo-file-input .files-below{padding-top:10px}novo-file-input .file-output-group{width:100%;margin-top:15px}novo-file-input .file-output-group .file-item{background-color:#fff;box-shadow:0 1px 4px #00000026,0 2px 10px #00000017;padding:4px 12px;display:flex;flex-flow:row nowrap;align-items:center;margin-bottom:15px;position:relative;width:100%}novo-file-input .file-output-group .file-item i.bhi-move{color:#9e9e9e;padding-right:.75em;padding-bottom:4px;font-size:2em;cursor:-webkit-grab;cursor:grab}novo-file-input .file-output-group .file-item label{flex:1;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}novo-file-input .file-output-group .file-item label span{margin:0 8px}novo-file-input .file-output-group .file-item button{font-size:1.4rem;width:42px;height:42px;padding:4px;color:#9e9e9e}novo-file-input .file-output-group .file-item button:hover,novo-file-input .file-output-group .file-item button:focus,novo-file-input .file-output-group .file-item button.active{background:none;color:#4a89dc}novo-file-input .file-output-group .file-item.disabled{box-shadow:none;border:2px dashed #9e9e9e}novo-file-input .file-output-group.cdk-drop-list-dragging{cursor:grabbing}novo-file-input .file-output-group.cdk-drop-list-dragging .file-item{transition:transform .25s cubic-bezier(0,0,.2,1)}novo-file-input .file-input-group{cursor:pointer;width:100%;position:relative}novo-file-input .file-input-group input[type=file]{opacity:0;position:absolute;width:100%!important;height:100%!important;cursor:pointer}novo-file-input .file-input-group:hover label.boxed,novo-file-input .file-input-group.active label.boxed{border:2px dashed #4a89dc}novo-file-input .file-input-group.disabled{opacity:.3;pointer-events:none}novo-file-input .file-input-group label{color:#9e9e9e;margin-left:0;transition:all .2s ease-in-out;display:flex;flex-flow:column;align-items:center;position:relative;padding:15px;cursor:pointer;pointer-events:none}novo-file-input .file-input-group label strong{color:#4a89dc}novo-file-input .file-input-group label small{margin-top:7px}novo-file-input .file-input-group label i.bhi-dropzone{float:left;margin:-17px .25em 0 0}novo-file-input .file-input-group label.boxed{border:2px dashed #9e9e9e}novo-file-input .file-input-group label i{font-size:3em}novo-file-input novo-loading{padding:10px;transform:scale(.8)}.gu-mirror .actions button{display:none}.cdk-drag-preview.file-item{cursor:grab;background-color:#fff;box-shadow:0 1px 4px #00000026,0 2px 10px #00000017;padding:4px 12px;display:flex;flex-flow:row nowrap;align-items:center}.cdk-drag-preview.file-item i.bhi-move{color:#9e9e9e;padding-right:.75em;padding-bottom:4px;font-size:2em;cursor:-webkit-grab;cursor:grab}.cdk-drag-preview.file-item label{flex:1;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.cdk-drag-preview.file-item label span{margin:0 8px}.cdk-drag-preview.file-item button{font-size:1.4rem;width:42px;height:42px;padding:4px;color:#9e9e9e}.cdk-drag-placeholder.file-item{opacity:0}.cdk-drag-animating.file-item{transition:transform .25s cubic-bezier(0,0,.2,1)}\n"] }]
        }], ctorParameters: () => [{ type: i1.NovoLabelService }, { type: i1.GlobalRef }, { type: i2.ErrorStateMatcher }, { type: i3.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i3.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i3.NgControl, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }], propDecorators: { id: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], errorStateMatcher: [{
                type: Input
            }], fileInput: [{
                type: ViewChild,
                args: ['fileInput', { static: true }]
            }], fileOutput: [{
                type: ViewChild,
                args: ['fileOutput', { static: true }]
            }], container: [{
                type: ViewChild,
                args: ['container', { read: ViewContainerRef, static: true }]
            }], inputElement: [{
                type: ViewChild,
                args: ['inputElement']
            }], multiple: [{
                type: Input
            }], layoutOptions: [{
                type: Input
            }], value: [{
                type: Input
            }], dataFeatureId: [{
                type: Input
            }], edit: [{
                type: Output
            }], save: [{
                type: Output
            }], delete: [{
                type: Output
            }], upload: [{
                type: Output
            }], name: [{
                type: Input
            }], disabled: [{
                type: HostBinding,
                args: ['class.disabled']
            }, {
                type: Input
            }], required: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], dragEnterHandler: [{
                type: HostListener,
                args: ['dragenter', ['$event']]
            }], dragLeaveHandler: [{
                type: HostListener,
                args: ['dragleave', ['$event']]
            }], dragOverHandler: [{
                type: HostListener,
                args: ['dragover', ['$event']]
            }], dropHandler: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZUlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvZm9ybS9leHRyYXMvZmlsZS9GaWxlSW5wdXQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9mb3JtL2V4dHJhcy9maWxlL0ZpbGVJbnB1dC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzlELE9BQU8sRUFBZSxlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osV0FBVyxFQUNYLFlBQVksRUFDWixLQUFLLEVBRUwsUUFBUSxFQUNSLE1BQU0sRUFDTixJQUFJLEVBQ0osV0FBVyxFQUNYLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0Isa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdGLE9BQU8sRUFBMkIsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDNUcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7Ozs7Ozs7OztBQUU5QyxzREFBc0Q7QUFDdEQsZ0NBQWdDO0FBQ2hDLGdDQUFnQztBQUNoQyx5REFBeUQ7QUFDekQsaUJBQWlCO0FBQ2pCLEtBQUs7QUFFTCxNQUFNLGVBQWUsR0FBRyxFQUFFLEtBQUss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QVk7dUJBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQVNyQyxlQUFlO3NCQURkLFlBQVk7dUJBQUMsVUFBVSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQU9wQyxXQUFXO3NCQURWLFlBQVk7dUJBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBGb2N1c0tleU1hbmFnZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgQ2RrRHJhZ0Ryb3AsIG1vdmVJdGVtSW5BcnJheSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIEZvcm1Hcm91cERpcmVjdGl2ZSwgTmdDb250cm9sLCBOZ0Zvcm0gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvciwgRXJyb3JTdGF0ZU1hdGNoZXIsIG1peGluRXJyb3JTdGF0ZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvZWxlbWVudHMvY29tbW9uJztcbmltcG9ydCB7IE5vdm9GaWVsZENvbnRyb2wgfSBmcm9tICdub3ZvLWVsZW1lbnRzL2VsZW1lbnRzL2ZpZWxkJztcbmltcG9ydCB7IEdsb2JhbFJlZiwgTm92b0xhYmVsU2VydmljZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvc2VydmljZXMnO1xuaW1wb3J0IHsgTm92b0ZpbGUgfSBmcm9tICcuL2V4dHJhcy9maWxlL0ZpbGUnO1xuXG4vLyBWYWx1ZSBhY2Nlc3NvciBmb3IgdGhlIGNvbXBvbmVudCAoc3VwcG9ydHMgbmdNb2RlbClcbi8vIGNvbnN0IEZJTEVfVkFMVUVfQUNDRVNTT1IgPSB7XG4vLyAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuLy8gICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOb3ZvRmlsZUlucHV0RWxlbWVudCksXG4vLyAgIG11bHRpOiB0cnVlLFxuLy8gfTtcblxuY29uc3QgTEFZT1VUX0RFRkFVTFRTID0geyBvcmRlcjogJ2RlZmF1bHQnLCBkb3dubG9hZDogdHJ1ZSwgcmVtb3ZhYmxlOiB0cnVlLCBsYWJlbFN0eWxlOiAnZGVmYXVsdCcsIGRyYWdnYWJsZTogZmFsc2UgfTtcbi8vIG1ha2UgZmlsZS1pbnB1dCBpZHMgdW5pcXVlXG5sZXQgbmV4dElkID0gMDtcblxuY2xhc3MgTm92b0ZpbGVJbnB1dEJhc2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wsXG4gICkge31cbn1cbmNvbnN0IE5vdm9GaWxlSW5wdXRNaXhpbnM6IENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICYgdHlwZW9mIE5vdm9GaWxlSW5wdXRCYXNlID0gbWl4aW5FcnJvclN0YXRlKE5vdm9GaWxlSW5wdXRCYXNlKTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1maWxlLWlucHV0JyxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOb3ZvRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTm92b0ZpbGVJbnB1dEVsZW1lbnQgfV0sXG4gIHRlbXBsYXRlVXJsOiAnLi9GaWxlSW5wdXQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL0ZpbGVJbnB1dC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE5vdm9GaWxlSW5wdXRFbGVtZW50IGV4dGVuZHMgTm92b0ZpbGVJbnB1dE1peGlucyBpbXBsZW1lbnRzIE5vdm9GaWVsZENvbnRyb2w8YW55PiwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCB7XG4gIHByaXZhdGUgX3VuaXF1ZUlkOiBzdHJpbmcgPSBgbm92by1maWxlLWlucHV0LSR7KytuZXh0SWR9YDtcbiAgLyoqIFRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgY2hpcCBsaXN0IGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG4gIC8qKiBUYWIgaW5kZXggZm9yIHRoZSBjaGlwIGxpc3QuICovXG4gIF90YWJJbmRleCA9IDA7XG4gIC8qKiBVc2VyIGRlZmluZWQgdGFiIGluZGV4LiAqL1xuICBfdXNlclRhYkluZGV4OiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgLyoqIFRoZSBGb2N1c0tleU1hbmFnZXIgd2hpY2ggaGFuZGxlcyBmb2N1cy4gKi9cbiAgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxOb3ZvRmlsZUlucHV0RWxlbWVudD47XG5cbiAgcmVhZG9ubHkgY29udHJvbFR5cGU6IHN0cmluZyA9ICdmaWxlLWlucHV0JztcbiAgLyoqIEBkb2NzLXByaXZhdGUgSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBOb3ZvRmllbGRDb250cm9sLiAqL1xuICBsYXN0S2V5VmFsdWU6IHN0cmluZyA9IG51bGw7XG4gIC8qKiBAZG9jcy1wcml2YXRlIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTm92b0ZpZWxkQ29udHJvbC4qL1xuICBsYXN0Q2FyZXRQb3NpdGlvbjogbnVtYmVyIHwgbnVsbDtcblxuICBASW5wdXQoKSBpZDogc3RyaW5nID0gdGhpcy5fdW5pcXVlSWQ7XG4gIEBJbnB1dCgpIHRhYmluZGV4OiBudW1iZXIgPSAwO1xuICAvKiogQW4gb2JqZWN0IHVzZWQgdG8gY29udHJvbCB3aGVuIGVycm9yIG1lc3NhZ2VzIGFyZSBzaG93bi4gKi9cbiAgQElucHV0KCkgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuXG4gIC8vIC0tLS0tLS0tLS1cbiAgQFZpZXdDaGlsZCgnZmlsZUlucHV0JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgZmlsZUlucHV0OiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAVmlld0NoaWxkKCdmaWxlT3V0cHV0JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgZmlsZU91dHB1dDogVGVtcGxhdGVSZWY8YW55PjtcbiAgQFZpZXdDaGlsZCgnY29udGFpbmVyJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgY29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAVmlld0NoaWxkKCdpbnB1dEVsZW1lbnQnKSBpbnB1dEVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgQElucHV0KClcbiAgbXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBsYXlvdXRPcHRpb25zOiB7XG4gICAgb3JkZXI/OiBzdHJpbmc7XG4gICAgZG93bmxvYWQ/OiBib29sZWFuO1xuICAgIGVkaXQ/OiBib29sZWFuO1xuICAgIGxhYmVsU3R5bGU/OiBzdHJpbmc7XG4gICAgZHJhZ2dhYmxlPzogYm9vbGVhbjtcbiAgICBjdXN0b21BY3Rpb25zPzogYm9vbGVhbjtcbiAgICByZW1vdmFibGU/OiBib29sZWFuO1xuICAgIGN1c3RvbVZhbGlkYXRpb24/OiB7IGFjdGlvbjogc3RyaW5nOyBmbjogRnVuY3Rpb24gfVtdO1xuICAgIHJlbW92YWJsZVdoZW5OZXc/OiBib29sZWFuO1xuICB9O1xuICBASW5wdXQoKVxuICB2YWx1ZTogQXJyYXk8YW55PiA9IFtdO1xuICBASW5wdXQoKVxuICBkYXRhRmVhdHVyZUlkOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgpXG4gIGVkaXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KClcbiAgc2F2ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKVxuICBkZWxldGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KClcbiAgdXBsb2FkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBmaWxlczogTm92b0ZpbGVbXSA9IFtdO1xuICBtb2RlbDogYW55O1xuICBhY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY29tbWFuZHM6IGFueTtcbiAgdmlzaWJsZTogYm9vbGVhbjtcbiAgdGFyZ2V0OiBhbnk7XG4gIGZpbGVPdXRwdXRCYWc6IHN0cmluZztcblxuICBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuICBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICBASW5wdXQoKVxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgc2V0IG5hbWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX25hbWUgPSB2YWx1ZTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuZGlzYWJsZWQnKVxuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubmdDb250cm9sID8gISF0aGlzLm5nQ29udHJvbC5kaXNhYmxlZCA6IHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE5vdm9GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7XG4gIH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE5vdm9GaWVsZENvbnRyb2wuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwbGFjZWhvbGRlcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgfVxuICBzZXQgcGxhY2Vob2xkZXIodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25hbWU6IHN0cmluZyA9IHRoaXMuX3VuaXF1ZUlkO1xuICBwcm90ZWN0ZWQgX3ZhbHVlOiBib29sZWFuID0gZmFsc2U7XG4gIHByb3RlY3RlZCBfcmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX3BsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGxhYmVsczogTm92b0xhYmVsU2VydmljZSxcbiAgICBwcml2YXRlIGdsb2JhbFJlZjogR2xvYmFsUmVmLFxuICAgIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgX25nQ29udHJvbDogTmdDb250cm9sLFxuICApIHtcbiAgICBzdXBlcihfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybSwgX3BhcmVudEZvcm1Hcm91cCwgX25nQ29udHJvbCk7XG4gICAgaWYgKF9uZ0NvbnRyb2wpIHtcbiAgICAgIF9uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy51cGRhdGVMYXlvdXQoKTtcbiAgICB0aGlzLnNldEluaXRpYWxGaWxlTGlzdCgpO1xuICAgIHRoaXMuZGF0YUZlYXR1cmVJZCA9IHRoaXMuZGF0YUZlYXR1cmVJZCA/IHRoaXMuZGF0YUZlYXR1cmVJZCA6IHRoaXMubmFtZTtcbiAgfVxuXG4gIHVwZGF0ZUxheW91dCgpIHtcbiAgICB0aGlzLmxheW91dE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBMQVlPVVRfREVGQVVMVFMsIHRoaXMubGF5b3V0T3B0aW9ucyk7XG4gICAgdGhpcy5pbnNlcnRUZW1wbGF0ZXNCYXNlZE9uTGF5b3V0KCk7XG4gIH1cblxuICBpbnNlcnRUZW1wbGF0ZXNCYXNlZE9uTGF5b3V0KCkge1xuICAgIGxldCBvcmRlcjtcbiAgICBzd2l0Y2ggKHRoaXMubGF5b3V0T3B0aW9ucy5vcmRlcikge1xuICAgICAgY2FzZSAnZGlzcGxheUZpbGVzQmVsb3cnOlxuICAgICAgICBvcmRlciA9IFsnZmlsZUlucHV0JywgJ2ZpbGVPdXRwdXQnXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBvcmRlciA9IFsnZmlsZU91dHB1dCcsICdmaWxlSW5wdXQnXTtcbiAgICB9XG4gICAgb3JkZXIuZm9yRWFjaCgodGVtcGxhdGUpID0+IHtcbiAgICAgIHRoaXMuY29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh0aGlzW3RlbXBsYXRlXSwgMCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9yZGVyO1xuICB9XG5cbiAgZ2V0IG91dHB1dEZpbGVEcmFnZ2luZ0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRyYWdnYWJsZSA9IHRoaXMubGF5b3V0T3B0aW9ucz8uZHJhZ2dhYmxlO1xuICAgIHJldHVybiBkcmFnZ2FibGUgIT0gbnVsbCAmJiAhZHJhZ2dhYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRJbml0aWFsRmlsZUxpc3QoKSB7XG4gICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMuZmlsZXMgPSB0aGlzLnZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pXG4gIGRyYWdFbnRlckhhbmRsZXIoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknO1xuICAgIHRoaXMudGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIFsnJGV2ZW50J10pXG4gIGRyYWdMZWF2ZUhhbmRsZXIoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLnRhcmdldCA9PT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdvdmVyJywgWyckZXZlbnQnXSlcbiAgZHJhZ092ZXJIYW5kbGVyKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAvLyBuby1vcFxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pXG4gIGRyb3BIYW5kbGVyKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyLnR5cGVzWzBdICE9PSAnRmlsZXMnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9wdGlvbnM6IGFueSA9IHRoaXMubGF5b3V0T3B0aW9ucztcbiAgICBjb25zdCBmaWxlbGlzdCA9IEFycmF5LmZyb20oZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzKTtcbiAgICBpZiAob3B0aW9ucy5jdXN0b21BY3Rpb25zKSB7XG4gICAgICB0aGlzLnVwbG9hZC5lbWl0KHRoaXMubXVsdGlwbGUgPyBmaWxlbGlzdCA6IFtmaWxlbGlzdFswXV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb2Nlc3ModGhpcy5tdWx0aXBsZSA/IGZpbGVsaXN0IDogW2ZpbGVsaXN0WzBdXSk7XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gIH1cblxuICBkcm9wT3V0cHV0SXRlbShldmVudDogQ2RrRHJhZ0Ryb3A8Tm92b0ZpbGVbXT4pIHtcbiAgICBtb3ZlSXRlbUluQXJyYXkodGhpcy5maWxlcywgZXZlbnQucHJldmlvdXNJbmRleCwgZXZlbnQuY3VycmVudEluZGV4KTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUobW9kZWw6IGFueSk6IHZvaWQge1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAvLyBJZiBtb2RlbCBpcyBjbGVhcmVkIHByb2dyYW1tYXRpY2FsbHkgKEUuZy4gZm9ybS5wYXRjaFZhbHVlKHtmaWxlOiB1bmRlZmluZWR9KSksIGVtcHR5IGZpbGUgbGlzdC5cbiAgICB0aGlzLmZpbGVzID0gIW1vZGVsID8gW10gOiB0aGlzLmZpbGVzO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIGNoZWNrKGV2ZW50KSB7XG4gICAgdGhpcy5wcm9jZXNzKEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LmZpbGVzKSk7XG4gICAgLy8gQWZ0ZXIgcHJvY2Vzc2luZyBmaWxlIHVwbG9hZCwgY2xlYXIgaW5wdXQgZWxlbWVudCB2YWx1ZS4gQWxsb3dzIGZvciBkZWxldGUgYW5kIHVwbG9hZCBvZiBzYW1lIGZpbGUuXG4gICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gJyc7XG4gIH1cblxuICB2YWxpZGF0ZShmaWxlcyk6IGJvb2xlYW4ge1xuICAgIGxldCBwYXNzZWRWYWxpZGF0aW9uID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5sYXlvdXRPcHRpb25zLmN1c3RvbVZhbGlkYXRpb24pIHtcbiAgICAgIHRoaXMubGF5b3V0T3B0aW9ucy5jdXN0b21WYWxpZGF0aW9uXG4gICAgICAgIC5maWx0ZXIoKHZhbGlkYXRpb24pID0+IHZhbGlkYXRpb24uYWN0aW9uID09PSAndXBsb2FkJylcbiAgICAgICAgLmZvckVhY2goKHVwbG9hZFZhbGlkYXRpb24pID0+IHtcbiAgICAgICAgICBwYXNzZWRWYWxpZGF0aW9uID0gdXBsb2FkVmFsaWRhdGlvbi5mbihmaWxlcykgJiYgcGFzc2VkVmFsaWRhdGlvbjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwYXNzZWRWYWxpZGF0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzKGZpbGVsaXN0KSB7XG4gICAgaWYgKHRoaXMudmFsaWRhdGUoZmlsZWxpc3QpKSB7XG4gICAgICBQcm9taXNlLmFsbChmaWxlbGlzdC5tYXAoKGZpbGUpID0+IHRoaXMucmVhZEZpbGUoZmlsZSkpKS50aGVuKChmaWxlcykgPT4ge1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMuZmlsZXMucHVzaCguLi5maWxlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5maWxlcyA9IGZpbGVzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubW9kZWwgPSB0aGlzLmZpbGVzO1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy5tb2RlbCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBkb3dubG9hZChmaWxlKSB7XG4gICAgLy8gVXNpbmcgYW4gaW5qZWN0ZWQgaW5zdGFuY2Ugb2Ygd2luZG93IHRvIG1ha2Ugc3VyZSB0aGF0IHVuaXQgdGVzdHMgZG8gbm90IG9wZW4gYSBuZXcgd2luZG93LCBldmVuIGFjY2lkZW50YWxseVxuICAgIHRoaXMuZ2xvYmFsUmVmLm5hdGl2ZVdpbmRvdy5vcGVuKGZpbGUuZGF0YVVSTCwgJ19ibGFuaycpO1xuICB9XG5cbiAgcmVtb3ZlKGZpbGUpIHtcbiAgICB0aGlzLmZpbGVzLnNwbGljZShcbiAgICAgIHRoaXMuZmlsZXMuZmluZEluZGV4KChmKSA9PiBmLm5hbWUgPT09IGZpbGUubmFtZSAmJiBmLnNpemUgPT09IGZpbGUuc2l6ZSksXG4gICAgICAxLFxuICAgICk7XG4gICAgdGhpcy5tb2RlbCA9IHRoaXMuZmlsZXM7XG4gICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMubW9kZWwpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkRmlsZShmaWxlKSB7XG4gICAgcmV0dXJuIG5ldyBOb3ZvRmlsZShmaWxlKS5yZWFkKCk7XG4gIH1cblxuICBjdXN0b21FZGl0KGZpbGUpIHtcbiAgICB0aGlzLmVkaXQuZW1pdChmaWxlKTtcbiAgfVxuXG4gIGN1c3RvbVNhdmUoZmlsZSkge1xuICAgIHRoaXMuc2F2ZS5lbWl0KGZpbGUpO1xuICB9XG5cbiAgY3VzdG9tRGVsZXRlKGZpbGUpIHtcbiAgICB0aGlzLmRlbGV0ZS5lbWl0KGZpbGUpO1xuICB9XG5cbiAgY3VzdG9tQ2hlY2soZXZlbnQpIHtcbiAgICB0aGlzLnVwbG9hZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoZGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogV2hldGhlciBhbnkgcmFkaW8gYnV0dG9ucyBoYXMgZm9jdXMuICovXG4gIGdldCBmb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIC8vIHRvZG86IGltcGxlbWVudCB0aGlzLlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE5vdm9GaWVsZENvbnRyb2wuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZSA9PT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE5vdm9GaWVsZENvbnRyb2wuICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5lbXB0eSB8fCB0aGlzLmZvY3VzZWQ7XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBOb3ZvRmllbGRDb250cm9sLiAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZGJ5ID0gaWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE5vdm9GaWVsZENvbnRyb2wuICovXG4gIG9uQ29udGFpbmVyQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmZvY3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgZmlyc3Qgbm9uLWRpc2FibGVkIGNoaXAgaW4gdGhpcyBjaGlwIGxpc3QsIG9yIHRoZSBhc3NvY2lhdGVkIGlucHV0IHdoZW4gdGhlcmVcbiAgICogYXJlIG5vIGVsaWdpYmxlIGNoaXBzLlxuICAgKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFRPRE9cbiAgfVxufVxuIiwiPGRpdiAjY29udGFpbmVyPjwvZGl2PlxuPG5nLXRlbXBsYXRlICNmaWxlSW5wdXQ+XG4gIDxkaXYgY2xhc3M9XCJmaWxlLWlucHV0LWdyb3VwXCIgW2NsYXNzLmRpc2FibGVkXT1cImRpc2FibGVkXCIgW2NsYXNzLmFjdGl2ZV09XCJhY3RpdmVcIj5cbiAgICA8aW5wdXRcbiAgICAgICNpbnB1dEVsZW1lbnRcbiAgICAgICpuZ0lmPVwiIWxheW91dE9wdGlvbnMuY3VzdG9tQWN0aW9uc1wiXG4gICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICBbbmFtZV09XCJuYW1lXCJcbiAgICAgIFthdHRyLmlkXT1cIm5hbWVcIlxuICAgICAgKGNoYW5nZSk9XCJjaGVjaygkZXZlbnQpXCJcbiAgICAgIFthdHRyLm11bHRpcGxlXT1cIm11bHRpcGxlXCJcbiAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgW2F0dHIuZGF0YS1mZWF0dXJlLWlkXT1cImRhdGFGZWF0dXJlSWRcIlxuICAgIC8+XG4gICAgPGlucHV0XG4gICAgICAjaW5wdXRFbGVtZW50XG4gICAgICAqbmdJZj1cImxheW91dE9wdGlvbnMuY3VzdG9tQWN0aW9uc1wiXG4gICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICBbbmFtZV09XCJuYW1lXCJcbiAgICAgIFthdHRyLmlkXT1cIm5hbWVcIlxuICAgICAgKGNoYW5nZSk9XCJjdXN0b21DaGVjaygkZXZlbnQpXCJcbiAgICAgIFthdHRyLm11bHRpcGxlXT1cIm11bHRpcGxlXCJcbiAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgW2F0dHIuZGF0YS1mZWF0dXJlLWlkXT1cImRhdGFGZWF0dXJlSWRcIlxuICAgIC8+XG4gICAgPHNlY3Rpb24gW25nU3dpdGNoXT1cImxheW91dE9wdGlvbnMubGFiZWxTdHlsZVwiPlxuICAgICAgPGxhYmVsICpuZ1N3aXRjaENhc2U9XCInbm8tYm94J1wiIFthdHRyLmZvcl09XCJuYW1lXCIgY2xhc3M9XCJuby1ib3hcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8aSBjbGFzcz1cImJoaS1kcm9wem9uZVwiPjwvaT57eyBwbGFjZWhvbGRlciB8fCBsYWJlbHMuY2hvb3NlQUZpbGUgfX0ge3sgbGFiZWxzLm9yIH19XG4gICAgICAgICAgPHN0cm9uZyBjbGFzcz1cImxpbmtcIj57eyBsYWJlbHMuY2xpY2tUb0Jyb3dzZSB9fTwvc3Ryb25nPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbGFiZWw+XG4gICAgICA8bGFiZWwgKm5nU3dpdGNoRGVmYXVsdCBbYXR0ci5mb3JdPVwibmFtZVwiIGNsYXNzPVwiYm94ZWRcIj5cbiAgICAgICAgPHNwYW4+e3sgcGxhY2Vob2xkZXIgfHwgbGFiZWxzLmNob29zZUFGaWxlIH19PC9zcGFuPlxuICAgICAgICA8c21hbGxcbiAgICAgICAgICA+e3sgbGFiZWxzLm9yIH19IDxzdHJvbmcgY2xhc3M9XCJsaW5rXCI+e3sgbGFiZWxzLmNsaWNrVG9Ccm93c2UgfX08L3N0cm9uZz48L3NtYWxsXG4gICAgICAgID5cbiAgICAgIDwvbGFiZWw+XG4gICAgPC9zZWN0aW9uPlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG48bmctdGVtcGxhdGUgI2ZpbGVPdXRwdXQ+XG4gIDxkaXYgY2xhc3M9XCJmaWxlLW91dHB1dC1ncm91cFwiIGNka0Ryb3BMaXN0IFtjZGtEcm9wTGlzdERpc2FibGVkXT1cIm91dHB1dEZpbGVEcmFnZ2luZ0Rpc2FibGVkXCIgKGNka0Ryb3BMaXN0RHJvcHBlZCk9XCJkcm9wT3V0cHV0SXRlbSgkZXZlbnQpXCI+XG4gICAgPGRpdiBjbGFzcz1cImZpbGUtaXRlbVwiIGNka0RyYWcgKm5nRm9yPVwibGV0IGZpbGUgb2YgZmlsZXNcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgIDxpICpuZ0lmPVwibGF5b3V0T3B0aW9ucy5kcmFnZ2FibGVcIiBjbGFzcz1cImJoaS1tb3ZlXCI+PC9pPlxuICAgICAgPGxhYmVsICpuZ0lmPVwiZmlsZS5saW5rXCJcbiAgICAgICAgPjxzcGFuXG4gICAgICAgICAgPjxhIGhyZWY9XCJ7eyBmaWxlLmxpbmsgfX1cIiB0YXJnZXQ9XCJfYmxhbmtcIj57eyBmaWxlLm5hbWUgfCBkZWNvZGVVUkkgfX08L2E+PC9zcGFuXG4gICAgICAgID48c3BhbiAqbmdJZj1cImZpbGUuZGVzY3JpcHRpb25cIj58fDwvc3Bhbj48c3Bhbj57eyBmaWxlLmRlc2NyaXB0aW9uIH19PC9zcGFuPjwvbGFiZWxcbiAgICAgID5cbiAgICAgIDxsYWJlbCAqbmdJZj1cIiFmaWxlLmxpbmtcIj57eyBmaWxlLm5hbWUgfCBkZWNvZGVVUkkgfX08L2xhYmVsPlxuICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbnNcIiBbYXR0ci5kYXRhLWF1dG9tYXRpb24taWRdPVwiJ2ZpbGUtYWN0aW9ucydcIiAqbmdJZj1cImZpbGUubG9hZGVkXCI+XG4gICAgICAgIDxkaXYgKm5nSWY9XCIhbGF5b3V0T3B0aW9ucy5jdXN0b21BY3Rpb25zXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgKm5nSWY9XCJsYXlvdXRPcHRpb25zLmRvd25sb2FkXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgdGhlbWU9XCJpY29uXCJcbiAgICAgICAgICAgIGljb249XCJzYXZlXCJcbiAgICAgICAgICAgIChjbGljayk9XCJkb3dubG9hZChmaWxlKVwiXG4gICAgICAgICAgICBbYXR0ci5kYXRhLWF1dG9tYXRpb24taWRdPVwiJ2ZpbGUtZG93bmxvYWQnXCJcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgID48L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAqbmdJZj1cIiFkaXNhYmxlZCAmJiAobGF5b3V0T3B0aW9ucy5yZW1vdmFibGUgfHwgKCFsYXlvdXRPcHRpb25zLnJlbW92YWJsZSAmJiBsYXlvdXRPcHRpb25zLnJlbW92YWJsZVdoZW5OZXcgJiYgIWZpbGUubGluaykpXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgdGhlbWU9XCJpY29uXCJcbiAgICAgICAgICAgIGljb249XCJjbG9zZVwiXG4gICAgICAgICAgICAoY2xpY2spPVwicmVtb3ZlKGZpbGUpXCJcbiAgICAgICAgICAgIFthdHRyLmRhdGEtYXV0b21hdGlvbi1pZF09XCInZmlsZS1yZW1vdmUnXCJcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgID48L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJsYXlvdXRPcHRpb25zLmN1c3RvbUFjdGlvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAqbmdJZj1cImxheW91dE9wdGlvbnMuZWRpdCAmJiAhZGlzYWJsZWRcIlxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICB0aGVtZT1cImljb25cIlxuICAgICAgICAgICAgaWNvbj1cImVkaXRcIlxuICAgICAgICAgICAgKGNsaWNrKT1cImN1c3RvbUVkaXQoZmlsZSlcIlxuICAgICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cIidmaWxlLWVkaXQnXCJcbiAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgID48L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAqbmdJZj1cImxheW91dE9wdGlvbnMuZG93bmxvYWRcIlxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICB0aGVtZT1cImljb25cIlxuICAgICAgICAgICAgaWNvbj1cInNhdmVcIlxuICAgICAgICAgICAgKGNsaWNrKT1cImN1c3RvbVNhdmUoZmlsZSlcIlxuICAgICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cIidmaWxlLWRvd25sb2FkJ1wiXG4gICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICA+PC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgKm5nSWY9XCIhZGlzYWJsZWRcIlxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICB0aGVtZT1cImljb25cIlxuICAgICAgICAgICAgaWNvbj1cImNsb3NlXCJcbiAgICAgICAgICAgIChjbGljayk9XCJjdXN0b21EZWxldGUoZmlsZSlcIlxuICAgICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cIidmaWxlLXJlbW92ZSdcIlxuICAgICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgICAgPjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPG5vdm8tbG9hZGluZyAqbmdJZj1cIiFmaWxlLmxvYWRlZFwiPjwvbm92by1sb2FkaW5nPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+Il19