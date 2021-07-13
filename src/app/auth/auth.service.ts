import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";
import { stringify } from "querystring";
import { User } from "./user.model";


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

    user = new Subject<User>();

    constructor(private http: HttpClient){}

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
                // it doesn't affect the flow data; with tap you can use it as a tee in linux
                // we create the user here for us:
                const user = new User
            }));
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
        .pipe(catchError(this.handleError));
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = 'An unknown error occured!'; 

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
                  // of the subscription notifying subscribers, and passing the error as the argument (in this case, errorMessage)
                  return throwError(errorMessage);
    }
}