import { Location } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { provideMockActions } from "@ngrx/effects/testing";
import { Action } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { cold, hot } from "jasmine-marbles";
import { Observable, of } from "rxjs";
import { ICartItem, Outfit } from "src/app/shared/outfit.modle";
import * as utilityFunctions from "src/app/shared/utility";
import * as fromSharedActions from "src/app/shared/store/shared.actions";
import * as authEffectsData from "./auth.effects";
import * as fromAuthActions from './auth.actions';
import { AuthService } from "../auth.service";

describe('AuthEffects',() => {
    let effects: authEffectsData.AuthEffects;
    let store: MockStore;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let actions$ = new Observable<Action>();
    let routerSpy: jasmine.SpyObj<Router>;
    let storeDispatchSpy: any;
    let locationSpy: jasmine.SpyObj<Location>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let lsSetItemSpy: any;

    beforeEach(() => {
        let mockHttpClient = jasmine.createSpyObj('HttpClient', ['get','post','delete','patch','put']);
        let mockRouter = jasmine.createSpyObj('Router',['navigate','navigateByUrl']);
        let mockLocation = jasmine.createSpyObj('Location',['back']);
        const mockAuthService = jasmine.createSpyObj('AuthService',['autoLogin','setAutoLogoutTimer']);
        TestBed.configureTestingModule({
            providers: [
                authEffectsData.AuthEffects,
                provideMockActions(() => actions$),
                provideMockStore({}),
                {provide: HttpClient, useValue: mockHttpClient},
                {provide: Router, useValue: mockRouter},
                {provide: Location, useValue: mockLocation},
                {provide: AuthService, useValue: mockAuthService}
            ]
        })
    })

    beforeEach(() => {
        effects = TestBed.inject(authEffectsData.AuthEffects);
        store = TestBed.inject(MockStore);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    })

    beforeEach(() => {
        storeDispatchSpy = spyOn(store,'dispatch');
        lsSetItemSpy = spyOn(localStorage,'setItem');
    })

    it('should be created ',() => {
        expect(effects).toBeDefined();
    })

    it('otpEffect should get the otp from the server and redirect the user',() => {
        const dummyPayload = {otpToken: 'OTP_TOKEN'};
        actions$ = of(fromAuthActions.GetOtp({payload: {name: 'name',email: 'email@email.com',password: 'password'}}));
        httpClientSpy.post.and.returnValue(of(dummyPayload));
        effects.authGetOtpEffect.subscribe();
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
        expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['auth/otp']);
        expect(lsSetItemSpy).toHaveBeenCalledTimes(1);
    })

    it('signupEffect should dispatch AuthenticationSuccess and Redirect the user',() => {
        let dummyUser = {email: 'email',userId: 'userId',_token: 'thetoken',_tokenExpirationDate: new Date()}
        actions$ = of(fromAuthActions.Signup({payload: {otpToken: 'OTP_TOKEN',  enteredOtp: 'entere'}}));
        httpClientSpy.put.and.returnValue(of(dummyUser));
        let handleAuthenticationSpy = spyOn(authEffectsData,'handleAuthentication');
        spyOn(localStorage,'removeItem');
        let result;
        effects.authSignupEffect.subscribe(d => result = d);
        let expected = (fromAuthActions.AuthenticationSuccess({payload: dummyUser}));
        expect(expected).toEqual(result);
        expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
        expect(handleAuthenticationSpy).toHaveBeenCalledTimes(1);
        expect(authServiceSpy.setAutoLogoutTimer).toHaveBeenCalledTimes(1);
    })

    it('signupEffect should dispatch AuthenticationSuccess and Redirect the user',() => {
        let dummyUser = {email: 'email',userId: 'userId',_token: 'thetoken',_tokenExpirationDate: new Date()}
        let dummyLoginData = {email: 'email',password: 'thepassword'}
        actions$ = of(fromAuthActions.Login({payload: dummyLoginData}));
        httpClientSpy.post.and.returnValue(of(dummyUser));
        let handleAuthenticationSpy = spyOn(authEffectsData,'handleAuthentication');
        let result;
        effects.authLoginEffect.subscribe(d => result = d);
        let expected = (fromAuthActions.AuthenticationSuccess({payload: dummyUser}));
        expect(expected).toEqual(result);
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: true}}));
        expect(storeDispatchSpy).toHaveBeenCalledWith(fromSharedActions.ToggleIsLoading({payload: {value: false}}));
        expect(handleAuthenticationSpy).toHaveBeenCalledTimes(1);
        expect(authServiceSpy.setAutoLogoutTimer).toHaveBeenCalledTimes(1);
    })
    
})