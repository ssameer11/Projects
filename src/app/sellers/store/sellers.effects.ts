import { Location } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, mergeMap, take } from "rxjs/operators";
import { BACKEND_URL } from "src/app/auth/api_keys";
import { Outfit } from "src/app/shared/outfit.modle";
import * as fromSharedActions from "src/app/shared/store/shared.actions";
import { parseQueryParams, parseUrl } from "src/app/shared/utility";
import { AppState } from "src/app/store/app.reducer";
import { SellersService } from "../sellers.service";
import * as fromSellersActions from './sellers.actions';

@Injectable()
export class SellersEffects {
    sellersFetchOutfitsEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromSellersActions.FetchOutfits),
            mergeMap((data) => {
                // const params = new HttpParams({fromString: `page=${data.payload.page.toString()}&itemsPerPage=${data.payload.itemsPerPage.toString()}`});
                const pObject = {};
                parseQueryParams(data.payload,pObject);
                const params = new HttpParams({fromObject: pObject});
                // params.set('page',data.payload.page.toString());
                // params.append('_page',data.payload.page.toString())
                // const params = {
                //     'page': data.payload.page.toString()
                // }
                this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                return this.http.get<{outfits: Outfit[],lastPage: number}>(`${BACKEND_URL}/sellers/outfit-list`,{params: params}).pipe(
                    map(resData => {
                        const outfits = resData.outfits.map(outfit => {
                            return {
                                ...outfit,
                                imageUrl: parseUrl(outfit.imageUrl)
                            }
                        })
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return fromSellersActions.SetOutfits({outfits: outfits,lastPage: resData.lastPage})
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return of(fromSharedActions.AddErrorMessage(err.error.message))
                    })
                )
            })
        )
    })

    sellersCreateOutfitEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromSellersActions.CreateOutfit),
            mergeMap(data => {
                this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                return this.http.post<{outfit: Outfit}>(`${BACKEND_URL}/sellers/outfit`,data.payload.outfitData).pipe(
                    take(1),
                    map(resData => {
                        this.router.navigate(['shared','outfit-detail',`${resData.outfit._id}`]);
                        let pageData: {[key: string]: any} = this.sellersService.getPageDataFromLS();
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return fromSellersActions.FetchOutfits({payload: pageData})
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return of(fromSharedActions.AddErrorMessage({payload: {
                            errorMessage: err.error.message
                        }}))
                }))
            })
        )
    })

    sellersUpdateOutfitEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromSellersActions.UpdateOutfit),
            mergeMap(data => {
                this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                return this.http.post<{outfit: Outfit}>(`${BACKEND_URL}/sellers/outfit/${data.payload.outfitId}`,data.payload.outfitData).pipe(                
                    take(1),
                    map(resData => {
                        this.router.navigate(['shared','outfit-detail',`${resData.outfit._id}`]);
                        let pageData: {[key: string]: any} = this.sellersService.getPageDataFromLS();
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return fromSellersActions.FetchOutfits({payload: pageData})
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return of(fromSharedActions.AddErrorMessage({payload: {
                            errorMessage: err.error.message
                        }}))
                }))
            })
        )
    })

    sellersDeleteOutfitEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromSellersActions.DeleteOutfit),
            mergeMap(data => {
                const id = data.payload.id;
                this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
                return this.http.delete<{outfit: Outfit,message: string}>(`${BACKEND_URL}/sellers/outfit/${id}`).pipe(
                    map(resData => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        let pageData: {[key: string]: any} = this.sellersService.getPageDataFromLS();
                        this.location.back();
                        return fromSellersActions.FetchOutfits({payload: pageData});
                    }),
                    catchError(err => {
                        this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                        return of(fromSharedActions.AddErrorMessage(err.error.message))
                    })
                )
            })
        )
    })

    constructor(private action$: Actions,private http: HttpClient,private store: Store<AppState>,private location: Location,private router: Router,private sellersService: SellersService) {}
}