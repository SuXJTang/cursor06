import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class GlobalRef {
}
export class BrowserGlobalRef extends GlobalRef {
    get nativeGlobal() {
        return window;
    }
    get nativeWindow() {
        return window;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: BrowserGlobalRef, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: BrowserGlobalRef }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: BrowserGlobalRef, decorators: [{
            type: Injectable
        }] });
export class NodeGlobalRef extends GlobalRef {
    get nativeGlobal() {
        throw new Error(`global doesn't compile for some reason`);
        // return global as Global;
    }
    get nativeWindow() {
        throw new Error('Node does not have a window object');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9ub3ZvLWVsZW1lbnRzL3NyYy9zZXJ2aWNlcy9nbG9iYWwvZ2xvYmFsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFJM0MsTUFBTSxPQUFnQixTQUFTO0NBRzlCO0FBR0QsTUFBTSxPQUFPLGdCQUFpQixTQUFRLFNBQVM7SUFDN0MsSUFBSSxZQUFZO1FBQ2QsT0FBTyxNQUFnQixDQUFDO0lBQzFCLENBQUM7SUFDRCxJQUFJLFlBQVk7UUFDZCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOytHQU5VLGdCQUFnQjttSEFBaEIsZ0JBQWdCOzs0RkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVOztBQVNYLE1BQU0sT0FBTyxhQUFjLFNBQVEsU0FBUztJQUMxQyxJQUFJLFlBQVk7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDMUQsMkJBQTJCO0lBQzdCLENBQUM7SUFDRCxJQUFJLFlBQVk7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdsb2JhbCB7fVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2xvYmFsUmVmIHtcbiAgYWJzdHJhY3QgZ2V0IG5hdGl2ZUdsb2JhbCgpOiBHbG9iYWw7XG4gIGFic3RyYWN0IGdldCBuYXRpdmVXaW5kb3coKTogV2luZG93O1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQnJvd3Nlckdsb2JhbFJlZiBleHRlbmRzIEdsb2JhbFJlZiB7XG4gIGdldCBuYXRpdmVHbG9iYWwoKTogR2xvYmFsIHtcbiAgICByZXR1cm4gd2luZG93IGFzIEdsb2JhbDtcbiAgfVxuICBnZXQgbmF0aXZlV2luZG93KCk6IFdpbmRvdyB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxufVxuZXhwb3J0IGNsYXNzIE5vZGVHbG9iYWxSZWYgZXh0ZW5kcyBHbG9iYWxSZWYge1xuICBnZXQgbmF0aXZlR2xvYmFsKCk6IEdsb2JhbCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBnbG9iYWwgZG9lc24ndCBjb21waWxlIGZvciBzb21lIHJlYXNvbmApO1xuICAgIC8vIHJldHVybiBnbG9iYWwgYXMgR2xvYmFsO1xuICB9XG4gIGdldCBuYXRpdmVXaW5kb3coKTogV2luZG93IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUgZG9lcyBub3QgaGF2ZSBhIHdpbmRvdyBvYmplY3QnKTtcbiAgfVxufVxuIl19