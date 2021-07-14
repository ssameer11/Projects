import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import * as fromAppReducer from "../../store/app.reducer";
import * as fromAuthActions from '../store/auth.actions';
import {map} from 'rxjs/operators';
import { LoginData, SignupData } from "../../shared/signupData.model";
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent{
    subscription: Subscription;
    isLoginMode: boolean = false;
    constructor(private store: Store<fromAppReducer.AppState>,private authService: AuthService) {}

    onSwitchMode(event: Event) {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if(this.isLoginMode) {
            let formData: LoginData = {
                email: form.value.email,
                password: form.value.password
            }
            this.authService.login(formData);
        } else {
            let formData: SignupData = {
                name: form.value.name,
                email: form.value.email,
                password: form.value.password
            }

            this.store.dispatch(fromAuthActions.GetOtp({payload: formData}));
        }
    }
}