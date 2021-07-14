import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, mergeMap, take } from "rxjs/operators";
import { BACKEND_URL } from "src/app/auth/api_keys";
import { ICartItem, Outfit } from "src/app/shared/outfit.modle";
import * as fromSharedActions from "src/app/shared/store/shared.actions";
import { parseQueryParams, parseUrl } from "src/app/shared/utility";
import { AppState } from "src/app/store/app.reducer";
import * as fromCustomersActions from './customers.actions';

@Injectable()
export class CustomersEffects {
    showSpinner: boolean = true;
    customersFetchOutfitsEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromCustomersActions.FetchOutfits),
            mergeMap((data) => {
                // const params = new HttpParams({fromString: `page=${data.payload.page.toString()}&itemsPerPage=${data.payload.itemsPerPage.toString()}`});
                // params.set('page',data.payload.page.toString());
                // params.append('_page',data.payload.page.toString())
                // const params = {
                //     'page': data.payload.page.toString()
                // }
                const pObject = {};
                parseQueryParams(data.payload,pObject);
                const params = new HttpParams({fromObject: pObject});
                this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                return this.http.get<{outfits: Outfit[],lastPage: number}>(`${BACKEND_URL}/customers/outfit-list`,{params: params}).pipe(
                    map(resData => {
                        const outfits = resData.outfits.map(outfit => {
                            return {
                                ...outfit,
                                imageUrl: parseUrl(outfit.imageUrl)
                            }
                        })
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return fromCustomersActions.SetOutfits({outfits: outfits,lastPage: resData.lastPage})
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return of(fromSharedActions.AddErrorMessage({payload: {errorMessage: err.error.message}}))
                    })
                )
            })
        )
    })

    customersFetchCartEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromCustomersActions.FetchCart),
            mergeMap(() => {
                if(this.showSpinner) this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                this.showSpinner = true;
                return this.http.get<{cart: ICartItem[]}>(`${BACKEND_URL}/customers/shopping-cart`).pipe(
                    map(resData => {
                        resData.cart.map(c => {
                            return (c.outfit.imageUrl = parseUrl(c.outfit.imageUrl))
                        })
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return fromCustomersActions.SetCart({payload: {cart: resData.cart}})
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return of((fromSharedActions.AddErrorMessage({payload: {errorMessage: err.error.message}})))
                    })
                    )
                    })
        )
    })

    customersAddToCartEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromCustomersActions.AddToCart),
            mergeMap(data => {
                this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                return this.http.post(`${BACKEND_URL}/customers/outfit/add-to-cart`,data.payload).pipe(
                    map(resData => {
                        this.router.navigateByUrl('/customers/shopping-cart');
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return fromCustomersActions.FetchCart();
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return of(fromSharedActions.AddErrorMessage({payload: {errorMessage: err.error.message}}));
                    })
                )
            })
        )
    })

    customersUpdateCartEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromCustomersActions.UpdateCart),
            mergeMap(data => {
                const itemsToBeUpdated = data.payload.itemsToBeUpdated;
                return this.http.patch(`${BACKEND_URL}/customers/shopping-cart`,{itemsToBeUpdated}).pipe(
                    map(resData => {
                        this.showSpinner = false;
                        return fromCustomersActions.FetchCart();
                    })
                    ,catchError(err => {
                        return of(fromSharedActions.AddErrorMessage({payload: {errorMessage: err.error.message}}));
                    })
                )
            })
        )
    })


    customersRemoveFromCartEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromCustomersActions.RemoveFromCart),
            mergeMap(data => {
                return this.http.patch(`${BACKEND_URL}/customers/shopping-cart/delete`,data.payload).pipe(
                    take(1),
                    map(resData => {
                        this.showSpinner = false;
                        return fromCustomersActions.FetchCart();
                    }),
                    catchError(err => {
                        return of(fromSharedActions.AddErrorMessage({payload: {errorMessage: err.error.message}}));
                    })
                )
            })
        )
    })

    constructor(private action$: Actions,private http: HttpClient,private router: Router,private store: Store<AppState>) {}
}