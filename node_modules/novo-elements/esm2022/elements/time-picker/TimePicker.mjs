// NG2
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, Output, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isValid } from 'date-fns';
// APP
import { NovoLabelService } from 'novo-elements/services';
import { DateUtil, Helpers } from 'novo-elements/utils';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "@angular/common";
import * as i3 from "novo-elements/elements/list";
import * as i4 from "novo-elements/elements/button";
// Value accessor for the component (supports ngModel)
const TIME_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NovoTimePickerElement),
    multi: true,
};
export var TIME_VALUE_FORMATS;
(function (TIME_VALUE_FORMATS) {
    TIME_VALUE_FORMATS["iso8601"] = "iso8601";
    TIME_VALUE_FORMATS["Date"] = "Date";
})(TIME_VALUE_FORMATS || (TIME_VALUE_FORMATS = {}));
export class NovoTimePickerElement {
    flatten(arr) {
        return Array.prototype.concat(...arr);
    }
    constructor(element, labels, cdr) {
        this.element = element;
        this.labels = labels;
        this.cdr = cdr;
        this.military = false;
        this.analog = false;
        this.inline = false;
        this.step = 1;
        this.hasButtons = false;
        this.saveDisabled = false;
        this.onSelect = new EventEmitter();
        this.onSave = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.hours = 12;
        this.minutes = 0;
        this.value = null;
        this.increments = [];
        this.MERIDIANS = ['am', 'pm'];
        this.MINUTES = ['05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '00'];
        this.HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        this._onChange = () => { };
        this._onTouched = () => { };
    }
    ngOnInit() {
        if (this.military) {
            this.HOURS = ['0', ...this.HOURS, '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        }
        if (!this.analog) {
            const mins = Array.from(Array(60 / this.step).keys()).map((i) => i * this.step);
            this.MINUTES = mins.map((m) => `${m}`.padStart(2, '0'));
        }
        this.ngOnChanges();
    }
    ngOnChanges(changes) {
        if (this.model) {
            this.init(this.model, false);
        }
        else {
            this.selected = null;
            this.init(new Date(), false);
        }
    }
    init(value, dispatch) {
        const _value = new Date(value);
        let hours = _value.getHours();
        let minutes = _value.getMinutes();
        if (!this.military) {
            this.meridian = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours || 12;
        }
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        this.setHours(null, hours, dispatch);
        this.setMinutes(null, minutes, dispatch);
        this.checkBetween(minutes);
    }
    checkBetween(value) {
        this.inBetween = this.MINUTES.indexOf(String(value)) < 0;
    }
    setValue(event, value) {
        Helpers.swallowEvent(event);
        this.selected = value;
        const [time, meridian] = value.split(' ');
        const [hours, minutes] = time.split(':');
        this.hours = hours;
        this.minutes = minutes;
        this.meridian = meridian;
        this.dispatchChange();
    }
    setHours(event, hours, dispatch) {
        Helpers.swallowEvent(event);
        this.hours = hours;
        this.hoursClass = `hour-${hours}`;
        this.activeHour = hours;
        if (dispatch) {
            this.dispatchChange();
        }
    }
    setMinutes(event, minutes, dispatch) {
        Helpers.swallowEvent(event);
        this.minutes = minutes;
        this.minutesClass = `min-${minutes}`;
        this.activeMinute = minutes;
        this.checkBetween(minutes);
        if (dispatch) {
            this.dispatchChange();
        }
    }
    setPeriod(event, period, dispatch) {
        Helpers.swallowEvent(event);
        this.meridian = period;
        if (dispatch) {
            this.dispatchChange();
        }
    }
    dispatchChange() {
        let hours = Number(this.hours);
        if (!this.military) {
            hours = this.meridian.toLowerCase() === 'pm' ? hours + 12 : hours;
            // Special case for 12
            if (this.meridian.toLowerCase() === 'pm' && hours === 24) {
                hours = 12;
            }
            else if (this.meridian.toLowerCase() === 'am' && hours === 12) {
                hours = 0;
            }
        }
        const value = new Date();
        value.setHours(hours);
        value.setMinutes(this.minutes);
        value.setSeconds(0);
        this.value = `${this.hours}:${this.minutes} ${this.meridian}`;
        this.onSelect.next({
            hours,
            minutes: this.minutes,
            meridian: this.meridian,
            date: value,
            text: this.value,
        });
        this._onChange(value);
    }
    // ValueAccessor Functions
    writeValue(model) {
        this.model = model;
        if (Helpers.isDate(model)) {
            this.init(model, false);
            // this.dispatchChange();
        }
        if (Helpers.isString(model)) {
            const time = this.military ? model : this.convertTime12to24(model);
            const date = DateUtil.parse(`${DateUtil.format(Date.now(), 'YYYY-MM-DD')}T${time}`);
            if (isValid(date)) {
                this.init(date, false);
                // this.dispatchChange();
            }
        }
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    convertTime12to24(time12h) {
        const pmFormat = this.labels.timeFormatPM.toUpperCase();
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (['PM', pmFormat].includes(modifier)) {
            hours = `${parseInt(hours, 10) + 12}`.padStart(2, '0');
        }
        return `${hours}:${minutes}`;
    }
    save() {
        this.onSave.emit();
    }
    cancel() {
        this.onCancel.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoTimePickerElement, deps: [{ token: i0.ElementRef }, { token: i1.NovoLabelService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoTimePickerElement, selector: "novo-time-picker", inputs: { military: "military", analog: "analog", inline: "inline", step: "step", hasButtons: "hasButtons", saveDisabled: "saveDisabled" }, outputs: { onSelect: "onSelect", onSave: "onSave", onCancel: "onCancel" }, host: { properties: { "class.military": "military" }, classAttribute: "novo-time-picker" }, providers: [TIME_PICKER_VALUE_ACCESSOR], usesOnChanges: true, ngImport: i0, template: `
    <!-- <div class="digital" [class.inline]="inline" [class.military]="military" *ngIf="inline">
      <div class="digital--inner">
        <span class="digital--clock" *ngIf="analog">
          <span class="hours" data-automation-id="novo-time-picker-hours">{{ hours }}</span
          >:<span class="minutes" data-automation-id="novo-time-picker-minutes">{{ minutes }}</span>
        </span>
        <div class="control-block" *ngIf="!military && analog">
          <span
            *ngFor="let period of MERIDIANS"
            class="digital--period"
            [class.active]="meridian == period"
            (click)="setPeriod($event, period, true)"
            [attr.data-automation-id]="period"
            >{{ period }}</span
          >
        </div>
      </div>
    </div> -->
    <div class="increments" *ngIf="!analog">
      <novo-list class="increments--hours" direction="vertical" data-automation-id="novo-time-picker-hours">
        <novo-list-item
          class="increments--hour"
          *ngFor="let increment of HOURS"
          (click)="setHours($event, increment, true)"
          [class.active]="increment == activeHour"
          [attr.data-automation-id]="increment"
        >
          <item-content>{{ increment }}</item-content>
        </novo-list-item>
      </novo-list>
      <novo-list class="increments--minutes" direction="vertical" data-automation-id="novo-time-picker-minutes">
        <novo-list-item
          class="increments--minute"
          *ngFor="let increment of MINUTES"
          (click)="setMinutes($event, increment, true)"
          [class.active]="increment == activeMinute"
          [attr.data-automation-id]="increment"
        >
          <item-content>{{ increment }}</item-content>
        </novo-list-item>
      </novo-list>
      <novo-list class="increments--meridians" direction="vertical" *ngIf="!military" data-automation-id="novo-time-picker-meridians">
        <novo-list-item
          class="increments--meridian"
          *ngFor="let period of MERIDIANS"
          (click)="setPeriod($event, period, true)"
          [class.active]="meridian == period"
          [attr.data-automation-id]="period"
        >
          <item-content>{{ period }}</item-content>
        </novo-list-item>
      </novo-list>
    </div>
    <div class="analog" *ngIf="analog">
      <div class="analog--inner">
        <div class="analog--face">
          <span class="analog--center"></span>
          <span class="analog--hand--hours" [ngClass]="hoursClass">
            <span class="analog--ball"></span>
          </span>
          <span class="analog--hand--minutes" [ngClass]="minutesClass">
            <span class="analog--ball" [ngClass]="{ between: inBetween }"></span>
          </span>
        </div>
        <div class="analog--hours">
          <span
            *ngFor="let hour of HOURS"
            class="analog--hour"
            [ngClass]="{ active: activeHour == hour }"
            (click)="setHours($event, hour, true)"
            [attr.data-automation-id]="hour"
            >{{ hour }}</span
          >
        </div>
        <div class="analog--minutes">
          <span
            *ngFor="let minute of MINUTES"
            class="analog--minute"
            [ngClass]="{ active: activeMinute == minute }"
            (click)="setMinutes($event, minute, true)"
            [attr.data-automation-id]="minute"
            >{{ minute }}</span
          >
        </div>
      </div>
    </div>
    <div class="save-cancel-buttons" *ngIf="hasButtons">
      <novo-button
          class="cancel-button"
          theme="dialogue"
          size="small"
          (click)="cancel()">{{ labels.cancel }}</novo-button>
      <novo-button
          class="save-button"
          theme="primary"
          color="primary"
          size="small"
          [disabled]="saveDisabled"
          (click)="save()">{{ labels.save }}</novo-button>
    </div>
  `, isInline: true, styles: [":host{display:block;width:min-content;overflow:hidden;border-radius:4px;background-color:var(--background-bright);box-shadow:0 1px 3px #00000026,0 2px 7px #0000001a;z-index:1000}:host .digital{background-color:var(--selection);display:flex;justify-content:center}:host .digital.inline{background:#fff;border-bottom:1px solid #f0f0f0}:host .digital.inline.military{border-bottom:none}:host .digital.inline .digital--inner{flex:1}:host .digital.inline .digital--inner .control-block{display:flex;flex:1}:host .digital.inline .digital--inner .control-block .digital--period{color:var(--selection);cursor:pointer;font-size:1em;opacity:.6;padding:1rem;flex:1}:host .digital.inline .digital--inner .control-block .digital--period.active{opacity:1;background-color:var(--selection);color:#fff}:host .digital--inner{display:flex;text-align:center;align-items:center;justify-content:center}:host .digital--clock{color:#fff;font-size:1.8em;font-weight:500}:host .control-block{display:inline-block}:host .digital--period{display:block;color:#fff;cursor:pointer;font-size:1em;opacity:.6;text-transform:uppercase;font-weight:400}:host .digital--period.active{opacity:1;font-weight:600}:host .increments{position:relative;height:250px;width:auto;display:flex;flex-flow:row nowrap}:host .increments novo-list{overflow-y:auto;overflow-x:hidden;height:100%;flex:1;scroll-snap-type:y mandatory;-ms-overflow-style:none;scrollbar-width:none}:host .increments novo-list::-webkit-scrollbar{display:none}:host .increments .increments--hour,:host .increments .increments--minute,:host .increments .increments--meridian{padding:5px 16px;width:50px;scroll-snap-align:start}:host .increments .increments--hour ::ng-deep .list-item,:host .increments .increments--minute ::ng-deep .list-item,:host .increments .increments--meridian ::ng-deep .list-item{line-height:19px}:host .increments .increments--hour:focus,:host .increments .increments--hour:hover,:host .increments .increments--minute:focus,:host .increments .increments--minute:hover,:host .increments .increments--meridian:focus,:host .increments .increments--meridian:hover{background:var(--selection);color:var(--text-selection);filter:brightness(1.25)}:host .increments .increments--hour.active,:host .increments .increments--minute.active,:host .increments .increments--meridian.active{background:var(--selection);color:var(--text-selection);font-weight:500}:host .analog{height:250px;width:250px;position:relative;margin:10% auto}:host .analog--inner{inset:0;width:100%;position:absolute;transition:transform 125ms linear}:host .analog--face{inset:5px;position:absolute;border-radius:50%}:host .analog--hand--hours{width:240px;height:240px;display:block;position:absolute;top:0;border-radius:50%;transform:rotate(0);transition:transform .1s linear;z-index:1}:host .analog--hand--hours:before{content:\" \";width:2px;top:0;bottom:0;left:30%;margin:30%;z-index:-1;display:block;position:absolute;transform:rotate(90deg)}:host .analog--hand--hours .analog--ball{height:3rem;width:3rem;display:block;right:3.2rem;top:50%;margin-top:-1.5rem;border-radius:50%;position:absolute;border:3px solid var(--selection);background:var(--selection)}:host .analog--hand--hours.hour-12{transform:rotate(-90deg)}:host .analog--hand--hours.hour-1{transform:rotate(-60deg)}:host .analog--hand--hours.hour-2{transform:rotate(-30deg)}:host .analog--hand--hours.hour-3{transform:rotate(0)}:host .analog--hand--hours.hour-4{transform:rotate(30deg)}:host .analog--hand--hours.hour-5{transform:rotate(60deg)}:host .analog--hand--hours.hour-6{transform:rotate(90deg)}:host .analog--hand--hours.hour-7{transform:rotate(120deg)}:host .analog--hand--hours.hour-8{transform:rotate(150deg)}:host .analog--hand--hours.hour-9{transform:rotate(180deg)}:host .analog--hand--hours.hour-10{transform:rotate(210deg)}:host .analog--hand--hours.hour-11{transform:rotate(240deg)}:host .analog--hand--minutes{width:200px;height:200px;margin:20px;display:block;position:absolute;top:0;border-radius:50%;transform:rotate(0);transition:transform .1s linear;z-index:1}:host .analog--hand--minutes:before{left:23%;margin:33%;content:\" \";width:2px;top:0;bottom:0;z-index:-1;display:block;position:absolute;transform:rotate(90deg)}:host .analog--hand--minutes .analog--ball{display:block;top:50%;border-radius:50%;position:absolute;height:2.4rem;width:2.4rem;right:4.2rem;margin-top:-1.2rem;border:2px solid var(--selection);background:var(--selection);transition:all .16s ease-in-out}:host .analog--hand--minutes .analog--ball.between{height:1px;border-radius:2em;margin-top:0}:host .analog--hand--minutes.min-00{transform:rotate(-90deg)}:host .analog--hand--minutes.min-01{transform:rotate(-84deg)}:host .analog--hand--minutes.min-02{transform:rotate(-78deg)}:host .analog--hand--minutes.min-03{transform:rotate(-72deg)}:host .analog--hand--minutes.min-04{transform:rotate(-66deg)}:host .analog--hand--minutes.min-05{transform:rotate(-60deg)}:host .analog--hand--minutes.min-06{transform:rotate(-54deg)}:host .analog--hand--minutes.min-07{transform:rotate(-48deg)}:host .analog--hand--minutes.min-08{transform:rotate(-42deg)}:host .analog--hand--minutes.min-09{transform:rotate(-36deg)}:host .analog--hand--minutes.min-10{transform:rotate(-30deg)}:host .analog--hand--minutes.min-11{transform:rotate(-24deg)}:host .analog--hand--minutes.min-12{transform:rotate(-18deg)}:host .analog--hand--minutes.min-13{transform:rotate(-12deg)}:host .analog--hand--minutes.min-14{transform:rotate(-6deg)}:host .analog--hand--minutes.min-15{transform:rotate(0)}:host .analog--hand--minutes.min-16{transform:rotate(6deg)}:host .analog--hand--minutes.min-17{transform:rotate(12deg)}:host .analog--hand--minutes.min-18{transform:rotate(18deg)}:host .analog--hand--minutes.min-19{transform:rotate(24deg)}:host .analog--hand--minutes.min-20{transform:rotate(30deg)}:host .analog--hand--minutes.min-21{transform:rotate(36deg)}:host .analog--hand--minutes.min-22{transform:rotate(42deg)}:host .analog--hand--minutes.min-23{transform:rotate(48deg)}:host .analog--hand--minutes.min-24{transform:rotate(54deg)}:host .analog--hand--minutes.min-25{transform:rotate(60deg)}:host .analog--hand--minutes.min-26{transform:rotate(66deg)}:host .analog--hand--minutes.min-27{transform:rotate(72deg)}:host .analog--hand--minutes.min-28{transform:rotate(78deg)}:host .analog--hand--minutes.min-29{transform:rotate(84deg)}:host .analog--hand--minutes.min-30{transform:rotate(90deg)}:host .analog--hand--minutes.min-31{transform:rotate(96deg)}:host .analog--hand--minutes.min-32{transform:rotate(102deg)}:host .analog--hand--minutes.min-33{transform:rotate(108deg)}:host .analog--hand--minutes.min-34{transform:rotate(114deg)}:host .analog--hand--minutes.min-35{transform:rotate(120deg)}:host .analog--hand--minutes.min-36{transform:rotate(126deg)}:host .analog--hand--minutes.min-37{transform:rotate(132deg)}:host .analog--hand--minutes.min-38{transform:rotate(138deg)}:host .analog--hand--minutes.min-39{transform:rotate(144deg)}:host .analog--hand--minutes.min-40{transform:rotate(150deg)}:host .analog--hand--minutes.min-41{transform:rotate(156deg)}:host .analog--hand--minutes.min-42{transform:rotate(162deg)}:host .analog--hand--minutes.min-43{transform:rotate(168deg)}:host .analog--hand--minutes.min-44{transform:rotate(174deg)}:host .analog--hand--minutes.min-45{transform:rotate(180deg)}:host .analog--hand--minutes.min-46{transform:rotate(186deg)}:host .analog--hand--minutes.min-47{transform:rotate(192deg)}:host .analog--hand--minutes.min-48{transform:rotate(198deg)}:host .analog--hand--minutes.min-49{transform:rotate(204deg)}:host .analog--hand--minutes.min-50{transform:rotate(210deg)}:host .analog--hand--minutes.min-51{transform:rotate(216deg)}:host .analog--hand--minutes.min-52{transform:rotate(222deg)}:host .analog--hand--minutes.min-53{transform:rotate(228deg)}:host .analog--hand--minutes.min-54{transform:rotate(234deg)}:host .analog--hand--minutes.min-55{transform:rotate(240deg)}:host .analog--hand--minutes.min-56{transform:rotate(246deg)}:host .analog--hand--minutes.min-57{transform:rotate(252deg)}:host .analog--hand--minutes.min-58{transform:rotate(258deg)}:host .analog--hand--minutes.min-59{transform:rotate(264deg)}:host .analog--center{height:12rem;width:12rem;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1;margin-top:1px;margin-left:1px;display:block;position:absolute;background-color:#f7f7f7}:host .analog--hour,:host .analog--minute{font-size:1.6rem;color:#666;left:50%;top:50%;z-index:3;text-align:center;width:40px;padding:8px 0;border-radius:50%;cursor:pointer;margin-left:-20px;margin-top:-20px;position:absolute}:host .analog--hour.active,:host .analog--minute.active{color:#fff}:host .analog--minute{font-size:1rem;margin-left:-20px;margin-top:-16px}:host .analog--hours,:host .analog--minutes{width:250px;height:250px;float:left;position:relative}:host .analog--minutes{position:absolute}:host .analog--hour:nth-child(1){transform:rotate(-60deg) translate(4.5em) rotate(60deg)}:host .analog--minute:nth-child(1){transform:rotate(-60deg) translate(4.5em) rotate(60deg)}:host .analog--hour:nth-child(2){transform:rotate(-30deg) translate(4.5em) rotate(30deg)}:host .analog--minute:nth-child(2){transform:rotate(-30deg) translate(4.5em) rotate(30deg)}:host .analog--hour:nth-child(3){transform:rotate(0) translate(4.5em) rotate(0)}:host .analog--minute:nth-child(3){transform:rotate(0) translate(4.5em) rotate(0)}:host .analog--hour:nth-child(4){transform:rotate(30deg) translate(4.5em) rotate(-30deg)}:host .analog--minute:nth-child(4){transform:rotate(30deg) translate(4.5em) rotate(-30deg)}:host .analog--hour:nth-child(5){transform:rotate(60deg) translate(4.5em) rotate(-60deg)}:host .analog--minute:nth-child(5){transform:rotate(60deg) translate(4.5em) rotate(-60deg)}:host .analog--hour:nth-child(6){transform:rotate(90deg) translate(4.5em) rotate(-90deg)}:host .analog--minute:nth-child(6){transform:rotate(90deg) translate(4.5em) rotate(-90deg)}:host .analog--hour:nth-child(7){transform:rotate(120deg) translate(4.5em) rotate(-120deg)}:host .analog--minute:nth-child(7){transform:rotate(120deg) translate(4.5em) rotate(-120deg)}:host .analog--hour:nth-child(8){transform:rotate(150deg) translate(4.5em) rotate(-150deg)}:host .analog--minute:nth-child(8){transform:rotate(150deg) translate(4.5em) rotate(-150deg)}:host .analog--hour:nth-child(9){transform:rotate(180deg) translate(4.5em) rotate(-180deg)}:host .analog--minute:nth-child(9){transform:rotate(180deg) translate(4.5em) rotate(-180deg)}:host .analog--hour:nth-child(10){transform:rotate(210deg) translate(4.5em) rotate(-210deg)}:host .analog--minute:nth-child(10){transform:rotate(210deg) translate(4.5em) rotate(-210deg)}:host .analog--hour:nth-child(11){transform:rotate(240deg) translate(4.5em) rotate(-240deg)}:host .analog--minute:nth-child(11){transform:rotate(240deg) translate(4.5em) rotate(-240deg)}:host .analog--hour:nth-child(12){transform:rotate(270deg) translate(4.5em) rotate(-270deg)}:host .analog--minute:nth-child(12){transform:rotate(270deg) translate(4.5em) rotate(-270deg)}:host.military .analog--hour:nth-child(1){transform:rotate(-90deg) translate(8rem) rotate(90deg)}:host.military .analog--hand--hours.hour-0{transform:rotate(-90deg)}:host.military .analog--hour:nth-child(2){transform:rotate(-75deg) translate(8rem) rotate(75deg)}:host.military .analog--hand--hours.hour-1{transform:rotate(-75deg)}:host.military .analog--hour:nth-child(3){transform:rotate(-60deg) translate(8rem) rotate(60deg)}:host.military .analog--hand--hours.hour-2{transform:rotate(-60deg)}:host.military .analog--hour:nth-child(4){transform:rotate(-45deg) translate(8rem) rotate(45deg)}:host.military .analog--hand--hours.hour-3{transform:rotate(-45deg)}:host.military .analog--hour:nth-child(5){transform:rotate(-30deg) translate(8rem) rotate(30deg)}:host.military .analog--hand--hours.hour-4{transform:rotate(-30deg)}:host.military .analog--hour:nth-child(6){transform:rotate(-15deg) translate(8rem) rotate(15deg)}:host.military .analog--hand--hours.hour-5{transform:rotate(-15deg)}:host.military .analog--hour:nth-child(7){transform:rotate(0) translate(8rem) rotate(0)}:host.military .analog--hand--hours.hour-6{transform:rotate(0)}:host.military .analog--hour:nth-child(8){transform:rotate(15deg) translate(8rem) rotate(-15deg)}:host.military .analog--hand--hours.hour-7{transform:rotate(15deg)}:host.military .analog--hour:nth-child(9){transform:rotate(30deg) translate(8rem) rotate(-30deg)}:host.military .analog--hand--hours.hour-8{transform:rotate(30deg)}:host.military .analog--hour:nth-child(10){transform:rotate(45deg) translate(8rem) rotate(-45deg)}:host.military .analog--hand--hours.hour-9{transform:rotate(45deg)}:host.military .analog--hour:nth-child(11){transform:rotate(60deg) translate(8rem) rotate(-60deg)}:host.military .analog--hand--hours.hour-10{transform:rotate(60deg)}:host.military .analog--hour:nth-child(12){transform:rotate(75deg) translate(8rem) rotate(-75deg)}:host.military .analog--hand--hours.hour-11{transform:rotate(75deg)}:host.military .analog--hour:nth-child(13){transform:rotate(90deg) translate(8rem) rotate(-90deg)}:host.military .analog--hand--hours.hour-12{transform:rotate(90deg)}:host.military .analog--hour:nth-child(14){transform:rotate(105deg) translate(8rem) rotate(-105deg)}:host.military .analog--hand--hours.hour-13{transform:rotate(105deg)}:host.military .analog--hour:nth-child(15){transform:rotate(120deg) translate(8rem) rotate(-120deg)}:host.military .analog--hand--hours.hour-14{transform:rotate(120deg)}:host.military .analog--hour:nth-child(16){transform:rotate(135deg) translate(8rem) rotate(-135deg)}:host.military .analog--hand--hours.hour-15{transform:rotate(135deg)}:host.military .analog--hour:nth-child(17){transform:rotate(150deg) translate(8rem) rotate(-150deg)}:host.military .analog--hand--hours.hour-16{transform:rotate(150deg)}:host.military .analog--hour:nth-child(18){transform:rotate(165deg) translate(8rem) rotate(-165deg)}:host.military .analog--hand--hours.hour-17{transform:rotate(165deg)}:host.military .analog--hour:nth-child(19){transform:rotate(180deg) translate(8rem) rotate(-180deg)}:host.military .analog--hand--hours.hour-18{transform:rotate(180deg)}:host.military .analog--hour:nth-child(20){transform:rotate(195deg) translate(8rem) rotate(-195deg)}:host.military .analog--hand--hours.hour-19{transform:rotate(195deg)}:host.military .analog--hour:nth-child(21){transform:rotate(210deg) translate(8rem) rotate(-210deg)}:host.military .analog--hand--hours.hour-20{transform:rotate(210deg)}:host.military .analog--hour:nth-child(22){transform:rotate(225deg) translate(8rem) rotate(-225deg)}:host.military .analog--hand--hours.hour-21{transform:rotate(225deg)}:host.military .analog--hour:nth-child(23){transform:rotate(240deg) translate(8rem) rotate(-240deg)}:host.military .analog--hand--hours.hour-22{transform:rotate(240deg)}:host.military .analog--hour:nth-child(24){transform:rotate(255deg) translate(8rem) rotate(-255deg)}:host.military .analog--hand--hours{top:-10px;left:-10px}:host.military .analog--hand--hours.hour-23{transform:rotate(255deg)}:host.military .analog--face{inset:15px}:host.military .analog--hour{font-size:.9rem;margin-left:-2rem;margin-top:-1.2rem}:host.military .analog--hand--minutes{margin:10px}:host.military .analog--hand--hours .analog--ball{height:2.8rem;width:2.8rem;right:2.7rem;margin-top:-1.4rem}:host.hasButtons{border-radius:4px 4px 0 0}:host.hasButtons.military .increments--hour,:host.hasButtons.military .increments--minute{width:auto}:host.hasButtons .save-cancel-buttons{background:var(--background-main);display:flex;align-items:center;justify-content:flex-end;padding:1rem;gap:.5rem;border-radius:0 0 4px 4px;box-shadow:0 1px 3px #00000026,0 2px 7px #0000001a}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.NovoListElement, selector: "novo-list", inputs: ["theme", "direction"] }, { kind: "component", type: i3.NovoListItemElement, selector: "novo-list-item, a[list-item], button[list-item]" }, { kind: "component", type: i3.NovoItemContentElement, selector: "item-content, novo-item-content", inputs: ["direction"] }, { kind: "component", type: i4.NovoButtonElement, selector: "novo-button,button[theme]", inputs: ["color", "side", "size", "theme", "loading", "icon", "secondIcon", "disabled"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoTimePickerElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-time-picker', providers: [TIME_PICKER_VALUE_ACCESSOR], template: `
    <!-- <div class="digital" [class.inline]="inline" [class.military]="military" *ngIf="inline">
      <div class="digital--inner">
        <span class="digital--clock" *ngIf="analog">
          <span class="hours" data-automation-id="novo-time-picker-hours">{{ hours }}</span
          >:<span class="minutes" data-automation-id="novo-time-picker-minutes">{{ minutes }}</span>
        </span>
        <div class="control-block" *ngIf="!military && analog">
          <span
            *ngFor="let period of MERIDIANS"
            class="digital--period"
            [class.active]="meridian == period"
            (click)="setPeriod($event, period, true)"
            [attr.data-automation-id]="period"
            >{{ period }}</span
          >
        </div>
      </div>
    </div> -->
    <div class="increments" *ngIf="!analog">
      <novo-list class="increments--hours" direction="vertical" data-automation-id="novo-time-picker-hours">
        <novo-list-item
          class="increments--hour"
          *ngFor="let increment of HOURS"
          (click)="setHours($event, increment, true)"
          [class.active]="increment == activeHour"
          [attr.data-automation-id]="increment"
        >
          <item-content>{{ increment }}</item-content>
        </novo-list-item>
      </novo-list>
      <novo-list class="increments--minutes" direction="vertical" data-automation-id="novo-time-picker-minutes">
        <novo-list-item
          class="increments--minute"
          *ngFor="let increment of MINUTES"
          (click)="setMinutes($event, increment, true)"
          [class.active]="increment == activeMinute"
          [attr.data-automation-id]="increment"
        >
          <item-content>{{ increment }}</item-content>
        </novo-list-item>
      </novo-list>
      <novo-list class="increments--meridians" direction="vertical" *ngIf="!military" data-automation-id="novo-time-picker-meridians">
        <novo-list-item
          class="increments--meridian"
          *ngFor="let period of MERIDIANS"
          (click)="setPeriod($event, period, true)"
          [class.active]="meridian == period"
          [attr.data-automation-id]="period"
        >
          <item-content>{{ period }}</item-content>
        </novo-list-item>
      </novo-list>
    </div>
    <div class="analog" *ngIf="analog">
      <div class="analog--inner">
        <div class="analog--face">
          <span class="analog--center"></span>
          <span class="analog--hand--hours" [ngClass]="hoursClass">
            <span class="analog--ball"></span>
          </span>
          <span class="analog--hand--minutes" [ngClass]="minutesClass">
            <span class="analog--ball" [ngClass]="{ between: inBetween }"></span>
          </span>
        </div>
        <div class="analog--hours">
          <span
            *ngFor="let hour of HOURS"
            class="analog--hour"
            [ngClass]="{ active: activeHour == hour }"
            (click)="setHours($event, hour, true)"
            [attr.data-automation-id]="hour"
            >{{ hour }}</span
          >
        </div>
        <div class="analog--minutes">
          <span
            *ngFor="let minute of MINUTES"
            class="analog--minute"
            [ngClass]="{ active: activeMinute == minute }"
            (click)="setMinutes($event, minute, true)"
            [attr.data-automation-id]="minute"
            >{{ minute }}</span
          >
        </div>
      </div>
    </div>
    <div class="save-cancel-buttons" *ngIf="hasButtons">
      <novo-button
          class="cancel-button"
          theme="dialogue"
          size="small"
          (click)="cancel()">{{ labels.cancel }}</novo-button>
      <novo-button
          class="save-button"
          theme="primary"
          color="primary"
          size="small"
          [disabled]="saveDisabled"
          (click)="save()">{{ labels.save }}</novo-button>
    </div>
  `, host: {
                        class: 'novo-time-picker',
                        '[class.military]': 'military',
                    }, styles: [":host{display:block;width:min-content;overflow:hidden;border-radius:4px;background-color:var(--background-bright);box-shadow:0 1px 3px #00000026,0 2px 7px #0000001a;z-index:1000}:host .digital{background-color:var(--selection);display:flex;justify-content:center}:host .digital.inline{background:#fff;border-bottom:1px solid #f0f0f0}:host .digital.inline.military{border-bottom:none}:host .digital.inline .digital--inner{flex:1}:host .digital.inline .digital--inner .control-block{display:flex;flex:1}:host .digital.inline .digital--inner .control-block .digital--period{color:var(--selection);cursor:pointer;font-size:1em;opacity:.6;padding:1rem;flex:1}:host .digital.inline .digital--inner .control-block .digital--period.active{opacity:1;background-color:var(--selection);color:#fff}:host .digital--inner{display:flex;text-align:center;align-items:center;justify-content:center}:host .digital--clock{color:#fff;font-size:1.8em;font-weight:500}:host .control-block{display:inline-block}:host .digital--period{display:block;color:#fff;cursor:pointer;font-size:1em;opacity:.6;text-transform:uppercase;font-weight:400}:host .digital--period.active{opacity:1;font-weight:600}:host .increments{position:relative;height:250px;width:auto;display:flex;flex-flow:row nowrap}:host .increments novo-list{overflow-y:auto;overflow-x:hidden;height:100%;flex:1;scroll-snap-type:y mandatory;-ms-overflow-style:none;scrollbar-width:none}:host .increments novo-list::-webkit-scrollbar{display:none}:host .increments .increments--hour,:host .increments .increments--minute,:host .increments .increments--meridian{padding:5px 16px;width:50px;scroll-snap-align:start}:host .increments .increments--hour ::ng-deep .list-item,:host .increments .increments--minute ::ng-deep .list-item,:host .increments .increments--meridian ::ng-deep .list-item{line-height:19px}:host .increments .increments--hour:focus,:host .increments .increments--hour:hover,:host .increments .increments--minute:focus,:host .increments .increments--minute:hover,:host .increments .increments--meridian:focus,:host .increments .increments--meridian:hover{background:var(--selection);color:var(--text-selection);filter:brightness(1.25)}:host .increments .increments--hour.active,:host .increments .increments--minute.active,:host .increments .increments--meridian.active{background:var(--selection);color:var(--text-selection);font-weight:500}:host .analog{height:250px;width:250px;position:relative;margin:10% auto}:host .analog--inner{inset:0;width:100%;position:absolute;transition:transform 125ms linear}:host .analog--face{inset:5px;position:absolute;border-radius:50%}:host .analog--hand--hours{width:240px;height:240px;display:block;position:absolute;top:0;border-radius:50%;transform:rotate(0);transition:transform .1s linear;z-index:1}:host .analog--hand--hours:before{content:\" \";width:2px;top:0;bottom:0;left:30%;margin:30%;z-index:-1;display:block;position:absolute;transform:rotate(90deg)}:host .analog--hand--hours .analog--ball{height:3rem;width:3rem;display:block;right:3.2rem;top:50%;margin-top:-1.5rem;border-radius:50%;position:absolute;border:3px solid var(--selection);background:var(--selection)}:host .analog--hand--hours.hour-12{transform:rotate(-90deg)}:host .analog--hand--hours.hour-1{transform:rotate(-60deg)}:host .analog--hand--hours.hour-2{transform:rotate(-30deg)}:host .analog--hand--hours.hour-3{transform:rotate(0)}:host .analog--hand--hours.hour-4{transform:rotate(30deg)}:host .analog--hand--hours.hour-5{transform:rotate(60deg)}:host .analog--hand--hours.hour-6{transform:rotate(90deg)}:host .analog--hand--hours.hour-7{transform:rotate(120deg)}:host .analog--hand--hours.hour-8{transform:rotate(150deg)}:host .analog--hand--hours.hour-9{transform:rotate(180deg)}:host .analog--hand--hours.hour-10{transform:rotate(210deg)}:host .analog--hand--hours.hour-11{transform:rotate(240deg)}:host .analog--hand--minutes{width:200px;height:200px;margin:20px;display:block;position:absolute;top:0;border-radius:50%;transform:rotate(0);transition:transform .1s linear;z-index:1}:host .analog--hand--minutes:before{left:23%;margin:33%;content:\" \";width:2px;top:0;bottom:0;z-index:-1;display:block;position:absolute;transform:rotate(90deg)}:host .analog--hand--minutes .analog--ball{display:block;top:50%;border-radius:50%;position:absolute;height:2.4rem;width:2.4rem;right:4.2rem;margin-top:-1.2rem;border:2px solid var(--selection);background:var(--selection);transition:all .16s ease-in-out}:host .analog--hand--minutes .analog--ball.between{height:1px;border-radius:2em;margin-top:0}:host .analog--hand--minutes.min-00{transform:rotate(-90deg)}:host .analog--hand--minutes.min-01{transform:rotate(-84deg)}:host .analog--hand--minutes.min-02{transform:rotate(-78deg)}:host .analog--hand--minutes.min-03{transform:rotate(-72deg)}:host .analog--hand--minutes.min-04{transform:rotate(-66deg)}:host .analog--hand--minutes.min-05{transform:rotate(-60deg)}:host .analog--hand--minutes.min-06{transform:rotate(-54deg)}:host .analog--hand--minutes.min-07{transform:rotate(-48deg)}:host .analog--hand--minutes.min-08{transform:rotate(-42deg)}:host .analog--hand--minutes.min-09{transform:rotate(-36deg)}:host .analog--hand--minutes.min-10{transform:rotate(-30deg)}:host .analog--hand--minutes.min-11{transform:rotate(-24deg)}:host .analog--hand--minutes.min-12{transform:rotate(-18deg)}:host .analog--hand--minutes.min-13{transform:rotate(-12deg)}:host .analog--hand--minutes.min-14{transform:rotate(-6deg)}:host .analog--hand--minutes.min-15{transform:rotate(0)}:host .analog--hand--minutes.min-16{transform:rotate(6deg)}:host .analog--hand--minutes.min-17{transform:rotate(12deg)}:host .analog--hand--minutes.min-18{transform:rotate(18deg)}:host .analog--hand--minutes.min-19{transform:rotate(24deg)}:host .analog--hand--minutes.min-20{transform:rotate(30deg)}:host .analog--hand--minutes.min-21{transform:rotate(36deg)}:host .analog--hand--minutes.min-22{transform:rotate(42deg)}:host .analog--hand--minutes.min-23{transform:rotate(48deg)}:host .analog--hand--minutes.min-24{transform:rotate(54deg)}:host .analog--hand--minutes.min-25{transform:rotate(60deg)}:host .analog--hand--minutes.min-26{transform:rotate(66deg)}:host .analog--hand--minutes.min-27{transform:rotate(72deg)}:host .analog--hand--minutes.min-28{transform:rotate(78deg)}:host .analog--hand--minutes.min-29{transform:rotate(84deg)}:host .analog--hand--minutes.min-30{transform:rotate(90deg)}:host .analog--hand--minutes.min-31{transform:rotate(96deg)}:host .analog--hand--minutes.min-32{transform:rotate(102deg)}:host .analog--hand--minutes.min-33{transform:rotate(108deg)}:host .analog--hand--minutes.min-34{transform:rotate(114deg)}:host .analog--hand--minutes.min-35{transform:rotate(120deg)}:host .analog--hand--minutes.min-36{transform:rotate(126deg)}:host .analog--hand--minutes.min-37{transform:rotate(132deg)}:host .analog--hand--minutes.min-38{transform:rotate(138deg)}:host .analog--hand--minutes.min-39{transform:rotate(144deg)}:host .analog--hand--minutes.min-40{transform:rotate(150deg)}:host .analog--hand--minutes.min-41{transform:rotate(156deg)}:host .analog--hand--minutes.min-42{transform:rotate(162deg)}:host .analog--hand--minutes.min-43{transform:rotate(168deg)}:host .analog--hand--minutes.min-44{transform:rotate(174deg)}:host .analog--hand--minutes.min-45{transform:rotate(180deg)}:host .analog--hand--minutes.min-46{transform:rotate(186deg)}:host .analog--hand--minutes.min-47{transform:rotate(192deg)}:host .analog--hand--minutes.min-48{transform:rotate(198deg)}:host .analog--hand--minutes.min-49{transform:rotate(204deg)}:host .analog--hand--minutes.min-50{transform:rotate(210deg)}:host .analog--hand--minutes.min-51{transform:rotate(216deg)}:host .analog--hand--minutes.min-52{transform:rotate(222deg)}:host .analog--hand--minutes.min-53{transform:rotate(228deg)}:host .analog--hand--minutes.min-54{transform:rotate(234deg)}:host .analog--hand--minutes.min-55{transform:rotate(240deg)}:host .analog--hand--minutes.min-56{transform:rotate(246deg)}:host .analog--hand--minutes.min-57{transform:rotate(252deg)}:host .analog--hand--minutes.min-58{transform:rotate(258deg)}:host .analog--hand--minutes.min-59{transform:rotate(264deg)}:host .analog--center{height:12rem;width:12rem;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1;margin-top:1px;margin-left:1px;display:block;position:absolute;background-color:#f7f7f7}:host .analog--hour,:host .analog--minute{font-size:1.6rem;color:#666;left:50%;top:50%;z-index:3;text-align:center;width:40px;padding:8px 0;border-radius:50%;cursor:pointer;margin-left:-20px;margin-top:-20px;position:absolute}:host .analog--hour.active,:host .analog--minute.active{color:#fff}:host .analog--minute{font-size:1rem;margin-left:-20px;margin-top:-16px}:host .analog--hours,:host .analog--minutes{width:250px;height:250px;float:left;position:relative}:host .analog--minutes{position:absolute}:host .analog--hour:nth-child(1){transform:rotate(-60deg) translate(4.5em) rotate(60deg)}:host .analog--minute:nth-child(1){transform:rotate(-60deg) translate(4.5em) rotate(60deg)}:host .analog--hour:nth-child(2){transform:rotate(-30deg) translate(4.5em) rotate(30deg)}:host .analog--minute:nth-child(2){transform:rotate(-30deg) translate(4.5em) rotate(30deg)}:host .analog--hour:nth-child(3){transform:rotate(0) translate(4.5em) rotate(0)}:host .analog--minute:nth-child(3){transform:rotate(0) translate(4.5em) rotate(0)}:host .analog--hour:nth-child(4){transform:rotate(30deg) translate(4.5em) rotate(-30deg)}:host .analog--minute:nth-child(4){transform:rotate(30deg) translate(4.5em) rotate(-30deg)}:host .analog--hour:nth-child(5){transform:rotate(60deg) translate(4.5em) rotate(-60deg)}:host .analog--minute:nth-child(5){transform:rotate(60deg) translate(4.5em) rotate(-60deg)}:host .analog--hour:nth-child(6){transform:rotate(90deg) translate(4.5em) rotate(-90deg)}:host .analog--minute:nth-child(6){transform:rotate(90deg) translate(4.5em) rotate(-90deg)}:host .analog--hour:nth-child(7){transform:rotate(120deg) translate(4.5em) rotate(-120deg)}:host .analog--minute:nth-child(7){transform:rotate(120deg) translate(4.5em) rotate(-120deg)}:host .analog--hour:nth-child(8){transform:rotate(150deg) translate(4.5em) rotate(-150deg)}:host .analog--minute:nth-child(8){transform:rotate(150deg) translate(4.5em) rotate(-150deg)}:host .analog--hour:nth-child(9){transform:rotate(180deg) translate(4.5em) rotate(-180deg)}:host .analog--minute:nth-child(9){transform:rotate(180deg) translate(4.5em) rotate(-180deg)}:host .analog--hour:nth-child(10){transform:rotate(210deg) translate(4.5em) rotate(-210deg)}:host .analog--minute:nth-child(10){transform:rotate(210deg) translate(4.5em) rotate(-210deg)}:host .analog--hour:nth-child(11){transform:rotate(240deg) translate(4.5em) rotate(-240deg)}:host .analog--minute:nth-child(11){transform:rotate(240deg) translate(4.5em) rotate(-240deg)}:host .analog--hour:nth-child(12){transform:rotate(270deg) translate(4.5em) rotate(-270deg)}:host .analog--minute:nth-child(12){transform:rotate(270deg) translate(4.5em) rotate(-270deg)}:host.military .analog--hour:nth-child(1){transform:rotate(-90deg) translate(8rem) rotate(90deg)}:host.military .analog--hand--hours.hour-0{transform:rotate(-90deg)}:host.military .analog--hour:nth-child(2){transform:rotate(-75deg) translate(8rem) rotate(75deg)}:host.military .analog--hand--hours.hour-1{transform:rotate(-75deg)}:host.military .analog--hour:nth-child(3){transform:rotate(-60deg) translate(8rem) rotate(60deg)}:host.military .analog--hand--hours.hour-2{transform:rotate(-60deg)}:host.military .analog--hour:nth-child(4){transform:rotate(-45deg) translate(8rem) rotate(45deg)}:host.military .analog--hand--hours.hour-3{transform:rotate(-45deg)}:host.military .analog--hour:nth-child(5){transform:rotate(-30deg) translate(8rem) rotate(30deg)}:host.military .analog--hand--hours.hour-4{transform:rotate(-30deg)}:host.military .analog--hour:nth-child(6){transform:rotate(-15deg) translate(8rem) rotate(15deg)}:host.military .analog--hand--hours.hour-5{transform:rotate(-15deg)}:host.military .analog--hour:nth-child(7){transform:rotate(0) translate(8rem) rotate(0)}:host.military .analog--hand--hours.hour-6{transform:rotate(0)}:host.military .analog--hour:nth-child(8){transform:rotate(15deg) translate(8rem) rotate(-15deg)}:host.military .analog--hand--hours.hour-7{transform:rotate(15deg)}:host.military .analog--hour:nth-child(9){transform:rotate(30deg) translate(8rem) rotate(-30deg)}:host.military .analog--hand--hours.hour-8{transform:rotate(30deg)}:host.military .analog--hour:nth-child(10){transform:rotate(45deg) translate(8rem) rotate(-45deg)}:host.military .analog--hand--hours.hour-9{transform:rotate(45deg)}:host.military .analog--hour:nth-child(11){transform:rotate(60deg) translate(8rem) rotate(-60deg)}:host.military .analog--hand--hours.hour-10{transform:rotate(60deg)}:host.military .analog--hour:nth-child(12){transform:rotate(75deg) translate(8rem) rotate(-75deg)}:host.military .analog--hand--hours.hour-11{transform:rotate(75deg)}:host.military .analog--hour:nth-child(13){transform:rotate(90deg) translate(8rem) rotate(-90deg)}:host.military .analog--hand--hours.hour-12{transform:rotate(90deg)}:host.military .analog--hour:nth-child(14){transform:rotate(105deg) translate(8rem) rotate(-105deg)}:host.military .analog--hand--hours.hour-13{transform:rotate(105deg)}:host.military .analog--hour:nth-child(15){transform:rotate(120deg) translate(8rem) rotate(-120deg)}:host.military .analog--hand--hours.hour-14{transform:rotate(120deg)}:host.military .analog--hour:nth-child(16){transform:rotate(135deg) translate(8rem) rotate(-135deg)}:host.military .analog--hand--hours.hour-15{transform:rotate(135deg)}:host.military .analog--hour:nth-child(17){transform:rotate(150deg) translate(8rem) rotate(-150deg)}:host.military .analog--hand--hours.hour-16{transform:rotate(150deg)}:host.military .analog--hour:nth-child(18){transform:rotate(165deg) translate(8rem) rotate(-165deg)}:host.military .analog--hand--hours.hour-17{transform:rotate(165deg)}:host.military .analog--hour:nth-child(19){transform:rotate(180deg) translate(8rem) rotate(-180deg)}:host.military .analog--hand--hours.hour-18{transform:rotate(180deg)}:host.military .analog--hour:nth-child(20){transform:rotate(195deg) translate(8rem) rotate(-195deg)}:host.military .analog--hand--hours.hour-19{transform:rotate(195deg)}:host.military .analog--hour:nth-child(21){transform:rotate(210deg) translate(8rem) rotate(-210deg)}:host.military .analog--hand--hours.hour-20{transform:rotate(210deg)}:host.military .analog--hour:nth-child(22){transform:rotate(225deg) translate(8rem) rotate(-225deg)}:host.military .analog--hand--hours.hour-21{transform:rotate(225deg)}:host.military .analog--hour:nth-child(23){transform:rotate(240deg) translate(8rem) rotate(-240deg)}:host.military .analog--hand--hours.hour-22{transform:rotate(240deg)}:host.military .analog--hour:nth-child(24){transform:rotate(255deg) translate(8rem) rotate(-255deg)}:host.military .analog--hand--hours{top:-10px;left:-10px}:host.military .analog--hand--hours.hour-23{transform:rotate(255deg)}:host.military .analog--face{inset:15px}:host.military .analog--hour{font-size:.9rem;margin-left:-2rem;margin-top:-1.2rem}:host.military .analog--hand--minutes{margin:10px}:host.military .analog--hand--hours .analog--ball{height:2.8rem;width:2.8rem;right:2.7rem;margin-top:-1.4rem}:host.hasButtons{border-radius:4px 4px 0 0}:host.hasButtons.military .increments--hour,:host.hasButtons.military .increments--minute{width:auto}:host.hasButtons .save-cancel-buttons{background:var(--background-main);display:flex;align-items:center;justify-content:flex-end;padding:1rem;gap:.5rem;border-radius:0 0 4px 4px;box-shadow:0 1px 3px #00000026,0 2px 7px #0000001a}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.NovoLabelService }, { type: i0.ChangeDetectorRef }], propDecorators: { military: [{
                type: Input
            }], analog: [{
                type: Input
            }], inline: [{
                type: Input
            }], step: [{
                type: Input
            }], hasButtons: [{
                type: Input
            }], saveDisabled: [{
                type: Input
            }], onSelect: [{
                type: Output
            }], onSave: [{
                type: Output
            }], onCancel: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltZVBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL3RpbWUtcGlja2VyL1RpbWVQaWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTTtBQUNOLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLEtBQUssRUFHTCxNQUFNLEdBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbkMsTUFBTTtBQUNOLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7Ozs7OztBQUV4RCxzREFBc0Q7QUFDdEQsTUFBTSwwQkFBMEIsR0FBRztJQUNqQyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUM7SUFDcEQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUYsTUFBTSxDQUFOLElBQVksa0JBR1g7QUFIRCxXQUFZLGtCQUFrQjtJQUM1Qix5Q0FBbUIsQ0FBQTtJQUNuQixtQ0FBYSxDQUFBO0FBQ2YsQ0FBQyxFQUhXLGtCQUFrQixLQUFsQixrQkFBa0IsUUFHN0I7QUFpSEQsTUFBTSxPQUFPLHFCQUFxQjtJQXVDaEMsT0FBTyxDQUFDLEdBQUc7UUFDVCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELFlBQ1MsT0FBbUIsRUFDbkIsTUFBd0IsRUFDckIsR0FBc0I7UUFG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R0FxR1Q7OzRGQU9VLHFCQUFxQjtrQkEvR2pDLFNBQVM7K0JBQ0Usa0JBQWtCLGFBQ2pCLENBQUMsMEJBQTBCLENBQUMsWUFDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUdULFFBRUs7d0JBQ0osS0FBSyxFQUFFLGtCQUFrQjt3QkFDekIsa0JBQWtCLEVBQUUsVUFBVTtxQkFDL0I7OElBSUQsUUFBUTtzQkFEUCxLQUFLO2dCQUdOLE1BQU07c0JBREwsS0FBSztnQkFHTixNQUFNO3NCQURMLEtBQUs7Z0JBR04sSUFBSTtzQkFESCxLQUFLO2dCQUdOLFVBQVU7c0JBRFQsS0FBSztnQkFHTixZQUFZO3NCQURYLEtBQUs7Z0JBSU4sUUFBUTtzQkFEUCxNQUFNO2dCQUdQLE1BQU07c0JBREwsTUFBTTtnQkFHUCxRQUFRO3NCQURQLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBORzJcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgaXNWYWxpZCB9IGZyb20gJ2RhdGUtZm5zJztcbi8vIEFQUFxuaW1wb3J0IHsgTm92b0xhYmVsU2VydmljZSB9IGZyb20gJ25vdm8tZWxlbWVudHMvc2VydmljZXMnO1xuaW1wb3J0IHsgRGF0ZVV0aWwsIEhlbHBlcnMgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3V0aWxzJztcblxuLy8gVmFsdWUgYWNjZXNzb3IgZm9yIHRoZSBjb21wb25lbnQgKHN1cHBvcnRzIG5nTW9kZWwpXG5jb25zdCBUSU1FX1BJQ0tFUl9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5vdm9UaW1lUGlja2VyRWxlbWVudCksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuZXhwb3J0IGVudW0gVElNRV9WQUxVRV9GT1JNQVRTIHtcbiAgaXNvODYwMSA9ICdpc284NjAxJyxcbiAgRGF0ZSA9ICdEYXRlJyxcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by10aW1lLXBpY2tlcicsXG4gIHByb3ZpZGVyczogW1RJTUVfUElDS0VSX1ZBTFVFX0FDQ0VTU09SXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8IS0tIDxkaXYgY2xhc3M9XCJkaWdpdGFsXCIgW2NsYXNzLmlubGluZV09XCJpbmxpbmVcIiBbY2xhc3MubWlsaXRhcnldPVwibWlsaXRhcnlcIiAqbmdJZj1cImlubGluZVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImRpZ2l0YWwtLWlubmVyXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZGlnaXRhbC0tY2xvY2tcIiAqbmdJZj1cImFuYWxvZ1wiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaG91cnNcIiBkYXRhLWF1dG9tYXRpb24taWQ9XCJub3ZvLXRpbWUtcGlja2VyLWhvdXJzXCI+e3sgaG91cnMgfX08L3NwYW5cbiAgICAgICAgICA+OjxzcGFuIGNsYXNzPVwibWludXRlc1wiIGRhdGEtYXV0b21hdGlvbi1pZD1cIm5vdm8tdGltZS1waWNrZXItbWludXRlc1wiPnt7IG1pbnV0ZXMgfX08L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRyb2wtYmxvY2tcIiAqbmdJZj1cIiFtaWxpdGFyeSAmJiBhbmFsb2dcIj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IHBlcmlvZCBvZiBNRVJJRElBTlNcIlxuICAgICAgICAgICAgY2xhc3M9XCJkaWdpdGFsLS1wZXJpb2RcIlxuICAgICAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJtZXJpZGlhbiA9PSBwZXJpb2RcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInNldFBlcmlvZCgkZXZlbnQsIHBlcmlvZCwgdHJ1ZSlcIlxuICAgICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cInBlcmlvZFwiXG4gICAgICAgICAgICA+e3sgcGVyaW9kIH19PC9zcGFuXG4gICAgICAgICAgPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PiAtLT5cbiAgICA8ZGl2IGNsYXNzPVwiaW5jcmVtZW50c1wiICpuZ0lmPVwiIWFuYWxvZ1wiPlxuICAgICAgPG5vdm8tbGlzdCBjbGFzcz1cImluY3JlbWVudHMtLWhvdXJzXCIgZGlyZWN0aW9uPVwidmVydGljYWxcIiBkYXRhLWF1dG9tYXRpb24taWQ9XCJub3ZvLXRpbWUtcGlja2VyLWhvdXJzXCI+XG4gICAgICAgIDxub3ZvLWxpc3QtaXRlbVxuICAgICAgICAgIGNsYXNzPVwiaW5jcmVtZW50cy0taG91clwiXG4gICAgICAgICAgKm5nRm9yPVwibGV0IGluY3JlbWVudCBvZiBIT1VSU1wiXG4gICAgICAgICAgKGNsaWNrKT1cInNldEhvdXJzKCRldmVudCwgaW5jcmVtZW50LCB0cnVlKVwiXG4gICAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpbmNyZW1lbnQgPT0gYWN0aXZlSG91clwiXG4gICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cImluY3JlbWVudFwiXG4gICAgICAgID5cbiAgICAgICAgICA8aXRlbS1jb250ZW50Pnt7IGluY3JlbWVudCB9fTwvaXRlbS1jb250ZW50PlxuICAgICAgICA8L25vdm8tbGlzdC1pdGVtPlxuICAgICAgPC9ub3ZvLWxpc3Q+XG4gICAgICA8bm92by1saXN0IGNsYXNzPVwiaW5jcmVtZW50cy0tbWludXRlc1wiIGRpcmVjdGlvbj1cInZlcnRpY2FsXCIgZGF0YS1hdXRvbWF0aW9uLWlkPVwibm92by10aW1lLXBpY2tlci1taW51dGVzXCI+XG4gICAgICAgIDxub3ZvLWxpc3QtaXRlbVxuICAgICAgICAgIGNsYXNzPVwiaW5jcmVtZW50cy0tbWludXRlXCJcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgaW5jcmVtZW50IG9mIE1JTlVURVNcIlxuICAgICAgICAgIChjbGljayk9XCJzZXRNaW51dGVzKCRldmVudCwgaW5jcmVtZW50LCB0cnVlKVwiXG4gICAgICAgICAgW2NsYXNzLmFjdGl2ZV09XCJpbmNyZW1lbnQgPT0gYWN0aXZlTWludXRlXCJcbiAgICAgICAgICBbYXR0ci5kYXRhLWF1dG9tYXRpb24taWRdPVwiaW5jcmVtZW50XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxpdGVtLWNvbnRlbnQ+e3sgaW5jcmVtZW50IH19PC9pdGVtLWNvbnRlbnQ+XG4gICAgICAgIDwvbm92by1saXN0LWl0ZW0+XG4gICAgICA8L25vdm8tbGlzdD5cbiAgICAgIDxub3ZvLWxpc3QgY2xhc3M9XCJpbmNyZW1lbnRzLS1tZXJpZGlhbnNcIiBkaXJlY3Rpb249XCJ2ZXJ0aWNhbFwiICpuZ0lmPVwiIW1pbGl0YXJ5XCIgZGF0YS1hdXRvbWF0aW9uLWlkPVwibm92by10aW1lLXBpY2tlci1tZXJpZGlhbnNcIj5cbiAgICAgICAgPG5vdm8tbGlzdC1pdGVtXG4gICAgICAgICAgY2xhc3M9XCJpbmNyZW1lbnRzLS1tZXJpZGlhblwiXG4gICAgICAgICAgKm5nRm9yPVwibGV0IHBlcmlvZCBvZiBNRVJJRElBTlNcIlxuICAgICAgICAgIChjbGljayk9XCJzZXRQZXJpb2QoJGV2ZW50LCBwZXJpb2QsIHRydWUpXCJcbiAgICAgICAgICBbY2xhc3MuYWN0aXZlXT1cIm1lcmlkaWFuID09IHBlcmlvZFwiXG4gICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cInBlcmlvZFwiXG4gICAgICAgID5cbiAgICAgICAgICA8aXRlbS1jb250ZW50Pnt7IHBlcmlvZCB9fTwvaXRlbS1jb250ZW50PlxuICAgICAgICA8L25vdm8tbGlzdC1pdGVtPlxuICAgICAgPC9ub3ZvLWxpc3Q+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImFuYWxvZ1wiICpuZ0lmPVwiYW5hbG9nXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiYW5hbG9nLS1pbm5lclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW5hbG9nLS1mYWNlXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbmFsb2ctLWNlbnRlclwiPjwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImFuYWxvZy0taGFuZC0taG91cnNcIiBbbmdDbGFzc109XCJob3Vyc0NsYXNzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImFuYWxvZy0tYmFsbFwiPjwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbmFsb2ctLWhhbmQtLW1pbnV0ZXNcIiBbbmdDbGFzc109XCJtaW51dGVzQ2xhc3NcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYW5hbG9nLS1iYWxsXCIgW25nQ2xhc3NdPVwieyBiZXR3ZWVuOiBpbkJldHdlZW4gfVwiPjwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW5hbG9nLS1ob3Vyc1wiPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgaG91ciBvZiBIT1VSU1wiXG4gICAgICAgICAgICBjbGFzcz1cImFuYWxvZy0taG91clwiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7IGFjdGl2ZTogYWN0aXZlSG91ciA9PSBob3VyIH1cIlxuICAgICAgICAgICAgKGNsaWNrKT1cInNldEhvdXJzKCRldmVudCwgaG91ciwgdHJ1ZSlcIlxuICAgICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cImhvdXJcIlxuICAgICAgICAgICAgPnt7IGhvdXIgfX08L3NwYW5cbiAgICAgICAgICA+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW5hbG9nLS1taW51dGVzXCI+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBtaW51dGUgb2YgTUlOVVRFU1wiXG4gICAgICAgICAgICBjbGFzcz1cImFuYWxvZy0tbWludXRlXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgYWN0aXZlOiBhY3RpdmVNaW51dGUgPT0gbWludXRlIH1cIlxuICAgICAgICAgICAgKGNsaWNrKT1cInNldE1pbnV0ZXMoJGV2ZW50LCBtaW51dGUsIHRydWUpXCJcbiAgICAgICAgICAgIFthdHRyLmRhdGEtYXV0b21hdGlvbi1pZF09XCJtaW51dGVcIlxuICAgICAgICAgICAgPnt7IG1pbnV0ZSB9fTwvc3BhblxuICAgICAgICAgID5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2F2ZS1jYW5jZWwtYnV0dG9uc1wiICpuZ0lmPVwiaGFzQnV0dG9uc1wiPlxuICAgICAgPG5vdm8tYnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJjYW5jZWwtYnV0dG9uXCJcbiAgICAgICAgICB0aGVtZT1cImRpYWxvZ3VlXCJcbiAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgIChjbGljayk9XCJjYW5jZWwoKVwiPnt7IGxhYmVscy5jYW5jZWwgfX08L25vdm8tYnV0dG9uPlxuICAgICAgPG5vdm8tYnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJzYXZlLWJ1dHRvblwiXG4gICAgICAgICAgdGhlbWU9XCJwcmltYXJ5XCJcbiAgICAgICAgICBjb2xvcj1cInByaW1hcnlcIlxuICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cInNhdmVEaXNhYmxlZFwiXG4gICAgICAgICAgKGNsaWNrKT1cInNhdmUoKVwiPnt7IGxhYmVscy5zYXZlIH19PC9ub3ZvLWJ1dHRvbj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4vVGltZVBpY2tlci5zY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ25vdm8tdGltZS1waWNrZXInLFxuICAgICdbY2xhc3MubWlsaXRhcnldJzogJ21pbGl0YXJ5JyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTm92b1RpbWVQaWNrZXJFbGVtZW50IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KClcbiAgbWlsaXRhcnk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgYW5hbG9nOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIGlubGluZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBzdGVwOiBudW1iZXIgPSAxO1xuICBASW5wdXQoKVxuICBoYXNCdXR0b25zOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIHNhdmVEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKVxuICBvblNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKVxuICBvblNhdmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KClcbiAgb25DYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGhvdXJzOiBudW1iZXIgPSAxMjtcbiAgbWludXRlczogbnVtYmVyID0gMDtcbiAgdmFsdWU6IGFueSA9IG51bGw7XG4gIG1lcmlkaWFuOiBzdHJpbmc7XG4gIGluQmV0d2VlbjogYm9vbGVhbjtcbiAgaG91cnNDbGFzczogc3RyaW5nO1xuICBhY3RpdmVIb3VyO1xuICBtaW51dGVzQ2xhc3M6IHN0cmluZztcbiAgYWN0aXZlTWludXRlO1xuICBpbmNyZW1lbnRzOiBzdHJpbmdbXSA9IFtdO1xuICBzZWxlY3RlZDogc3RyaW5nO1xuICBNRVJJRElBTlM6IEFycmF5PHN0cmluZz4gPSBbJ2FtJywgJ3BtJ107XG4gIE1JTlVURVM6IEFycmF5PHN0cmluZz4gPSBbJzA1JywgJzEwJywgJzE1JywgJzIwJywgJzI1JywgJzMwJywgJzM1JywgJzQwJywgJzQ1JywgJzUwJywgJzU1JywgJzAwJ107XG4gIEhPVVJTOiBBcnJheTxzdHJpbmc+ID0gWycxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOScsICcxMCcsICcxMScsICcxMiddO1xuICBtb2RlbDogYW55O1xuICBfb25DaGFuZ2U6IEZ1bmN0aW9uID0gKCkgPT4ge307XG4gIF9vblRvdWNoZWQ6IEZ1bmN0aW9uID0gKCkgPT4ge307XG5cbiAgZmxhdHRlbihhcnIpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdCguLi5hcnIpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIGxhYmVsczogTm92b0xhYmVsU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLm1pbGl0YXJ5KSB7XG4gICAgICB0aGlzLkhPVVJTID0gWycwJywgLi4udGhpcy5IT1VSUywgJzEzJywgJzE0JywgJzE1JywgJzE2JywgJzE3JywgJzE4JywgJzE5JywgJzIwJywgJzIxJywgJzIyJywgJzIzJ107XG4gICAgfVxuICAgIGlmICghdGhpcy5hbmFsb2cpIHtcbiAgICAgIGNvbnN0IG1pbnMgPSBBcnJheS5mcm9tKEFycmF5KDYwIC8gdGhpcy5zdGVwKS5rZXlzKCkpLm1hcCgoaSkgPT4gaSAqIHRoaXMuc3RlcCk7XG4gICAgICB0aGlzLk1JTlVURVMgPSBtaW5zLm1hcCgobSkgPT4gYCR7bX1gLnBhZFN0YXJ0KDIsICcwJykpO1xuICAgIH1cbiAgICB0aGlzLm5nT25DaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzPzogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICh0aGlzLm1vZGVsKSB7XG4gICAgICB0aGlzLmluaXQodGhpcy5tb2RlbCwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgIHRoaXMuaW5pdChuZXcgRGF0ZSgpLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgaW5pdCh2YWx1ZSwgZGlzcGF0Y2gpIHtcbiAgICBjb25zdCBfdmFsdWUgPSBuZXcgRGF0ZSh2YWx1ZSk7XG4gICAgbGV0IGhvdXJzOiBzdHJpbmcgfCBudW1iZXIgPSBfdmFsdWUuZ2V0SG91cnMoKTtcbiAgICBsZXQgbWludXRlczogc3RyaW5nIHwgbnVtYmVyID0gX3ZhbHVlLmdldE1pbnV0ZXMoKTtcblxuICAgIGlmICghdGhpcy5taWxpdGFyeSkge1xuICAgICAgdGhpcy5tZXJpZGlhbiA9IGhvdXJzID49IDEyID8gJ3BtJyA6ICdhbSc7XG4gICAgICBob3VycyA9IGhvdXJzICUgMTI7XG4gICAgICBob3VycyA9IGhvdXJzIHx8IDEyO1xuICAgIH1cbiAgICBtaW51dGVzID0gbWludXRlcyA8IDEwID8gYDAke21pbnV0ZXN9YCA6IG1pbnV0ZXM7XG5cbiAgICB0aGlzLnNldEhvdXJzKG51bGwsIGhvdXJzLCBkaXNwYXRjaCk7XG4gICAgdGhpcy5zZXRNaW51dGVzKG51bGwsIG1pbnV0ZXMsIGRpc3BhdGNoKTtcbiAgICB0aGlzLmNoZWNrQmV0d2VlbihtaW51dGVzKTtcbiAgfVxuXG4gIGNoZWNrQmV0d2Vlbih2YWx1ZSkge1xuICAgIHRoaXMuaW5CZXR3ZWVuID0gdGhpcy5NSU5VVEVTLmluZGV4T2YoU3RyaW5nKHZhbHVlKSkgPCAwO1xuICB9XG5cbiAgc2V0VmFsdWUoZXZlbnQsIHZhbHVlKSB7XG4gICAgSGVscGVycy5zd2FsbG93RXZlbnQoZXZlbnQpO1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICBjb25zdCBbdGltZSwgbWVyaWRpYW5dID0gdmFsdWUuc3BsaXQoJyAnKTtcbiAgICBjb25zdCBbaG91cnMsIG1pbnV0ZXNdID0gdGltZS5zcGxpdCgnOicpO1xuICAgIHRoaXMuaG91cnMgPSBob3VycztcbiAgICB0aGlzLm1pbnV0ZXMgPSBtaW51dGVzO1xuICAgIHRoaXMubWVyaWRpYW4gPSBtZXJpZGlhbjtcblxuICAgIHRoaXMuZGlzcGF0Y2hDaGFuZ2UoKTtcbiAgfVxuXG4gIHNldEhvdXJzKGV2ZW50LCBob3VycywgZGlzcGF0Y2gpIHtcbiAgICBIZWxwZXJzLnN3YWxsb3dFdmVudChldmVudCk7XG4gICAgdGhpcy5ob3VycyA9IGhvdXJzO1xuICAgIHRoaXMuaG91cnNDbGFzcyA9IGBob3VyLSR7aG91cnN9YDtcbiAgICB0aGlzLmFjdGl2ZUhvdXIgPSBob3VycztcblxuICAgIGlmIChkaXNwYXRjaCkge1xuICAgICAgdGhpcy5kaXNwYXRjaENoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNldE1pbnV0ZXMoZXZlbnQsIG1pbnV0ZXMsIGRpc3BhdGNoKSB7XG4gICAgSGVscGVycy5zd2FsbG93RXZlbnQoZXZlbnQpO1xuICAgIHRoaXMubWludXRlcyA9IG1pbnV0ZXM7XG4gICAgdGhpcy5taW51dGVzQ2xhc3MgPSBgbWluLSR7bWludXRlc31gO1xuICAgIHRoaXMuYWN0aXZlTWludXRlID0gbWludXRlcztcbiAgICB0aGlzLmNoZWNrQmV0d2VlbihtaW51dGVzKTtcblxuICAgIGlmIChkaXNwYXRjaCkge1xuICAgICAgdGhpcy5kaXNwYXRjaENoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNldFBlcmlvZChldmVudCwgcGVyaW9kLCBkaXNwYXRjaCkge1xuICAgIEhlbHBlcnMuc3dhbGxvd0V2ZW50KGV2ZW50KTtcbiAgICB0aGlzLm1lcmlkaWFuID0gcGVyaW9kO1xuXG4gICAgaWYgKGRpc3BhdGNoKSB7XG4gICAgICB0aGlzLmRpc3BhdGNoQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgZGlzcGF0Y2hDaGFuZ2UoKSB7XG4gICAgbGV0IGhvdXJzID0gTnVtYmVyKHRoaXMuaG91cnMpO1xuXG4gICAgaWYgKCF0aGlzLm1pbGl0YXJ5KSB7XG4gICAgICBob3VycyA9IHRoaXMubWVyaWRpYW4udG9Mb3dlckNhc2UoKSA9PT0gJ3BtJyA/IGhvdXJzICsgMTIgOiBob3VycztcblxuICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciAxMlxuICAgICAgaWYgKHRoaXMubWVyaWRpYW4udG9Mb3dlckNhc2UoKSA9PT0gJ3BtJyAmJiBob3VycyA9PT0gMjQpIHtcbiAgICAgICAgaG91cnMgPSAxMjtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tZXJpZGlhbi50b0xvd2VyQ2FzZSgpID09PSAnYW0nICYmIGhvdXJzID09PSAxMikge1xuICAgICAgICBob3VycyA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhbHVlLnNldEhvdXJzKGhvdXJzKTtcbiAgICB2YWx1ZS5zZXRNaW51dGVzKHRoaXMubWludXRlcyk7XG4gICAgdmFsdWUuc2V0U2Vjb25kcygwKTtcbiAgICB0aGlzLnZhbHVlID0gYCR7dGhpcy5ob3Vyc306JHt0aGlzLm1pbnV0ZXN9ICR7dGhpcy5tZXJpZGlhbn1gO1xuICAgIHRoaXMub25TZWxlY3QubmV4dCh7XG4gICAgICBob3VycyxcbiAgICAgIG1pbnV0ZXM6IHRoaXMubWludXRlcyxcbiAgICAgIG1lcmlkaWFuOiB0aGlzLm1lcmlkaWFuLFxuICAgICAgZGF0ZTogdmFsdWUsXG4gICAgICB0ZXh0OiB0aGlzLnZhbHVlLFxuICAgIH0pO1xuICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFZhbHVlQWNjZXNzb3IgRnVuY3Rpb25zXG4gIHdyaXRlVmFsdWUobW9kZWw6IGFueSk6IHZvaWQge1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICBpZiAoSGVscGVycy5pc0RhdGUobW9kZWwpKSB7XG4gICAgICB0aGlzLmluaXQobW9kZWwsIGZhbHNlKTtcbiAgICAgIC8vIHRoaXMuZGlzcGF0Y2hDaGFuZ2UoKTtcbiAgICB9XG4gICAgaWYgKEhlbHBlcnMuaXNTdHJpbmcobW9kZWwpKSB7XG4gICAgICBjb25zdCB0aW1lID0gdGhpcy5taWxpdGFyeSA/IG1vZGVsIDogdGhpcy5jb252ZXJ0VGltZTEydG8yNChtb2RlbCk7XG4gICAgICBjb25zdCBkYXRlID0gRGF0ZVV0aWwucGFyc2UoYCR7RGF0ZVV0aWwuZm9ybWF0KERhdGUubm93KCksICdZWVlZLU1NLUREJyl9VCR7dGltZX1gKTtcbiAgICAgIGlmIChpc1ZhbGlkKGRhdGUpKSB7XG4gICAgICAgIHRoaXMuaW5pdChkYXRlLCBmYWxzZSk7XG4gICAgICAgIC8vIHRoaXMuZGlzcGF0Y2hDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIGNvbnZlcnRUaW1lMTJ0bzI0KHRpbWUxMmg6IHN0cmluZykge1xuICAgIGNvbnN0IHBtRm9ybWF0ID0gdGhpcy5sYWJlbHMudGltZUZvcm1hdFBNLnRvVXBwZXJDYXNlKCk7XG5cbiAgICBjb25zdCBbdGltZSwgbW9kaWZpZXJdID0gdGltZTEyaC5zcGxpdCgnICcpO1xuICAgIGxldCBbaG91cnMsIG1pbnV0ZXNdID0gdGltZS5zcGxpdCgnOicpO1xuICAgIGlmIChob3VycyA9PT0gJzEyJykge1xuICAgICAgaG91cnMgPSAnMDAnO1xuICAgIH1cbiAgICBpZiAoWydQTScsIHBtRm9ybWF0XS5pbmNsdWRlcyhtb2RpZmllcikpIHtcbiAgICAgIGhvdXJzID0gYCR7cGFyc2VJbnQoaG91cnMsIDEwKSArIDEyfWAucGFkU3RhcnQoMiwgJzAnKTtcbiAgICB9XG4gICAgcmV0dXJuIGAke2hvdXJzfToke21pbnV0ZXN9YDtcbiAgfVxuXG4gIHNhdmUoKTogdm9pZCB7XG4gICAgdGhpcy5vblNhdmUuZW1pdCgpO1xuICB9XG5cbiAgY2FuY2VsKCk6IHZvaWQge1xuICAgIHRoaXMub25DYW5jZWwuZW1pdCgpO1xuICB9XG59XG4iXX0=