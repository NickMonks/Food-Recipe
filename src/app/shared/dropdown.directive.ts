import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector : '[appDropdown]'
})
export class DropdownDirective {
    
    // HostBinding allows to bind to properties to the element attached
    // Inside the bootstrap class, we access the open feature <div class="btn-group open">, this is equivalent to class.open in CSS
    @HostBinding('class.open') isOpen = false;
    // add CSS class to the element clicked
    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen;
    }
    // Remove the class once clicked again
}