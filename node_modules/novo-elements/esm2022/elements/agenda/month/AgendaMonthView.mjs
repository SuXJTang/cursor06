import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, LOCALE_ID, Output, TemplateRef, } from '@angular/core';
import { addSeconds, differenceInSeconds, getDate, getMonth, getYear, setDate, setMonth, setYear } from 'date-fns';
import { Subject } from 'rxjs';
import { getMonthView, getWeekViewHeader, } from 'novo-elements/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./AgendaMonthHeader";
import * as i3 from "./AgendaMonthDay";
/**
 * Shows all events on a given month. Example usage:
 *
 * ```
 * &lt;novo-agenda-month-view
 *  [viewDate]="viewDate"
 *  [events]="events"&gt;
 * &lt;/novo-agenda-month-view&gt;
 * ```
 */
export class NovoAgendaMonthViewElement {
    /**
     * @hidden
     */
    constructor(cdr, locale) {
        this.cdr = cdr;
        /**
         * An array of events to display on view
         */
        this.events = [];
        /**
         * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
         */
        this.excludeDays = [];
        /**
         * The locale used to format dates
         */
        this.locale = 'en-US';
        /**
         * The placement of the event tooltip
         */
        this.tooltipPosition = 'top';
        /**
         * Called when the day cell is clicked
         */
        this.dayClicked = new EventEmitter();
        /**
         * Called when the event title is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * Called when an event is dragged and dropped
         */
        this.eventTimesChanged = new EventEmitter();
        this.viewDateChange = new EventEmitter();
        this.locale = locale;
    }
    /**
     * @hidden
     */
    ngOnInit() {
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.refreshAll();
                this.cdr.markForCheck();
            });
        }
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        if (changes.viewDate || changes.excludeDays) {
            this.refreshHeader();
        }
        if (changes.viewDate || changes.events || changes.excludeDays) {
            this.refreshBody();
        }
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }
    /**
     * @hidden
     */
    eventDropped(day, event) {
        const year = getYear(day.date);
        const month = getMonth(day.date);
        const date = getDate(day.date);
        const newStart = setYear(setMonth(setDate(event.start, date), month), year);
        let newEnd;
        if (event.end) {
            const secondsDiff = differenceInSeconds(newStart, event.start);
            newEnd = addSeconds(event.end, secondsDiff);
        }
        this.eventTimesChanged.emit({ event, newStart, newEnd });
    }
    refreshHeader() {
        this.columnHeaders = getWeekViewHeader({
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
        });
    }
    refreshBody() {
        this.view = getMonthView({
            events: this.events,
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
        });
        if (this.dayModifier) {
            this.view.days.forEach((day) => this.dayModifier(day));
        }
    }
    refreshAll() {
        this.refreshHeader();
        this.refreshBody();
        this.viewDateChange.emit(this.viewDate);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaMonthViewElement, deps: [{ token: i0.ChangeDetectorRef }, { token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoAgendaMonthViewElement, selector: "novo-agenda-month", inputs: { viewDate: "viewDate", events: "events", excludeDays: "excludeDays", dayModifier: "dayModifier", refresh: "refresh", locale: "locale", tooltipPosition: "tooltipPosition", weekStartsOn: "weekStartsOn", headerTemplate: "headerTemplate", cellTemplate: "cellTemplate" }, outputs: { dayClicked: "dayClicked", eventClicked: "eventClicked", eventTimesChanged: "eventTimesChanged", viewDateChange: "viewDateChange" }, usesOnChanges: true, ngImport: i0, template: `
    <div class="agenda-month-view">
      <novo-agenda-month-header
        [(viewDate)]="viewDate"
        [days]="columnHeaders"
        [locale]="locale"
        [customTemplate]="headerTemplate"
        (viewDateChange)="refreshAll()"
      >
      </novo-agenda-month-header>
      <div class="agenda-days">
        <div *ngFor="let rowIndex of view.rowOffsets">
          <div class="agenda-cell-row">
            <novo-agenda-month-day
              *ngFor="let day of view.days | slice: rowIndex:rowIndex + view.totalDaysVisibleInWeek"
              [day]="day"
              [locale]="locale"
              [customTemplate]="cellTemplate"
              (click)="dayClicked.emit({ day: day })"
              (eventClicked)="eventClicked.emit({ day: day, event: $event.event })"
            >
            </novo-agenda-month-day>
          </div>
        </div>
      </div>
    </div>
  `, isInline: true, styles: [":host ::ng-deep .agenda-month-view{background-color:#fff}:host ::ng-deep .agenda-month-view .agenda-header{display:flex;flex-flow:column;text-align:center;font-weight:bolder;border-bottom:2px solid #e1e1e1}:host ::ng-deep .agenda-month-view .agenda-header .agenda-header-top{display:flex;flex-flow:row nowrap;align-items:center;justify-content:space-around}:host ::ng-deep .agenda-month-view .agenda-header .agenda-header-top .agenda-month{font-size:180%}:host ::ng-deep .agenda-month-view .agenda-header .agenda-header-top .agenda-year{color:#999}:host ::ng-deep .agenda-month-view .agenda-header .agenda-weekdays{display:flex;flex-flow:row nowrap}:host ::ng-deep .agenda-month-view .agenda-header .agenda-weekdays .agenda-weekday{padding:5px 0;overflow:hidden;text-overflow:ellipsis;display:block;white-space:nowrap;flex:1}:host ::ng-deep .agenda-month-view .agenda-cell-row{display:flex}:host ::ng-deep .agenda-month-view .agenda-cell-row:hover{background-color:#fafafa}:host ::ng-deep .agenda-month-view .agenda-cell-row .agenda-cell:hover,:host ::ng-deep .agenda-month-view .agenda-cell.agenda-has-events.agenda-open{background-color:#ededed}:host ::ng-deep .agenda-month-view .agenda-days{border:1px solid #e1e1e1;border-bottom:0}:host ::ng-deep .agenda-month-view .agenda-day-top{display:flex;flex-flow:row nowrap;align-items:center;justify-content:flex-end}:host ::ng-deep .agenda-month-view .agenda-cell:hover .agenda-actions{display:flex}:host ::ng-deep .agenda-month-view .agenda-cell{float:left;flex:1;display:flex;flex-direction:column;align-items:stretch;position:relative}:host ::ng-deep .agenda-month-view .agenda-day-cell{min-height:56px}:host ::ng-deep .agenda-month-view .agenda-day-cell:not(:last-child){border-right:1px solid #e1e1e1}:host ::ng-deep .agenda-month-view .agenda-days .agenda-cell-row{border-bottom:1px solid #e1e1e1}:host ::ng-deep .agenda-month-view .agenda-day-badge{background-color:#b94a48;display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:middle;border-radius:10px}:host ::ng-deep .agenda-month-view .agenda-day-number{font-size:1.2em;font-weight:400;opacity:.5;padding:4px}:host ::ng-deep .agenda-month-view .agenda-event{width:22px;height:22px;border-radius:4px;display:inline-block;margin:2px;vertical-align:middle;text-align:center;line-height:22px;font-size:12px;color:#fff}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-in-month.agenda-has-events{cursor:pointer}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-out-month .agenda-day-number{opacity:.1;cursor:default}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-weekend .agenda-day-number{color:#8b0000}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-today{background-color:#e8fde7}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-today .agenda-day-number{color:#3d464d}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-drag-over{background-color:#e0e0e0!important}:host ::ng-deep .agenda-month-view .agenda-open-day-events{padding:15px;color:#fff;background-color:#555;box-shadow:inset 0 0 15px #00000080}:host ::ng-deep .agenda-month-view .agenda-open-day-events .agenda-event{position:relative;top:2px}:host ::ng-deep .agenda-month-view .agenda-event-title{color:#fff}:host ::ng-deep .agenda-month-view .agenda-out-month .agenda-day-badge,:host ::ng-deep .agenda-month-view .agenda-out-month .agenda-event{opacity:.3}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i2.NovoAgendaMonthHeaderElement, selector: "novo-agenda-month-header", inputs: ["viewDate", "days", "locale", "customTemplate"], outputs: ["viewDateChange"] }, { kind: "component", type: i3.NovoAgendaMonthDayElement, selector: "novo-agenda-month-day", inputs: ["day", "locale", "tooltipPosition", "customTemplate"], outputs: ["eventClicked"] }, { kind: "pipe", type: i1.SlicePipe, name: "slice" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaMonthViewElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-agenda-month', template: `
    <div class="agenda-month-view">
      <novo-agenda-month-header
        [(viewDate)]="viewDate"
        [days]="columnHeaders"
        [locale]="locale"
        [customTemplate]="headerTemplate"
        (viewDateChange)="refreshAll()"
      >
      </novo-agenda-month-header>
      <div class="agenda-days">
        <div *ngFor="let rowIndex of view.rowOffsets">
          <div class="agenda-cell-row">
            <novo-agenda-month-day
              *ngFor="let day of view.days | slice: rowIndex:rowIndex + view.totalDaysVisibleInWeek"
              [day]="day"
              [locale]="locale"
              [customTemplate]="cellTemplate"
              (click)="dayClicked.emit({ day: day })"
              (eventClicked)="eventClicked.emit({ day: day, event: $event.event })"
            >
            </novo-agenda-month-day>
          </div>
        </div>
      </div>
    </div>
  `, styles: [":host ::ng-deep .agenda-month-view{background-color:#fff}:host ::ng-deep .agenda-month-view .agenda-header{display:flex;flex-flow:column;text-align:center;font-weight:bolder;border-bottom:2px solid #e1e1e1}:host ::ng-deep .agenda-month-view .agenda-header .agenda-header-top{display:flex;flex-flow:row nowrap;align-items:center;justify-content:space-around}:host ::ng-deep .agenda-month-view .agenda-header .agenda-header-top .agenda-month{font-size:180%}:host ::ng-deep .agenda-month-view .agenda-header .agenda-header-top .agenda-year{color:#999}:host ::ng-deep .agenda-month-view .agenda-header .agenda-weekdays{display:flex;flex-flow:row nowrap}:host ::ng-deep .agenda-month-view .agenda-header .agenda-weekdays .agenda-weekday{padding:5px 0;overflow:hidden;text-overflow:ellipsis;display:block;white-space:nowrap;flex:1}:host ::ng-deep .agenda-month-view .agenda-cell-row{display:flex}:host ::ng-deep .agenda-month-view .agenda-cell-row:hover{background-color:#fafafa}:host ::ng-deep .agenda-month-view .agenda-cell-row .agenda-cell:hover,:host ::ng-deep .agenda-month-view .agenda-cell.agenda-has-events.agenda-open{background-color:#ededed}:host ::ng-deep .agenda-month-view .agenda-days{border:1px solid #e1e1e1;border-bottom:0}:host ::ng-deep .agenda-month-view .agenda-day-top{display:flex;flex-flow:row nowrap;align-items:center;justify-content:flex-end}:host ::ng-deep .agenda-month-view .agenda-cell:hover .agenda-actions{display:flex}:host ::ng-deep .agenda-month-view .agenda-cell{float:left;flex:1;display:flex;flex-direction:column;align-items:stretch;position:relative}:host ::ng-deep .agenda-month-view .agenda-day-cell{min-height:56px}:host ::ng-deep .agenda-month-view .agenda-day-cell:not(:last-child){border-right:1px solid #e1e1e1}:host ::ng-deep .agenda-month-view .agenda-days .agenda-cell-row{border-bottom:1px solid #e1e1e1}:host ::ng-deep .agenda-month-view .agenda-day-badge{background-color:#b94a48;display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:700;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:middle;border-radius:10px}:host ::ng-deep .agenda-month-view .agenda-day-number{font-size:1.2em;font-weight:400;opacity:.5;padding:4px}:host ::ng-deep .agenda-month-view .agenda-event{width:22px;height:22px;border-radius:4px;display:inline-block;margin:2px;vertical-align:middle;text-align:center;line-height:22px;font-size:12px;color:#fff}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-in-month.agenda-has-events{cursor:pointer}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-out-month .agenda-day-number{opacity:.1;cursor:default}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-weekend .agenda-day-number{color:#8b0000}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-today{background-color:#e8fde7}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-today .agenda-day-number{color:#3d464d}:host ::ng-deep .agenda-month-view .agenda-day-cell.agenda-drag-over{background-color:#e0e0e0!important}:host ::ng-deep .agenda-month-view .agenda-open-day-events{padding:15px;color:#fff;background-color:#555;box-shadow:inset 0 0 15px #00000080}:host ::ng-deep .agenda-month-view .agenda-open-day-events .agenda-event{position:relative;top:2px}:host ::ng-deep .agenda-month-view .agenda-event-title{color:#fff}:host ::ng-deep .agenda-month-view .agenda-out-month .agenda-day-badge,:host ::ng-deep .agenda-month-view .agenda-out-month .agenda-event{opacity:.3}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }], propDecorators: { viewDate: [{
                type: Input
            }], events: [{
                type: Input
            }], excludeDays: [{
                type: Input
            }], dayModifier: [{
                type: Input
            }], refresh: [{
                type: Input
            }], locale: [{
                type: Input
            }], tooltipPosition: [{
                type: Input
            }], weekStartsOn: [{
                type: Input
            }], headerTemplate: [{
                type: Input
            }], cellTemplate: [{
                type: Input
            }], dayClicked: [{
                type: Output
            }], eventClicked: [{
                type: Output
            }], eventTimesChanged: [{
                type: Output
            }], viewDateChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWdlbmRhTW9udGhWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvYWdlbmRhL21vbnRoL0FnZW5kYU1vbnRoVmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxTQUFTLEVBSVQsTUFBTSxFQUNOLFdBQVcsR0FDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ25ILE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFHTCxZQUFZLEVBQ1osaUJBQWlCLEdBSWxCLE1BQU0scUJBQXFCLENBQUM7Ozs7O0FBRTdCOzs7Ozs7Ozs7R0FTRztBQWdDSCxNQUFNLE9BQU8sMEJBQTBCO0lBa0dyQzs7T0FFRztJQUNILFlBQW9CLEdBQXNCLEVBQXFCLE1BQWM7UUFBekQsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUE5RjFDOztXQUVHO1FBRUgsV0FBTSxHQUFvQixFQUFFLENBQUM7UUFFN0I7O1dBRUc7UUFFSCxnQkFBVyxHQUFhLEVBQUUsQ0FBQztRQWUzQjs7V0FFRztRQUVILFdBQU0sR0FBVyxPQUFPLENBQUM7UUFFekI7O1dBRUc7UUFFSCxvQkFBZSxHQUFXLEtBQUssQ0FBQztRQW9CaEM7O1dBRUc7UUFFSCxlQUFVLEdBQXdDLElBQUksWUFBWSxFQUF5QixDQUFDO1FBRTVGOztXQUVHO1FBRUgsaUJBQVksR0FBcUQsSUFBSSxZQUFZLEVBQXNDLENBQUM7UUFFeEg7O1dBRUc7UUFFSCxzQkFBaUIsR0FBaUQs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QUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztJQUNILENBQUM7SUFFTSxVQUFVO1FBQ2YsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUMsQ0FBQzsrR0FsTFUsMEJBQTBCLG1EQXFHZSxTQUFTO21HQXJHbEQsMEJBQTBCLGlmQTdCM0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJUOzs0RkFHVSwwQkFBMEI7a0JBL0J0QyxTQUFTOytCQUNFLG1CQUFtQixZQUNuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQlQ7OzBCQXdHNEMsTUFBTTsyQkFBQyxTQUFTO3lDQWhHN0QsUUFBUTtzQkFEUCxLQUFLO2dCQU9OLE1BQU07c0JBREwsS0FBSztnQkFPTixXQUFXO3NCQURWLEtBQUs7Z0JBUU4sV0FBVztzQkFEVixLQUFLO2dCQU9OLE9BQU87c0JBRE4sS0FBSztnQkFPTixNQUFNO3NCQURMLEtBQUs7Z0JBT04sZUFBZTtzQkFEZCxLQUFLO2dCQU9OLFlBQVk7c0JBRFgsS0FBSztnQkFPTixjQUFjO3NCQURiLEtBQUs7Z0JBT04sWUFBWTtzQkFEWCxLQUFLO2dCQU9OLFVBQVU7c0JBRFQsTUFBTTtnQkFPUCxZQUFZO3NCQURYLE1BQU07Z0JBT1AsaUJBQWlCO3NCQURoQixNQUFNO2dCQUlQLGNBQWM7c0JBRGIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTE9DQUxFX0lELFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGFkZFNlY29uZHMsIGRpZmZlcmVuY2VJblNlY29uZHMsIGdldERhdGUsIGdldE1vbnRoLCBnZXRZZWFyLCBzZXREYXRlLCBzZXRNb250aCwgc2V0WWVhciB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgQ2FsZW5kYXJFdmVudCxcbiAgQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50LFxuICBnZXRNb250aFZpZXcsXG4gIGdldFdlZWtWaWV3SGVhZGVyLFxuICBNb250aFZpZXcsXG4gIE1vbnRoVmlld0RheSxcbiAgV2Vla0RheSxcbn0gZnJvbSAnbm92by1lbGVtZW50cy91dGlscyc7XG5cbi8qKlxuICogU2hvd3MgYWxsIGV2ZW50cyBvbiBhIGdpdmVuIG1vbnRoLiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqIGBgYFxuICogJmx0O25vdm8tYWdlbmRhLW1vbnRoLXZpZXdcbiAqICBbdmlld0RhdGVdPVwidmlld0RhdGVcIlxuICogIFtldmVudHNdPVwiZXZlbnRzXCImZ3Q7XG4gKiAmbHQ7L25vdm8tYWdlbmRhLW1vbnRoLXZpZXcmZ3Q7XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1hZ2VuZGEtbW9udGgnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJhZ2VuZGEtbW9udGgtdmlld1wiPlxuICAgICAgPG5vdm8tYWdlbmRhLW1vbnRoLWhlYWRlclxuICAgICAgICBbKHZpZXdEYXRlKV09XCJ2aWV3RGF0ZVwiXG4gICAgICAgIFtkYXlzXT1cImNvbHVtbkhlYWRlcnNcIlxuICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJoZWFkZXJUZW1wbGF0ZVwiXG4gICAgICAgICh2aWV3RGF0ZUNoYW5nZSk9XCJyZWZyZXNoQWxsKClcIlxuICAgICAgPlxuICAgICAgPC9ub3ZvLWFnZW5kYS1tb250aC1oZWFkZXI+XG4gICAgICA8ZGl2IGNsYXNzPVwiYWdlbmRhLWRheXNcIj5cbiAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgcm93SW5kZXggb2Ygdmlldy5yb3dPZmZzZXRzXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImFnZW5kYS1jZWxsLXJvd1wiPlxuICAgICAgICAgICAgPG5vdm8tYWdlbmRhLW1vbnRoLWRheVxuICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgZGF5IG9mIHZpZXcuZGF5cyB8IHNsaWNlOiByb3dJbmRleDpyb3dJbmRleCArIHZpZXcudG90YWxEYXlzVmlzaWJsZUluV2Vla1wiXG4gICAgICAgICAgICAgIFtkYXldPVwiZGF5XCJcbiAgICAgICAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxuICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiY2VsbFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cImRheUNsaWNrZWQuZW1pdCh7IGRheTogZGF5IH0pXCJcbiAgICAgICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJldmVudENsaWNrZWQuZW1pdCh7IGRheTogZGF5LCBldmVudDogJGV2ZW50LmV2ZW50IH0pXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvbm92by1hZ2VuZGEtbW9udGgtZGF5PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9BZ2VuZGFNb250aFZpZXcuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvQWdlbmRhTW9udGhWaWV3RWxlbWVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmlldyBkYXRlXG4gICAqL1xuICBASW5wdXQoKVxuICB2aWV3RGF0ZTogRGF0ZTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXZlbnRzIHRvIGRpc3BsYXkgb24gdmlld1xuICAgKi9cbiAgQElucHV0KClcbiAgZXZlbnRzOiBDYWxlbmRhckV2ZW50W10gPSBbXTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZGF5IGluZGV4ZXMgKDAgPSBzdW5kYXksIDEgPSBtb25kYXkgZXRjKSB0aGF0IHdpbGwgYmUgaGlkZGVuIG9uIHRoZSB2aWV3XG4gICAqL1xuICBASW5wdXQoKVxuICBleGNsdWRlRGF5czogbnVtYmVyW10gPSBbXTtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIGJlZm9yZSBlYWNoIGNlbGwgaXMgcmVuZGVyZWQuIFRoZSBmaXJzdCBhcmd1bWVudCB3aWxsIGNvbnRhaW4gdGhlIGNhbGVuZGFyIGNlbGwuXG4gICAqIElmIHlvdSBhZGQgdGhlIGBjc3NDbGFzc2AgcHJvcGVydHkgdG8gdGhlIGNlbGwgaXQgd2lsbCBhZGQgdGhhdCBjbGFzcyB0byB0aGUgY2VsbCBpbiB0aGUgdGVtcGxhdGVcbiAgICovXG4gIEBJbnB1dCgpXG4gIGRheU1vZGlmaWVyOiBGdW5jdGlvbjtcblxuICAvKipcbiAgICogQW4gb2JzZXJ2YWJsZSB0aGF0IHdoZW4gZW1pdHRlZCBvbiB3aWxsIHJlLXJlbmRlciB0aGUgY3VycmVudCB2aWV3XG4gICAqL1xuICBASW5wdXQoKVxuICByZWZyZXNoOiBTdWJqZWN0PGFueT47XG5cbiAgLyoqXG4gICAqIFRoZSBsb2NhbGUgdXNlZCB0byBmb3JtYXQgZGF0ZXNcbiAgICovXG4gIEBJbnB1dCgpXG4gIGxvY2FsZTogc3RyaW5nID0gJ2VuLVVTJztcblxuICAvKipcbiAgICogVGhlIHBsYWNlbWVudCBvZiB0aGUgZXZlbnQgdG9vbHRpcFxuICAgKi9cbiAgQElucHV0KClcbiAgdG9vbHRpcFBvc2l0aW9uOiBzdHJpbmcgPSAndG9wJztcblxuICAvKipcbiAgICogVGhlIHN0YXJ0IG51bWJlciBvZiB0aGUgd2Vla1xuICAgKi9cbiAgQElucHV0KClcbiAgd2Vla1N0YXJ0c09uOiBEYXk7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBoZWFkZXJcbiAgICovXG4gIEBJbnB1dCgpXG4gIGhlYWRlclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgdG8gcmVwbGFjZSB0aGUgZGF5IGNlbGxcbiAgICovXG4gIEBJbnB1dCgpXG4gIGNlbGxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGRheSBjZWxsIGlzIGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBkYXlDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBkYXk6IE1vbnRoVmlld0RheSB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBkYXk6IE1vbnRoVmlld0RheSB9PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgZXZlbnQgdGl0bGUgaXMgY2xpY2tlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGV2ZW50Q2xpY2tlZDogRXZlbnRFbWl0dGVyPHsgZGF5OiBhbnk7IGV2ZW50OiBDYWxlbmRhckV2ZW50IH0+ID0gbmV3IEV2ZW50RW1pdHRlcjx7IGRheTogYW55OyBldmVudDogQ2FsZW5kYXJFdmVudCB9PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhbiBldmVudCBpcyBkcmFnZ2VkIGFuZCBkcm9wcGVkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgZXZlbnRUaW1lc0NoYW5nZWQ6IEV2ZW50RW1pdHRlcjxDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHZpZXdEYXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RGF0ZT4gPSBuZXcgRXZlbnRFbWl0dGVyPERhdGU+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGNvbHVtbkhlYWRlcnM6IFdlZWtEYXlbXTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdmlldzogTW9udGhWaWV3O1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICByZWZyZXNoU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgQEluamVjdChMT0NBTEVfSUQpIGxvY2FsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5sb2NhbGUgPSBsb2NhbGU7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucmVmcmVzaCkge1xuICAgICAgdGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uID0gdGhpcy5yZWZyZXNoLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcmVzaEFsbCgpO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy52aWV3RGF0ZSB8fCBjaGFuZ2VzLmV4Y2x1ZGVEYXlzKSB7XG4gICAgICB0aGlzLnJlZnJlc2hIZWFkZXIoKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXMudmlld0RhdGUgfHwgY2hhbmdlcy5ldmVudHMgfHwgY2hhbmdlcy5leGNsdWRlRGF5cykge1xuICAgICAgdGhpcy5yZWZyZXNoQm9keSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZXZlbnREcm9wcGVkKGRheTogTW9udGhWaWV3RGF5LCBldmVudDogQ2FsZW5kYXJFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IHllYXI6IG51bWJlciA9IGdldFllYXIoZGF5LmRhdGUpO1xuICAgIGNvbnN0IG1vbnRoOiBudW1iZXIgPSBnZXRNb250aChkYXkuZGF0ZSk7XG4gICAgY29uc3QgZGF0ZTogbnVtYmVyID0gZ2V0RGF0ZShkYXkuZGF0ZSk7XG4gICAgY29uc3QgbmV3U3RhcnQ6IERhdGUgPSBzZXRZZWFyKHNldE1vbnRoKHNldERhdGUoZXZlbnQuc3RhcnQsIGRhdGUpLCBtb250aCksIHllYXIpO1xuICAgIGxldCBuZXdFbmQ6IERhdGU7XG4gICAgaWYgKGV2ZW50LmVuZCkge1xuICAgICAgY29uc3Qgc2Vjb25kc0RpZmY6IG51bWJlciA9IGRpZmZlcmVuY2VJblNlY29uZHMobmV3U3RhcnQsIGV2ZW50LnN0YXJ0KTtcbiAgICAgIG5ld0VuZCA9IGFkZFNlY29uZHMoZXZlbnQuZW5kLCBzZWNvbmRzRGlmZik7XG4gICAgfVxuICAgIHRoaXMuZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCh7IGV2ZW50LCBuZXdTdGFydCwgbmV3RW5kIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoSGVhZGVyKCk6IHZvaWQge1xuICAgIHRoaXMuY29sdW1uSGVhZGVycyA9IGdldFdlZWtWaWV3SGVhZGVyKHtcbiAgICAgIHZpZXdEYXRlOiB0aGlzLnZpZXdEYXRlLFxuICAgICAgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVkOiB0aGlzLmV4Y2x1ZGVEYXlzLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoQm9keSgpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXcgPSBnZXRNb250aFZpZXcoe1xuICAgICAgZXZlbnRzOiB0aGlzLmV2ZW50cyxcbiAgICAgIHZpZXdEYXRlOiB0aGlzLnZpZXdEYXRlLFxuICAgICAgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVkOiB0aGlzLmV4Y2x1ZGVEYXlzLFxuICAgIH0pO1xuICAgIGlmICh0aGlzLmRheU1vZGlmaWVyKSB7XG4gICAgICB0aGlzLnZpZXcuZGF5cy5mb3JFYWNoKChkYXkpID0+IHRoaXMuZGF5TW9kaWZpZXIoZGF5KSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZnJlc2hBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5yZWZyZXNoSGVhZGVyKCk7XG4gICAgdGhpcy5yZWZyZXNoQm9keSgpO1xuICAgIHRoaXMudmlld0RhdGVDaGFuZ2UuZW1pdCh0aGlzLnZpZXdEYXRlKTtcbiAgfVxufVxuIl19