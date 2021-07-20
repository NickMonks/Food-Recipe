import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';


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

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    // observable that contains the login action - we create a new action after successful http post, so we need
    // to feed a javascript object. 
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    // beware that normally we use of , but map already dispatches an obseravle with the return value
    // you provide it
    return new AuthActions.AuthenticateSuccess(
        {
        email: email, 
        userId: userId, 
        token: token, 
        expirationDate: expirationDate
        });
};

const handleError = (errorRes: any) => {
    let errorMessage = errorRes.error.error.message;

                    if (!errorRes.error || !errorRes.error.error) {
                        
                        return of(new AuthActions.AuthenticateFail(errorMessage));
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
                    // 'of' returns a new observable with NO error. Inside there, we just need to dispatch an action
                    return of(new AuthActions.AuthenticateFail(errorMessage)); 

};

@Injectable()
export class AuthEffects {

    // Actions is a big observables that give us access to all of dispatched actions, so we can react to them
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router) {}

    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http
            .post<AuthResponseData>(
                "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyByKDGmZYYT1tCm9C0-YNAN3_sn0NqprEk",
                {
                    // Request payload
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            )
            .pipe(
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn, 
                        resData.email, 
                        resData.localId, 
                        resData.idToken
                        );
                }),
                catchError(
                errorRes => {
                    return handleError(errorRes);  
                })
            );
        })
    );

    @Effect() // needs to have this decorator so ngrx knows this is an effect
    authLogin = this.actions$.pipe(
        // don't use subscribe to the obs - ngrx does it automatically
        // if the action is of Type x, the other actions$ wont be triggered. 
        ofType(AuthActions.LOGIN_START),
        // use a switchmap to do side effect when the action login start has been done
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
                .post<AuthResponseData>(
                "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyByKDGmZYYT1tCm9C0-YNAN3_sn0NqprEk",
                {
                    // Request payload
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }

            // return new observable of the http request - we need to catch errors just in case though
            // catcherror is not valid; if we fail and throws an error, the effect won't ever listen to the LOGIN_START 
            // action again!, so we call pipe in the INNER observable and use catcherror (if fails is ok, wont affect effect), and 
            // map to simply continue execution if not error. 
            ).pipe(
                map(resData => {
                    handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                }),
                catchError(
                errorRes => {
                    return handleError(errorRes);  
                })
            );
        })     
    );
    
    // normally the effects return an observable that needs to be dispatched. In our case we don't want it, so we set it to false
    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS,
        AuthActions.LOGOUT), 
    tap(() => {
        // use this effect to re-direct when the LOGIN action is done
        this.router.navigate(['/']);
    })
    
    )
    
}