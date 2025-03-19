import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccentColorDirective } from './directives/accent.directive';
import { BackgroundColorDirective } from './directives/bg.directive';
import { BorderDirective } from './directives/border.directive';
import { TextColorDirective } from './directives/color.directive';
import { FillColorDirective } from './directives/fill.directive';
import { FlexDirective } from './directives/flex.directive';
import { GapDirective, MarginDirective, PaddingDirective } from './directives/space.directive';
import { SwitchCasesDirective } from './directives/switch-cases.directive';
import { ThemeColorDirective } from './directives/theme.directive';
import { VisibleDirective } from './directives/visible.directive';
import { NovoTemplate } from './novo-template/novo-template.directive';
import { NovoOptionModule } from './option';
import { NovoCaption } from './typography/caption/caption.component';
import { NovoLabel } from './typography/label/label.component';
import { NovoLink } from './typography/link/link.component';
import { NovoText } from './typography/text/text.component';
import { NovoTitle } from './typography/title/title.component';
import * as i0 from "@angular/core";
export class NovoCommonModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCommonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoCommonModule, declarations: [NovoTemplate,
            NovoText,
            NovoTitle,
            NovoCaption,
            NovoLabel,
            NovoLink,
            MarginDirective,
            PaddingDirective,
            BackgroundColorDirective,
            TextColorDirective,
            BorderDirective,
            GapDirective,
            AccentColorDirective,
            FillColorDirective,
            FlexDirective,
            ThemeColorDirective,
            SwitchCasesDirective,
            VisibleDirective], imports: [CommonModule, NovoOptionModule], exports: [NovoTemplate,
            NovoText,
            NovoTitle,
            NovoCaption,
            NovoLabel,
            NovoLink,
            MarginDirective,
            PaddingDirective,
            BackgroundColorDirective,
            TextColorDirective,
            BorderDirective,
            GapDirective,
            AccentColorDirective,
            FillColorDirective,
            FlexDirective,
            ThemeColorDirective,
            SwitchCasesDirective,
            VisibleDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCommonModule, imports: [CommonModule, NovoOptionModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCommonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, NovoOptionModule],
                    exports: [
                        NovoTemplate,
                        NovoText,
                        NovoTitle,
                        NovoCaption,
                        NovoLabel,
                        NovoLink,
                        MarginDirective,
                        PaddingDirective,
                        BackgroundColorDirective,
                        TextColorDirective,
                        BorderDirective,
                        GapDirective,
                        AccentColorDirective,
                        FillColorDirective,
                        FlexDirective,
                        ThemeColorDirective,
                        SwitchCasesDirective,
                        VisibleDirective,
                    ],
                    declarations: [
                        NovoTemplate,
                        NovoText,
                        NovoTitle,
                        NovoCaption,
                        NovoLabel,
                        NovoLink,
                        MarginDirective,
                        PaddingDirective,
                        BackgroundColorDirective,
                        TextColorDirective,
                        BorderDirective,
                        GapDirective,
                        AccentColorDirective,
                        FillColorDirective,
                        FlexDirective,
                        ThemeColorDirective,
                        SwitchCasesDirective,
                        VisibleDirective,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2NvbW1vbi9jb21tb24ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNoRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMvRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDL0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQzVELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUM1RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7O0FBNkMvRCxNQUFNLE9BQU8sZ0JBQWdCOytHQUFoQixnQkFBZ0I7Z0hBQWhCLGdCQUFnQixpQkFwQnpCLFlBQVk7WUFDWixRQUFRO1lBQ1IsU0FBUztZQUNULFdBQVc7WUFDWCxTQUFTO1lBQ1QsUUFBUTtZQUNSLGVBQWU7WUFDZixnQkFBZ0I7WUFDaEIsd0JBQXdCO1lBQ3hCLGtCQUFrQjtZQUNsQixlQUFlO1lBQ2YsWUFBWTtZQUNaLG9CQUFvQjtZQUNwQixrQkFBa0I7WUFDbEIsYUFBYTtZQUNiLG1CQUFtQjtZQUNuQixvQkFBb0I7WUFDcEIsZ0JBQWdCLGFBdkNSLFlBQVksRUFBRSxnQkFBZ0IsYUFFdEMsWUFBWTtZQUNaLFFBQVE7WUFDUixTQUFTO1lBQ1QsV0FBVztZQUNYLFNBQVM7WUFDVCxRQUFRO1lBQ1IsZUFBZTtZQUNmLGdCQUFnQjtZQUNoQix3QkFBd0I7WUFDeEIsa0JBQWtCO1lBQ2xCLGVBQWU7WUFDZixZQUFZO1lBQ1osb0JBQW9CO1lBQ3BCLGtCQUFrQjtZQUNsQixhQUFhO1lBQ2IsbUJBQW1CO1lBQ25CLG9CQUFvQjtZQUNwQixnQkFBZ0I7Z0hBdUJQLGdCQUFnQixZQTFDakIsWUFBWSxFQUFFLGdCQUFnQjs7NEZBMEM3QixnQkFBZ0I7a0JBM0M1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsQ0FBQztvQkFDekMsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osUUFBUTt3QkFDUixTQUFTO3dCQUNULFdBQVc7d0JBQ1gsU0FBUzt3QkFDVCxRQUFRO3dCQUNSLGVBQWU7d0JBQ2YsZ0JBQWdCO3dCQUNoQix3QkFBd0I7d0JBQ3hCLGtCQUFrQjt3QkFDbEIsZUFBZTt3QkFDZixZQUFZO3dCQUNaLG9CQUFvQjt3QkFDcEIsa0JBQWtCO3dCQUNsQixhQUFhO3dCQUNiLG1CQUFtQjt3QkFDbkIsb0JBQW9CO3dCQUNwQixnQkFBZ0I7cUJBQ2pCO29CQUNELFlBQVksRUFBRTt3QkFDWixZQUFZO3dCQUNaLFFBQVE7d0JBQ1IsU0FBUzt3QkFDVCxXQUFXO3dCQUNYLFNBQVM7d0JBQ1QsUUFBUTt3QkFDUixlQUFlO3dCQUNmLGdCQUFnQjt3QkFDaEIsd0JBQXdCO3dCQUN4QixrQkFBa0I7d0JBQ2xCLGVBQWU7d0JBQ2YsWUFBWTt3QkFDWixvQkFBb0I7d0JBQ3BCLGtCQUFrQjt3QkFDbEIsYUFBYTt3QkFDYixtQkFBbUI7d0JBQ25CLG9CQUFvQjt3QkFDcEIsZ0JBQWdCO3FCQUNqQjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWNjZW50Q29sb3JEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvYWNjZW50LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBCYWNrZ3JvdW5kQ29sb3JEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvYmcuZGlyZWN0aXZlJztcbmltcG9ydCB7IEJvcmRlckRpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9ib3JkZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IFRleHRDb2xvckRpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9jb2xvci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRmlsbENvbG9yRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2ZpbGwuZGlyZWN0aXZlJztcbmltcG9ydCB7IEZsZXhEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZmxleC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgR2FwRGlyZWN0aXZlLCBNYXJnaW5EaXJlY3RpdmUsIFBhZGRpbmdEaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvc3BhY2UuZGlyZWN0aXZlJztcbmltcG9ydCB7IFN3aXRjaENhc2VzRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3N3aXRjaC1jYXNlcy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgVGhlbWVDb2xvckRpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy90aGVtZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgVmlzaWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy92aXNpYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOb3ZvVGVtcGxhdGUgfSBmcm9tICcuL25vdm8tdGVtcGxhdGUvbm92by10ZW1wbGF0ZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTm92b09wdGlvbk1vZHVsZSB9IGZyb20gJy4vb3B0aW9uJztcbmltcG9ydCB7IE5vdm9DYXB0aW9uIH0gZnJvbSAnLi90eXBvZ3JhcGh5L2NhcHRpb24vY2FwdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgTm92b0xhYmVsIH0gZnJvbSAnLi90eXBvZ3JhcGh5L2xhYmVsL2xhYmVsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOb3ZvTGluayB9IGZyb20gJy4vdHlwb2dyYXBoeS9saW5rL2xpbmsuY29tcG9uZW50JztcbmltcG9ydCB7IE5vdm9UZXh0IH0gZnJvbSAnLi90eXBvZ3JhcGh5L3RleHQvdGV4dC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTm92b1RpdGxlIH0gZnJvbSAnLi90eXBvZ3JhcGh5L3RpdGxlL3RpdGxlLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE5vdm9PcHRpb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTm92b1RlbXBsYXRlLFxuICAgIE5vdm9UZXh0LFxuICAgIE5vdm9UaXRsZSxcbiAgICBOb3ZvQ2FwdGlvbixcbiAgICBOb3ZvTGFiZWwsXG4gICAgTm92b0xpbmssXG4gICAgTWFyZ2luRGlyZWN0aXZlLFxuICAgIFBhZGRpbmdEaXJlY3RpdmUsXG4gICAgQmFja2dyb3VuZENvbG9yRGlyZWN0aXZlLFxuICAgIFRleHRDb2xvckRpcmVjdGl2ZSxcbiAgICBCb3JkZXJEaXJlY3RpdmUsXG4gICAgR2FwRGlyZWN0aXZlLFxuICAgIEFjY2VudENvbG9yRGlyZWN0aXZlLFxuICAgIEZpbGxDb2xvckRpcmVjdGl2ZSxcbiAgICBGbGV4RGlyZWN0aXZlLFxuICAgIFRoZW1lQ29sb3JEaXJlY3RpdmUsXG4gICAgU3dpdGNoQ2FzZXNEaXJlY3RpdmUsXG4gICAgVmlzaWJsZURpcmVjdGl2ZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTm92b1RlbXBsYXRlLFxuICAgIE5vdm9UZXh0LFxuICAgIE5vdm9UaXRsZSxcbiAgICBOb3ZvQ2FwdGlvbixcbiAgICBOb3ZvTGFiZWwsXG4gICAgTm92b0xpbmssXG4gICAgTWFyZ2luRGlyZWN0aXZlLFxuICAgIFBhZGRpbmdEaXJlY3RpdmUsXG4gICAgQmFja2dyb3VuZENvbG9yRGlyZWN0aXZlLFxuICAgIFRleHRDb2xvckRpcmVjdGl2ZSxcbiAgICBCb3JkZXJEaXJlY3RpdmUsXG4gICAgR2FwRGlyZWN0aXZlLFxuICAgIEFjY2VudENvbG9yRGlyZWN0aXZlLFxuICAgIEZpbGxDb2xvckRpcmVjdGl2ZSxcbiAgICBGbGV4RGlyZWN0aXZlLFxuICAgIFRoZW1lQ29sb3JEaXJlY3RpdmUsXG4gICAgU3dpdGNoQ2FzZXNEaXJlY3RpdmUsXG4gICAgVmlzaWJsZURpcmVjdGl2ZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTm92b0NvbW1vbk1vZHVsZSB7fVxuIl19