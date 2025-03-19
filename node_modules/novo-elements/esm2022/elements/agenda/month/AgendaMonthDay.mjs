import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CalendarEventResponse } from 'novo-elements/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "novo-elements/pipes";
import * as i3 from "../pipe/DayOfMonth.pipe";
export class NovoAgendaMonthDayElement {
    constructor() {
        this.eventClicked = new EventEmitter();
    }
    get accepted() {
        if (!this.day) {
            return [];
        }
        return this.day.events.filter((evt) => {
            return evt.response === CalendarEventResponse.Accepted;
        });
    }
    get rejected() {
        if (!this.day) {
            return [];
        }
        return this.day.events.filter((evt) => {
            return evt.response === CalendarEventResponse.Rejected;
        });
    }
    get maybes() {
        if (!this.day) {
            return [];
        }
        return this.day.events.filter((evt) => {
            return evt.response === CalendarEventResponse.Maybe;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaMonthDayElement, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoAgendaMonthDayElement, selector: "novo-agenda-month-day", inputs: { day: "day", locale: "locale", tooltipPosition: "tooltipPosition", customTemplate: "customTemplate" }, outputs: { eventClicked: "eventClicked" }, host: { properties: { "class": "\"agenda-cell agenda-day-cell \" + day?.cssClass", "class.agenda-day-accepted": "accepted.length", "class.agenda-day-rejected": "rejected.length", "class.agenda-past": "day.isPast", "class.agenda-today": "day.isToday", "class.agenda-future": "day.isFuture", "class.agenda-weekend": "day.isWeekend", "class.agenda-in-month": "day.inMonth", "class.agenda-out-month": "!day.inMonth", "class.agenda-has-events": "day.events.length > 0", "style.backgroundColor": "day.backgroundColor" } }, ngImport: i0, template: `
    <ng-template #defaultTemplate>
      <div class="agenda-day-top">
        <span class="agenda-day-badge" *ngIf="day.badgeTotal > 0">{{ day.badgeTotal }}</span>
        <span class="agenda-day-number">{{ day.date | dayofmonth: locale }}</span>
      </div>
      <div class="agenda-events">
        <div
          class="agenda-event"
          *ngFor="let type of day.events | groupBy: 'type'"
          [style.backgroundColor]="type?.value[0]?.color.primary"
          [ngClass]="type?.value[0]?.cssClass"
          (click)="$event.stopPropagation(); eventClicked.emit({ event: type?.value[0] })"
        >
          {{ type?.value.length }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        day: day,
        locale: locale,
        tooltipPosition: tooltipPosition,
        eventClicked: eventClicked,
        accepted: accepted,
        rejected: rejected,
        maybes: maybes
      }"
    >
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i2.GroupByPipe, name: "groupBy" }, { kind: "pipe", type: i3.DayOfMonthPipe, name: "dayofmonth" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaMonthDayElement, decorators: [{
            type: Component,
            args: [{
                    selector: 'novo-agenda-month-day',
                    template: `
    <ng-template #defaultTemplate>
      <div class="agenda-day-top">
        <span class="agenda-day-badge" *ngIf="day.badgeTotal > 0">{{ day.badgeTotal }}</span>
        <span class="agenda-day-number">{{ day.date | dayofmonth: locale }}</span>
      </div>
      <div class="agenda-events">
        <div
          class="agenda-event"
          *ngFor="let type of day.events | groupBy: 'type'"
          [style.backgroundColor]="type?.value[0]?.color.primary"
          [ngClass]="type?.value[0]?.cssClass"
          (click)="$event.stopPropagation(); eventClicked.emit({ event: type?.value[0] })"
        >
          {{ type?.value.length }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        day: day,
        locale: locale,
        tooltipPosition: tooltipPosition,
        eventClicked: eventClicked,
        accepted: accepted,
        rejected: rejected,
        maybes: maybes
      }"
    >
    </ng-template>
  `,
                    host: {
                        '[class]': '"agenda-cell agenda-day-cell " + day?.cssClass',
                        '[class.agenda-day-accepted]': 'accepted.length',
                        '[class.agenda-day-rejected]': 'rejected.length',
                        '[class.agenda-past]': 'day.isPast',
                        '[class.agenda-today]': 'day.isToday',
                        '[class.agenda-future]': 'day.isFuture',
                        '[class.agenda-weekend]': 'day.isWeekend',
                        '[class.agenda-in-month]': 'day.inMonth',
                        '[class.agenda-out-month]': '!day.inMonth',
                        '[class.agenda-has-events]': 'day.events.length > 0',
                        '[style.backgroundColor]': 'day.backgroundColor',
                    },
                }]
        }], propDecorators: { day: [{
                type: Input
            }], locale: [{
                type: Input
            }], tooltipPosition: [{
                type: Input
            }], customTemplate: [{
                type: Input
            }], eventClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWdlbmRhTW9udGhEYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9hZ2VuZGEvbW9udGgvQWdlbmRhTW9udGhEYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEYsT0FBTyxFQUFpQixxQkFBcUIsRUFBZ0IsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7QUFrRHpGLE1BQU0sT0FBTyx5QkFBeUI7SUFoRHRDO1FBOERFLGlCQUFZLEdBQTJDLElBQUksWUFBWSxFQUE0QixDQUFDO0tBNEJyRztJQTFCQyxJQUFJLFFBQVE7UUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2QsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNwQyxPQUFPLEdBQUcsQ0FBQyxRQUFRLEtBQUsscUJBQXFCLENBQUMsUUFBUSxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDZCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3BDLE9BQU8sR0FBRyxDQUFDLFFBQVEsS0FBSyxxQkFBcUIsQ0FBQyxRQUFRLENBQUM7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNkLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDcEMsT0FBTyxHQUFHLENBQUMsUUFBUSxLQUFLLHFCQUFxQixDQUFDLEtBQUssQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7K0dBekNVLHlCQUF5QjttR0FBekIseUJBQXlCLDZ0QkE5QzFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0JUOzs0RkFlVSx5QkFBeUI7a0JBaERyQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx1QkFBdUI7b0JBQ2pDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQStCVDtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osU0FBUyxFQUFFLGdEQUFnRDt3QkFDM0QsNkJBQTZCLEVBQUUsaUJBQWlCO3dCQUNoRCw2QkFBNkIsRUFBRSxpQkFBaUI7d0JBQ2hELHFCQUFxQixFQUFFLFlBQVk7d0JBQ25DLHNCQUFzQixFQUFFLGFBQWE7d0JBQ3JDLHVCQUF1QixFQUFFLGNBQWM7d0JBQ3ZDLHdCQUF3QixFQUFFLGVBQWU7d0JBQ3pDLHlCQUF5QixFQUFFLGFBQWE7d0JBQ3hDLDBCQUEwQixFQUFFLGNBQWM7d0JBQzFDLDJCQUEyQixFQUFFLHVCQUF1Qjt3QkFDcEQseUJBQXlCLEVBQUUscUJBQXFCO3FCQUNqRDtpQkFDRjs4QkFHQyxHQUFHO3NCQURGLEtBQUs7Z0JBSU4sTUFBTTtzQkFETCxLQUFLO2dCQUlOLGVBQWU7c0JBRGQsS0FBSztnQkFJTixjQUFjO3NCQURiLEtBQUs7Z0JBSU4sWUFBWTtzQkFEWCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDYWxlbmRhckV2ZW50LCBDYWxlbmRhckV2ZW50UmVzcG9uc2UsIE1vbnRoVmlld0RheSB9IGZyb20gJ25vdm8tZWxlbWVudHMvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdub3ZvLWFnZW5kYS1tb250aC1kYXknLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRlbXBsYXRlPlxuICAgICAgPGRpdiBjbGFzcz1cImFnZW5kYS1kYXktdG9wXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiYWdlbmRhLWRheS1iYWRnZVwiICpuZ0lmPVwiZGF5LmJhZGdlVG90YWwgPiAwXCI+e3sgZGF5LmJhZGdlVG90YWwgfX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiYWdlbmRhLWRheS1udW1iZXJcIj57eyBkYXkuZGF0ZSB8IGRheW9mbW9udGg6IGxvY2FsZSB9fTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImFnZW5kYS1ldmVudHNcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzPVwiYWdlbmRhLWV2ZW50XCJcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgdHlwZSBvZiBkYXkuZXZlbnRzIHwgZ3JvdXBCeTogJ3R5cGUnXCJcbiAgICAgICAgICBbc3R5bGUuYmFja2dyb3VuZENvbG9yXT1cInR5cGU/LnZhbHVlWzBdPy5jb2xvci5wcmltYXJ5XCJcbiAgICAgICAgICBbbmdDbGFzc109XCJ0eXBlPy52YWx1ZVswXT8uY3NzQ2xhc3NcIlxuICAgICAgICAgIChjbGljayk9XCIkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IGV2ZW50Q2xpY2tlZC5lbWl0KHsgZXZlbnQ6IHR5cGU/LnZhbHVlWzBdIH0pXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt7IHR5cGU/LnZhbHVlLmxlbmd0aCB9fVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgZGF5OiBkYXksXG4gICAgICAgIGxvY2FsZTogbG9jYWxlLFxuICAgICAgICB0b29sdGlwUG9zaXRpb246IHRvb2x0aXBQb3NpdGlvbixcbiAgICAgICAgZXZlbnRDbGlja2VkOiBldmVudENsaWNrZWQsXG4gICAgICAgIGFjY2VwdGVkOiBhY2NlcHRlZCxcbiAgICAgICAgcmVqZWN0ZWQ6IHJlamVjdGVkLFxuICAgICAgICBtYXliZXM6IG1heWJlc1xuICAgICAgfVwiXG4gICAgPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzXSc6ICdcImFnZW5kYS1jZWxsIGFnZW5kYS1kYXktY2VsbCBcIiArIGRheT8uY3NzQ2xhc3MnLFxuICAgICdbY2xhc3MuYWdlbmRhLWRheS1hY2NlcHRlZF0nOiAnYWNjZXB0ZWQubGVuZ3RoJyxcbiAgICAnW2NsYXNzLmFnZW5kYS1kYXktcmVqZWN0ZWRdJzogJ3JlamVjdGVkLmxlbmd0aCcsXG4gICAgJ1tjbGFzcy5hZ2VuZGEtcGFzdF0nOiAnZGF5LmlzUGFzdCcsXG4gICAgJ1tjbGFzcy5hZ2VuZGEtdG9kYXldJzogJ2RheS5pc1RvZGF5JyxcbiAgICAnW2NsYXNzLmFnZW5kYS1mdXR1cmVdJzogJ2RheS5pc0Z1dHVyZScsXG4gICAgJ1tjbGFzcy5hZ2VuZGEtd2Vla2VuZF0nOiAnZGF5LmlzV2Vla2VuZCcsXG4gICAgJ1tjbGFzcy5hZ2VuZGEtaW4tbW9udGhdJzogJ2RheS5pbk1vbnRoJyxcbiAgICAnW2NsYXNzLmFnZW5kYS1vdXQtbW9udGhdJzogJyFkYXkuaW5Nb250aCcsXG4gICAgJ1tjbGFzcy5hZ2VuZGEtaGFzLWV2ZW50c10nOiAnZGF5LmV2ZW50cy5sZW5ndGggPiAwJyxcbiAgICAnW3N0eWxlLmJhY2tncm91bmRDb2xvcl0nOiAnZGF5LmJhY2tncm91bmRDb2xvcicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE5vdm9BZ2VuZGFNb250aERheUVsZW1lbnQge1xuICBASW5wdXQoKVxuICBkYXk6IE1vbnRoVmlld0RheTtcblxuICBASW5wdXQoKVxuICBsb2NhbGU6IHN0cmluZztcblxuICBASW5wdXQoKVxuICB0b29sdGlwUG9zaXRpb246IHN0cmluZztcblxuICBASW5wdXQoKVxuICBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBAT3V0cHV0KClcbiAgZXZlbnRDbGlja2VkOiBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJFdmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXI8eyBldmVudDogQ2FsZW5kYXJFdmVudCB9PigpO1xuXG4gIGdldCBhY2NlcHRlZCgpOiBBcnJheTxDYWxlbmRhckV2ZW50PiB7XG4gICAgaWYgKCF0aGlzLmRheSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kYXkuZXZlbnRzLmZpbHRlcigoZXZ0KSA9PiB7XG4gICAgICByZXR1cm4gZXZ0LnJlc3BvbnNlID09PSBDYWxlbmRhckV2ZW50UmVzcG9uc2UuQWNjZXB0ZWQ7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgcmVqZWN0ZWQoKTogQXJyYXk8Q2FsZW5kYXJFdmVudD4ge1xuICAgIGlmICghdGhpcy5kYXkpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGF5LmV2ZW50cy5maWx0ZXIoKGV2dCkgPT4ge1xuICAgICAgcmV0dXJuIGV2dC5yZXNwb25zZSA9PT0gQ2FsZW5kYXJFdmVudFJlc3BvbnNlLlJlamVjdGVkO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IG1heWJlcygpOiBBcnJheTxDYWxlbmRhckV2ZW50PiB7XG4gICAgaWYgKCF0aGlzLmRheSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kYXkuZXZlbnRzLmZpbHRlcigoZXZ0KSA9PiB7XG4gICAgICByZXR1cm4gZXZ0LnJlc3BvbnNlID09PSBDYWxlbmRhckV2ZW50UmVzcG9uc2UuTWF5YmU7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==