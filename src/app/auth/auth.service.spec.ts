import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { AuthService } from "./auth.service";
import { LoginData } from '../shared/signupData.model'
import * as fromAuthActions from "./store/auth.actions";


describe('AuthService',() => {
    let service: AuthService;
    let store: MockStore;
    let dummyFilters = {filter: 'dummy'};
    let storeDispatchSpy;
    beforeEach(() => {
        let mockActivatedRoute = {
            queryParams: of(dummyFilters)
        }
        let mockRouter = jasmine.createSpyObj('Router',['navigate']);
        let mockHttpClient = {
            post: jasmine.createSpy('post')
        }
        TestBed.configureTestingModule({
            providers: [AuthService,
                        provideMockStore({}),
                        {provide: ActivatedRoute, useValue: mockActivatedRoute},
                        {provide: Router, useValue: mockRouter},
                        {provide: HttpClient, useValue: mockHttpClient}]
        })
    })

    beforeEach(() => {
        service = TestBed.inject(AuthService);
        store = TestBed.inject(MockStore);
    })

    beforeEach(() => {
        storeDispatchSpy = spyOn(store,'dispatch');
    })

    it('should get created and initialized correctly ',() => {
        expect(service).toBeDefined();
    })

    it('should dispatch login action on login',() => {
        const dummyLoginData : LoginData  = {
            email : 'dummyEmail',
            password: 'dummyPassword'
        }
        service.login(dummyLoginData);
        expect(storeDispatchSpy).toHaveBeenCalledOnceWith(fromAuthActions.Login({payload: dummyLoginData}))
    })

    it('should dispatch logout action on logout and clear autologoutTimer',() => {
        const spy = spyOn(service,'clearLogoutTimer');
        service.logout();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledOnceWith(fromAuthActions.Logout());
    })

    it('should call logout when the autologout timer is done ',() => {
        let logoutSpy = spyOn(service,'logout');
        jasmine.clock().install();
        service.setAutoLogoutTimer(100);
        jasmine.clock().tick(101);
        expect(logoutSpy).toHaveBeenCalledTimes(1);
        jasmine.clock().uninstall();
    })

    it('clear autologout timer should clear the timer',() => {
        service.setAutoLogoutTimer(2000);
        expect(service.tokenExpirationTimeout).toBeDefined();
        service.clearLogoutTimer();
        expect(service.tokenExpirationTimeout).toBeNull();
    })

    // it('should dispatch createOutfitAction on createOutfit Call',() => {
    //     let spy = spyOn(store,'dispatch');
    //     let outfitData = new FormData();
    //     service.createOutfit(outfitData);
    //     expect(spy).toHaveBeenCalledOnceWith(fromSellersActions.CreateOutfit({payload: {outfitData}}))
    // })

    // it('should dispatch updateOutfitAction on updateOutfit Call',() => {
    //     let spy = spyOn(store,'dispatch');
    //     let outfitData = new FormData();
    //     let outfitId = 'theOutfitId';
    //     service.updateOutfit(outfitData,outfitId);
    //     expect(spy).toHaveBeenCalledOnceWith(fromSellersActions.UpdateOutfit({payload: {outfitData,outfitId}}))
    // })

    // it('should dispatch deleteOutfitAction on deleteOutfit Call',() => {
    //     let spy = spyOn(store,'dispatch');
    //     let outfitId = 'theOutfitId';
    //     service.deleteOutfit(outfitId);
    //     expect(spy).toHaveBeenCalledOnceWith(fromSellersActions.DeleteOutfit({payload: {id: outfitId}}))
    // })

    // it('should dispatch fetchOutfitAction on fetchOutfit Call',() => {
    //     let spy = spyOn(store,'dispatch');
    //     service.fetchOutfits(1,12);
    //     expect(spy).toHaveBeenCalledOnceWith(fromSellersActions.FetchOutfits({payload: {...dummyFilters,page: 1,itemsPerPage: 12}}))
    // })

    // it('getPageDataFromLs should return an object containing page data',() => {
    //     expect(service.getPageDataFromLS()).toBeInstanceOf(Object);
    // })
})

