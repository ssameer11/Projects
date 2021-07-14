import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute} from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";
import * as fromCustomersActions from './store/customers.actions';

@Injectable()
export class CustomersService {


    filters: {[key: string]: string} = {};

    constructor(private store: Store<AppState>,private route: ActivatedRoute) {
        this.route.queryParams.subscribe(qParams => {
            this.filters = {...qParams}
        }) 
    }
    fetchOutfits(page: number,itemsPerPage: number) {
        this.store.dispatch(fromCustomersActions.FetchOutfits({payload: {...this.filters,page: page,itemsPerPage: itemsPerPage}}));
    }

    addToCart(outfitId: string,count: number) {
           this.store.dispatch(fromCustomersActions.AddToCart({payload: {outfitId: outfitId,count: count}}))
    }

    updateCart(itemsToBeUpdated: {[key: string]: {updatedCount: number}}) {
        this.store.dispatch(fromCustomersActions.UpdateCart({payload: {itemsToBeUpdated}}))
    }

    removeFromCart(itemsToBeRemoved: {[key: string]: boolean}) {
        this.store.dispatch(fromCustomersActions.RemoveFromCart({payload: {id: itemsToBeRemoved}}))
    }
}