// NG2
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// APP
import { NovoButtonModule } from 'novo-elements/elements/button';
import { NovoPipesModule } from 'novo-elements/pipes';
import { NovoTooltipModule } from 'novo-elements/elements/tooltip';
// Common Elements
import { NovoAgendaDateChangeElement } from './common/AgendaDateChange';
import { NovoEventTypeLegendElement } from './common/EventTypeLegend';
// Day View
import { NovoAgendaAllDayEventElement } from './day/AgendaAllDayEvent';
import { NovoAgendaDayEventElement } from './day/AgendaDayEvent';
import { NovoAgendaDayViewElement } from './day/AgendaDayView';
import { NovoAgendaHourSegmentElement } from './day/AgendaHourSegment';
// Month View
import { NovoAgendaMonthDayElement } from './month/AgendaMonthDay';
import { NovoAgendaMonthHeaderElement } from './month/AgendaMonthHeader';
import { NovoAgendaMonthViewElement } from './month/AgendaMonthView';
// Week View
import { NovoAgendaWeekEventElement } from './week/AgendaWeekEvent';
import { NovoAgendaWeekHeaderElement } from './week/AgendaWeekHeader';
import { NovoAgendaWeekViewElement } from './week/AgendaWeekView';
// Pipes
import { DayOfMonthPipe } from './pipe/DayOfMonth.pipe';
import { EndOfWeekDisplayPipe } from './pipe/EndOfWeekDisplayPipe.pipe';
import { HoursPipe } from './pipe/Hours.pipe';
import { MonthPipe } from './pipe/Month.pipe';
import { MonthDayPipe } from './pipe/MonthDay.pipe';
import { WeekdayPipe } from './pipe/Weekday.pipe';
import { YearPipe } from './pipe/Year.pipe';
import * as i0 from "@angular/core";
export class NovoAgendaModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaModule, declarations: [NovoEventTypeLegendElement,
            NovoAgendaMonthViewElement,
            NovoAgendaMonthHeaderElement,
            NovoAgendaMonthDayElement,
            NovoAgendaWeekViewElement,
            NovoAgendaWeekHeaderElement,
            NovoAgendaWeekEventElement,
            NovoAgendaDayViewElement,
            NovoAgendaDayEventElement,
            NovoAgendaHourSegmentElement,
            NovoAgendaAllDayEventElement,
            NovoAgendaDateChangeElement,
            WeekdayPipe,
            DayOfMonthPipe,
            MonthPipe,
            MonthDayPipe,
            YearPipe,
            HoursPipe,
            EndOfWeekDisplayPipe], imports: [CommonModule, NovoButtonModule, NovoTooltipModule, NovoPipesModule], exports: [NovoEventTypeLegendElement,
            NovoAgendaMonthViewElement,
            NovoAgendaMonthHeaderElement,
            NovoAgendaMonthDayElement,
            NovoAgendaWeekViewElement,
            NovoAgendaWeekHeaderElement,
            NovoAgendaWeekEventElement,
            NovoAgendaDayViewElement,
            NovoAgendaDayEventElement,
            NovoAgendaHourSegmentElement,
            NovoAgendaAllDayEventElement,
            NovoAgendaDateChangeElement,
            WeekdayPipe,
            DayOfMonthPipe,
            MonthPipe,
            MonthDayPipe,
            YearPipe,
            HoursPipe,
            EndOfWeekDisplayPipe] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaModule, imports: [CommonModule, NovoButtonModule, NovoTooltipModule, NovoPipesModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAgendaModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NovoButtonModule, NovoTooltipModule, NovoPipesModule],
                    declarations: [
                        NovoEventTypeLegendElement,
                        NovoAgendaMonthViewElement,
                        NovoAgendaMonthHeaderElement,
                        NovoAgendaMonthDayElement,
                        NovoAgendaWeekViewElement,
                        NovoAgendaWeekHeaderElement,
                        NovoAgendaWeekEventElement,
                        NovoAgendaDayViewElement,
                        NovoAgendaDayEventElement,
                        NovoAgendaHourSegmentElement,
                        NovoAgendaAllDayEventElement,
                        NovoAgendaDateChangeElement,
                        WeekdayPipe,
                        DayOfMonthPipe,
                        MonthPipe,
                        MonthDayPipe,
                        YearPipe,
                        HoursPipe,
                        EndOfWeekDisplayPipe,
                    ],
                    exports: [
                        NovoEventTypeLegendElement,
                        NovoAgendaMonthViewElement,
                        NovoAgendaMonthHeaderElement,
                        NovoAgendaMonthDayElement,
                        NovoAgendaWeekViewElement,
                        NovoAgendaWeekHeaderElement,
                        NovoAgendaWeekEventElement,
                        NovoAgendaDayViewElement,
                        NovoAgendaDayEventElement,
                        NovoAgendaHourSegmentElement,
                        NovoAgendaAllDayEventElement,
                        NovoAgendaDateChangeElement,
                        WeekdayPipe,
                        DayOfMonthPipe,
                        MonthPipe,
                        MonthDayPipe,
                        YearPipe,
                        HoursPipe,
                        EndOfWeekDisplayPipe,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWdlbmRhLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2FnZW5kYS9BZ2VuZGEubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU07QUFDTixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxNQUFNO0FBQ04sT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDakUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLGtCQUFrQjtBQUNsQixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN0RSxXQUFXO0FBQ1gsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDakUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDL0QsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkUsYUFBYTtBQUNiLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ25FLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3JFLFlBQVk7QUFDWixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN0RSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNsRSxRQUFRO0FBQ1IsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7O0FBK0M1QyxNQUFNLE9BQU8sZ0JBQWdCOytHQUFoQixnQkFBZ0I7Z0hBQWhCLGdCQUFnQixpQkExQ3pCLDBCQUEwQjtZQUMxQiwwQkFBMEI7WUFDMUIsNEJBQTRCO1lBQzVCLHlCQUF5QjtZQUN6Qix5QkFBeUI7WUFDekIsMkJBQTJCO1lBQzNCLDBCQUEwQjtZQUMxQix3QkFBd0I7WUFDeEIseUJBQXlCO1lBQ3pCLDRCQUE0QjtZQUM1Qiw0QkFBNEI7WUFDNUIsMkJBQTJCO1lBQzNCLFdBQVc7WUFDWCxjQUFjO1lBQ2QsU0FBUztZQUNULFlBQVk7WUFDWixRQUFRO1lBQ1IsU0FBUztZQUNULG9CQUFvQixhQXBCWixZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxhQXVCMUUsMEJBQTBCO1lBQzFCLDBCQUEwQjtZQUMxQiw0QkFBNEI7WUFDNUIseUJBQXlCO1lBQ3pCLHlCQUF5QjtZQUN6QiwyQkFBMkI7WUFDM0IsMEJBQTBCO1lBQzFCLHdCQUF3QjtZQUN4Qix5QkFBeUI7WUFDekIsNEJBQTRCO1lBQzVCLDRCQUE0QjtZQUM1QiwyQkFBMkI7WUFDM0IsV0FBVztZQUNYLGNBQWM7WUFDZCxTQUFTO1lBQ1QsWUFBWTtZQUNaLFFBQVE7WUFDUixTQUFTO1lBQ1Qsb0JBQW9CO2dIQUdYLGdCQUFnQixZQTVDakIsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLGVBQWU7OzRGQTRDakUsZ0JBQWdCO2tCQTdDNUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDO29CQUM3RSxZQUFZLEVBQUU7d0JBQ1osMEJBQTBCO3dCQUMxQiwwQkFBMEI7d0JBQzFCLDRCQUE0Qjt3QkFDNUIseUJBQXlCO3dCQUN6Qix5QkFBeUI7d0JBQ3pCLDJCQUEyQjt3QkFDM0IsMEJBQTBCO3dCQUMxQix3QkFBd0I7d0JBQ3hCLHlCQUF5Qjt3QkFDekIsNEJBQTRCO3dCQUM1Qiw0QkFBNEI7d0JBQzVCLDJCQUEyQjt3QkFDM0IsV0FBVzt3QkFDWCxjQUFjO3dCQUNkLFNBQVM7d0JBQ1QsWUFBWTt3QkFDWixRQUFRO3dCQUNSLFNBQVM7d0JBQ1Qsb0JBQW9CO3FCQUNyQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsMEJBQTBCO3dCQUMxQiwwQkFBMEI7d0JBQzFCLDRCQUE0Qjt3QkFDNUIseUJBQXlCO3dCQUN6Qix5QkFBeUI7d0JBQ3pCLDJCQUEyQjt3QkFDM0IsMEJBQTBCO3dCQUMxQix3QkFBd0I7d0JBQ3hCLHlCQUF5Qjt3QkFDekIsNEJBQTRCO3dCQUM1Qiw0QkFBNEI7d0JBQzVCLDJCQUEyQjt3QkFDM0IsV0FBVzt3QkFDWCxjQUFjO3dCQUNkLFNBQVM7d0JBQ1QsWUFBWTt3QkFDWixRQUFRO3dCQUNSLFNBQVM7d0JBQ1Qsb0JBQW9CO3FCQUNyQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIE5HMlxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4vLyBBUFBcbmltcG9ydCB7IE5vdm9CdXR0b25Nb2R1bGUgfSBmcm9tICdub3ZvLWVsZW1lbnRzL2VsZW1lbnRzL2J1dHRvbic7XG5pbXBvcnQgeyBOb3ZvUGlwZXNNb2R1bGUgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3BpcGVzJztcbmltcG9ydCB7IE5vdm9Ub29sdGlwTW9kdWxlIH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy90b29sdGlwJztcbi8vIENvbW1vbiBFbGVtZW50c1xuaW1wb3J0IHsgTm92b0FnZW5kYURhdGVDaGFuZ2VFbGVtZW50IH0gZnJvbSAnLi9jb21tb24vQWdlbmRhRGF0ZUNoYW5nZSc7XG5pbXBvcnQgeyBOb3ZvRXZlbnRUeXBlTGVnZW5kRWxlbWVudCB9IGZyb20gJy4vY29tbW9uL0V2ZW50VHlwZUxlZ2VuZCc7XG4vLyBEYXkgVmlld1xuaW1wb3J0IHsgTm92b0FnZW5kYUFsbERheUV2ZW50RWxlbWVudCB9IGZyb20gJy4vZGF5L0FnZW5kYUFsbERheUV2ZW50JztcbmltcG9ydCB7IE5vdm9BZ2VuZGFEYXlFdmVudEVsZW1lbnQgfSBmcm9tICcuL2RheS9BZ2VuZGFEYXlFdmVudCc7XG5pbXBvcnQgeyBOb3ZvQWdlbmRhRGF5Vmlld0VsZW1lbnQgfSBmcm9tICcuL2RheS9BZ2VuZGFEYXlWaWV3JztcbmltcG9ydCB7IE5vdm9BZ2VuZGFIb3VyU2VnbWVudEVsZW1lbnQgfSBmcm9tICcuL2RheS9BZ2VuZGFIb3VyU2VnbWVudCc7XG4vLyBNb250aCBWaWV3XG5pbXBvcnQgeyBOb3ZvQWdlbmRhTW9udGhEYXlFbGVtZW50IH0gZnJvbSAnLi9tb250aC9BZ2VuZGFNb250aERheSc7XG5pbXBvcnQgeyBOb3ZvQWdlbmRhTW9udGhIZWFkZXJFbGVtZW50IH0gZnJvbSAnLi9tb250aC9BZ2VuZGFNb250aEhlYWRlcic7XG5pbXBvcnQgeyBOb3ZvQWdlbmRhTW9udGhWaWV3RWxlbWVudCB9IGZyb20gJy4vbW9udGgvQWdlbmRhTW9udGhWaWV3Jztcbi8vIFdlZWsgVmlld1xuaW1wb3J0IHsgTm92b0FnZW5kYVdlZWtFdmVudEVsZW1lbnQgfSBmcm9tICcuL3dlZWsvQWdlbmRhV2Vla0V2ZW50JztcbmltcG9ydCB7IE5vdm9BZ2VuZGFXZWVrSGVhZGVyRWxlbWVudCB9IGZyb20gJy4vd2Vlay9BZ2VuZGFXZWVrSGVhZGVyJztcbmltcG9ydCB7IE5vdm9BZ2VuZGFXZWVrVmlld0VsZW1lbnQgfSBmcm9tICcuL3dlZWsvQWdlbmRhV2Vla1ZpZXcnO1xuLy8gUGlwZXNcbmltcG9ydCB7IERheU9mTW9udGhQaXBlIH0gZnJvbSAnLi9waXBlL0RheU9mTW9udGgucGlwZSc7XG5pbXBvcnQgeyBFbmRPZldlZWtEaXNwbGF5UGlwZSB9IGZyb20gJy4vcGlwZS9FbmRPZldlZWtEaXNwbGF5UGlwZS5waXBlJztcbmltcG9ydCB7IEhvdXJzUGlwZSB9IGZyb20gJy4vcGlwZS9Ib3Vycy5waXBlJztcbmltcG9ydCB7IE1vbnRoUGlwZSB9IGZyb20gJy4vcGlwZS9Nb250aC5waXBlJztcbmltcG9ydCB7IE1vbnRoRGF5UGlwZSB9IGZyb20gJy4vcGlwZS9Nb250aERheS5waXBlJztcbmltcG9ydCB7IFdlZWtkYXlQaXBlIH0gZnJvbSAnLi9waXBlL1dlZWtkYXkucGlwZSc7XG5pbXBvcnQgeyBZZWFyUGlwZSB9IGZyb20gJy4vcGlwZS9ZZWFyLnBpcGUnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBOb3ZvQnV0dG9uTW9kdWxlLCBOb3ZvVG9vbHRpcE1vZHVsZSwgTm92b1BpcGVzTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTm92b0V2ZW50VHlwZUxlZ2VuZEVsZW1lbnQsXG4gICAgTm92b0FnZW5kYU1vbnRoVmlld0VsZW1lbnQsXG4gICAgTm92b0FnZW5kYU1vbnRoSGVhZGVyRWxlbWVudCxcbiAgICBOb3ZvQWdlbmRhTW9udGhEYXlFbGVtZW50LFxuICAgIE5vdm9BZ2VuZGFXZWVrVmlld0VsZW1lbnQsXG4gICAgTm92b0FnZW5kYVdlZWtIZWFkZXJFbGVtZW50LFxuICAgIE5vdm9BZ2VuZGFXZWVrRXZlbnRFbGVtZW50LFxuICAgIE5vdm9BZ2VuZGFEYXlWaWV3RWxlbWVudCxcbiAgICBOb3ZvQWdlbmRhRGF5RXZlbnRFbGVtZW50LFxuICAgIE5vdm9BZ2VuZGFIb3VyU2VnbWVudEVsZW1lbnQsXG4gICAgTm92b0FnZW5kYUFsbERheUV2ZW50RWxlbWVudCxcbiAgICBOb3ZvQWdlbmRhRGF0ZUNoYW5nZUVsZW1lbnQsXG4gICAgV2Vla2RheVBpcGUsXG4gICAgRGF5T2ZNb250aFBpcGUsXG4gICAgTW9udGhQaXBlLFxuICAgIE1vbnRoRGF5UGlwZSxcbiAgICBZZWFyUGlwZSxcbiAgICBIb3Vyc1BpcGUsXG4gICAgRW5kT2ZXZWVrRGlzcGxheVBpcGUsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBOb3ZvRXZlbnRUeXBlTGVnZW5kRWxlbWVudCxcbiAgICBOb3ZvQWdlbmRhTW9udGhWaWV3RWxlbWVudCxcbiAgICBOb3ZvQWdlbmRhTW9udGhIZWFkZXJFbGVtZW50LFxuICAgIE5vdm9BZ2VuZGFNb250aERheUVsZW1lbnQsXG4gICAgTm92b0FnZW5kYVdlZWtWaWV3RWxlbWVudCxcbiAgICBOb3ZvQWdlbmRhV2Vla0hlYWRlckVsZW1lbnQsXG4gICAgTm92b0FnZW5kYVdlZWtFdmVudEVsZW1lbnQsXG4gICAgTm92b0FnZW5kYURheVZpZXdFbGVtZW50LFxuICAgIE5vdm9BZ2VuZGFEYXlFdmVudEVsZW1lbnQsXG4gICAgTm92b0FnZW5kYUhvdXJTZWdtZW50RWxlbWVudCxcbiAgICBOb3ZvQWdlbmRhQWxsRGF5RXZlbnRFbGVtZW50LFxuICAgIE5vdm9BZ2VuZGFEYXRlQ2hhbmdlRWxlbWVudCxcbiAgICBXZWVrZGF5UGlwZSxcbiAgICBEYXlPZk1vbnRoUGlwZSxcbiAgICBNb250aFBpcGUsXG4gICAgTW9udGhEYXlQaXBlLFxuICAgIFllYXJQaXBlLFxuICAgIEhvdXJzUGlwZSxcbiAgICBFbmRPZldlZWtEaXNwbGF5UGlwZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTm92b0FnZW5kYU1vZHVsZSB7fVxuIl19