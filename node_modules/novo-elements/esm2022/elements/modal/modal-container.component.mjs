import { ComponentPortal } from '@angular/cdk/portal';
import { Component, EventEmitter, HostBinding, Injector, Output } from '@angular/core';
import { NovoModalRef } from './modal-ref';
import { zoomInOut } from './modal.animation';
import * as i0 from "@angular/core";
import * as i1 from "./modal-ref";
import * as i2 from "@angular/cdk/portal";
export class NovoModalContainerComponent {
    constructor(injector, modalRef) {
        this.injector = injector;
        this.modalRef = modalRef;
        this.animationStateChanged = new EventEmitter();
        this.animationState = 'enter';
        this.initTimestamp = Date.now();
        this.id = `modal-container-${this.initTimestamp}`;
        this.component = new ComponentPortal(modalRef.component, null, injector);
    }
    onAnimationStart(event) {
        this.animationStateChanged.emit(event);
    }
    onAnimationDone(event) {
        this.animationStateChanged.emit(event);
    }
    startExitAnimation() {
        this.animationState = 'leave';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoModalContainerComponent, deps: [{ token: i0.Injector }, { token: i1.NovoModalRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoModalContainerComponent, selector: "novo-modal-container", outputs: { animationStateChanged: "animationStateChanged" }, host: { properties: { "id": "this.id" } }, ngImport: i0, template: "<div class=\"modal-container\"\n     [@zoomInOut]=\"animationState\"\n     (@zoomInOut.start)=\"onAnimationStart($event)\"\n     (@zoomInOut.done)=\"onAnimationDone($event)\">\n  <ng-template [cdkPortalOutlet]=\"component\"></ng-template>\n</div>", styles: [":host{background:#00000040}:host .modal-container{z-index:z(modal);position:fixed;display:flex;align-items:center;justify-content:center;inset:0}\n"], dependencies: [{ kind: "directive", type: i2.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [zoomInOut] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoModalContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'novo-modal-container', animations: [zoomInOut], template: "<div class=\"modal-container\"\n     [@zoomInOut]=\"animationState\"\n     (@zoomInOut.start)=\"onAnimationStart($event)\"\n     (@zoomInOut.done)=\"onAnimationDone($event)\">\n  <ng-template [cdkPortalOutlet]=\"component\"></ng-template>\n</div>", styles: [":host{background:#00000040}:host .modal-container{z-index:z(modal);position:fixed;display:flex;align-items:center;justify-content:center;inset:0}\n"] }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i1.NovoModalRef }], propDecorators: { animationStateChanged: [{
                type: Output
            }], id: [{
                type: HostBinding,
                args: ['id']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL21vZGFsL21vZGFsLWNvbnRhaW5lci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9tb2RhbC9tb2RhbC1jb250YWluZXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBVSxNQUFNLHFCQUFxQixDQUFDO0FBQzlELE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7O0FBUTlDLE1BQU0sT0FBTywyQkFBMkI7SUFPdEMsWUFBb0IsUUFBa0IsRUFBVSxRQUFzQjtRQUFsRCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQU41RCwwQkFBcUIsR0FBRyxJQUFJLFlBQVksRUFBa0IsQ0FBQztRQUNyRSxtQkFBYyxHQUErQixPQUFPLENBQUM7UUFFckQsa0JBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDUixPQUFFLEdBQUcsbUJBQW1CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUc5RCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFxQjtRQUNwQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxlQUFlLENBQUMsS0FBcUI7UUFDbkMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDO0lBQ2hDLENBQUM7K0dBckJVLDJCQUEyQjttR0FBM0IsMkJBQTJCLG9LQ1p4Qyx3UEFLTSxrV0RLUSxDQUFDLFNBQVMsQ0FBQzs7NEZBRVosMkJBQTJCO2tCQU52QyxTQUFTOytCQUNFLHNCQUFzQixjQUdwQixDQUFDLFNBQVMsQ0FBQzt3R0FHYixxQkFBcUI7c0JBQTlCLE1BQU07Z0JBSVksRUFBRTtzQkFBcEIsV0FBVzt1QkFBQyxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5pbWF0aW9uRXZlbnQgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCwgUG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIEluamVjdG9yLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vdm9Nb2RhbFJlZiB9IGZyb20gJy4vbW9kYWwtcmVmJztcbmltcG9ydCB7IHpvb21Jbk91dCB9IGZyb20gJy4vbW9kYWwuYW5pbWF0aW9uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1tb2RhbC1jb250YWluZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbW9kYWwtY29udGFpbmVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbW9kYWwtY29udGFpbmVyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGFuaW1hdGlvbnM6IFt6b29tSW5PdXRdLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvTW9kYWxDb250YWluZXJDb21wb25lbnQge1xuICBAT3V0cHV0KCkgYW5pbWF0aW9uU3RhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxBbmltYXRpb25FdmVudD4oKTtcbiAgYW5pbWF0aW9uU3RhdGU6ICd2b2lkJyB8ICdlbnRlcicgfCAnbGVhdmUnID0gJ2VudGVyJztcbiAgY29tcG9uZW50OiBQb3J0YWw8YW55PjtcbiAgaW5pdFRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gIEBIb3N0QmluZGluZygnaWQnKSBpZCA9IGBtb2RhbC1jb250YWluZXItJHt0aGlzLmluaXRUaW1lc3RhbXB9YDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBtb2RhbFJlZjogTm92b01vZGFsUmVmKSB7XG4gICAgdGhpcy5jb21wb25lbnQgPSBuZXcgQ29tcG9uZW50UG9ydGFsKG1vZGFsUmVmLmNvbXBvbmVudCwgbnVsbCwgaW5qZWN0b3IpO1xuICB9XG5cbiAgb25BbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLmFuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIG9uQW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLmFuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHN0YXJ0RXhpdEFuaW1hdGlvbigpIHtcbiAgICB0aGlzLmFuaW1hdGlvblN0YXRlID0gJ2xlYXZlJztcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRhaW5lclwiXG4gICAgIFtAem9vbUluT3V0XT1cImFuaW1hdGlvblN0YXRlXCJcbiAgICAgKEB6b29tSW5PdXQuc3RhcnQpPVwib25BbmltYXRpb25TdGFydCgkZXZlbnQpXCJcbiAgICAgKEB6b29tSW5PdXQuZG9uZSk9XCJvbkFuaW1hdGlvbkRvbmUoJGV2ZW50KVwiPlxuICA8bmctdGVtcGxhdGUgW2Nka1BvcnRhbE91dGxldF09XCJjb21wb25lbnRcIj48L25nLXRlbXBsYXRlPlxuPC9kaXY+Il19