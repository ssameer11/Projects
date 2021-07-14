import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { LoginData } from "../shared/signupData.model";
import { IUser, User } from "../shared/user.model";
import { AppState } from "../store/app.reducer";
import * as fromAuthActions from "./store/auth.actions";

@Injectable()
export class AuthService {

    tokenExpirationTimeout: any;
    constructor(private store: Store<AppState>) {}

    autoLogin() {
        const userFromLocal: IUser = JSON.parse(localStorage.getItem('user'));
        if(userFromLocal) {
            const user = new User(userFromLocal.email,userFromLocal.userId,userFromLocal._token,new Date(userFromLocal._tokenExpirationDate));
            
            if(new Date(user._tokenExpirationDate) > new Date()) {
                let logoutTime = new Date(user._tokenExpirationDate).getTime() - new Date().getTime()*1000;
                this.setAutoLogoutTimer(logoutTime);
                this.store.dispatch(fromAuthActions.AuthenticationSuccess({payload: userFromLocal}))
            } else {
                localStorage.clear();
                // window.location.reload();
            }
        }
        
    }

    login(formData: LoginData) {
            this.store.dispatch(fromAuthActions.Login({payload: formData}))
    }

    logout() {
        this.clearLogoutTimer();
        this.store.dispatch(fromAuthActions.Logout());
    }

    setAutoLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimeout = setTimeout(() => {
            this.logout();
        },expirationDuration)
    }

    clearLogoutTimer() {
        if(this.tokenExpirationTimeout) {
            clearTimeout(this.tokenExpirationTimeout);
            this.tokenExpirationTimeout = null;
        }
    }
}