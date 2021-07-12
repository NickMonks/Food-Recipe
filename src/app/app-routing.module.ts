import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { RecipesResolverService } from "./recipes/recipes.resolver";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

const appRoute: Routes = [
    {path: '', redirectTo: '/recipes', pathMatch: 'full'},
    {   path: 'recipes', 
        component: RecipesComponent, 
        children: [
        { path : '' , component: RecipeStartComponent, resolve: [RecipesResolverService] },
        { path : 'new' , component: RecipeEditComponent },
        {   path : ':id' , 
            component: RecipeDetailComponent, 
            resolve: [RecipesResolverService]
        },
        {   path : ':id/edit' , 
            component: RecipeEditComponent, 
            resolve: [RecipesResolverService] 
        },
    ] },
    {   path: 'shopping-list', 
        component: ShoppingListComponent },
];

// to use the router, we need to set it up as a module, with a constant variable of type Routes which contains hash tables of path/component
// imports will import the RouterModule and bind it to the app module. export will export the modified routermodule. 
@NgModule({
    imports: [RouterModule.forRoot(appRoute)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}