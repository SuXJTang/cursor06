import { AddressControl, CheckboxControl, CheckListControl, DateTimeControl, EditorControl, FileControl, NativeSelectControl, PickerControl, QuickNoteControl, RadioControl, ReadOnlyControl, SelectControl, SwitchControl, TablePickerControl, TextAreaControl, TextBoxControl, TilesControl, TimeControl, } from './index';
export class ControlFactory {
    static create(type, config) {
        switch (type) {
            case 'AddressControl':
                return new AddressControl(config);
            case 'CheckboxControl':
                return new CheckboxControl(config);
            case 'CheckListControl':
                return new CheckListControl(config);
            case 'DateTimeControl':
                return new DateTimeControl(config);
            case 'EditorControl':
                return new EditorControl(config);
            case 'FileControl':
                return new FileControl(config);
            case 'NativeSelectControl':
                return new NativeSelectControl(config);
            case 'PickerControl':
                return new PickerControl(config);
            case 'TablePickerControl':
                return new TablePickerControl(config);
            case 'QuickNoteControl':
                return new QuickNoteControl(config);
            case 'RadioControl':
                return new RadioControl(config);
            case 'ReadOnlyControl':
                return new ReadOnlyControl(config);
            case 'TextAreaControl':
                return new TextAreaControl(config);
            case 'TextBoxControl':
                return new TextBoxControl(config);
            case 'SelectControl':
                return new SelectControl(config);
            case 'SwitchControl':
                return new SwitchControl(config);
            case 'TilesControl':
                return new TilesControl(config);
            case 'TimeControl':
                return new TimeControl(config);
            default:
                console.warn('[ControlFactory] - unable to find control for type. Make sure to set "editorType" and "editorConfig" on your column', type);
                return null;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbEZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9lbGVtZW50cy9mb3JtL2NvbnRyb2xzL0NvbnRyb2xGYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFDTCxjQUFjLEVBQ2QsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixlQUFlLEVBQ2YsYUFBYSxFQUNiLFdBQVcsRUFDWCxtQkFBbUIsRUFDbkIsYUFBYSxFQUNiLGdCQUFnQixFQUNoQixZQUFZLEVBQ1osZUFBZSxFQUNmLGFBQWEsRUFDYixhQUFhLEVBQ2Isa0JBQWtCLEVBQ2xCLGVBQWUsRUFDZixjQUFjLEVBQ2QsWUFBWSxFQUNaLFdBQVcsR0FDWixNQUFNLFNBQVMsQ0FBQztBQUVqQixNQUFNLE9BQU8sY0FBYztJQUN6QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQVksRUFBRSxNQUFtQjtRQUM3QyxRQUFRLElBQUksRUFBRSxDQUFDO1lBQ2IsS0FBSyxnQkFBZ0I7Z0JBQ25CLE9BQU8sSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsS0FBSyxpQkFBaUI7Z0JBQ3BCLE9BQU8sSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsS0FBSyxrQkFBa0I7Z0JBQ3JCLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxLQUFLLGlCQUFpQjtnQkFDcEIsT0FBTyxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyQyxLQUFLLGVBQWU7Z0JBQ2xCLE9BQU8sSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsS0FBSyxhQUFhO2dCQUNoQixPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDLEtBQUsscUJBQXFCO2dCQUN4QixPQUFPLElBQUksbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekMsS0FBSyxlQUFlO2dCQUNsQixPQUFPLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLEtBQUssb0JBQW9CO2dCQUN2QixPQUFPLElBQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsS0FBSyxrQkFBa0I7Z0JBQ3JCLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxLQUFLLGNBQWM7Z0JBQ2pCLE9BQU8sSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEMsS0FBSyxpQkFBaUI7Z0JBQ3BCLE9BQU8sSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsS0FBSyxpQkFBaUI7Z0JBQ3BCLE9BQU8sSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckMsS0FBSyxnQkFBZ0I7Z0JBQ25CLE9BQU8sSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsS0FBSyxlQUFlO2dCQUNsQixPQUFPLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLEtBQUssZUFBZTtnQkFDbEIsT0FBTyxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQyxLQUFLLGNBQWM7Z0JBQ2pCLE9BQU8sSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEMsS0FBSyxhQUFhO2dCQUNoQixPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pDO2dCQUNFLE9BQU8sQ0FBQyxJQUFJLENBQ1YscUhBQXFILEVBQ3JILElBQUksQ0FDTCxDQUFDO2dCQUNGLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlQ29udHJvbCB9IGZyb20gJy4vQmFzZUNvbnRyb2wnO1xuaW1wb3J0IHtcbiAgQWRkcmVzc0NvbnRyb2wsXG4gIENoZWNrYm94Q29udHJvbCxcbiAgQ2hlY2tMaXN0Q29udHJvbCxcbiAgRGF0ZVRpbWVDb250cm9sLFxuICBFZGl0b3JDb250cm9sLFxuICBGaWxlQ29udHJvbCxcbiAgTmF0aXZlU2VsZWN0Q29udHJvbCxcbiAgUGlja2VyQ29udHJvbCxcbiAgUXVpY2tOb3RlQ29udHJvbCxcbiAgUmFkaW9Db250cm9sLFxuICBSZWFkT25seUNvbnRyb2wsXG4gIFNlbGVjdENvbnRyb2wsXG4gIFN3aXRjaENvbnRyb2wsXG4gIFRhYmxlUGlja2VyQ29udHJvbCxcbiAgVGV4dEFyZWFDb250cm9sLFxuICBUZXh0Qm94Q29udHJvbCxcbiAgVGlsZXNDb250cm9sLFxuICBUaW1lQ29udHJvbCxcbn0gZnJvbSAnLi9pbmRleCc7XG5cbmV4cG9ydCBjbGFzcyBDb250cm9sRmFjdG9yeSB7XG4gIHN0YXRpYyBjcmVhdGUodHlwZTogc3RyaW5nLCBjb25maWc6IEJhc2VDb250cm9sKTogQmFzZUNvbnRyb2wge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnQWRkcmVzc0NvbnRyb2wnOlxuICAgICAgICByZXR1cm4gbmV3IEFkZHJlc3NDb250cm9sKGNvbmZpZyk7XG4gICAgICBjYXNlICdDaGVja2JveENvbnRyb2wnOlxuICAgICAgICByZXR1cm4gbmV3IENoZWNrYm94Q29udHJvbChjb25maWcpO1xuICAgICAgY2FzZSAnQ2hlY2tMaXN0Q29udHJvbCc6XG4gICAgICAgIHJldHVybiBuZXcgQ2hlY2tMaXN0Q29udHJvbChjb25maWcpO1xuICAgICAgY2FzZSAnRGF0ZVRpbWVDb250cm9sJzpcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlVGltZUNvbnRyb2woY29uZmlnKTtcbiAgICAgIGNhc2UgJ0VkaXRvckNvbnRyb2wnOlxuICAgICAgICByZXR1cm4gbmV3IEVkaXRvckNvbnRyb2woY29uZmlnKTtcbiAgICAgIGNhc2UgJ0ZpbGVDb250cm9sJzpcbiAgICAgICAgcmV0dXJuIG5ldyBGaWxlQ29udHJvbChjb25maWcpO1xuICAgICAgY2FzZSAnTmF0aXZlU2VsZWN0Q29udHJvbCc6XG4gICAgICAgIHJldHVybiBuZXcgTmF0aXZlU2VsZWN0Q29udHJvbChjb25maWcpO1xuICAgICAgY2FzZSAnUGlja2VyQ29udHJvbCc6XG4gICAgICAgIHJldHVybiBuZXcgUGlja2VyQ29udHJvbChjb25maWcpO1xuICAgICAgY2FzZSAnVGFibGVQaWNrZXJDb250cm9sJzpcbiAgICAgICAgcmV0dXJuIG5ldyBUYWJsZVBpY2tlckNvbnRyb2woY29uZmlnKTtcbiAgICAgIGNhc2UgJ1F1aWNrTm90ZUNvbnRyb2wnOlxuICAgICAgICByZXR1cm4gbmV3IFF1aWNrTm90ZUNvbnRyb2woY29uZmlnKTtcbiAgICAgIGNhc2UgJ1JhZGlvQ29udHJvbCc6XG4gICAgICAgIHJldHVybiBuZXcgUmFkaW9Db250cm9sKGNvbmZpZyk7XG4gICAgICBjYXNlICdSZWFkT25seUNvbnRyb2wnOlxuICAgICAgICByZXR1cm4gbmV3IFJlYWRPbmx5Q29udHJvbChjb25maWcpO1xuICAgICAgY2FzZSAnVGV4dEFyZWFDb250cm9sJzpcbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0QXJlYUNvbnRyb2woY29uZmlnKTtcbiAgICAgIGNhc2UgJ1RleHRCb3hDb250cm9sJzpcbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0Qm94Q29udHJvbChjb25maWcpO1xuICAgICAgY2FzZSAnU2VsZWN0Q29udHJvbCc6XG4gICAgICAgIHJldHVybiBuZXcgU2VsZWN0Q29udHJvbChjb25maWcpO1xuICAgICAgY2FzZSAnU3dpdGNoQ29udHJvbCc6XG4gICAgICAgIHJldHVybiBuZXcgU3dpdGNoQ29udHJvbChjb25maWcpO1xuICAgICAgY2FzZSAnVGlsZXNDb250cm9sJzpcbiAgICAgICAgcmV0dXJuIG5ldyBUaWxlc0NvbnRyb2woY29uZmlnKTtcbiAgICAgIGNhc2UgJ1RpbWVDb250cm9sJzpcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lQ29udHJvbChjb25maWcpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdbQ29udHJvbEZhY3RvcnldIC0gdW5hYmxlIHRvIGZpbmQgY29udHJvbCBmb3IgdHlwZS4gTWFrZSBzdXJlIHRvIHNldCBcImVkaXRvclR5cGVcIiBhbmQgXCJlZGl0b3JDb25maWdcIiBvbiB5b3VyIGNvbHVtbicsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59XG4iXX0=