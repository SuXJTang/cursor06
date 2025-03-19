import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output } from '@angular/core';
import { DateUtil } from 'novo-elements/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../pipe/Weekday.pipe";
import * as i3 from "../pipe/DayOfMonth.pipe";
import * as i4 from "../pipe/Month.pipe";
import * as i5 from "../pipe/MonthDay.pipe";
import * as i6 from "../pipe/Year.pipe";
import * as i7 from "../pipe/EndOfWeekDisplayPipe.pipe";
export class NovoAgendaDateChangeElement {
    constructor(locale) {
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
        this.locale = locale;
    }
    /**
     * @hidden
     */
    subtractDate() {
        this.changeDate(-1);
    }
    addDate() {
        this.changeDate(1);
    }
    changeDate(unit) {
        const addFn = {
            day: DateUtil.addDays,
            week: DateUtil.addWeeks,
            month: DateUtil.addMonths,
        }[this.view];
        this.viewDateChange.emit(addFn(this.viewDate, unit));
    }
    get startOfWeek() {
        return DateUtil.startOfWeek(this.viewDate);
    }
    get endOfWeek() {
        return DateUtil.endOfWeek(this.viewDate);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaDateChangeElement, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoAgendaDateChangeElement, selector: "novo-agenda-date-change", inputs: { view: "view", viewDate: "viewDate", locale: "locale" }, outputs: { viewDateChange: "viewDateChange" }, ngImport: i0, template: `
    <div class="cal-date-change">
      <i class="bhi-arrow-left" (click)="subtractDate()"></i>
      <span [ngSwitch]="view">
        <span *ngSwitchCase="'month'">{{ (viewDate | month: locale) + ' ' + (viewDate | year: locale) }}</span>
        <span *ngSwitchCase="'week'">{{
          (startOfWeek | monthday: locale:'long') + ' - ' + (endOfWeek | endofweekdisplay: startOfWeek:locale:'long')
        }}</span>
        <span *ngSwitchCase="'day'">{{
          (viewDate | weekday: locale:'long') + ', ' + (viewDate | month: locale) + ' ' + (viewDate | dayofmonth: locale)
        }}</span>
      </span>
      <i class="bhi-arrow-right" (click)="addDate()"></i>
    </div>
  `, isInline: true, styles: [":host{display:inline-block}:host .cal-date-change{border-radius:3px;border:1px solid #e1e1e1;background-color:#fff;position:relative;padding:10px 15px;text-align:center}:host .cal-date-change>span{padding:5px;color:#000}:host .cal-date-change>i{cursor:pointer;padding:2px;font-size:.9em}\n"], dependencies: [{ kind: "directive", type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "pipe", type: i2.WeekdayPipe, name: "weekday" }, { kind: "pipe", type: i3.DayOfMonthPipe, name: "dayofmonth" }, { kind: "pipe", type: i4.MonthPipe, name: "month" }, { kind: "pipe", type: i5.MonthDayPipe, name: "monthday" }, { kind: "pipe", type: i6.YearPipe, name: "year" }, { kind: "pipe", type: i7.EndOfWeekDisplayPipe, name: "endofweekdisplay" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaDateChangeElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-agenda-date-change', template: `
    <div class="cal-date-change">
      <i class="bhi-arrow-left" (click)="subtractDate()"></i>
      <span [ngSwitch]="view">
        <span *ngSwitchCase="'month'">{{ (viewDate | month: locale) + ' ' + (viewDate | year: locale) }}</span>
        <span *ngSwitchCase="'week'">{{
          (startOfWeek | monthday: locale:'long') + ' - ' + (endOfWeek | endofweekdisplay: startOfWeek:locale:'long')
        }}</span>
        <span *ngSwitchCase="'day'">{{
          (viewDate | weekday: locale:'long') + ', ' + (viewDate | month: locale) + ' ' + (viewDate | dayofmonth: locale)
        }}</span>
      </span>
      <i class="bhi-arrow-right" (click)="addDate()"></i>
    </div>
  `, styles: [":host{display:inline-block}:host .cal-date-change{border-radius:3px;border:1px solid #e1e1e1;background-color:#fff;position:relative;padding:10px 15px;text-align:center}:host .cal-date-change>span{padding:5px;color:#000}:host .cal-date-change>i{cursor:pointer;padding:2px;font-size:.9em}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }], propDecorators: { view: [{
                type: Input
            }], viewDate: [{
                type: Input
            }], locale: [{
                type: Input
            }], viewDateChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWdlbmRhRGF0ZUNoYW5nZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2FnZW5kYS9jb21tb24vQWdlbmRhRGF0ZUNoYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDOzs7Ozs7Ozs7QUFxQi9DLE1BQU0sT0FBTywyQkFBMkI7SUFzQnRDLFlBQStCLE1BQWM7UUFON0M7O1dBRUc7UUFFSCxtQkFBYyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3RELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7T0FFRztJQUNILFlBQVk7UUFDVixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBWTtRQUNyQixNQUFNLEtBQUssR0FBUTtZQUNqQixHQUFHLEVBQUUsUUFBUSxDQUFDLE9BQU87WUFDckIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxRQUFRO1lBQ3ZCLEtBQUssRUFBRSxRQUFRLENBQUMsU0FBUztTQUMxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUViLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0MsQ0FBQzsrR0FyRFUsMkJBQTJCLGtCQXNCbEIsU0FBUzttR0F0QmxCLDJCQUEyQixnTEFqQjVCOzs7Ozs7Ozs7Ozs7OztHQWNUOzs0RkFHVSwyQkFBMkI7a0JBbkJ2QyxTQUFTOytCQUNFLHlCQUF5QixZQUN6Qjs7Ozs7Ozs7Ozs7Ozs7R0FjVDs7MEJBeUJZLE1BQU07MkJBQUMsU0FBUzt5Q0FqQjdCLElBQUk7c0JBREgsS0FBSztnQkFPTixRQUFRO3NCQURQLEtBQUs7Z0JBSU4sTUFBTTtzQkFETCxLQUFLO2dCQU9OLGNBQWM7c0JBRGIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBMT0NBTEVfSUQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZVV0aWwgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3V0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1hZ2VuZGEtZGF0ZS1jaGFuZ2UnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJjYWwtZGF0ZS1jaGFuZ2VcIj5cbiAgICAgIDxpIGNsYXNzPVwiYmhpLWFycm93LWxlZnRcIiAoY2xpY2spPVwic3VidHJhY3REYXRlKClcIj48L2k+XG4gICAgICA8c3BhbiBbbmdTd2l0Y2hdPVwidmlld1wiPlxuICAgICAgICA8c3BhbiAqbmdTd2l0Y2hDYXNlPVwiJ21vbnRoJ1wiPnt7ICh2aWV3RGF0ZSB8IG1vbnRoOiBsb2NhbGUpICsgJyAnICsgKHZpZXdEYXRlIHwgeWVhcjogbG9jYWxlKSB9fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gKm5nU3dpdGNoQ2FzZT1cIid3ZWVrJ1wiPnt7XG4gICAgICAgICAgKHN0YXJ0T2ZXZWVrIHwgbW9udGhkYXk6IGxvY2FsZTonbG9uZycpICsgJyAtICcgKyAoZW5kT2ZXZWVrIHwgZW5kb2Z3ZWVrZGlzcGxheTogc3RhcnRPZldlZWs6bG9jYWxlOidsb25nJylcbiAgICAgICAgfX08L3NwYW4+XG4gICAgICAgIDxzcGFuICpuZ1N3aXRjaENhc2U9XCInZGF5J1wiPnt7XG4gICAgICAgICAgKHZpZXdEYXRlIHwgd2Vla2RheTogbG9jYWxlOidsb25nJykgKyAnLCAnICsgKHZpZXdEYXRlIHwgbW9udGg6IGxvY2FsZSkgKyAnICcgKyAodmlld0RhdGUgfCBkYXlvZm1vbnRoOiBsb2NhbGUpXG4gICAgICAgIH19PC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgICAgPGkgY2xhc3M9XCJiaGktYXJyb3ctcmlnaHRcIiAoY2xpY2spPVwiYWRkRGF0ZSgpXCI+PC9pPlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9BZ2VuZGFEYXRlQ2hhbmdlLnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgTm92b0FnZW5kYURhdGVDaGFuZ2VFbGVtZW50IHtcbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZpZXdcbiAgICovXG4gIEBJbnB1dCgpXG4gIHZpZXc6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmlldyBkYXRlXG4gICAqL1xuICBASW5wdXQoKVxuICB2aWV3RGF0ZTogRGF0ZTtcblxuICBASW5wdXQoKVxuICBsb2NhbGU6IHN0cmluZztcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHZpZXcgZGF0ZSBpcyBjaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgdmlld0RhdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxEYXRlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KExPQ0FMRV9JRCkgbG9jYWxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmxvY2FsZSA9IGxvY2FsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBzdWJ0cmFjdERhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5jaGFuZ2VEYXRlKC0xKTtcbiAgfVxuXG4gIGFkZERhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5jaGFuZ2VEYXRlKDEpO1xuICB9XG5cbiAgY2hhbmdlRGF0ZSh1bml0OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBhZGRGbjogYW55ID0ge1xuICAgICAgZGF5OiBEYXRlVXRpbC5hZGREYXlzLFxuICAgICAgd2VlazogRGF0ZVV0aWwuYWRkV2Vla3MsXG4gICAgICBtb250aDogRGF0ZVV0aWwuYWRkTW9udGhzLFxuICAgIH1bdGhpcy52aWV3XTtcblxuICAgIHRoaXMudmlld0RhdGVDaGFuZ2UuZW1pdChhZGRGbih0aGlzLnZpZXdEYXRlLCB1bml0KSk7XG4gIH1cblxuICBnZXQgc3RhcnRPZldlZWsoKSB7XG4gICAgcmV0dXJuIERhdGVVdGlsLnN0YXJ0T2ZXZWVrKHRoaXMudmlld0RhdGUpO1xuICB9XG5cbiAgZ2V0IGVuZE9mV2VlaygpIHtcbiAgICByZXR1cm4gRGF0ZVV0aWwuZW5kT2ZXZWVrKHRoaXMudmlld0RhdGUpO1xuICB9XG59XG4iXX0=