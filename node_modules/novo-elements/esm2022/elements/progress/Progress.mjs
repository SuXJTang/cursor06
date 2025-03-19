// NG2
import { Component, ContentChildren, forwardRef, HostBinding, Input, QueryList } from '@angular/core';
import { NovoProgressBarElement } from './ProgressBar';
import { NOVO_PROGRESS_CONTAINER, ProgressAppearance } from './ProgressConstants';
import * as i0 from "@angular/core";
export class NovoProgressElement {
    constructor() {
        this.total = 100;
        this.radius = 54;
        this.fitContainer = false;
        this.striped = false;
        // Private vars for getters
        this._appearance = ProgressAppearance.LINEAR;
        this._disabled = false;
    }
    get appearance() {
        return this._appearance;
    }
    set appearance(value) {
        if (this._appearance !== value) {
            this._appearance = value;
            this._updateBarAppearance();
        }
    }
    // Disabled State
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = !!value;
    }
    ngAfterContentInit() {
        this._updateBarRadius();
    }
    _updateBarAppearance() {
        if (this._bars) {
            this._bars.forEach((bar) => {
                bar.appearance = this.appearance;
            });
        }
    }
    _updateBarRadius() {
        if (this._bars) {
            this._bars.forEach((bar, i) => {
                bar.radius = this.radius - i * 5;
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoProgressElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoProgressElement, selector: "novo-progress", inputs: { color: "color", theme: "theme", total: "total", radius: "radius", striped: "striped", appearance: "appearance", disabled: "disabled" }, host: { properties: { "class.fit-container": "this.fitContainer", "class.striped": "this.striped", "class": "this.appearance", "class.disabled": "this.disabled" } }, providers: [
            {
                provide: NOVO_PROGRESS_CONTAINER,
                useExisting: NovoProgressElement,
            },
        ], queries: [{ propertyName: "_bars", predicate: i0.forwardRef(() => NovoProgressBarElement), descendants: true }], ngImport: i0, template: ` <ng-content></ng-content> `, isInline: true, styles: [":host{display:flex;position:relative;border-radius:.2em}:host.striped{background-image:linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.25) 50%,rgba(0,0,0,.25) 75%,transparent 75%,transparent);background-size:20px 20px}:host.linear{width:200px;height:1.2em;background-color:#f7f7f7;border:1px solid #cccdcc;overflow:hidden}:host.radial{width:9.2em;height:9.2em}:host.fit-container{width:100%}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoProgressElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-progress', template: ` <ng-content></ng-content> `, providers: [
                        {
                            provide: NOVO_PROGRESS_CONTAINER,
                            useExisting: NovoProgressElement,
                        },
                    ], styles: [":host{display:flex;position:relative;border-radius:.2em}:host.striped{background-image:linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.25) 50%,rgba(0,0,0,.25) 75%,transparent 75%,transparent);background-size:20px 20px}:host.linear{width:200px;height:1.2em;background-color:#f7f7f7;border:1px solid #cccdcc;overflow:hidden}:host.radial{width:9.2em;height:9.2em}:host.fit-container{width:100%}\n"] }]
        }], propDecorators: { color: [{
                type: Input
            }], theme: [{
                type: Input
            }], total: [{
                type: Input
            }], radius: [{
                type: Input
            }], fitContainer: [{
                type: HostBinding,
                args: ['class.fit-container']
            }], striped: [{
                type: HostBinding,
                args: ['class.striped']
            }, {
                type: Input
            }], appearance: [{
                type: HostBinding,
                args: ['class']
            }, {
                type: Input
            }], disabled: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.disabled']
            }], _bars: [{
                type: ContentChildren,
                args: [forwardRef(() => NovoProgressBarElement), { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZ3Jlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9wcm9ncmVzcy9Qcm9ncmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFvQixTQUFTLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4SCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGtCQUFrQixFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBYWxGLE1BQU0sT0FBTyxtQkFBbUI7SUFYaEM7UUFlVyxVQUFLLEdBQVcsR0FBRyxDQUFDO1FBQ3BCLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFHN0IsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFJOUIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUV6QiwyQkFBMkI7UUFDbkIsZ0JBQVcsR0FBdUIsa0JBQWtCLENBQUMsTUFBTSxDQUFDO1FBQzVELGNBQVMsR0FBWSxLQUFLLENBQUM7S0E4Q3BDO0lBNUNDLElBRUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBQ0QsSUFBSSxVQUFVLENBQUMsS0FBeUI7UUFDdEMsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBMkIsQ0FBQztZQUMvQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM5QixDQUFDO0lBQ0gsQ0FBQztJQUVELGlCQUFpQjtJQUNqQixJQUVJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQWM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFLRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVPLG9CQUFvQjtRQUMxQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ3pCLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQWdDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUVPLGdCQUFnQjtRQUN0QixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM1QixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDOytHQTdEVSxtQkFBbUI7bUdBQW5CLG1CQUFtQixnV0FQbkI7WUFDVDtnQkFDRSxPQUFPLEVBQUUsdUJBQXVCO2dCQUNoQyxXQUFXLEVBQUUsbUJBQW1CO2FBQ2pDO1NBQ0Ysb0VBMENpQyxzQkFBc0IsaURBaEQ5Qyw2QkFBNkI7OzRGQVE1QixtQkFBbUI7a0JBWC9CLFNBQVM7K0JBQ0UsZUFBZSxZQUVmLDZCQUE2QixhQUM1Qjt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsdUJBQXVCOzRCQUNoQyxXQUFXLHFCQUFxQjt5QkFDakM7cUJBQ0Y7OEJBSUQsS0FBSztzQkFESixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUdOLFlBQVk7c0JBRFgsV0FBVzt1QkFBQyxxQkFBcUI7Z0JBS2xDLE9BQU87c0JBRk4sV0FBVzt1QkFBQyxlQUFlOztzQkFDM0IsS0FBSztnQkFTRixVQUFVO3NCQUZiLFdBQVc7dUJBQUMsT0FBTzs7c0JBQ25CLEtBQUs7Z0JBY0YsUUFBUTtzQkFGWCxLQUFLOztzQkFDTCxXQUFXO3VCQUFDLGdCQUFnQjtnQkFTN0IsS0FBSztzQkFESixlQUFlO3VCQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE5HMlxuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIGZvcndhcmRSZWYsIEhvc3RCaW5kaW5nLCBJbnB1dCwgUXVlcnlMaXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOb3ZvUHJvZ3Jlc3NCYXJFbGVtZW50IH0gZnJvbSAnLi9Qcm9ncmVzc0Jhcic7XG5pbXBvcnQgeyBOT1ZPX1BST0dSRVNTX0NPTlRBSU5FUiwgUHJvZ3Jlc3NBcHBlYXJhbmNlIH0gZnJvbSAnLi9Qcm9ncmVzc0NvbnN0YW50cyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25vdm8tcHJvZ3Jlc3MnLFxuICBzdHlsZVVybHM6IFsnLi9Qcm9ncmVzcy5zY3NzJ10sXG4gIHRlbXBsYXRlOiBgIDxuZy1jb250ZW50PjwvbmctY29udGVudD4gYCxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTk9WT19QUk9HUkVTU19DT05UQUlORVIsXG4gICAgICB1c2VFeGlzdGluZzogTm92b1Byb2dyZXNzRWxlbWVudCxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvUHJvZ3Jlc3NFbGVtZW50IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIEBJbnB1dCgpXG4gIGNvbG9yOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHRoZW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHRvdGFsOiBudW1iZXIgPSAxMDA7XG4gIEBJbnB1dCgpIHJhZGl1czogbnVtYmVyID0gNTQ7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5maXQtY29udGFpbmVyJylcbiAgZml0Q29udGFpbmVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5zdHJpcGVkJylcbiAgQElucHV0KClcbiAgc3RyaXBlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIFByaXZhdGUgdmFycyBmb3IgZ2V0dGVyc1xuICBwcml2YXRlIF9hcHBlYXJhbmNlOiBQcm9ncmVzc0FwcGVhcmFuY2UgPSBQcm9ncmVzc0FwcGVhcmFuY2UuTElORUFSO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBASW5wdXQoKVxuICBnZXQgYXBwZWFyYW5jZSgpOiBQcm9ncmVzc0FwcGVhcmFuY2Uge1xuICAgIHJldHVybiB0aGlzLl9hcHBlYXJhbmNlO1xuICB9XG4gIHNldCBhcHBlYXJhbmNlKHZhbHVlOiBQcm9ncmVzc0FwcGVhcmFuY2UpIHtcbiAgICBpZiAodGhpcy5fYXBwZWFyYW5jZSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZSBhcyBQcm9ncmVzc0FwcGVhcmFuY2U7XG4gICAgICB0aGlzLl91cGRhdGVCYXJBcHBlYXJhbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRGlzYWJsZWQgU3RhdGVcbiAgQElucHV0KClcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5kaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSAhIXZhbHVlO1xuICB9XG5cbiAgQENvbnRlbnRDaGlsZHJlbihmb3J3YXJkUmVmKCgpID0+IE5vdm9Qcm9ncmVzc0JhckVsZW1lbnQpLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pXG4gIF9iYXJzOiBRdWVyeUxpc3Q8Tm92b1Byb2dyZXNzQmFyRWxlbWVudD47XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3VwZGF0ZUJhclJhZGl1cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQmFyQXBwZWFyYW5jZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYmFycykge1xuICAgICAgdGhpcy5fYmFycy5mb3JFYWNoKChiYXIpID0+IHtcbiAgICAgICAgYmFyLmFwcGVhcmFuY2UgPSB0aGlzLmFwcGVhcmFuY2UgYXMgUHJvZ3Jlc3NBcHBlYXJhbmNlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQmFyUmFkaXVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9iYXJzKSB7XG4gICAgICB0aGlzLl9iYXJzLmZvckVhY2goKGJhciwgaSkgPT4ge1xuICAgICAgICBiYXIucmFkaXVzID0gdGhpcy5yYWRpdXMgLSBpICogNTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19