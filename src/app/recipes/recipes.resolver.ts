import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';
import {Actions, ofType} from '@ngrx/effects';
import { map, switchMap, take } from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
// A resolver is used to resolve some data before accessing an url. without this, if we load the page it wont fetch any data 
// this will be applied in the app-routing module, every time we access to a specific url to return this fetchRecipes.
    constructor(private store: Store<fromApp.AppState>, 
        private actions$ : Actions,
        private recipesService: RecipeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any[] | Observable<any[]> | Promise<any[]> {
        // we will return either an array of recipes (we cant, because we need to resolve), or a observable 
        // because we return an observable, it will subscribed by Angular automagically
        
            return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => {
                return recipesState.recipes;
            }),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    // we can force an effect to be dispatched using the Actions of ngrx/effects
                    this.store.dispatch(new RecipeActions.FetchRecipes());
                    return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1)) // take will only subscribe for once
                } else {
                    return of(recipes);
                }
            }));
    }
    
}