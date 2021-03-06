import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer'

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {}

    // We can use a route guard to run logic before going inside the router. We need to use it for our recipes,
    // since we want the user to be authenticated to get the recipes. 

    canActivate(route : ActivatedRouteSnapshot, 
                router: RouterStateSnapshot) 
    : boolean | UrlTree | Promise<boolean | UrlTree > | Observable<boolean | UrlTree > {

        // we take the observable and then map it to a simple function, that checks if the user exists or not (using the !! operator)
        // we want only to look this obsevable ONLY once; we want to check only ones and unsubscribe inmideately. To do this, we use take operator
        return this.store.select('auth').pipe(
            take(1), 
            // we get the user State, we need to map it
            map(authState => {
                return authState.user;
            }),
            map(user => {
            const isAuth = !!user;
            if (isAuth) {
                return true
            }
            // in Angular 2 we should return a UrlTree to return to another route if not true; we could directly navigate using router
            // but this can lead to race conditions that we want to avoid. 
            return this.router.createUrlTree(['/auth']);
        }));
    }
}