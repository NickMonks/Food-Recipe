import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredients.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

// we want to inject shopping list service into our service!, we need to add metadata
@Injectable()
export class RecipeService {

    // create new observable subject, so when recipe changes it updates it with obersables
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];

    constructor(private slService: ShoppingListService){}

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        // inform other places that we got a new recipes
        this.recipesChanged.next(this.recipes.slice())
    }

      getRecipes() {
          // with slice, we will return a copy of the recipes, not a reference to it (which is default in javascript)
          return this.recipes.slice();
      }

      getRecipe(index: number){
          return this.recipes[index];
      }

      addIngredientsToShoppingList(ingredients: Ingredient[]) {
        // with this method, we will add the ingredients to our shopping list service, and will render it
        this.slService.addIngredients(ingredients);
      }

      addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        // notify the subscribers of the recipesChanged , which happens inside the ngOnInit method
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
      }

      deleteRecipe(index: number) {
          this.recipes.splice(index, 1);
          this.recipesChanged.next(this.recipes.slice());
      }

    
}