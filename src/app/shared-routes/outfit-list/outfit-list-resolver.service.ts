import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import * as fromCustomersActions from "../../customers/store/customers.actions";
import * as fromSellersActions from "../../sellers/store/sellers.actions";
import { AppState } from "../../store/app.reducer";

@Injectable()
export class OutfitListResolver implements Resolve<boolean> {
    
    constructor(private store: Store<AppState>,private action$: Actions) {}

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        const queryParams = {...route.queryParams};
        const fromSeller = queryParams.fromSeller == 'true';
        const pageData = this.getPageData(fromSeller);
        const filterChanged = queryParams.filterChanged == 'true';
        
        delete queryParams.fromSeller;
        if(fromSeller) {
            return this.store.select('sellers').pipe(
                take(1),
                map(sellersState => {
                    return sellersState.outfits;
                }),
                switchMap(outfits => {
                    if(outfits.length !== 0 && !filterChanged) {
                        return of(true);
                    }

                    delete queryParams.fromDeletePage
                    this.store.dispatch(fromSellersActions.FetchOutfits({payload: {
                        ...queryParams,
                        ...pageData
                    }}))
                    
                    return this.action$.pipe(
                        ofType(fromSellersActions.SetOutfits),
                        take(1),
                        switchMap(() => {
                            return of(true)
                        })
                    )
                })
            )
        } else {
            return this.store.select('customers').pipe(
                take(1),
                map(customersState => {
                    return customersState.outfits;
                }),
                switchMap(outfits => {
                    if(outfits.length !== 0 && !filterChanged) {
                        return of(true);
                    } 
                    this.store.dispatch(fromCustomersActions.FetchOutfits({payload: {
                        ...queryParams,
                        ...pageData
                    }}));

                    return this.action$.pipe(
                        ofType(fromCustomersActions.SetOutfits),
                        take(1),
                        switchMap(() => {
                            return of(true)
                        })
                    )
                })
            )
        }
    }

    private getPageData(fromSeller: boolean): any {
        let data = {page: 1,itemsPerPage: 12};
        let localData;
        if(fromSeller) {
            localData = JSON.parse(localStorage.getItem('sellerPageData'))
            if(!localData) {
                localStorage.setItem('sellerPageData',JSON.stringify(data));
            } else {
                data = {...localData};
            }
        } else {
            localData = JSON.parse(localStorage.getItem('customerPageData'))
            if(!localData) {
                localStorage.setItem('customerPageData',JSON.stringify(data));
            } else {
                data = {...localData};
            }
        }
        return data;
    }
}