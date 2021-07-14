import { TestBed} from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import {  Observable} from "rxjs";
import { OtpGuard } from "./otp.guard";

describe('OtpGuard',() => {
    let guard: OtpGuard;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach((() => {
        let mockRouter = jasmine.createSpyObj('Router',['navigate']);
        TestBed.configureTestingModule({
            providers: [{provide: OtpGuard},
                        {provide: Router, useValue: mockRouter}]
        });
    }))

    beforeEach(() => {
        guard = TestBed.inject(OtpGuard);
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    })

    it('should be created ',() => {
        expect(guard).toBeDefined();
    })

    it('canActivate should return true if we have token',() => {
        const spy = spyOn(localStorage,'getItem').and.returnValue(JSON.stringify({dummytoken: true}));
        const mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype);
        const mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let returnedData; 
        (guard.canActivate(mockActivatedRouteSnapshot,mockRouterStateSnapshot) as Observable<any>).subscribe(d => returnedData = d);
        expect(returnedData).toEqual(true);
    })

    it('canActivate should return a url tree if we dont have the token',() => {
        const spy = spyOn(localStorage,'getItem').and.returnValue(null);
        const mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype);
        const mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let returnedData = guard.canActivate(mockActivatedRouteSnapshot,mockRouterStateSnapshot);
        expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['']);
        expect(returnedData).toBeFalsy();
    })

})