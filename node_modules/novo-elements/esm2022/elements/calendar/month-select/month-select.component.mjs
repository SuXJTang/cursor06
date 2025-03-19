// NG2
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NovoLabelService } from 'novo-elements/services';
import { DateUtil } from 'novo-elements/utils';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "@angular/common";
export class NovoMonthSelectElement {
    constructor(labels) {
        this.labels = labels;
        this.activeDate = new Date();
        this.selected = [];
        // Select callback for output
        this.select = new EventEmitter(false);
        // List of all months
        this.monthNames = this.labels.getMonths();
    }
    ngOnInit() { }
    onSelect(event, month) {
        // Helpers.swallowEvent(event);
        this.select.next({ event, month });
    }
    _isActive(month) {
        return this.activeDate && month === DateUtil.getMonth(this.activeDate);
    }
    _isSelected(month) {
        return this.selected && month === DateUtil.getMonth(this.selected[0]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoMonthSelectElement, deps: [{ token: i1.NovoLabelService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoMonthSelectElement, selector: "novo-month-select", inputs: { activeDate: "activeDate", selected: "selected" }, outputs: { select: "select" }, ngImport: i0, template: "<div *ngFor=\"let month of monthNames; let i = index\" (click)=\"onSelect($event, i)\" tabindex=\"0\">\n  <div class=\"month\" [class.selected]=\"_isSelected(i)\" [attr.data-automation-id]=\"month\">\n    {{ month }}</div>\n</div>", styles: [":host{display:grid;grid-template-columns:1fr 1fr 1fr;flex:1}:host .month{padding:1rem;cursor:pointer;border-radius:.4rem}:host .month.selected{background-color:#4a89dc;color:#fff}:host .month:hover{background-color:#4a89dc;color:#fff}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoMonthSelectElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-month-select', changeDetection: ChangeDetectionStrategy.OnPush, template: "<div *ngFor=\"let month of monthNames; let i = index\" (click)=\"onSelect($event, i)\" tabindex=\"0\">\n  <div class=\"month\" [class.selected]=\"_isSelected(i)\" [attr.data-automation-id]=\"month\">\n    {{ month }}</div>\n</div>", styles: [":host{display:grid;grid-template-columns:1fr 1fr 1fr;flex:1}:host .month{padding:1rem;cursor:pointer;border-radius:.4rem}:host .month.selected{background-color:#4a89dc;color:#fff}:host .month:hover{background-color:#4a89dc;color:#fff}\n"] }]
        }], ctorParameters: () => [{ type: i1.NovoLabelService }], propDecorators: { activeDate: [{
                type: Input
            }], selected: [{
                type: Input
            }], select: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGgtc2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2NhbGVuZGFyL21vbnRoLXNlbGVjdC9tb250aC1zZWxlY3QuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvY2FsZW5kYXIvbW9udGgtc2VsZWN0L21vbnRoLXNlbGVjdC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUUxRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0scUJBQXFCLENBQUM7Ozs7QUFRL0MsTUFBTSxPQUFPLHNCQUFzQjtJQWFqQyxZQUFtQixNQUF3QjtRQUF4QixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQVgzQyxlQUFVLEdBQWEsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUVsQyxhQUFRLEdBQWUsRUFBRSxDQUFDO1FBRTFCLDZCQUE2QjtRQUU3QixXQUFNLEdBQXNCLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBELHFCQUFxQjtRQUNyQixlQUFVLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUVELENBQUM7SUFFL0MsUUFBUSxLQUFJLENBQUM7SUFFYixRQUFRLENBQUMsS0FBWSxFQUFFLEtBQWE7UUFDbEMsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFhO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxLQUFLLEtBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFhO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLEtBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQzsrR0E1QlUsc0JBQXNCO21HQUF0QixzQkFBc0Isb0pDWm5DLHdPQUdNOzs0RkRTTyxzQkFBc0I7a0JBTmxDLFNBQVM7K0JBQ0UsbUJBQW1CLG1CQUdaLHVCQUF1QixDQUFDLE1BQU07cUZBSS9DLFVBQVU7c0JBRFQsS0FBSztnQkFHTixRQUFRO3NCQURQLEtBQUs7Z0JBS04sTUFBTTtzQkFETCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTm92b0xhYmVsU2VydmljZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvc2VydmljZXMnO1xuaW1wb3J0IHR5cGUgeyBEYXRlTGlrZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvdXRpbHMnO1xuaW1wb3J0IHsgRGF0ZVV0aWwgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3V0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1tb250aC1zZWxlY3QnLFxuICB0ZW1wbGF0ZVVybDogJy4vbW9udGgtc2VsZWN0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbW9udGgtc2VsZWN0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvTW9udGhTZWxlY3RFbGVtZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KClcbiAgYWN0aXZlRGF0ZTogRGF0ZUxpa2UgPSBuZXcgRGF0ZSgpO1xuICBASW5wdXQoKVxuICBzZWxlY3RlZDogRGF0ZUxpa2VbXSA9IFtdO1xuXG4gIC8vIFNlbGVjdCBjYWxsYmFjayBmb3Igb3V0cHV0XG4gIEBPdXRwdXQoKVxuICBzZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcihmYWxzZSk7XG5cbiAgLy8gTGlzdCBvZiBhbGwgbW9udGhzXG4gIG1vbnRoTmFtZXM6IHN0cmluZ1tdID0gdGhpcy5sYWJlbHMuZ2V0TW9udGhzKCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxhYmVsczogTm92b0xhYmVsU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpIHt9XG5cbiAgb25TZWxlY3QoZXZlbnQ6IEV2ZW50LCBtb250aDogbnVtYmVyKSB7XG4gICAgLy8gSGVscGVycy5zd2FsbG93RXZlbnQoZXZlbnQpO1xuICAgIHRoaXMuc2VsZWN0Lm5leHQoeyBldmVudCwgbW9udGggfSk7XG4gIH1cblxuICBfaXNBY3RpdmUobW9udGg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZURhdGUgJiYgbW9udGggPT09IERhdGVVdGlsLmdldE1vbnRoKHRoaXMuYWN0aXZlRGF0ZSk7XG4gIH1cblxuICBfaXNTZWxlY3RlZChtb250aDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQgJiYgbW9udGggPT09IERhdGVVdGlsLmdldE1vbnRoKHRoaXMuc2VsZWN0ZWRbMF0pO1xuICB9XG59XG4iLCI8ZGl2ICpuZ0Zvcj1cImxldCBtb250aCBvZiBtb250aE5hbWVzOyBsZXQgaSA9IGluZGV4XCIgKGNsaWNrKT1cIm9uU2VsZWN0KCRldmVudCwgaSlcIiB0YWJpbmRleD1cIjBcIj5cbiAgPGRpdiBjbGFzcz1cIm1vbnRoXCIgW2NsYXNzLnNlbGVjdGVkXT1cIl9pc1NlbGVjdGVkKGkpXCIgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cIm1vbnRoXCI+XG4gICAge3sgbW9udGggfX08L2Rpdj5cbjwvZGl2PiJdfQ==