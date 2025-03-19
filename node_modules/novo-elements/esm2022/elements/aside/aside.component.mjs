import { ComponentPortal } from '@angular/cdk/portal';
import { Component, EventEmitter, Injector, Output } from '@angular/core';
import { NovoAsideRef } from './aside-ref';
import { slideInOut } from './aside.animation';
import * as i0 from "@angular/core";
import * as i1 from "./aside-ref";
import * as i2 from "@angular/cdk/portal";
export class AsideComponent {
    constructor(injector, asideRef) {
        this.injector = injector;
        this.asideRef = asideRef;
        this.animationStateChanged = new EventEmitter();
        this.animationState = 'enter';
        this.component = new ComponentPortal(asideRef.component, null, injector);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: AsideComponent, deps: [{ token: i0.Injector }, { token: i1.NovoAsideRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: AsideComponent, selector: "novo-aside", outputs: { animationStateChanged: "animationStateChanged" }, ngImport: i0, template: "<div class=\"aside-panel\" [@slideInOut]=\"animationState\" (@slideInOut.start)=\"onAnimationStart($event)\"\n  (@slideInOut.done)=\"onAnimationDone($event)\">\n  <ng-template [cdkPortalOutlet]=\"component\"></ng-template>\n</div>", styles: [":host .aside-panel{background-color:var(--background-bright, #ffffff);height:100vh;width:50%;min-width:min-content;max-width:540px;position:absolute;top:0;right:0;padding:0;display:flex;justify-content:stretch;align-items:stretch}\n"], dependencies: [{ kind: "directive", type: i2.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [slideInOut] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: AsideComponent, decorators: [{
            type: Component,
            args: [{ selector: 'novo-aside', animations: [slideInOut], template: "<div class=\"aside-panel\" [@slideInOut]=\"animationState\" (@slideInOut.start)=\"onAnimationStart($event)\"\n  (@slideInOut.done)=\"onAnimationDone($event)\">\n  <ng-template [cdkPortalOutlet]=\"component\"></ng-template>\n</div>", styles: [":host .aside-panel{background-color:var(--background-bright, #ffffff);height:100vh;width:50%;min-width:min-content;max-width:540px;position:absolute;top:0;right:0;padding:0;display:flex;justify-content:stretch;align-items:stretch}\n"] }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i1.NovoAsideRef }], propDecorators: { animationStateChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNpZGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvYXNpZGUvYXNpZGUuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvYXNpZGUvYXNpZGUuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGVBQWUsRUFBVSxNQUFNLHFCQUFxQixDQUFDO0FBQzlELE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7QUFRL0MsTUFBTSxPQUFPLGNBQWM7SUFPekIsWUFBb0IsUUFBa0IsRUFBVSxRQUFzQjtRQUFsRCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBYztRQU41RCwwQkFBcUIsR0FBRyxJQUFJLFlBQVksRUFBa0IsQ0FBQztRQUVyRSxtQkFBYyxHQUErQixPQUFPLENBQUM7UUFLbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsS0FBcUI7UUFDcEMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsZUFBZSxDQUFDLEtBQXFCO1FBQ25DLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQztJQUNoQyxDQUFDOytHQXJCVSxjQUFjO21HQUFkLGNBQWMsK0dDWjNCLHdPQUdNLHViRE9RLENBQUMsVUFBVSxDQUFDOzs0RkFFYixjQUFjO2tCQU4xQixTQUFTOytCQUNFLFlBQVksY0FHVixDQUFDLFVBQVUsQ0FBQzt3R0FHZCxxQkFBcUI7c0JBQTlCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBbmltYXRpb25FdmVudCB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsLCBQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3RvciwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOb3ZvQXNpZGVSZWYgfSBmcm9tICcuL2FzaWRlLXJlZic7XG5pbXBvcnQgeyBzbGlkZUluT3V0IH0gZnJvbSAnLi9hc2lkZS5hbmltYXRpb24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdub3ZvLWFzaWRlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2FzaWRlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vYXNpZGUuY29tcG9uZW50LnNjc3MnXSxcbiAgYW5pbWF0aW9uczogW3NsaWRlSW5PdXRdLFxufSlcbmV4cG9ydCBjbGFzcyBBc2lkZUNvbXBvbmVudCB7XG4gIEBPdXRwdXQoKSBhbmltYXRpb25TdGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIGFuaW1hdGlvblN0YXRlOiAndm9pZCcgfCAnZW50ZXInIHwgJ2xlYXZlJyA9ICdlbnRlcic7XG5cbiAgY29tcG9uZW50OiBQb3J0YWw8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGluamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBhc2lkZVJlZjogTm92b0FzaWRlUmVmKSB7XG4gICAgdGhpcy5jb21wb25lbnQgPSBuZXcgQ29tcG9uZW50UG9ydGFsKGFzaWRlUmVmLmNvbXBvbmVudCwgbnVsbCwgaW5qZWN0b3IpO1xuICB9XG5cbiAgb25BbmltYXRpb25TdGFydChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLmFuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIG9uQW5pbWF0aW9uRG9uZShldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLmFuaW1hdGlvblN0YXRlQ2hhbmdlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHN0YXJ0RXhpdEFuaW1hdGlvbigpIHtcbiAgICB0aGlzLmFuaW1hdGlvblN0YXRlID0gJ2xlYXZlJztcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cImFzaWRlLXBhbmVsXCIgW0BzbGlkZUluT3V0XT1cImFuaW1hdGlvblN0YXRlXCIgKEBzbGlkZUluT3V0LnN0YXJ0KT1cIm9uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiXG4gIChAc2xpZGVJbk91dC5kb25lKT1cIm9uQW5pbWF0aW9uRG9uZSgkZXZlbnQpXCI+XG4gIDxuZy10ZW1wbGF0ZSBbY2RrUG9ydGFsT3V0bGV0XT1cImNvbXBvbmVudFwiPjwvbmctdGVtcGxhdGU+XG48L2Rpdj4iXX0=