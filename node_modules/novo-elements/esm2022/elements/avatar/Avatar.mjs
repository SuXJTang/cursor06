// NG2
import { Component, HostBinding, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "@angular/common";
export class NovoAvatarElement {
    get hb_classBinding() {
        return [`avatar-size-${this.size}`, `avatar-shape-${this.shape}`, `avatar-color-${this.color}`];
    }
    get background() {
        if (!this.image && !this.source.profileImage)
            return;
        return `url(${this.image || this.source.profileImage})`;
    }
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
        this.size = 'medium';
        this.shape = 'round';
    }
    ngOnInit() {
        let src;
        if ((this.source && this.source !== '') || this.label) {
            if (this.source.profileImage) {
                // this.src = this.source.profileImage;
                return;
            }
            else if (this.source.logo) {
                src = this.source.logo;
            }
            else {
                const first = this.label || this.source.firstName
                    ? this.source.firstName.charAt(0)
                    : this.source.name
                        ? this.source.name.charAt(0)
                        : this.source.username
                            ? this.source.username.charAt(0)
                            : '';
                const last = this.source.lastName ? this.source.lastName.charAt(0) : '';
                // Defining Colors
                const colors = [
                    '#1abc9c',
                    '#16a085',
                    '#f1c40f',
                    '#f39c12',
                    '#2ecc71',
                    '#27ae60',
                    '#e67e22',
                    '#d35400',
                    '#3498db',
                    '#2980b9',
                    '#e74c3c',
                    '#c0392b',
                    '#9b59b6',
                    '#8e44ad',
                    '#bdc3c7',
                    '#34495e',
                    '#2c3e50',
                    '#95a5a6',
                    '#7f8c8d',
                    '#ec87bf',
                    '#d870ad',
                    '#f69785',
                    '#9ba37e',
                    '#b49255',
                    '#b49255',
                    '#a94136',
                ];
                const lighterColors = [
                    '#15D6B0',
                    '#16A069',
                    '#F1D60F',
                    '#F3AC12',
                    '#2ED85B',
                    '#28BC7F',
                    '#E66322',
                    '#D3002B',
                    '#6534DB',
                    '#29B2B9',
                    '#E73C63',
                    '#DB6D31',
                    '#CB48B5',
                    '#6944AD',
                    '#38536D',
                    '#3D6473',
                    '#394A6C',
                    '#92BCB7',
                    '#7D99A2',
                    '#F14F76',
                    '#CB5CDA',
                    '#FFB475',
                    '#B9CE6E',
                    '#DDAA4F',
                    '#CD6F45',
                    '#B9354A',
                ];
                const settings = {
                    // Default settings
                    textColor: '#ffffff',
                    height: 100,
                    width: 100,
                    fontSize: 50,
                    fontWeight: 400,
                    fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
                };
                // making the text object
                const colorIndex = Math.floor((first.charCodeAt(0) - 65) % colors.length);
                const cobj = document.createElement('text');
                cobj.setAttribute('text-anchor', 'middle');
                cobj.setAttribute('x', '50%');
                cobj.setAttribute('y', '50%');
                cobj.setAttribute('dy', '0.35em');
                cobj.setAttribute('pointer-events', 'auto');
                cobj.setAttribute('fill', settings.textColor);
                cobj.setAttribute('font-family', settings.fontFamily);
                cobj.style.fontWeight = settings.fontWeight;
                cobj.style.fontSize = `${settings.fontSize}px`;
                const ltrs = document.createTextNode(this.label || first + last);
                cobj.appendChild(ltrs);
                const svg = document.createElement('svg');
                svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                svg.setAttribute('pointer-events', 'none');
                svg.setAttribute('width', settings.width);
                svg.setAttribute('height', settings.height);
                // this.setPrefixedValue(svg, 'background', colors[colorIndex]);
                this.setPrefixedValue(svg, 'background', `linear-gradient(-45deg, ${colors[colorIndex]} 0%, ${lighterColors[colorIndex]} 100%)`);
                svg.style.width = `${settings.width}px`;
                svg.style.height = `${settings.height}px`;
                svg.appendChild(cobj);
                const top = document.createElement('div');
                top.appendChild(svg);
                const svgHtml = window.btoa(unescape(encodeURIComponent(top.innerHTML)));
                src = `data:image/svg+xml;base64, ${svgHtml}`;
            }
            this.src = this.sanitizer.bypassSecurityTrustUrl(src);
        }
    }
    setPrefixedValue(elm, prop, value) {
        const prefixes = ['-moz-', '-webkit-', '-o-', '-ms-', '-khtml-'];
        // Clear
        elm.style[prop] = '';
        const starting = elm.style[prop];
        // Try raw first
        try {
            elm.style[prop] = value;
            if (elm.style[prop] !== starting) {
                return;
            }
        }
        catch (e) {
            // no op
        }
        // Try prefixes
        for (let i = 0; i < prefixes.length; ++i) {
            const v = prefixes[i] + value;
            try {
                elm.style[prop] = v;
                if (elm.style[prop] !== starting) {
                    return;
                }
            }
            catch (e2) {
                // no op
            }
        }
    }
    _isValidURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAvatarElement, deps: [{ token: i1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: NovoAvatarElement, selector: "novo-avatar", inputs: { source: "source", label: "label", theme: "theme", image: "image", size: "size", shape: "shape", color: "color" }, host: { properties: { "class": "this.hb_classBinding", "style.backgroundImage": "this.background" } }, ngImport: i0, template: '<img *ngIf="src" [src]="src"/>', isInline: true, styles: [":host{display:inline-block;width:30px;height:30px;background-size:cover;background-position:center;overflow:hidden;position:relative;background-color:var(--background-muted)}:host img{width:inherit;height:inherit;border-radius:inherit}:host.avatar-size-small{width:20px;height:20px}:host.avatar-size-large{width:40px;height:40px}:host.avatar-shape-round{border-radius:2em}:host.avatar-shape-square{border-radius:.4em}:host.avatar-color-black{color:#fff;background-color:#000}:host.avatar-color-white{color:#3d464d;background-color:#fff}:host.avatar-color-gray{color:#3d464d;background-color:#9e9e9e}:host.avatar-color-grey{color:#3d464d;background-color:#9e9e9e}:host.avatar-color-offWhite{color:#3d464d;background-color:#f7f7f7}:host.avatar-color-bright{color:#3d464d;background-color:#f7f7f7}:host.avatar-color-light{color:#3d464d;background-color:#dbdbdb}:host.avatar-color-neutral{color:#fff;background-color:#4f5361}:host.avatar-color-dark{color:#fff;background-color:#3d464d}:host.avatar-color-orange{color:#3d464d;background-color:#ff6900}:host.avatar-color-navigation{color:#fff;background-color:#202945}:host.avatar-color-skyBlue{color:#fff;background-color:#009bdf}:host.avatar-color-steel{color:#fff;background-color:#5b6770}:host.avatar-color-metal{color:#fff;background-color:#637893}:host.avatar-color-sand{color:#3d464d;background-color:#f4f4f4}:host.avatar-color-silver{color:#3d464d;background-color:#e2e2e2}:host.avatar-color-stone{color:#3d464d;background-color:#bebebe}:host.avatar-color-ash{color:#3d464d;background-color:#a0a0a0}:host.avatar-color-slate{color:#fff;background-color:#707070}:host.avatar-color-onyx{color:#fff;background-color:#526980}:host.avatar-color-charcoal{color:#fff;background-color:#282828}:host.avatar-color-moonlight{color:#fff;background-color:#1a242f}:host.avatar-color-midnight{color:#fff;background-color:#202945}:host.avatar-color-darkness{color:#fff;background-color:#161f27}:host.avatar-color-navy{color:#fff;background-color:#0d2d42}:host.avatar-color-aqua{color:#3d464d;background-color:#3bafda}:host.avatar-color-ocean{color:#fff;background-color:#4a89dc}:host.avatar-color-mint{color:#3d464d;background-color:#37bc9b}:host.avatar-color-grass{color:#fff;background-color:#8cc152}:host.avatar-color-sunflower{color:#fff;background-color:#f6b042}:host.avatar-color-bittersweet{color:#fff;background-color:#eb6845}:host.avatar-color-grapefruit{color:#fff;background-color:#da4453}:host.avatar-color-carnation{color:#fff;background-color:#d770ad}:host.avatar-color-lavender{color:#fff;background-color:#967adc}:host.avatar-color-mountain{color:#fff;background-color:#9678b6}:host.avatar-color-info{color:#fff;background-color:#4a89dc}:host.avatar-color-positive{color:#fff;background-color:#4a89dc}:host.avatar-color-success{color:#fff;background-color:#8cc152}:host.avatar-color-negative{color:#fff;background-color:#da4453}:host.avatar-color-danger{color:#fff;background-color:#da4453}:host.avatar-color-error{color:#fff;background-color:#da4453}:host.avatar-color-warning{color:#fff;background-color:#f6b042}:host.avatar-color-empty{color:#3d464d;background-color:#cccdcc}:host.avatar-color-disabled{color:#3d464d;background-color:#bebebe}:host.avatar-color-background{color:#3d464d;background-color:#f7f7f7}:host.avatar-color-backgroundDark{color:#3d464d;background-color:#e2e2e2}:host.avatar-color-presentation{color:#fff;background-color:#5b6770}:host.avatar-color-bullhorn{color:#3d464d;background-color:#ff6900}:host.avatar-color-pulse{color:#3d464d;background-color:#3bafda}:host.avatar-color-company{color:#fff;background-color:#39d}:host.avatar-color-candidate{color:#fff;background-color:#4b7}:host.avatar-color-lead{color:#fff;background-color:#a69}:host.avatar-color-contact{color:#fff;background-color:#fa4}:host.avatar-color-clientcontact{color:#fff;background-color:#fa4}:host.avatar-color-opportunity{color:#fff;background-color:#625}:host.avatar-color-job{color:#fff;background-color:#b56}:host.avatar-color-joborder{color:#fff;background-color:#b56}:host.avatar-color-submission{color:#3d464d;background-color:#a9adbb}:host.avatar-color-sendout{color:#fff;background-color:#747884}:host.avatar-color-placement{color:#fff;background-color:#0b344f}:host.avatar-color-note{color:#fff;background-color:#747884}:host.avatar-color-contract{color:#fff;background-color:#454ea0}:host.avatar-color-jobCode{color:#fff;background-color:#696d79}:host.avatar-color-earnCode{color:#fff;background-color:#696d79}:host.avatar-color-invoiceStatement{color:#fff;background-color:#696d79}:host.avatar-color-billableCharge{color:#fff;background-color:#696d79}:host.avatar-color-payableCharge{color:#fff;background-color:#696d79}:host.avatar-color-user{color:#fff;background-color:#696d79}:host.avatar-color-corporateUser{color:#fff;background-color:#696d79}:host.avatar-color-distributionList{color:#fff;background-color:#696d79}:host.avatar-color-credential{color:#fff;background-color:#696d79}:host.avatar-color-person{color:#fff;background-color:#696d79}:host(.menu-active){box-shadow:0 0 4px 1px var(--selection)}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: NovoAvatarElement, decorators: [{
            type: Component,
            args: [{ selector: 'novo-avatar', template: '<img *ngIf="src" [src]="src"/>', styles: [":host{display:inline-block;width:30px;height:30px;background-size:cover;background-position:center;overflow:hidden;position:relative;background-color:var(--background-muted)}:host img{width:inherit;height:inherit;border-radius:inherit}:host.avatar-size-small{width:20px;height:20px}:host.avatar-size-large{width:40px;height:40px}:host.avatar-shape-round{border-radius:2em}:host.avatar-shape-square{border-radius:.4em}:host.avatar-color-black{color:#fff;background-color:#000}:host.avatar-color-white{color:#3d464d;background-color:#fff}:host.avatar-color-gray{color:#3d464d;background-color:#9e9e9e}:host.avatar-color-grey{color:#3d464d;background-color:#9e9e9e}:host.avatar-color-offWhite{color:#3d464d;background-color:#f7f7f7}:host.avatar-color-bright{color:#3d464d;background-color:#f7f7f7}:host.avatar-color-light{color:#3d464d;background-color:#dbdbdb}:host.avatar-color-neutral{color:#fff;background-color:#4f5361}:host.avatar-color-dark{color:#fff;background-color:#3d464d}:host.avatar-color-orange{color:#3d464d;background-color:#ff6900}:host.avatar-color-navigation{color:#fff;background-color:#202945}:host.avatar-color-skyBlue{color:#fff;background-color:#009bdf}:host.avatar-color-steel{color:#fff;background-color:#5b6770}:host.avatar-color-metal{color:#fff;background-color:#637893}:host.avatar-color-sand{color:#3d464d;background-color:#f4f4f4}:host.avatar-color-silver{color:#3d464d;background-color:#e2e2e2}:host.avatar-color-stone{color:#3d464d;background-color:#bebebe}:host.avatar-color-ash{color:#3d464d;background-color:#a0a0a0}:host.avatar-color-slate{color:#fff;background-color:#707070}:host.avatar-color-onyx{color:#fff;background-color:#526980}:host.avatar-color-charcoal{color:#fff;background-color:#282828}:host.avatar-color-moonlight{color:#fff;background-color:#1a242f}:host.avatar-color-midnight{color:#fff;background-color:#202945}:host.avatar-color-darkness{color:#fff;background-color:#161f27}:host.avatar-color-navy{color:#fff;background-color:#0d2d42}:host.avatar-color-aqua{color:#3d464d;background-color:#3bafda}:host.avatar-color-ocean{color:#fff;background-color:#4a89dc}:host.avatar-color-mint{color:#3d464d;background-color:#37bc9b}:host.avatar-color-grass{color:#fff;background-color:#8cc152}:host.avatar-color-sunflower{color:#fff;background-color:#f6b042}:host.avatar-color-bittersweet{color:#fff;background-color:#eb6845}:host.avatar-color-grapefruit{color:#fff;background-color:#da4453}:host.avatar-color-carnation{color:#fff;background-color:#d770ad}:host.avatar-color-lavender{color:#fff;background-color:#967adc}:host.avatar-color-mountain{color:#fff;background-color:#9678b6}:host.avatar-color-info{color:#fff;background-color:#4a89dc}:host.avatar-color-positive{color:#fff;background-color:#4a89dc}:host.avatar-color-success{color:#fff;background-color:#8cc152}:host.avatar-color-negative{color:#fff;background-color:#da4453}:host.avatar-color-danger{color:#fff;background-color:#da4453}:host.avatar-color-error{color:#fff;background-color:#da4453}:host.avatar-color-warning{color:#fff;background-color:#f6b042}:host.avatar-color-empty{color:#3d464d;background-color:#cccdcc}:host.avatar-color-disabled{color:#3d464d;background-color:#bebebe}:host.avatar-color-background{color:#3d464d;background-color:#f7f7f7}:host.avatar-color-backgroundDark{color:#3d464d;background-color:#e2e2e2}:host.avatar-color-presentation{color:#fff;background-color:#5b6770}:host.avatar-color-bullhorn{color:#3d464d;background-color:#ff6900}:host.avatar-color-pulse{color:#3d464d;background-color:#3bafda}:host.avatar-color-company{color:#fff;background-color:#39d}:host.avatar-color-candidate{color:#fff;background-color:#4b7}:host.avatar-color-lead{color:#fff;background-color:#a69}:host.avatar-color-contact{color:#fff;background-color:#fa4}:host.avatar-color-clientcontact{color:#fff;background-color:#fa4}:host.avatar-color-opportunity{color:#fff;background-color:#625}:host.avatar-color-job{color:#fff;background-color:#b56}:host.avatar-color-joborder{color:#fff;background-color:#b56}:host.avatar-color-submission{color:#3d464d;background-color:#a9adbb}:host.avatar-color-sendout{color:#fff;background-color:#747884}:host.avatar-color-placement{color:#fff;background-color:#0b344f}:host.avatar-color-note{color:#fff;background-color:#747884}:host.avatar-color-contract{color:#fff;background-color:#454ea0}:host.avatar-color-jobCode{color:#fff;background-color:#696d79}:host.avatar-color-earnCode{color:#fff;background-color:#696d79}:host.avatar-color-invoiceStatement{color:#fff;background-color:#696d79}:host.avatar-color-billableCharge{color:#fff;background-color:#696d79}:host.avatar-color-payableCharge{color:#fff;background-color:#696d79}:host.avatar-color-user{color:#fff;background-color:#696d79}:host.avatar-color-corporateUser{color:#fff;background-color:#696d79}:host.avatar-color-distributionList{color:#fff;background-color:#696d79}:host.avatar-color-credential{color:#fff;background-color:#696d79}:host.avatar-color-person{color:#fff;background-color:#696d79}:host(.menu-active){box-shadow:0 0 4px 1px var(--selection)}\n"] }]
        }], ctorParameters: () => [{ type: i1.DomSanitizer }], propDecorators: { source: [{
                type: Input
            }], label: [{
                type: Input
            }], theme: [{
                type: Input
            }], image: [{
                type: Input
            }], size: [{
                type: Input
            }], shape: [{
                type: Input
            }], color: [{
                type: Input
            }], hb_classBinding: [{
                type: HostBinding,
                args: ['class']
            }], background: [{
                type: HostBinding,
                args: ['style.backgroundImage']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvYXZhdGFyL0F2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNO0FBQ04sT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7OztBQU96RCxNQUFNLE9BQU8saUJBQWlCO0lBZTVCLElBQ0ksZUFBZTtRQUNqQixPQUFPLENBQUMsZUFBZSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsZ0JBQWdCLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQUVELElBQ0ksVUFBVTtRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZO1lBQUUsT0FBTztRQUNyRCxPQUFPLE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxDQUFDO0lBQzFELENBQUM7SUFJRCxZQUFvQixTQUF1QjtRQUF2QixjQUFTLEdBQVQsU0FBUyxDQUFjO1FBckIzQyxTQUFJLEdBQVcsUUFBUSxDQUFDO1FBR3hCLFVBQUssR0FBVyxPQUFPLENBQUM7SUFrQnNCLENBQUM7SUFFL0MsUUFBUTtRQUNOLElBQUksR0FBUSxDQUFDO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUM3Qix1Q0FBdUM7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QUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBR04sSUFBSTtzQkFESCxLQUFLO2dCQUlOLEtBQUs7c0JBREosS0FBSztnQkFJTixLQUFLO3NCQURKLEtBQUs7Z0JBSUYsZUFBZTtzQkFEbEIsV0FBVzt1QkFBQyxPQUFPO2dCQU1oQixVQUFVO3NCQURiLFdBQVc7dUJBQUMsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTkcyXG5pbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbm92by1hdmF0YXInLFxuICBzdHlsZVVybHM6IFsnLi9BdmF0YXIuc2NzcyddLFxuICB0ZW1wbGF0ZTogJzxpbWcgKm5nSWY9XCJzcmNcIiBbc3JjXT1cInNyY1wiLz4nLFxufSlcbmV4cG9ydCBjbGFzcyBOb3ZvQXZhdGFyRWxlbWVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIHNvdXJjZTogYW55O1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xuICBASW5wdXQoKSB0aGVtZTogc3RyaW5nO1xuICBASW5wdXQoKSBpbWFnZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHNpemU6IHN0cmluZyA9ICdtZWRpdW0nO1xuXG4gIEBJbnB1dCgpXG4gIHNoYXBlOiBzdHJpbmcgPSAncm91bmQnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbG9yOiBzdHJpbmc7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGdldCBoYl9jbGFzc0JpbmRpbmcoKSB7XG4gICAgcmV0dXJuIFtgYXZhdGFyLXNpemUtJHt0aGlzLnNpemV9YCwgYGF2YXRhci1zaGFwZS0ke3RoaXMuc2hhcGV9YCwgYGF2YXRhci1jb2xvci0ke3RoaXMuY29sb3J9YF07XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJhY2tncm91bmRJbWFnZScpXG4gIGdldCBiYWNrZ3JvdW5kKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmltYWdlICYmICF0aGlzLnNvdXJjZS5wcm9maWxlSW1hZ2UpIHJldHVybjtcbiAgICByZXR1cm4gYHVybCgke3RoaXMuaW1hZ2UgfHwgdGhpcy5zb3VyY2UucHJvZmlsZUltYWdlfSlgO1xuICB9XG5cbiAgc3JjOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcikge31cblxuICBuZ09uSW5pdCgpOiBhbnkge1xuICAgIGxldCBzcmM6IGFueTtcbiAgICBpZiAoKHRoaXMuc291cmNlICYmIHRoaXMuc291cmNlICE9PSAnJykgfHwgdGhpcy5sYWJlbCkge1xuICAgICAgaWYgKHRoaXMuc291cmNlLnByb2ZpbGVJbWFnZSkge1xuICAgICAgICAvLyB0aGlzLnNyYyA9IHRoaXMuc291cmNlLnByb2ZpbGVJbWFnZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNvdXJjZS5sb2dvKSB7XG4gICAgICAgIHNyYyA9IHRoaXMuc291cmNlLmxvZ287XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBmaXJzdDogYW55ID1cbiAgICAgICAgICB0aGlzLmxhYmVsIHx8IHRoaXMuc291cmNlLmZpcnN0TmFtZVxuICAgICAgICAgICAgPyB0aGlzLnNvdXJjZS5maXJzdE5hbWUuY2hhckF0KDApXG4gICAgICAgICAgICA6IHRoaXMuc291cmNlLm5hbWVcbiAgICAgICAgICAgID8gdGhpcy5zb3VyY2UubmFtZS5jaGFyQXQoMClcbiAgICAgICAgICAgIDogdGhpcy5zb3VyY2UudXNlcm5hbWVcbiAgICAgICAgICAgID8gdGhpcy5zb3VyY2UudXNlcm5hbWUuY2hhckF0KDApXG4gICAgICAgICAgICA6ICcnO1xuICAgICAgICBjb25zdCBsYXN0OiBhbnkgPSB0aGlzLnNvdXJjZS5sYXN0TmFtZSA/IHRoaXMuc291cmNlLmxhc3ROYW1lLmNoYXJBdCgwKSA6ICcnO1xuXG4gICAgICAgIC8vIERlZmluaW5nIENvbG9yc1xuICAgICAgICBjb25zdCBjb2xvcnM6IGFueSA9IFtcbiAgICAgICAgICAnIzFhYmM5YycsXG4gICAgICAgICAgJyMxNmEwODUnLFxuICAgICAgICAgICcjZjFjNDBmJyxcbiAgICAgICAgICAnI2YzOWMxMicsXG4gICAgICAgICAgJyMyZWNjNzEnLFxuICAgICAgICAgICcjMjdhZTYwJyxcbiAgICAgICAgICAnI2U2N2UyMicsXG4gICAgICAgICAgJyNkMzU0MDAnLFxuICAgICAgICAgICcjMzQ5OGRiJyxcbiAgICAgICAgICAnIzI5ODBiOScsXG4gICAgICAgICAgJyNlNzRjM2MnLFxuICAgICAgICAgICcjYzAzOTJiJyxcbiAgICAgICAgICAnIzliNTliNicsXG4gICAgICAgICAgJyM4ZTQ0YWQnLFxuICAgICAgICAgICcjYmRjM2M3JyxcbiAgICAgICAgICAnIzM0NDk1ZScsXG4gICAgICAgICAgJyMyYzNlNTAnLFxuICAgICAgICAgICcjOTVhNWE2JyxcbiAgICAgICAgICAnIzdmOGM4ZCcsXG4gICAgICAgICAgJyNlYzg3YmYnLFxuICAgICAgICAgICcjZDg3MGFkJyxcbiAgICAgICAgICAnI2Y2OTc4NScsXG4gICAgICAgICAgJyM5YmEzN2UnLFxuICAgICAgICAgICcjYjQ5MjU1JyxcbiAgICAgICAgICAnI2I0OTI1NScsXG4gICAgICAgICAgJyNhOTQxMzYnLFxuICAgICAgICBdO1xuICAgICAgICBjb25zdCBsaWdodGVyQ29sb3JzOiBhbnkgPSBbXG4gICAgICAgICAgJyMxNUQ2QjAnLFxuICAgICAgICAgICcjMTZBMDY5JyxcbiAgICAgICAgICAnI0YxRDYwRicsXG4gICAgICAgICAgJyNGM0FDMTInLFxuICAgICAgICAgICcjMkVEODVCJyxcbiAgICAgICAgICAnIzI4QkM3RicsXG4gICAgICAgICAgJyNFNjYzMjInLFxuICAgICAgICAgICcjRDMwMDJCJyxcbiAgICAgICAgICAnIzY1MzREQicsXG4gICAgICAgICAgJyMyOUIyQjknLFxuICAgICAgICAgICcjRTczQzYzJyxcbiAgICAgICAgICAnI0RCNkQzMScsXG4gICAgICAgICAgJyNDQjQ4QjUnLFxuICAgICAgICAgICcjNjk0NEFEJyxcbiAgICAgICAgICAnIzM4NTM2RCcsXG4gICAgICAgICAgJyMzRDY0NzMnLFxuICAgICAgICAgICcjMzk0QTZDJyxcbiAgICAgICAgICAnIzkyQkNCNycsXG4gICAgICAgICAgJyM3RDk5QTInLFxuICAgICAgICAgICcjRjE0Rjc2JyxcbiAgICAgICAgICAnI0NCNUNEQScsXG4gICAgICAgICAgJyNGRkI0NzUnLFxuICAgICAgICAgICcjQjlDRTZFJyxcbiAgICAgICAgICAnI0REQUE0RicsXG4gICAgICAgICAgJyNDRDZGNDUnLFxuICAgICAgICAgICcjQjkzNTRBJyxcbiAgICAgICAgXTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3M6IGFueSA9IHtcbiAgICAgICAgICAvLyBEZWZhdWx0IHNldHRpbmdzXG4gICAgICAgICAgdGV4dENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgaGVpZ2h0OiAxMDAsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICBmb250U2l6ZTogNTAsXG4gICAgICAgICAgZm9udFdlaWdodDogNDAwLFxuICAgICAgICAgIGZvbnRGYW1pbHk6ICdIZWx2ZXRpY2FOZXVlLUxpZ2h0LEhlbHZldGljYSBOZXVlIExpZ2h0LEhlbHZldGljYSBOZXVlLEhlbHZldGljYSwgQXJpYWwsTHVjaWRhIEdyYW5kZSwgc2Fucy1zZXJpZicsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gbWFraW5nIHRoZSB0ZXh0IG9iamVjdFxuICAgICAgICBjb25zdCBjb2xvckluZGV4OiBhbnkgPSBNYXRoLmZsb29yKChmaXJzdC5jaGFyQ29kZUF0KDApIC0gNjUpICUgY29sb3JzLmxlbmd0aCk7XG5cbiAgICAgICAgY29uc3QgY29iajogYW55ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dCcpO1xuICAgICAgICBjb2JqLnNldEF0dHJpYnV0ZSgndGV4dC1hbmNob3InLCAnbWlkZGxlJyk7XG4gICAgICAgIGNvYmouc2V0QXR0cmlidXRlKCd4JywgJzUwJScpO1xuICAgICAgICBjb2JqLnNldEF0dHJpYnV0ZSgneScsICc1MCUnKTtcbiAgICAgICAgY29iai5zZXRBdHRyaWJ1dGUoJ2R5JywgJzAuMzVlbScpO1xuICAgICAgICBjb2JqLnNldEF0dHJpYnV0ZSgncG9pbnRlci1ldmVudHMnLCAnYXV0bycpO1xuICAgICAgICBjb2JqLnNldEF0dHJpYnV0ZSgnZmlsbCcsIHNldHRpbmdzLnRleHRDb2xvcik7XG4gICAgICAgIGNvYmouc2V0QXR0cmlidXRlKCdmb250LWZhbWlseScsIHNldHRpbmdzLmZvbnRGYW1pbHkpO1xuICAgICAgICBjb2JqLnN0eWxlLmZvbnRXZWlnaHQgPSBzZXR0aW5ncy5mb250V2VpZ2h0O1xuICAgICAgICBjb2JqLnN0eWxlLmZvbnRTaXplID0gYCR7c2V0dGluZ3MuZm9udFNpemV9cHhgO1xuXG4gICAgICAgIGNvbnN0IGx0cnM6IGFueSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMubGFiZWwgfHwgZmlyc3QgKyBsYXN0KTtcbiAgICAgICAgY29iai5hcHBlbmRDaGlsZChsdHJzKTtcblxuICAgICAgICBjb25zdCBzdmc6IGFueSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N2ZycpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxucycsICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc2V0dGluZ3Mud2lkdGgpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzZXR0aW5ncy5oZWlnaHQpO1xuXG4gICAgICAgIC8vIHRoaXMuc2V0UHJlZml4ZWRWYWx1ZShzdmcsICdiYWNrZ3JvdW5kJywgY29sb3JzW2NvbG9ySW5kZXhdKTtcbiAgICAgICAgdGhpcy5zZXRQcmVmaXhlZFZhbHVlKHN2ZywgJ2JhY2tncm91bmQnLCBgbGluZWFyLWdyYWRpZW50KC00NWRlZywgJHtjb2xvcnNbY29sb3JJbmRleF19IDAlLCAke2xpZ2h0ZXJDb2xvcnNbY29sb3JJbmRleF19IDEwMCUpYCk7XG5cbiAgICAgICAgc3ZnLnN0eWxlLndpZHRoID0gYCR7c2V0dGluZ3Mud2lkdGh9cHhgO1xuICAgICAgICBzdmcuc3R5bGUuaGVpZ2h0ID0gYCR7c2V0dGluZ3MuaGVpZ2h0fXB4YDtcbiAgICAgICAgc3ZnLmFwcGVuZENoaWxkKGNvYmopO1xuXG4gICAgICAgIGNvbnN0IHRvcDogYW55ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRvcC5hcHBlbmRDaGlsZChzdmcpO1xuXG4gICAgICAgIGNvbnN0IHN2Z0h0bWw6IGFueSA9IHdpbmRvdy5idG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudCh0b3AuaW5uZXJIVE1MKSkpO1xuICAgICAgICBzcmMgPSBgZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCwgJHtzdmdIdG1sfWA7XG4gICAgICB9XG4gICAgICB0aGlzLnNyYyA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RVcmwoc3JjKTtcbiAgICB9XG4gIH1cblxuICBzZXRQcmVmaXhlZFZhbHVlKGVsbTogYW55LCBwcm9wOiBhbnksIHZhbHVlOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHByZWZpeGVzOiBhbnkgPSBbJy1tb3otJywgJy13ZWJraXQtJywgJy1vLScsICctbXMtJywgJy1raHRtbC0nXTtcblxuICAgIC8vIENsZWFyXG4gICAgZWxtLnN0eWxlW3Byb3BdID0gJyc7XG4gICAgY29uc3Qgc3RhcnRpbmc6IGFueSA9IGVsbS5zdHlsZVtwcm9wXTtcblxuICAgIC8vIFRyeSByYXcgZmlyc3RcbiAgICB0cnkge1xuICAgICAgZWxtLnN0eWxlW3Byb3BdID0gdmFsdWU7XG4gICAgICBpZiAoZWxtLnN0eWxlW3Byb3BdICE9PSBzdGFydGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gbm8gb3BcbiAgICB9XG5cbiAgICAvLyBUcnkgcHJlZml4ZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCB2ID0gcHJlZml4ZXNbaV0gKyB2YWx1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVsbS5zdHlsZVtwcm9wXSA9IHY7XG4gICAgICAgIGlmIChlbG0uc3R5bGVbcHJvcF0gIT09IHN0YXJ0aW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlMikge1xuICAgICAgICAvLyBubyBvcFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2lzVmFsaWRVUkwoc3RyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cChcbiAgICAgICdeKGh0dHBzPzpcXFxcL1xcXFwvKT8nICsgLy8gcHJvdG9jb2xcbiAgICAgICAgJygoKFthLXpcXFxcZF0oW2EtelxcXFxkLV0qW2EtelxcXFxkXSkqKVxcXFwuKStbYS16XXsyLH18JyArIC8vIGRvbWFpbiBuYW1lXG4gICAgICAgICcoKFxcXFxkezEsM31cXFxcLil7M31cXFxcZHsxLDN9KSknICsgLy8gT1IgaXAgKHY0KSBhZGRyZXNzXG4gICAgICAgICcoXFxcXDpcXFxcZCspPyhcXFxcL1stYS16XFxcXGQlXy5+K10qKSonICsgLy8gcG9ydCBhbmQgcGF0aFxuICAgICAgICAnKFxcXFw/WzsmYS16XFxcXGQlXy5+Kz0tXSopPycgKyAvLyBxdWVyeSBzdHJpbmdcbiAgICAgICAgJyhcXFxcI1stYS16XFxcXGRfXSopPyQnLFxuICAgICAgJ2knLFxuICAgICk7IC8vIGZyYWdtZW50IGxvY2F0b3JcbiAgICByZXR1cm4gISFwYXR0ZXJuLnRlc3Qoc3RyKTtcbiAgfVxufVxuIl19