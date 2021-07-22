import { User } from "src/app/auth/user.model";
import * as AuthActions from "./auth.actions";

export interface AppState {
    auth: State
}

export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState : State = {
    user: null,
    authError: null,
    loading: false
}

// NOTE: when you call dispatch, it will reach ALL the reducers. That's why is important to use the 'default' and return the state
// because if we call the reducer and the action is not in the current reducer called. It is important also to export all identifiers LOGIN, LOGOUT...
// to be used accross all applications
export function authReducer(state = initialState, action: AuthActions.AuthActions){
    console.log(action.type)
    switch (action.type){
        
        case AuthActions.AUTHENTICATE_SUCCESS:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate,
                );
            
            return {
                ...state,
                user : user,
                authError: null,
                loading: false

            }
        case AuthActions.LOGOUT:
            return {
                ...state,
                user : null

            };
        
        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:

            return {
                ...state,
                authError: null,
                loading: true
            };
        
        case AuthActions.AUTHENTICATE_FAILED:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            };
        
        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            }

        default:
            return state;
    }
}