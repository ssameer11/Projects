import { TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { CustomersService } from "./customers.service";
import * as fromCustomersActions from './store/customers.actions';

describe('CustomersService',() => {
    let service: CustomersService;
    let store: MockStore;
    let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
    let dummyFilters = {filter: 'dummy'};
    beforeEach(() => {
        let mockActivatedRoute = {
            queryParams: of(dummyFilters)
        }
        TestBed.configureTestingModule({
            providers: [
                CustomersService,
                provideMockStore({}),
                {provide: ActivatedRoute,useValue: mockActivatedRoute}
            ]
        })
    })

    beforeEach(() => {
        service = TestBed.inject(CustomersService);
        store = TestBed.inject(MockStore);
        activatedRouteSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    })

    it('should be created and initialized correctly',() => {
        expect(service).toBeDefined();
        expect(service.filters).toEqual(dummyFilters);
    })

    it('fetchOutfits should dispatch correct store action with correct parameters',() => {
        let spy = spyOn(store,'dispatch');
        service.fetchOutfits(1,10);
        expect(spy).toHaveBeenCalledOnceWith(fromCustomersActions.FetchOutfits({payload: {...dummyFilters,page: 1,itemsPerPage: 10}}))
    })

    it('addToCart should dispatch correct store action with correct parameters',() => {
        let spy = spyOn(store,'dispatch');
        service.addToCart('outfitId',2);
        expect(spy).toHaveBeenCalledOnceWith(fromCustomersActions.AddToCart({payload: {outfitId: 'outfitId',count: 2}}))
    })

    it('updateCart should dispatch correct store action with correct parameters',() => {
        let spy = spyOn(store,'dispatch');
        let itemsToBeUpdated = {'outfitId': {updatedCount: 3}}
        service.updateCart(itemsToBeUpdated);
        expect(spy).toHaveBeenCalledOnceWith(fromCustomersActions.UpdateCart({payload: {itemsToBeUpdated}}))
    })

    it('removeFromCart should dispatch correct store action with correct parameters',() => {
        let spy = spyOn(store,'dispatch');
        let itemsToBeRemoved = {'outfitId': true}
        service.removeFromCart(itemsToBeRemoved);
        expect(spy).toHaveBeenCalledOnceWith(fromCustomersActions.RemoveFromCart({payload: {id: itemsToBeRemoved}}))
    })
})