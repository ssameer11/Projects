import { createReducer, on } from "@ngrx/store";
import { User } from "src/app/shared/user.model";
import * as fromAuthActions from "./auth.actions";

export interface State {
    user: (User | null),
    errorMessage: (string | null)
}

export let initialState: State = {
    user: null,
    errorMessage: null
}

export const authReducer = createReducer(initialState,
                                        on(fromAuthActions.AuthenticationSuccess,(state,action) => {
                                            const authData = action.payload;
                                            const user = new User(authData.email,authData.userId,authData._token,authData._tokenExpirationDate);
                                            return {
                                                ...state,
                                                user: user
                                            }
                                        }),
                                        on(fromAuthActions.Logout,(state,action) => {
                                            localStorage.clear();
                                            return {
                                                ...state,
                                                user: null
                                            }
                                        })
                                        ,
                                        on(fromAuthActions.AddErrorMessage,(state,action) => {
                                            return {
                                                ...state,
                                                errorMessage: action.payload.errorMessage
                                            }
                                        })
                                        )