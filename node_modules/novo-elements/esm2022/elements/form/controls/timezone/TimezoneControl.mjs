// APP
import { findTimeZone, getZonedTime, listTimeZones } from 'timezone-support';
import { formatZonedTime } from 'novo-elements/utils';
import { BaseControl } from '../BaseControl';
export class TimezoneControl extends BaseControl {
    constructor(config) {
        super('TimezoneControl', config);
        this.controlType = 'timezone';
        this.options = [];
        this.buildTimezones = (compareDate) => {
            const timezones = listTimeZones()
                .map((zone) => {
                const timezone = findTimeZone(zone);
                const zonedTime = getZonedTime(compareDate, timezone);
                const formatted = formatZonedTime(zonedTime, `z - [${zone}] ([GMT] Z)`).replace('_', ' ');
                const option = {
                    value: zone,
                    label: formatted,
                    offset: zonedTime.zone.offset,
                };
                // if (this.props.mapLabels) {
                //   option.label = this.props.mapLabels(option);
                // }
                return option;
            })
                // Formats 'noisy' timezones without a letter acronym.
                .map((option) => {
                const rgx = /(^(\+|-)\d+\s- )/;
                const matches = option.label.match(rgx);
                if (matches) {
                    const prefix = matches[0];
                    option.label = option.label.split(prefix)[1];
                }
                return option;
            })
                // Sorts W -> E, prioritizes america. could be more nuanced based on system tz but simple for now
                .sort((a, b) => {
                const offsetDelta = b.offset - a.offset;
                if (offsetDelta !== 0) {
                    return offsetDelta;
                }
                if (a.label < b.label) {
                    return -1;
                }
                if (a.label > b.label) {
                    return 1;
                }
                return 0;
            });
            return timezones;
        };
        this.options = this.buildTimezones(new Date());
        this.placeholder = config.placeholder || '';
        // current timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.value = tz;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltZXpvbmVDb250cm9sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvZm9ybS9jb250cm9scy90aW1lem9uZS9UaW1lem9uZUNvbnRyb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTTtBQUNOLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzdFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsV0FBVyxFQUFxQixNQUFNLGdCQUFnQixDQUFDO0FBRWhFLE1BQU0sT0FBTyxlQUFnQixTQUFRLFdBQVc7SUFJOUMsWUFBWSxNQUF5QjtRQUNuQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFKbkMsZ0JBQVcsR0FBRyxVQUFVLENBQUM7UUFDekIsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQVdMLG1CQUFjLEdBQUcsQ0FBQyxXQUFpQixFQUFFLEVBQUU7WUFDN0MsTUFBTSxTQUFTLEdBQUcsYUFBYSxFQUFFO2lCQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDWixNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3RELE1BQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxJQUFJLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRTFGLE1BQU0sTUFBTSxHQUFHO29CQUNiLEtBQUssRUFBRSxJQUFJO29CQUNYLEtBQUssRUFBRSxTQUFTO29CQUNoQixNQUFNLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNO2lCQUM5QixDQUFDO2dCQUNGLDhCQUE4QjtnQkFDOUIsaURBQWlEO2dCQUNqRCxJQUFJO2dCQUNKLE9BQU8sTUFBTSxDQUFDO1lBQ2hCLENBQUMsQ0FBQztnQkFDRixzREFBc0Q7aUJBQ3JELEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNkLE1BQU0sR0FBRyxHQUFHLGtCQUFrQixDQUFDO2dCQUMvQixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDWixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLENBQUM7Z0JBQ0QsT0FBTyxNQUFNLENBQUM7WUFDaEIsQ0FBQyxDQUFDO2dCQUNGLGlHQUFpRztpQkFDaEcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNiLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFDeEMsSUFBSSxXQUFXLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBQ3RCLE9BQU8sV0FBVyxDQUFDO2dCQUNyQixDQUFDO2dCQUNELElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3RCLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1osQ0FBQztnQkFDRCxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUN0QixPQUFPLENBQUMsQ0FBQztnQkFDWCxDQUFDO2dCQUNELE9BQU8sQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDTCxPQUFPLFNBQVMsQ0FBQztRQUNuQixDQUFDLENBQUM7UUFqREEsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBQzVDLG1CQUFtQjtRQUNuQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQzVELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLENBQUM7Q0E2Q0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBUFBcbmltcG9ydCB7IGZpbmRUaW1lWm9uZSwgZ2V0Wm9uZWRUaW1lLCBsaXN0VGltZVpvbmVzIH0gZnJvbSAndGltZXpvbmUtc3VwcG9ydCc7XG5pbXBvcnQgeyBmb3JtYXRab25lZFRpbWUgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3V0aWxzJztcbmltcG9ydCB7IEJhc2VDb250cm9sLCBOb3ZvQ29udHJvbENvbmZpZyB9IGZyb20gJy4uL0Jhc2VDb250cm9sJztcblxuZXhwb3J0IGNsYXNzIFRpbWV6b25lQ29udHJvbCBleHRlbmRzIEJhc2VDb250cm9sIHtcbiAgY29udHJvbFR5cGUgPSAndGltZXpvbmUnO1xuICBvcHRpb25zID0gW107XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBOb3ZvQ29udHJvbENvbmZpZykge1xuICAgIHN1cGVyKCdUaW1lem9uZUNvbnRyb2wnLCBjb25maWcpO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuYnVpbGRUaW1lem9uZXMobmV3IERhdGUoKSk7XG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IGNvbmZpZy5wbGFjZWhvbGRlciB8fCAnJztcbiAgICAvLyBjdXJyZW50IHRpbWV6b25lXG4gICAgY29uc3QgdHogPSBJbnRsLkRhdGVUaW1lRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkudGltZVpvbmU7XG4gICAgdGhpcy52YWx1ZSA9IHR6O1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZFRpbWV6b25lcyA9IChjb21wYXJlRGF0ZTogRGF0ZSkgPT4ge1xuICAgIGNvbnN0IHRpbWV6b25lcyA9IGxpc3RUaW1lWm9uZXMoKVxuICAgICAgLm1hcCgoem9uZSkgPT4ge1xuICAgICAgICBjb25zdCB0aW1lem9uZSA9IGZpbmRUaW1lWm9uZSh6b25lKTtcbiAgICAgICAgY29uc3Qgem9uZWRUaW1lID0gZ2V0Wm9uZWRUaW1lKGNvbXBhcmVEYXRlLCB0aW1lem9uZSk7XG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IGZvcm1hdFpvbmVkVGltZSh6b25lZFRpbWUsIGB6IC0gWyR7em9uZX1dIChbR01UXSBaKWApLnJlcGxhY2UoJ18nLCAnICcpO1xuXG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHtcbiAgICAgICAgICB2YWx1ZTogem9uZSxcbiAgICAgICAgICBsYWJlbDogZm9ybWF0dGVkLFxuICAgICAgICAgIG9mZnNldDogem9uZWRUaW1lLnpvbmUub2Zmc2V0LFxuICAgICAgICB9O1xuICAgICAgICAvLyBpZiAodGhpcy5wcm9wcy5tYXBMYWJlbHMpIHtcbiAgICAgICAgLy8gICBvcHRpb24ubGFiZWwgPSB0aGlzLnByb3BzLm1hcExhYmVscyhvcHRpb24pO1xuICAgICAgICAvLyB9XG4gICAgICAgIHJldHVybiBvcHRpb247XG4gICAgICB9KVxuICAgICAgLy8gRm9ybWF0cyAnbm9pc3knIHRpbWV6b25lcyB3aXRob3V0IGEgbGV0dGVyIGFjcm9ueW0uXG4gICAgICAubWFwKChvcHRpb24pID0+IHtcbiAgICAgICAgY29uc3Qgcmd4ID0gLyheKFxcK3wtKVxcZCtcXHMtICkvO1xuICAgICAgICBjb25zdCBtYXRjaGVzID0gb3B0aW9uLmxhYmVsLm1hdGNoKHJneCk7XG4gICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgY29uc3QgcHJlZml4ID0gbWF0Y2hlc1swXTtcbiAgICAgICAgICBvcHRpb24ubGFiZWwgPSBvcHRpb24ubGFiZWwuc3BsaXQocHJlZml4KVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9uO1xuICAgICAgfSlcbiAgICAgIC8vIFNvcnRzIFcgLT4gRSwgcHJpb3JpdGl6ZXMgYW1lcmljYS4gY291bGQgYmUgbW9yZSBudWFuY2VkIGJhc2VkIG9uIHN5c3RlbSB0eiBidXQgc2ltcGxlIGZvciBub3dcbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IG9mZnNldERlbHRhID0gYi5vZmZzZXQgLSBhLm9mZnNldDtcbiAgICAgICAgaWYgKG9mZnNldERlbHRhICE9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG9mZnNldERlbHRhO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhLmxhYmVsIDwgYi5sYWJlbCkge1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYS5sYWJlbCA+IGIubGFiZWwpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0pO1xuICAgIHJldHVybiB0aW1lem9uZXM7XG4gIH07XG59XG4iXX0=