import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, mergeMap, take } from "rxjs/operators";
import { AppState } from "../store/app.reducer";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private store: Store<AppState>) {}

    intercept(req: HttpRequest<any>,next: HttpHandler) {
        return this.store.select('auth').pipe(
            map(authState => {
                return authState.user;
            }),
            take(1),
            mergeMap(user => {
                if(!user) {
                    return next.handle(req);
                }

                const clonedReq = req.clone({
                    headers: req.headers.set('Authorization',`Bearer ${user.token}`)
                })
                return next.handle(clonedReq);
            })
        )
    }
}