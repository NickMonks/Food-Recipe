import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceholderDirective {
    // inject the view container reference. This gives us access to the component were this directive is used (using a reference)!
    // it contains useful methods to create components in the dom, not just the position coordinates. We need to declare it public
    // to access publically to it. 
    constructor(public viewContainerRef: ViewContainerRef) {}
}