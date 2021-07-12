import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { map, tap } from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient,
        private recipeService: RecipeService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        // create the observable PUT request; we can subscribe to it
        this.http.put('https://food-recipe-e58d8-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipes)
        .subscribe(
            response => {
                console.log(response);
            }
        );
    }

    fetchRecipes() {
       return this.http
        .get<Recipe[]>('https://food-recipe-e58d8-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
        .pipe(map( recipes => {
            // using a map to transform recipes in the case the recipes doesnt have ingredient.
            // Dont confuse piped map with functional map of javascript, from an array
            return recipes.map(recipe => {
                // operator "..." is used to unroll the recipe elements
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
            });
        }), tap(recipes => {
            // this is similar to a tee in linux; use the recipe for a different thing out of the subscription
            this.recipeService.setRecipes(recipes)
        })
        )
    }
}