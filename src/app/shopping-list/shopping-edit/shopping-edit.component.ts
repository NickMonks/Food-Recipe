import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: true}) slForm: NgForm;
  subscription : Subscription;
  editMode = false;
  editedItemIndex : number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        // we retrieve the ingredient and set the values
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name : this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    );
  }

  onAddItem(form: NgForm) {
    // this will add or update the component, depending of the editMode value (by default set to false)
    
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      // this method with call notify subscribers to update the ingredient
      this.slService.updateIngredient(this.editedItemIndex,newIngredient);
    } else {
      // this method with call notify subscribers to create new ingredient
      this.slService.addIngredient(newIngredient);
    }

    // once it's being added, return the editMode to be false
    this.editMode = false;
    form.reset();
    
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    // Clear also the item
    this.slService.deleteIngredient(this.editedItemIndex)
    this.onClear();
  }

}
