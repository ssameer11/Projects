import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";

@Injectable()
export class OtpGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):
    boolean | UrlTree 
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree>
    {
        const otpToken = localStorage.getItem('otpToken');
        if(otpToken) {
            return of(true);
        } else {
            return this.router.navigate([''])
        }
    }
}