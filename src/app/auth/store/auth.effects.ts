import { HttpClient } from "@angular/common/http";
import { createEffect, Actions, ofType} from "@ngrx/effects";
import { catchError, map, mergeMap } from "rxjs/operators";
import { IUser, User } from "src/app/shared/user.model";
import * as fromAuthActions from './auth.actions';
import * as fromApiKeys from '../api_keys';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { Location } from "@angular/common";
import * as fromSharedActions from "src/app/shared/store/shared.actions";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.reducer";
import { AuthService } from "../auth.service";

export const  handleAuthentication = (resData: IUser) => {
    resData = {...resData, _tokenExpirationDate: new Date(resData._tokenExpirationDate)}
    localStorage.setItem('user',JSON.stringify(resData));
}

@Injectable()
export class AuthEffects {

    authGetOtpEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromAuthActions.GetOtp),
            mergeMap(data => {
                this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                return this.http.post<{otpToken: string}>(`${fromApiKeys.BACKEND_URL}/auth/otp`,data.payload)
                .pipe(
                    map(resData => {
                        localStorage.setItem('otpToken',JSON.stringify(resData.otpToken));
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        this.router.navigate(['auth/otp']);
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        this.store.dispatch(fromSharedActions.AddErrorMessage({payload: {errorMessage: err.error.message}}));
                        return of();
                    })
                )
            })
        )
    },{dispatch: false})
    // ,{dispatch: false}
    authSignupEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromAuthActions.Signup),
            mergeMap(data => {
                this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                return this.http.put<IUser>(`${fromApiKeys.BACKEND_URL}/auth/signup`,data.payload).pipe(
                    map(resData => {
                        localStorage.removeItem('otpToken');
                        let logoutTime = new Date(resData._tokenExpirationDate).getTime() - new Date().getTime();
                        this.authService.setAutoLogoutTimer(logoutTime);
                        handleAuthentication(resData);
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        this.location.back();
                        this.location.back();

                        return fromAuthActions.AuthenticationSuccess({payload: resData})
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        this.router.navigate(['auth']);
                        return of(fromSharedActions.AddErrorMessage({payload: {errorMessage: err.error.message}}));
                    })
                )
            })
        )
    })

    authLoginEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromAuthActions.Login),
            mergeMap(data => {
                const loginData = data.payload;
                this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                return this.http.post<IUser>(`${fromApiKeys.BACKEND_URL}/auth/login`,loginData)
                .pipe(
                    map(resData => {
                        let logoutTime = new Date(resData._tokenExpirationDate).getTime() - new Date().getTime();
                        this.authService.setAutoLogoutTimer(logoutTime);
                        handleAuthentication(resData);
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        this.location.back();
                        return fromAuthActions.AuthenticationSuccess({payload: resData});
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        this.router.navigate(['auth']);
                        return of(fromSharedActions.AddErrorMessage({payload: {errorMessage: err.error.message}}))
                    })
                )
            })
        )
    })
   
    constructor(private action$: Actions,private http: HttpClient,private router: Router,private location: Location,private store: Store<AppState>,private authService: AuthService) {}
}