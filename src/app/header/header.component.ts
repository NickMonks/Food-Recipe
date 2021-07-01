import { Component,EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-header',
    templateUrl:'./header.component.html'
})

export class HeaderComponent {

    // create a custom event with type string. When the header is clicked, it will trigger
    // onselect, which will emit the featureSelect event and notify to subscribers/listeners
    // to make it listenable to external component, we add the @Output 
   @Output() featureSelected = new EventEmitter<string>();

    onSelect(feature : string) {
        this.featureSelected.emit(feature);
    }
}