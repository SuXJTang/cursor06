import { NgModule } from '@angular/core';
import { FieldInteractionApi, GooglePlacesService, MENU_OPTIONS, NovoAsideService, NovoModalService, NovoToastService, } from 'novo-elements/elements';
import { BrowserGlobalRef, ComponentUtils, DateFormatService, GlobalRef, LocalStorageService, NovoTemplateService, OptionsService, } from 'novo-elements/services';
import * as i0 from "@angular/core";
const NOVO_ELEMENTS_PROVIDERS = [
    { provide: NovoAsideService, useClass: NovoAsideService },
    { provide: NovoModalService, useClass: NovoModalService },
    { provide: GooglePlacesService, useClass: GooglePlacesService },
    { provide: NovoToastService, useClass: NovoToastService },
    { provide: ComponentUtils, useClass: ComponentUtils },
    { provide: GlobalRef, useClass: BrowserGlobalRef },
    { provide: LocalStorageService, useClass: LocalStorageService },
    { provide: OptionsService, useClass: OptionsService },
    FieldInteractionApi,
    DateFormatService,
    NovoTemplateService,
];
export class NovoElementProviders {
    static forRoot(options) {
        return {
            ngModule: NovoElementProviders,
            providers: [
                ...NOVO_ELEMENTS_PROVIDERS,
                {
                    provide: MENU_OPTIONS,
                    useValue: options && options.menu,
                },
            ],
        };
    }
    static forChild() {
        return {
            ngModule: NovoElementProviders,
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoElementProviders, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.12", ngImport: i0, type: NovoElementProviders }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoElementProviders }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoElementProviders, decorators: [{
            type: NgModule,
            args: [{
                    imports: [],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm92by1lbGVtZW50cy5wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9ub3ZvLWVsZW1lbnRzLnByb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLG1CQUFtQixFQUNMLFlBQVksRUFDMUIsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixnQkFBZ0IsR0FDakIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULG1CQUFtQixFQUNuQixtQkFBbUIsRUFDbkIsY0FBYyxHQUNmLE1BQU0sd0JBQXdCLENBQUM7O0FBRWhDLE1BQU0sdUJBQXVCLEdBQUc7SUFDOUIsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFO0lBQ3pELEVBQUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRTtJQUN6RCxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUU7SUFDL0QsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFO0lBQ3pELEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFO0lBQ3JELEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUU7SUFDbEQsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFO0lBQy9ELEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFO0lBQ3JELG1CQUFtQjtJQUNuQixpQkFBaUI7SUFDakIsbUJBQW1CO0NBQ3BCLENBQUM7QUFLRixNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZ0M7UUFDN0MsT0FBTztZQUNMLFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsU0FBUyxFQUFFO2dCQUNULEdBQUcsdUJBQXVCO2dCQUMxQjtvQkFDRSxPQUFPLEVBQUUsWUFBWTtvQkFDckIsUUFBUSxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSTtpQkFDbEM7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVE7UUFDYixPQUFPO1lBQ0wsUUFBUSxFQUFFLG9CQUFvQjtTQUMvQixDQUFDO0lBQ0osQ0FBQzsrR0FsQlUsb0JBQW9CO2dIQUFwQixvQkFBb0I7Z0hBQXBCLG9CQUFvQjs7NEZBQXBCLG9CQUFvQjtrQkFIaEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsRUFBRTtpQkFDWiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBGaWVsZEludGVyYWN0aW9uQXBpLFxuICBHb29nbGVQbGFjZXNTZXJ2aWNlLFxuICBJTWVudU9wdGlvbnMsIE1FTlVfT1BUSU9OUyxcbiAgTm92b0FzaWRlU2VydmljZSxcbiAgTm92b01vZGFsU2VydmljZSxcbiAgTm92b1RvYXN0U2VydmljZSxcbn0gZnJvbSAnbm92by1lbGVtZW50cy9lbGVtZW50cyc7XG5pbXBvcnQge1xuICBCcm93c2VyR2xvYmFsUmVmLFxuICBDb21wb25lbnRVdGlscyxcbiAgRGF0ZUZvcm1hdFNlcnZpY2UsXG4gIEdsb2JhbFJlZixcbiAgTG9jYWxTdG9yYWdlU2VydmljZSxcbiAgTm92b1RlbXBsYXRlU2VydmljZSxcbiAgT3B0aW9uc1NlcnZpY2UsXG59IGZyb20gJ25vdm8tZWxlbWVudHMvc2VydmljZXMnO1xuXG5jb25zdCBOT1ZPX0VMRU1FTlRTX1BST1ZJREVSUyA9IFtcbiAgeyBwcm92aWRlOiBOb3ZvQXNpZGVTZXJ2aWNlLCB1c2VDbGFzczogTm92b0FzaWRlU2VydmljZSB9LFxuICB7IHByb3ZpZGU6IE5vdm9Nb2RhbFNlcnZpY2UsIHVzZUNsYXNzOiBOb3ZvTW9kYWxTZXJ2aWNlIH0sXG4gIHsgcHJvdmlkZTogR29vZ2xlUGxhY2VzU2VydmljZSwgdXNlQ2xhc3M6IEdvb2dsZVBsYWNlc1NlcnZpY2UgfSxcbiAgeyBwcm92aWRlOiBOb3ZvVG9hc3RTZXJ2aWNlLCB1c2VDbGFzczogTm92b1RvYXN0U2VydmljZSB9LFxuICB7IHByb3ZpZGU6IENvbXBvbmVudFV0aWxzLCB1c2VDbGFzczogQ29tcG9uZW50VXRpbHMgfSxcbiAgeyBwcm92aWRlOiBHbG9iYWxSZWYsIHVzZUNsYXNzOiBCcm93c2VyR2xvYmFsUmVmIH0sXG4gIHsgcHJvdmlkZTogTG9jYWxTdG9yYWdlU2VydmljZSwgdXNlQ2xhc3M6IExvY2FsU3RvcmFnZVNlcnZpY2UgfSxcbiAgeyBwcm92aWRlOiBPcHRpb25zU2VydmljZSwgdXNlQ2xhc3M6IE9wdGlvbnNTZXJ2aWNlIH0sXG4gIEZpZWxkSW50ZXJhY3Rpb25BcGksXG4gIERhdGVGb3JtYXRTZXJ2aWNlLFxuICBOb3ZvVGVtcGxhdGVTZXJ2aWNlLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW10sXG59KVxuZXhwb3J0IGNsYXNzIE5vdm9FbGVtZW50UHJvdmlkZXJzIHtcbiAgc3RhdGljIGZvclJvb3Qob3B0aW9ucz86IHsgbWVudTogSU1lbnVPcHRpb25zIH0pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPE5vdm9FbGVtZW50UHJvdmlkZXJzPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBOb3ZvRWxlbWVudFByb3ZpZGVycyxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICAuLi5OT1ZPX0VMRU1FTlRTX1BST1ZJREVSUyxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE1FTlVfT1BUSU9OUyxcbiAgICAgICAgICB1c2VWYWx1ZTogb3B0aW9ucyAmJiBvcHRpb25zLm1lbnUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZm9yQ2hpbGQoKTogTW9kdWxlV2l0aFByb3ZpZGVyczxOb3ZvRWxlbWVudFByb3ZpZGVycz4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTm92b0VsZW1lbnRQcm92aWRlcnMsXG4gICAgfTtcbiAgfVxufVxuIl19