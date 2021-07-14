import { TestBed} from "@angular/core/testing";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Actions } from "@ngrx/effects";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { BehaviorSubject, of } from "rxjs";
import { Outfit } from "src/app/shared/outfit.modle";
import { OutfitDetailResolver } from "./outfit-detail-resolver.service";
import * as fromSharedActions from "src/app/shared/store/shared.actions";

describe('OutfitDetailResolver',() => {
    let resolver: OutfitDetailResolver;
    let actionsSpy: jasmine.SpyObj<Actions>;
    let store: MockStore;
    let storeDispatchSpy: jasmine.Spy;
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
    let mockActions = new BehaviorSubject({});

    beforeEach((() => {
        TestBed.configureTestingModule({
            providers: [{provide: OutfitDetailResolver},
                        provideMockStore({}),
                        {provide: Actions, useValue: mockActions}]
        });
    }))

    beforeEach(() => {
        resolver = TestBed.inject(OutfitDetailResolver);
        store = TestBed.inject(MockStore);
        storeDispatchSpy = spyOn(store,'dispatch');
    })

    it('should be created ',() => {
        expect(resolver).toBeDefined();
    })

    it('should resolve true if we already have the outfit we are looking for in the state ',() => {
        let mockSharedState = {selectedOutfitData: {outfit: {...outfit},fromSeller: true}};
        store.overrideSelector('shared',mockSharedState);
        let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{params: {id: outfit._id},queryParams: {fromSeller: 'true'}});
        let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let returnedValue = {};
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = d);
        expect(returnedValue).toEqual(true);
        expect(storeDispatchSpy).not.toHaveBeenCalled();
    })

    it('should update the fromSeller value of selected outfit from the store if not the same',() => {
        let mockSharedState = {selectedOutfitData: {outfit: {...outfit},fromSeller: true}};
        store.overrideSelector('shared',mockSharedState);
        let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{params: {id: outfit._id},queryParams: {fromSeller: 'false'}});
        let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let returnedValue = {};
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = d);
        expect(returnedValue).toEqual(true);
        expect(storeDispatchSpy).toHaveBeenCalledOnceWith(fromSharedActions.SetOutfit({payload: {outfit: mockSharedState.selectedOutfitData.outfit,fromSeller: false}}));
    })

    it('should dispatch the fetchoutfit action if we dont have the outfit',() => {
        let mockSharedState = {selectedOutfitData: {outfit: null,fromSeller: null}};
        store.overrideSelector('shared',mockSharedState);
        mockActions.next(fromSharedActions.SetOutfit({payload: {outfit: outfit, fromSeller: false}}));
        let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{params: {id: outfit._id},queryParams: {fromSeller: 'false'}});
        let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let returnedValue = {};
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = d);
        expect(returnedValue).toEqual(true);
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.FetchOutfit({payload: {outfitId: outfit._id, fromSeller: false}}));
    })

    it('should return a null selected outfit if we dont pass the outfitid ',() => {
        let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{params: {},queryParams: {fromSeller: 'false'}});
        let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let returnedValue = {};
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = d);
        expect(returnedValue).toEqual(true);
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.SetOutfit({payload: {outfit: null, fromSeller: false}}));
    })
})