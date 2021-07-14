import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";


@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
// A resolver is used to resolve some data before accessing an url. without this, if we load the page it wont fetch any data 
// this will be applied in the app-routing module, every time we access to a specific url to return this fetchRecipes.
    constructor(private dataStorageService: DataStorageService, private recipesService: RecipeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any[] | Observable<any[]> | Promise<any[]> {
        // we will return either an array of recipes (we cant, because we need to resolve), or a observable 
        // because we return an observable, it will subscribed by Angular automagically
        const recipes = this.recipesService.getRecipes();
        if (recipes.length === 0 ) {
            
            return this.dataStorageService.fetchRecipes();
        } else {
            return recipes;
        }
    }
    
}