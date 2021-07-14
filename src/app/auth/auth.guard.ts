import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map} from "rxjs/operators";
import { AppState } from "../store/app.reducer";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private store: Store<AppState>,private router: Router){}

    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):
        boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
    {        
        if(state.url.includes('/shared/outfit-list?fromSeller=false')) {
            return of(true);
        } else {
            return this.store.select('auth').pipe(
                map(authState => {
                    return authState.user;
                }),
                map(user => {
                    if((user !== null)  && (user.token) && (new Date(user._tokenExpirationDate) > new Date())) {
                        return true;
                    }
                    return this.router.createUrlTree(['/auth']);
                })
    
            )
        }
    }
}