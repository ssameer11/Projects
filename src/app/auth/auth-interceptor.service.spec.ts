import { HttpEvent, HttpEventType, HttpHandler, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { Observable, of } from "rxjs";
import { BACKEND_URL } from "./api_keys";
import { AuthInterceptor } from "./auth-interceptor.service"
describe('AuthInterceptor',() => {
    let interceptor: AuthInterceptor;
    let store: MockStore;
    let dummyToken = 'THETOKEN'
    let mockAuthState = {
        user: {token: dummyToken}
    }
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthInterceptor,
                        provideMockStore({})]
        })
    })

    beforeEach(() => {
        interceptor = TestBed.inject(AuthInterceptor);
        store = TestBed.inject(MockStore);
        mockAuthState.user = {token: dummyToken}
        store.overrideSelector('auth',mockAuthState);
    })

    it('should be created ',() => {
        expect(interceptor).toBeDefined();
    })

    it('should authorization header if we have a valid user ',() => {
        let response: HttpResponse<any>;
        const next: any = {
            handle: responseHandle => {
              response = responseHandle;
              return of({});
            }
          };
        let request: HttpRequest<any> = new HttpRequest<any>('GET',`${BACKEND_URL}/shared/outfit/60ac80b09cb5dc41f0b48c30`);
        interceptor.intercept(request,next).subscribe();
        const expectedHeader = `Bearer ${dummyToken}`;
        const theHeader = response.headers.get('Authorization');
        expect(theHeader).toEqual(expectedHeader);
    })


    it('should set falsy value for authorization header if we dont have a valid user ',() => {
        mockAuthState.user = null;
        let response: HttpResponse<any>;
        
        const next: any = {
            handle: responseHandle => {
              response = responseHandle;
              return of({});
            }
          };
        let request: HttpRequest<any> = new HttpRequest<any>('GET',`${BACKEND_URL}/shared/outfit/60ac80b09cb5dc41f0b48c30`);
        interceptor.intercept(request,next).subscribe();
        const theHeader = response.headers.get('Authorization');
        expect(theHeader).toBeFalsy();
    })
})