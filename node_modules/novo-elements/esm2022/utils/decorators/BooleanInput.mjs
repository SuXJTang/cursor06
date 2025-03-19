import { coerceBooleanProperty } from '@angular/cdk/coercion';
export function BooleanInput() {
    return (target, propertyKey) => {
        const key = Symbol();
        return {
            get() {
                return this[key] || false;
            },
            set(value) {
                this[key] = coerceBooleanProperty(value);
            },
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbGVhbklucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvdXRpbHMvZGVjb3JhdG9ycy9Cb29sZWFuSW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFOUQsTUFBTSxVQUFVLFlBQVk7SUFDMUIsT0FBTyxDQUFDLE1BQVcsRUFBRSxXQUE0QixFQUFFLEVBQUU7UUFDbkQsTUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUM7UUFDckIsT0FBTztZQUNMLEdBQUc7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDO1lBQzVCLENBQUM7WUFDRCxHQUFHLENBQUMsS0FBdUI7Z0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gQm9vbGVhbklucHV0KCk6IGFueSB7XG4gIHJldHVybiAodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICBjb25zdCBrZXkgPSBTeW1ib2woKTtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpc1trZXldIHx8IGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHNldCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgICAgICB0aGlzW2tleV0gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgICAgfSxcbiAgICB9O1xuICB9O1xufVxuIl19