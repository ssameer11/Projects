import { TestBed} from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {  Observable} from "rxjs";
import { AuthGuard } from "./auth.guard";

describe('AuthGuard',() => {
    let guard: AuthGuard;
    let routerSpy: jasmine.SpyObj<Router>;
    let store: MockStore;
    let futureDate = new Date().setHours(new Date().getHours() + 1);
    const mockAuthState = {user: {
        token: 'dummyToken',
        _tokenExpirationDate: futureDate
    }}
    beforeEach((() => {
        let mockRouter = jasmine.createSpyObj('Router',['navigate','createUrlTree']);
        TestBed.configureTestingModule({
            providers: [{provide: AuthGuard},
                        provideMockStore({}),
                        {provide: Router, useValue: mockRouter}]
        });
    }))

    beforeEach(() => {
        guard = TestBed.inject(AuthGuard);
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        store = TestBed.inject(MockStore);
    })

    beforeEach(() => {
        store.overrideSelector('auth',mockAuthState)
    })

    it('should be created ',() => {
        expect(guard).toBeDefined();
    })

    it('canActivate should return true for homepage navigation',() => {
        const mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype);
        let currentRoute = '/shared/outfit-list?fromSeller=false';
        const mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype,{url: currentRoute});
        let returnedData;
        (guard.canActivate(mockActivatedRouteSnapshot,mockRouterStateSnapshot) as Observable<any>).subscribe(d => returnedData = d);
        expect(returnedData).toEqual(true);
    })

    it('canActivate should return true if we have a valid user',() => {
        mockAuthState.user = {
            token: 'dummyToken',
            _tokenExpirationDate: futureDate
        }
        const mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype);
        let currentRoute = 'someotherroute';
        const mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype,{url: currentRoute});
        let returnedData;
        (guard.canActivate(mockActivatedRouteSnapshot,mockRouterStateSnapshot) as Observable<any>).subscribe(d => returnedData = d);
        expect(returnedData).toEqual(true);
    })

    it('canActivate should return falsy value and navigate away  if we have a Invalid user',() => {
        mockAuthState.user = null;
        const mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype);
        let currentRoute = 'someotherroute';
        const mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype,{url: currentRoute});
        let returnedData;
        (guard.canActivate(mockActivatedRouteSnapshot,mockRouterStateSnapshot) as Observable<any>).subscribe(d => returnedData = d);
        expect(returnedData).toBeFalsy();
    })
})