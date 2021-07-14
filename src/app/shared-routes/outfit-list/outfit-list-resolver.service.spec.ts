import { TestBed, waitForAsync } from "@angular/core/testing";
import { Actions } from "@ngrx/effects";
import { MockState, MockStore, provideMockStore } from "@ngrx/store/testing";
import { BehaviorSubject, of } from "rxjs";
import { Outfit } from "src/app/shared/outfit.modle";
import { OutfitListResolver} from "./outfit-list-resolver.service";
import * as fromSellersActions from "../../sellers/store/sellers.actions";
import * as fromCustomersActions from "../../customers/store/customers.actions";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
const customersOutfits = [{...outfit}]
const sellersOutfits = [{...outfit, title: 'Sellers Title'}];
describe('OutfitListResolver',() => {
    let resolver: OutfitListResolver;
    let actionsSpy: jasmine.SpyObj<Actions>;
    let store: MockStore;

    // let mockCustomerState = new BehaviorSubject({outfits: sellersOutfits});
    // let mockSellerState = new BehaviorSubject({outfits: customersOutfits});
    let sellerStateValue = {outfits: sellersOutfits};
    let customerStateValue = {outfits: customersOutfits};
    const mockActionsData = new BehaviorSubject<any>(fromSellersActions.SetOutfits);

    beforeEach((() => {
        let mockRouter = jasmine.createSpyObj('Router',['navigate']);
        let mockHttpClient = {
            post: jasmine.createSpy('post'),
            get: jasmine.createSpy('get')
        }
        let mockActions = mockActionsData;
        TestBed.configureTestingModule({
            providers: [{provide: OutfitListResolver},
                        provideMockStore({}),
                        {provide: Actions, useValue: mockActions}]
        });
    }))

    beforeEach(() => {
        resolver = TestBed.inject(OutfitListResolver);
        store = TestBed.inject(MockStore);
    })

    beforeEach(() => {
        mockActionsData.next(fromSellersActions.SetOutfits);
        sellerStateValue.outfits = sellersOutfits;
        customerStateValue.outfits = customersOutfits;
        store.overrideSelector('customers',customerStateValue);
        store.overrideSelector('sellers',sellerStateValue);
    })

    it('should be created ',() => {
        expect(resolver).toBeDefined();
    })

    it('should resolve true without dispatching any actions for seller', () => {
        let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{queryParams: {fromSeller: 'true'}});
        let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let spy = spyOn(store,'dispatch');
        let returnedValue;
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = d);
        expect(spy).not.toHaveBeenCalled();
        expect(returnedValue).toEqual(true);
    })

    it('should dispatch action to fetch sellers outfits when state is empty ',() => {
        sellerStateValue.outfits = [];
        let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{queryParams: {fromSeller: 'true'}});
        let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let spy = spyOn(store,'dispatch');
        let returnedValue;
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = d);
        expect(spy).toHaveBeenCalled();
        expect(returnedValue).toEqual(true);
    })

    it('should resolve true without dispatching any actions for customer', () => {
        let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{queryParams: {fromSeller: 'false'}});
        let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let spy = spyOn(store,'dispatch');
        let returnedValue;
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = d);
        expect(spy).not.toHaveBeenCalled();
        expect(returnedValue).toEqual(true);
    })

    it('should dispatch action to fetch customers outfits when state is empty ',() => {
        customerStateValue.outfits = [];
        mockActionsData.next(fromCustomersActions.SetOutfits);
        let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{queryParams: {fromSeller: 'false'}});
        let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let spy = spyOn(store,'dispatch');
        let returnedValue;
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = d);
        expect(spy).toHaveBeenCalled();
        expect(returnedValue).toEqual(true);
    })

    // it('should resolve the outfit of given id',() => {
    //     let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{params: {id: 'outfitId'},queryParams: {fromSeller: 'true'}});
    //     let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
    //     httpClientSpy.get.and.returnValue(of({outfit: outfits[0]}));
    //     const expectedReturnValue: {outfit: Outfit,fromSeller: boolean} = {
    //         outfit: {...outfits[0],imageUrl: parseUrl(outfits[0].imageUrl)},
    //         fromSeller: true
    //     }
    //     let returnedValue = {};
    //     resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = {...d});
    //     expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    //     expect(returnedValue).toEqual(expectedReturnValue);
    // })

    // it('resolve should return null as outfit without outfitId',() => {
    //     let mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype,{params: {},queryParams: {fromSeller: 'true'}});
    //     let mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
    //     httpClientSpy.get.and.returnValue(of({outfit: outfits[0]}));
    //     const expectedReturnValue: {outfit: Outfit,fromSeller: boolean} = {
    //         outfit: null,
    //         fromSeller: true
    //     }
    //     let returnedValue = {};
    //     resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => returnedValue = {...d});
    //     expect(returnedValue).toEqual(expectedReturnValue);
    // })
})