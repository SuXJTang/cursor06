// NG2
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { NovoModalContainerComponent } from './modal-container.component';
// APP
import { NovoModalParams, NovoModalRef } from './modal-ref';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
const DEFAULT_CONFIG = {
    hasBackdrop: true,
    backdropClass: 'modal-overlay-backdrop',
    panelClass: 'modal-overlay-panel',
};
export class NovoModalService {
    set parentViewContainer(view) {
        console.warn('parentViewContainer is deprecated');
        this._parentViewContainer = view;
    }
    constructor(injector, overlay) {
        this.injector = injector;
        this.overlay = overlay;
    }
    open(component, params = {}) {
        // Override default configuration
        const modalConfig = DEFAULT_CONFIG;
        // Returns an OverlayRef which is a PortalHost
        const overlayRef = this.createOverlay(modalConfig);
        // Instantiate remote control
        const modalRef = new NovoModalRef(component, params, overlayRef);
        const overlayComponent = this.attachModalContainer(NovoModalContainerComponent, overlayRef, modalConfig, modalRef);
        // Pass the instance of the overlay component to the remote control
        modalRef.componentInstance = overlayComponent;
        overlayRef.backdropClick().subscribe(() => modalRef.close());
        return modalRef;
    }
    createOverlay(config) {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    }
    attachModalContainer(component, overlayRef, config, modalRef) {
        const injector = this.createInjector(config, modalRef);
        const containerPortal = new ComponentPortal(component, null, injector);
        const containerRef = overlayRef.attach(containerPortal);
        return containerRef.instance;
    }
    createInjector(config, modalRef) {
        const injectionTokens = new WeakMap();
        injectionTokens.set(NovoModalRef, modalRef);
        // Support backwards compatability
        injectionTokens.set(NovoModalParams, modalRef.params);
        return new PortalInjector(this.injector, injectionTokens);
    }
    getOverlayConfig(config) {
        const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
        const overlayConfig = new OverlayConfig({
            positionStrategy,
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
        });
        return overlayConfig;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoModalService, deps: [{ token: i0.Injector }, { token: i1.Overlay }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoModalService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoModalService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i1.Overlay }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL21vZGFsL21vZGFsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTTtBQUNOLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFjLE1BQU0sc0JBQXNCLENBQUM7QUFDMUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RSxPQUFPLEVBQWdCLFVBQVUsRUFBRSxRQUFRLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBQ3JGLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzFFLE1BQU07QUFDTixPQUFPLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQzs7O0FBUTVELE1BQU0sY0FBYyxHQUFnQjtJQUNsQyxXQUFXLEVBQUUsSUFBSTtJQUNqQixhQUFhLEVBQUUsd0JBQXdCO0lBQ3ZDLFVBQVUsRUFBRSxxQkFBcUI7Q0FDbEMsQ0FBQztBQUdGLE1BQU0sT0FBTyxnQkFBZ0I7SUFHM0IsSUFBSSxtQkFBbUIsQ0FBQyxJQUFzQjtRQUM1QyxPQUFPLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRUQsWUFBb0IsUUFBa0IsRUFBVSxPQUFnQjtRQUE1QyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBUztJQUFHLENBQUM7SUFFcEUsSUFBSSxDQUFnQyxTQUFTLEVBQUUsU0FBcUIsRUFBRTtRQUNwRSxpQ0FBaUM7UUFDakMsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDO1FBRW5DLDhDQUE4QztRQUM5QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRW5ELDZCQUE2QjtRQUM3QixNQUFNLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBZ0IsU0FBUyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVoRixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQywyQkFBMkIsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRW5ILG1FQUFtRTtRQUNuRSxRQUFRLENBQUMsaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUM7UUFFOUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUU3RCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRU8sYUFBYSxDQUFDLE1BQW1CO1FBQ3ZDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsVUFBc0IsRUFBRSxNQUFtQixFQUFFLFFBQXNCO1FBQ3pHLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sZUFBZSxHQUFHLElBQUksZUFBZSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkUsTUFBTSxZQUFZLEdBQXNCLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFM0UsT0FBTyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQy9CLENBQUM7SUFFTyxjQUFjLENBQUMsTUFBbUIsRUFBRSxRQUFzQjtRQUNoRSxNQUFNLGVBQWUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBRXRDLGVBQWUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLGtDQUFrQztRQUNsQyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEQsT0FBTyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxNQUFtQjtRQUMxQyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRWxHLE1BQU0sYUFBYSxHQUFHLElBQUksYUFBYSxDQUFDO1lBQ3RDLGdCQUFnQjtZQUNoQixXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7WUFDL0IsYUFBYSxFQUFFLE1BQU0sQ0FBQyxhQUFhO1lBQ25DLFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVTtTQUM5QixDQUFDLENBQUM7UUFFSCxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDOytHQWhFVSxnQkFBZ0I7bUhBQWhCLGdCQUFnQixjQURILE1BQU07OzRGQUNuQixnQkFBZ0I7a0JBRDVCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBPdmVybGF5LCBPdmVybGF5Q29uZmlnLCBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsLCBQb3J0YWxJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgQ29tcG9uZW50UmVmLCBJbmplY3RhYmxlLCBJbmplY3RvciwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTm92b01vZGFsQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9tb2RhbC1jb250YWluZXIuY29tcG9uZW50Jztcbi8vIEFQUFxuaW1wb3J0IHsgTm92b01vZGFsUGFyYW1zLCBOb3ZvTW9kYWxSZWYgfSBmcm9tICcuL21vZGFsLXJlZic7XG5cbmludGVyZmFjZSBNb2RhbENvbmZpZyB7XG4gIHBhbmVsQ2xhc3M/OiBzdHJpbmc7XG4gIGhhc0JhY2tkcm9wPzogYm9vbGVhbjtcbiAgYmFja2Ryb3BDbGFzcz86IHN0cmluZztcbn1cblxuY29uc3QgREVGQVVMVF9DT05GSUc6IE1vZGFsQ29uZmlnID0ge1xuICBoYXNCYWNrZHJvcDogdHJ1ZSxcbiAgYmFja2Ryb3BDbGFzczogJ21vZGFsLW92ZXJsYXktYmFja2Ryb3AnLFxuICBwYW5lbENsYXNzOiAnbW9kYWwtb3ZlcmxheS1wYW5lbCcsXG59O1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIE5vdm9Nb2RhbFNlcnZpY2Uge1xuICBfcGFyZW50Vmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZjtcblxuICBzZXQgcGFyZW50Vmlld0NvbnRhaW5lcih2aWV3OiBWaWV3Q29udGFpbmVyUmVmKSB7XG4gICAgY29uc29sZS53YXJuKCdwYXJlbnRWaWV3Q29udGFpbmVyIGlzIGRlcHJlY2F0ZWQnKTtcbiAgICB0aGlzLl9wYXJlbnRWaWV3Q29udGFpbmVyID0gdmlldztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIG92ZXJsYXk6IE92ZXJsYXkpIHt9XG5cbiAgb3BlbjxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55Pj4oY29tcG9uZW50LCBwYXJhbXM6IFBhcnRpYWw8VD4gPSB7fSkge1xuICAgIC8vIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICAgIGNvbnN0IG1vZGFsQ29uZmlnID0gREVGQVVMVF9DT05GSUc7XG5cbiAgICAvLyBSZXR1cm5zIGFuIE92ZXJsYXlSZWYgd2hpY2ggaXMgYSBQb3J0YWxIb3N0XG4gICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuY3JlYXRlT3ZlcmxheShtb2RhbENvbmZpZyk7XG5cbiAgICAvLyBJbnN0YW50aWF0ZSByZW1vdGUgY29udHJvbFxuICAgIGNvbnN0IG1vZGFsUmVmID0gbmV3IE5vdm9Nb2RhbFJlZjx0eXBlb2YgcGFyYW1zPihjb21wb25lbnQsIHBhcmFtcywgb3ZlcmxheVJlZik7XG5cbiAgICBjb25zdCBvdmVybGF5Q29tcG9uZW50ID0gdGhpcy5hdHRhY2hNb2RhbENvbnRhaW5lcihOb3ZvTW9kYWxDb250YWluZXJDb21wb25lbnQsIG92ZXJsYXlSZWYsIG1vZGFsQ29uZmlnLCBtb2RhbFJlZik7XG5cbiAgICAvLyBQYXNzIHRoZSBpbnN0YW5jZSBvZiB0aGUgb3ZlcmxheSBjb21wb25lbnQgdG8gdGhlIHJlbW90ZSBjb250cm9sXG4gICAgbW9kYWxSZWYuY29tcG9uZW50SW5zdGFuY2UgPSBvdmVybGF5Q29tcG9uZW50O1xuXG4gICAgb3ZlcmxheVJlZi5iYWNrZHJvcENsaWNrKCkuc3Vic2NyaWJlKCgpID0+IG1vZGFsUmVmLmNsb3NlKCkpO1xuXG4gICAgcmV0dXJuIG1vZGFsUmVmO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVPdmVybGF5KGNvbmZpZzogTW9kYWxDb25maWcpIHtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gdGhpcy5nZXRPdmVybGF5Q29uZmlnKGNvbmZpZyk7XG4gICAgcmV0dXJuIHRoaXMub3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaE1vZGFsQ29udGFpbmVyKGNvbXBvbmVudCwgb3ZlcmxheVJlZjogT3ZlcmxheVJlZiwgY29uZmlnOiBNb2RhbENvbmZpZywgbW9kYWxSZWY6IE5vdm9Nb2RhbFJlZikge1xuICAgIGNvbnN0IGluamVjdG9yID0gdGhpcy5jcmVhdGVJbmplY3Rvcihjb25maWcsIG1vZGFsUmVmKTtcbiAgICBjb25zdCBjb250YWluZXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKGNvbXBvbmVudCwgbnVsbCwgaW5qZWN0b3IpO1xuICAgIGNvbnN0IGNvbnRhaW5lclJlZjogQ29tcG9uZW50UmVmPGFueT4gPSBvdmVybGF5UmVmLmF0dGFjaChjb250YWluZXJQb3J0YWwpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lclJlZi5pbnN0YW5jZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlSW5qZWN0b3IoY29uZmlnOiBNb2RhbENvbmZpZywgbW9kYWxSZWY6IE5vdm9Nb2RhbFJlZik6IFBvcnRhbEluamVjdG9yIHtcbiAgICBjb25zdCBpbmplY3Rpb25Ub2tlbnMgPSBuZXcgV2Vha01hcCgpO1xuXG4gICAgaW5qZWN0aW9uVG9rZW5zLnNldChOb3ZvTW9kYWxSZWYsIG1vZGFsUmVmKTtcbiAgICAvLyBTdXBwb3J0IGJhY2t3YXJkcyBjb21wYXRhYmlsaXR5XG4gICAgaW5qZWN0aW9uVG9rZW5zLnNldChOb3ZvTW9kYWxQYXJhbXMsIG1vZGFsUmVmLnBhcmFtcyk7XG5cbiAgICByZXR1cm4gbmV3IFBvcnRhbEluamVjdG9yKHRoaXMuaW5qZWN0b3IsIGluamVjdGlvblRva2Vucyk7XG4gIH1cblxuICBwcml2YXRlIGdldE92ZXJsYXlDb25maWcoY29uZmlnOiBNb2RhbENvbmZpZyk6IE92ZXJsYXlDb25maWcge1xuICAgIGNvbnN0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLm92ZXJsYXkucG9zaXRpb24oKS5nbG9iYWwoKS5jZW50ZXJIb3Jpem9udGFsbHkoKS5jZW50ZXJWZXJ0aWNhbGx5KCk7XG5cbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneSxcbiAgICAgIGhhc0JhY2tkcm9wOiBjb25maWcuaGFzQmFja2Ryb3AsXG4gICAgICBiYWNrZHJvcENsYXNzOiBjb25maWcuYmFja2Ryb3BDbGFzcyxcbiAgICAgIHBhbmVsQ2xhc3M6IGNvbmZpZy5wYW5lbENsYXNzLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG92ZXJsYXlDb25maWc7XG4gIH1cbn1cbiJdfQ==