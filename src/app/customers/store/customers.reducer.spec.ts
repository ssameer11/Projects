import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import * as customersData from "./customers.reducer";
import * as fromCustomerActions from './customers.actions';
import { ICartItem, Outfit } from "src/app/shared/outfit.modle";


describe('CustomersReducer',() => {
    let reducer = customersData.customersReducer;
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
    const customersOutfits = [{...outfit}]
    const cart: ICartItem[] = [{_id: 'cartItemId',outfit: {...outfit},count: 3}]
    it('should set the provide outfits',() => {
        const action = (fromCustomerActions.SetOutfits({outfits: customersOutfits,lastPage: 3}));
        const initialState: customersData.State = {outfits: [],lastPage: null,errorMessage: null,cart: [],isLoading: false}; 
        const result = reducer(initialState,action);
        let expected = {...initialState,outfits: customersOutfits,lastPage: 3};
        expect(result).toEqual(expected);
    })

    it('should set the provide cart',() => {
        const action = (fromCustomerActions.SetCart({payload: {cart}}));
        const initialState: customersData.State = {outfits: [],lastPage: null,errorMessage: null,cart: [],isLoading: false}; 
        const result = reducer(initialState,action);
        let expected = {...initialState,cart};
        expect(result).toEqual(expected);
    })
})