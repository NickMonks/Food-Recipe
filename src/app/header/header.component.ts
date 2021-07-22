import { Component, OnDestroy, OnInit} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions'
import * as RecipeActions from '../recipes/store/recipe.actions'
@Component({
    selector: 'app-header',
    templateUrl:'./header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy{

    isAuthenticated = false;
    private userSub : Subscription;

    constructor(
        private authService: AuthService,
        private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.userSub = this.store.select('auth')
        .pipe(map(authState => authState.user))
        .subscribe(user => {
        this.isAuthenticated = !!user; // this does: !user ? false : true
        console.log(this.isAuthenticated)
        });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    onLogout(){
        this.store.dispatch(new AuthActions.Logout())
    }

    onSaveData() {
        // this.dataStorageService.storeRecipes();
        this.store.dispatch(new RecipeActions.SaveRecipes());
    }
    
    onFetchData() {
        // this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipeActions.FetchRecipes())
    }
}