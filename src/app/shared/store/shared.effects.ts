import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { BACKEND_URL } from "src/app/auth/api_keys";
import { AppState } from "src/app/store/app.reducer";
import { Outfit } from "../outfit.modle";
import { parseUrl } from "../utility";
import * as fromSharedActions from "./shared.actions";
@Injectable()
export class SharedEffects {
    sharedFetchOutfitEffect = createEffect(() => {
        return this.action$.pipe(
            ofType(fromSharedActions.FetchOutfit),
            mergeMap(data => {
            this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
            return this.http.get<{outfit: Outfit}>(`${BACKEND_URL}/shared/outfit/${data.payload.outfitId}`).pipe(
                map(resData => {
                    const outfit = resData.outfit;
                    this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                    return fromSharedActions.SetOutfit({payload: {outfit: {...outfit,imageUrl: parseUrl(outfit.imageUrl)},fromSeller: data.payload.fromSeller}})
                }),
                catchError(err => {
                    this.store.dispatch(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
                    this.location.back();
                    return of(fromSharedActions.AddErrorMessage(err.error.message))
                })
            )
            })
        )
    })

    constructor(private action$: Actions,private store: Store<AppState>,private http: HttpClient,private location: Location){}
}