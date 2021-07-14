import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.reducer";
import * as fromAuthActions from '../store/auth.actions';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html',
    styleUrls: ['./otp.component.scss']
})
export class OtpComponent{
    @Input() otpValue: number=null;
    constructor(private store: Store<AppState>) {}
    onSubmit(form: NgForm) {
        if(this.otpValue.toString().length === 6) {
            const tokenData = JSON.parse(localStorage.getItem('otpToken'))
            this.store.dispatch(fromAuthActions.Signup({payload: {otpToken: tokenData,enteredOtp: form.value.otp}}))
        }
    }
}