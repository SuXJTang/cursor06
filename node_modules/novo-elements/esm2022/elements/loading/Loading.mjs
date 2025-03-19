// NG2
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ContentChildren, Directive, HostBinding, Input, QueryList, TemplateRef, ViewContainerRef, } from '@angular/core';
import * as i0 from "@angular/core";
export class NovoLoadingElement {
    constructor() {
        this.size = 'medium';
    }
    /**
     * **deprecated** please use `color`.
     * @deprecated
     **/
    set theme(value) {
        console.warn(`'theme' property is deprecated, please use 'color'.`);
        this.color = value;
    }
    get theme() {
        return this.color;
    }
    get hb_class() {
        return [`color-${this.color}`, `size-${this.size}`].join(' ');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoLoadingElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoLoadingElement, selector: "novo-loading", inputs: { theme: "theme", color: "color", size: "size" }, host: { properties: { "class": "this.hb_class" } }, ngImport: i0, template: `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `, isInline: true, styles: [":host{padding:20px;display:flex;flex-direction:row;font-size:13px;gap:.3em}:host.size-small{padding:8px;font-size:8px}:host.size-large{font-size:18px}:host span.dot{display:block;border-radius:50%;height:1em;width:1em}:host span.dot:nth-of-type(1){background-color:#4a89dc}:host span.dot:nth-of-type(2){background-color:#967adc}:host span.dot:nth-of-type(3){background-color:#da4453}:host span.dot:nth-of-type(4){background-color:#f6b042}:host span.dot:nth-of-type(5){background-color:#37bc9b}:host span.dot:nth-of-type(1){animation:jump 1.6s ease-in-out 70ms forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:70ms;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host span.dot:nth-of-type(2){animation:jump 1.6s ease-in-out .14s forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:.14s;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host span.dot:nth-of-type(3){animation:jump 1.6s ease-in-out .21s forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:.21s;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host span.dot:nth-of-type(4){animation:jump 1.6s ease-in-out .28s forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:.28s;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host span.dot:nth-of-type(5){animation:jump 1.6s ease-in-out .35s forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:.35s;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host.color-aqua span.dot{background-color:#3bafda}:host.color-ocean span.dot{background-color:#4a89dc}:host.color-mint span.dot{background-color:#37bc9b}:host.color-grass span.dot{background-color:#8cc152}:host.color-sunflower span.dot{background-color:#f6b042}:host.color-bittersweet span.dot{background-color:#eb6845}:host.color-grapefruit span.dot{background-color:#da4453}:host.color-carnation span.dot{background-color:#d770ad}:host.color-lavender span.dot{background-color:#967adc}:host.color-mountain span.dot{background-color:#9678b6}:host.white span.dot,:host[inverse] span.dot{background-color:#fff!important}@keyframes jump{0%{transform:translateY(0)}30%{transform:translateY(0);opacity:1}45%{transform:translateY(-1.2em);opacity:.5}60%{transform:translateY(.8em);opacity:.95}to{transform:translateY(0);opacity:1}}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoLoadingElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-loading', template: `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `, styles: [":host{padding:20px;display:flex;flex-direction:row;font-size:13px;gap:.3em}:host.size-small{padding:8px;font-size:8px}:host.size-large{font-size:18px}:host span.dot{display:block;border-radius:50%;height:1em;width:1em}:host span.dot:nth-of-type(1){background-color:#4a89dc}:host span.dot:nth-of-type(2){background-color:#967adc}:host span.dot:nth-of-type(3){background-color:#da4453}:host span.dot:nth-of-type(4){background-color:#f6b042}:host span.dot:nth-of-type(5){background-color:#37bc9b}:host span.dot:nth-of-type(1){animation:jump 1.6s ease-in-out 70ms forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:70ms;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host span.dot:nth-of-type(2){animation:jump 1.6s ease-in-out .14s forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:.14s;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host span.dot:nth-of-type(3){animation:jump 1.6s ease-in-out .21s forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:.21s;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host span.dot:nth-of-type(4){animation:jump 1.6s ease-in-out .28s forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:.28s;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host span.dot:nth-of-type(5){animation:jump 1.6s ease-in-out .35s forward infinite \"\" \"\";animation-name:jump;animation-duration:1.6s;animation-timing-function:ease-in-out;animation-delay:.35s;animation-direction:forward;animation-iteration-count:infinite;animation-fill-mode:\"\";animation-play-state:\"\"}:host.color-aqua span.dot{background-color:#3bafda}:host.color-ocean span.dot{background-color:#4a89dc}:host.color-mint span.dot{background-color:#37bc9b}:host.color-grass span.dot{background-color:#8cc152}:host.color-sunflower span.dot{background-color:#f6b042}:host.color-bittersweet span.dot{background-color:#eb6845}:host.color-grapefruit span.dot{background-color:#da4453}:host.color-carnation span.dot{background-color:#d770ad}:host.color-lavender span.dot{background-color:#967adc}:host.color-mountain span.dot{background-color:#9678b6}:host.white span.dot,:host[inverse] span.dot{background-color:#fff!important}@keyframes jump{0%{transform:translateY(0)}30%{transform:translateY(0);opacity:1}45%{transform:translateY(-1.2em);opacity:.5}60%{transform:translateY(.8em);opacity:.95}to{transform:translateY(0);opacity:1}}\n"] }]
        }], propDecorators: { theme: [{
                type: Input
            }], color: [{
                type: Input
            }], size: [{
                type: Input
            }], hb_class: [{
                type: HostBinding,
                args: ['class']
            }] } });
export class NovoSpinnerElement {
    constructor() {
        this.size = 'medium';
    }
    /**
     * **deprecated** please use `color`.
     * @deprecated
     **/
    set theme(value) {
        console.warn(`'theme' property is deprecated, please use 'color'.`);
        this.color = value;
    }
    get theme() {
        return this.color;
    }
    get inverse() {
        return this._inverse;
    }
    set inverse(value) {
        this._inverse = coerceBooleanProperty(value);
    }
    get hb_class() {
        return [this.inverse ? 'color-white' : `color-${this.color}`, `size-${this.size}`].join(' ');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSpinnerElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoSpinnerElement, selector: "novo-spinner", inputs: { theme: "theme", color: "color", size: "size", inverse: "inverse" }, host: { properties: { "class": "this.hb_class" } }, ngImport: i0, template: `
    <div class="dot1 dot"></div>
    <div class="dot2 dot"></div>
    <div class="dot3 dot"></div>
    <div class="dot4 dot"></div>
    <div class="dot5 dot"></div>
    <div class="dot6 dot"></div>
    <div class="dot7 dot"></div>
    <div class="dot8 dot"></div>
    <div class="dot9 dot"></div>
    <div class="dot10 dot"></div>
    <div class="dot11 dot"></div>
    <div class="dot12 dot"></div>
  `, isInline: true, styles: [":host{display:inline-block;width:1.8em;height:1.8em;position:relative}:host.size-small{width:1.2em;height:1.2em}:host.size-large{width:2.1em;height:2.1em}:host .dot{width:100%;height:100%;position:absolute;left:0;top:0}:host .dot:before{content:\"\";display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;-webkit-animation:dotFadeDelay 1.2s infinite ease-in-out both;animation:dotFadeDelay 1.2s infinite ease-in-out both}:host.aqua .dot:before{background-color:#3bafda}:host.ocean .dot:before{background-color:#4a89dc}:host.mint .dot:before{background-color:#37bc9b}:host.grass .dot:before{background-color:#8cc152}:host.sunflower .dot:before{background-color:#f6b042}:host.bittersweet .dot:before{background-color:#eb6845}:host.grapefruit .dot:before{background-color:#da4453}:host.carnation .dot:before{background-color:#d770ad}:host.lavender .dot:before{background-color:#967adc}:host.mountain .dot:before{background-color:#9678b6}:host.multicolor .dot:nth-of-type(1):before{background-color:#3bafda}:host.multicolor .dot:nth-of-type(2):before{background-color:#4a89dc}:host.multicolor .dot:nth-of-type(3):before{background-color:#37bc9b}:host.multicolor .dot:nth-of-type(4):before{background-color:#8cc152}:host.multicolor .dot:nth-of-type(5):before{background-color:#f6b042}:host.multicolor .dot:nth-of-type(6):before{background-color:#eb6845}:host.multicolor .dot:nth-of-type(7):before{background-color:#da4453}:host.multicolor .dot:nth-of-type(8):before{background-color:#d770ad}:host.multicolor .dot:nth-of-type(9):before{background-color:#967adc}:host.multicolor .dot:nth-of-type(10):before{background-color:#9678b6}:host.white .dot:before,:host[inverse] .dot:before{background-color:#fff}:host .dot2{-webkit-transform:rotate(30deg);-ms-transform:rotate(30deg);transform:rotate(30deg)}:host .dot3{-webkit-transform:rotate(60deg);-ms-transform:rotate(60deg);transform:rotate(60deg)}:host .dot4{-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}:host .dot5{-webkit-transform:rotate(120deg);-ms-transform:rotate(120deg);transform:rotate(120deg)}:host .dot6{-webkit-transform:rotate(150deg);-ms-transform:rotate(150deg);transform:rotate(150deg)}:host .dot7{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}:host .dot8{-webkit-transform:rotate(210deg);-ms-transform:rotate(210deg);transform:rotate(210deg)}:host .dot9{-webkit-transform:rotate(240deg);-ms-transform:rotate(240deg);transform:rotate(240deg)}:host .dot10{-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}:host .dot11{-webkit-transform:rotate(300deg);-ms-transform:rotate(300deg);transform:rotate(300deg)}:host .dot12{-webkit-transform:rotate(330deg);-ms-transform:rotate(330deg);transform:rotate(330deg)}:host .dot2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}:host .dot3:before{-webkit-animation-delay:-1s;animation-delay:-1s}:host .dot4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}:host .dot5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}:host .dot6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}:host .dot7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}:host .dot8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}:host .dot9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}:host .dot10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}:host .dot11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}:host .dot12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes dotFadeDelay{0%,39%,to{opacity:0}40%{opacity:1}}@keyframes dotFadeDelay{0%,39%,to{opacity:0}40%{opacity:1}}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSpinnerElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-spinner', template: `
    <div class="dot1 dot"></div>
    <div class="dot2 dot"></div>
    <div class="dot3 dot"></div>
    <div class="dot4 dot"></div>
    <div class="dot5 dot"></div>
    <div class="dot6 dot"></div>
    <div class="dot7 dot"></div>
    <div class="dot8 dot"></div>
    <div class="dot9 dot"></div>
    <div class="dot10 dot"></div>
    <div class="dot11 dot"></div>
    <div class="dot12 dot"></div>
  `, styles: [":host{display:inline-block;width:1.8em;height:1.8em;position:relative}:host.size-small{width:1.2em;height:1.2em}:host.size-large{width:2.1em;height:2.1em}:host .dot{width:100%;height:100%;position:absolute;left:0;top:0}:host .dot:before{content:\"\";display:block;margin:0 auto;width:15%;height:15%;background-color:#333;border-radius:100%;-webkit-animation:dotFadeDelay 1.2s infinite ease-in-out both;animation:dotFadeDelay 1.2s infinite ease-in-out both}:host.aqua .dot:before{background-color:#3bafda}:host.ocean .dot:before{background-color:#4a89dc}:host.mint .dot:before{background-color:#37bc9b}:host.grass .dot:before{background-color:#8cc152}:host.sunflower .dot:before{background-color:#f6b042}:host.bittersweet .dot:before{background-color:#eb6845}:host.grapefruit .dot:before{background-color:#da4453}:host.carnation .dot:before{background-color:#d770ad}:host.lavender .dot:before{background-color:#967adc}:host.mountain .dot:before{background-color:#9678b6}:host.multicolor .dot:nth-of-type(1):before{background-color:#3bafda}:host.multicolor .dot:nth-of-type(2):before{background-color:#4a89dc}:host.multicolor .dot:nth-of-type(3):before{background-color:#37bc9b}:host.multicolor .dot:nth-of-type(4):before{background-color:#8cc152}:host.multicolor .dot:nth-of-type(5):before{background-color:#f6b042}:host.multicolor .dot:nth-of-type(6):before{background-color:#eb6845}:host.multicolor .dot:nth-of-type(7):before{background-color:#da4453}:host.multicolor .dot:nth-of-type(8):before{background-color:#d770ad}:host.multicolor .dot:nth-of-type(9):before{background-color:#967adc}:host.multicolor .dot:nth-of-type(10):before{background-color:#9678b6}:host.white .dot:before,:host[inverse] .dot:before{background-color:#fff}:host .dot2{-webkit-transform:rotate(30deg);-ms-transform:rotate(30deg);transform:rotate(30deg)}:host .dot3{-webkit-transform:rotate(60deg);-ms-transform:rotate(60deg);transform:rotate(60deg)}:host .dot4{-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}:host .dot5{-webkit-transform:rotate(120deg);-ms-transform:rotate(120deg);transform:rotate(120deg)}:host .dot6{-webkit-transform:rotate(150deg);-ms-transform:rotate(150deg);transform:rotate(150deg)}:host .dot7{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}:host .dot8{-webkit-transform:rotate(210deg);-ms-transform:rotate(210deg);transform:rotate(210deg)}:host .dot9{-webkit-transform:rotate(240deg);-ms-transform:rotate(240deg);transform:rotate(240deg)}:host .dot10{-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}:host .dot11{-webkit-transform:rotate(300deg);-ms-transform:rotate(300deg);transform:rotate(300deg)}:host .dot12{-webkit-transform:rotate(330deg);-ms-transform:rotate(330deg);transform:rotate(330deg)}:host .dot2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}:host .dot3:before{-webkit-animation-delay:-1s;animation-delay:-1s}:host .dot4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}:host .dot5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}:host .dot6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}:host .dot7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}:host .dot8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}:host .dot9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}:host .dot10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}:host .dot11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}:host .dot12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes dotFadeDelay{0%,39%,to{opacity:0}40%{opacity:1}}@keyframes dotFadeDelay{0%,39%,to{opacity:0}40%{opacity:1}}\n"] }]
        }], propDecorators: { theme: [{
                type: Input
            }], color: [{
                type: Input
            }], size: [{
                type: Input
            }], inverse: [{
                type: Input
            }], hb_class: [{
                type: HostBinding,
                args: ['class']
            }] } });
export class NovoSkeletonDirective {
    constructor() {
        this.skeleton = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSkeletonDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: NovoSkeletonDirective, selector: "[skeleton]", host: { properties: { "class.skeleton": "this.skeleton" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoSkeletonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[skeleton]',
                }]
        }], propDecorators: { skeleton: [{
                type: HostBinding,
                args: ['class.skeleton']
            }] } });
export class NovoLoadedDirective {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoLoadedDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: NovoLoadedDirective, selector: "[loaded]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoLoadedDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[loaded]',
                }]
        }] });
export class NovoIsLoadingDirective {
    constructor(viewContainer) {
        this.viewContainer = viewContainer;
        this.hasView = false;
        this.skeletonViews = [];
        this.loadedViews = [];
    }
    set isLoading(condition) {
        if (!condition && !this.hasView) {
            this.destroyViews(this.loadedViews);
            this.skeletonViews = this.createViews(this.skeletonTemplates);
            this.hasView = true;
        }
        else if (condition && this.hasView) {
            this.destroyViews(this.skeletonViews);
            this.loadedViews = this.createViews(this.loadedTemplates);
            this.hasView = false;
        }
    }
    createViews(templates) {
        return templates && templates.map((v, i) => this.viewContainer.createEmbeddedView(v, null, i));
    }
    destroyViews(views) {
        if (views) {
            for (const view of views) {
                view.destroy();
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoIsLoadingDirective, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.3.12", type: NovoIsLoadingDirective, selector: "[isLoading]", inputs: { isLoading: "isLoading" }, queries: [{ propertyName: "skeletonTemplates", predicate: NovoSkeletonDirective, read: TemplateRef }, { propertyName: "loadedTemplates", predicate: NovoLoadedDirective, read: TemplateRef }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoIsLoadingDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[isLoading]',
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }], propDecorators: { skeletonTemplates: [{
                type: ContentChildren,
                args: [NovoSkeletonDirective, { read: TemplateRef }]
            }], loadedTemplates: [{
                type: ContentChildren,
                args: [NovoLoadedDirective, { read: TemplateRef }]
            }], isLoading: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9hZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2xvYWRpbmcvTG9hZGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDOUQsT0FBTyxFQUNMLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUVULFdBQVcsRUFDWCxLQUFLLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7O0FBYXZCLE1BQU0sT0FBTyxrQkFBa0I7SUFYL0I7UUE2QkUsU0FBSSxHQUFXLFFBQVEsQ0FBQztLQU16QjtJQXZCQzs7O1FBR0k7SUFDSixJQUNJLEtBQUssQ0FBQyxLQUFhO1FBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMscURBQXFELENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBQ0QsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFRRCxJQUNJLFFBQVE7UUFDVixPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEUsQ0FBQzsrR0F2QlUsa0JBQWtCO21HQUFsQixrQkFBa0Isa0tBUm5COzs7Ozs7R0FNVDs7NEZBRVUsa0JBQWtCO2tCQVg5QixTQUFTOytCQUNFLGNBQWMsWUFFZDs7Ozs7O0dBTVQ7OEJBUUcsS0FBSztzQkFEUixLQUFLO2dCQVVOLEtBQUs7c0JBREosS0FBSztnQkFJTixJQUFJO3NCQURILEtBQUs7Z0JBSUYsUUFBUTtzQkFEWCxXQUFXO3VCQUFDLE9BQU87O0FB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QyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFDRCxZQUFZLENBQUMsS0FBNkI7UUFDeEMsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNWLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7K0dBakNVLHNCQUFzQjttR0FBdEIsc0JBQXNCLHlIQUNoQixxQkFBcUIsUUFBVSxXQUFXLGtEQUUxQyxtQkFBbUIsUUFBVSxXQUFXOzs0RkFIOUMsc0JBQXNCO2tCQUhsQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO2lCQUN4QjtxRkFHUSxpQkFBaUI7c0JBRHZCLGVBQWU7dUJBQUMscUJBQXFCLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUd0RCxlQUFlO3NCQURyQixlQUFlO3VCQUFDLG1CQUFtQixFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFVdkQsU0FBUztzQkFEWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBIb3N0QmluZGluZyxcbiAgSW5wdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdub3ZvLWxvYWRpbmcnLFxuICBzdHlsZVVybHM6IFsnLi9Mb2FkaW5nLnNjc3MnXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3BhbiBjbGFzcz1cImRvdFwiPjwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzcz1cImRvdFwiPjwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzcz1cImRvdFwiPjwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzcz1cImRvdFwiPjwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzcz1cImRvdFwiPjwvc3Bhbj5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgTm92b0xvYWRpbmdFbGVtZW50IHtcbiAgLyoqXG4gICAqICoqZGVwcmVjYXRlZCoqIHBsZWFzZSB1c2UgYGNvbG9yYC5cbiAgICogQGRlcHJlY2F0ZWRcbiAgICoqL1xuICBASW5wdXQoKVxuICBzZXQgdGhlbWUodmFsdWU6IHN0cmluZykge1xuICAgIGNvbnNvbGUud2FybihgJ3RoZW1lJyBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlICdjb2xvcicuYCk7XG4gICAgdGhpcy5jb2xvciA9IHZhbHVlO1xuICB9XG4gIGdldCB0aGVtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNvbG9yO1xuICB9XG5cbiAgQElucHV0KClcbiAgY29sb3I6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBzaXplOiBzdHJpbmcgPSAnbWVkaXVtJztcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGhiX2NsYXNzKCkge1xuICAgIHJldHVybiBbYGNvbG9yLSR7dGhpcy5jb2xvcn1gLCBgc2l6ZS0ke3RoaXMuc2l6ZX1gXS5qb2luKCcgJyk7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1zcGlubmVyJyxcbiAgc3R5bGVVcmxzOiBbJy4vTm92b1NwaW5uZXIuc2NzcyddLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJkb3QxIGRvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkb3QyIGRvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkb3QzIGRvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkb3Q0IGRvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkb3Q1IGRvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkb3Q2IGRvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkb3Q3IGRvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkb3Q4IGRvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkb3Q5IGRvdFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkb3QxMCBkb3RcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiZG90MTEgZG90XCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImRvdDEyIGRvdFwiPjwvZGl2PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvU3Bpbm5lckVsZW1lbnQge1xuICAvKipcbiAgICogKipkZXByZWNhdGVkKiogcGxlYXNlIHVzZSBgY29sb3JgLlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiovXG4gIEBJbnB1dCgpXG4gIHNldCB0aGVtZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgY29uc29sZS53YXJuKGAndGhlbWUnIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgJ2NvbG9yJy5gKTtcbiAgICB0aGlzLmNvbG9yID0gdmFsdWU7XG4gIH1cbiAgZ2V0IHRoZW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY29sb3I7XG4gIH1cblxuICBASW5wdXQoKVxuICBjb2xvcjogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNpemU6IHN0cmluZyA9ICdtZWRpdW0nO1xuXG4gIHByaXZhdGUgX2ludmVyc2U6IGJvb2xlYW47XG4gIGdldCBpbnZlcnNlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pbnZlcnNlO1xuICB9XG4gIEBJbnB1dCgpXG4gIHNldCBpbnZlcnNlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faW52ZXJzZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgZ2V0IGhiX2NsYXNzKCkge1xuICAgIHJldHVybiBbdGhpcy5pbnZlcnNlID8gJ2NvbG9yLXdoaXRlJyA6IGBjb2xvci0ke3RoaXMuY29sb3J9YCwgYHNpemUtJHt0aGlzLnNpemV9YF0uam9pbignICcpO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tza2VsZXRvbl0nLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvU2tlbGV0b25EaXJlY3RpdmUge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnNrZWxldG9uJylcbiAgc2tlbGV0b246IGJvb2xlYW4gPSB0cnVlO1xufVxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2xvYWRlZF0nLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvTG9hZGVkRGlyZWN0aXZlIHt9XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tpc0xvYWRpbmddJyxcbn0pXG5leHBvcnQgY2xhc3MgTm92b0lzTG9hZGluZ0RpcmVjdGl2ZSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTm92b1NrZWxldG9uRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gIHB1YmxpYyBza2VsZXRvblRlbXBsYXRlczogUXVlcnlMaXN0PFRlbXBsYXRlUmVmPGFueT4+O1xuICBAQ29udGVudENoaWxkcmVuKE5vdm9Mb2FkZWREaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgcHVibGljIGxvYWRlZFRlbXBsYXRlczogUXVlcnlMaXN0PFRlbXBsYXRlUmVmPGFueT4+O1xuXG4gIHByaXZhdGUgaGFzVmlldyA9IGZhbHNlO1xuICBwcml2YXRlIHNrZWxldG9uVmlld3M6IEVtYmVkZGVkVmlld1JlZjxOb3ZvU2tlbGV0b25EaXJlY3RpdmU+W10gPSBbXTtcbiAgcHJpdmF0ZSBsb2FkZWRWaWV3czogRW1iZWRkZWRWaWV3UmVmPE5vdm9Mb2FkZWREaXJlY3RpdmU+W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZpZXdDb250YWluZXI6IFZpZXdDb250YWluZXJSZWYpIHt9XG5cbiAgQElucHV0KClcbiAgc2V0IGlzTG9hZGluZyhjb25kaXRpb246IGJvb2xlYW4pIHtcbiAgICBpZiAoIWNvbmRpdGlvbiAmJiAhdGhpcy5oYXNWaWV3KSB7XG4gICAgICB0aGlzLmRlc3Ryb3lWaWV3cyh0aGlzLmxvYWRlZFZpZXdzKTtcbiAgICAgIHRoaXMuc2tlbGV0b25WaWV3cyA9IHRoaXMuY3JlYXRlVmlld3ModGhpcy5za2VsZXRvblRlbXBsYXRlcyk7XG4gICAgICB0aGlzLmhhc1ZpZXcgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoY29uZGl0aW9uICYmIHRoaXMuaGFzVmlldykge1xuICAgICAgdGhpcy5kZXN0cm95Vmlld3ModGhpcy5za2VsZXRvblZpZXdzKTtcbiAgICAgIHRoaXMubG9hZGVkVmlld3MgPSB0aGlzLmNyZWF0ZVZpZXdzKHRoaXMubG9hZGVkVGVtcGxhdGVzKTtcbiAgICAgIHRoaXMuaGFzVmlldyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBjcmVhdGVWaWV3cyh0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxUZW1wbGF0ZVJlZjxhbnk+Pikge1xuICAgIHJldHVybiB0ZW1wbGF0ZXMgJiYgdGVtcGxhdGVzLm1hcCgodiwgaSkgPT4gdGhpcy52aWV3Q29udGFpbmVyLmNyZWF0ZUVtYmVkZGVkVmlldyh2LCBudWxsLCBpKSk7XG4gIH1cbiAgZGVzdHJveVZpZXdzKHZpZXdzOiBFbWJlZGRlZFZpZXdSZWY8YW55PltdKSB7XG4gICAgaWYgKHZpZXdzKSB7XG4gICAgICBmb3IgKGNvbnN0IHZpZXcgb2Ygdmlld3MpIHtcbiAgICAgICAgdmlldy5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=