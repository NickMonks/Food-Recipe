import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredients.model";

export class ShoppingListService {

    ingredientChange = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples',5),
        new Ingredient('Tomatoes',15)
      ];

      getIngredients() {
          return this.ingredients.slice();
      }

      getIngredient(index: number) {
        return this.ingredients[index]
      }

      addIngredient(ingredient: Ingredient){
          this.ingredients.push(ingredient);
          // whenever we change the array, we emit an event with the new array
          this.ingredientChange.next(this.ingredients.slice());
      }

      addIngredients(ingredients: Ingredient[]){
        // Avoid this; this will trigger a lot of events and be a potential bottleneck
        // for (let ingredient of ingredients){
        //     this.addIngredient(ingredient);
        // }
        // expand operator on ES6, will simply expand the ingredients list and add it
        this.ingredients.push(...ingredients)
        this.ingredientChange.next(this.ingredients.slice());

      }

      updateIngredient(index: number, newIngredient: Ingredient) {
        // simply updates the content of the index ingredient. 

        this.ingredients[index] = newIngredient;

        // Emit the update change (this is independent of update or adding)
        this.ingredientChange.next(this.ingredients.slice());
      }

      deleteIngredient(index: number){
        this.ingredients.splice(index, 1)
        // Emit the change and notify to the subscriber - will lives in ngOnInit
        this.ingredientChange.next(this.ingredients.slice());
      }
}