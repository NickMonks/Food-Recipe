import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { AlertComponent } from './shared/alert/alert.component';
import { RecipesModule } from './recipes/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { AuthModule } from './auth/auth.module';
import { Store, StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects';
import * as fromApp from './store/app.reducer'
import { AuthEffects } from './auth/store/auth.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { RecipeEffects } from './recipes/store/recipe.effects';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RecipesModule,
    ShoppingListModule,
    SharedModule,
    CoreModule,
    AuthModule,
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    //in the root app module, we provide the store, and we need to create a HashMap of key: reducer for each module/Component/etc
    // now, every time we start the application it will create a store with the reducer defined
    // IMPORTANT: The reducer return value is basically was is associated to the shoppingList
    StoreModule.forRoot(fromApp.appReducer),
    // register the effect module to register effects
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AlertComponent
  ]
})
export class AppModule { }
