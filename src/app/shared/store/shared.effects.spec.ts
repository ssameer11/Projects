import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { Observable, of } from "rxjs";
import { Outfit } from "src/app/shared/outfit.modle";
import * as utilityFunctions from "src/app/shared/utility";
import * as fromSharedActions from "src/app/shared/store/shared.actions";
import { SharedEffects } from "./shared.effects";

describe('SharedEffects',() => {
    let effects: SharedEffects;
    let store: MockStore;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let actions$ = new Observable<Action>();
    let storeDispatchSpy: any;
    let locationSpy: jasmine.SpyObj<Location>;
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
 

    beforeEach(() => {
        let mockHttpClient = jasmine.createSpyObj('HttpClient', ['get','post','delete','patch']);
        let mockLocation = jasmine.createSpyObj('Location',['back']);
        TestBed.configureTestingModule({
            providers: [
                SharedEffects,
                provideMockActions(() => actions$),
                provideMockStore({}),
                {provide: HttpClient, useValue: mockHttpClient},
                {provide: Location, useValue: mockLocation}
            ]
        })
    })

    beforeEach(() => {
        effects = TestBed.inject(SharedEffects);
        store = TestBed.inject(MockStore);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    })

    beforeEach(() => {
        storeDispatchSpy = spyOn(store,'dispatch');
    })

    it('should be created ',() => {
        expect(effects).toBeDefined();
    })

    it('should fetch the outfit from the server ',() => {
        actions$ = of(fromSharedActions.FetchOutfit({payload: {outfitId: 'outfitId', fromSeller: false}}));
        httpClientSpy.get.and.returnValue(of({outfit: {...outfit}}));
        spyOn(utilityFunctions,'parseUrl').and.callFake(d => d);
        let result;
        effects.sharedFetchOutfitEffect.subscribe(d => result = d);
        let expected = fromSharedActions.SetOutfit({payload: {outfit: {...outfit},fromSeller: false}});
        expect(result).toEqual(expected);
        expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
    })
})