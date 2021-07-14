import { TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Actions } from "@ngrx/effects";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { BehaviorSubject, of } from "rxjs";
import { map } from "rxjs/operators";
import { FetchCart } from "../store/customers.actions";
import { ShoppingCartResolver } from "./shopping-cart-resolver.service"

let stateOBject = {cart: []}
let customerStateValue = new BehaviorSubject<{cart: any[]}>({cart: []});
customerStateValue.subscribe(d => {
        stateOBject.cart = d.cart;
    });
describe('ShoppingCartResolver',() => {
    let resolver: ShoppingCartResolver;
    let actionsSpy: jasmine.SpyObj<Actions>;
    let store: MockStore;
    beforeEach((() => {
        let mockActions = of(FetchCart());
        TestBed.configureTestingModule({
            providers: [{provide: ShoppingCartResolver},
                        provideMockStore({}),
                        {provide: Actions, useValue: mockActions}]
        });
    }))

    beforeEach(() => {
        resolver = TestBed.inject(ShoppingCartResolver);
        actionsSpy = TestBed.inject(Actions) as jasmine.SpyObj<Actions>;
        store = TestBed.inject(MockStore);
    })

    beforeEach(() => {
        customerStateValue.next({cart: []});
        store.overrideSelector('customers',stateOBject);
    })
    it('should be created ',() => {
        expect(resolver).toBeDefined();
    })

    it('should resolve data if there is not data in the state',() => {
        const mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype);
        const mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        const spy = spyOn(store,'dispatch');
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe();    
        expect(spy).toHaveBeenCalledTimes(1);
    })

    it('resolve method should return true when cart is not empty ',() => {
        customerStateValue.next({cart: [{dummy: true},{bumy: false}]});
        const mockActivatedRouteSnapshot = Object.assign({},ActivatedRouteSnapshot.prototype);
        const mockRouterStateSnapshot = Object.assign({},RouterStateSnapshot.prototype);
        let resolveReturnValue: any;
        resolver.resolve(mockActivatedRouteSnapshot,mockRouterStateSnapshot).subscribe(d => resolveReturnValue = d);    
        expect(resolveReturnValue).toEqual(true);
    })
})