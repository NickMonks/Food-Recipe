import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions'; 
import * as fromShoppingList from '../store/shopping-list.reducer';
import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: true}) slForm: NgForm;
  subscription : Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(
    private slService: ShoppingListService,
    private store: Store<fromApp.AppState>) { }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
  }

  ngOnInit(): void {
    // we select the slice of state that we are interest from the reducer, and since it returns a subscription we simply subscribe

   this.subscription =  this.store.select('shoppingList').subscribe(
      stateData => {
        // here, we get the state data from the store directly, specifically the slice corresponding to the reducer shoppingList
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;
          this.slForm.setValue({
            name : this.editedItem.name,
            amount: this.editedItem.amount
          })

        } else {
          this.editMode = false;
        }
      });
    
  }

  onAddItem(form: NgForm) {
    // this will add or update the component, depending of the editMode value (by default set to false)
    
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
        );

    } else {
      // we dispatch an action, to do so we need to create an object of type action dispatched
      // we pass the payload in the constructor. Our App will reach all the reducers our store has and check which action type accepts this
      // object 
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    // once it's being added, return the editMode to be false
    this.editMode = false;
    form.reset();
    
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // Clear also the item
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.onClear();
  }

}
