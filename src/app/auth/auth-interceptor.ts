import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { AuthService } from "./auth.service";
import { exhaustMap, map, take } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer'
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    // this class will implement an interceptor, which performs some transformations to any http request before send it to 
    // oue backend

    // to take the user only once and then it's done, we dont want to do this more than once
    // that's why we use take operator, where we tell rxjs to take only 1 value and automaticallyu
    // unsubscribe afterwards.

    // basically we only subscribe on demand, when call fetchRecipes. Otherwise it will fetch user every time user changes (we want to enforce
    // to press 'fetch data'). 
    // then we use exhaustMap, which waits the first observable (user) and executes the first observable, exhausting it. 
    // After, it return another observable, and we can pipe it afterwards. we return that final value.
        

    constructor(
        private authService: AuthService,
        private store: Store<fromApp.AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // this is done so any time we want to access to a url route where authentication is needed, we provide our token
        // we need to return an observable (where angular will be notified), and the store provides it
       return this.store.select('auth').pipe(
            take(1),
            // is not the user itself, is the store object!
            map(authState => {
               return authState.user;
            }),
            exhaustMap(user => {
                // before adding the auth token, verify there is actually a user (if we need to authenticate it will fail to login)
                if (!user) {
                    return next.handle(req);
                }
                // here, we clone and modified the request to add the token: 
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });
                // return this obsevable to the main observable, which is userSubject
                return next.handle(modifiedReq);
            }));
            
        
    }

}