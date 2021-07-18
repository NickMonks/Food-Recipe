// define the action properties for each of them inside a script.

import { Subscription, TeardownLogic } from "rxjs";
import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredients.model";

// define action const to use across reducers
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';


export class AddIngredient implements Action{
   
    // To work, we need to bind the action using a common interface: Action, which contains payload and type
    // type is readonly (not possible to edit, to increase safety)
   readonly type  = ADD_INGREDIENT;
   constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action{
   
   readonly type  = ADD_INGREDIENTS;
   constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action{
   
    readonly type  = UPDATE_INGREDIENT;
    constructor(public payload:  Ingredient) {}
 }

 export class DeleteIngredient implements Action{
   
    readonly type  = DELETE_INGREDIENT;
 }

 export class StartEdit implements Action{
   
   readonly type  = START_EDIT;
   constructor(public payload: number) {} // index
}

export class StopEdit implements Action{
   
   readonly type  = STOP_EDIT;
}

// we export this combination of action types as a union
export type ShoppingListActions = 
| AddIngredient 
| AddIngredients 
| UpdateIngredient 
| DeleteIngredient
| StartEdit
| StopEdit;