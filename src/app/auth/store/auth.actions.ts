import { Action } from "@ngrx/store"
import { User } from "../user.model";

export const LOGIN_START = '[Auth] LOGIN_START'
export const AUTHENTICATE_FAILED = '[Auth] LOGIN_FAILED'
export const AUTHENTICATE_SUCCESS = '[Auth] LOGIN'
export const LOGOUT = '[Auth] LOGOUT'
export const SIGNUP_START = '[Auth] SINGUP_START'
export const CLEAR_ERROR = '[Auth] CLEAR_ERROR'
export const AUTO_LOGIN = '[Auth] Auto Login'

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;
    constructor(public payload: {
        email: string, 
        userId: string, 
        token: string, 
        expirationDate: Date,
        redirect: boolean
    }){}
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
    
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;
    constructor(public payload: {email:string, password: string}) {}
}

// ---- EFFECTS ----------------------------
export class LoginStart implements Action {
    readonly type = LOGIN_START;
    
    constructor(public payload: {
        email: string, 
        password: string
    }){}
}
export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAILED;
    
    constructor(public payload: string){}
}


export type AuthActions = 
| AuthenticateSuccess
| Logout
| LoginStart
| AuthenticateFail
| AuthenticateFail
| SignupStart
| ClearError
| AutoLogin