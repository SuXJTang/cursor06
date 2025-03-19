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
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
// APP
import { NovoLabelService } from 'novo-elements/services';
import { BooleanInput } from 'novo-elements/utils';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "@angular/common";
import * as i3 from "novo-elements/elements/icon";
import * as i4 from "novo-elements/elements/button";
import * as i5 from "novo-elements/elements/loading";
import * as i6 from "novo-elements/elements/tooltip";
export class CardActionsElement {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardActionsElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: CardActionsElement, selector: "novo-card-actions", ngImport: i0, template: '<ng-content></ng-content>', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardActionsElement, decorators: [{
            type: Component,
            args: [{
                    selector: 'novo-card-actions',
                    template: '<ng-content></ng-content>',
                }]
        }] });
/**
 * Content of a card, needed as it's used as a selector in the API.
 */
export class CardContentElement {
    constructor() {
        this.condensed = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardContentElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: CardContentElement, selector: "novo-card-content, [novo-card-content], [novoCardContent]", inputs: { condensed: "condensed" }, host: { properties: { "class.condensed": "condensed" }, classAttribute: "novo-card-content" }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, styles: [":host{display:block}:host:not(.condensed){padding:1rem}\n"] }); }
}
__decorate([
    BooleanInput(),
    __metadata("design:type", Boolean)
], CardContentElement.prototype, "condensed", void 0);
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardContentElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-card-content, [novo-card-content], [novoCardContent]', host: { class: 'novo-card-content', '[class.condensed]': 'condensed' }, template: '<ng-content></ng-content>', styles: [":host{display:block}:host:not(.condensed){padding:1rem}\n"] }]
        }], propDecorators: { condensed: [{
                type: Input
            }] } });
/**
 * Content of a card, needed as it's used as a selector in the API.
 */
export class CardHeaderElement {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardHeaderElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: CardHeaderElement, selector: "novo-card-header, [novo-card-header], [novoCardHeader]", host: { classAttribute: "novo-card-header" }, ngImport: i0, template: `
    <ng-content select="novo-avatar, [novo-avatar], novo-icon"></ng-content>
    <div class="novo-card-header-text">
      <ng-content select="novo-title, [novo-title], novo-text, novo-label, novo-caption"></ng-content>
    </div>
    <ng-content></ng-content>
    <div class="novo-card-header-actions">
      <ng-content select="novo-action"></ng-content>
    </div>
  `, isInline: true, styles: [":host{padding:1rem 1rem 0;display:flex;flex-direction:row;align-items:center;gap:1rem}:host[color=black]{color:#fff;background:#000}:host[color=white]{color:#3d464d;background:#fff}:host[color=gray]{color:#3d464d;background:#9e9e9e}:host[color=grey]{color:#3d464d;background:#9e9e9e}:host[color=offWhite]{color:#3d464d;background:#f7f7f7}:host[color=bright]{color:#3d464d;background:#f7f7f7}:host[color=light]{color:#3d464d;background:#dbdbdb}:host[color=neutral]{color:#fff;background:#4f5361}:host[color=dark]{color:#fff;background:#3d464d}:host[color=orange]{color:#3d464d;background:#ff6900}:host[color=navigation]{color:#fff;background:#202945}:host[color=skyBlue]{color:#fff;background:#009bdf}:host[color=steel]{color:#fff;background:#5b6770}:host[color=metal]{color:#fff;background:#637893}:host[color=sand]{color:#3d464d;background:#f4f4f4}:host[color=silver]{color:#3d464d;background:#e2e2e2}:host[color=stone]{color:#3d464d;background:#bebebe}:host[color=ash]{color:#3d464d;background:#a0a0a0}:host[color=slate]{color:#fff;background:#707070}:host[color=onyx]{color:#fff;background:#526980}:host[color=charcoal]{color:#fff;background:#282828}:host[color=moonlight]{color:#fff;background:#1a242f}:host[color=midnight]{color:#fff;background:#202945}:host[color=darkness]{color:#fff;background:#161f27}:host[color=navy]{color:#fff;background:#0d2d42}:host[color=aqua]{color:#3d464d;background:#3bafda}:host[color=ocean]{color:#fff;background:#4a89dc}:host[color=mint]{color:#3d464d;background:#37bc9b}:host[color=grass]{color:#fff;background:#8cc152}:host[color=sunflower]{color:#fff;background:#f6b042}:host[color=bittersweet]{color:#fff;background:#eb6845}:host[color=grapefruit]{color:#fff;background:#da4453}:host[color=carnation]{color:#fff;background:#d770ad}:host[color=lavender]{color:#fff;background:#967adc}:host[color=mountain]{color:#fff;background:#9678b6}:host[color=info]{color:#fff;background:#4a89dc}:host[color=positive]{color:#fff;background:#4a89dc}:host[color=success]{color:#fff;background:#8cc152}:host[color=negative]{color:#fff;background:#da4453}:host[color=danger]{color:#fff;background:#da4453}:host[color=error]{color:#fff;background:#da4453}:host[color=warning]{color:#fff;background:#f6b042}:host[color=empty]{color:#3d464d;background:#cccdcc}:host[color=disabled]{color:#3d464d;background:#bebebe}:host[color=background]{color:#3d464d;background:#f7f7f7}:host[color=backgroundDark]{color:#3d464d;background:#e2e2e2}:host[color=presentation]{color:#fff;background:#5b6770}:host[color=bullhorn]{color:#3d464d;background:#ff6900}:host[color=pulse]{color:#3d464d;background:#3bafda}:host[color=company]{color:#fff;background:#39d}:host[color=candidate]{color:#fff;background:#4b7}:host[color=lead]{color:#fff;background:#a69}:host[color=contact]{color:#fff;background:#fa4}:host[color=clientcontact]{color:#fff;background:#fa4}:host[color=opportunity]{color:#fff;background:#625}:host[color=job]{color:#fff;background:#b56}:host[color=joborder]{color:#fff;background:#b56}:host[color=submission]{color:#3d464d;background:#a9adbb}:host[color=sendout]{color:#fff;background:#747884}:host[color=placement]{color:#fff;background:#0b344f}:host[color=note]{color:#fff;background:#747884}:host[color=contract]{color:#fff;background:#454ea0}:host[color=jobCode]{color:#fff;background:#696d79}:host[color=earnCode]{color:#fff;background:#696d79}:host[color=invoiceStatement]{color:#fff;background:#696d79}:host[color=billableCharge]{color:#fff;background:#696d79}:host[color=payableCharge]{color:#fff;background:#696d79}:host[color=user]{color:#fff;background:#696d79}:host[color=corporateUser]{color:#fff;background:#696d79}:host[color=distributionList]{color:#fff;background:#696d79}:host[color=credential]{color:#fff;background:#696d79}:host[color=person]{color:#fff;background:#696d79}:host .novo-card-header-text{flex:1 1 0px}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardHeaderElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-card-header, [novo-card-header], [novoCardHeader]', host: { class: 'novo-card-header' }, template: `
    <ng-content select="novo-avatar, [novo-avatar], novo-icon"></ng-content>
    <div class="novo-card-header-text">
      <ng-content select="novo-title, [novo-title], novo-text, novo-label, novo-caption"></ng-content>
    </div>
    <ng-content></ng-content>
    <div class="novo-card-header-actions">
      <ng-content select="novo-action"></ng-content>
    </div>
  `, styles: [":host{padding:1rem 1rem 0;display:flex;flex-direction:row;align-items:center;gap:1rem}:host[color=black]{color:#fff;background:#000}:host[color=white]{color:#3d464d;background:#fff}:host[color=gray]{color:#3d464d;background:#9e9e9e}:host[color=grey]{color:#3d464d;background:#9e9e9e}:host[color=offWhite]{color:#3d464d;background:#f7f7f7}:host[color=bright]{color:#3d464d;background:#f7f7f7}:host[color=light]{color:#3d464d;background:#dbdbdb}:host[color=neutral]{color:#fff;background:#4f5361}:host[color=dark]{color:#fff;background:#3d464d}:host[color=orange]{color:#3d464d;background:#ff6900}:host[color=navigation]{color:#fff;background:#202945}:host[color=skyBlue]{color:#fff;background:#009bdf}:host[color=steel]{color:#fff;background:#5b6770}:host[color=metal]{color:#fff;background:#637893}:host[color=sand]{color:#3d464d;background:#f4f4f4}:host[color=silver]{color:#3d464d;background:#e2e2e2}:host[color=stone]{color:#3d464d;background:#bebebe}:host[color=ash]{color:#3d464d;background:#a0a0a0}:host[color=slate]{color:#fff;background:#707070}:host[color=onyx]{color:#fff;background:#526980}:host[color=charcoal]{color:#fff;background:#282828}:host[color=moonlight]{color:#fff;background:#1a242f}:host[color=midnight]{color:#fff;background:#202945}:host[color=darkness]{color:#fff;background:#161f27}:host[color=navy]{color:#fff;background:#0d2d42}:host[color=aqua]{color:#3d464d;background:#3bafda}:host[color=ocean]{color:#fff;background:#4a89dc}:host[color=mint]{color:#3d464d;background:#37bc9b}:host[color=grass]{color:#fff;background:#8cc152}:host[color=sunflower]{color:#fff;background:#f6b042}:host[color=bittersweet]{color:#fff;background:#eb6845}:host[color=grapefruit]{color:#fff;background:#da4453}:host[color=carnation]{color:#fff;background:#d770ad}:host[color=lavender]{color:#fff;background:#967adc}:host[color=mountain]{color:#fff;background:#9678b6}:host[color=info]{color:#fff;background:#4a89dc}:host[color=positive]{color:#fff;background:#4a89dc}:host[color=success]{color:#fff;background:#8cc152}:host[color=negative]{color:#fff;background:#da4453}:host[color=danger]{color:#fff;background:#da4453}:host[color=error]{color:#fff;background:#da4453}:host[color=warning]{color:#fff;background:#f6b042}:host[color=empty]{color:#3d464d;background:#cccdcc}:host[color=disabled]{color:#3d464d;background:#bebebe}:host[color=background]{color:#3d464d;background:#f7f7f7}:host[color=backgroundDark]{color:#3d464d;background:#e2e2e2}:host[color=presentation]{color:#fff;background:#5b6770}:host[color=bullhorn]{color:#3d464d;background:#ff6900}:host[color=pulse]{color:#3d464d;background:#3bafda}:host[color=company]{color:#fff;background:#39d}:host[color=candidate]{color:#fff;background:#4b7}:host[color=lead]{color:#fff;background:#a69}:host[color=contact]{color:#fff;background:#fa4}:host[color=clientcontact]{color:#fff;background:#fa4}:host[color=opportunity]{color:#fff;background:#625}:host[color=job]{color:#fff;background:#b56}:host[color=joborder]{color:#fff;background:#b56}:host[color=submission]{color:#3d464d;background:#a9adbb}:host[color=sendout]{color:#fff;background:#747884}:host[color=placement]{color:#fff;background:#0b344f}:host[color=note]{color:#fff;background:#747884}:host[color=contract]{color:#fff;background:#454ea0}:host[color=jobCode]{color:#fff;background:#696d79}:host[color=earnCode]{color:#fff;background:#696d79}:host[color=invoiceStatement]{color:#fff;background:#696d79}:host[color=billableCharge]{color:#fff;background:#696d79}:host[color=payableCharge]{color:#fff;background:#696d79}:host[color=user]{color:#fff;background:#696d79}:host[color=corporateUser]{color:#fff;background:#696d79}:host[color=distributionList]{color:#fff;background:#696d79}:host[color=credential]{color:#fff;background:#696d79}:host[color=person]{color:#fff;background:#696d79}:host .novo-card-header-text{flex:1 1 0px}\n"] }]
        }] });
export class CardFooterElement {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardFooterElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: CardFooterElement, selector: "novo-card-footer, [novo-card-footer], [novoCardFooter]", host: { classAttribute: "novo-card-footer" }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, styles: [":host{padding:0 1rem 1rem;display:flex;flex-direction:row;align-items:center;gap:1rem}:host[color=black]{color:#fff;background:#000}:host[color=white]{color:#3d464d;background:#fff}:host[color=gray]{color:#3d464d;background:#9e9e9e}:host[color=grey]{color:#3d464d;background:#9e9e9e}:host[color=offWhite]{color:#3d464d;background:#f7f7f7}:host[color=bright]{color:#3d464d;background:#f7f7f7}:host[color=light]{color:#3d464d;background:#dbdbdb}:host[color=neutral]{color:#fff;background:#4f5361}:host[color=dark]{color:#fff;background:#3d464d}:host[color=orange]{color:#3d464d;background:#ff6900}:host[color=navigation]{color:#fff;background:#202945}:host[color=skyBlue]{color:#fff;background:#009bdf}:host[color=steel]{color:#fff;background:#5b6770}:host[color=metal]{color:#fff;background:#637893}:host[color=sand]{color:#3d464d;background:#f4f4f4}:host[color=silver]{color:#3d464d;background:#e2e2e2}:host[color=stone]{color:#3d464d;background:#bebebe}:host[color=ash]{color:#3d464d;background:#a0a0a0}:host[color=slate]{color:#fff;background:#707070}:host[color=onyx]{color:#fff;background:#526980}:host[color=charcoal]{color:#fff;background:#282828}:host[color=moonlight]{color:#fff;background:#1a242f}:host[color=midnight]{color:#fff;background:#202945}:host[color=darkness]{color:#fff;background:#161f27}:host[color=navy]{color:#fff;background:#0d2d42}:host[color=aqua]{color:#3d464d;background:#3bafda}:host[color=ocean]{color:#fff;background:#4a89dc}:host[color=mint]{color:#3d464d;background:#37bc9b}:host[color=grass]{color:#fff;background:#8cc152}:host[color=sunflower]{color:#fff;background:#f6b042}:host[color=bittersweet]{color:#fff;background:#eb6845}:host[color=grapefruit]{color:#fff;background:#da4453}:host[color=carnation]{color:#fff;background:#d770ad}:host[color=lavender]{color:#fff;background:#967adc}:host[color=mountain]{color:#fff;background:#9678b6}:host[color=info]{color:#fff;background:#4a89dc}:host[color=positive]{color:#fff;background:#4a89dc}:host[color=success]{color:#fff;background:#8cc152}:host[color=negative]{color:#fff;background:#da4453}:host[color=danger]{color:#fff;background:#da4453}:host[color=error]{color:#fff;background:#da4453}:host[color=warning]{color:#fff;background:#f6b042}:host[color=empty]{color:#3d464d;background:#cccdcc}:host[color=disabled]{color:#3d464d;background:#bebebe}:host[color=background]{color:#3d464d;background:#f7f7f7}:host[color=backgroundDark]{color:#3d464d;background:#e2e2e2}:host[color=presentation]{color:#fff;background:#5b6770}:host[color=bullhorn]{color:#3d464d;background:#ff6900}:host[color=pulse]{color:#3d464d;background:#3bafda}:host[color=company]{color:#fff;background:#39d}:host[color=candidate]{color:#fff;background:#4b7}:host[color=lead]{color:#fff;background:#a69}:host[color=contact]{color:#fff;background:#fa4}:host[color=clientcontact]{color:#fff;background:#fa4}:host[color=opportunity]{color:#fff;background:#625}:host[color=job]{color:#fff;background:#b56}:host[color=joborder]{color:#fff;background:#b56}:host[color=submission]{color:#3d464d;background:#a9adbb}:host[color=sendout]{color:#fff;background:#747884}:host[color=placement]{color:#fff;background:#0b344f}:host[color=note]{color:#fff;background:#747884}:host[color=contract]{color:#fff;background:#454ea0}:host[color=jobCode]{color:#fff;background:#696d79}:host[color=earnCode]{color:#fff;background:#696d79}:host[color=invoiceStatement]{color:#fff;background:#696d79}:host[color=billableCharge]{color:#fff;background:#696d79}:host[color=payableCharge]{color:#fff;background:#696d79}:host[color=user]{color:#fff;background:#696d79}:host[color=corporateUser]{color:#fff;background:#696d79}:host[color=distributionList]{color:#fff;background:#696d79}:host[color=credential]{color:#fff;background:#696d79}:host[color=person]{color:#fff;background:#696d79}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardFooterElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-card-footer, [novo-card-footer], [novoCardFooter]', host: { class: 'novo-card-footer' }, template: '<ng-content></ng-content>', styles: [":host{padding:0 1rem 1rem;display:flex;flex-direction:row;align-items:center;gap:1rem}:host[color=black]{color:#fff;background:#000}:host[color=white]{color:#3d464d;background:#fff}:host[color=gray]{color:#3d464d;background:#9e9e9e}:host[color=grey]{color:#3d464d;background:#9e9e9e}:host[color=offWhite]{color:#3d464d;background:#f7f7f7}:host[color=bright]{color:#3d464d;background:#f7f7f7}:host[color=light]{color:#3d464d;background:#dbdbdb}:host[color=neutral]{color:#fff;background:#4f5361}:host[color=dark]{color:#fff;background:#3d464d}:host[color=orange]{color:#3d464d;background:#ff6900}:host[color=navigation]{color:#fff;background:#202945}:host[color=skyBlue]{color:#fff;background:#009bdf}:host[color=steel]{color:#fff;background:#5b6770}:host[color=metal]{color:#fff;background:#637893}:host[color=sand]{color:#3d464d;background:#f4f4f4}:host[color=silver]{color:#3d464d;background:#e2e2e2}:host[color=stone]{color:#3d464d;background:#bebebe}:host[color=ash]{color:#3d464d;background:#a0a0a0}:host[color=slate]{color:#fff;background:#707070}:host[color=onyx]{color:#fff;background:#526980}:host[color=charcoal]{color:#fff;background:#282828}:host[color=moonlight]{color:#fff;background:#1a242f}:host[color=midnight]{color:#fff;background:#202945}:host[color=darkness]{color:#fff;background:#161f27}:host[color=navy]{color:#fff;background:#0d2d42}:host[color=aqua]{color:#3d464d;background:#3bafda}:host[color=ocean]{color:#fff;background:#4a89dc}:host[color=mint]{color:#3d464d;background:#37bc9b}:host[color=grass]{color:#fff;background:#8cc152}:host[color=sunflower]{color:#fff;background:#f6b042}:host[color=bittersweet]{color:#fff;background:#eb6845}:host[color=grapefruit]{color:#fff;background:#da4453}:host[color=carnation]{color:#fff;background:#d770ad}:host[color=lavender]{color:#fff;background:#967adc}:host[color=mountain]{color:#fff;background:#9678b6}:host[color=info]{color:#fff;background:#4a89dc}:host[color=positive]{color:#fff;background:#4a89dc}:host[color=success]{color:#fff;background:#8cc152}:host[color=negative]{color:#fff;background:#da4453}:host[color=danger]{color:#fff;background:#da4453}:host[color=error]{color:#fff;background:#da4453}:host[color=warning]{color:#fff;background:#f6b042}:host[color=empty]{color:#3d464d;background:#cccdcc}:host[color=disabled]{color:#3d464d;background:#bebebe}:host[color=background]{color:#3d464d;background:#f7f7f7}:host[color=backgroundDark]{color:#3d464d;background:#e2e2e2}:host[color=presentation]{color:#fff;background:#5b6770}:host[color=bullhorn]{color:#3d464d;background:#ff6900}:host[color=pulse]{color:#3d464d;background:#3bafda}:host[color=company]{color:#fff;background:#39d}:host[color=candidate]{color:#fff;background:#4b7}:host[color=lead]{color:#fff;background:#a69}:host[color=contact]{color:#fff;background:#fa4}:host[color=clientcontact]{color:#fff;background:#fa4}:host[color=opportunity]{color:#fff;background:#625}:host[color=job]{color:#fff;background:#b56}:host[color=joborder]{color:#fff;background:#b56}:host[color=submission]{color:#3d464d;background:#a9adbb}:host[color=sendout]{color:#fff;background:#747884}:host[color=placement]{color:#fff;background:#0b344f}:host[color=note]{color:#fff;background:#747884}:host[color=contract]{color:#fff;background:#454ea0}:host[color=jobCode]{color:#fff;background:#696d79}:host[color=earnCode]{color:#fff;background:#696d79}:host[color=invoiceStatement]{color:#fff;background:#696d79}:host[color=billableCharge]{color:#fff;background:#696d79}:host[color=payableCharge]{color:#fff;background:#696d79}:host[color=user]{color:#fff;background:#696d79}:host[color=corporateUser]{color:#fff;background:#696d79}:host[color=distributionList]{color:#fff;background:#696d79}:host[color=credential]{color:#fff;background:#696d79}:host[color=person]{color:#fff;background:#696d79}\n"] }]
        }] });
export class CardElement {
    get hbInset() {
        return `novo-card-inset-${this.inset}`;
    }
    constructor(labels) {
        this.padding = true;
        this.config = {};
        this.inset = 'none';
        this.onClose = new EventEmitter();
        this.onRefresh = new EventEmitter();
        this.labels = labels;
    }
    ngOnInit() {
        this.config = this.config || {};
    }
    ngOnChanges(changes) {
        this.config = this.config || {};
        this.cardAutomationId = `${(this.title || this.config.title || 'no-title').trim().toLowerCase().replace(/\s/g, '-')}-card`;
        const newIcon = this.icon || this.config.icon;
        const newMessageIcon = this.messageIcon || this.config.messageIcon;
        this.iconClass = newIcon ? `bhi-${newIcon}` : null;
        this.messageIconClass = newMessageIcon ? `bhi-${newMessageIcon}` : null;
    }
    toggleClose() {
        if (!this.config.onClose) {
            this.onClose.next();
        }
        else {
            this.config.onClose();
        }
    }
    toggleRefresh() {
        if (!this.config.onRefresh) {
            this.onRefresh.next();
        }
        else {
            this.config.onRefresh();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardElement, deps: [{ token: i1.NovoLabelService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: CardElement, selector: "novo-card", inputs: { padding: "padding", config: "config", title: "title", message: "message", messageIcon: "messageIcon", icon: "icon", iconTooltip: "iconTooltip", refresh: "refresh", close: "close", move: "move", loading: "loading", inline: "inline", inset: "inset" }, outputs: { onClose: "onClose", onRefresh: "onRefresh" }, host: { properties: { "attr.data-automation-id": "cardAutomationId", "class.loading": "loading || config.loading", "class.novo-card-inline": "this.inline", "class": "this.hbInset" }, classAttribute: "novo-card" }, usesOnChanges: true, ngImport: i0, template: `
    <!--Loading-->
    <div class="card-loading-container" *ngIf="loading || config.loading">
      <novo-loading theme="line" [attr.data-automation-id]="cardAutomationId + '-loading'"></novo-loading>
    </div>
    <!--Card Header-->
    <header *ngIf="title || config.title">
      <div class="title">
        <!--Grabber Icon-->
        <novo-icon
          *ngIf="move || config.move"
          tooltip="{{ labels.move }}"
          tooltipPosition="bottom-right"
          [attr.data-automation-id]="cardAutomationId + '-move'"
          >move</novo-icon
        >
        <!--Card Title-->
        <h3 [attr.data-automation-id]="cardAutomationId + '-title'">
          <span [tooltip]="iconTooltip" tooltipPosition="right"><i *ngIf="icon" [ngClass]="iconClass"></i></span>
          {{ title || config.title }}
        </h3>
      </div>
      <!--Card Actions-->
      <div class="actions" [attr.data-automation-id]="cardAutomationId + '-actions'">
        <ng-content select="novo-card-actions"></ng-content>
        <novo-button
          theme="icon"
          icon="refresh"
          (click)="toggleRefresh()"
          *ngIf="refresh || config.refresh"
          [attr.data-automation-id]="cardAutomationId + '-refresh'"
          tooltip="{{ labels.refresh }}"
          tooltipPosition="bottom-left"
        ></novo-button>

        <novo-button
          theme="icon"
          icon="close-o"
          (click)="toggleClose()"
          *ngIf="close || config.close"
          [attr.data-automation-id]="cardAutomationId + '-close'"
          tooltip="{{ labels.close }}"
          tooltipPosition="bottom-left"
        ></novo-button>
      </div>
    </header>
    <!--Content (transcluded)-->
    <ng-content *ngIf="!(loading || config.loading) && !(message || config.message)"></ng-content>
    <!--Error/Empty Message-->
    <p
      class="card-message"
      *ngIf="!(loading || config.loading) && (message || config.message)"
      [attr.data-automation-id]="cardAutomationId + '-message'"
    >
      <i *ngIf="messageIconClass" [ngClass]="messageIconClass"></i> <span [innerHtml]="message || config.message"></span>
    </p>
    <!--Card Footer-->
    <ng-content
      *ngIf="!(loading || config.loading) && !(message || config.message)"
      select="footer,novo-card-footer,[novo-card-footer],[novoCardFooter]"
    ></ng-content>
  `, isInline: true, styles: [":host{display:flex;flex-flow:column;background-color:var(--background-bright, #ffffff);box-shadow:0 -1px 3px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;border-radius:.4em;position:relative;overflow-x:hidden}:host.loading{min-height:200px}:host div.card-loading-container{position:absolute;inset:43px 0 0;border-radius:.4em;background-color:var(--background-bright, #ffffff);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:1}:host header{display:flex;flex-flow:row nowrap;align-items:center;justify-content:space-between;padding:.5em}:host header .title{display:flex;align-items:center;min-width:0;flex:1}:host header .title ::ng-deep i.bhi-move{color:#dbdbdb;margin-right:.3em;cursor:pointer}:host header .title h1,:host header .title h2,:host header .title h3{font-size:1.6rem;font-weight:500;line-height:1.5;color:var(--text-main, #3d464d);width:100%;padding:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host header .title h1 i,:host header .title h2 i,:host header .title h3 i{font-size:1.2em}:host header .title h1 i.bhi-info,:host header .title h2 i.bhi-info,:host header .title h3 i.bhi-info{color:#dbdbdb}:host header .actions{color:#5f6d78;white-space:nowrap}:host p.card-message{padding:20px 0;max-width:inherit;text-align:center;line-height:25px;color:#b8b8b8}:host p.card-message i{display:block;font-size:24px;margin:0 0 .5em;color:#d1d1d1}:host footer{display:flex;justify-content:center}:host.novo-card-inline{display:inline-flex;justify-self:start;align-self:start}:host.novo-card-inset-none{padding:0}:host.novo-card-inset-small{padding:.5rem}:host.novo-card-inset-medium{padding:1rem}:host.novo-card-inset-large{padding:1.25rem}:host ::ng-deep .novo-card-header+.novo-card-content.condensed,:host ::ng-deep .novo-card-header+:not(.novo-card-content){margin-top:.5rem}:host ::ng-deep [novo-card-image]{width:100%;margin:1rem 0}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.NovoIconComponent, selector: "novo-icon", inputs: ["raised", "theme", "shape", "color", "size", "smaller", "larger", "alt", "name"] }, { kind: "component", type: i4.NovoButtonElement, selector: "novo-button,button[theme]", inputs: ["color", "side", "size", "theme", "loading", "icon", "secondIcon", "disabled"] }, { kind: "component", type: i5.NovoLoadingElement, selector: "novo-loading", inputs: ["theme", "color", "size"] }, { kind: "directive", type: i6.TooltipDirective, selector: "[tooltip]", inputs: ["tooltip", "tooltipPosition", "tooltipType", "tooltipSize", "tooltipBounce", "tooltipNoAnimate", "tooltipRounded", "tooltipAlways", "tooltipPreline", "removeTooltipArrow", "tooltipAutoPosition", "tooltipIsHTML", "tooltipCloseOnClick", "tooltipOnOverflow", "tooltipActive"] }] }); }
}
__decorate([
    BooleanInput(),
    __metadata("design:type", Boolean)
], CardElement.prototype, "inline", void 0);
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: CardElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-card', host: {
                        class: 'novo-card',
                        '[attr.data-automation-id]': 'cardAutomationId',
                        '[class.loading]': 'loading || config.loading',
                    }, template: `
    <!--Loading-->
    <div class="card-loading-container" *ngIf="loading || config.loading">
      <novo-loading theme="line" [attr.data-automation-id]="cardAutomationId + '-loading'"></novo-loading>
    </div>
    <!--Card Header-->
    <header *ngIf="title || config.title">
      <div class="title">
        <!--Grabber Icon-->
        <novo-icon
          *ngIf="move || config.move"
          tooltip="{{ labels.move }}"
          tooltipPosition="bottom-right"
          [attr.data-automation-id]="cardAutomationId + '-move'"
          >move</novo-icon
        >
        <!--Card Title-->
        <h3 [attr.data-automation-id]="cardAutomationId + '-title'">
          <span [tooltip]="iconTooltip" tooltipPosition="right"><i *ngIf="icon" [ngClass]="iconClass"></i></span>
          {{ title || config.title }}
        </h3>
      </div>
      <!--Card Actions-->
      <div class="actions" [attr.data-automation-id]="cardAutomationId + '-actions'">
        <ng-content select="novo-card-actions"></ng-content>
        <novo-button
          theme="icon"
          icon="refresh"
          (click)="toggleRefresh()"
          *ngIf="refresh || config.refresh"
          [attr.data-automation-id]="cardAutomationId + '-refresh'"
          tooltip="{{ labels.refresh }}"
          tooltipPosition="bottom-left"
        ></novo-button>

        <novo-button
          theme="icon"
          icon="close-o"
          (click)="toggleClose()"
          *ngIf="close || config.close"
          [attr.data-automation-id]="cardAutomationId + '-close'"
          tooltip="{{ labels.close }}"
          tooltipPosition="bottom-left"
        ></novo-button>
      </div>
    </header>
    <!--Content (transcluded)-->
    <ng-content *ngIf="!(loading || config.loading) && !(message || config.message)"></ng-content>
    <!--Error/Empty Message-->
    <p
      class="card-message"
      *ngIf="!(loading || config.loading) && (message || config.message)"
      [attr.data-automation-id]="cardAutomationId + '-message'"
    >
      <i *ngIf="messageIconClass" [ngClass]="messageIconClass"></i> <span [innerHtml]="message || config.message"></span>
    </p>
    <!--Card Footer-->
    <ng-content
      *ngIf="!(loading || config.loading) && !(message || config.message)"
      select="footer,novo-card-footer,[novo-card-footer],[novoCardFooter]"
    ></ng-content>
  `, styles: [":host{display:flex;flex-flow:column;background-color:var(--background-bright, #ffffff);box-shadow:0 -1px 3px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;border-radius:.4em;position:relative;overflow-x:hidden}:host.loading{min-height:200px}:host div.card-loading-container{position:absolute;inset:43px 0 0;border-radius:.4em;background-color:var(--background-bright, #ffffff);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:1}:host header{display:flex;flex-flow:row nowrap;align-items:center;justify-content:space-between;padding:.5em}:host header .title{display:flex;align-items:center;min-width:0;flex:1}:host header .title ::ng-deep i.bhi-move{color:#dbdbdb;margin-right:.3em;cursor:pointer}:host header .title h1,:host header .title h2,:host header .title h3{font-size:1.6rem;font-weight:500;line-height:1.5;color:var(--text-main, #3d464d);width:100%;padding:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host header .title h1 i,:host header .title h2 i,:host header .title h3 i{font-size:1.2em}:host header .title h1 i.bhi-info,:host header .title h2 i.bhi-info,:host header .title h3 i.bhi-info{color:#dbdbdb}:host header .actions{color:#5f6d78;white-space:nowrap}:host p.card-message{padding:20px 0;max-width:inherit;text-align:center;line-height:25px;color:#b8b8b8}:host p.card-message i{display:block;font-size:24px;margin:0 0 .5em;color:#d1d1d1}:host footer{display:flex;justify-content:center}:host.novo-card-inline{display:inline-flex;justify-self:start;align-self:start}:host.novo-card-inset-none{padding:0}:host.novo-card-inset-small{padding:.5rem}:host.novo-card-inset-medium{padding:1rem}:host.novo-card-inset-large{padding:1.25rem}:host ::ng-deep .novo-card-header+.novo-card-content.condensed,:host ::ng-deep .novo-card-header+:not(.novo-card-content){margin-top:.5rem}:host ::ng-deep [novo-card-image]{width:100%;margin:1rem 0}\n"] }]
        }], ctorParameters: () => [{ type: i1.NovoLabelService }], propDecorators: { padding: [{
                type: Input
            }], config: [{
                type: Input
            }], title: [{
                type: Input
            }], message: [{
                type: Input
            }], messageIcon: [{
                type: Input
            }], icon: [{
                type: Input
            }], iconTooltip: [{
                type: Input
            }], refresh: [{
                type: Input
            }], close: [{
                type: Input
            }], move: [{
                type: Input
            }], loading: [{
                type: Input
            }], inline: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.novo-card-inline']
            }], inset: [{
                type: Input
            }], hbInset: [{
                type: HostBinding,
                args: ['class']
            }], onClose: [{
                type: Output
            }], onRefresh: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2NhcmQvQ2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUN0SCxNQUFNO0FBQ04sT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7Ozs7OztBQU1uRCxNQUFNLE9BQU8sa0JBQWtCOytHQUFsQixrQkFBa0I7bUdBQWxCLGtCQUFrQix5REFGbkIsMkJBQTJCOzs0RkFFMUIsa0JBQWtCO2tCQUo5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3RDOztBQUdEOztHQUVHO0FBT0gsTUFBTSxPQUFPLGtCQUFrQjtJQU4vQjtRQU8yQixjQUFTLEdBQVksS0FBSyxDQUFDO0tBQ3JEOytHQUZZLGtCQUFrQjttR0FBbEIsa0JBQWtCLG9PQUhuQiwyQkFBMkI7O0FBSVo7SUFBZixZQUFZLEVBQUU7O3FEQUE0Qjs0RkFEekMsa0JBQWtCO2tCQU45QixTQUFTOytCQUNFLDJEQUEyRCxRQUMvRCxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsWUFDNUQsMkJBQTJCOzhCQUlaLFNBQVM7c0JBQWpDLEtBQUs7O0FBR1I7O0dBRUc7QUFnQkgsTUFBTSxPQUFPLGlCQUFpQjsrR0FBakIsaUJBQWlCO21HQUFqQixpQkFBaUIsNElBWmxCOzs7Ozs7Ozs7R0FTVDs7NEZBR1UsaUJBQWlCO2tCQWY3QixTQUFTOytCQUNFLHdEQUF3RCxR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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkRUO3FGQUtELE9BQU87c0JBRE4sS0FBSztnQkFHTixNQUFNO3NCQURMLEtBQUs7Z0JBR04sS0FBSztzQkFESixLQUFLO2dCQUdOLE9BQU87c0JBRE4sS0FBSztnQkFHTixXQUFXO3NCQURWLEtBQUs7Z0JBR04sSUFBSTtzQkFESCxLQUFLO2dCQUdOLFdBQVc7c0JBRFYsS0FBSztnQkFHTixPQUFPO3NCQUROLEtBQUs7Z0JBR04sS0FBSztzQkFESixLQUFLO2dCQUdOLElBQUk7c0JBREgsS0FBSztnQkFHTixPQUFPO3NCQUROLEtBQUs7Z0JBTU4sTUFBTTtzQkFITCxLQUFLOztzQkFFTCxXQUFXO3VCQUFDLHdCQUF3QjtnQkFJckMsS0FBSztzQkFESixLQUFLO2dCQUdGLE9BQU87c0JBRFYsV0FBVzt1QkFBQyxPQUFPO2dCQU1wQixPQUFPO3NCQUROLE1BQU07Z0JBR1AsU0FBUztzQkFEUixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT3V0cHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4vLyBBUFBcbmltcG9ydCB7IE5vdm9MYWJlbFNlcnZpY2UgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3NlcnZpY2VzJztcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCB9IGZyb20gJ25vdm8tZWxlbWVudHMvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdub3ZvLWNhcmQtYWN0aW9ucycsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG59KVxuZXhwb3J0IGNsYXNzIENhcmRBY3Rpb25zRWxlbWVudCB7fVxuXG4vKipcbiAqIENvbnRlbnQgb2YgYSBjYXJkLCBuZWVkZWQgYXMgaXQncyB1c2VkIGFzIGEgc2VsZWN0b3IgaW4gdGhlIEFQSS5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1jYXJkLWNvbnRlbnQsIFtub3ZvLWNhcmQtY29udGVudF0sIFtub3ZvQ2FyZENvbnRlbnRdJyxcbiAgaG9zdDogeyBjbGFzczogJ25vdm8tY2FyZC1jb250ZW50JywgJ1tjbGFzcy5jb25kZW5zZWRdJzogJ2NvbmRlbnNlZCcgfSxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgc3R5bGVVcmxzOiBbJy4vQ2FyZENvbnRlbnQuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBDYXJkQ29udGVudEVsZW1lbnQge1xuICBASW5wdXQoKSBAQm9vbGVhbklucHV0KCkgY29uZGVuc2VkOiBib29sZWFuID0gZmFsc2U7XG59XG5cbi8qKlxuICogQ29udGVudCBvZiBhIGNhcmQsIG5lZWRlZCBhcyBpdCdzIHVzZWQgYXMgYSBzZWxlY3RvciBpbiB0aGUgQVBJLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdub3ZvLWNhcmQtaGVhZGVyLCBbbm92by1jYXJkLWhlYWRlcl0sIFtub3ZvQ2FyZEhlYWRlcl0nLFxuICBob3N0OiB7IGNsYXNzOiAnbm92by1jYXJkLWhlYWRlcicgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJub3ZvLWF2YXRhciwgW25vdm8tYXZhdGFyXSwgbm92by1pY29uXCI+PC9uZy1jb250ZW50PlxuICAgIDxkaXYgY2xhc3M9XCJub3ZvLWNhcmQtaGVhZGVyLXRleHRcIj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIm5vdm8tdGl0bGUsIFtub3ZvLXRpdGxlXSwgbm92by10ZXh0LCBub3ZvLWxhYmVsLCBub3ZvLWNhcHRpb25cIj48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDxkaXYgY2xhc3M9XCJub3ZvLWNhcmQtaGVhZGVyLWFjdGlvbnNcIj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIm5vdm8tYWN0aW9uXCI+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9DYXJkSGVhZGVyLnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2FyZEhlYWRlckVsZW1lbnQge31cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1jYXJkLWZvb3RlciwgW25vdm8tY2FyZC1mb290ZXJdLCBbbm92b0NhcmRGb290ZXJdJyxcbiAgaG9zdDogeyBjbGFzczogJ25vdm8tY2FyZC1mb290ZXInIH0sXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIHN0eWxlVXJsczogWycuL0NhcmRGb290ZXIuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBDYXJkRm9vdGVyRWxlbWVudCB7fVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdub3ZvLWNhcmQnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdub3ZvLWNhcmQnLFxuICAgICdbYXR0ci5kYXRhLWF1dG9tYXRpb24taWRdJzogJ2NhcmRBdXRvbWF0aW9uSWQnLFxuICAgICdbY2xhc3MubG9hZGluZ10nOiAnbG9hZGluZyB8fCBjb25maWcubG9hZGluZycsXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPCEtLUxvYWRpbmctLT5cbiAgICA8ZGl2IGNsYXNzPVwiY2FyZC1sb2FkaW5nLWNvbnRhaW5lclwiICpuZ0lmPVwibG9hZGluZyB8fCBjb25maWcubG9hZGluZ1wiPlxuICAgICAgPG5vdm8tbG9hZGluZyB0aGVtZT1cImxpbmVcIiBbYXR0ci5kYXRhLWF1dG9tYXRpb24taWRdPVwiY2FyZEF1dG9tYXRpb25JZCArICctbG9hZGluZydcIj48L25vdm8tbG9hZGluZz5cbiAgICA8L2Rpdj5cbiAgICA8IS0tQ2FyZCBIZWFkZXItLT5cbiAgICA8aGVhZGVyICpuZ0lmPVwidGl0bGUgfHwgY29uZmlnLnRpdGxlXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5cbiAgICAgICAgPCEtLUdyYWJiZXIgSWNvbi0tPlxuICAgICAgICA8bm92by1pY29uXG4gICAgICAgICAgKm5nSWY9XCJtb3ZlIHx8IGNvbmZpZy5tb3ZlXCJcbiAgICAgICAgICB0b29sdGlwPVwie3sgbGFiZWxzLm1vdmUgfX1cIlxuICAgICAgICAgIHRvb2x0aXBQb3NpdGlvbj1cImJvdHRvbS1yaWdodFwiXG4gICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cImNhcmRBdXRvbWF0aW9uSWQgKyAnLW1vdmUnXCJcbiAgICAgICAgICA+bW92ZTwvbm92by1pY29uXG4gICAgICAgID5cbiAgICAgICAgPCEtLUNhcmQgVGl0bGUtLT5cbiAgICAgICAgPGgzIFthdHRyLmRhdGEtYXV0b21hdGlvbi1pZF09XCJjYXJkQXV0b21hdGlvbklkICsgJy10aXRsZSdcIj5cbiAgICAgICAgICA8c3BhbiBbdG9vbHRpcF09XCJpY29uVG9vbHRpcFwiIHRvb2x0aXBQb3NpdGlvbj1cInJpZ2h0XCI+PGkgKm5nSWY9XCJpY29uXCIgW25nQ2xhc3NdPVwiaWNvbkNsYXNzXCI+PC9pPjwvc3Bhbj5cbiAgICAgICAgICB7eyB0aXRsZSB8fCBjb25maWcudGl0bGUgfX1cbiAgICAgICAgPC9oMz5cbiAgICAgIDwvZGl2PlxuICAgICAgPCEtLUNhcmQgQWN0aW9ucy0tPlxuICAgICAgPGRpdiBjbGFzcz1cImFjdGlvbnNcIiBbYXR0ci5kYXRhLWF1dG9tYXRpb24taWRdPVwiY2FyZEF1dG9tYXRpb25JZCArICctYWN0aW9ucydcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwibm92by1jYXJkLWFjdGlvbnNcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgIDxub3ZvLWJ1dHRvblxuICAgICAgICAgIHRoZW1lPVwiaWNvblwiXG4gICAgICAgICAgaWNvbj1cInJlZnJlc2hcIlxuICAgICAgICAgIChjbGljayk9XCJ0b2dnbGVSZWZyZXNoKClcIlxuICAgICAgICAgICpuZ0lmPVwicmVmcmVzaCB8fCBjb25maWcucmVmcmVzaFwiXG4gICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cImNhcmRBdXRvbWF0aW9uSWQgKyAnLXJlZnJlc2gnXCJcbiAgICAgICAgICB0b29sdGlwPVwie3sgbGFiZWxzLnJlZnJlc2ggfX1cIlxuICAgICAgICAgIHRvb2x0aXBQb3NpdGlvbj1cImJvdHRvbS1sZWZ0XCJcbiAgICAgICAgPjwvbm92by1idXR0b24+XG5cbiAgICAgICAgPG5vdm8tYnV0dG9uXG4gICAgICAgICAgdGhlbWU9XCJpY29uXCJcbiAgICAgICAgICBpY29uPVwiY2xvc2Utb1wiXG4gICAgICAgICAgKGNsaWNrKT1cInRvZ2dsZUNsb3NlKClcIlxuICAgICAgICAgICpuZ0lmPVwiY2xvc2UgfHwgY29uZmlnLmNsb3NlXCJcbiAgICAgICAgICBbYXR0ci5kYXRhLWF1dG9tYXRpb24taWRdPVwiY2FyZEF1dG9tYXRpb25JZCArICctY2xvc2UnXCJcbiAgICAgICAgICB0b29sdGlwPVwie3sgbGFiZWxzLmNsb3NlIH19XCJcbiAgICAgICAgICB0b29sdGlwUG9zaXRpb249XCJib3R0b20tbGVmdFwiXG4gICAgICAgID48L25vdm8tYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9oZWFkZXI+XG4gICAgPCEtLUNvbnRlbnQgKHRyYW5zY2x1ZGVkKS0tPlxuICAgIDxuZy1jb250ZW50ICpuZ0lmPVwiIShsb2FkaW5nIHx8IGNvbmZpZy5sb2FkaW5nKSAmJiAhKG1lc3NhZ2UgfHwgY29uZmlnLm1lc3NhZ2UpXCI+PC9uZy1jb250ZW50PlxuICAgIDwhLS1FcnJvci9FbXB0eSBNZXNzYWdlLS0+XG4gICAgPHBcbiAgICAgIGNsYXNzPVwiY2FyZC1tZXNzYWdlXCJcbiAgICAgICpuZ0lmPVwiIShsb2FkaW5nIHx8IGNvbmZpZy5sb2FkaW5nKSAmJiAobWVzc2FnZSB8fCBjb25maWcubWVzc2FnZSlcIlxuICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cImNhcmRBdXRvbWF0aW9uSWQgKyAnLW1lc3NhZ2UnXCJcbiAgICA+XG4gICAgICA8aSAqbmdJZj1cIm1lc3NhZ2VJY29uQ2xhc3NcIiBbbmdDbGFzc109XCJtZXNzYWdlSWNvbkNsYXNzXCI+PC9pPiA8c3BhbiBbaW5uZXJIdG1sXT1cIm1lc3NhZ2UgfHwgY29uZmlnLm1lc3NhZ2VcIj48L3NwYW4+XG4gICAgPC9wPlxuICAgIDwhLS1DYXJkIEZvb3Rlci0tPlxuICAgIDxuZy1jb250ZW50XG4gICAgICAqbmdJZj1cIiEobG9hZGluZyB8fCBjb25maWcubG9hZGluZykgJiYgIShtZXNzYWdlIHx8IGNvbmZpZy5tZXNzYWdlKVwiXG4gICAgICBzZWxlY3Q9XCJmb290ZXIsbm92by1jYXJkLWZvb3Rlcixbbm92by1jYXJkLWZvb3Rlcl0sW25vdm9DYXJkRm9vdGVyXVwiXG4gICAgPjwvbmctY29udGVudD5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4vQ2FyZC5zY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIENhcmRFbGVtZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQge1xuICBASW5wdXQoKVxuICBwYWRkaW5nOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KClcbiAgY29uZmlnOiBhbnkgPSB7fTtcbiAgQElucHV0KClcbiAgdGl0bGU6IHN0cmluZztcbiAgQElucHV0KClcbiAgbWVzc2FnZTogc3RyaW5nO1xuICBASW5wdXQoKVxuICBtZXNzYWdlSWNvbjogc3RyaW5nO1xuICBASW5wdXQoKVxuICBpY29uOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGljb25Ub29sdGlwOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHJlZnJlc2g6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIGNsb3NlOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBtb3ZlOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBsb2FkaW5nOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpXG4gIEBCb29sZWFuSW5wdXQoKVxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm5vdm8tY2FyZC1pbmxpbmUnKVxuICBpbmxpbmU6IGJvb2xlYW47XG5cbiAgQElucHV0KClcbiAgaW5zZXQ6IHN0cmluZyA9ICdub25lJztcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBoYkluc2V0KCkge1xuICAgIHJldHVybiBgbm92by1jYXJkLWluc2V0LSR7dGhpcy5pbnNldH1gO1xuICB9XG5cbiAgQE91dHB1dCgpXG4gIG9uQ2xvc2U6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpXG4gIG9uUmVmcmVzaDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNhcmRBdXRvbWF0aW9uSWQ6IHN0cmluZztcbiAgbGFiZWxzOiBOb3ZvTGFiZWxTZXJ2aWNlO1xuICBpY29uQ2xhc3M6IHN0cmluZyB8IG51bGw7XG4gIG1lc3NhZ2VJY29uQ2xhc3M6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihsYWJlbHM6IE5vdm9MYWJlbFNlcnZpY2UpIHtcbiAgICB0aGlzLmxhYmVscyA9IGxhYmVscztcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY29uZmlnID0gdGhpcy5jb25maWcgfHwge307XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzPzogU2ltcGxlQ2hhbmdlcykge1xuICAgIHRoaXMuY29uZmlnID0gdGhpcy5jb25maWcgfHwge307XG4gICAgdGhpcy5jYXJkQXV0b21hdGlvbklkID0gYCR7KHRoaXMudGl0bGUgfHwgdGhpcy5jb25maWcudGl0bGUgfHwgJ25vLXRpdGxlJykudHJpbSgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzL2csICctJyl9LWNhcmRgO1xuXG4gICAgY29uc3QgbmV3SWNvbjogc3RyaW5nID0gdGhpcy5pY29uIHx8IHRoaXMuY29uZmlnLmljb247XG4gICAgY29uc3QgbmV3TWVzc2FnZUljb246IHN0cmluZyA9IHRoaXMubWVzc2FnZUljb24gfHwgdGhpcy5jb25maWcubWVzc2FnZUljb247XG4gICAgdGhpcy5pY29uQ2xhc3MgPSBuZXdJY29uID8gYGJoaS0ke25ld0ljb259YCA6IG51bGw7XG4gICAgdGhpcy5tZXNzYWdlSWNvbkNsYXNzID0gbmV3TWVzc2FnZUljb24gPyBgYmhpLSR7bmV3TWVzc2FnZUljb259YCA6IG51bGw7XG4gIH1cblxuICB0b2dnbGVDbG9zZSgpIHtcbiAgICBpZiAoIXRoaXMuY29uZmlnLm9uQ2xvc2UpIHtcbiAgICAgIHRoaXMub25DbG9zZS5uZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29uZmlnLm9uQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVSZWZyZXNoKCkge1xuICAgIGlmICghdGhpcy5jb25maWcub25SZWZyZXNoKSB7XG4gICAgICB0aGlzLm9uUmVmcmVzaC5uZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29uZmlnLm9uUmVmcmVzaCgpO1xuICAgIH1cbiAgfVxufVxuIl19