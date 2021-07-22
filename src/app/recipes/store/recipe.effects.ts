import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {

    constructor(
        private actions$: Actions,
        private store: Store<fromApp.AppState>,
        private http: HttpClient) {

    }

    @Effect({dispatch: false})
    storeRecipes = this.actions$.pipe(
        ofType(RecipesActions.SAVE_RECIPE),
        withLatestFrom(this.store.select('recipes')), // withlatestfrom takes the state from the store
        switchMap(([actionData, recipesState]) => { // need to define the input as a destructor
             return this.http.put(
                 'https://food-recipe-e58d8-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', 
                 recipesState.recipes
            )
        })
    );

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http
                .get<Recipe[]>(
                    'https://food-recipe-e58d8-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
            );    
        }), 
        map(recipes => {
                // using a map to transform recipes in the case the recipes doesnt have ingredient.
                // Dont confuse piped map with functional map of javascript, from an array
                return recipes.map(recipe => {
                    // operator "..." is used to unroll the recipe elements
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
                });
            }
        ), 
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })

    )
    
}