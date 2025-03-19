import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NovoLabelService } from 'novo-elements/services';
import { BasePickerResults } from '../base-picker-results/BasePickerResults';
import * as i0 from "@angular/core";
import * as i1 from "novo-elements/services";
import * as i2 from "@angular/common";
import * as i3 from "novo-elements/elements/common";
import * as i4 from "novo-elements/elements/list";
import * as i5 from "novo-elements/pipes";
import * as i6 from "novo-elements/elements/loading";
export class EntityPickerResult {
    constructor(labels) {
        this.labels = labels;
        this.select = new EventEmitter();
    }
    /**
     * @description This function captures the whole query string and replace it with the string that will be used to
     * match.
     */
    escapeRegexp(queryToEscape) {
        // Ex: if the capture is "a" the result will be \a
        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }
    /**
     * @deprecated use highlight pipe
     */
    highlight(match, query) {
        // Replaces the capture string with a the same string inside of a "strong" tag
        return query && match ? match.replace(new RegExp(this.escapeRegexp(query.trim()), 'gi'), '<strong>$&</strong>') : match;
    }
    getIconForResult(result) {
        if (result) {
            switch (result.searchEntity) {
                case 'ClientContact':
                    return 'person contact';
                case 'ClientCorporation':
                    return 'company';
                case 'Opportunity':
                    return 'opportunity';
                case 'Candidate':
                    return 'candidate';
                case 'Lead':
                    return 'lead';
                case 'JobOrder':
                    return 'job';
                case 'Placement':
                    return 'star placement';
                case 'CorporateUser':
                    return 'user';
                case 'CorporationDepartment':
                    return 'department';
                case 'JobShift':
                    return 'timetable contract';
                default:
                    return '';
            }
        }
        return '';
    }
    renderTimestamp(date) {
        let timestamp = '';
        if (date) {
            timestamp = this.labels.formatDateWithFormat(date, { year: 'numeric', month: 'numeric', day: 'numeric' });
        }
        return timestamp;
    }
    renderTime(dateStr) {
        let timestamp = '';
        if (dateStr) {
            timestamp = this.labels.formatTime(new Date(dateStr));
        }
        return timestamp;
    }
    renderTimeNoOffset(dateStr) {
        let timestamp = '';
        if (dateStr) {
            dateStr = dateStr.slice(0, 19);
            timestamp = this.labels.formatTime(dateStr);
        }
        return timestamp;
    }
    getNameForResult(result) {
        if (result) {
            switch (result.searchEntity) {
                case 'Lead':
                case 'CorporateUser':
                case 'ClientContact':
                case 'Candidate':
                case 'Person':
                    if ('firstName' in result) {
                        return `${result.firstName} ${result.lastName}`.trim();
                    }
                    return `${result.name || ''}`.trim();
                case 'ClientCorporation':
                    return `${result.name || ''}`.trim();
                case 'Opportunity':
                case 'JobOrder':
                case 'BillingProfile':
                case 'InvoiceTerm':
                    return `${result.id} | ${result.title || ''}`.trim();
                case 'Placement':
                    let label = `${result.id}`;
                    if (result.candidate || result.jobOrder) {
                        if (result.candidate && result.jobOrder) {
                            label = `${label} | ${result.candidate.firstName} ${result.candidate.lastName} - ${result.jobOrder.title}`.trim();
                        }
                        else if (result.jobOrder) {
                            label = `${label} | ${result.jobOrder.title}`.trim();
                        }
                        else {
                            label = `${label} | ${result.candidate.firstName} ${result.candidate.lastName}`.trim();
                        }
                    }
                    return label;
                case 'JobShift':
                    return `${result.jobOrder?.title} @ ${result.jobOrder?.clientCorporation?.name || ''}`.trim();
                default:
                    return `${result.name || result.label || ''}`.trim();
            }
        }
        return '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: EntityPickerResult, deps: [{ token: i1.NovoLabelService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: EntityPickerResult, selector: "entity-picker-result", inputs: { match: "match", term: "term" }, outputs: { select: "select" }, ngImport: i0, template: `
    <novo-list-item *ngIf="match.data" (click)="select.next(match.data)">
      <novo-item-header>
        <novo-item-avatar [icon]="getIconForResult(match.data)"></novo-item-avatar>
        <novo-item-title> <span [innerHtml]="getNameForResult(match.data) | highlight:term"></span> </novo-item-title>
      </novo-item-header>
      <novo-item-content direction="horizontal">
        <!-- COMPANY 1 -->
        <novo-text smaller class="company" *ngIf="match.data.companyName || match.data?.clientCorporation?.name">
          <i class="bhi-company company"></i>
          <span [innerHtml]="match.data.companyName || match.data?.clientCorporation?.name | highlight:term"></span>
        </novo-text>
        <!-- CLIENT CONTACT -->
        <novo-text smaller class="contact" *ngIf="match.data?.clientContact?.firstName">
          <i class="bhi-person contact person"></i>
          <span [innerHtml]="match.data.clientContact.firstName + ' ' + match.data.clientContact.lastName | highlight:term"></span>
        </novo-text>
        <!-- CANDIDATE -->
        <novo-text smaller class="candidate" *ngIf="match.data.candidate && match.data.searchEntity === 'Placement'">
          <i class="bhi-candidate candidate"></i>
          <span [innerHtml]="match.data.candidate.firstName + ' ' + match.data.candidate.lastName | highlight:term"></span>
        </novo-text>
        <!-- START & END DATE -->
        <novo-text smaller class="start-date" *ngIf="match.data.dateBegin && match.data.searchEntity === 'Placement'">
          <i class="bhi-calendar"></i>
          <span [innerHtml]="renderTimestamp(match.data.dateBegin) + ' - ' + renderTimestamp(match.data.dateEnd)"></span>
        </novo-text>
        <!-- START Date -->
        <novo-text smaller class="start-date" *ngIf="match.data.startTime && match.data.searchEntity === 'JobShift'">
          <i class="bhi-calendar"></i>
          <span [innerHtml]="renderTimestamp(match.data.startTime)"></span>
        </novo-text>
        <!-- START & END TIME -->
        <novo-text smaller class="start-time" *ngIf="match.data.startTime && match.data.searchEntity === 'JobShift'">
          <i class="bhi-clock"></i>
          <span [innerHtml]="renderTimeNoOffset(match.data.startTime) + ' - ' + renderTimeNoOffset(match.data.endTime)"></span>
        </novo-text>
        <!-- JOBORDER -->
        <novo-text smaller class="job" *ngIf="match.data.jobOrder && match.data.searchEntity === 'JobShift'">
          <i class="bhi-job job"></i>
          <span [innerHtml]="match.data.jobOrder.title | highlight:term"></span>
        </novo-text>
        <!-- OPENINGS -->
        <novo-text smaller class="openings" *ngIf="match.data.openings && match.data.searchEntity === 'JobShift'">
          <i class="bhi-candidate"></i>
          <span>{{ match.data.numAssigned }} / {{ match.data.openings }}</span>
        </novo-text>
        <!-- EMAIL -->
        <novo-text smaller class="email" *ngIf="match.data.email">
          <i class="bhi-email"></i> <span [innerHtml]="match.data.email | highlight:term"></span>
        </novo-text>
        <!-- PHONE -->
        <novo-text smaller class="phone" *ngIf="match.data.phone">
          <i class="bhi-phone"></i> <span [innerHtml]="match.data.phone | highlight:term"></span>
        </novo-text>
        <!-- ADDRESS -->
        <novo-text smaller class="location" *ngIf="match.data.address && (match.data.address.city || match.data.address.state)">
          <i class="bhi-location"></i> <span *ngIf="match.data.address.city" [innerHtml]="highlight(match.data.address.city, term)"></span>
          <span *ngIf="match.data.address.city && match.data.address.state">, </span>
          <span *ngIf="match.data.address.state" [innerHtml]="match.data.address.state | highlight:term"></span>
        </novo-text>
        <!-- STATUS -->
        <novo-text smaller class="status" *ngIf="match.data.status">
          <i class="bhi-info"></i> <span [innerHtml]="match.data.status | highlight:term"></span>
        </novo-text>
        <!-- OWNER -->
        <novo-text smaller class="owner" *ngIf="match.data.owner && match.data.owner.name && match.data.searchEntity === 'Candidate'">
          <i class="bhi-person"></i> <span [innerHtml]="match.data.owner.name | highlight:term"></span>
        </novo-text>
        <!-- PRIMARY DEPARTMENT -->
        <novo-text
          smaller
          class="primary-department"
          *ngIf="match.data.primaryDepartment && match.data.primaryDepartment.name && match.data.searchEntity === 'CorporateUser'"
        >
          <i class="bhi-department"></i> <span [innerHtml]="match.data.primaryDepartment.name | highlight:term"></span>
        </novo-text>
        <!-- OCCUPATION -->
        <novo-text smaller class="occupation" *ngIf="match.data.occupation && match.data.searchEntity === 'CorporateUser'">
          <i class="bhi-occupation"></i> <span [innerHtml]="match.data.occupation | highlight:term"></span>
        </novo-text>
      </novo-item-content>
    </novo-list-item>
  `, isInline: true, styles: [":host(.disabled){opacity:.5;pointer-events:none}:host(.active)>novo-list-item{background-color:#e0ebf9}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.NovoText, selector: "novo-text,[novo-text]", inputs: ["block"] }, { kind: "component", type: i4.NovoListItemElement, selector: "novo-list-item, a[list-item], button[list-item]" }, { kind: "component", type: i4.NovoItemAvatarElement, selector: "item-avatar, novo-item-avatar", inputs: ["icon", "color"] }, { kind: "component", type: i4.NovoItemTitleElement, selector: "item-title, novo-item-title" }, { kind: "component", type: i4.NovoItemHeaderElement, selector: "item-header, novo-item-header" }, { kind: "component", type: i4.NovoItemContentElement, selector: "item-content, novo-item-content", inputs: ["direction"] }, { kind: "pipe", type: i5.HighlightPipe, name: "highlight" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: EntityPickerResult, decorators: [{
            type: Component,
            args: [{ selector: 'entity-picker-result', template: `
    <novo-list-item *ngIf="match.data" (click)="select.next(match.data)">
      <novo-item-header>
        <novo-item-avatar [icon]="getIconForResult(match.data)"></novo-item-avatar>
        <novo-item-title> <span [innerHtml]="getNameForResult(match.data) | highlight:term"></span> </novo-item-title>
      </novo-item-header>
      <novo-item-content direction="horizontal">
        <!-- COMPANY 1 -->
        <novo-text smaller class="company" *ngIf="match.data.companyName || match.data?.clientCorporation?.name">
          <i class="bhi-company company"></i>
          <span [innerHtml]="match.data.companyName || match.data?.clientCorporation?.name | highlight:term"></span>
        </novo-text>
        <!-- CLIENT CONTACT -->
        <novo-text smaller class="contact" *ngIf="match.data?.clientContact?.firstName">
          <i class="bhi-person contact person"></i>
          <span [innerHtml]="match.data.clientContact.firstName + ' ' + match.data.clientContact.lastName | highlight:term"></span>
        </novo-text>
        <!-- CANDIDATE -->
        <novo-text smaller class="candidate" *ngIf="match.data.candidate && match.data.searchEntity === 'Placement'">
          <i class="bhi-candidate candidate"></i>
          <span [innerHtml]="match.data.candidate.firstName + ' ' + match.data.candidate.lastName | highlight:term"></span>
        </novo-text>
        <!-- START & END DATE -->
        <novo-text smaller class="start-date" *ngIf="match.data.dateBegin && match.data.searchEntity === 'Placement'">
          <i class="bhi-calendar"></i>
          <span [innerHtml]="renderTimestamp(match.data.dateBegin) + ' - ' + renderTimestamp(match.data.dateEnd)"></span>
        </novo-text>
        <!-- START Date -->
        <novo-text smaller class="start-date" *ngIf="match.data.startTime && match.data.searchEntity === 'JobShift'">
          <i class="bhi-calendar"></i>
          <span [innerHtml]="renderTimestamp(match.data.startTime)"></span>
        </novo-text>
        <!-- START & END TIME -->
        <novo-text smaller class="start-time" *ngIf="match.data.startTime && match.data.searchEntity === 'JobShift'">
          <i class="bhi-clock"></i>
          <span [innerHtml]="renderTimeNoOffset(match.data.startTime) + ' - ' + renderTimeNoOffset(match.data.endTime)"></span>
        </novo-text>
        <!-- JOBORDER -->
        <novo-text smaller class="job" *ngIf="match.data.jobOrder && match.data.searchEntity === 'JobShift'">
          <i class="bhi-job job"></i>
          <span [innerHtml]="match.data.jobOrder.title | highlight:term"></span>
        </novo-text>
        <!-- OPENINGS -->
        <novo-text smaller class="openings" *ngIf="match.data.openings && match.data.searchEntity === 'JobShift'">
          <i class="bhi-candidate"></i>
          <span>{{ match.data.numAssigned }} / {{ match.data.openings }}</span>
        </novo-text>
        <!-- EMAIL -->
        <novo-text smaller class="email" *ngIf="match.data.email">
          <i class="bhi-email"></i> <span [innerHtml]="match.data.email | highlight:term"></span>
        </novo-text>
        <!-- PHONE -->
        <novo-text smaller class="phone" *ngIf="match.data.phone">
          <i class="bhi-phone"></i> <span [innerHtml]="match.data.phone | highlight:term"></span>
        </novo-text>
        <!-- ADDRESS -->
        <novo-text smaller class="location" *ngIf="match.data.address && (match.data.address.city || match.data.address.state)">
          <i class="bhi-location"></i> <span *ngIf="match.data.address.city" [innerHtml]="highlight(match.data.address.city, term)"></span>
          <span *ngIf="match.data.address.city && match.data.address.state">, </span>
          <span *ngIf="match.data.address.state" [innerHtml]="match.data.address.state | highlight:term"></span>
        </novo-text>
        <!-- STATUS -->
        <novo-text smaller class="status" *ngIf="match.data.status">
          <i class="bhi-info"></i> <span [innerHtml]="match.data.status | highlight:term"></span>
        </novo-text>
        <!-- OWNER -->
        <novo-text smaller class="owner" *ngIf="match.data.owner && match.data.owner.name && match.data.searchEntity === 'Candidate'">
          <i class="bhi-person"></i> <span [innerHtml]="match.data.owner.name | highlight:term"></span>
        </novo-text>
        <!-- PRIMARY DEPARTMENT -->
        <novo-text
          smaller
          class="primary-department"
          *ngIf="match.data.primaryDepartment && match.data.primaryDepartment.name && match.data.searchEntity === 'CorporateUser'"
        >
          <i class="bhi-department"></i> <span [innerHtml]="match.data.primaryDepartment.name | highlight:term"></span>
        </novo-text>
        <!-- OCCUPATION -->
        <novo-text smaller class="occupation" *ngIf="match.data.occupation && match.data.searchEntity === 'CorporateUser'">
          <i class="bhi-occupation"></i> <span [innerHtml]="match.data.occupation | highlight:term"></span>
        </novo-text>
      </novo-item-content>
    </novo-list-item>
  `, styles: [":host(.disabled){opacity:.5;pointer-events:none}:host(.active)>novo-list-item{background-color:#e0ebf9}\n"] }]
        }], ctorParameters: () => [{ type: i1.NovoLabelService }], propDecorators: { match: [{
                type: Input
            }], term: [{
                type: Input
            }], select: [{
                type: Output
            }] } });
export class EntityPickerResults extends BasePickerResults {
    constructor(element, labels, ref) {
        super(element, ref);
        this.labels = labels;
        this.select = new EventEmitter();
    }
    get hasNonErrorMessage() {
        return !this.isLoading && !this.matches.length && !this.hasError;
    }
    getListElement() {
        return this.element.nativeElement.querySelector('novo-list');
    }
    selectMatch(event, item) {
        this.select.next(item);
        return super.selectMatch(event, item);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: EntityPickerResults, deps: [{ token: i0.ElementRef }, { token: i1.NovoLabelService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: EntityPickerResults, selector: "entity-picker-results", outputs: { select: "select" }, host: { classAttribute: "novo-entity-picker-results" }, usesInheritance: true, ngImport: i0, template: `
    <novo-list *ngIf="matches.length > 0" direction="vertical">
      <entity-picker-result
        *ngFor="let match of matches"
        [match]="match"
        [term]="term"
        [ngClass]="{ active: match === activeMatch }"
        (click)="selectMatch($event, match)"
        (mouseenter)="selectActive(match)"
        [class.disabled]="preselected(match)"
      >
      </entity-picker-result>
      <novo-loading theme="line" *ngIf="isLoading && matches.length > 0"></novo-loading>
    </novo-list>
    <div class="picker-error" *ngIf="hasError">{{ labels.pickerError }}</div>
    <div class="picker-null-results" *ngIf="hasNonErrorMessage && term !== ''">{{ labels.pickerEmpty }}</div>
    <div class="picker-null-results" *ngIf="hasNonErrorMessage && term === ''">{{ labels.pickerTextFieldEmpty }}</div>
  `, isInline: true, styles: ["picker-results,entity-picker-results{background:#fff;color:#000;min-width:100%;max-width:100%;z-index:10;top:100%}picker-results .novo-list,entity-picker-results .novo-list{border:1px solid #4a89dc}picker-results .novo-list .novo-list-item,entity-picker-results .novo-list .novo-list-item{cursor:pointer;flex:0 0;transition:background-color .25s}picker-results .novo-list .novo-list-item>div,entity-picker-results .novo-list .novo-list-item>div{width:100%}picker-results .novo-list .novo-list-item.active,entity-picker-results .novo-list .novo-list-item.active{background-color:#e0ebf9}picker-results .novo-list .novo-list-item:hover,entity-picker-results .novo-list .novo-list-item:hover{background-color:#f1f6fc}picker-results .novo-list .novo-list-item .novo-item-content,entity-picker-results .novo-list .novo-list-item .novo-item-content{flex-flow:row wrap}picker-results .novo-list .novo-list-item .novo-item-content>*,entity-picker-results .novo-list .novo-list-item .novo-item-content>*{flex:0 0 33%;white-space:nowrap}picker-results picker-error,picker-results picker-loader,picker-results picker-null-recent-results,picker-results picker-null-results,picker-results .picker-error,picker-results .picker-loader,picker-results .picker-null-recent-results,picker-results .picker-null-results,entity-picker-results picker-error,entity-picker-results picker-loader,entity-picker-results picker-null-recent-results,entity-picker-results picker-null-results,entity-picker-results .picker-error,entity-picker-results .picker-loader,entity-picker-results .picker-null-recent-results,entity-picker-results .picker-null-results{background-color:#fff;text-align:center;color:#b5b5b5;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;border:1px solid #4a89dc;transform:translateY(0);transition:all .15s cubic-bezier(.35,0,.25,1);padding:.5rem}picker-results p.picker-error,picker-results p.picker-loader,picker-results p.picker-null-recent-results,picker-results p.picker-null-results,entity-picker-results p.picker-error,entity-picker-results p.picker-loader,entity-picker-results p.picker-null-recent-results,entity-picker-results p.picker-null-results{max-width:inherit;padding:5px}picker-results picker-loader,picker-results .picker-loader,entity-picker-results picker-loader,entity-picker-results .picker-loader{background-color:#fff;display:flex;align-items:center;flex-direction:column;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;border:1px solid #4a89dc;transform:translateY(0);transition:all .15s cubic-bezier(.35,0,.25,1)}picker-results section,entity-picker-results section{box-shadow:.1em .1em 1em #00000040;z-index:9;position:absolute;width:100%;background-color:#fff;color:#000}picker-results,.picker-results,quick-note-results,.quick-note-results{background-color:#fff;cursor:default;line-height:26px;width:100%;display:block}picker-results novo-list,picker-results ul,.picker-results novo-list,.picker-results ul,quick-note-results novo-list,quick-note-results ul,.quick-note-results novo-list,.quick-note-results ul{background-color:#fff;max-height:200px;overflow:auto;list-style:none;padding:0;margin:0;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;border:1px solid #4a89dc;transform:translateY(0);transition:all .15s cubic-bezier(.35,0,.25,1);display:block}picker-results novo-list novo-list-item,picker-results novo-list li,picker-results ul novo-list-item,picker-results ul li,.picker-results novo-list novo-list-item,.picker-results novo-list li,.picker-results ul novo-list-item,.picker-results ul li,quick-note-results novo-list novo-list-item,quick-note-results novo-list li,quick-note-results ul novo-list-item,quick-note-results ul li,.quick-note-results novo-list novo-list-item,.quick-note-results novo-list li,.quick-note-results ul novo-list-item,.quick-note-results ul li{font-size:.9em;padding:5px 16px}picker-results novo-list novo-list-item span,picker-results novo-list li span,picker-results ul novo-list-item span,picker-results ul li span,.picker-results novo-list novo-list-item span,.picker-results novo-list li span,.picker-results ul novo-list-item span,.picker-results ul li span,quick-note-results novo-list novo-list-item span,quick-note-results novo-list li span,quick-note-results ul novo-list-item span,quick-note-results ul li span,.quick-note-results novo-list novo-list-item span,.quick-note-results novo-list li span,.quick-note-results ul novo-list-item span,.quick-note-results ul li span{display:inline-block;min-width:100px;margin:2px 0}picker-results novo-list novo-list-item h6,picker-results novo-list li h6,picker-results ul novo-list-item h6,picker-results ul li h6,.picker-results novo-list novo-list-item h6,.picker-results novo-list li h6,.picker-results ul novo-list-item h6,.picker-results ul li h6,quick-note-results novo-list novo-list-item h6,quick-note-results novo-list li h6,quick-note-results ul novo-list-item h6,quick-note-results ul li h6,.quick-note-results novo-list novo-list-item h6,.quick-note-results novo-list li h6,.quick-note-results ul novo-list-item h6,.quick-note-results ul li h6{padding-top:0;font-weight:400;color:#93a0a9}picker-results novo-list novo-list-item h6 strong,picker-results novo-list li h6 strong,picker-results ul novo-list-item h6 strong,picker-results ul li h6 strong,.picker-results novo-list novo-list-item h6 strong,.picker-results novo-list li h6 strong,.picker-results ul novo-list-item h6 strong,.picker-results ul li h6 strong,quick-note-results novo-list novo-list-item h6 strong,quick-note-results novo-list li h6 strong,quick-note-results ul novo-list-item h6 strong,quick-note-results ul li h6 strong,.quick-note-results novo-list novo-list-item h6 strong,.quick-note-results novo-list li h6 strong,.quick-note-results ul novo-list-item h6 strong,.quick-note-results ul li h6 strong{font-weight:400;color:#3d464d}picker-results novo-list novo-list-item.active,picker-results novo-list novo-list-item:focus,picker-results novo-list novo-list-item:hover,picker-results novo-list li.active,picker-results novo-list li:focus,picker-results novo-list li:hover,picker-results ul novo-list-item.active,picker-results ul novo-list-item:focus,picker-results ul novo-list-item:hover,picker-results ul li.active,picker-results ul li:focus,picker-results ul li:hover,.picker-results novo-list novo-list-item.active,.picker-results novo-list novo-list-item:focus,.picker-results novo-list novo-list-item:hover,.picker-results novo-list li.active,.picker-results novo-list li:focus,.picker-results novo-list li:hover,.picker-results ul novo-list-item.active,.picker-results ul novo-list-item:focus,.picker-results ul novo-list-item:hover,.picker-results ul li.active,.picker-results ul li:focus,.picker-results ul li:hover,quick-note-results novo-list novo-list-item.active,quick-note-results novo-list novo-list-item:focus,quick-note-results novo-list novo-list-item:hover,quick-note-results novo-list li.active,quick-note-results novo-list li:focus,quick-note-results novo-list li:hover,quick-note-results ul novo-list-item.active,quick-note-results ul novo-list-item:focus,quick-note-results ul novo-list-item:hover,quick-note-results ul li.active,quick-note-results ul li:focus,quick-note-results ul li:hover,.quick-note-results novo-list novo-list-item.active,.quick-note-results novo-list novo-list-item:focus,.quick-note-results novo-list novo-list-item:hover,.quick-note-results novo-list li.active,.quick-note-results novo-list li:focus,.quick-note-results novo-list li:hover,.quick-note-results ul novo-list-item.active,.quick-note-results ul novo-list-item:focus,.quick-note-results ul novo-list-item:hover,.quick-note-results ul li.active,.quick-note-results ul li:focus,.quick-note-results ul li:hover{background-color:#e0ebf9}picker-results novo-list novo-list-item.disabled,picker-results novo-list li.disabled,picker-results ul novo-list-item.disabled,picker-results ul li.disabled,.picker-results novo-list novo-list-item.disabled,.picker-results novo-list li.disabled,.picker-results ul novo-list-item.disabled,.picker-results ul li.disabled,quick-note-results novo-list novo-list-item.disabled,quick-note-results novo-list li.disabled,quick-note-results ul novo-list-item.disabled,quick-note-results ul li.disabled,.quick-note-results novo-list novo-list-item.disabled,.quick-note-results novo-list li.disabled,.quick-note-results ul novo-list-item.disabled,.quick-note-results ul li.disabled{opacity:.5;pointer-events:none}picker-results novo-list novo-loading,picker-results ul novo-loading,.picker-results novo-list novo-loading,.picker-results ul novo-loading,quick-note-results novo-list novo-loading,quick-note-results ul novo-loading,.quick-note-results novo-list novo-loading,.quick-note-results ul novo-loading{justify-content:center}picker-results ul li,.picker-results ul li,quick-note-results ul li,.quick-note-results ul li{padding:10px 16px;box-sizing:border-box;display:flex;flex-wrap:wrap;flex-direction:column}picker-results.active,.picker-results.active,quick-note-results.active,.quick-note-results.active{z-index:1000}picker-results:focus,.picker-results:focus,quick-note-results:focus,.quick-note-results:focus{outline:none}entity-picker-results{background:#fff;width:100%;min-width:250px}entity-picker-results novo-list{background:#fff;min-width:30rem;max-height:49vh;overflow:auto}entity-picker-results novo-list .novo-item-content{margin-top:.5rem;margin-left:1.8rem;row-gap:1rem}entity-picker-results novo-list .novo-item-content .novo-text{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;padding-right:1em}entity-picker-results novo-list novo-loading{justify-content:center}workers-comp-codes-picker-results,distribution-list-picker-results{display:block;color:#000;width:100%;max-width:none;z-index:99;background:#fff;padding:1px}workers-comp-codes-picker-results.active,distribution-list-picker-results.active{border:1px solid #4a89dc}workers-comp-codes-picker-results .novo-list,distribution-list-picker-results .novo-list{min-height:100%;background:#fff;max-height:330px;overflow-y:auto;overflow-x:hidden}workers-comp-codes-picker-results .novo-list .novo-list-item,distribution-list-picker-results .novo-list .novo-list-item{display:block;transition:background-color .25s;border-bottom:1px solid #e2e2e2;cursor:pointer}workers-comp-codes-picker-results .novo-list .novo-list-item.disabled,distribution-list-picker-results .novo-list .novo-list-item.disabled{opacity:.5;pointer-events:none}workers-comp-codes-picker-results .novo-list .novo-list-item item-title h6,distribution-list-picker-results .novo-list .novo-list-item item-title h6{font-weight:500;padding:.6em 0 .5em}workers-comp-codes-picker-results .novo-list .novo-list-item item-title h6 span,distribution-list-picker-results .novo-list .novo-list-item item-title h6 span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:100px;width:80%;display:block}workers-comp-codes-picker-results .novo-list .novo-list-item>div,distribution-list-picker-results .novo-list .novo-list-item>div{width:100%;margin-left:15px}workers-comp-codes-picker-results .novo-list .novo-list-item.active,distribution-list-picker-results .novo-list .novo-list-item.active{background-color:#e0ebf9}workers-comp-codes-picker-results .novo-list .novo-list-item:hover,distribution-list-picker-results .novo-list .novo-list-item:hover{background-color:#e0ebf9}workers-comp-codes-picker-results .novo-list .novo-list-item item-content,distribution-list-picker-results .novo-list .novo-list-item item-content{flex-flow:row nowrap;justify-content:space-between}workers-comp-codes-picker-results .novo-list .novo-list-item item-content>*,distribution-list-picker-results .novo-list .novo-list-item item-content>*{flex:0 0 60%;white-space:nowrap}workers-comp-codes-picker-results .novo-list .novo-list-item item-content p,distribution-list-picker-results .novo-list .novo-list-item item-content p{margin-right:.5em;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;flex:1}workers-comp-codes-picker-results .novo-list .novo-list-item item-content p .label,distribution-list-picker-results .novo-list .novo-list-item item-content p .label{font-weight:700}workers-comp-codes-picker-results .novo-list novo-loading,distribution-list-picker-results .novo-list novo-loading{justify-content:center}workers-comp-codes-picker-results .picker-loader,workers-comp-codes-picker-results .picker-error,workers-comp-codes-picker-results .picker-null-results,distribution-list-picker-results .picker-loader,distribution-list-picker-results .picker-error,distribution-list-picker-results .picker-null-results{border:none}workers-comp-codes-picker-results .picker-null,workers-comp-codes-picker-results .picker-error,workers-comp-codes-picker-results .picker-loading,workers-comp-codes-picker-results .picker-no-recents,distribution-list-picker-results .picker-null,distribution-list-picker-results .picker-error,distribution-list-picker-results .picker-loading,distribution-list-picker-results .picker-no-recents{text-align:center;padding:1em 0 4em}workers-comp-codes-picker-results .picker-null>i,workers-comp-codes-picker-results .picker-error>i,workers-comp-codes-picker-results .picker-loading>i,workers-comp-codes-picker-results .picker-no-recents>i,distribution-list-picker-results .picker-null>i,distribution-list-picker-results .picker-error>i,distribution-list-picker-results .picker-loading>i,distribution-list-picker-results .picker-no-recents>i{font-size:3em;margin:.5em;color:#0000004d}workers-comp-codes-picker-results .picker-null>h4,workers-comp-codes-picker-results .picker-null>p,workers-comp-codes-picker-results .picker-error>h4,workers-comp-codes-picker-results .picker-error>p,workers-comp-codes-picker-results .picker-loading>h4,workers-comp-codes-picker-results .picker-loading>p,workers-comp-codes-picker-results .picker-no-recents>h4,workers-comp-codes-picker-results .picker-no-recents>p,distribution-list-picker-results .picker-null>h4,distribution-list-picker-results .picker-null>p,distribution-list-picker-results .picker-error>h4,distribution-list-picker-results .picker-error>p,distribution-list-picker-results .picker-loading>h4,distribution-list-picker-results .picker-loading>p,distribution-list-picker-results .picker-no-recents>h4,distribution-list-picker-results .picker-no-recents>p{margin:0;max-width:none;padding:0}workers-comp-codes-picker-results .picker-null>h4,workers-comp-codes-picker-results .picker-error>h4,workers-comp-codes-picker-results .picker-loading>h4,workers-comp-codes-picker-results .picker-no-recents>h4,distribution-list-picker-results .picker-null>h4,distribution-list-picker-results .picker-error>h4,distribution-list-picker-results .picker-loading>h4,distribution-list-picker-results .picker-no-recents>h4{font-weight:500}workers-comp-codes-picker-results section,distribution-list-picker-results section{box-shadow:.1em .1em 1em #00000040;z-index:9;position:absolute;width:100%;background-color:#fff;color:#000}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.ThemeColorDirective, selector: "[theme]", inputs: ["theme"] }, { kind: "component", type: i6.NovoLoadingElement, selector: "novo-loading", inputs: ["theme", "color", "size"] }, { kind: "component", type: i4.NovoListElement, selector: "novo-list", inputs: ["theme", "direction"] }, { kind: "component", type: EntityPickerResult, selector: "entity-picker-result", inputs: ["match", "term"], outputs: ["select"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: EntityPickerResults, decorators: [{
            type: Component,
            args: [{ selector: 'entity-picker-results', template: `
    <novo-list *ngIf="matches.length > 0" direction="vertical">
      <entity-picker-result
        *ngFor="let match of matches"
        [match]="match"
        [term]="term"
        [ngClass]="{ active: match === activeMatch }"
        (click)="selectMatch($event, match)"
        (mouseenter)="selectActive(match)"
        [class.disabled]="preselected(match)"
      >
      </entity-picker-result>
      <novo-loading theme="line" *ngIf="isLoading && matches.length > 0"></novo-loading>
    </novo-list>
    <div class="picker-error" *ngIf="hasError">{{ labels.pickerError }}</div>
    <div class="picker-null-results" *ngIf="hasNonErrorMessage && term !== ''">{{ labels.pickerEmpty }}</div>
    <div class="picker-null-results" *ngIf="hasNonErrorMessage && term === ''">{{ labels.pickerTextFieldEmpty }}</div>
  `, encapsulation: ViewEncapsulation.None, host: {
                        class: 'novo-entity-picker-results',
                    }, styles: ["picker-results,entity-picker-results{background:#fff;color:#000;min-width:100%;max-width:100%;z-index:10;top:100%}picker-results .novo-list,entity-picker-results .novo-list{border:1px solid #4a89dc}picker-results .novo-list .novo-list-item,entity-picker-results .novo-list .novo-list-item{cursor:pointer;flex:0 0;transition:background-color .25s}picker-results .novo-list .novo-list-item>div,entity-picker-results .novo-list .novo-list-item>div{width:100%}picker-results .novo-list .novo-list-item.active,entity-picker-results .novo-list .novo-list-item.active{background-color:#e0ebf9}picker-results .novo-list .novo-list-item:hover,entity-picker-results .novo-list .novo-list-item:hover{background-color:#f1f6fc}picker-results .novo-list .novo-list-item .novo-item-content,entity-picker-results .novo-list .novo-list-item .novo-item-content{flex-flow:row wrap}picker-results .novo-list .novo-list-item .novo-item-content>*,entity-picker-results .novo-list .novo-list-item .novo-item-content>*{flex:0 0 33%;white-space:nowrap}picker-results picker-error,picker-results picker-loader,picker-results picker-null-recent-results,picker-results picker-null-results,picker-results .picker-error,picker-results .picker-loader,picker-results .picker-null-recent-results,picker-results .picker-null-results,entity-picker-results picker-error,entity-picker-results picker-loader,entity-picker-results picker-null-recent-results,entity-picker-results picker-null-results,entity-picker-results .picker-error,entity-picker-results .picker-loader,entity-picker-results .picker-null-recent-results,entity-picker-results .picker-null-results{background-color:#fff;text-align:center;color:#b5b5b5;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;border:1px solid #4a89dc;transform:translateY(0);transition:all .15s cubic-bezier(.35,0,.25,1);padding:.5rem}picker-results p.picker-error,picker-results p.picker-loader,picker-results p.picker-null-recent-results,picker-results p.picker-null-results,entity-picker-results p.picker-error,entity-picker-results p.picker-loader,entity-picker-results p.picker-null-recent-results,entity-picker-results p.picker-null-results{max-width:inherit;padding:5px}picker-results picker-loader,picker-results .picker-loader,entity-picker-results picker-loader,entity-picker-results .picker-loader{background-color:#fff;display:flex;align-items:center;flex-direction:column;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;border:1px solid #4a89dc;transform:translateY(0);transition:all .15s cubic-bezier(.35,0,.25,1)}picker-results section,entity-picker-results section{box-shadow:.1em .1em 1em #00000040;z-index:9;position:absolute;width:100%;background-color:#fff;color:#000}picker-results,.picker-results,quick-note-results,.quick-note-results{background-color:#fff;cursor:default;line-height:26px;width:100%;display:block}picker-results novo-list,picker-results ul,.picker-results novo-list,.picker-results ul,quick-note-results novo-list,quick-note-results ul,.quick-note-results novo-list,.quick-note-results ul{background-color:#fff;max-height:200px;overflow:auto;list-style:none;padding:0;margin:0;box-shadow:0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f;border:1px solid #4a89dc;transform:translateY(0);transition:all .15s cubic-bezier(.35,0,.25,1);display:block}picker-results novo-list novo-list-item,picker-results novo-list li,picker-results ul novo-list-item,picker-results ul li,.picker-results novo-list novo-list-item,.picker-results novo-list li,.picker-results ul novo-list-item,.picker-results ul li,quick-note-results novo-list novo-list-item,quick-note-results novo-list li,quick-note-results ul novo-list-item,quick-note-results ul li,.quick-note-results novo-list novo-list-item,.quick-note-results novo-list li,.quick-note-results ul novo-list-item,.quick-note-results ul li{font-size:.9em;padding:5px 16px}picker-results novo-list novo-list-item span,picker-results novo-list li span,picker-results ul novo-list-item span,picker-results ul li span,.picker-results novo-list novo-list-item span,.picker-results novo-list li span,.picker-results ul novo-list-item span,.picker-results ul li span,quick-note-results novo-list novo-list-item span,quick-note-results novo-list li span,quick-note-results ul novo-list-item span,quick-note-results ul li span,.quick-note-results novo-list novo-list-item span,.quick-note-results novo-list li span,.quick-note-results ul novo-list-item span,.quick-note-results ul li span{display:inline-block;min-width:100px;margin:2px 0}picker-results novo-list novo-list-item h6,picker-results novo-list li h6,picker-results ul novo-list-item h6,picker-results ul li h6,.picker-results novo-list novo-list-item h6,.picker-results novo-list li h6,.picker-results ul novo-list-item h6,.picker-results ul li h6,quick-note-results novo-list novo-list-item h6,quick-note-results novo-list li h6,quick-note-results ul novo-list-item h6,quick-note-results ul li h6,.quick-note-results novo-list novo-list-item h6,.quick-note-results novo-list li h6,.quick-note-results ul novo-list-item h6,.quick-note-results ul li h6{padding-top:0;font-weight:400;color:#93a0a9}picker-results novo-list novo-list-item h6 strong,picker-results novo-list li h6 strong,picker-results ul novo-list-item h6 strong,picker-results ul li h6 strong,.picker-results novo-list novo-list-item h6 strong,.picker-results novo-list li h6 strong,.picker-results ul novo-list-item h6 strong,.picker-results ul li h6 strong,quick-note-results novo-list novo-list-item h6 strong,quick-note-results novo-list li h6 strong,quick-note-results ul novo-list-item h6 strong,quick-note-results ul li h6 strong,.quick-note-results novo-list novo-list-item h6 strong,.quick-note-results novo-list li h6 strong,.quick-note-results ul novo-list-item h6 strong,.quick-note-results ul li h6 strong{font-weight:400;color:#3d464d}picker-results novo-list novo-list-item.active,picker-results novo-list novo-list-item:focus,picker-results novo-list novo-list-item:hover,picker-results novo-list li.active,picker-results novo-list li:focus,picker-results novo-list li:hover,picker-results ul novo-list-item.active,picker-results ul novo-list-item:focus,picker-results ul novo-list-item:hover,picker-results ul li.active,picker-results ul li:focus,picker-results ul li:hover,.picker-results novo-list novo-list-item.active,.picker-results novo-list novo-list-item:focus,.picker-results novo-list novo-list-item:hover,.picker-results novo-list li.active,.picker-results novo-list li:focus,.picker-results novo-list li:hover,.picker-results ul novo-list-item.active,.picker-results ul novo-list-item:focus,.picker-results ul novo-list-item:hover,.picker-results ul li.active,.picker-results ul li:focus,.picker-results ul li:hover,quick-note-results novo-list novo-list-item.active,quick-note-results novo-list novo-list-item:focus,quick-note-results novo-list novo-list-item:hover,quick-note-results novo-list li.active,quick-note-results novo-list li:focus,quick-note-results novo-list li:hover,quick-note-results ul novo-list-item.active,quick-note-results ul novo-list-item:focus,quick-note-results ul novo-list-item:hover,quick-note-results ul li.active,quick-note-results ul li:focus,quick-note-results ul li:hover,.quick-note-results novo-list novo-list-item.active,.quick-note-results novo-list novo-list-item:focus,.quick-note-results novo-list novo-list-item:hover,.quick-note-results novo-list li.active,.quick-note-results novo-list li:focus,.quick-note-results novo-list li:hover,.quick-note-results ul novo-list-item.active,.quick-note-results ul novo-list-item:focus,.quick-note-results ul novo-list-item:hover,.quick-note-results ul li.active,.quick-note-results ul li:focus,.quick-note-results ul li:hover{background-color:#e0ebf9}picker-results novo-list novo-list-item.disabled,picker-results novo-list li.disabled,picker-results ul novo-list-item.disabled,picker-results ul li.disabled,.picker-results novo-list novo-list-item.disabled,.picker-results novo-list li.disabled,.picker-results ul novo-list-item.disabled,.picker-results ul li.disabled,quick-note-results novo-list novo-list-item.disabled,quick-note-results novo-list li.disabled,quick-note-results ul novo-list-item.disabled,quick-note-results ul li.disabled,.quick-note-results novo-list novo-list-item.disabled,.quick-note-results novo-list li.disabled,.quick-note-results ul novo-list-item.disabled,.quick-note-results ul li.disabled{opacity:.5;pointer-events:none}picker-results novo-list novo-loading,picker-results ul novo-loading,.picker-results novo-list novo-loading,.picker-results ul novo-loading,quick-note-results novo-list novo-loading,quick-note-results ul novo-loading,.quick-note-results novo-list novo-loading,.quick-note-results ul novo-loading{justify-content:center}picker-results ul li,.picker-results ul li,quick-note-results ul li,.quick-note-results ul li{padding:10px 16px;box-sizing:border-box;display:flex;flex-wrap:wrap;flex-direction:column}picker-results.active,.picker-results.active,quick-note-results.active,.quick-note-results.active{z-index:1000}picker-results:focus,.picker-results:focus,quick-note-results:focus,.quick-note-results:focus{outline:none}entity-picker-results{background:#fff;width:100%;min-width:250px}entity-picker-results novo-list{background:#fff;min-width:30rem;max-height:49vh;overflow:auto}entity-picker-results novo-list .novo-item-content{margin-top:.5rem;margin-left:1.8rem;row-gap:1rem}entity-picker-results novo-list .novo-item-content .novo-text{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;padding-right:1em}entity-picker-results novo-list novo-loading{justify-content:center}workers-comp-codes-picker-results,distribution-list-picker-results{display:block;color:#000;width:100%;max-width:none;z-index:99;background:#fff;padding:1px}workers-comp-codes-picker-results.active,distribution-list-picker-results.active{border:1px solid #4a89dc}workers-comp-codes-picker-results .novo-list,distribution-list-picker-results .novo-list{min-height:100%;background:#fff;max-height:330px;overflow-y:auto;overflow-x:hidden}workers-comp-codes-picker-results .novo-list .novo-list-item,distribution-list-picker-results .novo-list .novo-list-item{display:block;transition:background-color .25s;border-bottom:1px solid #e2e2e2;cursor:pointer}workers-comp-codes-picker-results .novo-list .novo-list-item.disabled,distribution-list-picker-results .novo-list .novo-list-item.disabled{opacity:.5;pointer-events:none}workers-comp-codes-picker-results .novo-list .novo-list-item item-title h6,distribution-list-picker-results .novo-list .novo-list-item item-title h6{font-weight:500;padding:.6em 0 .5em}workers-comp-codes-picker-results .novo-list .novo-list-item item-title h6 span,distribution-list-picker-results .novo-list .novo-list-item item-title h6 span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:100px;width:80%;display:block}workers-comp-codes-picker-results .novo-list .novo-list-item>div,distribution-list-picker-results .novo-list .novo-list-item>div{width:100%;margin-left:15px}workers-comp-codes-picker-results .novo-list .novo-list-item.active,distribution-list-picker-results .novo-list .novo-list-item.active{background-color:#e0ebf9}workers-comp-codes-picker-results .novo-list .novo-list-item:hover,distribution-list-picker-results .novo-list .novo-list-item:hover{background-color:#e0ebf9}workers-comp-codes-picker-results .novo-list .novo-list-item item-content,distribution-list-picker-results .novo-list .novo-list-item item-content{flex-flow:row nowrap;justify-content:space-between}workers-comp-codes-picker-results .novo-list .novo-list-item item-content>*,distribution-list-picker-results .novo-list .novo-list-item item-content>*{flex:0 0 60%;white-space:nowrap}workers-comp-codes-picker-results .novo-list .novo-list-item item-content p,distribution-list-picker-results .novo-list .novo-list-item item-content p{margin-right:.5em;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;flex:1}workers-comp-codes-picker-results .novo-list .novo-list-item item-content p .label,distribution-list-picker-results .novo-list .novo-list-item item-content p .label{font-weight:700}workers-comp-codes-picker-results .novo-list novo-loading,distribution-list-picker-results .novo-list novo-loading{justify-content:center}workers-comp-codes-picker-results .picker-loader,workers-comp-codes-picker-results .picker-error,workers-comp-codes-picker-results .picker-null-results,distribution-list-picker-results .picker-loader,distribution-list-picker-results .picker-error,distribution-list-picker-results .picker-null-results{border:none}workers-comp-codes-picker-results .picker-null,workers-comp-codes-picker-results .picker-error,workers-comp-codes-picker-results .picker-loading,workers-comp-codes-picker-results .picker-no-recents,distribution-list-picker-results .picker-null,distribution-list-picker-results .picker-error,distribution-list-picker-results .picker-loading,distribution-list-picker-results .picker-no-recents{text-align:center;padding:1em 0 4em}workers-comp-codes-picker-results .picker-null>i,workers-comp-codes-picker-results .picker-error>i,workers-comp-codes-picker-results .picker-loading>i,workers-comp-codes-picker-results .picker-no-recents>i,distribution-list-picker-results .picker-null>i,distribution-list-picker-results .picker-error>i,distribution-list-picker-results .picker-loading>i,distribution-list-picker-results .picker-no-recents>i{font-size:3em;margin:.5em;color:#0000004d}workers-comp-codes-picker-results .picker-null>h4,workers-comp-codes-picker-results .picker-null>p,workers-comp-codes-picker-results .picker-error>h4,workers-comp-codes-picker-results .picker-error>p,workers-comp-codes-picker-results .picker-loading>h4,workers-comp-codes-picker-results .picker-loading>p,workers-comp-codes-picker-results .picker-no-recents>h4,workers-comp-codes-picker-results .picker-no-recents>p,distribution-list-picker-results .picker-null>h4,distribution-list-picker-results .picker-null>p,distribution-list-picker-results .picker-error>h4,distribution-list-picker-results .picker-error>p,distribution-list-picker-results .picker-loading>h4,distribution-list-picker-results .picker-loading>p,distribution-list-picker-results .picker-no-recents>h4,distribution-list-picker-results .picker-no-recents>p{margin:0;max-width:none;padding:0}workers-comp-codes-picker-results .picker-null>h4,workers-comp-codes-picker-results .picker-error>h4,workers-comp-codes-picker-results .picker-loading>h4,workers-comp-codes-picker-results .picker-no-recents>h4,distribution-list-picker-results .picker-null>h4,distribution-list-picker-results .picker-error>h4,distribution-list-picker-results .picker-loading>h4,distribution-list-picker-results .picker-no-recents>h4{font-weight:500}workers-comp-codes-picker-results section,distribution-list-picker-results section{box-shadow:.1em .1em 1em #00000040;z-index:9;position:absolute;width:100%;background-color:#fff;color:#000}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.NovoLabelService }, { type: i0.ChangeDetectorRef }], propDecorators: { select: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5UGlja2VyUmVzdWx0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25vdm8tZWxlbWVudHMvc3JjL2VsZW1lbnRzL3BpY2tlci9leHRyYXMvZW50aXR5LXBpY2tlci1yZXN1bHRzL0VudGl0eVBpY2tlclJlc3VsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekgsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMENBQTBDLENBQUM7Ozs7Ozs7O0FBMEY3RSxNQUFNLE9BQU8sa0JBQWtCO0lBSzdCLFlBQW1CLE1BQXdCO1FBQXhCLFdBQU0sR0FBTixNQUFNLENBQWtCO1FBRmpDLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUVYLENBQUM7SUFFL0M7OztPQUdHO0lBQ0gsWUFBWSxDQUFDLGFBQWE7UUFDeEIsa0RBQWtEO1FBQ2xELE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUs7UUFDcEIsOEVBQThFO1FBQzlFLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMxSCxDQUFDO0lBRUQsZ0JBQWdC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LEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7K0dBbEJVLG1CQUFtQjttR0FBbkIsbUJBQW1CLDJLQXhCcEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJULDI0ZUEzSVUsa0JBQWtCOzs0RkFrSmxCLG1CQUFtQjtrQkExQi9CLFNBQVM7K0JBQ0UsdUJBQXVCLFlBQ3ZCOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCVCxpQkFFYyxpQkFBaUIsQ0FBQyxJQUFJLFFBQy9CO3dCQUNKLEtBQUssRUFBRSw0QkFBNEI7cUJBQ3BDOzhJQUdTLE1BQU07c0JBQWYsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5vdm9MYWJlbFNlcnZpY2UgfSBmcm9tICdub3ZvLWVsZW1lbnRzL3NlcnZpY2VzJztcbmltcG9ydCB7IEJhc2VQaWNrZXJSZXN1bHRzIH0gZnJvbSAnLi4vYmFzZS1waWNrZXItcmVzdWx0cy9CYXNlUGlja2VyUmVzdWx0cyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2VudGl0eS1waWNrZXItcmVzdWx0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bm92by1saXN0LWl0ZW0gKm5nSWY9XCJtYXRjaC5kYXRhXCIgKGNsaWNrKT1cInNlbGVjdC5uZXh0KG1hdGNoLmRhdGEpXCI+XG4gICAgICA8bm92by1pdGVtLWhlYWRlcj5cbiAgICAgICAgPG5vdm8taXRlbS1hdmF0YXIgW2ljb25dPVwiZ2V0SWNvbkZvclJlc3VsdChtYXRjaC5kYXRhKVwiPjwvbm92by1pdGVtLWF2YXRhcj5cbiAgICAgICAgPG5vdm8taXRlbS10aXRsZT4gPHNwYW4gW2lubmVySHRtbF09XCJnZXROYW1lRm9yUmVzdWx0KG1hdGNoLmRhdGEpIHwgaGlnaGxpZ2h0OnRlcm1cIj48L3NwYW4+IDwvbm92by1pdGVtLXRpdGxlPlxuICAgICAgPC9ub3ZvLWl0ZW0taGVhZGVyPlxuICAgICAgPG5vdm8taXRlbS1jb250ZW50IGRpcmVjdGlvbj1cImhvcml6b250YWxcIj5cbiAgICAgICAgPCEtLSBDT01QQU5ZIDEgLS0+XG4gICAgICAgIDxub3ZvLXRleHQgc21hbGxlciBjbGFzcz1cImNvbXBhbnlcIiAqbmdJZj1cIm1hdGNoLmRhdGEuY29tcGFueU5hbWUgfHwgbWF0Y2guZGF0YT8uY2xpZW50Q29ycG9yYXRpb24/Lm5hbWVcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cImJoaS1jb21wYW55IGNvbXBhbnlcIj48L2k+XG4gICAgICAgICAgPHNwYW4gW2lubmVySHRtbF09XCJtYXRjaC5kYXRhLmNvbXBhbnlOYW1lIHx8IG1hdGNoLmRhdGE/LmNsaWVudENvcnBvcmF0aW9uPy5uYW1lIHwgaGlnaGxpZ2h0OnRlcm1cIj48L3NwYW4+XG4gICAgICAgIDwvbm92by10ZXh0PlxuICAgICAgICA8IS0tIENMSUVOVCBDT05UQUNUIC0tPlxuICAgICAgICA8bm92by10ZXh0IHNtYWxsZXIgY2xhc3M9XCJjb250YWN0XCIgKm5nSWY9XCJtYXRjaC5kYXRhPy5jbGllbnRDb250YWN0Py5maXJzdE5hbWVcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cImJoaS1wZXJzb24gY29udGFjdCBwZXJzb25cIj48L2k+XG4gICAgICAgICAgPHNwYW4gW2lubmVySHRtbF09XCJtYXRjaC5kYXRhLmNsaWVudENvbnRhY3QuZmlyc3ROYW1lICsgJyAnICsgbWF0Y2guZGF0YS5jbGllbnRDb250YWN0Lmxhc3ROYW1lIHwgaGlnaGxpZ2h0OnRlcm1cIj48L3NwYW4+XG4gICAgICAgIDwvbm92by10ZXh0PlxuICAgICAgICA8IS0tIENBTkRJREFURSAtLT5cbiAgICAgICAgPG5vdm8tdGV4dCBzbWFsbGVyIGNsYXNzPVwiY2FuZGlkYXRlXCIgKm5nSWY9XCJtYXRjaC5kYXRhLmNhbmRpZGF0ZSAmJiBtYXRjaC5kYXRhLnNlYXJjaEVudGl0eSA9PT0gJ1BsYWNlbWVudCdcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cImJoaS1jYW5kaWRhdGUgY2FuZGlkYXRlXCI+PC9pPlxuICAgICAgICAgIDxzcGFuIFtpbm5lckh0bWxdPVwibWF0Y2guZGF0YS5jYW5kaWRhdGUuZmlyc3ROYW1lICsgJyAnICsgbWF0Y2guZGF0YS5jYW5kaWRhdGUubGFzdE5hbWUgfCBoaWdobGlnaHQ6dGVybVwiPjwvc3Bhbj5cbiAgICAgICAgPC9ub3ZvLXRleHQ+XG4gICAgICAgIDwhLS0gU1RBUlQgJiBFTkQgREFURSAtLT5cbiAgICAgICAgPG5vdm8tdGV4dCBzbWFsbGVyIGNsYXNzPVwic3RhcnQtZGF0ZVwiICpuZ0lmPVwibWF0Y2guZGF0YS5kYXRlQmVnaW4gJiYgbWF0Y2guZGF0YS5zZWFyY2hFbnRpdHkgPT09ICdQbGFjZW1lbnQnXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJiaGktY2FsZW5kYXJcIj48L2k+XG4gICAgICAgICAgPHNwYW4gW2lubmVySHRtbF09XCJyZW5kZXJUaW1lc3RhbXAobWF0Y2guZGF0YS5kYXRlQmVnaW4pICsgJyAtICcgKyByZW5kZXJUaW1lc3RhbXAobWF0Y2guZGF0YS5kYXRlRW5kKVwiPjwvc3Bhbj5cbiAgICAgICAgPC9ub3ZvLXRleHQ+XG4gICAgICAgIDwhLS0gU1RBUlQgRGF0ZSAtLT5cbiAgICAgICAgPG5vdm8tdGV4dCBzbWFsbGVyIGNsYXNzPVwic3RhcnQtZGF0ZVwiICpuZ0lmPVwibWF0Y2guZGF0YS5zdGFydFRpbWUgJiYgbWF0Y2guZGF0YS5zZWFyY2hFbnRpdHkgPT09ICdKb2JTaGlmdCdcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cImJoaS1jYWxlbmRhclwiPjwvaT5cbiAgICAgICAgICA8c3BhbiBbaW5uZXJIdG1sXT1cInJlbmRlclRpbWVzdGFtcChtYXRjaC5kYXRhLnN0YXJ0VGltZSlcIj48L3NwYW4+XG4gICAgICAgIDwvbm92by10ZXh0PlxuICAgICAgICA8IS0tIFNUQVJUICYgRU5EIFRJTUUgLS0+XG4gICAgICAgIDxub3ZvLXRleHQgc21hbGxlciBjbGFzcz1cInN0YXJ0LXRpbWVcIiAqbmdJZj1cIm1hdGNoLmRhdGEuc3RhcnRUaW1lICYmIG1hdGNoLmRhdGEuc2VhcmNoRW50aXR5ID09PSAnSm9iU2hpZnQnXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJiaGktY2xvY2tcIj48L2k+XG4gICAgICAgICAgPHNwYW4gW2lubmVySHRtbF09XCJyZW5kZXJUaW1lTm9PZmZzZXQobWF0Y2guZGF0YS5zdGFydFRpbWUpICsgJyAtICcgKyByZW5kZXJUaW1lTm9PZmZzZXQobWF0Y2guZGF0YS5lbmRUaW1lKVwiPjwvc3Bhbj5cbiAgICAgICAgPC9ub3ZvLXRleHQ+XG4gICAgICAgIDwhLS0gSk9CT1JERVIgLS0+XG4gICAgICAgIDxub3ZvLXRleHQgc21hbGxlciBjbGFzcz1cImpvYlwiICpuZ0lmPVwibWF0Y2guZGF0YS5qb2JPcmRlciAmJiBtYXRjaC5kYXRhLnNlYXJjaEVudGl0eSA9PT0gJ0pvYlNoaWZ0J1wiPlxuICAgICAgICAgIDxpIGNsYXNzPVwiYmhpLWpvYiBqb2JcIj48L2k+XG4gICAgICAgICAgPHNwYW4gW2lubmVySHRtbF09XCJtYXRjaC5kYXRhLmpvYk9yZGVyLnRpdGxlIHwgaGlnaGxpZ2h0OnRlcm1cIj48L3NwYW4+XG4gICAgICAgIDwvbm92by10ZXh0PlxuICAgICAgICA8IS0tIE9QRU5JTkdTIC0tPlxuICAgICAgICA8bm92by10ZXh0IHNtYWxsZXIgY2xhc3M9XCJvcGVuaW5nc1wiICpuZ0lmPVwibWF0Y2guZGF0YS5vcGVuaW5ncyAmJiBtYXRjaC5kYXRhLnNlYXJjaEVudGl0eSA9PT0gJ0pvYlNoaWZ0J1wiPlxuICAgICAgICAgIDxpIGNsYXNzPVwiYmhpLWNhbmRpZGF0ZVwiPjwvaT5cbiAgICAgICAgICA8c3Bhbj57eyBtYXRjaC5kYXRhLm51bUFzc2lnbmVkIH19IC8ge3sgbWF0Y2guZGF0YS5vcGVuaW5ncyB9fTwvc3Bhbj5cbiAgICAgICAgPC9ub3ZvLXRleHQ+XG4gICAgICAgIDwhLS0gRU1BSUwgLS0+XG4gICAgICAgIDxub3ZvLXRleHQgc21hbGxlciBjbGFzcz1cImVtYWlsXCIgKm5nSWY9XCJtYXRjaC5kYXRhLmVtYWlsXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJiaGktZW1haWxcIj48L2k+IDxzcGFuIFtpbm5lckh0bWxdPVwibWF0Y2guZGF0YS5lbWFpbCB8IGhpZ2hsaWdodDp0ZXJtXCI+PC9zcGFuPlxuICAgICAgICA8L25vdm8tdGV4dD5cbiAgICAgICAgPCEtLSBQSE9ORSAtLT5cbiAgICAgICAgPG5vdm8tdGV4dCBzbWFsbGVyIGNsYXNzPVwicGhvbmVcIiAqbmdJZj1cIm1hdGNoLmRhdGEucGhvbmVcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cImJoaS1waG9uZVwiPjwvaT4gPHNwYW4gW2lubmVySHRtbF09XCJtYXRjaC5kYXRhLnBob25lIHwgaGlnaGxpZ2h0OnRlcm1cIj48L3NwYW4+XG4gICAgICAgIDwvbm92by10ZXh0PlxuICAgICAgICA8IS0tIEFERFJFU1MgLS0+XG4gICAgICAgIDxub3ZvLXRleHQgc21hbGxlciBjbGFzcz1cImxvY2F0aW9uXCIgKm5nSWY9XCJtYXRjaC5kYXRhLmFkZHJlc3MgJiYgKG1hdGNoLmRhdGEuYWRkcmVzcy5jaXR5IHx8IG1hdGNoLmRhdGEuYWRkcmVzcy5zdGF0ZSlcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cImJoaS1sb2NhdGlvblwiPjwvaT4gPHNwYW4gKm5nSWY9XCJtYXRjaC5kYXRhLmFkZHJlc3MuY2l0eVwiIFtpbm5lckh0bWxdPVwiaGlnaGxpZ2h0KG1hdGNoLmRhdGEuYWRkcmVzcy5jaXR5LCB0ZXJtKVwiPjwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiAqbmdJZj1cIm1hdGNoLmRhdGEuYWRkcmVzcy5jaXR5ICYmIG1hdGNoLmRhdGEuYWRkcmVzcy5zdGF0ZVwiPiwgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuICpuZ0lmPVwibWF0Y2guZGF0YS5hZGRyZXNzLnN0YXRlXCIgW2lubmVySHRtbF09XCJtYXRjaC5kYXRhLmFkZHJlc3Muc3RhdGUgfCBoaWdobGlnaHQ6dGVybVwiPjwvc3Bhbj5cbiAgICAgICAgPC9ub3ZvLXRleHQ+XG4gICAgICAgIDwhLS0gU1RBVFVTIC0tPlxuICAgICAgICA8bm92by10ZXh0IHNtYWxsZXIgY2xhc3M9XCJzdGF0dXNcIiAqbmdJZj1cIm1hdGNoLmRhdGEuc3RhdHVzXCI+XG4gICAgICAgICAgPGkgY2xhc3M9XCJiaGktaW5mb1wiPjwvaT4gPHNwYW4gW2lubmVySHRtbF09XCJtYXRjaC5kYXRhLnN0YXR1cyB8IGhpZ2hsaWdodDp0ZXJtXCI+PC9zcGFuPlxuICAgICAgICA8L25vdm8tdGV4dD5cbiAgICAgICAgPCEtLSBPV05FUiAtLT5cbiAgICAgICAgPG5vdm8tdGV4dCBzbWFsbGVyIGNsYXNzPVwib3duZXJcIiAqbmdJZj1cIm1hdGNoLmRhdGEub3duZXIgJiYgbWF0Y2guZGF0YS5vd25lci5uYW1lICYmIG1hdGNoLmRhdGEuc2VhcmNoRW50aXR5ID09PSAnQ2FuZGlkYXRlJ1wiPlxuICAgICAgICAgIDxpIGNsYXNzPVwiYmhpLXBlcnNvblwiPjwvaT4gPHNwYW4gW2lubmVySHRtbF09XCJtYXRjaC5kYXRhLm93bmVyLm5hbWUgfCBoaWdobGlnaHQ6dGVybVwiPjwvc3Bhbj5cbiAgICAgICAgPC9ub3ZvLXRleHQ+XG4gICAgICAgIDwhLS0gUFJJTUFSWSBERVBBUlRNRU5UIC0tPlxuICAgICAgICA8bm92by10ZXh0XG4gICAgICAgICAgc21hbGxlclxuICAgICAgICAgIGNsYXNzPVwicHJpbWFyeS1kZXBhcnRtZW50XCJcbiAgICAgICAgICAqbmdJZj1cIm1hdGNoLmRhdGEucHJpbWFyeURlcGFydG1lbnQgJiYgbWF0Y2guZGF0YS5wcmltYXJ5RGVwYXJ0bWVudC5uYW1lICYmIG1hdGNoLmRhdGEuc2VhcmNoRW50aXR5ID09PSAnQ29ycG9yYXRlVXNlcidcIlxuICAgICAgICA+XG4gICAgICAgICAgPGkgY2xhc3M9XCJiaGktZGVwYXJ0bWVudFwiPjwvaT4gPHNwYW4gW2lubmVySHRtbF09XCJtYXRjaC5kYXRhLnByaW1hcnlEZXBhcnRtZW50Lm5hbWUgfCBoaWdobGlnaHQ6dGVybVwiPjwvc3Bhbj5cbiAgICAgICAgPC9ub3ZvLXRleHQ+XG4gICAgICAgIDwhLS0gT0NDVVBBVElPTiAtLT5cbiAgICAgICAgPG5vdm8tdGV4dCBzbWFsbGVyIGNsYXNzPVwib2NjdXBhdGlvblwiICpuZ0lmPVwibWF0Y2guZGF0YS5vY2N1cGF0aW9uICYmIG1hdGNoLmRhdGEuc2VhcmNoRW50aXR5ID09PSAnQ29ycG9yYXRlVXNlcidcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cImJoaS1vY2N1cGF0aW9uXCI+PC9pPiA8c3BhbiBbaW5uZXJIdG1sXT1cIm1hdGNoLmRhdGEub2NjdXBhdGlvbiB8IGhpZ2hsaWdodDp0ZXJtXCI+PC9zcGFuPlxuICAgICAgICA8L25vdm8tdGV4dD5cbiAgICAgIDwvbm92by1pdGVtLWNvbnRlbnQ+XG4gICAgPC9ub3ZvLWxpc3QtaXRlbT5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4uL3BpY2tlci1yZXN1bHRzL1BpY2tlclJlc3VsdC5zY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIEVudGl0eVBpY2tlclJlc3VsdCB7XG4gIEBJbnB1dCgpIG1hdGNoOiBhbnk7XG4gIEBJbnB1dCgpIHRlcm06IGFueTtcbiAgQE91dHB1dCgpIHNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGxhYmVsczogTm92b0xhYmVsU2VydmljZSkge31cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFRoaXMgZnVuY3Rpb24gY2FwdHVyZXMgdGhlIHdob2xlIHF1ZXJ5IHN0cmluZyBhbmQgcmVwbGFjZSBpdCB3aXRoIHRoZSBzdHJpbmcgdGhhdCB3aWxsIGJlIHVzZWQgdG9cbiAgICogbWF0Y2guXG4gICAqL1xuICBlc2NhcGVSZWdleHAocXVlcnlUb0VzY2FwZSkge1xuICAgIC8vIEV4OiBpZiB0aGUgY2FwdHVyZSBpcyBcImFcIiB0aGUgcmVzdWx0IHdpbGwgYmUgXFxhXG4gICAgcmV0dXJuIHF1ZXJ5VG9Fc2NhcGUucmVwbGFjZSgvKFsuPyorXiRbXFxdXFxcXCgpe318LV0pL2csICdcXFxcJDEnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgaGlnaGxpZ2h0IHBpcGVcbiAgICovXG4gIGhpZ2hsaWdodChtYXRjaCwgcXVlcnkpIHtcbiAgICAvLyBSZXBsYWNlcyB0aGUgY2FwdHVyZSBzdHJpbmcgd2l0aCBhIHRoZSBzYW1lIHN0cmluZyBpbnNpZGUgb2YgYSBcInN0cm9uZ1wiIHRhZ1xuICAgIHJldHVybiBxdWVyeSAmJiBtYXRjaCA/IG1hdGNoLnJlcGxhY2UobmV3IFJlZ0V4cCh0aGlzLmVzY2FwZVJlZ2V4cChxdWVyeS50cmltKCkpLCAnZ2knKSwgJzxzdHJvbmc+JCY8L3N0cm9uZz4nKSA6IG1hdGNoO1xuICB9XG5cbiAgZ2V0SWNvbkZvclJlc3VsdChyZXN1bHQ/OiBhbnkpOiBzdHJpbmcge1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHN3aXRjaCAocmVzdWx0LnNlYXJjaEVudGl0eSkge1xuICAgICAgICBjYXNlICdDbGllbnRDb250YWN0JzpcbiAgICAgICAgICByZXR1cm4gJ3BlcnNvbiBjb250YWN0JztcbiAgICAgICAgY2FzZSAnQ2xpZW50Q29ycG9yYXRpb24nOlxuICAgICAgICAgIHJldHVybiAnY29tcGFueSc7XG4gICAgICAgIGNhc2UgJ09wcG9ydHVuaXR5JzpcbiAgICAgICAgICByZXR1cm4gJ29wcG9ydHVuaXR5JztcbiAgICAgICAgY2FzZSAnQ2FuZGlkYXRlJzpcbiAgICAgICAgICByZXR1cm4gJ2NhbmRpZGF0ZSc7XG4gICAgICAgIGNhc2UgJ0xlYWQnOlxuICAgICAgICAgIHJldHVybiAnbGVhZCc7XG4gICAgICAgIGNhc2UgJ0pvYk9yZGVyJzpcbiAgICAgICAgICByZXR1cm4gJ2pvYic7XG4gICAgICAgIGNhc2UgJ1BsYWNlbWVudCc6XG4gICAgICAgICAgcmV0dXJuICdzdGFyIHBsYWNlbWVudCc7XG4gICAgICAgIGNhc2UgJ0NvcnBvcmF0ZVVzZXInOlxuICAgICAgICAgIHJldHVybiAndXNlcic7XG4gICAgICAgIGNhc2UgJ0NvcnBvcmF0aW9uRGVwYXJ0bWVudCc6XG4gICAgICAgICAgcmV0dXJuICdkZXBhcnRtZW50JztcbiAgICAgICAgY2FzZSAnSm9iU2hpZnQnOlxuICAgICAgICAgIHJldHVybiAndGltZXRhYmxlIGNvbnRyYWN0JztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJlbmRlclRpbWVzdGFtcChkYXRlPzogYW55KSB7XG4gICAgbGV0IHRpbWVzdGFtcCA9ICcnO1xuICAgIGlmIChkYXRlKSB7XG4gICAgICB0aW1lc3RhbXAgPSB0aGlzLmxhYmVscy5mb3JtYXREYXRlV2l0aEZvcm1hdChkYXRlLCB7IHllYXI6ICdudW1lcmljJywgbW9udGg6ICdudW1lcmljJywgZGF5OiAnbnVtZXJpYycgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aW1lc3RhbXA7XG4gIH1cblxuICByZW5kZXJUaW1lKGRhdGVTdHI/OiBzdHJpbmcpIHtcbiAgICBsZXQgdGltZXN0YW1wID0gJyc7XG4gICAgaWYgKGRhdGVTdHIpIHtcbiAgICAgIHRpbWVzdGFtcCA9IHRoaXMubGFiZWxzLmZvcm1hdFRpbWUobmV3IERhdGUoZGF0ZVN0cikpO1xuICAgIH1cbiAgICByZXR1cm4gdGltZXN0YW1wO1xuICB9XG5cbiAgcmVuZGVyVGltZU5vT2Zmc2V0KGRhdGVTdHI/OiBzdHJpbmcpIHtcbiAgICBsZXQgdGltZXN0YW1wID0gJyc7XG4gICAgaWYgKGRhdGVTdHIpIHtcbiAgICAgIGRhdGVTdHIgPSBkYXRlU3RyLnNsaWNlKDAsIDE5KTtcbiAgICAgIHRpbWVzdGFtcCA9IHRoaXMubGFiZWxzLmZvcm1hdFRpbWUoZGF0ZVN0cik7XG4gICAgfVxuICAgIHJldHVybiB0aW1lc3RhbXA7XG4gIH1cblxuICBnZXROYW1lRm9yUmVzdWx0KHJlc3VsdD86IGFueSkge1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHN3aXRjaCAocmVzdWx0LnNlYXJjaEVudGl0eSkge1xuICAgICAgICBjYXNlICdMZWFkJzpcbiAgICAgICAgY2FzZSAnQ29ycG9yYXRlVXNlcic6XG4gICAgICAgIGNhc2UgJ0NsaWVudENvbnRhY3QnOlxuICAgICAgICBjYXNlICdDYW5kaWRhdGUnOlxuICAgICAgICBjYXNlICdQZXJzb24nOlxuICAgICAgICAgIGlmICgnZmlyc3ROYW1lJyBpbiByZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtyZXN1bHQuZmlyc3ROYW1lfSAke3Jlc3VsdC5sYXN0TmFtZX1gLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGAke3Jlc3VsdC5uYW1lIHx8ICcnfWAudHJpbSgpO1xuICAgICAgICBjYXNlICdDbGllbnRDb3Jwb3JhdGlvbic6XG4gICAgICAgICAgcmV0dXJuIGAke3Jlc3VsdC5uYW1lIHx8ICcnfWAudHJpbSgpO1xuICAgICAgICBjYXNlICdPcHBvcnR1bml0eSc6XG4gICAgICAgIGNhc2UgJ0pvYk9yZGVyJzpcbiAgICAgICAgY2FzZSAnQmlsbGluZ1Byb2ZpbGUnOlxuICAgICAgICBjYXNlICdJbnZvaWNlVGVybSc6XG4gICAgICAgICAgcmV0dXJuIGAke3Jlc3VsdC5pZH0gfCAke3Jlc3VsdC50aXRsZSB8fCAnJ31gLnRyaW0oKTtcbiAgICAgICAgY2FzZSAnUGxhY2VtZW50JzpcbiAgICAgICAgICBsZXQgbGFiZWwgPSBgJHtyZXN1bHQuaWR9YDtcbiAgICAgICAgICBpZiAocmVzdWx0LmNhbmRpZGF0ZSB8fCByZXN1bHQuam9iT3JkZXIpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuY2FuZGlkYXRlICYmIHJlc3VsdC5qb2JPcmRlcikge1xuICAgICAgICAgICAgICBsYWJlbCA9IGAke2xhYmVsfSB8ICR7cmVzdWx0LmNhbmRpZGF0ZS5maXJzdE5hbWV9ICR7cmVzdWx0LmNhbmRpZGF0ZS5sYXN0TmFtZX0gLSAke3Jlc3VsdC5qb2JPcmRlci50aXRsZX1gLnRyaW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LmpvYk9yZGVyKSB7XG4gICAgICAgICAgICAgIGxhYmVsID0gYCR7bGFiZWx9IHwgJHtyZXN1bHQuam9iT3JkZXIudGl0bGV9YC50cmltKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsYWJlbCA9IGAke2xhYmVsfSB8ICR7cmVzdWx0LmNhbmRpZGF0ZS5maXJzdE5hbWV9ICR7cmVzdWx0LmNhbmRpZGF0ZS5sYXN0TmFtZX1gLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgICAgICBjYXNlICdKb2JTaGlmdCc6XG4gICAgICAgICAgcmV0dXJuIGAke3Jlc3VsdC5qb2JPcmRlcj8udGl0bGV9IEAgJHtyZXN1bHQuam9iT3JkZXI/LmNsaWVudENvcnBvcmF0aW9uPy5uYW1lIHx8ICcnfWAudHJpbSgpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBgJHtyZXN1bHQubmFtZSB8fCByZXN1bHQubGFiZWwgfHwgJyd9YC50cmltKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlbnRpdHktcGlja2VyLXJlc3VsdHMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxub3ZvLWxpc3QgKm5nSWY9XCJtYXRjaGVzLmxlbmd0aCA+IDBcIiBkaXJlY3Rpb249XCJ2ZXJ0aWNhbFwiPlxuICAgICAgPGVudGl0eS1waWNrZXItcmVzdWx0XG4gICAgICAgICpuZ0Zvcj1cImxldCBtYXRjaCBvZiBtYXRjaGVzXCJcbiAgICAgICAgW21hdGNoXT1cIm1hdGNoXCJcbiAgICAgICAgW3Rlcm1dPVwidGVybVwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsgYWN0aXZlOiBtYXRjaCA9PT0gYWN0aXZlTWF0Y2ggfVwiXG4gICAgICAgIChjbGljayk9XCJzZWxlY3RNYXRjaCgkZXZlbnQsIG1hdGNoKVwiXG4gICAgICAgIChtb3VzZWVudGVyKT1cInNlbGVjdEFjdGl2ZShtYXRjaClcIlxuICAgICAgICBbY2xhc3MuZGlzYWJsZWRdPVwicHJlc2VsZWN0ZWQobWF0Y2gpXCJcbiAgICAgID5cbiAgICAgIDwvZW50aXR5LXBpY2tlci1yZXN1bHQ+XG4gICAgICA8bm92by1sb2FkaW5nIHRoZW1lPVwibGluZVwiICpuZ0lmPVwiaXNMb2FkaW5nICYmIG1hdGNoZXMubGVuZ3RoID4gMFwiPjwvbm92by1sb2FkaW5nPlxuICAgIDwvbm92by1saXN0PlxuICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItZXJyb3JcIiAqbmdJZj1cImhhc0Vycm9yXCI+e3sgbGFiZWxzLnBpY2tlckVycm9yIH19PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInBpY2tlci1udWxsLXJlc3VsdHNcIiAqbmdJZj1cImhhc05vbkVycm9yTWVzc2FnZSAmJiB0ZXJtICE9PSAnJ1wiPnt7IGxhYmVscy5waWNrZXJFbXB0eSB9fTwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJwaWNrZXItbnVsbC1yZXN1bHRzXCIgKm5nSWY9XCJoYXNOb25FcnJvck1lc3NhZ2UgJiYgdGVybSA9PT0gJydcIj57eyBsYWJlbHMucGlja2VyVGV4dEZpZWxkRW1wdHkgfX08L2Rpdj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4uL3BpY2tlci1yZXN1bHRzL1BpY2tlclJlc3VsdHMuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdub3ZvLWVudGl0eS1waWNrZXItcmVzdWx0cycsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIEVudGl0eVBpY2tlclJlc3VsdHMgZXh0ZW5kcyBCYXNlUGlja2VyUmVzdWx0cyB7XG4gIEBPdXRwdXQoKSBzZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHB1YmxpYyBsYWJlbHM6IE5vdm9MYWJlbFNlcnZpY2UsIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICBzdXBlcihlbGVtZW50LCByZWYpO1xuICB9XG5cbiAgZ2V0IGhhc05vbkVycm9yTWVzc2FnZSgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNMb2FkaW5nICYmICF0aGlzLm1hdGNoZXMubGVuZ3RoICYmICF0aGlzLmhhc0Vycm9yO1xuICB9XG5cbiAgZ2V0TGlzdEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ25vdm8tbGlzdCcpO1xuICB9XG5cbiAgc2VsZWN0TWF0Y2goZXZlbnQ/OiBhbnksIGl0ZW0/OiBhbnkpIHtcbiAgICB0aGlzLnNlbGVjdC5uZXh0KGl0ZW0pO1xuICAgIHJldHVybiBzdXBlci5zZWxlY3RNYXRjaChldmVudCwgaXRlbSk7XG4gIH1cbn1cbiJdfQ==