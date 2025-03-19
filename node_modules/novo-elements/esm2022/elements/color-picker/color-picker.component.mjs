import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Color } from 'novo-elements/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./color-swatch.component";
export class NovoColorPickerComponent {
    constructor() {
        /** Pixel value for picker width */
        this.width = 276;
        /** Color squares to display */
        this.colors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'];
        this.color = {
            h: 250,
            s: 0.5,
            l: 0.2,
            a: 1,
        };
        this.onChange = new EventEmitter();
        this.onChangeComplete = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
        this.swatchStyle = {
            width: '30px',
            height: '30px',
            borderRadius: '4px',
            fontSize: '0',
        };
        this.input = {
            borderRadius: '4px',
            borderBottomLeftRadius: '0',
            borderTopLeftRadius: '0',
            border: '1px solid #e6ecf0',
            boxSizing: 'border-box',
            display: 'inline',
            fontSize: '14px',
            height: '30px',
            padding: '0',
            paddingLeft: '6px',
            width: '100%',
            color: '#657786',
        };
    }
    focus(color) {
        return { boxShadow: `0 0 4px ${color}` };
    }
    handleBlockChange({ hex, $event }) {
        if (Color.isValidHex(hex)) {
            // this.hex = hex;
            this.handleChange({ hex, source: 'hex' }, $event);
        }
    }
    handleValueChange({ data, $event }) {
        this.handleBlockChange({ hex: data, $event });
    }
    ngOnInit() {
        this.changes = this.onChange.pipe(debounceTime(100)).subscribe((x) => this.onChangeComplete.emit(x));
        this.setState(new Color(this.color));
    }
    ngOnChanges() {
        this.setState(new Color(this.color));
    }
    ngOnDestroy() {
        this.changes.unsubscribe();
    }
    setState(data) {
        this.currentColor = data;
        this.hsl = data.hsl;
        this.hsv = data.hsv;
        this.rgb = data.rgb;
        this.hex = data.hex;
        this.afterValidChange();
    }
    handleChange(data, $event) {
        const color = new Color(data.hex);
        if (color.isValid) {
            this.setState(color);
            this.onChange.emit({ color, $event });
            this.afterValidChange();
        }
    }
    /** hook for components after a complete change */
    afterValidChange() { }
    handleSwatchHover($event) {
        const color = new Color($event.hex);
        if (color.isValid) {
            this.setState(color);
            this.onSwatchHover.emit({ color, $event });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoColorPickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoColorPickerComponent, selector: "novo-color-picker", inputs: { width: "width", colors: "colors", color: "color" }, outputs: { onChange: "onChange", onChangeComplete: "onChangeComplete", onSwatchHover: "onSwatchHover" }, usesOnChanges: true, ngImport: i0, template: `
    <div class="novo-color-preview" [style.backgroundColor]="currentColor.hex">
      <div class="novo-color-preview-text">{{ hex }}</div>
    </div>
    <div class="novo-color-swatches">
      <novo-color-swatch
        *ngFor="let color of colors"
        [color]="color"
        (onClick)="handleBlockChange($event)"
        (onHover)="handleSwatchHover($event)"
      ></novo-color-swatch>
    </div>
    <div class="novo-color-input">
      <input [value]="hex.replace('#', '')" (onChange)="handleValueChange($event)" />
    </div>
  `, isInline: true, styles: [":host{display:grid;grid-template-rows:6rem 1fr min-content;background-color:var(--background-bright, #ffffff);cursor:default;overflow:auto;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;transform:translateY(0);transition:all .15s cubic-bezier(.35,0,.25,1);border-radius:.4rem;width:18rem}:host .novo-color-preview{display:flex;align-items:center;justify-content:center}:host .novo-color-swatches{display:grid;grid-template-columns:repeat(6,2.4rem);grid-auto-rows:2.4rem;grid-gap:.4rem;margin:.4rem 0;justify-content:center}:host .novo-color-input{padding:.4rem .8rem}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i2.NovoColorSwatchComponent, selector: "novo-color-swatch", inputs: ["color", "style", "focusStyle", "focus"], outputs: ["onClick", "onHover"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoColorPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'novo-color-picker', template: `
    <div class="novo-color-preview" [style.backgroundColor]="currentColor.hex">
      <div class="novo-color-preview-text">{{ hex }}</div>
    </div>
    <div class="novo-color-swatches">
      <novo-color-swatch
        *ngFor="let color of colors"
        [color]="color"
        (onClick)="handleBlockChange($event)"
        (onHover)="handleSwatchHover($event)"
      ></novo-color-swatch>
    </div>
    <div class="novo-color-input">
      <input [value]="hex.replace('#', '')" (onChange)="handleValueChange($event)" />
    </div>
  `, changeDetection: ChangeDetectionStrategy.OnPush, preserveWhitespaces: false, styles: [":host{display:grid;grid-template-rows:6rem 1fr min-content;background-color:var(--background-bright, #ffffff);cursor:default;overflow:auto;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;transform:translateY(0);transition:all .15s cubic-bezier(.35,0,.25,1);border-radius:.4rem;width:18rem}:host .novo-color-preview{display:flex;align-items:center;justify-content:center}:host .novo-color-swatches{display:grid;grid-template-columns:repeat(6,2.4rem);grid-auto-rows:2.4rem;grid-gap:.4rem;margin:.4rem 0;justify-content:center}:host .novo-color-input{padding:.4rem .8rem}\n"] }]
        }], propDecorators: { width: [{
                type: Input
            }], colors: [{
                type: Input
            }], color: [{
                type: Input
            }], onChange: [{
                type: Output
            }], onChangeComplete: [{
                type: Output
            }], onSwatchHover: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3ItcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL2NvbG9yLXBpY2tlci9jb2xvci1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBZ0MsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsS0FBSyxFQUFtQyxNQUFNLHFCQUFxQixDQUFDOzs7O0FBd0I3RSxNQUFNLE9BQU8sd0JBQXdCO0lBdEJyQztRQXVCRSxtQ0FBbUM7UUFDMUIsVUFBSyxHQUFvQixHQUFHLENBQUM7UUFDdEMsK0JBQStCO1FBQ3RCLFdBQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hILFVBQUssR0FBZ0M7WUFDNUMsQ0FBQyxFQUFFLEdBQUc7WUFDTixDQUFDLEVBQUUsR0FBRztZQUNOLENBQUMsRUFBRSxHQUFHO1lBQ04sQ0FBQyxFQUFFLENBQUM7U0FDTCxDQUFDO1FBQ1EsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDbkMscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMzQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFRbEQsZ0JBQVcsR0FBOEI7WUFDdkMsS0FBSyxFQUFFLE1BQU07WUFDYixNQUFNLEVBQUUsTUFBTTtZQUNkLFlBQVksRUFBRSxLQUFLO1lBQ25CLFFBQVEsRUFBRSxHQUFHO1NBQ2QsQ0FB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QUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM3QyxDQUFDO0lBQ0gsQ0FBQzsrR0FoR1Usd0JBQXdCO21HQUF4Qix3QkFBd0IscVBBcEJ6Qjs7Ozs7Ozs7Ozs7Ozs7O0dBZVQ7OzRGQUtVLHdCQUF3QjtrQkF0QnBDLFNBQVM7K0JBQ0UsbUJBQW1CLFlBQ25COzs7Ozs7Ozs7Ozs7Ozs7R0FlVCxtQkFFZ0IsdUJBQXVCLENBQUMsTUFBTSx1QkFDMUIsS0FBSzs4QkFJakIsS0FBSztzQkFBYixLQUFLO2dCQUVHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBTUksUUFBUTtzQkFBakIsTUFBTTtnQkFDRyxnQkFBZ0I7c0JBQXpCLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDb2xvciwgSFNMLCBIU0xBLCBIU1YsIEhTVkEsIFJHQiwgUkdCQSB9IGZyb20gJ25vdm8tZWxlbWVudHMvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdub3ZvLWNvbG9yLXBpY2tlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cIm5vdm8tY29sb3ItcHJldmlld1wiIFtzdHlsZS5iYWNrZ3JvdW5kQ29sb3JdPVwiY3VycmVudENvbG9yLmhleFwiPlxuICAgICAgPGRpdiBjbGFzcz1cIm5vdm8tY29sb3ItcHJldmlldy10ZXh0XCI+e3sgaGV4IH19PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm5vdm8tY29sb3Itc3dhdGNoZXNcIj5cbiAgICAgIDxub3ZvLWNvbG9yLXN3YXRjaFxuICAgICAgICAqbmdGb3I9XCJsZXQgY29sb3Igb2YgY29sb3JzXCJcbiAgICAgICAgW2NvbG9yXT1cImNvbG9yXCJcbiAgICAgICAgKG9uQ2xpY2spPVwiaGFuZGxlQmxvY2tDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIChvbkhvdmVyKT1cImhhbmRsZVN3YXRjaEhvdmVyKCRldmVudClcIlxuICAgICAgPjwvbm92by1jb2xvci1zd2F0Y2g+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm5vdm8tY29sb3ItaW5wdXRcIj5cbiAgICAgIDxpbnB1dCBbdmFsdWVdPVwiaGV4LnJlcGxhY2UoJyMnLCAnJylcIiAob25DaGFuZ2UpPVwiaGFuZGxlVmFsdWVDaGFuZ2UoJGV2ZW50KVwiIC8+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL2NvbG9yLXBpY2tlci5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIE5vdm9Db2xvclBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKiogUGl4ZWwgdmFsdWUgZm9yIHBpY2tlciB3aWR0aCAqL1xuICBASW5wdXQoKSB3aWR0aDogc3RyaW5nIHwgbnVtYmVyID0gMjc2O1xuICAvKiogQ29sb3Igc3F1YXJlcyB0byBkaXNwbGF5ICovXG4gIEBJbnB1dCgpIGNvbG9ycyA9IFsnI0ZGNjkwMCcsICcjRkNCOTAwJywgJyM3QkRDQjUnLCAnIzAwRDA4NCcsICcjOEVEMUZDJywgJyMwNjkzRTMnLCAnI0FCQjhDMycsICcjRUIxNDRDJywgJyNGNzhEQTcnLCAnIzk5MDBFRiddO1xuICBASW5wdXQoKSBjb2xvcjogSFNMQSB8IEhTVkEgfCBSR0JBIHwgc3RyaW5nID0ge1xuICAgIGg6IDI1MCxcbiAgICBzOiAwLjUsXG4gICAgbDogMC4yLFxuICAgIGE6IDEsXG4gIH07XG4gIEBPdXRwdXQoKSBvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25DaGFuZ2VDb21wbGV0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25Td2F0Y2hIb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBoc2whOiBIU0w7XG4gIGhzdiE6IEhTVjtcbiAgcmdiITogUkdCO1xuICBoZXghOiBzdHJpbmc7XG4gIGN1cnJlbnRDb2xvciE6IENvbG9yO1xuICBjaGFuZ2VzITogU3Vic2NyaXB0aW9uO1xuXG4gIHN3YXRjaFN0eWxlOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge1xuICAgIHdpZHRoOiAnMzBweCcsXG4gICAgaGVpZ2h0OiAnMzBweCcsXG4gICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICBmb250U2l6ZTogJzAnLFxuICB9O1xuICBpbnB1dDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6ICcwJyxcbiAgICBib3JkZXJUb3BMZWZ0UmFkaXVzOiAnMCcsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICNlNmVjZjAnLFxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIGRpc3BsYXk6ICdpbmxpbmUnLFxuICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgaGVpZ2h0OiAnMzBweCcsXG4gICAgcGFkZGluZzogJzAnLFxuICAgIHBhZGRpbmdMZWZ0OiAnNnB4JyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGNvbG9yOiAnIzY1Nzc4NicsXG4gIH07XG5cbiAgZm9jdXMoY29sb3I6IHN0cmluZykge1xuICAgIHJldHVybiB7IGJveFNoYWRvdzogYDAgMCA0cHggJHtjb2xvcn1gIH07XG4gIH1cblxuICBoYW5kbGVCbG9ja0NoYW5nZSh7IGhleCwgJGV2ZW50IH06IGFueSkge1xuICAgIGlmIChDb2xvci5pc1ZhbGlkSGV4KGhleCkpIHtcbiAgICAgIC8vIHRoaXMuaGV4ID0gaGV4O1xuICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UoeyBoZXgsIHNvdXJjZTogJ2hleCcgfSwgJGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVWYWx1ZUNoYW5nZSh7IGRhdGEsICRldmVudCB9OiBhbnkpIHtcbiAgICB0aGlzLmhhbmRsZUJsb2NrQ2hhbmdlKHsgaGV4OiBkYXRhLCAkZXZlbnQgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmNoYW5nZXMgPSB0aGlzLm9uQ2hhbmdlLnBpcGUoZGVib3VuY2VUaW1lKDEwMCkpLnN1YnNjcmliZSgoeCkgPT4gdGhpcy5vbkNoYW5nZUNvbXBsZXRlLmVtaXQoeCkpO1xuICAgIHRoaXMuc2V0U3RhdGUobmV3IENvbG9yKHRoaXMuY29sb3IpKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuc2V0U3RhdGUobmV3IENvbG9yKHRoaXMuY29sb3IpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgc2V0U3RhdGUoZGF0YTogQ29sb3IpIHtcbiAgICB0aGlzLmN1cnJlbnRDb2xvciA9IGRhdGE7XG4gICAgdGhpcy5oc2wgPSBkYXRhLmhzbDtcbiAgICB0aGlzLmhzdiA9IGRhdGEuaHN2O1xuICAgIHRoaXMucmdiID0gZGF0YS5yZ2I7XG4gICAgdGhpcy5oZXggPSBkYXRhLmhleDtcbiAgICB0aGlzLmFmdGVyVmFsaWRDaGFuZ2UoKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShkYXRhLCAkZXZlbnQpIHtcbiAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihkYXRhLmhleCk7XG4gICAgaWYgKGNvbG9yLmlzVmFsaWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoY29sb3IpO1xuICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHsgY29sb3IsICRldmVudCB9KTtcbiAgICAgIHRoaXMuYWZ0ZXJWYWxpZENoYW5nZSgpO1xuICAgIH1cbiAgfVxuICAvKiogaG9vayBmb3IgY29tcG9uZW50cyBhZnRlciBhIGNvbXBsZXRlIGNoYW5nZSAqL1xuICBhZnRlclZhbGlkQ2hhbmdlKCkge31cblxuICBoYW5kbGVTd2F0Y2hIb3ZlcigkZXZlbnQpIHtcbiAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcigkZXZlbnQuaGV4KTtcbiAgICBpZiAoY29sb3IuaXNWYWxpZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShjb2xvcik7XG4gICAgICB0aGlzLm9uU3dhdGNoSG92ZXIuZW1pdCh7IGNvbG9yLCAkZXZlbnQgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=