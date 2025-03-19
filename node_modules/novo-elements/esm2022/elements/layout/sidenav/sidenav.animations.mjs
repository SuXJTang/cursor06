import { animate, state, style, transition, trigger } from '@angular/animations';
/**
 * Animations used by the Material drawers.
 * @docs-private
 */
export const novoSidenavAnimations = {
    /** Animation that slides a drawer in and out. */
    transformDrawer: trigger('transform', [
        // We remove the `transform` here completely, rather than setting it to zero, because:
        // 1. Having a transform can cause elements with ripples or an animated
        //    transform to shift around in Chrome with an RTL layout (see #10023).
        // 2. 3d transforms causes text to appear blurry on IE and Edge.
        state('open, open-instant', style({
            transform: 'none',
            visibility: 'visible',
        })),
        state('void', style({
            // Avoids the shadow showing up when closed in SSR.
            'box-shadow': 'none',
            visibility: 'hidden',
        })),
        transition('void => open-instant', animate('0ms')),
        transition('void <=> open, open-instant => void', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZW5hdi5hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbm92by1lbGVtZW50cy9zcmMvZWxlbWVudHMvbGF5b3V0L3NpZGVuYXYvc2lkZW5hdi5hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQTRCLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTNHOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUU5QjtJQUNGLGlEQUFpRDtJQUNqRCxlQUFlLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRTtRQUNwQyxzRkFBc0Y7UUFDdEYsdUVBQXVFO1FBQ3ZFLDBFQUEwRTtRQUMxRSxnRUFBZ0U7UUFDaEUsS0FBSyxDQUNILG9CQUFvQixFQUNwQixLQUFLLENBQUM7WUFDSixTQUFTLEVBQUUsTUFBTTtZQUNqQixVQUFVLEVBQUUsU0FBUztTQUN0QixDQUFDLENBQ0g7UUFDRCxLQUFLLENBQ0gsTUFBTSxFQUNOLEtBQUssQ0FBQztZQUNKLG1EQUFtRDtZQUNuRCxZQUFZLEVBQUUsTUFBTTtZQUNwQixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQ0g7UUFDRCxVQUFVLENBQUMsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELFVBQVUsQ0FBQyxxQ0FBcUMsRUFBRSxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQztLQUNyRyxDQUFDO0NBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSwgc3RhdGUsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBNYXRlcmlhbCBkcmF3ZXJzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3Qgbm92b1NpZGVuYXZBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IHRyYW5zZm9ybURyYXdlcjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHNsaWRlcyBhIGRyYXdlciBpbiBhbmQgb3V0LiAqL1xuICB0cmFuc2Zvcm1EcmF3ZXI6IHRyaWdnZXIoJ3RyYW5zZm9ybScsIFtcbiAgICAvLyBXZSByZW1vdmUgdGhlIGB0cmFuc2Zvcm1gIGhlcmUgY29tcGxldGVseSwgcmF0aGVyIHRoYW4gc2V0dGluZyBpdCB0byB6ZXJvLCBiZWNhdXNlOlxuICAgIC8vIDEuIEhhdmluZyBhIHRyYW5zZm9ybSBjYW4gY2F1c2UgZWxlbWVudHMgd2l0aCByaXBwbGVzIG9yIGFuIGFuaW1hdGVkXG4gICAgLy8gICAgdHJhbnNmb3JtIHRvIHNoaWZ0IGFyb3VuZCBpbiBDaHJvbWUgd2l0aCBhbiBSVEwgbGF5b3V0IChzZWUgIzEwMDIzKS5cbiAgICAvLyAyLiAzZCB0cmFuc2Zvcm1zIGNhdXNlcyB0ZXh0IHRvIGFwcGVhciBibHVycnkgb24gSUUgYW5kIEVkZ2UuXG4gICAgc3RhdGUoXG4gICAgICAnb3Blbiwgb3Blbi1pbnN0YW50JyxcbiAgICAgIHN0eWxlKHtcbiAgICAgICAgdHJhbnNmb3JtOiAnbm9uZScsXG4gICAgICAgIHZpc2liaWxpdHk6ICd2aXNpYmxlJyxcbiAgICAgIH0pLFxuICAgICksXG4gICAgc3RhdGUoXG4gICAgICAndm9pZCcsXG4gICAgICBzdHlsZSh7XG4gICAgICAgIC8vIEF2b2lkcyB0aGUgc2hhZG93IHNob3dpbmcgdXAgd2hlbiBjbG9zZWQgaW4gU1NSLlxuICAgICAgICAnYm94LXNoYWRvdyc6ICdub25lJyxcbiAgICAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbicsXG4gICAgICB9KSxcbiAgICApLFxuICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gb3Blbi1pbnN0YW50JywgYW5pbWF0ZSgnMG1zJykpLFxuICAgIHRyYW5zaXRpb24oJ3ZvaWQgPD0+IG9wZW4sIG9wZW4taW5zdGFudCA9PiB2b2lkJywgYW5pbWF0ZSgnNDAwbXMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuOCwgMC4yNSwgMSknKSksXG4gIF0pLFxufTtcbiJdfQ==