import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { OtpGuard } from "./otp/otp.guard";
import { OtpComponent } from "./otp/otp.component";
import { SignupComponent } from "./signup/signup.component";

const authRoutes: Routes = [
    {path: '', component: AuthComponent, children: [
        {path: '', pathMatch: 'full' , redirectTo: 'signup'},
        {path: 'signup', component: SignupComponent},
        {path: 'otp', component: OtpComponent, canActivate: [OtpGuard]}
    ]}
]
// , canActivate: [OtpGuard]
@NgModule({
    imports: [RouterModule.forChild(authRoutes)],
    exports: [RouterModule]
})
export class AuthRoutes {}