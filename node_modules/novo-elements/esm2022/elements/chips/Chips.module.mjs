// NG2
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorStateMatcher, NovoCommonModule } from 'novo-elements/elements/common';
import { NovoFieldModule } from 'novo-elements/elements/field';
import { NovoIconModule } from 'novo-elements/elements/icon';
import { NovoPickerModule } from 'novo-elements/elements/picker';
import { NovoCheckboxModule } from 'novo-elements/elements/checkbox';
import { NovoChipAvatar, NovoChipElement, NovoChipRemove } from './Chip';
import { NOVO_CHIPS_DEFAULT_OPTIONS } from './ChipDefaults';
import { NovoChipInput } from './ChipInput';
import { NovoChipList } from './ChipList';
import { NovoChipsElement } from './Chips';
import { NovoRowChipElement, NovoRowChipsElement } from './RowChips';
import { AvatarTypePipe } from './pipe/AvatarType.pipe';
import * as i0 from "@angular/core";
export class NovoChipsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoChipsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoChipsModule, declarations: [NovoChipElement,
            NovoChipAvatar,
            NovoChipRemove,
            NovoChipInput,
            NovoChipList,
            NovoChipsElement,
            NovoRowChipElement,
            NovoRowChipsElement,
            AvatarTypePipe], imports: [CommonModule, FormsModule, NovoCheckboxModule, NovoPickerModule, NovoIconModule, NovoFieldModule, NovoCommonModule], exports: [NovoChipElement,
            NovoChipAvatar,
            NovoChipRemove,
            NovoChipInput,
            NovoChipList,
            NovoChipsElement,
            NovoRowChipElement,
            NovoRowChipsElement,
            AvatarTypePipe] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoChipsModule, providers: [
            ErrorStateMatcher,
            {
                provide: NOVO_CHIPS_DEFAULT_OPTIONS,
                useValue: {
                    separatorKeyCodes: ["Enter" /* Key.Enter */],
                },
            },
        ], imports: [CommonModule, FormsModule, NovoCheckboxModule, NovoPickerModule, NovoIconModule, NovoFieldModule, NovoCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoChipsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, NovoCheckboxModule, NovoPickerModule, NovoIconModule, NovoFieldModule, NovoCommonModule],
                    declarations: [
                        NovoChipElement,
                        NovoChipAvatar,
                        NovoChipRemove,
                        NovoChipInput,
                        NovoChipList,
                        NovoChipsElement,
                        NovoRowChipElement,
                        NovoRowChipsElement,
                        AvatarTypePipe
                    ],
                    exports: [
                        NovoChipElement,
                        NovoChipAvatar,
                        NovoChipRemove,
                        NovoChipInput,
                        NovoChipList,
                        NovoChipsElement,
                        NovoRowChipElement,
                        NovoRowChipsElement,
                        AvatarTypePipe
                    ],
                    providers: [
                        ErrorStateMatcher,
                        {
                            provide: NOVO_CHIPS_DEFAULT_OPTIONS,
                            useValue: {
                                separatorKeyCodes: ["Enter" /* Key.Enter */],
                            },
                        },
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hpcHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvY2hpcHMvQ2hpcHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU07QUFDTixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDcEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDekUsT0FBTyxFQUEyQiwwQkFBMEIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUMxQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7QUFtQ3hELE1BQU0sT0FBTyxlQUFlOytHQUFmLGVBQWU7Z0hBQWYsZUFBZSxpQkEvQnhCLGVBQWU7WUFDZixjQUFjO1lBQ2QsY0FBYztZQUNkLGFBQWE7WUFDYixZQUFZO1lBQ1osZ0JBQWdCO1lBQ2hCLGtCQUFrQjtZQUNsQixtQkFBbUI7WUFDbkIsY0FBYyxhQVZOLFlBQVksRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsYUFhMUgsZUFBZTtZQUNmLGNBQWM7WUFDZCxjQUFjO1lBQ2QsYUFBYTtZQUNiLFlBQVk7WUFDWixnQkFBZ0I7WUFDaEIsa0JBQWtCO1lBQ2xCLG1CQUFtQjtZQUNuQixjQUFjO2dIQVlMLGVBQWUsYUFWZjtZQUNULGlCQUFpQjtZQUNqQjtnQkFDRSxPQUFPLEVBQUUsMEJBQTBCO2dCQUNuQyxRQUFRLEVBQUU7b0JBQ1IsaUJBQWlCLEVBQUUseUJBQVc7aUJBQ0o7YUFDN0I7U0FDRixZQS9CUyxZQUFZLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCOzs0RkFpQ2pILGVBQWU7a0JBbEMzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDN0gsWUFBWSxFQUFFO3dCQUNaLGVBQWU7d0JBQ2YsY0FBYzt3QkFDZCxjQUFjO3dCQUNkLGFBQWE7d0JBQ2IsWUFBWTt3QkFDWixnQkFBZ0I7d0JBQ2hCLGtCQUFrQjt3QkFDbEIsbUJBQW1CO3dCQUNuQixjQUFjO3FCQUNmO29CQUNELE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLGNBQWM7d0JBQ2QsY0FBYzt3QkFDZCxhQUFhO3dCQUNiLFlBQVk7d0JBQ1osZ0JBQWdCO3dCQUNoQixrQkFBa0I7d0JBQ2xCLG1CQUFtQjt3QkFDbkIsY0FBYztxQkFDZjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsaUJBQWlCO3dCQUNqQjs0QkFDRSxPQUFPLEVBQUUsMEJBQTBCOzRCQUNuQyxRQUFRLEVBQUU7Z0NBQ1IsaUJBQWlCLEVBQUUseUJBQVc7NkJBQ0o7eUJBQzdCO3FCQUNGO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuLy8gQVBQXG5pbXBvcnQgeyBLZXkgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3V0aWxzJztcbmltcG9ydCB7IEVycm9yU3RhdGVNYXRjaGVyLCBOb3ZvQ29tbW9uTW9kdWxlIH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy9jb21tb24nO1xuaW1wb3J0IHsgTm92b0ZpZWxkTW9kdWxlIH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy9maWVsZCc7XG5pbXBvcnQgeyBOb3ZvSWNvbk1vZHVsZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvZWxlbWVudHMvaWNvbic7XG5pbXBvcnQgeyBOb3ZvUGlja2VyTW9kdWxlIH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy9waWNrZXInO1xuaW1wb3J0IHsgTm92b0NoZWNrYm94TW9kdWxlIH0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cy9jaGVja2JveCc7XG5pbXBvcnQgeyBOb3ZvQ2hpcEF2YXRhciwgTm92b0NoaXBFbGVtZW50LCBOb3ZvQ2hpcFJlbW92ZSB9IGZyb20gJy4vQ2hpcCc7XG5pbXBvcnQgeyBOb3ZvQ2hpcHNEZWZhdWx0T3B0aW9ucywgTk9WT19DSElQU19ERUZBVUxUX09QVElPTlMgfSBmcm9tICcuL0NoaXBEZWZhdWx0cyc7XG5pbXBvcnQgeyBOb3ZvQ2hpcElucHV0IH0gZnJvbSAnLi9DaGlwSW5wdXQnO1xuaW1wb3J0IHsgTm92b0NoaXBMaXN0IH0gZnJvbSAnLi9DaGlwTGlzdCc7XG5pbXBvcnQgeyBOb3ZvQ2hpcHNFbGVtZW50IH0gZnJvbSAnLi9DaGlwcyc7XG5pbXBvcnQgeyBOb3ZvUm93Q2hpcEVsZW1lbnQsIE5vdm9Sb3dDaGlwc0VsZW1lbnQgfSBmcm9tICcuL1Jvd0NoaXBzJztcbmltcG9ydCB7IEF2YXRhclR5cGVQaXBlIH0gZnJvbSAnLi9waXBlL0F2YXRhclR5cGUucGlwZSc7XG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgTm92b0NoZWNrYm94TW9kdWxlLCBOb3ZvUGlja2VyTW9kdWxlLCBOb3ZvSWNvbk1vZHVsZSwgTm92b0ZpZWxkTW9kdWxlLCBOb3ZvQ29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTm92b0NoaXBFbGVtZW50LFxuICAgIE5vdm9DaGlwQXZhdGFyLFxuICAgIE5vdm9DaGlwUmVtb3ZlLFxuICAgIE5vdm9DaGlwSW5wdXQsXG4gICAgTm92b0NoaXBMaXN0LFxuICAgIE5vdm9DaGlwc0VsZW1lbnQsXG4gICAgTm92b1Jvd0NoaXBFbGVtZW50LFxuICAgIE5vdm9Sb3dDaGlwc0VsZW1lbnQsXG4gICAgQXZhdGFyVHlwZVBpcGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE5vdm9DaGlwRWxlbWVudCxcbiAgICBOb3ZvQ2hpcEF2YXRhcixcbiAgICBOb3ZvQ2hpcFJlbW92ZSxcbiAgICBOb3ZvQ2hpcElucHV0LFxuICAgIE5vdm9DaGlwTGlzdCxcbiAgICBOb3ZvQ2hpcHNFbGVtZW50LFxuICAgIE5vdm9Sb3dDaGlwRWxlbWVudCxcbiAgICBOb3ZvUm93Q2hpcHNFbGVtZW50LFxuICAgIEF2YXRhclR5cGVQaXBlXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5PVk9fQ0hJUFNfREVGQVVMVF9PUFRJT05TLFxuICAgICAgdXNlVmFsdWU6IHtcbiAgICAgICAgc2VwYXJhdG9yS2V5Q29kZXM6IFtLZXkuRW50ZXJdLFxuICAgICAgfSBhcyBOb3ZvQ2hpcHNEZWZhdWx0T3B0aW9ucyxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvQ2hpcHNNb2R1bGUge31cbiJdfQ==