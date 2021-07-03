import { EventEmitter } from "@angular/core";
import { Ingredient } from "../shared/ingredients.model";

export class ShoppingListService {

    ingredientChange = new EventEmitter<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples',5),
        new Ingredient('Tomatoes',15)
      ];

      getIngredients() {
          return this.ingredients.slice();
      }

      addIngredient(ingredient: Ingredient){
          this.ingredients.push(ingredient);
          // whenever we change the array, we emit an event with the new array
          this.ingredientChange.emit(this.ingredients.slice());
      }

      addIngredients(ingredients: Ingredient[]){
        // Avoid this; this will trigger a lot of events and be a potential bottleneck
        // for (let ingredient of ingredients){
        //     this.addIngredient(ingredient);
        // }
        // expand operator on ES6, will simply expand the ingredients list and add it
        this.ingredients.push(...ingredients)
        this.ingredientChange.emit(this.ingredients.slice());

      }
}