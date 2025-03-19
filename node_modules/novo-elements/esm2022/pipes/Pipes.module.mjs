// NG2
import { NgModule } from '@angular/core';
import { DecodeURIPipe } from './decode-uri/DecodeURI';
import { DefaultPipe } from './default/Default';
import { GroupByPipe } from './group-by/GroupBy';
import { HighlightPipe } from './highlight/Highlight';
import { IsoDatePipe, IsoDateRangePipe, IsoTimePipe, IsoTimeRangePipe } from './iso8601';
import { PluralPipe } from './plural/Plural';
import * as i0 from "@angular/core";
export class NovoPipesModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoPipesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoPipesModule, declarations: [PluralPipe, DecodeURIPipe, GroupByPipe, HighlightPipe, DefaultPipe, IsoTimePipe, IsoDatePipe, IsoTimeRangePipe, IsoDateRangePipe], exports: [PluralPipe, DecodeURIPipe, GroupByPipe, HighlightPipe, DefaultPipe, IsoTimePipe, IsoDatePipe, IsoTimeRangePipe, IsoDateRangePipe] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoPipesModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoPipesModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PluralPipe, DecodeURIPipe, GroupByPipe, HighlightPipe, DefaultPipe, IsoTimePipe, IsoDatePipe, IsoTimeRangePipe, IsoDateRangePipe],
                    exports: [PluralPipe, DecodeURIPipe, GroupByPipe, HighlightPipe, DefaultPipe, IsoTimePipe, IsoDatePipe, IsoTimeRangePipe, IsoDateRangePipe],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGlwZXMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvcGlwZXMvUGlwZXMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU07QUFDTixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDaEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN6RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBTTdDLE1BQU0sT0FBTyxlQUFlOytHQUFmLGVBQWU7Z0hBQWYsZUFBZSxpQkFIWCxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLGFBQ3JJLFVBQVUsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7Z0hBRS9ILGVBQWU7OzRGQUFmLGVBQWU7a0JBSjNCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO29CQUNoSixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7aUJBQzVJIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGVjb2RlVVJJUGlwZSB9IGZyb20gJy4vZGVjb2RlLXVyaS9EZWNvZGVVUkknO1xuaW1wb3J0IHsgRGVmYXVsdFBpcGUgfSBmcm9tICcuL2RlZmF1bHQvRGVmYXVsdCc7XG5pbXBvcnQgeyBHcm91cEJ5UGlwZSB9IGZyb20gJy4vZ3JvdXAtYnkvR3JvdXBCeSc7XG5pbXBvcnQgeyBIaWdobGlnaHRQaXBlIH0gZnJvbSAnLi9oaWdobGlnaHQvSGlnaGxpZ2h0JztcbmltcG9ydCB7IElzb0RhdGVQaXBlLCBJc29EYXRlUmFuZ2VQaXBlLCBJc29UaW1lUGlwZSwgSXNvVGltZVJhbmdlUGlwZSB9IGZyb20gJy4vaXNvODYwMSc7XG5pbXBvcnQgeyBQbHVyYWxQaXBlIH0gZnJvbSAnLi9wbHVyYWwvUGx1cmFsJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbUGx1cmFsUGlwZSwgRGVjb2RlVVJJUGlwZSwgR3JvdXBCeVBpcGUsIEhpZ2hsaWdodFBpcGUsIERlZmF1bHRQaXBlLCBJc29UaW1lUGlwZSwgSXNvRGF0ZVBpcGUsIElzb1RpbWVSYW5nZVBpcGUsIElzb0RhdGVSYW5nZVBpcGVdLFxuICBleHBvcnRzOiBbUGx1cmFsUGlwZSwgRGVjb2RlVVJJUGlwZSwgR3JvdXBCeVBpcGUsIEhpZ2hsaWdodFBpcGUsIERlZmF1bHRQaXBlLCBJc29UaW1lUGlwZSwgSXNvRGF0ZVBpcGUsIElzb1RpbWVSYW5nZVBpcGUsIElzb0RhdGVSYW5nZVBpcGVdLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvUGlwZXNNb2R1bGUge31cbiJdfQ==