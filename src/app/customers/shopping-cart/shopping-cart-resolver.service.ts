import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { AppState } from "src/app/store/app.reducer";
import * as fromCustomersActions from "../store/customers.actions";

@Injectable()
export class ShoppingCartResolver implements Resolve<boolean>{

    constructor(private store: Store<AppState>,private action$: Actions) {}

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        return this.store.select('customers').pipe(
            take(1),
            map(customersState => {
               return customersState.cart ? customersState.cart : [];
            }),
            switchMap(cart => {
                if(cart.length !== 0) {
                    return of(true);
                }
                this.store.dispatch(fromCustomersActions.FetchCart());

                return this.action$.pipe(
                    ofType(fromCustomersActions.SetCart),
                    take(1),
                    switchMap(() => {
                        return of(true);
                    })
                )
            })
        )
    } 
   
}