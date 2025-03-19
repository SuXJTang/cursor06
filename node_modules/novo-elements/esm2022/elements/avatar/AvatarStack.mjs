// NG2
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { NovoAvatarElement } from './Avatar';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./Avatar";
export class NovoAvatarStackElement {
    constructor() {
        this.total = 0;
        this.showTotal = false;
        this.remainingCount = 0;
    }
    ngAfterViewInit() {
        // viewChildren is set
        if (this.total - this.viewChildren.length > 0) {
            this.remainingCount = this.total - this.viewChildren.length;
            this.showTotal = true;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAvatarStackElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoAvatarStackElement, selector: "novo-avatar-stack", inputs: { total: "total" }, viewQueries: [{ propertyName: "viewChildren", predicate: NovoAvatarElement, descendants: true }], ngImport: i0, template: `
    <ng-content></ng-content>
    <novo-avatar *ngIf="showTotal" label="+5"></novo-avatar>
  `, isInline: true, styles: [":host{display:inline-flex;flex-flow:row nowrap}:host::ng-deep novo-avatar{transition:all .1s ease-in-out}:host::ng-deep novo-avatar img{border:1px solid #ffffff}:host::ng-deep novo-avatar+novo-avatar{margin-left:-15px}:host::ng-deep novo-avatar:first-child{z-index:5}:host::ng-deep novo-avatar:nth-child(2){z-index:4}:host::ng-deep novo-avatar:nth-child(3){z-index:3}:host::ng-deep novo-avatar:nth-child(4){z-index:2}:host::ng-deep novo-avatar:nth-child(5){z-index:1}:host::ng-deep novo-avatar:nth-child(n+6){z-index:0;margin-left:-15px;display:none;opacity:0}:host:hover::ng-deep novo-avatar{margin-left:0;margin-right:1px}:host:hover::ng-deep novo-avatar:nth-child(n+6){display:unset;opacity:1}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NovoAvatarElement, selector: "novo-avatar", inputs: ["source", "label", "theme", "image", "size", "shape", "color"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAvatarStackElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-avatar-stack', template: `
    <ng-content></ng-content>
    <novo-avatar *ngIf="showTotal" label="+5"></novo-avatar>
  `, styles: [":host{display:inline-flex;flex-flow:row nowrap}:host::ng-deep novo-avatar{transition:all .1s ease-in-out}:host::ng-deep novo-avatar img{border:1px solid #ffffff}:host::ng-deep novo-avatar+novo-avatar{margin-left:-15px}:host::ng-deep novo-avatar:first-child{z-index:5}:host::ng-deep novo-avatar:nth-child(2){z-index:4}:host::ng-deep novo-avatar:nth-child(3){z-index:3}:host::ng-deep novo-avatar:nth-child(4){z-index:2}:host::ng-deep novo-avatar:nth-child(5){z-index:1}:host::ng-deep novo-avatar:nth-child(n+6){z-index:0;margin-left:-15px;display:none;opacity:0}:host:hover::ng-deep novo-avatar{margin-left:0;margin-right:1px}:host:hover::ng-deep novo-avatar:nth-child(n+6){display:unset;opacity:1}\n"] }]
        }], propDecorators: { total: [{
                type: Input
            }], viewChildren: [{
                type: ViewChildren,
                args: [NovoAvatarElement]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXZhdGFyU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9hdmF0YXIvQXZhdGFyU3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTTtBQUNOLE9BQU8sRUFBaUIsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7OztBQVU3QyxNQUFNLE9BQU8sc0JBQXNCO0lBUm5DO1FBVUUsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUlsQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO0tBUTVCO0lBUEMsZUFBZTtRQUNiLHNCQUFzQjtRQUN0QixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBQzVELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDOytHQWRVLHNCQUFzQjttR0FBdEIsc0JBQXNCLHNIQUduQixpQkFBaUIsZ0RBUnJCOzs7R0FHVDs7NEZBRVUsc0JBQXNCO2tCQVJsQyxTQUFTOytCQUNFLG1CQUFtQixZQUVuQjs7O0dBR1Q7OEJBSUQsS0FBSztzQkFESixLQUFLO2dCQUdOLFlBQVk7c0JBRFgsWUFBWTt1QkFBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBORzJcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgSW5wdXQsIFF1ZXJ5TGlzdCwgVmlld0NoaWxkcmVuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOb3ZvQXZhdGFyRWxlbWVudCB9IGZyb20gJy4vQXZhdGFyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1hdmF0YXItc3RhY2snLFxuICBzdHlsZVVybHM6IFsnLi9BdmF0YXJTdGFjay5zY3NzJ10sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDxub3ZvLWF2YXRhciAqbmdJZj1cInNob3dUb3RhbFwiIGxhYmVsPVwiKzVcIj48L25vdm8tYXZhdGFyPlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvQXZhdGFyU3RhY2tFbGVtZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpXG4gIHRvdGFsOiBudW1iZXIgPSAwO1xuICBAVmlld0NoaWxkcmVuKE5vdm9BdmF0YXJFbGVtZW50KVxuICB2aWV3Q2hpbGRyZW4hOiBRdWVyeUxpc3Q8Tm92b0F2YXRhckVsZW1lbnQ+O1xuXG4gIHNob3dUb3RhbDogYm9vbGVhbiA9IGZhbHNlO1xuICByZW1haW5pbmdDb3VudDogbnVtYmVyID0gMDtcbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIHZpZXdDaGlsZHJlbiBpcyBzZXRcbiAgICBpZiAodGhpcy50b3RhbCAtIHRoaXMudmlld0NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVtYWluaW5nQ291bnQgPSB0aGlzLnRvdGFsIC0gdGhpcy52aWV3Q2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgdGhpcy5zaG93VG90YWwgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19