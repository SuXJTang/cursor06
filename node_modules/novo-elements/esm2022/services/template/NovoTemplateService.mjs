// NG2
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class NovoTemplateService {
    constructor() {
        this.templates = {
            default: {},
            custom: {},
        };
    }
    getAll() {
        const templates = {};
        const customTemplateTypes = Object.keys(this.templates.custom);
        const defaultTemplateTypes = Object.keys(this.templates.default);
        defaultTemplateTypes.forEach((type) => {
            templates[type] = this.templates.default[type];
        });
        customTemplateTypes.forEach((type) => {
            templates[type] = this.templates.custom[type];
        });
        return templates;
    }
    addDefault(key, template) {
        this.templates.default[key] = template;
    }
    addCustom(key, template) {
        this.templates.custom[key] = template;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoTemplateService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoTemplateService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoTemplateService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm92b1RlbXBsYXRlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL3NlcnZpY2VzL3RlbXBsYXRlL05vdm9UZW1wbGF0ZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTTtBQUNOLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRzNDLE1BQU0sT0FBTyxtQkFBbUI7SUFLOUI7UUFKQSxjQUFTLEdBQVE7WUFDZixPQUFPLEVBQUUsRUFBRTtZQUNYLE1BQU0sRUFBRSxFQUFFO1NBQ1gsQ0FBQztJQUNhLENBQUM7SUFFaEIsTUFBTTtRQUNKLE1BQU0sU0FBUyxHQUFRLEVBQUUsQ0FBQztRQUMxQixNQUFNLG1CQUFtQixHQUFhLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RSxNQUFNLG9CQUFvQixHQUFhLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRSxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUM1QyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7UUFDSCxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUMzQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsVUFBVSxDQUFDLEdBQVcsRUFBRSxRQUFhO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUN6QyxDQUFDO0lBRUQsU0FBUyxDQUFDLEdBQVcsRUFBRSxRQUFhO1FBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUN4QyxDQUFDOytHQTFCVSxtQkFBbUI7bUhBQW5CLG1CQUFtQjs7NEZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8vIE5HMlxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTm92b1RlbXBsYXRlU2VydmljZSB7XG4gIHRlbXBsYXRlczogYW55ID0ge1xuICAgIGRlZmF1bHQ6IHt9LFxuICAgIGN1c3RvbToge30sXG4gIH07XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBnZXRBbGwoKTogYW55IHtcbiAgICBjb25zdCB0ZW1wbGF0ZXM6IGFueSA9IHt9O1xuICAgIGNvbnN0IGN1c3RvbVRlbXBsYXRlVHlwZXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXModGhpcy50ZW1wbGF0ZXMuY3VzdG9tKTtcbiAgICBjb25zdCBkZWZhdWx0VGVtcGxhdGVUeXBlczogc3RyaW5nW10gPSBPYmplY3Qua2V5cyh0aGlzLnRlbXBsYXRlcy5kZWZhdWx0KTtcbiAgICBkZWZhdWx0VGVtcGxhdGVUeXBlcy5mb3JFYWNoKCh0eXBlOiBzdHJpbmcpID0+IHtcbiAgICAgIHRlbXBsYXRlc1t0eXBlXSA9IHRoaXMudGVtcGxhdGVzLmRlZmF1bHRbdHlwZV07XG4gICAgfSk7XG4gICAgY3VzdG9tVGVtcGxhdGVUeXBlcy5mb3JFYWNoKCh0eXBlOiBzdHJpbmcpID0+IHtcbiAgICAgIHRlbXBsYXRlc1t0eXBlXSA9IHRoaXMudGVtcGxhdGVzLmN1c3RvbVt0eXBlXTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGVtcGxhdGVzO1xuICB9XG5cbiAgYWRkRGVmYXVsdChrZXk6IHN0cmluZywgdGVtcGxhdGU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudGVtcGxhdGVzLmRlZmF1bHRba2V5XSA9IHRlbXBsYXRlO1xuICB9XG5cbiAgYWRkQ3VzdG9tKGtleTogc3RyaW5nLCB0ZW1wbGF0ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy50ZW1wbGF0ZXMuY3VzdG9tW2tleV0gPSB0ZW1wbGF0ZTtcbiAgfVxufVxuIl19