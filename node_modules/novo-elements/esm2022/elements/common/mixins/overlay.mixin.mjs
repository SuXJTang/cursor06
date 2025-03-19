import { InjectionToken } from '@angular/core';
export const NOVO_OVERLAY_CONTAINER = new InjectionToken('NovoOverlayContainer');
/** Mixin to augment a directive with a `overlay` property. */
export function mixinOverlay(base) {
    // Note: We cast `base` to `unknown` and then `Constructor`. It could be an abstract class,
    // but given we `extend` it from another class, we can assume a constructor being accessible.
    class Mixin extends base {
        constructor(...args) {
            super(...args);
        }
        openPanel() {
            if (!this.disabled) {
                this.overlay.openPanel();
            }
        }
        closePanel() {
            this.overlay.closePanel();
        }
        togglePanel() {
            if (this.panelOpen) {
                this.closePanel();
            }
            else {
                this.openPanel();
            }
        }
        get panelOpen() {
            return this.overlay && this.overlay.panelOpen;
        }
    }
    // Since we don't directly extend from `base` with it's original types, and we instruct
    // TypeScript that `T` actually is instantiatable through `new`, the types don't overlap.
    // This is a limitation in TS as abstract classes cannot be typed properly dynamically.
    return Mixin;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS5taXhpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2NvbW1vbi9taXhpbnMvb3ZlcmxheS5taXhpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBZS9DLE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLElBQUksY0FBYyxDQUFhLHNCQUFzQixDQUFDLENBQUM7QUFLN0YsOERBQThEO0FBQzlELE1BQU0sVUFBVSxZQUFZLENBQTRDLElBQU87SUFDN0UsMkZBQTJGO0lBQzNGLDZGQUE2RjtJQUM3RixNQUFlLEtBQU0sU0FBUyxJQUEyQztRQUd2RSxZQUFZLEdBQUcsSUFBVztZQUN4QixLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNqQixDQUFDO1FBRUQsU0FBUztZQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDM0IsQ0FBQztRQUNILENBQUM7UUFFRCxVQUFVO1lBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QixDQUFDO1FBRUQsV0FBVztZQUNULElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDcEIsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNuQixDQUFDO1FBQ0gsQ0FBQztRQUVELElBQUksU0FBUztZQUNYLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNoRCxDQUFDO0tBQ0Y7SUFFRCx1RkFBdUY7SUFDdkYseUZBQXlGO0lBQ3pGLHVGQUF1RjtJQUN2RixPQUFPLEtBQStDLENBQUM7QUFDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGlvblRva2VuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOb3ZvT3ZlcmxheVRlbXBsYXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vb3ZlcmxheSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnN0cnVjdG9yLCBDb25zdHJ1Y3RvciB9IGZyb20gJy4vY29uc3RydWN0b3InO1xuaW1wb3J0IHsgQ2FuRGlzYWJsZSB9IGZyb20gJy4vZGlzYWJsZWQubWl4aW4nO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGludGVyZmFjZSBIYXNPdmVybGF5IHtcbiAgb3ZlcmxheTogTm92b092ZXJsYXlUZW1wbGF0ZUNvbXBvbmVudDtcbiAgcmVhZG9ubHkgcGFuZWxPcGVuOiBib29sZWFuO1xuXG4gIG9wZW5QYW5lbCgpOiB2b2lkO1xuICBjbG9zZVBhbmVsKCk6IHZvaWQ7XG4gIHRvZ2dsZVBhbmVsKCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjb25zdCBOT1ZPX09WRVJMQVlfQ09OVEFJTkVSID0gbmV3IEluamVjdGlvblRva2VuPEhhc092ZXJsYXk+KCdOb3ZvT3ZlcmxheUNvbnRhaW5lcicpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IHR5cGUgSGFzT3ZlcmxheUN0b3IgPSBDb25zdHJ1Y3RvcjxIYXNPdmVybGF5PjtcblxuLyoqIE1peGluIHRvIGF1Z21lbnQgYSBkaXJlY3RpdmUgd2l0aCBhIGBvdmVybGF5YCBwcm9wZXJ0eS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbk92ZXJsYXk8VCBleHRlbmRzIEFic3RyYWN0Q29uc3RydWN0b3I8Q2FuRGlzYWJsZT4+KGJhc2U6IFQpOiBIYXNPdmVybGF5Q3RvciAmIFQge1xuICAvLyBOb3RlOiBXZSBjYXN0IGBiYXNlYCB0byBgdW5rbm93bmAgYW5kIHRoZW4gYENvbnN0cnVjdG9yYC4gSXQgY291bGQgYmUgYW4gYWJzdHJhY3QgY2xhc3MsXG4gIC8vIGJ1dCBnaXZlbiB3ZSBgZXh0ZW5kYCBpdCBmcm9tIGFub3RoZXIgY2xhc3MsIHdlIGNhbiBhc3N1bWUgYSBjb25zdHJ1Y3RvciBiZWluZyBhY2Nlc3NpYmxlLlxuICBhYnN0cmFjdCBjbGFzcyBNaXhpbiBleHRlbmRzIChiYXNlIGFzIHVua25vd24gYXMgQ29uc3RydWN0b3I8Q2FuRGlzYWJsZT4pIHtcbiAgICBhYnN0cmFjdCBvdmVybGF5OiBOb3ZvT3ZlcmxheVRlbXBsYXRlQ29tcG9uZW50O1xuXG4gICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHtcbiAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIG9wZW5QYW5lbCgpOiB2b2lkIHtcbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICB0aGlzLm92ZXJsYXkub3BlblBhbmVsKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2xvc2VQYW5lbCgpOiB2b2lkIHtcbiAgICAgIHRoaXMub3ZlcmxheS5jbG9zZVBhbmVsKCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlUGFuZWwoKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wZW5QYW5lbCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGdldCBwYW5lbE9wZW4oKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5vdmVybGF5ICYmIHRoaXMub3ZlcmxheS5wYW5lbE9wZW47XG4gICAgfVxuICB9XG5cbiAgLy8gU2luY2Ugd2UgZG9uJ3QgZGlyZWN0bHkgZXh0ZW5kIGZyb20gYGJhc2VgIHdpdGggaXQncyBvcmlnaW5hbCB0eXBlcywgYW5kIHdlIGluc3RydWN0XG4gIC8vIFR5cGVTY3JpcHQgdGhhdCBgVGAgYWN0dWFsbHkgaXMgaW5zdGFudGlhdGFibGUgdGhyb3VnaCBgbmV3YCwgdGhlIHR5cGVzIGRvbid0IG92ZXJsYXAuXG4gIC8vIFRoaXMgaXMgYSBsaW1pdGF0aW9uIGluIFRTIGFzIGFic3RyYWN0IGNsYXNzZXMgY2Fubm90IGJlIHR5cGVkIHByb3Blcmx5IGR5bmFtaWNhbGx5LlxuICByZXR1cm4gTWl4aW4gYXMgdW5rbm93biBhcyBUICYgQ29uc3RydWN0b3I8SGFzT3ZlcmxheT47XG59XG4iXX0=