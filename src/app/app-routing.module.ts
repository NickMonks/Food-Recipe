import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { RecipesResolverService } from "./recipes/recipes.resolver";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    {
      path: 'recipes',
      component: RecipesComponent,
      canActivate: [AuthGuard],
      children: [
        { path: '', component: RecipeStartComponent },
        { path: 'new', component: RecipeEditComponent },
        {
          path: ':id',
          component: RecipeDetailComponent,
          resolve: [RecipesResolverService]
        },
        {
          path: ':id/edit',
          component: RecipeEditComponent,
          resolve: [RecipesResolverService]
        }
      ]
    },
    { path: 'shopping-list', component: ShoppingListComponent },
    { path: 'auth', component: AuthComponent }
  ];

// to use the router, we need to set it up as a module, with a constant variable of type Routes which contains hash tables of path/component
// imports will import the RouterModule and bind it to the app module. export will export the modified routermodule. 
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}