import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { SellersService } from "./sellers.service"
import * as fromSellersActions from "./store/sellers.actions";

describe('SellersService',() => {
    let service: SellersService;
    let store: MockStore;
    let routerSpy: jasmine.SpyObj<Router>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
    let dummyFilters = {filter: 'dummy'};

    beforeEach(() => {
        let mockActivatedRoute = {
            queryParams: of(dummyFilters)
        }
        let mockRouter = jasmine.createSpyObj('Router',['navigate']);
        let mockHttpClient = {
            post: jasmine.createSpy('post')
        }
        TestBed.configureTestingModule({
            providers: [SellersService,
                        provideMockStore({}),
                        {provide: ActivatedRoute, useValue: mockActivatedRoute},
                        {provide: Router, useValue: mockRouter},
                        {provide: HttpClient, useValue: mockHttpClient}]
        })
    })

    beforeEach(() => {
        service = TestBed.inject(SellersService);
        store = TestBed.inject(MockStore);
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    })

    it('should get created and initialized correctly ',() => {
        expect(service).toBeDefined();
        expect(service.filters).toEqual(dummyFilters);
    })

    it('should dispatch createOutfitAction on createOutfit Call',() => {
        let spy = spyOn(store,'dispatch');
        let outfitData = new FormData();
        service.createOutfit(outfitData);
        expect(spy).toHaveBeenCalledOnceWith(fromSellersActions.CreateOutfit({payload: {outfitData}}))
    })

    it('should dispatch updateOutfitAction on updateOutfit Call',() => {
        let spy = spyOn(store,'dispatch');
        let outfitData = new FormData();
        let outfitId = 'theOutfitId';
        service.updateOutfit(outfitData,outfitId);
        expect(spy).toHaveBeenCalledOnceWith(fromSellersActions.UpdateOutfit({payload: {outfitData,outfitId}}))
    })

    it('should dispatch deleteOutfitAction on deleteOutfit Call',() => {
        let spy = spyOn(store,'dispatch');
        let outfitId = 'theOutfitId';
        service.deleteOutfit(outfitId);
        expect(spy).toHaveBeenCalledOnceWith(fromSellersActions.DeleteOutfit({payload: {id: outfitId}}))
    })

    it('should dispatch fetchOutfitAction on fetchOutfit Call',() => {
        let spy = spyOn(store,'dispatch');
        service.fetchOutfits(1,12);
        expect(spy).toHaveBeenCalledOnceWith(fromSellersActions.FetchOutfits({payload: {...dummyFilters,page: 1,itemsPerPage: 12}}))
    })

    it('getPageDataFromLs should return an object containing page data',() => {
        expect(service.getPageDataFromLS()).toBeInstanceOf(Object);
    })
})