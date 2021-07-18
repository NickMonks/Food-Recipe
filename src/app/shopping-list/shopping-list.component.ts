import { tokenReference } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions'
import * as fromApp from '../store/app.reducer'
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[]}>;

  // add a Subscripter to clean it when finalises
  private igChangeSub: Subscription;

  // Added the service in the App module, since we will use it in another child component (hierarchical injection)
  constructor(
    private slService: ShoppingListService,
    // use store with the generic type of the local object
    private store: Store<fromApp.AppState>) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  
    // we can access directly and select a slice of the state we want in the key/reducer pair
    // this returns an observable. So, how to return the list of ingredients? turns out we can use the async pipe 
    // in the template, so it will subscribe to the observabke and wait for future and yield the list of ingredients
    
    this.ingredients = this.store.select('shoppingList')
  }

  onEditItem(index: number) {    
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }
}
