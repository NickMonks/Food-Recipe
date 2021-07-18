// the reducer is simply a function that receives a dispatched action from a component, and updates
// the store state  immutably (that means, copies the entire state and adds the action state), and saves
// to the store to where components are subscribed.

import { Ingredient } from "../../shared/ingredients.model";
import * as ShoppingListActions from "./shopping-list.actions";


export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex : number
}

const initialState : State = {
     ingredients: [
        new Ingredient('Apples',5),
        new Ingredient('Tomatoes',15)
      ],
      editedIngredient: null,
      editedIngredientIndex : -1 // we put -1 to be a non-valid index, 0 is valid
};

// because is a function, we create a export function; ngrx packages will call and pass parameters to the function:
// state or store (we can assign the initial state if state is empty, i.e. at the beginning), and action (which is a class that implements action interface)
export function shoppingListReducer(
    state : State = initialState, 
    action: ShoppingListActions.ShoppingListActions
    ) {
    // check action performed (convention is use upper-case)
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            // important to notice that the state will be entirely rewritten, so DO NOT MODIFY CURRENT STATE
            // define a new one by spread the previous state and overwrite the element
            return {
                ...state,
                ingredients: [
                    // spread operator here too
                    ...state.ingredients,
                    // action payload
                    action.payload
                ]
            };
        
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [
                    // spread operator here too
                    ...state.ingredients,
                    // action payload - we need to spread them since is an array tho
                    ...action.payload
                ]
            };
        
        case ShoppingListActions.UPDATE_INGREDIENT:
            // remember: we need to replace the entire state!, so we need to update the data immutabilly

            // get the ingredient to add/update
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            };

            // array with all ingredients - replace the one at index of the payload
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex : -1,
                editedIngredient: null
            };
        
        case ShoppingListActions.DELETE_INGREDIENT:

            //
            
            return {
                ...state,
                ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== state.editedIngredientIndex; 
                }),
                editedIngredientIndex : -1,
                editedIngredient: null // filter gives us a new array!
            };
        
        case ShoppingListActions.START_EDIT:

            
            return {
                ...state,
                editedIngredientIndex : action.payload,
                editedIngredient: {...state.ingredients[action.payload]} 
                // we can access the ingredient list directly; 
                // however doing it so is referencing, and we want a copy
                // using the spread operator allows us to create a new list
            };


        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredientIndex: -1,
                editedIngredient : null
            };
        
        default:
            return state;
    }
}