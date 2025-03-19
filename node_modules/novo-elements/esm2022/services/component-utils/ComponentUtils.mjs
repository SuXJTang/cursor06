// NG2
import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import * as i0 from "@angular/core";
export class ComponentUtils {
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
    }
    append(ComponentClass, location, providers, onTop) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ComponentClass);
        const parent = location.injector;
        const index = onTop ? 0 : location.length;
        return location.createComponent(componentFactory, index, Injector.create({ providers, parent }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ComponentUtils, deps: [{ token: i0.ComponentFactoryResolver }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ComponentUtils }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ComponentUtils, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.ComponentFactoryResolver }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50VXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9zZXJ2aWNlcy9jb21wb25lbnQtdXRpbHMvQ29tcG9uZW50VXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTTtBQUNOLE9BQU8sRUFBRSx3QkFBd0IsRUFBZ0IsVUFBVSxFQUFFLFFBQVEsRUFBMEMsTUFBTSxlQUFlLENBQUM7O0FBR3JJLE1BQU0sT0FBTyxjQUFjO0lBQ3pCLFlBQW1CLHdCQUFrRDtRQUFsRCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO0lBQUcsQ0FBQztJQUV6RSxNQUFNLENBQUksY0FBdUIsRUFBRSxRQUEwQixFQUFFLFNBQTRCLEVBQUUsS0FBZTtRQUMxRyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvRixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQzFDLE9BQU8sUUFBUSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkcsQ0FBQzsrR0FSVSxjQUFjO21IQUFkLGNBQWM7OzRGQUFkLGNBQWM7a0JBRDFCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBORzJcbmltcG9ydCB7IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgQ29tcG9uZW50UmVmLCBJbmplY3RhYmxlLCBJbmplY3RvciwgU3RhdGljUHJvdmlkZXIsIFR5cGUsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbXBvbmVudFV0aWxzPFQgPSBhbnk+IHtcbiAgY29uc3RydWN0b3IocHVibGljIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSB7fVxuXG4gIGFwcGVuZDxUPihDb21wb25lbnRDbGFzczogVHlwZTxUPiwgbG9jYXRpb246IFZpZXdDb250YWluZXJSZWYsIHByb3ZpZGVycz86IFN0YXRpY1Byb3ZpZGVyW10sIG9uVG9wPzogYm9vbGVhbik6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KENvbXBvbmVudENsYXNzKTtcbiAgICBjb25zdCBwYXJlbnQgPSBsb2NhdGlvbi5pbmplY3RvcjtcbiAgICBjb25zdCBpbmRleCA9IG9uVG9wID8gMCA6IGxvY2F0aW9uLmxlbmd0aDtcbiAgICByZXR1cm4gbG9jYXRpb24uY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnksIGluZGV4LCBJbmplY3Rvci5jcmVhdGUoeyBwcm92aWRlcnMsIHBhcmVudCB9KSk7XG4gIH1cbn1cbiJdfQ==