import { Location } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { cold, hot } from "jasmine-marbles";
import { Observable, of } from "rxjs";
// import {hot, cold } from 'jasmine-marbles';
import { ICartItem, Outfit } from "src/app/shared/outfit.modle";
import * as utilityFunctions from "src/app/shared/utility";
import * as fromCustomersActions from './customers.actions';
import { CustomersEffects } from "./customers.effects";
import * as fromSharedActions from "src/app/shared/store/shared.actions";

describe('CustomersEffects',() => {
    let effects: CustomersEffects;
    let store: MockStore;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let actions$ = new Observable<Action>();
    let routerSpy: jasmine.SpyObj<Router>;
    let storeDispatchSpy: any;
    let parseUrlSpy: any;
    
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
    const customersOutfits = [{...outfit}]
    const cart: ICartItem[] = [{_id: 'cartItemId',outfit: {...outfit},count: 3}]


    beforeEach(() => {
        let mockHttpClient = jasmine.createSpyObj('HttpClient', ['get','post','delete','patch']);
        let mockRouter = jasmine.createSpyObj('Router',['navigate','navigateByUrl']);
        TestBed.configureTestingModule({
            providers: [
                CustomersEffects,
                provideMockActions(() => actions$),
                provideMockStore({}),
                {provide: HttpClient, useValue: mockHttpClient},
                {provide: Router, useValue: mockRouter},
            ]
        })
    })

    beforeEach(() => {
        effects = TestBed.inject(CustomersEffects);
        store = TestBed.inject(MockStore);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    })

    beforeEach(() => {
        storeDispatchSpy = spyOn(store,'dispatch');
        parseUrlSpy = spyOn(utilityFunctions,'parseUrl').and.callFake(s => s);
    })

    it('should be created ',() => {
        expect(effects).toBeDefined();
    })

    it('should return setOutfits action on FetchOutfitsEffect',() => {
        const dummyPayload = {dmmy: true};
        actions$ = of(fromCustomersActions.FetchOutfits({payload: dummyPayload}));
        httpClientSpy.get.and.returnValue(of({outfits: customersOutfits, lastPage: 3}));
        let result;
        effects.customersFetchOutfitsEffect.subscribe(d => result = d);
        let expected = (fromCustomersActions.SetOutfits({outfits: (customersOutfits as any), lastPage: 3}));
        expect(expected).toEqual(result);
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
        expect(parseUrlSpy).toHaveBeenCalledTimes(1);
    })

    it('should return setCart action on FetchCartEffect',() => {
        actions$ = of(fromCustomersActions.FetchCart());
        httpClientSpy.get.and.returnValue(of({cart}));
        let result;
        effects.customersFetchCartEffect.subscribe(d => result = d);
        let expected = (fromCustomersActions.SetCart({payload: {cart}}));
        expect(expected).toEqual(result);
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
        expect(parseUrlSpy).toHaveBeenCalledTimes(1);
    })

    it('should return FetchCartAction on AddToCart',() => {
        const dummyPayload = {outfitId: 'outfitId',count: 3};
        actions$ = of(fromCustomersActions.AddToCart({payload: dummyPayload}));
        httpClientSpy.post.and.returnValue(of({}));
        let result;
        effects.customersAddToCartEffect.subscribe(d => result = d);
        let expected = (fromCustomersActions.FetchCart());
        expect(expected).toEqual(result);
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
        // expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/customers/shopping-cart');
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
    })

    it('should return FetchCartAction on UpdateCart',() => {
        const dummyPayload = {itemsToBeUpdated: {'outfitId': {updatedCount: 5}}};
        actions$ = of(fromCustomersActions.UpdateCart({payload: dummyPayload}));
        httpClientSpy.patch.and.returnValue(of({}));
        let result;
        effects.customersUpdateCartEffect.subscribe(d => result = d);
        let expected = (fromCustomersActions.FetchCart());
        expect(expected).toEqual(result);
        expect(httpClientSpy.patch).toHaveBeenCalledTimes(1);
        expect(effects.showSpinner).toBeFalse();
    })

    it('should return FetchCartAction on RemoveFromCart',() => {
        const dummyPayload = {id: {'cartItemId': true}};
        actions$ = of(fromCustomersActions.RemoveFromCart({payload: dummyPayload}));
        httpClientSpy.patch.and.returnValue(of({}));
        let result;
        effects.customersRemoveFromCartEffect.subscribe(d => result = d);
        let expected = (fromCustomersActions.FetchCart());
        expect(expected).toEqual(result);
        expect(httpClientSpy.patch).toHaveBeenCalledTimes(1);
        expect(effects.showSpinner).toBeFalse();
    })
    
})