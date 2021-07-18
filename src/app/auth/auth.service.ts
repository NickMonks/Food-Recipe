import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { stringify } from "querystring";
import { User } from "./user.model";
import { Router } from "@angular/router";
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
        private http: HttpClient, 
        private router: Router,
        private store: Store<fromApp.AppState>){}

    logout() {
        // pass the user as null, so the application treats it as unauthenticated:
        this.store.dispatch(new AuthActions.Logout());
        this.router.navigate(['/auth']);
        // delete all data from local storage, since the token wont be active anymore
        localStorage.removeItem('userData');

        // we need to be careful not to delete the token if it didn't expire the session,
        // since we use setTimeout to logout we dont want to do this if the user logs out manyally
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration : number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    signUp(email: string, password: string) {
        // return the post observable so we can subscribe and get a response of the request. 
       return this.http.post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyByKDGmZYYT1tCm9C0-YNAN3_sn0NqprEk",
            {
                // Request payload
                email: email,
                password: password,
                returnSecureToken: true
            }
            ).pipe(catchError(this.handleError), tap(resData => {
                // if the response is successful, we tap (i.e we don't change the post AuthResponseData) the data and use it
                // for other stuff, that's how tap really is used
                this.handleAuthentication(resData.email,resData.localId,resData.idToken, +resData.expiresIn);
            }));
    } 

    autoLogin() {
        
        const userData: {
            email : string,
            id : string,
            _token: string;
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData){
            
            return;
        }

        const loadedUser = new User(userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate));

        if (loadedUser) {
            this.store.dispatch(new AuthActions.Login({
                email: loadedUser.email, 
                userId: loadedUser.id, 
                token: loadedUser.token, 
                expirationDate: new Date(userData._tokenExpirationDate)
                })
            );
            // update the time the token expires if we login again. If we dont do this, expirationDuration in setTimeout will
            // restart its counting. 
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }


    }

    logIn(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyByKDGmZYYT1tCm9C0-YNAN3_sn0NqprEk",
            {
                // Request payload
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(catchError(this.handleError), tap(
            resData => {
            // using tap because it doesnt affect the main pipeline, is like a side effect
            this.handleAuthentication(resData.email,resData.localId,resData.idToken, +resData.expiresIn);
                }
            )
        );
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
            // it doesn't affect the flow data; with tap you can use it as a tee in linux
            // we create the user here for us. The date is sum from the getTime() (1970) in miliseconds to our current time
            const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
            
            // declare the new user with the token
            const user = new User(
                email, 
                userId, 
                token, 
                expirationDate
            );
            
            this.store.dispatch(new AuthActions.Login({
                email: email,
                userId: userId,
                token: token,
                expirationDate: expirationDate
            }))

            // It is important to notice that, once we create a new user, we want to auto logout since 
            // it wont make sense to use the user anymore
            this.autoLogout(expiresIn * 1000);

            // in order to provide persistent data storage for our token, we can use either cookies or localstorage.
            // we store our object and un-serialize it. we can retrieve this once our application restarts
            localStorage.setItem('userData', JSON.stringify(user));
        
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = errorRes.error.error.message;

        if (!errorRes.error || !errorRes.error.error) {
                    // returns an observable
                    return throwError(errorMessage);
                }
                switch(errorRes.error.error.message){
                    case 'EMAIL_EXISTS':
                        errorMessage= 'This email already exists';
                        break
                    case 'EMAIL_NOT_FOUND':
                        errorMessage= 'This email does not exist';
                        break
                    case 'INVALID_PASSWORD':
                        errorMessage= 'Incorrect password';
                        break

                  }
                  // this pipe will perform some business logic and throw an error, which is basically calling the error callback
                  // of the subscription notifying subscribers,n and passing the error as the argument (in this case, errorMessage)
                  return throwError(errorMessage);
    }
}