import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Outfit } from "src/app/shared/outfit.modle";
import { Store } from "@ngrx/store";
import { switchMap, take } from "rxjs/operators";
import { AppState } from "src/app/store/app.reducer";
import { Observable, of } from "rxjs";
import * as fromSharedActions from "src/app/shared/store/shared.actions";
import { Actions, ofType } from "@ngrx/effects";
@Injectable()
export class OutfitDetailResolver implements Resolve<Observable<boolean>> {

    constructor(private store: Store<AppState>,private action$: Actions) {}

    outfitId: string;
    fromSeller: boolean;
    selectedOutfit: Outfit;

    resolve(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        // THIS IS FOR ROUTES WHERE WE HAVE TO FETCH THE PRODUCT USING THE ID ONLY 
        const qParams = {...route.queryParams}
        this.outfitId = route.params.id;
        this.fromSeller = qParams.fromSeller == 'true';
        

        if(this.outfitId) {
        return this.store.select('shared').pipe(
            take(1),
            switchMap(sharedState => {
                const selectedOutfit = sharedState.selectedOutfitData.outfit;
                if(selectedOutfit && selectedOutfit._id.toString() === this.outfitId) {
                    if(this.fromSeller !== sharedState.selectedOutfitData.fromSeller) {
                        this.store.dispatch(fromSharedActions.SetOutfit({payload: {outfit: selectedOutfit,fromSeller: this.fromSeller}}))
                    }
                    return of(true);
                }
                    this.store.dispatch(fromSharedActions.FetchOutfit({payload: {outfitId: this.outfitId,fromSeller: this.fromSeller}}));
                    return this.action$.pipe(
                        ofType(fromSharedActions.SetOutfit),
                        take(1),
                        switchMap(() => {
                            return of(true);
                        })
                    )
            })
        )
        } else {
            this.store.dispatch(fromSharedActions.SetOutfit({payload: {outfit: null, fromSeller: this.fromSeller}}));
            return of(true);
        }
    }
}



