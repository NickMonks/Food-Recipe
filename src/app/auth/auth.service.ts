import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { stringify } from "querystring";
import { User } from "./user.model";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


export interface AuthResponseData {
    // Response payload
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered? : boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    // here we inject the user and notify the subscribers
    // when the user identifies himself, the server will provide a token where the user can use to not need to authenticate
    // every time it reloads the page. the server will give it only when the authentication has succeeded.
    // To achieve this we can use BehaviourSubject, will can store the state and therefore it can store variables throughout its lifetime. 
    // we initialise it with null and will store the token here
    
    //userSubject = new BehaviorSubject<User>(null);
    private tokenExpirationTimer : any;

    constructor(
        private store: Store<fromApp.AppState>){}

    setLogoutTimer(expirationDuration : number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration);
    }
    
    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}