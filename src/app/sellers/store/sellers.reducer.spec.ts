import { Outfit } from "src/app/shared/outfit.modle";
import * as sellersStateData from "./sellers.reducer";
import * as fromSellersActions from './sellers.actions';

describe('SellersReducer',() => {
    let reducer = sellersStateData.sellersReducer;
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
    const sellersOutfits = [{...outfit, title: 'Sellers Title'}];
    it('should set the outfits on set outfits action ',() => {
        let initialState: sellersStateData.State = {...sellersStateData.initialState};
        let action = fromSellersActions.SetOutfits({outfits: sellersOutfits,lastPage: 3});
        let result = reducer(initialState,action);
        const expected: sellersStateData.State = {...initialState,outfits: sellersOutfits,lastPage: 3};
        expect(result).toEqual(expected);
    })
})