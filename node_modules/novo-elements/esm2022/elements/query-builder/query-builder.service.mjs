import { computed, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { NovoLabelService } from 'novo-elements/services';
import { Conjunction } from './query-builder.types';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
export const defaultEditTypeFn = (field) => {
    return field.inputType || field.dataType || field.type;
};
export class QueryBuilderService {
    /**
     * Function to determine operator and input templates for a field.  Value passed
     * through the criteria builder Input.
     */
    get editTypeFn() {
        return this._editTypeFn;
    }
    set editTypeFn(value) {
        this._editTypeFn = value ?? defaultEditTypeFn;
        this.stateChanges.next();
    }
    /**
     * The field configuration to control which types of fields are available to select
     * within the Condition Builder.
     */
    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
        this.stateChanges.next();
    }
    /**
     * The configuration to control which types of conjuntions can be used in the query builder.
     * Value passed through the criteria builder Input
     * eg. and, or, not
     */
    get allowedGroupings() {
        return this._allowedGroupings;
    }
    set allowedGroupings(value) {
        this._allowedGroupings = value;
        this.stateChanges.next();
    }
    constructor(labels) {
        this.labels = labels;
        this._customFieldDefs = new Set();
        this._fieldDefsByName = new Map();
        this.scopes = signal([]);
        this.hasMultipleScopes = computed(() => this.scopes()?.length > 1);
        /**
         * Will dispatch when properties changes, subscribe to this if component should
         * re-render when props are updated
         */
        this.stateChanges = new Subject();
        this._editTypeFn = defaultEditTypeFn;
        this._config = {
            fields: [],
            staticFieldSelection: null
        };
    }
    /** Adds a field definition that was not included as part of the content children. */
    registerFieldDef(fieldDef) {
        this._customFieldDefs.add(fieldDef);
        this._fieldDefsByName.set(fieldDef.name, fieldDef);
    }
    /** Removes a field definition that was not included as part of the content children. */
    unregisterFieldDef(fieldDef) {
        this._customFieldDefs.delete(fieldDef);
        this._fieldDefsByName.delete(fieldDef.name);
    }
    getFieldDefsByName() {
        return this._fieldDefsByName;
    }
    getConjunctionLabel(conjunction) {
        switch (conjunction.replace('$', '').toLowerCase()) {
            case Conjunction.OR:
                return this.labels.or;
            case Conjunction.NOT:
                return this.labels.not;
            case Conjunction.AND:
            default:
                return this.labels.and;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: QueryBuilderService, deps: [{ token: i1.NovoLabelService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: QueryBuilderService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: QueryBuilderService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.NovoLabelService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnktYnVpbGRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvcXVlcnktYnVpbGRlci9xdWVyeS1idWlsZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFMUQsT0FBTyxFQUFnQixXQUFXLEVBQWUsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBRS9FLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsS0FBbUIsRUFBRSxFQUFFO0lBQ3ZELE9BQU8sS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDekQsQ0FBQyxDQUFDO0FBUUYsTUFBTSxPQUFPLG1CQUFtQjtJQVc5Qjs7O09BR0c7SUFDSCxJQUFXLFVBQVU7UUFDbkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFDRCxJQUFXLFVBQVUsQ0FBQyxLQUFzQztRQUMxRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssSUFBSSxpQkFBaUIsQ0FBQztRQUM5QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUFXLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUNELElBQVcsTUFBTSxDQUFDLEtBQXlCO1FBQ3pDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQU1EOzs7O09BSUc7SUFDSCxJQUFXLGdCQUFnQjtRQUN6QixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsSUFBVyxnQkFBZ0IsQ0FBQyxLQUFvQjtRQUM5QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUtELFlBQW9CLE1BQXdCO1FBQXhCLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBdkRwQyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBeUIsQ0FBQztRQUNwRCxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBaUMsQ0FBQztRQUM3RCxXQUFNLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BCLHNCQUFpQixHQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JFOzs7V0FHRztRQUNNLGlCQUFZLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFhbkQsZ0JBQVcsR0FBb0MsaUJBQWlCLENBQUM7UUFhakUsWUFBTyxHQUF1QjtZQUNwQyxNQUFNLEVBQUUsRUFBRTtZQUNWLG9CQUFvQixFQUFFLElBQUk7U0FDM0IsQ0FBQztJQWtCNkMsQ0FBQztJQUVoRCxxRkFBcUY7SUFDckYsZ0JBQWdCLENBQUMsUUFBK0I7UUFDOUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELHdGQUF3RjtJQUN4RixrQkFBa0IsQ0FBQyxRQUErQjtRQUNoRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVELG1CQUFtQixDQUFDLFdBQW1CO1FBQ3JDLFFBQVEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUNuRCxLQUFLLFdBQVcsQ0FBQyxFQUFFO2dCQUNqQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQ3hCLEtBQUssV0FBVyxDQUFDLEdBQUc7Z0JBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDekIsS0FBSyxXQUFXLENBQUMsR0FBRyxDQUFDO1lBQ3JCO2dCQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDM0IsQ0FBQztJQUNILENBQUM7K0dBcEZVLG1CQUFtQjttSEFBbkIsbUJBQW1COzs0RkFBbkIsbUJBQW1CO2tCQUQvQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29tcHV0ZWQsIEluamVjdGFibGUsIHNpZ25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTm92b0xhYmVsU2VydmljZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvc2VydmljZXMnO1xuaW1wb3J0IHsgQmFzZUNvbmRpdGlvbkZpZWxkRGVmIH0gZnJvbSAnLi9xdWVyeS1idWlsZGVyLmRpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgQmFzZUZpZWxkRGVmLCBDb25qdW5jdGlvbiwgRmllbGRDb25maWcgfSBmcm9tICcuL3F1ZXJ5LWJ1aWxkZXIudHlwZXMnO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdEVkaXRUeXBlRm4gPSAoZmllbGQ6IEJhc2VGaWVsZERlZikgPT4ge1xuICByZXR1cm4gZmllbGQuaW5wdXRUeXBlIHx8IGZpZWxkLmRhdGFUeXBlIHx8IGZpZWxkLnR5cGU7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5QnVpbGRlckNvbmZpZyB7XG4gIGZpZWxkczogRmllbGRDb25maWc8QmFzZUZpZWxkRGVmPltdO1xuICBzdGF0aWNGaWVsZFNlbGVjdGlvbj86IHN0cmluZztcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFF1ZXJ5QnVpbGRlclNlcnZpY2Uge1xuICBwcml2YXRlIF9jdXN0b21GaWVsZERlZnMgPSBuZXcgU2V0PEJhc2VDb25kaXRpb25GaWVsZERlZj4oKTtcbiAgcHJpdmF0ZSBfZmllbGREZWZzQnlOYW1lID0gbmV3IE1hcDxzdHJpbmcsIEJhc2VDb25kaXRpb25GaWVsZERlZj4oKTtcbiAgcHVibGljIHNjb3BlcyA9IHNpZ25hbChbXSk7XG4gIHB1YmxpYyBoYXNNdWx0aXBsZVNjb3BlcyA9IGNvbXB1dGVkKCgpID0+IHRoaXMuc2NvcGVzKCk/Lmxlbmd0aCA+IDEpO1xuICAvKipcbiAgICogV2lsbCBkaXNwYXRjaCB3aGVuIHByb3BlcnRpZXMgY2hhbmdlcywgc3Vic2NyaWJlIHRvIHRoaXMgaWYgY29tcG9uZW50IHNob3VsZFxuICAgKiByZS1yZW5kZXIgd2hlbiBwcm9wcyBhcmUgdXBkYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIG9wZXJhdG9yIGFuZCBpbnB1dCB0ZW1wbGF0ZXMgZm9yIGEgZmllbGQuICBWYWx1ZSBwYXNzZWRcbiAgICogdGhyb3VnaCB0aGUgY3JpdGVyaWEgYnVpbGRlciBJbnB1dC5cbiAgICovXG4gIHB1YmxpYyBnZXQgZWRpdFR5cGVGbigpOiAoZmllbGQ6IEJhc2VGaWVsZERlZikgPT4gc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZWRpdFR5cGVGbjtcbiAgfVxuICBwdWJsaWMgc2V0IGVkaXRUeXBlRm4odmFsdWU6IChmaWVsZDogQmFzZUZpZWxkRGVmKSA9PiBzdHJpbmcpIHtcbiAgICB0aGlzLl9lZGl0VHlwZUZuID0gdmFsdWUgPz8gZGVmYXVsdEVkaXRUeXBlRm47XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX2VkaXRUeXBlRm46IChmaWVsZDogQmFzZUZpZWxkRGVmKSA9PiBzdHJpbmcgPSBkZWZhdWx0RWRpdFR5cGVGbjtcblxuICAvKipcbiAgICogVGhlIGZpZWxkIGNvbmZpZ3VyYXRpb24gdG8gY29udHJvbCB3aGljaCB0eXBlcyBvZiBmaWVsZHMgYXJlIGF2YWlsYWJsZSB0byBzZWxlY3RcbiAgICogd2l0aGluIHRoZSBDb25kaXRpb24gQnVpbGRlci5cbiAgICovXG4gIHB1YmxpYyBnZXQgY29uZmlnKCk6IFF1ZXJ5QnVpbGRlckNvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcbiAgfVxuICBwdWJsaWMgc2V0IGNvbmZpZyh2YWx1ZTogUXVlcnlCdWlsZGVyQ29uZmlnKSB7XG4gICAgdGhpcy5fY29uZmlnID0gdmFsdWU7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX2NvbmZpZzogUXVlcnlCdWlsZGVyQ29uZmlnID0ge1xuICAgIGZpZWxkczogW10sXG4gICAgc3RhdGljRmllbGRTZWxlY3Rpb246IG51bGxcbiAgfTtcblxuICAvKipcbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gdG8gY29udHJvbCB3aGljaCB0eXBlcyBvZiBjb25qdW50aW9ucyBjYW4gYmUgdXNlZCBpbiB0aGUgcXVlcnkgYnVpbGRlci5cbiAgICogVmFsdWUgcGFzc2VkIHRocm91Z2ggdGhlIGNyaXRlcmlhIGJ1aWxkZXIgSW5wdXRcbiAgICogZWcuIGFuZCwgb3IsIG5vdFxuICAgKi9cbiAgcHVibGljIGdldCBhbGxvd2VkR3JvdXBpbmdzKCk6IENvbmp1bmN0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLl9hbGxvd2VkR3JvdXBpbmdzO1xuICB9XG4gIHB1YmxpYyBzZXQgYWxsb3dlZEdyb3VwaW5ncyh2YWx1ZTogQ29uanVuY3Rpb25bXSkge1xuICAgIHRoaXMuX2FsbG93ZWRHcm91cGluZ3MgPSB2YWx1ZTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfYWxsb3dlZEdyb3VwaW5nczogQ29uanVuY3Rpb25bXTtcblxuICBwdWJsaWMgY29tcG9uZW50SG9zdDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbGFiZWxzOiBOb3ZvTGFiZWxTZXJ2aWNlKSB7fVxuXG4gIC8qKiBBZGRzIGEgZmllbGQgZGVmaW5pdGlvbiB0aGF0IHdhcyBub3QgaW5jbHVkZWQgYXMgcGFydCBvZiB0aGUgY29udGVudCBjaGlsZHJlbi4gKi9cbiAgcmVnaXN0ZXJGaWVsZERlZihmaWVsZERlZjogQmFzZUNvbmRpdGlvbkZpZWxkRGVmKSB7XG4gICAgdGhpcy5fY3VzdG9tRmllbGREZWZzLmFkZChmaWVsZERlZik7XG4gICAgdGhpcy5fZmllbGREZWZzQnlOYW1lLnNldChmaWVsZERlZi5uYW1lLCBmaWVsZERlZik7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhIGZpZWxkIGRlZmluaXRpb24gdGhhdCB3YXMgbm90IGluY2x1ZGVkIGFzIHBhcnQgb2YgdGhlIGNvbnRlbnQgY2hpbGRyZW4uICovXG4gIHVucmVnaXN0ZXJGaWVsZERlZihmaWVsZERlZjogQmFzZUNvbmRpdGlvbkZpZWxkRGVmKSB7XG4gICAgdGhpcy5fY3VzdG9tRmllbGREZWZzLmRlbGV0ZShmaWVsZERlZik7XG4gICAgdGhpcy5fZmllbGREZWZzQnlOYW1lLmRlbGV0ZShmaWVsZERlZi5uYW1lKTtcbiAgfVxuXG4gIGdldEZpZWxkRGVmc0J5TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZmllbGREZWZzQnlOYW1lO1xuICB9XG5cbiAgZ2V0Q29uanVuY3Rpb25MYWJlbChjb25qdW5jdGlvbjogc3RyaW5nKSB7XG4gICAgc3dpdGNoIChjb25qdW5jdGlvbi5yZXBsYWNlKCckJywgJycpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgIGNhc2UgQ29uanVuY3Rpb24uT1I6XG4gICAgICAgIHJldHVybiB0aGlzLmxhYmVscy5vcjtcbiAgICAgIGNhc2UgQ29uanVuY3Rpb24uTk9UOlxuICAgICAgICByZXR1cm4gdGhpcy5sYWJlbHMubm90O1xuICAgICAgY2FzZSBDb25qdW5jdGlvbi5BTkQ6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdGhpcy5sYWJlbHMuYW5kO1xuICAgIH1cbiAgfVxufVxuIl19