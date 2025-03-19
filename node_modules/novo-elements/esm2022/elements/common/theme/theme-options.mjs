import { EventEmitter, Injectable } from '@angular/core';
import { of } from 'rxjs';
import * as i0 from "@angular/core";
export class NovoThemeOptions {
}
export class NovoTheme {
    constructor() {
        this._defaultTheme = { themeName: 'modern-light' };
        this.onThemeChange = new EventEmitter();
    }
    /** Name of the theme being used. defaults to `modern-light` */
    get themeName() {
        return this._currentTheme?.themeName || this._defaultTheme.themeName;
    }
    set themeName(value) {
        this._currentTheme = { themeName: value };
        this.changeTheme(this._currentTheme);
    }
    use(options) {
        // future: don't change the theme if the theme given is already selected
        this.changeTheme(options);
        // this might become async in future
        return of(options);
    }
    /**
     * Changes the current theme
     */
    changeTheme(theme) {
        this._currentTheme = theme;
        this.onThemeChange.emit({ themeName: theme.themeName, options: theme });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoTheme, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoTheme, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoTheme, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtb3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2NvbW1vbi90aGVtZS90aGVtZS1vcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRXRDLE1BQU0sT0FBTyxnQkFBZ0I7Q0FFNUI7QUFTRCxNQUFNLE9BQU8sU0FBUztJQUh0QjtRQUlVLGtCQUFhLEdBQXFCLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxDQUFDO1FBR3hFLGtCQUFhLEdBQW1DLElBQUksWUFBWSxFQUFvQixDQUFDO0tBeUJ0RjtJQXZCQywrREFBK0Q7SUFDL0QsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUN2RSxDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsS0FBYTtRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxHQUFHLENBQUMsT0FBeUI7UUFDbEMsd0VBQXdFO1FBQ3hFLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUIsb0NBQW9DO1FBQ3BDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7T0FFRztJQUNLLFdBQVcsQ0FBQyxLQUF1QjtRQUN6QyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLENBQUM7K0dBNUJVLFNBQVM7bUhBQVQsU0FBUyxjQUZSLE1BQU07OzRGQUVQLFNBQVM7a0JBSHJCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgY2xhc3MgTm92b1RoZW1lT3B0aW9ucyB7XG4gIHRoZW1lTmFtZTogc3RyaW5nO1xufVxuZXhwb3J0IGludGVyZmFjZSBUaGVtZUNoYW5nZUV2ZW50IHtcbiAgdGhlbWVOYW1lOiBzdHJpbmc7XG4gIG9wdGlvbnM/OiBOb3ZvVGhlbWVPcHRpb25zO1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgTm92b1RoZW1lIHtcbiAgcHJpdmF0ZSBfZGVmYXVsdFRoZW1lOiBOb3ZvVGhlbWVPcHRpb25zID0geyB0aGVtZU5hbWU6ICdtb2Rlcm4tbGlnaHQnIH07XG4gIHByaXZhdGUgX2N1cnJlbnRUaGVtZTogTm92b1RoZW1lT3B0aW9ucztcblxuICBvblRoZW1lQ2hhbmdlOiBFdmVudEVtaXR0ZXI8VGhlbWVDaGFuZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPFRoZW1lQ2hhbmdlRXZlbnQ+KCk7XG5cbiAgLyoqIE5hbWUgb2YgdGhlIHRoZW1lIGJlaW5nIHVzZWQuIGRlZmF1bHRzIHRvIGBtb2Rlcm4tbGlnaHRgICovXG4gIGdldCB0aGVtZU5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRUaGVtZT8udGhlbWVOYW1lIHx8IHRoaXMuX2RlZmF1bHRUaGVtZS50aGVtZU5hbWU7XG4gIH1cbiAgc2V0IHRoZW1lTmFtZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fY3VycmVudFRoZW1lID0geyB0aGVtZU5hbWU6IHZhbHVlIH07XG4gICAgdGhpcy5jaGFuZ2VUaGVtZSh0aGlzLl9jdXJyZW50VGhlbWUpO1xuICB9XG5cbiAgcHVibGljIHVzZShvcHRpb25zOiBOb3ZvVGhlbWVPcHRpb25zKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAvLyBmdXR1cmU6IGRvbid0IGNoYW5nZSB0aGUgdGhlbWUgaWYgdGhlIHRoZW1lIGdpdmVuIGlzIGFscmVhZHkgc2VsZWN0ZWRcbiAgICB0aGlzLmNoYW5nZVRoZW1lKG9wdGlvbnMpO1xuICAgIC8vIHRoaXMgbWlnaHQgYmVjb21lIGFzeW5jIGluIGZ1dHVyZVxuICAgIHJldHVybiBvZihvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBjdXJyZW50IHRoZW1lXG4gICAqL1xuICBwcml2YXRlIGNoYW5nZVRoZW1lKHRoZW1lOiBOb3ZvVGhlbWVPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fY3VycmVudFRoZW1lID0gdGhlbWU7XG4gICAgdGhpcy5vblRoZW1lQ2hhbmdlLmVtaXQoeyB0aGVtZU5hbWU6IHRoZW1lLnRoZW1lTmFtZSwgb3B0aW9uczogdGhlbWUgfSk7XG4gIH1cbn1cblxuLyogRlVUVVJFIFRIT1VHSFRTICovXG4vKipcbiBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcbiAgICAuZ2V0UHJvcGVydHlWYWx1ZSgnLS1teS12YXJpYWJsZS1uYW1lJyk7IC8vICM5OTk5OTlcbiBcbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGVcbiAgICAuc2V0UHJvcGVydHkoJy0tbXktdmFyaWFibGUtbmFtZScsICdwaW5rJyk7XG4qL1xuIl19