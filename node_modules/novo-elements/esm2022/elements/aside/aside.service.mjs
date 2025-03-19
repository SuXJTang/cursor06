import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { NovoAsideRef } from './aside-ref';
import { AsideComponent } from './aside.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
const DEFAULT_CONFIG = {
    hasBackdrop: true,
    backdropClass: 'aside-overlay-backdrop',
    panelClass: 'aside-overlay-panel',
};
export class NovoAsideService {
    constructor(injector, overlay) {
        this.injector = injector;
        this.overlay = overlay;
    }
    open(component, params = {}, config = {}) {
        // Override default configuration
        const asideConfig = this.getOverlayConfig({ ...DEFAULT_CONFIG, ...config });
        // Returns an OverlayRef which is a PortalHost
        const overlayRef = this.createOverlay(asideConfig);
        // Instantiate remote control
        const asideRef = new NovoAsideRef(component, params, overlayRef);
        const overlayComponent = this.attachAsideContainer(AsideComponent, overlayRef, asideConfig, asideRef);
        // Pass the instance of the overlay component to the remote control
        asideRef.componentInstance = overlayComponent;
        overlayRef.backdropClick().subscribe(() => asideRef.close());
        return asideRef;
    }
    createOverlay(config) {
        return this.overlay.create(config);
    }
    attachAsideContainer(component, overlayRef, config, asideRef) {
        const injector = this.createInjector(config, asideRef);
        const containerPortal = new ComponentPortal(component, null, injector);
        const containerRef = overlayRef.attach(containerPortal);
        return containerRef.instance;
    }
    createInjector(config, asideRef) {
        const injectionTokens = new WeakMap();
        injectionTokens.set(NovoAsideRef, asideRef);
        return new PortalInjector(this.injector, injectionTokens);
    }
    getOverlayConfig(config) {
        // const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
        const scrollStrategy = config.hasBackdrop ? this.overlay.scrollStrategies.block() : this.overlay.scrollStrategies.noop();
        return {
            scrollStrategy,
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAsideService, deps: [{ token: i0.Injector }, { token: i1.Overlay }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAsideService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAsideService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i1.Overlay }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNpZGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2FzaWRlL2FzaWRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBNkIsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RFLE9BQU8sRUFBZ0IsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7O0FBUW5ELE1BQU0sY0FBYyxHQUFnQjtJQUNsQyxXQUFXLEVBQUUsSUFBSTtJQUNqQixhQUFhLEVBQUUsd0JBQXdCO0lBQ3ZDLFVBQVUsRUFBRSxxQkFBcUI7Q0FDbEMsQ0FBQztBQUdGLE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0IsWUFBb0IsUUFBa0IsRUFBVSxPQUFnQjtRQUE1QyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUFHLENBQUM7SUFFcEUsSUFBSSxDQUFVLFNBQVMsRUFBRSxNQUFNLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFO1FBQy9DLGlDQUFpQztRQUNqQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxHQUFHLGNBQWMsRUFBRSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFFNUUsOENBQThDO1FBQzlDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbkQsNkJBQTZCO1FBQzdCLE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFtQixTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRW5GLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRHLG1FQUFtRTtRQUNuRSxRQUFRLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7UUFFOUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU3RCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRU8sYUFBYSxDQUFDLE1BQW1CO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVPLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxVQUFzQixFQUFFLE1BQW1CLEVBQUUsUUFBc0I7UUFDekcsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdkQsTUFBTSxlQUFlLEdBQUcsSUFBSSxlQUFlLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RSxNQUFNLFlBQVksR0FBc0IsVUFBVSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUUzRSxPQUFPLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDL0IsQ0FBQztJQUVPLGNBQWMsQ0FBQyxNQUFtQixFQUFFLFFBQXNCO1FBQ2hFLE1BQU0sZUFBZSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFFdEMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFNUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxNQUFtQjtRQUMxQyxxR0FBcUc7UUFDckcsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUV6SCxPQUFPO1lBQ0wsY0FBYztZQUNkLFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVztZQUMvQixhQUFhLEVBQUUsTUFBTSxDQUFDLGFBQWE7WUFDbkMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVO1NBQzlCLENBQUM7SUFDSixDQUFDOytHQXREVSxnQkFBZ0I7bUhBQWhCLGdCQUFnQixjQURILE1BQU07OzRGQUNuQixnQkFBZ0I7a0JBRDVCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENvbXBvbmVudFBvcnRhbCwgUG9ydGFsSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7IENvbXBvbmVudFJlZiwgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vdm9Bc2lkZVJlZiB9IGZyb20gJy4vYXNpZGUtcmVmJztcbmltcG9ydCB7IEFzaWRlQ29tcG9uZW50IH0gZnJvbSAnLi9hc2lkZS5jb21wb25lbnQnO1xuXG5pbnRlcmZhY2UgQXNpZGVDb25maWcgZXh0ZW5kcyBPdmVybGF5Q29uZmlnIHtcbiAgcGFuZWxDbGFzcz86IHN0cmluZztcbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuO1xuICBiYWNrZHJvcENsYXNzPzogc3RyaW5nO1xufVxuXG5jb25zdCBERUZBVUxUX0NPTkZJRzogQXNpZGVDb25maWcgPSB7XG4gIGhhc0JhY2tkcm9wOiB0cnVlLFxuICBiYWNrZHJvcENsYXNzOiAnYXNpZGUtb3ZlcmxheS1iYWNrZHJvcCcsXG4gIHBhbmVsQ2xhc3M6ICdhc2lkZS1vdmVybGF5LXBhbmVsJyxcbn07XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgTm92b0FzaWRlU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIG92ZXJsYXk6IE92ZXJsYXkpIHt9XG5cbiAgb3BlbjxSID0gYW55Pihjb21wb25lbnQsIHBhcmFtcyA9IHt9LCBjb25maWcgPSB7fSkge1xuICAgIC8vIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICAgIGNvbnN0IGFzaWRlQ29uZmlnID0gdGhpcy5nZXRPdmVybGF5Q29uZmlnKHsgLi4uREVGQVVMVF9DT05GSUcsIC4uLmNvbmZpZyB9KTtcblxuICAgIC8vIFJldHVybnMgYW4gT3ZlcmxheVJlZiB3aGljaCBpcyBhIFBvcnRhbEhvc3RcbiAgICBjb25zdCBvdmVybGF5UmVmID0gdGhpcy5jcmVhdGVPdmVybGF5KGFzaWRlQ29uZmlnKTtcblxuICAgIC8vIEluc3RhbnRpYXRlIHJlbW90ZSBjb250cm9sXG4gICAgY29uc3QgYXNpZGVSZWYgPSBuZXcgTm92b0FzaWRlUmVmPHR5cGVvZiBwYXJhbXMsIFI+KGNvbXBvbmVudCwgcGFyYW1zLCBvdmVybGF5UmVmKTtcblxuICAgIGNvbnN0IG92ZXJsYXlDb21wb25lbnQgPSB0aGlzLmF0dGFjaEFzaWRlQ29udGFpbmVyKEFzaWRlQ29tcG9uZW50LCBvdmVybGF5UmVmLCBhc2lkZUNvbmZpZywgYXNpZGVSZWYpO1xuXG4gICAgLy8gUGFzcyB0aGUgaW5zdGFuY2Ugb2YgdGhlIG92ZXJsYXkgY29tcG9uZW50IHRvIHRoZSByZW1vdGUgY29udHJvbFxuICAgIGFzaWRlUmVmLmNvbXBvbmVudEluc3RhbmNlID0gb3ZlcmxheUNvbXBvbmVudDtcblxuICAgIG92ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpLnN1YnNjcmliZSgoKSA9PiBhc2lkZVJlZi5jbG9zZSgpKTtcblxuICAgIHJldHVybiBhc2lkZVJlZjtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlT3ZlcmxheShjb25maWc6IEFzaWRlQ29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMub3ZlcmxheS5jcmVhdGUoY29uZmlnKTtcbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoQXNpZGVDb250YWluZXIoY29tcG9uZW50LCBvdmVybGF5UmVmOiBPdmVybGF5UmVmLCBjb25maWc6IEFzaWRlQ29uZmlnLCBhc2lkZVJlZjogTm92b0FzaWRlUmVmKSB7XG4gICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLmNyZWF0ZUluamVjdG9yKGNvbmZpZywgYXNpZGVSZWYpO1xuXG4gICAgY29uc3QgY29udGFpbmVyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChjb21wb25lbnQsIG51bGwsIGluamVjdG9yKTtcbiAgICBjb25zdCBjb250YWluZXJSZWY6IENvbXBvbmVudFJlZjxhbnk+ID0gb3ZlcmxheVJlZi5hdHRhY2goY29udGFpbmVyUG9ydGFsKTtcblxuICAgIHJldHVybiBjb250YWluZXJSZWYuaW5zdGFuY2U7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUluamVjdG9yKGNvbmZpZzogQXNpZGVDb25maWcsIGFzaWRlUmVmOiBOb3ZvQXNpZGVSZWYpOiBQb3J0YWxJbmplY3RvciB7XG4gICAgY29uc3QgaW5qZWN0aW9uVG9rZW5zID0gbmV3IFdlYWtNYXAoKTtcblxuICAgIGluamVjdGlvblRva2Vucy5zZXQoTm92b0FzaWRlUmVmLCBhc2lkZVJlZik7XG5cbiAgICByZXR1cm4gbmV3IFBvcnRhbEluamVjdG9yKHRoaXMuaW5qZWN0b3IsIGluamVjdGlvblRva2Vucyk7XG4gIH1cblxuICBwcml2YXRlIGdldE92ZXJsYXlDb25maWcoY29uZmlnOiBBc2lkZUNvbmZpZyk6IEFzaWRlQ29uZmlnIHtcbiAgICAvLyBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCkuY2VudGVySG9yaXpvbnRhbGx5KCkuY2VudGVyVmVydGljYWxseSgpO1xuICAgIGNvbnN0IHNjcm9sbFN0cmF0ZWd5ID0gY29uZmlnLmhhc0JhY2tkcm9wID8gdGhpcy5vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKSA6IHRoaXMub3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLm5vb3AoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBzY3JvbGxTdHJhdGVneSxcbiAgICAgIGhhc0JhY2tkcm9wOiBjb25maWcuaGFzQmFja2Ryb3AsXG4gICAgICBiYWNrZHJvcENsYXNzOiBjb25maWcuYmFja2Ryb3BDbGFzcyxcbiAgICAgIHBhbmVsQ2xhc3M6IGNvbmZpZy5wYW5lbENsYXNzLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==