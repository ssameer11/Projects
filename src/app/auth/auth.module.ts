import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutes } from "./auth-routes.module";
import { AuthComponent } from "./auth.component";
import { OtpComponent } from "./otp/otp.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
    declarations: [
        AuthComponent,
        SignupComponent,
        OtpComponent
    ],
    imports: [
        SharedModule,
        FormsModule,
        AuthRoutes,
        RouterModule
    ]
})
export class AuthModule {}