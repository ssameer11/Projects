import { Location } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { Observable, of } from "rxjs";
import { SellersService } from "../sellers.service";
import { SellersEffects } from "./sellers.effects"
import * as fromSellersActions from './sellers.actions';
// import {hot, cold } from 'jasmine-marbles';
import { Outfit } from "src/app/shared/outfit.modle";
import * as utilityFunctions from "src/app/shared/utility";
import * as fromSharedActions from "src/app/shared/store/shared.actions";

describe('SellersEffects',() => {
    let effects: SellersEffects;
    let store: MockStore;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let actions$ = new Observable<Action>();
    let routerSpy: jasmine.SpyObj<Router>;
    let locationSpy: jasmine.SpyObj<Location>;
    let sellersServiceSpy: jasmine.SpyObj<SellersService>;
    let storeDispatchSpy: any;
    
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
    const sellersOutfits = [{...outfit, title: 'Sellers Title'}];

    beforeEach(() => {
        let mockHttpClient = jasmine.createSpyObj('HttpClient', ['get','post','delete']);
        let mockRouter = jasmine.createSpyObj('Router',['navigate']);
        let mockLocation = jasmine.createSpyObj('Location',['back']);
        let mockSellersService = jasmine.createSpyObj('SellersService',['getPageDataFromLS']);
        TestBed.configureTestingModule({
            providers: [
                SellersEffects,
                provideMockActions(() => actions$),
                provideMockStore({}),
                {provide: HttpClient, useValue: mockHttpClient},
                {provide: Router, useValue: mockRouter},
                {provide: SellersService, useValue: mockSellersService},
                {provide: Location, useValue: mockLocation}
            ]
        })
    })

    beforeEach(() => {
        effects = TestBed.inject(SellersEffects);
        store = TestBed.inject(MockStore);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
        sellersServiceSpy = TestBed.inject(SellersService) as jasmine.SpyObj<SellersService>;
    })

    beforeEach(() => {
        storeDispatchSpy = spyOn(store,'dispatch');
    })

    it('should be created ',() => {
        expect(effects).toBeDefined();
    })

    it('should return setOutfits action on FetchOutfitsEffect',() => {
        const dummyPayload = {dmmy: true};
        actions$ = of(fromSellersActions.FetchOutfits({payload: dummyPayload}));
        httpClientSpy.get.and.returnValue(of({outfits: sellersOutfits, lastPage: 3}));
        const parseSpy = spyOn(utilityFunctions,'parseUrl').and.callFake(s => s);
        let result;
        effects.sellersFetchOutfitsEffect.subscribe(d => result = d);
        let expected = (fromSellersActions.SetOutfits({outfits: (sellersOutfits as any), lastPage: 3}));
        expect(expected).toEqual(result);
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
        expect(parseSpy).toHaveBeenCalledTimes(1);
    })

    it("should dispatch fetchOutfits action on createOutfitEffect",() => {
        actions$ = of(fromSellersActions.CreateOutfit({payload: {outfitData: new FormData()}}))
        let dummyPageData = {page: 1,itemsPerPage: 30};
        sellersServiceSpy.getPageDataFromLS.and.returnValue(dummyPageData);
        httpClientSpy.post.and.returnValue(of({outfit}));
        let result;
        effects.sellersCreateOutfitEffect.subscribe(d => result = d);
        const expected = fromSellersActions.FetchOutfits({payload: dummyPageData});
        expect(expected).toEqual(result);
        expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    })

    it("should dispatch fetchOutfits action on updateOutfitEffect",() => {
        actions$ = of(fromSellersActions.UpdateOutfit({payload: {outfitData: new FormData(),outfitId: 'outfitId'}}))
        let dummyPageData = {page: 1,itemsPerPage: 30};
        sellersServiceSpy.getPageDataFromLS.and.returnValue(dummyPageData);
        httpClientSpy.post.and.returnValue(of({outfit}));
        let result;
        effects.sellersUpdateOutfitEffect.subscribe(d => result = d);
        const expected = fromSellersActions.FetchOutfits({payload: dummyPageData});
        expect(expected).toEqual(result);
        expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    })

    it("should dispatch fetchOutfits action on deleteOutfitEffect",() => {
        actions$ = of(fromSellersActions.DeleteOutfit({payload: {id: 'outfitId'}}))
        let dummyPageData = {page: 1,itemsPerPage: 30};
        sellersServiceSpy.getPageDataFromLS.and.returnValue(dummyPageData);
        httpClientSpy.delete.and.returnValue(of({outfit}));
        let result;
        effects.sellersDeleteOutfitEffect.subscribe(d => result = d);
        const expected = fromSellersActions.FetchOutfits({payload: dummyPageData});
        expect(expected).toEqual(result);
        expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
        expect(locationSpy.back).toHaveBeenCalledTimes(1);
    })
})