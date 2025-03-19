import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NovoLabelService } from 'novo-elements/services';
import { Helpers } from 'novo-elements/utils';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "@angular/common";
import * as i3 from "novo-elements/elements/button";
import * as i4 from "novo-elements/elements/common";
export class NovoDataTableCellFilterHeader {
    set filter(filter) {
        this._filter = filter;
        this.hasFilter = !Helpers.isEmpty(filter);
    }
    get filter() {
        return this._filter;
    }
    constructor(changeDetectorRef, labels) {
        this.changeDetectorRef = changeDetectorRef;
        this.labels = labels;
        this.hasFilter = false;
        this.clearFilter = new EventEmitter();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoDataTableCellFilterHeader, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.NovoLabelService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoDataTableCellFilterHeader, selector: "novo-data-table-cell-filter-header", inputs: { label: "label", filter: "filter" }, outputs: { clearFilter: "clearFilter" }, ngImport: i0, template: `
    <div class="header">
      <novo-label>{{ label || labels.filters }}</novo-label>
      <novo-button
        theme="dialogue"
        color="negative"
        size="small"
        icon="times"
        (click)="clearFilter.emit()"
        *ngIf="hasFilter"
        data-automation-id="novo-data-table-filter-clear">
        {{ labels.clear }}
      </novo-button>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.NovoButtonElement, selector: "novo-button,button[theme]", inputs: ["color", "side", "size", "theme", "loading", "icon", "secondIcon", "disabled"] }, { kind: "component", type: i4.NovoLabel, selector: "novo-label,[novo-label]" }, { kind: "directive", type: i4.ThemeColorDirective, selector: "[theme]", inputs: ["theme"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoDataTableCellFilterHeader, decorators: [{
            type: Component,
            args: [{
                    selector: 'novo-data-table-cell-filter-header',
                    template: `
    <div class="header">
      <novo-label>{{ label || labels.filters }}</novo-label>
      <novo-button
        theme="dialogue"
        color="negative"
        size="small"
        icon="times"
        (click)="clearFilter.emit()"
        *ngIf="hasFilter"
        data-automation-id="novo-data-table-filter-clear">
        {{ labels.clear }}
      </novo-button>
    </div>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i1.NovoLabelService }], propDecorators: { label: [{
                type: Input
            }], filter: [{
                type: Input
            }], clearFilter: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS10YWJsZS1oZWFkZXItY2VsbC1maWx0ZXItaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2RhdGEtdGFibGUvY2VsbC1oZWFkZXJzL2RhdGEtdGFibGUtaGVhZGVyLWNlbGwtZmlsdGVyLWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuSCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7Ozs7OztBQXFCOUMsTUFBTSxPQUFPLDZCQUE2QjtJQUd4QyxJQUNJLE1BQU0sQ0FBQyxNQUFXO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQU9ELFlBQW1CLGlCQUFvQyxFQUFTLE1BQXdCO1FBQXJFLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUpqRixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWYsZ0JBQVcsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztJQUVzQixDQUFDOytHQWpCakYsNkJBQTZCO21HQUE3Qiw2QkFBNkIsaUtBakI5Qjs7Ozs7Ozs7Ozs7Ozs7R0FjVDs7NEZBR1UsNkJBQTZCO2tCQW5CekMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0NBQW9DO29CQUM5QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7O0dBY1Q7b0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEO3FIQUVVLEtBQUs7c0JBQWIsS0FBSztnQkFHRixNQUFNO3NCQURULEtBQUs7Z0JBWUksV0FBVztzQkFBcEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vdm9MYWJlbFNlcnZpY2UgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3NlcnZpY2VzJztcbmltcG9ydCB7IEhlbHBlcnMgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3V0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1kYXRhLXRhYmxlLWNlbGwtZmlsdGVyLWhlYWRlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImhlYWRlclwiPlxuICAgICAgPG5vdm8tbGFiZWw+e3sgbGFiZWwgfHwgbGFiZWxzLmZpbHRlcnMgfX08L25vdm8tbGFiZWw+XG4gICAgICA8bm92by1idXR0b25cbiAgICAgICAgdGhlbWU9XCJkaWFsb2d1ZVwiXG4gICAgICAgIGNvbG9yPVwibmVnYXRpdmVcIlxuICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICBpY29uPVwidGltZXNcIlxuICAgICAgICAoY2xpY2spPVwiY2xlYXJGaWx0ZXIuZW1pdCgpXCJcbiAgICAgICAgKm5nSWY9XCJoYXNGaWx0ZXJcIlxuICAgICAgICBkYXRhLWF1dG9tYXRpb24taWQ9XCJub3ZvLWRhdGEtdGFibGUtZmlsdGVyLWNsZWFyXCI+XG4gICAgICAgIHt7IGxhYmVscy5jbGVhciB9fVxuICAgICAgPC9ub3ZvLWJ1dHRvbj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE5vdm9EYXRhVGFibGVDZWxsRmlsdGVySGVhZGVyIHtcbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZyB8IG51bWJlcjtcblxuICBASW5wdXQoKVxuICBzZXQgZmlsdGVyKGZpbHRlcjogYW55KSB7XG4gICAgdGhpcy5fZmlsdGVyID0gZmlsdGVyO1xuICAgIHRoaXMuaGFzRmlsdGVyID0gIUhlbHBlcnMuaXNFbXB0eShmaWx0ZXIpO1xuICB9XG4gIGdldCBmaWx0ZXIoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZmlsdGVyO1xuICB9XG4gIHByaXZhdGUgX2ZpbHRlcjogYW55O1xuXG4gIHB1YmxpYyBoYXNGaWx0ZXIgPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgY2xlYXJGaWx0ZXI6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLCBwdWJsaWMgbGFiZWxzOiBOb3ZvTGFiZWxTZXJ2aWNlKSB7fVxufVxuIl19