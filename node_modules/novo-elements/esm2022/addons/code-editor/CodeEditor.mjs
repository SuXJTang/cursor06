// NG2
import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
// Vendor
import { defaultKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { Annotation, EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import * as i0 from "@angular/core";
// organize-imports-ignore
// APP
const CODE_EDITOR_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NovoCodeEditor),
    multi: true,
};
// CodeMirror transaction annotation to show changes that came in through writeValue (FormControl value) as opposed to UI editing
const FormControlCodeWriter = Annotation.define();
// (This is a replacement for the "novo-ace-editor". Notably, we are no longer naming it based on the underlying component. It is possible, in the future,
// we decide there is another code editing component that better fits our use case - in which situation we should replace the implementation here, but keep its name)
export class NovoCodeEditor {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.theme = 'default';
        this.lineNumbers = true;
        this.blur = new EventEmitter();
        this.focus = new EventEmitter();
        this.changed = new EventEmitter();
        this.mode = 'javascript';
        this.initialValue = '';
        this.disabled = false;
    }
    ngOnInit() {
    }
    ngOnDestroy() {
    }
    ngAfterViewInit() {
        this.createEditorView();
    }
    createEditorView() {
        const extensions = [
            basicSetup,
            keymap.of(defaultKeymap)
        ];
        if (this.mode === 'javascript') {
            extensions.push(javascript());
        }
        const initialEditorState = EditorState.create({
            doc: this.initialValue,
            extensions,
        });
        this.editorView = new EditorView({
            state: initialEditorState,
            parent: this.elementRef.nativeElement,
            dispatch: (transaction, view) => {
                // Prevent changes if the form is disabled - unless the change came from writeValue function
                if (transaction.annotation(FormControlCodeWriter) || !(this.disabled && transaction.docChanged)) {
                    view.update([transaction]);
                }
                if (transaction.docChanged) {
                    this.changed.emit(view.state.doc.toString());
                }
            }
        });
    }
    onFocus() {
        this.focus.emit();
    }
    onBlur() {
        this.blur.emit();
    }
    // ControlValueAccessor forward implementation
    writeValue(value) {
        if (this.editorView) {
            this.editorView.dispatch({
                changes: {
                    from: 0,
                    to: this.editorView.state.doc.length,
                    insert: value,
                },
                annotations: FormControlCodeWriter.of({}),
            });
        }
        else if (value != null) {
            this.initialValue = value;
        }
    }
    registerOnChange(fn) {
        this.changed.subscribe(fn);
    }
    registerOnTouched(fn) {
        this.blur.subscribe(fn);
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCodeEditor, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoCodeEditor, selector: "novo-code-editor", inputs: { theme: "theme", lineNumbers: "lineNumbers", name: "name", mode: "mode" }, outputs: { blur: "blur", focus: "focus" }, host: { listeners: { "focus": "onFocus()", "blur": "onBlur()" }, properties: { "class.editor-disabled": "this.disabled" } }, providers: [CODE_EDITOR_VALUE_ACCESSOR], viewQueries: [{ propertyName: "editorRoot", first: true, predicate: ["editorRoot"], descendants: true }], ngImport: i0, template: '', isInline: true, styles: [":host{height:200px;display:block;overflow:auto}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoCodeEditor, decorators: [{
            type: Component,
            args: [{ selector: 'novo-code-editor', template: '', providers: [CODE_EDITOR_VALUE_ACCESSOR], styles: [":host{height:200px;display:block;overflow:auto}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { theme: [{
                type: Input
            }], lineNumbers: [{
                type: Input
            }], name: [{
                type: Input
            }], blur: [{
                type: Output
            }], focus: [{
                type: Output
            }], mode: [{
                type: Input
            }], editorRoot: [{
                type: ViewChild,
                args: ['editorRoot']
            }], disabled: [{
                type: HostBinding,
                args: ['class.editor-disabled']
            }], onFocus: [{
                type: HostListener,
                args: ['focus']
            }], onBlur: [{
                type: HostListener,
                args: ['blur']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2FkZG9ucy9jb2RlLWVkaXRvci9Db2RlRWRpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU07QUFDTixPQUFPLEVBQWlCLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2SyxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsU0FBUztBQUNULE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDekQsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxZQUFZLENBQUM7O0FBRXhDLDBCQUEwQjtBQUUxQixNQUFNO0FBQ04sTUFBTSwwQkFBMEIsR0FBRztJQUNqQyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO0lBQzdDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGLGlJQUFpSTtBQUNqSSxNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVsRCwwSkFBMEo7QUFDMUoscUtBQXFLO0FBT3JLLE1BQU0sT0FBTyxjQUFjO0lBNEJ6QixZQUFvQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBMUIxQyxVQUFL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QUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsVUFBbUI7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDN0IsQ0FBQzsrR0F4R1UsY0FBYzttR0FBZCxjQUFjLHVTQUZkLENBQUMsMEJBQTBCLENBQUMsb0lBRjdCLEVBQUU7OzRGQUlELGNBQWM7a0JBTjFCLFNBQVM7K0JBQ0Usa0JBQWtCLFlBQ2xCLEVBQUUsYUFFRCxDQUFDLDBCQUEwQixDQUFDOytFQUl2QyxLQUFLO3NCQURKLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLElBQUk7c0JBREgsS0FBSztnQkFJTixJQUFJO3NCQURILE1BQU07Z0JBR1AsS0FBSztzQkFESixNQUFNO2dCQUtFLElBQUk7c0JBQVosS0FBSztnQkFHTixVQUFVO3NCQURULFNBQVM7dUJBQUMsWUFBWTtnQkFPZixRQUFRO3NCQURmLFdBQVc7dUJBQUMsdUJBQXVCO2dCQTRDcEMsT0FBTztzQkFETixZQUFZO3VCQUFDLE9BQU87Z0JBTXJCLE1BQU07c0JBREwsWUFBWTt1QkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFZpZXdDaGlsZCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuLy8gVmVuZG9yXG5pbXBvcnQgeyBkZWZhdWx0S2V5bWFwIH0gZnJvbSAnQGNvZGVtaXJyb3IvY29tbWFuZHMnO1xuaW1wb3J0IHsgamF2YXNjcmlwdCB9IGZyb20gJ0Bjb2RlbWlycm9yL2xhbmctamF2YXNjcmlwdCc7XG5pbXBvcnQgeyBBbm5vdGF0aW9uLCBFZGl0b3JTdGF0ZSB9IGZyb20gJ0Bjb2RlbWlycm9yL3N0YXRlJztcbmltcG9ydCB7IEVkaXRvclZpZXcsIGtleW1hcCB9IGZyb20gJ0Bjb2RlbWlycm9yL3ZpZXcnO1xuaW1wb3J0IHsgYmFzaWNTZXR1cCB9IGZyb20gJ2NvZGVtaXJyb3InO1xuXG4vLyBvcmdhbml6ZS1pbXBvcnRzLWlnbm9yZVxuXG4vLyBBUFBcbmNvbnN0IENPREVfRURJVE9SX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTm92b0NvZGVFZGl0b3IpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8vIENvZGVNaXJyb3IgdHJhbnNhY3Rpb24gYW5ub3RhdGlvbiB0byBzaG93IGNoYW5nZXMgdGhhdCBjYW1lIGluIHRocm91Z2ggd3JpdGVWYWx1ZSAoRm9ybUNvbnRyb2wgdmFsdWUpIGFzIG9wcG9zZWQgdG8gVUkgZWRpdGluZ1xuY29uc3QgRm9ybUNvbnRyb2xDb2RlV3JpdGVyID0gQW5ub3RhdGlvbi5kZWZpbmUoKTtcblxuLy8gKFRoaXMgaXMgYSByZXBsYWNlbWVudCBmb3IgdGhlIFwibm92by1hY2UtZWRpdG9yXCIuIE5vdGFibHksIHdlIGFyZSBubyBsb25nZXIgbmFtaW5nIGl0IGJhc2VkIG9uIHRoZSB1bmRlcmx5aW5nIGNvbXBvbmVudC4gSXQgaXMgcG9zc2libGUsIGluIHRoZSBmdXR1cmUsXG4vLyB3ZSBkZWNpZGUgdGhlcmUgaXMgYW5vdGhlciBjb2RlIGVkaXRpbmcgY29tcG9uZW50IHRoYXQgYmV0dGVyIGZpdHMgb3VyIHVzZSBjYXNlIC0gaW4gd2hpY2ggc2l0dWF0aW9uIHdlIHNob3VsZCByZXBsYWNlIHRoZSBpbXBsZW1lbnRhdGlvbiBoZXJlLCBidXQga2VlcCBpdHMgbmFtZSlcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25vdm8tY29kZS1lZGl0b3InLFxuICB0ZW1wbGF0ZTogJycsXG4gIHN0eWxlVXJsczogWycuL0NvZGVFZGl0b3Iuc2NzcyddLFxuICBwcm92aWRlcnM6IFtDT0RFX0VESVRPUl9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgTm92b0NvZGVFZGl0b3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKVxuICB0aGVtZTogc3RyaW5nID0gJ2RlZmF1bHQnO1xuXG4gIEBJbnB1dCgpXG4gIGxpbmVOdW1iZXJzID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBuYW1lOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgpXG4gIGJsdXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKVxuICBmb2N1cyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIGNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBASW5wdXQoKSBtb2RlOiBzdHJpbmcgPSAnamF2YXNjcmlwdCc7XG5cbiAgQFZpZXdDaGlsZCgnZWRpdG9yUm9vdCcpXG4gIGVkaXRvclJvb3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIGVkaXRvclZpZXc6IEVkaXRvclZpZXc7XG4gIGluaXRpYWxWYWx1ZSA9ICcnO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuZWRpdG9yLWRpc2FibGVkJylcbiAgcHJpdmF0ZSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIFxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlRWRpdG9yVmlldygpO1xuICB9XG5cbiAgY3JlYXRlRWRpdG9yVmlldygpOiB2b2lkIHtcbiAgICBjb25zdCBleHRlbnNpb25zID0gW1xuICAgICAgYmFzaWNTZXR1cCxcbiAgICAgIGtleW1hcC5vZihkZWZhdWx0S2V5bWFwKVxuICAgIF07XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2phdmFzY3JpcHQnKSB7XG4gICAgICBleHRlbnNpb25zLnB1c2goamF2YXNjcmlwdCgpKTtcbiAgICB9XG4gICAgY29uc3QgaW5pdGlhbEVkaXRvclN0YXRlID0gRWRpdG9yU3RhdGUuY3JlYXRlKHtcbiAgICAgIGRvYzogdGhpcy5pbml0aWFsVmFsdWUsXG4gICAgICBleHRlbnNpb25zLFxuICAgIH0pO1xuICAgIHRoaXMuZWRpdG9yVmlldyA9IG5ldyBFZGl0b3JWaWV3KHtcbiAgICAgIHN0YXRlOiBpbml0aWFsRWRpdG9yU3RhdGUsXG4gICAgICBwYXJlbnQ6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgZGlzcGF0Y2g6ICh0cmFuc2FjdGlvbiwgdmlldykgPT4ge1xuICAgICAgICAvLyBQcmV2ZW50IGNoYW5nZXMgaWYgdGhlIGZvcm0gaXMgZGlzYWJsZWQgLSB1bmxlc3MgdGhlIGNoYW5nZSBjYW1lIGZyb20gd3JpdGVWYWx1ZSBmdW5jdGlvblxuICAgICAgICBpZiAodHJhbnNhY3Rpb24uYW5ub3RhdGlvbihGb3JtQ29udHJvbENvZGVXcml0ZXIpIHx8ICEodGhpcy5kaXNhYmxlZCAmJiB0cmFuc2FjdGlvbi5kb2NDaGFuZ2VkKSkge1xuICAgICAgICAgIHZpZXcudXBkYXRlKFt0cmFuc2FjdGlvbl0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFuc2FjdGlvbi5kb2NDaGFuZ2VkKSB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VkLmVtaXQodmlldy5zdGF0ZS5kb2MudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJylcbiAgb25Gb2N1cygpIHtcbiAgICB0aGlzLmZvY3VzLmVtaXQoKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy5ibHVyLmVtaXQoKTtcbiAgfVxuXG4gIC8vIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGZvcndhcmQgaW1wbGVtZW50YXRpb25cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuZWRpdG9yVmlldykge1xuICAgICAgdGhpcy5lZGl0b3JWaWV3LmRpc3BhdGNoKHtcbiAgICAgICAgY2hhbmdlczoge1xuICAgICAgICAgIGZyb206IDAsXG4gICAgICAgICAgdG86IHRoaXMuZWRpdG9yVmlldy5zdGF0ZS5kb2MubGVuZ3RoLFxuICAgICAgICAgIGluc2VydDogdmFsdWUsXG4gICAgICAgIH0sXG4gICAgICAgIGFubm90YXRpb25zOiBGb3JtQ29udHJvbENvZGVXcml0ZXIub2Yoe30pLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLmluaXRpYWxWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSkge1xuICAgIHRoaXMuY2hhbmdlZC5zdWJzY3JpYmUoZm4pO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgIHRoaXMuYmx1ci5zdWJzY3JpYmUoZm4pO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cbn1cbiJdfQ==