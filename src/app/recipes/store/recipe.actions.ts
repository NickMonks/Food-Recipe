import {Action} from '@ngrx/store'
import { Recipe } from '../recipe.model';

export const SET_RECIPES ='[Recipes] Set Recipes';
export const FETCH_RECIPES ='[Recipes] FETCH_RECIPES';
export const ADD_RECIPE ='[Recipe] Add Recipe';
export const DELETE_RECIPE ='[Recipe] DELETE_RECIPE';
export const UPDATE_RECIPE ='[Recipe] UPDATE_RECIPE';
export const SAVE_RECIPE ='[Recipe] SAVE_RECIPE';

export class SetRecipes implements Action {
    readonly type = SET_RECIPES;

    constructor(public payload: Recipe[]){}
}

export class SaveRecipes implements Action {
    readonly type = SAVE_RECIPE;
}

export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
    readonly type = ADD_RECIPE;
    constructor(public payload: Recipe){}
}

export class DeleteRecipe implements Action {
    readonly type = DELETE_RECIPE;

    constructor (public payload: number) {}
}

export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPE;

    constructor(public payload: {index: number, newRecipe: Recipe}){}
}



export type RecipesActions =
| SetRecipes
| FetchRecipes
| AddRecipe
| UpdateRecipe
| SaveRecipes
| DeleteRecipe;