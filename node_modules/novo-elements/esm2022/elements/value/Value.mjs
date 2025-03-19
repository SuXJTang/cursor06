var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// NG2
import { Component, HostBinding, Input } from '@angular/core';
import { BooleanInput, Helpers } from 'novo-elements/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "novo-elements/elements/common";
import * as i3 from "novo-elements/elements/icon";
import * as i4 from "./EntityList";
import * as i5 from "./Render";
// APP
export var NOVO_VALUE_TYPE;
(function (NOVO_VALUE_TYPE) {
    NOVO_VALUE_TYPE[NOVO_VALUE_TYPE["DEFAULT"] = 0] = "DEFAULT";
    NOVO_VALUE_TYPE[NOVO_VALUE_TYPE["ENTITY_LIST"] = 1] = "ENTITY_LIST";
    NOVO_VALUE_TYPE[NOVO_VALUE_TYPE["LINK"] = 2] = "LINK";
    NOVO_VALUE_TYPE[NOVO_VALUE_TYPE["INTERNAL_LINK"] = 3] = "INTERNAL_LINK";
})(NOVO_VALUE_TYPE || (NOVO_VALUE_TYPE = {}));
export var NOVO_VALUE_THEME;
(function (NOVO_VALUE_THEME) {
    NOVO_VALUE_THEME[NOVO_VALUE_THEME["DEFAULT"] = 0] = "DEFAULT";
    NOVO_VALUE_THEME[NOVO_VALUE_THEME["MOBILE"] = 1] = "MOBILE";
})(NOVO_VALUE_THEME || (NOVO_VALUE_THEME = {}));
export class NovoValueElement {
    constructor() {
        this.meta = { type: 'SCALAR', label: '' }; // TODO use interface
        this.theme = NOVO_VALUE_THEME.DEFAULT;
        this.row = false;
        this.NOVO_VALUE_TYPE = NOVO_VALUE_TYPE;
        this.NOVO_VALUE_THEME = NOVO_VALUE_THEME;
        this.customClass = '';
    }
    set label(lbl) {
        this.meta.label = lbl;
    }
    get label() {
        return this.meta.label;
    }
    set type(typ) {
        this.meta.type = typ;
    }
    get type() {
        return this.meta.type;
    }
    set icon(value) {
        this.meta.icon = value;
    }
    get icon() {
        return this.meta.icon;
    }
    ngOnInit() {
        if (Helpers.isEmpty(this.meta)) {
            this.meta = {
                label: '',
            };
        }
    }
    get isMobile() {
        return this.theme === NOVO_VALUE_THEME.MOBILE;
    }
    iconClass(icon) {
        let iconClass = '';
        if (icon && icon.iconCls) {
            iconClass = `bhi-${icon.iconCls} actions`;
            if (icon.onIconClick) {
                iconClass = `${iconClass} clickable`;
            }
            return iconClass;
        }
        return iconClass;
    }
    get isDefault() {
        return true;
    }
    get showLabel() {
        return (this._type === NOVO_VALUE_TYPE.INTERNAL_LINK || this._type === NOVO_VALUE_TYPE.LINK || this._type === NOVO_VALUE_TYPE.ENTITY_LIST);
    }
    get showIcon() {
        return this.meta && this.meta.icons && this.meta.icons.length && !Helpers.isEmpty(this.data);
    }
    onValueClick(icon) {
        if (icon.onIconClick && typeof icon.onIconClick === 'function') {
            icon.onIconClick(this.data, this.meta);
        }
    }
    openLink() {
        if (this.meta && this.meta.openLink && typeof this.meta.openLink === 'function') {
            this.meta.openLink(this.data, this.meta);
        }
    }
    ngOnChanges(changes) {
        if (this.meta && this.isLinkField(this.meta, this.data)) {
            this._type = NOVO_VALUE_TYPE.LINK;
            // Make sure the value has a protocol, otherwise the URL will be relative
            const hasProtocol = new RegExp('^(http|https)://', 'i');
            if (!hasProtocol.test(this.data)) {
                this.url = `http://${this.data}`;
            }
            else {
                this.url = this.data;
            }
        }
        else if (this.isEntityList(this.meta.type)) {
            this._type = NOVO_VALUE_TYPE.ENTITY_LIST;
        }
        else if (this.isHTMLField(this.meta)) {
            this.customClass = this.meta.customClass ? this.meta.customClass : '';
            if (this.meta.stripHTML && this.data && this.data.replace) {
                this.data = this.data.replace(/<(?!style|\/style).+?>/gi, '').trim();
            }
        }
        else if (this.meta && this.meta.associatedEntity) {
            switch (this.meta.associatedEntity.entity) {
                case 'ClientCorporation':
                case 'ClientContact':
                case 'Candidate':
                case 'Opportunity':
                case 'JobOrder':
                case 'Placement':
                case 'Lead':
                    this._type = NOVO_VALUE_TYPE.INTERNAL_LINK;
                    break;
                default:
                    break;
            }
        }
    }
    isLinkField(field, data) {
        const linkFields = ['companyURL', 'clientCorporationCompanyURL'];
        const regex = new RegExp('^(https?://(?:www.|(?!www))[^s.]+.[^s]{2,}|www.[^s]+.[^s]{2,})$', 'gi');
        const isURL = Helpers.isString(data) && regex.exec(data.trim());
        return linkFields.indexOf(field.name) > -1 || !!isURL || field.type === NOVO_VALUE_TYPE.LINK;
    }
    isEntityList(type) {
        return type === 'TO_MANY';
    }
    isHTMLField(meta) {
        return meta.dataSpecialization === 'HTML' || meta.inputType === 'TEXTAREA';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoValueElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoValueElement, selector: "novo-value", inputs: { data: "data", meta: "meta", theme: "theme", row: "row", label: "label", type: "type", icon: "icon" }, host: { properties: { "class.horizontal": "this.row", "class.mobile": "this.isMobile" } }, usesOnChanges: true, ngImport: i0, template: `
    <div class="value-outer" [ngClass]="customClass">
      <novo-label>{{ meta.label }}</novo-label>
      <span class="value">
        <i *ngIf="meta.showEntityIcon" class="bhi-circle {{ meta.entityIconClass }}"></i>
        <novo-icon *ngIf="meta?.icon">{{ meta.icon }}</novo-icon>
        <ng-container [ngSwitch]="_type">
          <a *ngSwitchCase="NOVO_VALUE_TYPE.INTERNAL_LINK" (click)="openLink()" [innerHTML]="data | render: meta"></a>
          <a *ngSwitchCase="NOVO_VALUE_TYPE.LINK" class="value" [href]="url" target="_blank" [innerHTML]="data | render: meta"></a>
          <novo-entity-list *ngSwitchCase="NOVO_VALUE_TYPE.ENTITY_LIST" [data]="data" [meta]="meta"></novo-entity-list>
          <novo-text *ngSwitchDefault [innerHTML]="data | render: meta"></novo-text>
        </ng-container>
      </span>
    </div>
    <div class="actions" *ngIf="showIcon">
      <i *ngFor="let icon of meta.icons" [class]="iconClass(icon)" (click)="onValueClick(icon)"></i>
    </div>
  `, isInline: true, styles: [":host{display:flex;flex-direction:row;max-width:500px;justify-content:space-between;align-items:flex-start;width:max-content;padding:8px}:host i.star{color:#0b344f}:host i.person{color:#fa4}:host i.company{color:#39d}:host i.candidate{color:#4b7}:host i.navigation{color:#202945}:host i.lead{color:#a69}:host i.contact{color:#fa4}:host i.clientcontact{color:#fa4}:host i.opportunity{color:#625}:host i.job{color:#b56}:host i.joborder{color:#b56}:host i.submission{color:#a9adbb}:host i.sendout{color:#747884}:host i.placement{color:#0b344f}:host i.note{color:#747884}:host i.task{color:#4f5361}:host i.distributionList{color:#4f5361}:host i.credential{color:#4f5361}:host i.user{color:#4f5361}:host i.corporateuser{color:#4f5361}:host i.contract{color:#454ea0}:host i.jobCode{color:#696d79}:host i.earnCode{color:#696d79}:host i.billableCharge{color:#696d79}:host i.payableCharge{color:#696d79}:host i.invoiceStatement{color:#696d79}:host.horizontal{width:100%;max-width:100%}:host.horizontal .value-outer{display:grid;width:100%;grid-template-columns:minmax(120px,30%) 1fr}:host .value-outer{display:flex;flex-direction:column;gap:.4rem}:host .actions i{cursor:default;color:#9e9e9e;margin-left:15px;margin-top:7px}:host .actions i.clickable{cursor:pointer;color:#4a89dc}:host .actions.clickable{cursor:pointer;color:#4a89dc}:host ::ng-deep novo-entity-list{display:block}:host ::ng-deep novo-entity-list i.star{color:#0b344f}:host ::ng-deep novo-entity-list i.person{color:#fa4}:host ::ng-deep novo-entity-list i.company{color:#39d}:host ::ng-deep novo-entity-list i.candidate{color:#4b7}:host ::ng-deep novo-entity-list i.navigation{color:#202945}:host ::ng-deep novo-entity-list i.lead{color:#a69}:host ::ng-deep novo-entity-list i.contact{color:#fa4}:host ::ng-deep novo-entity-list i.clientcontact{color:#fa4}:host ::ng-deep novo-entity-list i.opportunity{color:#625}:host ::ng-deep novo-entity-list i.job{color:#b56}:host ::ng-deep novo-entity-list i.joborder{color:#b56}:host ::ng-deep novo-entity-list i.submission{color:#a9adbb}:host ::ng-deep novo-entity-list i.sendout{color:#747884}:host ::ng-deep novo-entity-list i.placement{color:#0b344f}:host ::ng-deep novo-entity-list i.note{color:#747884}:host ::ng-deep novo-entity-list i.task{color:#4f5361}:host ::ng-deep novo-entity-list i.distributionList{color:#4f5361}:host ::ng-deep novo-entity-list i.credential{color:#4f5361}:host ::ng-deep novo-entity-list i.user{color:#4f5361}:host ::ng-deep novo-entity-list i.corporateuser{color:#4f5361}:host ::ng-deep novo-entity-list i.contract{color:#454ea0}:host ::ng-deep novo-entity-list i.jobCode{color:#696d79}:host ::ng-deep novo-entity-list i.earnCode{color:#696d79}:host ::ng-deep novo-entity-list i.billableCharge{color:#696d79}:host ::ng-deep novo-entity-list i.payableCharge{color:#696d79}:host ::ng-deep novo-entity-list i.invoiceStatement{color:#696d79}:host ::ng-deep novo-entity-list .entity{padding-top:6px;padding-bottom:6px}:host ::ng-deep novo-entity-list i{margin-right:6px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i1.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "component", type: i2.NovoText, selector: "novo-text,[novo-text]", inputs: ["block"] }, { kind: "component", type: i2.NovoLabel, selector: "novo-label,[novo-label]" }, { kind: "component", type: i3.NovoIconComponent, selector: "novo-icon", inputs: ["raised", "theme", "shape", "color", "size", "smaller", "larger", "alt", "name"] }, { kind: "component", type: i4.EntityList, selector: "novo-entity-list", inputs: ["data", "meta"] }, { kind: "pipe", type: i5.RenderPipe, name: "render" }] }); }
}
__decorate([
    BooleanInput(),
    __metadata("design:type", Boolean)
], NovoValueElement.prototype, "row", void 0);
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoValueElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-value', template: `
    <div class="value-outer" [ngClass]="customClass">
      <novo-label>{{ meta.label }}</novo-label>
      <span class="value">
        <i *ngIf="meta.showEntityIcon" class="bhi-circle {{ meta.entityIconClass }}"></i>
        <novo-icon *ngIf="meta?.icon">{{ meta.icon }}</novo-icon>
        <ng-container [ngSwitch]="_type">
          <a *ngSwitchCase="NOVO_VALUE_TYPE.INTERNAL_LINK" (click)="openLink()" [innerHTML]="data | render: meta"></a>
          <a *ngSwitchCase="NOVO_VALUE_TYPE.LINK" class="value" [href]="url" target="_blank" [innerHTML]="data | render: meta"></a>
          <novo-entity-list *ngSwitchCase="NOVO_VALUE_TYPE.ENTITY_LIST" [data]="data" [meta]="meta"></novo-entity-list>
          <novo-text *ngSwitchDefault [innerHTML]="data | render: meta"></novo-text>
        </ng-container>
      </span>
    </div>
    <div class="actions" *ngIf="showIcon">
      <i *ngFor="let icon of meta.icons" [class]="iconClass(icon)" (click)="onValueClick(icon)"></i>
    </div>
  `, styles: [":host{display:flex;flex-direction:row;max-width:500px;justify-content:space-between;align-items:flex-start;width:max-content;padding:8px}:host i.star{color:#0b344f}:host i.person{color:#fa4}:host i.company{color:#39d}:host i.candidate{color:#4b7}:host i.navigation{color:#202945}:host i.lead{color:#a69}:host i.contact{color:#fa4}:host i.clientcontact{color:#fa4}:host i.opportunity{color:#625}:host i.job{color:#b56}:host i.joborder{color:#b56}:host i.submission{color:#a9adbb}:host i.sendout{color:#747884}:host i.placement{color:#0b344f}:host i.note{color:#747884}:host i.task{color:#4f5361}:host i.distributionList{color:#4f5361}:host i.credential{color:#4f5361}:host i.user{color:#4f5361}:host i.corporateuser{color:#4f5361}:host i.contract{color:#454ea0}:host i.jobCode{color:#696d79}:host i.earnCode{color:#696d79}:host i.billableCharge{color:#696d79}:host i.payableCharge{color:#696d79}:host i.invoiceStatement{color:#696d79}:host.horizontal{width:100%;max-width:100%}:host.horizontal .value-outer{display:grid;width:100%;grid-template-columns:minmax(120px,30%) 1fr}:host .value-outer{display:flex;flex-direction:column;gap:.4rem}:host .actions i{cursor:default;color:#9e9e9e;margin-left:15px;margin-top:7px}:host .actions i.clickable{cursor:pointer;color:#4a89dc}:host .actions.clickable{cursor:pointer;color:#4a89dc}:host ::ng-deep novo-entity-list{display:block}:host ::ng-deep novo-entity-list i.star{color:#0b344f}:host ::ng-deep novo-entity-list i.person{color:#fa4}:host ::ng-deep novo-entity-list i.company{color:#39d}:host ::ng-deep novo-entity-list i.candidate{color:#4b7}:host ::ng-deep novo-entity-list i.navigation{color:#202945}:host ::ng-deep novo-entity-list i.lead{color:#a69}:host ::ng-deep novo-entity-list i.contact{color:#fa4}:host ::ng-deep novo-entity-list i.clientcontact{color:#fa4}:host ::ng-deep novo-entity-list i.opportunity{color:#625}:host ::ng-deep novo-entity-list i.job{color:#b56}:host ::ng-deep novo-entity-list i.joborder{color:#b56}:host ::ng-deep novo-entity-list i.submission{color:#a9adbb}:host ::ng-deep novo-entity-list i.sendout{color:#747884}:host ::ng-deep novo-entity-list i.placement{color:#0b344f}:host ::ng-deep novo-entity-list i.note{color:#747884}:host ::ng-deep novo-entity-list i.task{color:#4f5361}:host ::ng-deep novo-entity-list i.distributionList{color:#4f5361}:host ::ng-deep novo-entity-list i.credential{color:#4f5361}:host ::ng-deep novo-entity-list i.user{color:#4f5361}:host ::ng-deep novo-entity-list i.corporateuser{color:#4f5361}:host ::ng-deep novo-entity-list i.contract{color:#454ea0}:host ::ng-deep novo-entity-list i.jobCode{color:#696d79}:host ::ng-deep novo-entity-list i.earnCode{color:#696d79}:host ::ng-deep novo-entity-list i.billableCharge{color:#696d79}:host ::ng-deep novo-entity-list i.payableCharge{color:#696d79}:host ::ng-deep novo-entity-list i.invoiceStatement{color:#696d79}:host ::ng-deep novo-entity-list .entity{padding-top:6px;padding-bottom:6px}:host ::ng-deep novo-entity-list i{margin-right:6px}\n"] }]
        }], propDecorators: { data: [{
                type: Input
            }], meta: [{
                type: Input
            }], theme: [{
                type: Input
            }], row: [{
                type: HostBinding,
                args: ['class.horizontal']
            }, {
                type: Input
            }], label: [{
                type: Input
            }], type: [{
                type: Input
            }], icon: [{
                type: Input
            }], isMobile: [{
                type: HostBinding,
                args: ['class.mobile']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy92YWx1ZS9WYWx1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFvQyxNQUFNLGVBQWUsQ0FBQztBQUNoRyxPQUFPLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7Ozs7O0FBQzVELE1BQU07QUFDTixNQUFNLENBQU4sSUFBWSxlQUtYO0FBTEQsV0FBWSxlQUFlO0lBQ3pCLDJEQUFPLENBQUE7SUFDUCxtRUFBVyxDQUFBO0lBQ1gscURBQUksQ0FBQTtJQUNKLHVFQUFhLENBQUE7QUFDZixDQUFDLEVBTFcsZUFBZSxLQUFmLGVBQWUsUUFLMUI7QUFDRCxNQUFNLENBQU4sSUFBWSxnQkFHWDtBQUhELFdBQVksZ0JBQWdCO0lBQzFCLDZEQUFPLENBQUE7SUFDUCwyREFBTSxDQUFBO0FBQ1IsQ0FBQyxFQUhXLGdCQUFnQixLQUFoQixnQkFBZ0IsUUFHM0I7QUF3QkQsTUFBTSxPQUFPLGdCQUFnQjtJQXRCN0I7UUEwQkUsU0FBSSxHQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxxQkFBcUI7UUFFaEUsVUFBSyxHQUFxQixnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7UUFLbkQsUUFBRyxHQUFZLEtBQUssQ0FBQztRQUdyQixvQkFBZSxHQUFHLGVBQWUsQ0FBQztRQUNsQyxxQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUVwQyxnQkFBVyxHQUFXLEVBQUUsQ0FBQztLQTRIMUI7SUExSEMsSUFDSSxLQUFLLENBQUMsR0FBVztRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDeEIs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QkFBZ0I7bUdBQWhCLGdCQUFnQixrUkFwQmpCOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCVDs7QUFjRDtJQURDLFlBQVksRUFBRTs4QkFDVixPQUFPOzZDQUFTOzRGQVhWLGdCQUFnQjtrQkF0QjVCLFNBQVM7K0JBQ0UsWUFBWSxZQUNaOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCVDs4QkFLRCxJQUFJO3NCQURILEtBQUs7Z0JBR04sSUFBSTtzQkFESCxLQUFLO2dCQUdOLEtBQUs7c0JBREosS0FBSztnQkFNTixHQUFHO3NCQUhGLFdBQVc7dUJBQUMsa0JBQWtCOztzQkFDOUIsS0FBSztnQkFXRixLQUFLO3NCQURSLEtBQUs7Z0JBU0YsSUFBSTtzQkFEUCxLQUFLO2dCQVNGLElBQUk7c0JBRFAsS0FBSztnQkFpQkssUUFBUTtzQkFEbEIsV0FBVzt1QkFBQyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCwgSGVscGVycyB9IGZyb20gJ25vdm8tZWxlbWVudHMvdXRpbHMnO1xuLy8gQVBQXG5leHBvcnQgZW51bSBOT1ZPX1ZBTFVFX1RZUEUge1xuICBERUZBVUxULFxuICBFTlRJVFlfTElTVCxcbiAgTElOSyxcbiAgSU5URVJOQUxfTElOSyxcbn1cbmV4cG9ydCBlbnVtIE5PVk9fVkFMVUVfVEhFTUUge1xuICBERUZBVUxULFxuICBNT0JJTEUsXG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25vdm8tdmFsdWUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJ2YWx1ZS1vdXRlclwiIFtuZ0NsYXNzXT1cImN1c3RvbUNsYXNzXCI+XG4gICAgICA8bm92by1sYWJlbD57eyBtZXRhLmxhYmVsIH19PC9ub3ZvLWxhYmVsPlxuICAgICAgPHNwYW4gY2xhc3M9XCJ2YWx1ZVwiPlxuICAgICAgICA8aSAqbmdJZj1cIm1ldGEuc2hvd0VudGl0eUljb25cIiBjbGFzcz1cImJoaS1jaXJjbGUge3sgbWV0YS5lbnRpdHlJY29uQ2xhc3MgfX1cIj48L2k+XG4gICAgICAgIDxub3ZvLWljb24gKm5nSWY9XCJtZXRhPy5pY29uXCI+e3sgbWV0YS5pY29uIH19PC9ub3ZvLWljb24+XG4gICAgICAgIDxuZy1jb250YWluZXIgW25nU3dpdGNoXT1cIl90eXBlXCI+XG4gICAgICAgICAgPGEgKm5nU3dpdGNoQ2FzZT1cIk5PVk9fVkFMVUVfVFlQRS5JTlRFUk5BTF9MSU5LXCIgKGNsaWNrKT1cIm9wZW5MaW5rKClcIiBbaW5uZXJIVE1MXT1cImRhdGEgfCByZW5kZXI6IG1ldGFcIj48L2E+XG4gICAgICAgICAgPGEgKm5nU3dpdGNoQ2FzZT1cIk5PVk9fVkFMVUVfVFlQRS5MSU5LXCIgY2xhc3M9XCJ2YWx1ZVwiIFtocmVmXT1cInVybFwiIHRhcmdldD1cIl9ibGFua1wiIFtpbm5lckhUTUxdPVwiZGF0YSB8IHJlbmRlcjogbWV0YVwiPjwvYT5cbiAgICAgICAgICA8bm92by1lbnRpdHktbGlzdCAqbmdTd2l0Y2hDYXNlPVwiTk9WT19WQUxVRV9UWVBFLkVOVElUWV9MSVNUXCIgW2RhdGFdPVwiZGF0YVwiIFttZXRhXT1cIm1ldGFcIj48L25vdm8tZW50aXR5LWxpc3Q+XG4gICAgICAgICAgPG5vdm8tdGV4dCAqbmdTd2l0Y2hEZWZhdWx0IFtpbm5lckhUTUxdPVwiZGF0YSB8IHJlbmRlcjogbWV0YVwiPjwvbm92by10ZXh0PlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uc1wiICpuZ0lmPVwic2hvd0ljb25cIj5cbiAgICAgIDxpICpuZ0Zvcj1cImxldCBpY29uIG9mIG1ldGEuaWNvbnNcIiBbY2xhc3NdPVwiaWNvbkNsYXNzKGljb24pXCIgKGNsaWNrKT1cIm9uVmFsdWVDbGljayhpY29uKVwiPjwvaT5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4vVmFsdWUuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvVmFsdWVFbGVtZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBASW5wdXQoKVxuICBkYXRhOiBhbnk7IC8vIFRPRE8gdXNlIGludGVyZmFjZVxuICBASW5wdXQoKVxuICBtZXRhOiBhbnkgPSB7IHR5cGU6ICdTQ0FMQVInLCBsYWJlbDogJycgfTsgLy8gVE9ETyB1c2UgaW50ZXJmYWNlXG4gIEBJbnB1dCgpXG4gIHRoZW1lOiBOT1ZPX1ZBTFVFX1RIRU1FID0gTk9WT19WQUxVRV9USEVNRS5ERUZBVUxUO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuaG9yaXpvbnRhbCcpXG4gIEBJbnB1dCgpXG4gIEBCb29sZWFuSW5wdXQoKVxuICByb3c6IEJvb2xlYW4gPSBmYWxzZTtcblxuICBfdHlwZTogTk9WT19WQUxVRV9UWVBFO1xuICBOT1ZPX1ZBTFVFX1RZUEUgPSBOT1ZPX1ZBTFVFX1RZUEU7XG4gIE5PVk9fVkFMVUVfVEhFTUUgPSBOT1ZPX1ZBTFVFX1RIRU1FO1xuICB1cmw6IHN0cmluZztcbiAgY3VzdG9tQ2xhc3M6IHN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBsYWJlbChsYmw6IHN0cmluZykge1xuICAgIHRoaXMubWV0YS5sYWJlbCA9IGxibDtcbiAgfVxuICBnZXQgbGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tZXRhLmxhYmVsO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHR5cGUodHlwOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1ldGEudHlwZSA9IHR5cDtcbiAgfVxuICBnZXQgdHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1ldGEudHlwZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBpY29uKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLm1ldGEuaWNvbiA9IHZhbHVlO1xuICB9XG4gIGdldCBpY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubWV0YS5pY29uO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKEhlbHBlcnMuaXNFbXB0eSh0aGlzLm1ldGEpKSB7XG4gICAgICB0aGlzLm1ldGEgPSB7XG4gICAgICAgIGxhYmVsOiAnJyxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5tb2JpbGUnKVxuICBwdWJsaWMgZ2V0IGlzTW9iaWxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRoZW1lID09PSBOT1ZPX1ZBTFVFX1RIRU1FLk1PQklMRTtcbiAgfVxuXG4gIGljb25DbGFzcyhpY29uKTogc3RyaW5nIHtcbiAgICBsZXQgaWNvbkNsYXNzID0gJyc7XG4gICAgaWYgKGljb24gJiYgaWNvbi5pY29uQ2xzKSB7XG4gICAgICBpY29uQ2xhc3MgPSBgYmhpLSR7aWNvbi5pY29uQ2xzfSBhY3Rpb25zYDtcbiAgICAgIGlmIChpY29uLm9uSWNvbkNsaWNrKSB7XG4gICAgICAgIGljb25DbGFzcyA9IGAke2ljb25DbGFzc30gY2xpY2thYmxlYDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpY29uQ2xhc3M7XG4gICAgfVxuICAgIHJldHVybiBpY29uQ2xhc3M7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGlzRGVmYXVsdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgc2hvd0xhYmVsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl90eXBlID09PSBOT1ZPX1ZBTFVFX1RZUEUuSU5URVJOQUxfTElOSyB8fCB0aGlzLl90eXBlID09PSBOT1ZPX1ZBTFVFX1RZUEUuTElOSyB8fCB0aGlzLl90eXBlID09PSBOT1ZPX1ZBTFVFX1RZUEUuRU5USVRZX0xJU1RcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGdldCBzaG93SWNvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tZXRhICYmIHRoaXMubWV0YS5pY29ucyAmJiB0aGlzLm1ldGEuaWNvbnMubGVuZ3RoICYmICFIZWxwZXJzLmlzRW1wdHkodGhpcy5kYXRhKTtcbiAgfVxuXG4gIG9uVmFsdWVDbGljayhpY29uKTogdm9pZCB7XG4gICAgaWYgKGljb24ub25JY29uQ2xpY2sgJiYgdHlwZW9mIGljb24ub25JY29uQ2xpY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGljb24ub25JY29uQ2xpY2sodGhpcy5kYXRhLCB0aGlzLm1ldGEpO1xuICAgIH1cbiAgfVxuICBvcGVuTGluaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tZXRhICYmIHRoaXMubWV0YS5vcGVuTGluayAmJiB0eXBlb2YgdGhpcy5tZXRhLm9wZW5MaW5rID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm1ldGEub3BlbkxpbmsodGhpcy5kYXRhLCB0aGlzLm1ldGEpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM/OiBTaW1wbGVDaGFuZ2VzKTogYW55IHtcbiAgICBpZiAodGhpcy5tZXRhICYmIHRoaXMuaXNMaW5rRmllbGQodGhpcy5tZXRhLCB0aGlzLmRhdGEpKSB7XG4gICAgICB0aGlzLl90eXBlID0gTk9WT19WQUxVRV9UWVBFLkxJTks7XG4gICAgICAvLyBNYWtlIHN1cmUgdGhlIHZhbHVlIGhhcyBhIHByb3RvY29sLCBvdGhlcndpc2UgdGhlIFVSTCB3aWxsIGJlIHJlbGF0aXZlXG4gICAgICBjb25zdCBoYXNQcm90b2NvbDogYW55ID0gbmV3IFJlZ0V4cCgnXihodHRwfGh0dHBzKTovLycsICdpJyk7XG4gICAgICBpZiAoIWhhc1Byb3RvY29sLnRlc3QodGhpcy5kYXRhKSkge1xuICAgICAgICB0aGlzLnVybCA9IGBodHRwOi8vJHt0aGlzLmRhdGF9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXJsID0gdGhpcy5kYXRhO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0VudGl0eUxpc3QodGhpcy5tZXRhLnR5cGUpKSB7XG4gICAgICB0aGlzLl90eXBlID0gTk9WT19WQUxVRV9UWVBFLkVOVElUWV9MSVNUO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0hUTUxGaWVsZCh0aGlzLm1ldGEpKSB7XG4gICAgICB0aGlzLmN1c3RvbUNsYXNzID0gdGhpcy5tZXRhLmN1c3RvbUNsYXNzID8gdGhpcy5tZXRhLmN1c3RvbUNsYXNzIDogJyc7XG4gICAgICBpZiAodGhpcy5tZXRhLnN0cmlwSFRNTCAmJiB0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLnJlcGxhY2UpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhLnJlcGxhY2UoLzwoPyFzdHlsZXxcXC9zdHlsZSkuKz8+L2dpLCAnJykudHJpbSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5tZXRhICYmIHRoaXMubWV0YS5hc3NvY2lhdGVkRW50aXR5KSB7XG4gICAgICBzd2l0Y2ggKHRoaXMubWV0YS5hc3NvY2lhdGVkRW50aXR5LmVudGl0eSkge1xuICAgICAgICBjYXNlICdDbGllbnRDb3Jwb3JhdGlvbic6XG4gICAgICAgIGNhc2UgJ0NsaWVudENvbnRhY3QnOlxuICAgICAgICBjYXNlICdDYW5kaWRhdGUnOlxuICAgICAgICBjYXNlICdPcHBvcnR1bml0eSc6XG4gICAgICAgIGNhc2UgJ0pvYk9yZGVyJzpcbiAgICAgICAgY2FzZSAnUGxhY2VtZW50JzpcbiAgICAgICAgY2FzZSAnTGVhZCc6XG4gICAgICAgICAgdGhpcy5fdHlwZSA9IE5PVk9fVkFMVUVfVFlQRS5JTlRFUk5BTF9MSU5LO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlzTGlua0ZpZWxkKGZpZWxkOiB7IG5hbWU/OiBzdHJpbmc7IHR5cGU/OiBOT1ZPX1ZBTFVFX1RZUEUgfSwgZGF0YTogYW55KTogYm9vbGVhbiB7XG4gICAgY29uc3QgbGlua0ZpZWxkczogYW55ID0gWydjb21wYW55VVJMJywgJ2NsaWVudENvcnBvcmF0aW9uQ29tcGFueVVSTCddO1xuICAgIGNvbnN0IHJlZ2V4OiBhbnkgPSBuZXcgUmVnRXhwKCdeKGh0dHBzPzovLyg/Ond3dy58KD8hd3d3KSlbXnMuXSsuW15zXXsyLH18d3d3Lltec10rLltec117Mix9KSQnLCAnZ2knKTtcbiAgICBjb25zdCBpc1VSTDogYW55ID0gSGVscGVycy5pc1N0cmluZyhkYXRhKSAmJiByZWdleC5leGVjKGRhdGEudHJpbSgpKTtcbiAgICByZXR1cm4gbGlua0ZpZWxkcy5pbmRleE9mKGZpZWxkLm5hbWUpID4gLTEgfHwgISFpc1VSTCB8fCBmaWVsZC50eXBlID09PSBOT1ZPX1ZBTFVFX1RZUEUuTElOSztcbiAgfVxuXG4gIGlzRW50aXR5TGlzdCh0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ1RPX01BTlknO1xuICB9XG5cbiAgaXNIVE1MRmllbGQobWV0YTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG1ldGEuZGF0YVNwZWNpYWxpemF0aW9uID09PSAnSFRNTCcgfHwgbWV0YS5pbnB1dFR5cGUgPT09ICdURVhUQVJFQSc7XG4gIH1cbn1cbiJdfQ==