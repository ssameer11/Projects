import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { BACKEND_URL } from "../auth/api_keys";
import { AddErrorMessage } from "../auth/store/auth.actions";
import { Outfit } from "../shared/outfit.modle";
// from "../sellers/store/customers.actions";
import { AppState } from "../store/app.reducer";
import * as fromSellersActions from "./store/sellers.actions";

@Injectable()
export class SellersService {
    filters: {[key: string]: string} = {};

    constructor(private store: Store<AppState>,private router: Router,private http: HttpClient,private route: ActivatedRoute) {
        this.route.queryParams.subscribe(qParams => {
            this.filters = {...qParams}
        })  
    }

    createOutfit(outfitData: FormData) {
        this.store.dispatch(fromSellersActions.CreateOutfit({payload: {outfitData}}));
    }

    updateOutfit(outfitData: FormData,outfitId: string) {
        this.store.dispatch(fromSellersActions.UpdateOutfit({payload: {outfitId,outfitData}}));
    }

    deleteOutfit(id: string) {
        this.store.dispatch(fromSellersActions.DeleteOutfit({payload: {id}}));
    }

    fetchOutfits(page: number,itemsPerPage: number) {
        this.store.dispatch(fromSellersActions.FetchOutfits({payload: {...this.filters,page: page,itemsPerPage: itemsPerPage}}));
    }

    getPageDataFromLS(): {page: number,itemsPerPage: number} {
        let data = {page: 1,itemsPerPage: 8};
        let lsData = localStorage.getItem('sellerPageData');
        if(lsData) {
            return JSON.parse(lsData);
        }
        return data;
    }

}