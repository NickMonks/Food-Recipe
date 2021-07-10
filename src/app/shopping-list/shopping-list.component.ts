import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];

  // add a Subscripter to clean it when finalises
  private igChangeSub: Subscription;

  // Added the service in the App module, since we will use it in another child component (hierarchical injection)
  constructor(private slService: ShoppingListService) { }
  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
  }

  ngOnInit(): void {
    // every time the component changes, that means, the list of ingredients changes,
    // is because we are subscribed to ingredients change, we re-populate the ingredients. 
    this.ingredients = this.slService.getIngredients();
   this.igChangeSub = this.slService.ingredientChange.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    )
  }

  onEditItem(index: number) {
    // this will notify to ngOnInit in shopping-list edit component
    
    this.slService.startedEditing.next(index);
  }

}
